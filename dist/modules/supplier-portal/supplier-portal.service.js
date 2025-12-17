import prisma from '../../config/database';
import { slugify, parsePaginationParams } from '../../utils/helpers';
import { NotFoundError } from '../../middleware/errorHandler';
export class SupplierPortalService {
    /**
     * Get supplier dashboard stats
     */
    async getDashboardStats(supplierId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        const [totalProducts, activeProducts, lowStockProducts, preorderProducts, todayOrders, pendingOrders, preorderPendingOrders, monthlyRevenue, lastMonthRevenue, recentOrders, preorderProductsList,] = await Promise.all([
            prisma.product.count({ where: { supplierId } }),
            prisma.product.count({ where: { supplierId, active: true } }),
            prisma.product.count({
                where: {
                    supplierId,
                    active: true,
                    stock: { lte: prisma.product.fields.lowStockThreshold },
                },
            }),
            prisma.product.count({
                where: {
                    supplierId,
                    isPreorder: true,
                    active: true,
                },
            }),
            prisma.orderItem.count({
                where: {
                    supplierId,
                    createdAt: { gte: today },
                },
            }),
            prisma.orderItem.count({
                where: {
                    supplierId,
                    fulfillmentStatus: 'PENDING',
                },
            }),
            prisma.orderItem.count({
                where: {
                    supplierId,
                    fulfillmentStatus: 'PENDING',
                    product: { isPreorder: true },
                },
            }),
            prisma.orderItem.aggregate({
                where: {
                    supplierId,
                    createdAt: { gte: thisMonth },
                },
                _sum: { totalPrice: true },
            }),
            prisma.orderItem.aggregate({
                where: {
                    supplierId,
                    createdAt: {
                        gte: lastMonth,
                        lte: lastMonthEnd,
                    },
                },
                _sum: { totalPrice: true },
            }),
            prisma.orderItem.findMany({
                where: { supplierId },
                include: {
                    order: {
                        select: {
                            orderNumber: true,
                            customerName: true,
                            customerAddress: true,
                        },
                    },
                    product: {
                        select: { name: true, isPreorder: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
                take: 5,
            }),
            // Get pre-order products with pending order counts
            prisma.product.findMany({
                where: {
                    supplierId,
                    isPreorder: true,
                    active: true,
                },
                select: {
                    id: true,
                    name: true,
                    orderItems: {
                        select: {
                            id: true,
                            quantity: true,
                            fulfillmentStatus: true,
                        },
                    },
                },
                take: 5,
            }),
        ]);
        const currentRevenue = monthlyRevenue._sum.totalPrice?.toNumber() || 0;
        const previousRevenue = lastMonthRevenue._sum.totalPrice?.toNumber() || 0;
        const revenueChange = previousRevenue > 0
            ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
            : 0;
        // Format recent orders to include isPreorder flag
        const formattedRecentOrders = recentOrders.map((order) => ({
            ...order,
            productName: order.product?.name || 'Unknown Product',
            isPreorder: order.product?.isPreorder || false,
        }));
        // Format preorder products with stats
        const formattedPreorderProducts = preorderProductsList.map((product) => {
            const pendingOrders = product.orderItems.filter((item) => item.fulfillmentStatus === 'PENDING').length;
            const totalOrdered = product.orderItems.reduce((sum, item) => sum + item.quantity, 0);
            return {
                id: product.id,
                name: product.name,
                pendingOrders,
                totalOrdered,
            };
        });
        return {
            products: {
                total: totalProducts,
                active: activeProducts,
                lowStock: lowStockProducts,
                preorder: preorderProducts,
            },
            orders: {
                today: todayOrders,
                pending: pendingOrders,
                preorderPending: preorderPendingOrders,
            },
            revenue: {
                thisMonth: currentRevenue,
                lastMonth: previousRevenue,
                change: Math.round(revenueChange * 100) / 100,
            },
            recentOrders: formattedRecentOrders,
            preorderProducts: formattedPreorderProducts,
        };
    }
    /**
     * Get supplier's products
     */
    async getProducts(supplierId, params) {
        const { page, limit, skip, sortBy, sortOrder } = parsePaginationParams(params);
        const where = {
            supplierId,
        };
        if (params.active !== undefined) {
            where.active = params.active;
        }
        if (params.search) {
            where.OR = [
                { name: { contains: params.search, mode: 'insensitive' } },
                { sku: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    categories: {
                        include: { category: { select: { id: true, name: true } } },
                    },
                    images: { orderBy: { sortOrder: 'asc' } },
                },
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: limit,
            }),
            prisma.product.count({ where }),
        ]);
        return { products, total, page, limit };
    }
    /**
     * Get single product
     */
    async getProduct(supplierId, productId) {
        const product = await prisma.product.findFirst({
            where: { id: productId, supplierId },
            include: {
                categories: {
                    include: { category: true },
                },
                images: { orderBy: { sortOrder: 'asc' } },
                specifications: { orderBy: [{ group: 'asc' }, { sortOrder: 'asc' }] },
                deliveryZones: { orderBy: { zoneName: 'asc' } },
            },
        });
        if (!product) {
            throw new NotFoundError('Product');
        }
        return product;
    }
    /**
     * Create a product for supplier
     */
    async createProduct(supplierId, data) {
        const slug = data.slug || slugify(data.name);
        const existingProduct = await prisma.product.findUnique({
            where: { slug },
        });
        if (existingProduct) {
            throw new Error('A product with this slug already exists');
        }
        const product = await prisma.product.create({
            data: {
                supplierId,
                name: data.name,
                slug,
                description: data.description,
                price: data.price,
                currency: data.currency || 'XAF',
                comparePrice: data.comparePrice,
                sku: data.sku,
                stock: data.stock || 0,
                lowStockThreshold: data.lowStockThreshold || 5,
                active: data.active ?? false, // Supplier products default to inactive until approved
                categories: data.categoryIds?.length
                    ? {
                        create: data.categoryIds.map((categoryId, index) => ({
                            categoryId,
                            sortOrder: index,
                        })),
                    }
                    : undefined,
                images: data.images?.length
                    ? {
                        create: data.images.map((image, index) => ({
                            url: image.url,
                            publicId: image.publicId,
                            alt: image.alt,
                            sortOrder: image.sortOrder ?? index,
                            isPrimary: image.isPrimary ?? index === 0,
                        })),
                    }
                    : undefined,
                specifications: data.specifications?.length
                    ? {
                        create: data.specifications.map((spec, index) => ({
                            key: spec.key,
                            value: spec.value,
                            group: spec.group,
                            sortOrder: spec.sortOrder ?? index,
                        })),
                    }
                    : undefined,
            },
            include: {
                categories: { include: { category: true } },
                images: true,
                specifications: true,
            },
        });
        return product;
    }
    /**
     * Update supplier's product
     */
    async updateProduct(supplierId, productId, data) {
        const existingProduct = await prisma.product.findFirst({
            where: { id: productId, supplierId },
        });
        if (!existingProduct) {
            throw new NotFoundError('Product');
        }
        let slug = data.slug;
        if (data.name && !data.slug) {
            slug = slugify(data.name);
        }
        if (slug && slug !== existingProduct.slug) {
            const slugExists = await prisma.product.findFirst({
                where: { slug, NOT: { id: productId } },
            });
            if (slugExists) {
                throw new Error('A product with this slug already exists');
            }
        }
        const product = await prisma.$transaction(async (tx) => {
            if (data.categoryIds !== undefined) {
                await tx.productCategory.deleteMany({ where: { productId } });
                if (data.categoryIds.length > 0) {
                    await tx.productCategory.createMany({
                        data: data.categoryIds.map((categoryId, index) => ({
                            productId,
                            categoryId,
                            sortOrder: index,
                        })),
                    });
                }
            }
            if (data.images !== undefined) {
                await tx.productImage.deleteMany({ where: { productId } });
                if (data.images.length > 0) {
                    await tx.productImage.createMany({
                        data: data.images.map((image, index) => ({
                            productId,
                            url: image.url,
                            publicId: image.publicId,
                            alt: image.alt,
                            sortOrder: image.sortOrder ?? index,
                            isPrimary: image.isPrimary ?? index === 0,
                        })),
                    });
                }
            }
            if (data.specifications !== undefined) {
                await tx.productSpecification.deleteMany({ where: { productId } });
                if (data.specifications.length > 0) {
                    await tx.productSpecification.createMany({
                        data: data.specifications.map((spec, index) => ({
                            productId,
                            key: spec.key,
                            value: spec.value,
                            group: spec.group,
                            sortOrder: spec.sortOrder ?? index,
                        })),
                    });
                }
            }
            return tx.product.update({
                where: { id: productId },
                data: {
                    name: data.name,
                    slug,
                    description: data.description,
                    price: data.price,
                    currency: data.currency,
                    comparePrice: data.comparePrice,
                    sku: data.sku,
                    stock: data.stock,
                    lowStockThreshold: data.lowStockThreshold,
                    active: data.active,
                },
                include: {
                    categories: { include: { category: true } },
                    images: true,
                    specifications: true,
                },
            });
        });
        return product;
    }
    /**
     * Delete supplier's product
     */
    async deleteProduct(supplierId, productId) {
        const product = await prisma.product.findFirst({
            where: { id: productId, supplierId },
        });
        if (!product) {
            throw new NotFoundError('Product');
        }
        await prisma.product.delete({ where: { id: productId } });
        return { success: true };
    }
    /**
     * Get supplier's orders (order items)
     */
    async getOrders(supplierId, params) {
        const { page, limit, skip } = parsePaginationParams(params);
        const where = {
            supplierId,
        };
        if (params.status) {
            where.fulfillmentStatus = params.status;
        }
        if (params.search) {
            where.order = {
                OR: [
                    { orderNumber: { contains: params.search, mode: 'insensitive' } },
                    { customerName: { contains: params.search, mode: 'insensitive' } },
                ],
            };
        }
        const [orderItems, total] = await Promise.all([
            prisma.orderItem.findMany({
                where,
                include: {
                    order: {
                        select: {
                            id: true,
                            orderNumber: true,
                            customerName: true,
                            customerPhone: true,
                            customerAddress: true,
                            deliveryNotes: true,
                            createdAt: true,
                        },
                    },
                    product: {
                        select: {
                            id: true,
                            name: true,
                            images: { where: { isPrimary: true }, take: 1 },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.orderItem.count({ where }),
        ]);
        return { orderItems, total, page, limit };
    }
    /**
     * Get single order item
     */
    async getOrderItem(supplierId, orderItemId) {
        const orderItem = await prisma.orderItem.findFirst({
            where: { id: orderItemId, supplierId },
            include: {
                order: true,
                product: {
                    include: {
                        images: { where: { isPrimary: true }, take: 1 },
                    },
                },
            },
        });
        if (!orderItem) {
            throw new NotFoundError('Order item');
        }
        return orderItem;
    }
    /**
     * Update fulfillment status
     */
    async updateFulfillmentStatus(supplierId, orderItemId, status, trackingNumber) {
        const orderItem = await prisma.orderItem.findFirst({
            where: { id: orderItemId, supplierId },
        });
        if (!orderItem) {
            throw new NotFoundError('Order item');
        }
        const updates = {
            fulfillmentStatus: status,
        };
        if (trackingNumber) {
            updates.trackingNumber = trackingNumber;
        }
        if (status === 'SHIPPED') {
            updates.shippedAt = new Date();
        }
        else if (status === 'DELIVERED') {
            updates.deliveredAt = new Date();
        }
        const updatedItem = await prisma.orderItem.update({
            where: { id: orderItemId },
            data: updates,
            include: {
                order: {
                    select: { orderNumber: true },
                },
            },
        });
        return updatedItem;
    }
    /**
     * Get supplier's payouts
     */
    async getPayouts(supplierId, params) {
        const { page, limit, skip } = parsePaginationParams(params);
        const where = {
            supplierId,
        };
        const [payouts, total] = await Promise.all([
            prisma.supplierPayout.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.supplierPayout.count({ where }),
        ]);
        return { payouts, total, page, limit };
    }
    /**
     * Update supplier profile
     */
    async updateProfile(supplierId, data) {
        const supplier = await prisma.supplier.update({
            where: { id: supplierId },
            data,
        });
        return supplier;
    }
    /**
     * Get supplier profile
     */
    async getProfile(supplierId) {
        const supplier = await prisma.supplier.findUnique({
            where: { id: supplierId },
            include: {
                _count: {
                    select: {
                        products: true,
                        admins: true,
                    },
                },
            },
        });
        if (!supplier) {
            throw new NotFoundError('Supplier');
        }
        return supplier;
    }
}
export const supplierPortalService = new SupplierPortalService();
//# sourceMappingURL=supplier-portal.service.js.map