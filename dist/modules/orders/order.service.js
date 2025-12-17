import prisma from '../../config/database';
import { PaymentStatus, DeliveryStatus, FulfillmentStatus } from '@prisma/client';
import { generateOrderNumber, generateTrackingNumber, parsePaginationParams, calculateDeliveryFee } from '../../utils/helpers';
import { NotFoundError, AppError } from '../../middleware/errorHandler';
import { cartService } from '../cart/cart.service';
import { emailQueue, smsQueue, pdfQueue } from '../../config/queue';
import { sendOrderConfirmationEmail } from '../notifications/email.service';
export class OrderService {
    /**
     * Create order from checkout
     */
    async checkout(data) {
        // Validate cart
        const cart = await cartService.validateCartForCheckout(data.cartId);
        // Get delivery settings
        const deliverySettingsRecord = await prisma.setting.findUnique({
            where: { key: 'delivery_settings' },
        });
        const deliverySettings = (deliverySettingsRecord?.value || {
            default_fee: 2000,
            free_delivery_threshold: 100000,
        });
        // Calculate totals
        const cartTotals = cartService.calculateCartTotals(cart);
        const deliveryFee = calculateDeliveryFee(cartTotals.subtotal, deliverySettings.default_fee, deliverySettings.free_delivery_threshold);
        const total = cartTotals.subtotal + deliveryFee;
        // Create items snapshot
        const itemsSnapshot = cart.items.map((item) => ({
            productId: item.productId,
            name: item.snapshotName,
            price: Number(item.snapshotPrice),
            quantity: item.quantity,
            imageUrl: item.product.images[0]?.url,
        }));
        // Get products with supplier info to create order items
        const productIds = cart.items.map(item => item.productId);
        const productsWithSuppliers = await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, supplierId: true, name: true, stock: true },
        });
        // Map products by ID for quick lookup
        const productMap = new Map(productsWithSuppliers.map(p => [p.id, p]));
        // Count unique suppliers
        const uniqueSuppliers = new Set(productsWithSuppliers.map(p => p.supplierId).filter(Boolean));
        // Create order in transaction
        const order = await prisma.$transaction(async (tx) => {
            // Create the order
            const newOrder = await tx.order.create({
                data: {
                    orderNumber: generateOrderNumber(),
                    customerId: data.customerId, // Link to customer if logged in
                    customerName: data.customer.name,
                    customerPhone: data.customer.phone,
                    customerEmail: data.customer.email,
                    customerAddress: data.customer.address,
                    customerCity: data.customer.city,
                    customerRegion: data.customer.region,
                    deliveryNotes: data.customer.deliveryNotes,
                    itemsSnapshot: itemsSnapshot,
                    paymentMethod: data.paymentMethod,
                    paymentStatus: PaymentStatus.PENDING,
                    deliveryStatus: DeliveryStatus.PENDING,
                    subtotal: cartTotals.subtotal,
                    deliveryFee,
                    discount: 0,
                    total,
                    currency: 'XAF',
                    notes: data.notes,
                    supplierCount: uniqueSuppliers.size || 1,
                },
            });
            // Create OrderItems for each cart item (multi-supplier support)
            for (const item of cart.items) {
                const product = productMap.get(item.productId);
                const supplierId = product?.supplierId;
                // Get supplier commission rate if supplier exists
                let commissionRate = 0;
                if (supplierId) {
                    const supplier = await tx.supplier.findUnique({
                        where: { id: supplierId },
                        select: { commissionRate: true },
                    });
                    commissionRate = supplier?.commissionRate.toNumber() || 0;
                }
                const itemTotal = Number(item.snapshotPrice) * item.quantity;
                const commission = itemTotal * (commissionRate / 100);
                await tx.orderItem.create({
                    data: {
                        orderId: newOrder.id,
                        productId: item.productId,
                        supplierId,
                        productName: item.snapshotName,
                        unitPrice: Number(item.snapshotPrice),
                        quantity: item.quantity,
                        totalPrice: itemTotal,
                        commissionRate,
                        commissionAmount: commission,
                        currency: 'XAF',
                        fulfillmentStatus: FulfillmentStatus.PENDING,
                    },
                });
            }
            // Create payment record
            await tx.payment.create({
                data: {
                    orderId: newOrder.id,
                    method: data.paymentMethod,
                    amount: total,
                    currency: 'XAF',
                    status: PaymentStatus.PENDING,
                    phoneNumber: data.momoPhoneNumber,
                },
            });
            // Create delivery record
            await tx.delivery.create({
                data: {
                    orderId: newOrder.id,
                    status: DeliveryStatus.PENDING,
                    trackingNumber: generateTrackingNumber(),
                },
            });
            // Reduce product stock
            for (const item of cart.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: { decrement: item.quantity },
                    },
                });
                // Create inventory log
                const product = productMap.get(item.productId);
                if (product) {
                    await tx.inventoryLog.create({
                        data: {
                            productId: item.productId,
                            productName: item.snapshotName,
                            previousStock: product.stock,
                            newStock: product.stock - item.quantity,
                            change: -item.quantity,
                            reason: 'SALE',
                            referenceId: newOrder.id,
                            referenceType: 'ORDER',
                        },
                    });
                }
            }
            // Clear the cart
            await tx.cartItem.deleteMany({
                where: { cart: { cartId: data.cartId } },
            });
            return newOrder;
        });
        // Queue notifications (if queues are available)
        await this.queueOrderNotifications(order.id);
        // Queue PDF generation (if queue is available)
        if (pdfQueue) {
            await pdfQueue.add('generate-invoice', {
                type: 'invoice',
                orderId: order.id,
            });
        }
        return this.getOrderById(order.id);
    }
    /**
     * Get order by ID
     */
    async getOrderById(id) {
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                payment: true,
                delivery: {
                    include: {
                        courier: true,
                    },
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                images: { where: { isPrimary: true }, take: 1 },
                            },
                        },
                        supplier: {
                            select: {
                                id: true,
                                businessName: true,
                            },
                        },
                    },
                },
            },
        });
        if (!order) {
            throw new NotFoundError('Order');
        }
        return order;
    }
    /**
     * Get order by order number
     */
    async getOrderByNumber(orderNumber) {
        const order = await prisma.order.findUnique({
            where: { orderNumber },
            include: {
                payment: true,
                delivery: {
                    include: {
                        courier: true,
                    },
                },
            },
        });
        if (!order) {
            throw new NotFoundError('Order');
        }
        return order;
    }
    /**
     * Track order (public)
     */
    async trackOrder(params) {
        const { orderNumber, phone, email } = params;
        const where = {};
        if (orderNumber) {
            where.orderNumber = orderNumber;
        }
        else if (phone) {
            where.customerPhone = { contains: phone };
        }
        else if (email) {
            where.customerEmail = email;
        }
        else {
            throw new AppError('Order number, phone, or email is required', 400);
        }
        const orders = await prisma.order.findMany({
            where,
            include: {
                delivery: {
                    select: {
                        status: true,
                        trackingNumber: true,
                        estimatedDate: true,
                        pickedUpAt: true,
                        inTransitAt: true,
                        deliveredAt: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
        });
        return orders.map((order) => ({
            orderNumber: order.orderNumber,
            status: order.paymentStatus,
            deliveryStatus: order.deliveryStatus,
            total: order.total,
            currency: order.currency,
            createdAt: order.createdAt,
            delivery: order.delivery,
            items: order.itemsSnapshot,
        }));
    }
    /**
     * Get paginated list of orders (admin)
     */
    async getOrders(params) {
        const { page, limit, skip, sortBy, sortOrder } = parsePaginationParams(params);
        const where = {};
        if (params.status) {
            where.paymentStatus = params.status;
        }
        if (params.deliveryStatus) {
            where.deliveryStatus = params.deliveryStatus;
        }
        if (params.search) {
            where.OR = [
                { orderNumber: { contains: params.search, mode: 'insensitive' } },
                { customerName: { contains: params.search, mode: 'insensitive' } },
                { customerPhone: { contains: params.search } },
                { customerEmail: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        if (params.startDate || params.endDate) {
            where.createdAt = {};
            if (params.startDate) {
                where.createdAt.gte = params.startDate;
            }
            if (params.endDate) {
                where.createdAt.lte = params.endDate;
            }
        }
        // Filter by supplier (orders containing items from this supplier)
        if (params.supplierId) {
            where.items = {
                some: {
                    supplierId: params.supplierId,
                },
            };
        }
        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    payment: true,
                    delivery: {
                        include: { courier: true },
                    },
                },
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: limit,
            }),
            prisma.order.count({ where }),
        ]);
        return { orders, total, page, limit };
    }
    /**
     * Update order status
     */
    async updateOrderStatus(id, data) {
        const order = await prisma.order.findUnique({ where: { id } });
        if (!order) {
            throw new NotFoundError('Order');
        }
        const updates = {};
        if (data.paymentStatus) {
            updates.paymentStatus = data.paymentStatus;
            // Update payment record
            await prisma.payment.update({
                where: { orderId: id },
                data: {
                    status: data.paymentStatus,
                    paidAt: data.paymentStatus === PaymentStatus.PAID ? new Date() : undefined,
                    failedAt: data.paymentStatus === PaymentStatus.FAILED ? new Date() : undefined,
                },
            });
        }
        if (data.deliveryStatus) {
            updates.deliveryStatus = data.deliveryStatus;
            // Update delivery record
            const deliveryUpdates = {
                status: data.deliveryStatus,
            };
            switch (data.deliveryStatus) {
                case DeliveryStatus.PICKED_UP:
                    deliveryUpdates.pickedUpAt = new Date();
                    break;
                case DeliveryStatus.IN_TRANSIT:
                    deliveryUpdates.inTransitAt = new Date();
                    break;
                case DeliveryStatus.DELIVERED:
                    deliveryUpdates.deliveredAt = new Date();
                    break;
            }
            await prisma.delivery.update({
                where: { orderId: id },
                data: deliveryUpdates,
            });
        }
        if (data.notes) {
            updates.notes = data.notes;
        }
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: updates,
            include: {
                payment: true,
                delivery: { include: { courier: true } },
            },
        });
        // Queue status update notification
        await this.queueStatusUpdateNotification(id);
        return updatedOrder;
    }
    /**
     * Mark order as shipped
     */
    async markAsShipped(id, data) {
        const order = await prisma.order.findUnique({
            where: { id },
            include: { delivery: true },
        });
        if (!order) {
            throw new NotFoundError('Order');
        }
        if (!order.delivery) {
            throw new AppError('Delivery record not found', 400);
        }
        // Update delivery
        await prisma.delivery.update({
            where: { orderId: id },
            data: {
                courierId: data.courierId,
                trackingNumber: data.trackingNumber || order.delivery.trackingNumber,
                estimatedDate: data.estimatedDeliveryDate,
                status: DeliveryStatus.PICKED_UP,
                assignedAt: new Date(),
                pickedUpAt: new Date(),
                notes: data.notes,
            },
        });
        // Update order
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { deliveryStatus: DeliveryStatus.PICKED_UP },
            include: {
                payment: true,
                delivery: { include: { courier: true } },
            },
        });
        // Generate delivery note (if queue is available)
        if (pdfQueue) {
            await pdfQueue.add('generate-delivery-note', {
                type: 'delivery_note',
                orderId: id,
            });
        }
        // Queue notification
        await this.queueStatusUpdateNotification(id);
        return updatedOrder;
    }
    /**
     * Generate invoice PDF
     */
    async generateInvoice(id) {
        const order = await this.getOrderById(id);
        if (pdfQueue) {
            await pdfQueue.add('generate-invoice', {
                type: 'invoice',
                orderId: id,
            });
        }
        return { message: 'Invoice generation queued', orderId: id };
    }
    /**
     * Queue order confirmation notifications
     */
    async queueOrderNotifications(orderId) {
        const order = await this.getOrderById(orderId);
        // Send email directly (doesn't require Redis)
        if (order.customerEmail) {
            try {
                await sendOrderConfirmationEmail({
                    orderNumber: order.orderNumber,
                    customerName: order.customerName,
                    customerEmail: order.customerEmail,
                    customerAddress: order.customerAddress,
                    customerCity: order.customerCity,
                    customerRegion: order.customerRegion,
                    paymentMethod: order.paymentMethod,
                    itemsSnapshot: order.itemsSnapshot,
                    subtotal: order.subtotal,
                    deliveryFee: order.deliveryFee,
                    total: order.total,
                });
            }
            catch (error) {
                // Log error but don't fail the order
                console.error('Failed to send order confirmation email:', error);
            }
        }
        // Email notification via queue (if queue is available - fallback)
        if (order.customerEmail && emailQueue) {
            await emailQueue.add('order-confirmation', {
                to: order.customerEmail,
                subject: `Order Confirmation - ${order.orderNumber}`,
                template: 'order-confirmation',
                data: {
                    orderNumber: order.orderNumber,
                    customerName: order.customerName,
                    items: order.itemsSnapshot,
                    subtotal: Number(order.subtotal),
                    deliveryFee: Number(order.deliveryFee),
                    total: Number(order.total),
                    currency: order.currency,
                },
                orderId,
            });
        }
        // SMS notification (if queue is available)
        if (smsQueue) {
            await smsQueue.add('order-confirmation', {
                to: order.customerPhone,
                message: `Your order ${order.orderNumber} has been placed successfully. Total: ${order.total} ${order.currency}. Track your order at our website.`,
                orderId,
            });
        }
    }
    /**
     * Queue status update notification
     */
    async queueStatusUpdateNotification(orderId) {
        const order = await this.getOrderById(orderId);
        const statusMessages = {
            [DeliveryStatus.PENDING]: 'is being processed',
            [DeliveryStatus.PICKED_UP]: 'has been picked up for delivery',
            [DeliveryStatus.IN_TRANSIT]: 'is on its way to you',
            [DeliveryStatus.DELIVERED]: 'has been delivered',
        };
        const message = `Your order ${order.orderNumber} ${statusMessages[order.deliveryStatus]}.`;
        // SMS notification (if queue is available)
        if (smsQueue) {
            await smsQueue.add('status-update', {
                to: order.customerPhone,
                message,
                orderId,
            });
        }
        // Email notification (if queue is available)
        if (order.customerEmail && emailQueue) {
            await emailQueue.add('status-update', {
                to: order.customerEmail,
                subject: `Order Update - ${order.orderNumber}`,
                template: 'order-status-update',
                data: {
                    orderNumber: order.orderNumber,
                    customerName: order.customerName,
                    status: order.deliveryStatus,
                    message,
                },
                orderId,
            });
        }
    }
}
export const orderService = new OrderService();
//# sourceMappingURL=order.service.js.map