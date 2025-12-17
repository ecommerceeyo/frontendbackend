import { PaymentMethod, PaymentStatus, DeliveryStatus, Prisma } from '@prisma/client';
export interface CheckoutData {
    cartId: string;
    customerId?: string;
    customer: {
        name: string;
        phone: string;
        email?: string;
        address: string;
        city: string;
        region?: string;
        deliveryNotes?: string;
    };
    paymentMethod: PaymentMethod;
    momoPhoneNumber?: string;
    notes?: string;
}
export interface OrderListParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: PaymentStatus;
    deliveryStatus?: DeliveryStatus;
    search?: string;
    startDate?: Date;
    endDate?: Date;
    supplierId?: string;
}
export declare class OrderService {
    /**
     * Create order from checkout
     */
    checkout(data: CheckoutData): Promise<{
        payment: {
            currency: string;
            createdAt: Date;
            id: string;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            provider: import(".prisma/client").$Enums.MobileMoneyProvider | null;
            phoneNumber: string | null;
            amount: Prisma.Decimal;
            transactionId: string | null;
            failedReason: string | null;
            method: import(".prisma/client").$Enums.PaymentMethod;
            providerReference: string | null;
            paidAt: Date | null;
            failedAt: Date | null;
            webhookPayload: Prisma.JsonValue | null;
        };
        delivery: {
            courier: {
                createdAt: Date;
                name: string;
                id: string;
                email: string | null;
                active: boolean;
                updatedAt: Date;
                phone: string;
            };
        } & {
            createdAt: Date;
            id: string;
            updatedAt: Date;
            notes: string | null;
            status: import(".prisma/client").$Enums.DeliveryStatus;
            courierId: string | null;
            trackingNumber: string | null;
            signature: string | null;
            deliveryProof: string | null;
            orderId: string;
            estimatedDate: Date | null;
            assignedAt: Date | null;
            pickedUpAt: Date | null;
            inTransitAt: Date | null;
            deliveredAt: Date | null;
        };
        items: ({
            supplier: {
                id: string;
                businessName: string;
            };
            product: {
                images: {
                    createdAt: Date;
                    sortOrder: number;
                    id: string;
                    productId: string;
                    url: string;
                    publicId: string;
                    alt: string | null;
                    isPrimary: boolean;
                }[];
                name: string;
                id: string;
            };
        } & {
            productImage: string | null;
            currency: string;
            createdAt: Date;
            id: string;
            updatedAt: Date;
            supplierId: string | null;
            productId: string;
            notes: string | null;
            commissionRate: Prisma.Decimal;
            productName: string;
            quantity: number;
            trackingNumber: string | null;
            orderId: string;
            deliveredAt: Date | null;
            productSku: string | null;
            unitPrice: Prisma.Decimal;
            totalPrice: Prisma.Decimal;
            commissionAmount: Prisma.Decimal;
            fulfillmentStatus: import(".prisma/client").$Enums.FulfillmentStatus;
            fulfilledAt: Date | null;
            shippedAt: Date | null;
        })[];
    } & {
        customerAddress: string;
        currency: string;
        createdAt: Date;
        id: string;
        updatedAt: Date;
        deliveryFee: Prisma.Decimal;
        notes: string | null;
        total: Prisma.Decimal;
        deliveryNotes: string | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        deliveryStatus: import(".prisma/client").$Enums.DeliveryStatus;
        orderNumber: string;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        customerId: string | null;
        subtotal: Prisma.Decimal;
        customerName: string;
        customerEmail: string | null;
        customerPhone: string;
        customerCity: string;
        customerRegion: string | null;
        itemsSnapshot: Prisma.JsonValue;
        discount: Prisma.Decimal;
        invoiceUrl: string | null;
        deliveryNoteUrl: string | null;
        supplierCount: number;
    }>;
    /**
     * Get order by ID
     */
    getOrderById(id: string): Promise<{
        payment: {
            currency: string;
            createdAt: Date;
            id: string;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            provider: import(".prisma/client").$Enums.MobileMoneyProvider | null;
            phoneNumber: string | null;
            amount: Prisma.Decimal;
            transactionId: string | null;
            failedReason: string | null;
            method: import(".prisma/client").$Enums.PaymentMethod;
            providerReference: string | null;
            paidAt: Date | null;
            failedAt: Date | null;
            webhookPayload: Prisma.JsonValue | null;
        };
        delivery: {
            courier: {
                createdAt: Date;
                name: string;
                id: string;
                email: string | null;
                active: boolean;
                updatedAt: Date;
                phone: string;
            };
        } & {
            createdAt: Date;
            id: string;
            updatedAt: Date;
            notes: string | null;
            status: import(".prisma/client").$Enums.DeliveryStatus;
            courierId: string | null;
            trackingNumber: string | null;
            signature: string | null;
            deliveryProof: string | null;
            orderId: string;
            estimatedDate: Date | null;
            assignedAt: Date | null;
            pickedUpAt: Date | null;
            inTransitAt: Date | null;
            deliveredAt: Date | null;
        };
        items: ({
            supplier: {
                id: string;
                businessName: string;
            };
            product: {
                images: {
                    createdAt: Date;
                    sortOrder: number;
                    id: string;
                    productId: string;
                    url: string;
                    publicId: string;
                    alt: string | null;
                    isPrimary: boolean;
                }[];
                name: string;
                id: string;
            };
        } & {
            productImage: string | null;
            currency: string;
            createdAt: Date;
            id: string;
            updatedAt: Date;
            supplierId: string | null;
            productId: string;
            notes: string | null;
            commissionRate: Prisma.Decimal;
            productName: string;
            quantity: number;
            trackingNumber: string | null;
            orderId: string;
            deliveredAt: Date | null;
            productSku: string | null;
            unitPrice: Prisma.Decimal;
            totalPrice: Prisma.Decimal;
            commissionAmount: Prisma.Decimal;
            fulfillmentStatus: import(".prisma/client").$Enums.FulfillmentStatus;
            fulfilledAt: Date | null;
            shippedAt: Date | null;
        })[];
    } & {
        customerAddress: string;
        currency: string;
        createdAt: Date;
        id: string;
        updatedAt: Date;
        deliveryFee: Prisma.Decimal;
        notes: string | null;
        total: Prisma.Decimal;
        deliveryNotes: string | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        deliveryStatus: import(".prisma/client").$Enums.DeliveryStatus;
        orderNumber: string;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        customerId: string | null;
        subtotal: Prisma.Decimal;
        customerName: string;
        customerEmail: string | null;
        customerPhone: string;
        customerCity: string;
        customerRegion: string | null;
        itemsSnapshot: Prisma.JsonValue;
        discount: Prisma.Decimal;
        invoiceUrl: string | null;
        deliveryNoteUrl: string | null;
        supplierCount: number;
    }>;
    /**
     * Get order by order number
     */
    getOrderByNumber(orderNumber: string): Promise<{
        payment: {
            currency: string;
            createdAt: Date;
            id: string;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            provider: import(".prisma/client").$Enums.MobileMoneyProvider | null;
            phoneNumber: string | null;
            amount: Prisma.Decimal;
            transactionId: string | null;
            failedReason: string | null;
            method: import(".prisma/client").$Enums.PaymentMethod;
            providerReference: string | null;
            paidAt: Date | null;
            failedAt: Date | null;
            webhookPayload: Prisma.JsonValue | null;
        };
        delivery: {
            courier: {
                createdAt: Date;
                name: string;
                id: string;
                email: string | null;
                active: boolean;
                updatedAt: Date;
                phone: string;
            };
        } & {
            createdAt: Date;
            id: string;
            updatedAt: Date;
            notes: string | null;
            status: import(".prisma/client").$Enums.DeliveryStatus;
            courierId: string | null;
            trackingNumber: string | null;
            signature: string | null;
            deliveryProof: string | null;
            orderId: string;
            estimatedDate: Date | null;
            assignedAt: Date | null;
            pickedUpAt: Date | null;
            inTransitAt: Date | null;
            deliveredAt: Date | null;
        };
    } & {
        customerAddress: string;
        currency: string;
        createdAt: Date;
        id: string;
        updatedAt: Date;
        deliveryFee: Prisma.Decimal;
        notes: string | null;
        total: Prisma.Decimal;
        deliveryNotes: string | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        deliveryStatus: import(".prisma/client").$Enums.DeliveryStatus;
        orderNumber: string;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        customerId: string | null;
        subtotal: Prisma.Decimal;
        customerName: string;
        customerEmail: string | null;
        customerPhone: string;
        customerCity: string;
        customerRegion: string | null;
        itemsSnapshot: Prisma.JsonValue;
        discount: Prisma.Decimal;
        invoiceUrl: string | null;
        deliveryNoteUrl: string | null;
        supplierCount: number;
    }>;
    /**
     * Track order (public)
     */
    trackOrder(params: {
        orderNumber?: string;
        phone?: string;
        email?: string;
    }): Promise<{
        orderNumber: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        deliveryStatus: import(".prisma/client").$Enums.DeliveryStatus;
        total: Prisma.Decimal;
        currency: string;
        createdAt: Date;
        delivery: {
            status: import(".prisma/client").$Enums.DeliveryStatus;
            trackingNumber: string;
            estimatedDate: Date;
            pickedUpAt: Date;
            inTransitAt: Date;
            deliveredAt: Date;
        };
        items: Prisma.JsonValue;
    }[]>;
    /**
     * Get paginated list of orders (admin)
     */
    getOrders(params: OrderListParams): Promise<{
        orders: ({
            payment: {
                currency: string;
                createdAt: Date;
                id: string;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.PaymentStatus;
                orderId: string;
                provider: import(".prisma/client").$Enums.MobileMoneyProvider | null;
                phoneNumber: string | null;
                amount: Prisma.Decimal;
                transactionId: string | null;
                failedReason: string | null;
                method: import(".prisma/client").$Enums.PaymentMethod;
                providerReference: string | null;
                paidAt: Date | null;
                failedAt: Date | null;
                webhookPayload: Prisma.JsonValue | null;
            };
            delivery: {
                courier: {
                    createdAt: Date;
                    name: string;
                    id: string;
                    email: string | null;
                    active: boolean;
                    updatedAt: Date;
                    phone: string;
                };
            } & {
                createdAt: Date;
                id: string;
                updatedAt: Date;
                notes: string | null;
                status: import(".prisma/client").$Enums.DeliveryStatus;
                courierId: string | null;
                trackingNumber: string | null;
                signature: string | null;
                deliveryProof: string | null;
                orderId: string;
                estimatedDate: Date | null;
                assignedAt: Date | null;
                pickedUpAt: Date | null;
                inTransitAt: Date | null;
                deliveredAt: Date | null;
            };
        } & {
            customerAddress: string;
            currency: string;
            createdAt: Date;
            id: string;
            updatedAt: Date;
            deliveryFee: Prisma.Decimal;
            notes: string | null;
            total: Prisma.Decimal;
            deliveryNotes: string | null;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            deliveryStatus: import(".prisma/client").$Enums.DeliveryStatus;
            orderNumber: string;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            customerId: string | null;
            subtotal: Prisma.Decimal;
            customerName: string;
            customerEmail: string | null;
            customerPhone: string;
            customerCity: string;
            customerRegion: string | null;
            itemsSnapshot: Prisma.JsonValue;
            discount: Prisma.Decimal;
            invoiceUrl: string | null;
            deliveryNoteUrl: string | null;
            supplierCount: number;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    /**
     * Update order status
     */
    updateOrderStatus(id: string, data: {
        paymentStatus?: PaymentStatus;
        deliveryStatus?: DeliveryStatus;
        notes?: string;
    }): Promise<{
        payment: {
            currency: string;
            createdAt: Date;
            id: string;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            provider: import(".prisma/client").$Enums.MobileMoneyProvider | null;
            phoneNumber: string | null;
            amount: Prisma.Decimal;
            transactionId: string | null;
            failedReason: string | null;
            method: import(".prisma/client").$Enums.PaymentMethod;
            providerReference: string | null;
            paidAt: Date | null;
            failedAt: Date | null;
            webhookPayload: Prisma.JsonValue | null;
        };
        delivery: {
            courier: {
                createdAt: Date;
                name: string;
                id: string;
                email: string | null;
                active: boolean;
                updatedAt: Date;
                phone: string;
            };
        } & {
            createdAt: Date;
            id: string;
            updatedAt: Date;
            notes: string | null;
            status: import(".prisma/client").$Enums.DeliveryStatus;
            courierId: string | null;
            trackingNumber: string | null;
            signature: string | null;
            deliveryProof: string | null;
            orderId: string;
            estimatedDate: Date | null;
            assignedAt: Date | null;
            pickedUpAt: Date | null;
            inTransitAt: Date | null;
            deliveredAt: Date | null;
        };
    } & {
        customerAddress: string;
        currency: string;
        createdAt: Date;
        id: string;
        updatedAt: Date;
        deliveryFee: Prisma.Decimal;
        notes: string | null;
        total: Prisma.Decimal;
        deliveryNotes: string | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        deliveryStatus: import(".prisma/client").$Enums.DeliveryStatus;
        orderNumber: string;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        customerId: string | null;
        subtotal: Prisma.Decimal;
        customerName: string;
        customerEmail: string | null;
        customerPhone: string;
        customerCity: string;
        customerRegion: string | null;
        itemsSnapshot: Prisma.JsonValue;
        discount: Prisma.Decimal;
        invoiceUrl: string | null;
        deliveryNoteUrl: string | null;
        supplierCount: number;
    }>;
    /**
     * Mark order as shipped
     */
    markAsShipped(id: string, data: {
        courierId?: string;
        trackingNumber?: string;
        estimatedDeliveryDate?: Date;
        notes?: string;
    }): Promise<{
        payment: {
            currency: string;
            createdAt: Date;
            id: string;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            provider: import(".prisma/client").$Enums.MobileMoneyProvider | null;
            phoneNumber: string | null;
            amount: Prisma.Decimal;
            transactionId: string | null;
            failedReason: string | null;
            method: import(".prisma/client").$Enums.PaymentMethod;
            providerReference: string | null;
            paidAt: Date | null;
            failedAt: Date | null;
            webhookPayload: Prisma.JsonValue | null;
        };
        delivery: {
            courier: {
                createdAt: Date;
                name: string;
                id: string;
                email: string | null;
                active: boolean;
                updatedAt: Date;
                phone: string;
            };
        } & {
            createdAt: Date;
            id: string;
            updatedAt: Date;
            notes: string | null;
            status: import(".prisma/client").$Enums.DeliveryStatus;
            courierId: string | null;
            trackingNumber: string | null;
            signature: string | null;
            deliveryProof: string | null;
            orderId: string;
            estimatedDate: Date | null;
            assignedAt: Date | null;
            pickedUpAt: Date | null;
            inTransitAt: Date | null;
            deliveredAt: Date | null;
        };
    } & {
        customerAddress: string;
        currency: string;
        createdAt: Date;
        id: string;
        updatedAt: Date;
        deliveryFee: Prisma.Decimal;
        notes: string | null;
        total: Prisma.Decimal;
        deliveryNotes: string | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        deliveryStatus: import(".prisma/client").$Enums.DeliveryStatus;
        orderNumber: string;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        customerId: string | null;
        subtotal: Prisma.Decimal;
        customerName: string;
        customerEmail: string | null;
        customerPhone: string;
        customerCity: string;
        customerRegion: string | null;
        itemsSnapshot: Prisma.JsonValue;
        discount: Prisma.Decimal;
        invoiceUrl: string | null;
        deliveryNoteUrl: string | null;
        supplierCount: number;
    }>;
    /**
     * Generate invoice PDF
     */
    generateInvoice(id: string): Promise<{
        message: string;
        orderId: string;
    }>;
    /**
     * Queue order confirmation notifications
     */
    private queueOrderNotifications;
    /**
     * Queue status update notification
     */
    private queueStatusUpdateNotification;
}
export declare const orderService: OrderService;
//# sourceMappingURL=order.service.d.ts.map