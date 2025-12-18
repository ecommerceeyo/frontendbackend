"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierService = exports.SupplierService = void 0;
const database_1 = __importDefault(require("../../config/database"));
const helpers_1 = require("../../utils/helpers");
const errorHandler_1 = require("../../middleware/errorHandler");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class SupplierService {
    /**
     * Get paginated list of suppliers (public - only ACTIVE)
     */
    async getSuppliers(params) {
        const { page, limit, skip, sortBy, sortOrder } = (0, helpers_1.parsePaginationParams)(params);
        const where = {
            status: 'ACTIVE',
            verified: true,
        };
        // Search filter
        if (params.search) {
            where.OR = [
                { name: { contains: params.search, mode: 'insensitive' } },
                { description: { contains: params.search, mode: 'insensitive' } },
                { businessName: { contains: params.search, mode: 'insensitive' } },
                { city: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        const [suppliers, total] = await Promise.all([
            database_1.default.supplier.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    description: true,
                    logo: true,
                    banner: true,
                    city: true,
                    region: true,
                    verified: true,
                    _count: {
                        select: { products: { where: { active: true } } },
                    },
                },
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: limit,
            }),
            database_1.default.supplier.count({ where }),
        ]);
        return { suppliers, total, page, limit };
    }
    /**
     * Get all suppliers (admin - includes all statuses)
     */
    async getAllSuppliers(params) {
        const { page, limit, skip, sortBy, sortOrder } = (0, helpers_1.parsePaginationParams)(params);
        const where = {};
        // Status filter
        if (params.status) {
            where.status = params.status;
        }
        // Verified filter
        if (params.verified !== undefined) {
            where.verified = params.verified;
        }
        // Search filter
        if (params.search) {
            where.OR = [
                { name: { contains: params.search, mode: 'insensitive' } },
                { email: { contains: params.search, mode: 'insensitive' } },
                { phone: { contains: params.search, mode: 'insensitive' } },
                { businessName: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        const [suppliers, total] = await Promise.all([
            database_1.default.supplier.findMany({
                where,
                include: {
                    _count: {
                        select: {
                            products: true,
                            orderItems: true,
                            admins: true,
                        },
                    },
                },
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: limit,
            }),
            database_1.default.supplier.count({ where }),
        ]);
        return { suppliers, total, page, limit };
    }
    /**
     * Get supplier by ID or slug (public - only ACTIVE)
     */
    async getSupplierByIdOrSlug(idOrSlug) {
        const supplier = await database_1.default.supplier.findFirst({
            where: {
                OR: [{ id: idOrSlug }, { slug: idOrSlug }],
                status: 'ACTIVE',
            },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                logo: true,
                banner: true,
                city: true,
                region: true,
                verified: true,
                createdAt: true,
                _count: {
                    select: { products: { where: { active: true } } },
                },
            },
        });
        if (!supplier) {
            throw new errorHandler_1.NotFoundError('Supplier');
        }
        return supplier;
    }
    /**
     * Get supplier by ID (admin)
     */
    async getSupplierById(id) {
        const supplier = await database_1.default.supplier.findUnique({
            where: { id },
            include: {
                admins: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        phone: true,
                        role: true,
                        active: true,
                        lastLoginAt: true,
                        createdAt: true,
                    },
                },
                _count: {
                    select: {
                        products: true,
                        orderItems: true,
                        payouts: true,
                    },
                },
            },
        });
        if (!supplier) {
            throw new errorHandler_1.NotFoundError('Supplier');
        }
        return supplier;
    }
    /**
     * Create a new supplier
     */
    async createSupplier(data) {
        const slug = (0, helpers_1.slugify)(data.name);
        // Check if slug or email exists
        const existing = await database_1.default.supplier.findFirst({
            where: {
                OR: [{ slug }, { email: data.email }],
            },
        });
        if (existing) {
            if (existing.email === data.email) {
                throw new errorHandler_1.AppError('A supplier with this email already exists', 409);
            }
            throw new errorHandler_1.AppError('A supplier with this name already exists', 409);
        }
        const supplier = await database_1.default.supplier.create({
            data: {
                name: data.name,
                slug,
                email: data.email,
                phone: data.phone,
                whatsapp: data.whatsapp,
                description: data.description,
                businessName: data.businessName,
                businessAddress: data.businessAddress,
                city: data.city,
                region: data.region,
                taxId: data.taxId,
                logo: data.logo,
                banner: data.banner,
                bankName: data.bankName,
                bankAccountNumber: data.bankAccountNumber,
                bankAccountName: data.bankAccountName,
                momoNumber: data.momoNumber,
                momoProvider: data.momoProvider,
                commissionRate: data.commissionRate ?? 10,
                status: 'PENDING',
            },
        });
        return supplier;
    }
    /**
     * Update supplier
     */
    async updateSupplier(id, data) {
        const existing = await database_1.default.supplier.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new errorHandler_1.NotFoundError('Supplier');
        }
        // Handle slug update if name changes
        let slug = existing.slug;
        if (data.name && data.name !== existing.name) {
            slug = (0, helpers_1.slugify)(data.name);
            const slugExists = await database_1.default.supplier.findFirst({
                where: { slug, NOT: { id } },
            });
            if (slugExists) {
                throw new errorHandler_1.AppError('A supplier with this name already exists', 409);
            }
        }
        // Check email uniqueness
        if (data.email && data.email !== existing.email) {
            const emailExists = await database_1.default.supplier.findFirst({
                where: { email: data.email, NOT: { id } },
            });
            if (emailExists) {
                throw new errorHandler_1.AppError('A supplier with this email already exists', 409);
            }
        }
        const supplier = await database_1.default.supplier.update({
            where: { id },
            data: {
                ...data,
                slug,
            },
        });
        return supplier;
    }
    /**
     * Update supplier status (admin)
     */
    async updateSupplierStatus(id, status) {
        const supplier = await database_1.default.supplier.findUnique({
            where: { id },
        });
        if (!supplier) {
            throw new errorHandler_1.NotFoundError('Supplier');
        }
        const updatedSupplier = await database_1.default.supplier.update({
            where: { id },
            data: {
                status,
                verified: status === 'ACTIVE' ? true : supplier.verified,
                verifiedAt: status === 'ACTIVE' && !supplier.verifiedAt ? new Date() : supplier.verifiedAt,
            },
        });
        return updatedSupplier;
    }
    /**
     * Update supplier commission rate (admin)
     */
    async updateSupplierCommission(id, commissionRate) {
        const supplier = await database_1.default.supplier.findUnique({
            where: { id },
        });
        if (!supplier) {
            throw new errorHandler_1.NotFoundError('Supplier');
        }
        if (commissionRate < 0 || commissionRate > 100) {
            throw new errorHandler_1.AppError('Commission rate must be between 0 and 100', 400);
        }
        const updatedSupplier = await database_1.default.supplier.update({
            where: { id },
            data: { commissionRate },
        });
        return updatedSupplier;
    }
    /**
     * Get supplier's products
     */
    async getSupplierProducts(supplierId, params) {
        const { page, limit, skip } = (0, helpers_1.parsePaginationParams)(params);
        const where = {
            supplierId,
            active: params.active ?? true,
        };
        const [products, total] = await Promise.all([
            database_1.default.product.findMany({
                where,
                include: {
                    images: {
                        orderBy: { sortOrder: 'asc' },
                        take: 1,
                    },
                    categories: {
                        include: {
                            category: {
                                select: { id: true, name: true, slug: true },
                            },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            database_1.default.product.count({ where }),
        ]);
        return { products, total, page, limit };
    }
    /**
     * Get supplier stats for dashboard
     */
    async getSupplierStats(supplierId) {
        const [totalProducts, activeProducts, totalOrders, pendingOrders, deliveredOrders, totalRevenue, pendingPayouts,] = await Promise.all([
            database_1.default.product.count({ where: { supplierId } }),
            database_1.default.product.count({ where: { supplierId, active: true } }),
            database_1.default.orderItem.count({ where: { supplierId } }),
            database_1.default.orderItem.count({ where: { supplierId, fulfillmentStatus: 'PENDING' } }),
            database_1.default.orderItem.count({ where: { supplierId, fulfillmentStatus: 'DELIVERED' } }),
            database_1.default.orderItem.aggregate({
                where: { supplierId, fulfillmentStatus: 'DELIVERED' },
                _sum: { totalPrice: true },
            }),
            database_1.default.supplierPayout.aggregate({
                where: { supplierId, status: 'PENDING' },
                _sum: { netAmount: true },
            }),
        ]);
        return {
            totalProducts,
            activeProducts,
            totalOrders,
            pendingOrders,
            deliveredOrders,
            totalRevenue: totalRevenue._sum.totalPrice || 0,
            pendingPayouts: pendingPayouts._sum.netAmount || 0,
        };
    }
    // ============================================
    // SUPPLIER USER MANAGEMENT (Admin)
    // ============================================
    /**
     * Get supplier users/admins
     */
    async getSupplierUsers(supplierId) {
        const supplier = await database_1.default.supplier.findUnique({
            where: { id: supplierId },
            select: { maxUsers: true },
        });
        if (!supplier) {
            throw new errorHandler_1.NotFoundError('Supplier');
        }
        const users = await database_1.default.supplierAdmin.findMany({
            where: { supplierId },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                permissions: true,
                active: true,
                lastLoginAt: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'asc' },
        });
        return {
            users,
            maxUsers: supplier.maxUsers,
            currentCount: users.length,
        };
    }
    /**
     * Create supplier user (admin only)
     */
    async createSupplierUser(supplierId, data) {
        const supplier = await database_1.default.supplier.findUnique({
            where: { id: supplierId },
            select: {
                id: true,
                maxUsers: true,
                _count: { select: { admins: true } },
            },
        });
        if (!supplier) {
            throw new errorHandler_1.NotFoundError('Supplier');
        }
        // Check max users limit
        if (supplier._count.admins >= supplier.maxUsers) {
            throw new errorHandler_1.AppError(`Maximum users limit (${supplier.maxUsers}) reached for this supplier`, 400);
        }
        // Check if email exists
        const existingUser = await database_1.default.supplierAdmin.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new errorHandler_1.AppError('A user with this email already exists', 409);
        }
        // Hash password
        const passwordHash = await bcryptjs_1.default.hash(data.password, 10);
        const user = await database_1.default.supplierAdmin.create({
            data: {
                supplierId,
                email: data.email,
                name: data.name,
                passwordHash,
                phone: data.phone,
                role: data.role,
            },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                active: true,
                createdAt: true,
            },
        });
        return user;
    }
    /**
     * Update supplier user
     */
    async updateSupplierUser(supplierId, userId, data) {
        const user = await database_1.default.supplierAdmin.findFirst({
            where: { id: userId, supplierId },
        });
        if (!user) {
            throw new errorHandler_1.NotFoundError('Supplier user');
        }
        const updatedUser = await database_1.default.supplierAdmin.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                permissions: true,
                active: true,
                createdAt: true,
            },
        });
        return updatedUser;
    }
    /**
     * Update supplier user permissions (admin only)
     */
    async updateSupplierUserPermissions(supplierId, userId, permissions) {
        const user = await database_1.default.supplierAdmin.findFirst({
            where: { id: userId, supplierId },
        });
        if (!user) {
            throw new errorHandler_1.NotFoundError('Supplier user');
        }
        // OWNERs always have full permissions, can't override
        if (user.role === 'OWNER') {
            throw new errorHandler_1.AppError('Cannot customize permissions for OWNER role', 400);
        }
        const updatedUser = await database_1.default.supplierAdmin.update({
            where: { id: userId },
            data: { permissions },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                permissions: true,
                active: true,
                createdAt: true,
            },
        });
        return updatedUser;
    }
    /**
     * Delete supplier user
     */
    async deleteSupplierUser(supplierId, userId) {
        const user = await database_1.default.supplierAdmin.findFirst({
            where: { id: userId, supplierId },
        });
        if (!user) {
            throw new errorHandler_1.NotFoundError('Supplier user');
        }
        // Don't allow deleting the last OWNER
        if (user.role === 'OWNER') {
            const ownerCount = await database_1.default.supplierAdmin.count({
                where: { supplierId, role: 'OWNER' },
            });
            if (ownerCount <= 1) {
                throw new errorHandler_1.AppError('Cannot delete the last owner of the supplier', 400);
            }
        }
        await database_1.default.supplierAdmin.delete({
            where: { id: userId },
        });
        return { success: true };
    }
    /**
     * Update max users for supplier
     */
    async updateSupplierMaxUsers(supplierId, maxUsers) {
        if (maxUsers < 1 || maxUsers > 50) {
            throw new errorHandler_1.AppError('Max users must be between 1 and 50', 400);
        }
        const supplier = await database_1.default.supplier.findUnique({
            where: { id: supplierId },
            include: { _count: { select: { admins: true } } },
        });
        if (!supplier) {
            throw new errorHandler_1.NotFoundError('Supplier');
        }
        if (maxUsers < supplier._count.admins) {
            throw new errorHandler_1.AppError(`Cannot set max users below current user count (${supplier._count.admins})`, 400);
        }
        const updated = await database_1.default.supplier.update({
            where: { id: supplierId },
            data: { maxUsers },
        });
        return updated;
    }
    /**
     * Update max products for supplier
     */
    async updateSupplierMaxProducts(supplierId, maxProducts) {
        if (maxProducts < 1 || maxProducts > 10000) {
            throw new errorHandler_1.AppError('Max products must be between 1 and 10000', 400);
        }
        const supplier = await database_1.default.supplier.findUnique({
            where: { id: supplierId },
            include: { _count: { select: { products: true } } },
        });
        if (!supplier) {
            throw new errorHandler_1.NotFoundError('Supplier');
        }
        if (maxProducts < supplier._count.products) {
            throw new errorHandler_1.AppError(`Cannot set max products below current product count (${supplier._count.products})`, 400);
        }
        const updated = await database_1.default.supplier.update({
            where: { id: supplierId },
            data: { maxProducts },
        });
        return updated;
    }
    /**
     * Get supplier product limits info
     */
    async getSupplierProductLimits(supplierId) {
        const supplier = await database_1.default.supplier.findUnique({
            where: { id: supplierId },
            select: { maxProducts: true },
        });
        if (!supplier) {
            throw new errorHandler_1.NotFoundError('Supplier');
        }
        const productCount = await database_1.default.product.count({
            where: { supplierId },
        });
        return {
            maxProducts: supplier.maxProducts,
            currentCount: productCount,
            canAddMore: productCount < supplier.maxProducts,
            remaining: supplier.maxProducts - productCount,
        };
    }
    // ============================================
    // SUPPLIER PRODUCT MANAGEMENT (Admin)
    // ============================================
    /**
     * Get all products for a supplier (admin)
     */
    async getSupplierProductsAdmin(supplierId, params) {
        const { page, limit, skip } = (0, helpers_1.parsePaginationParams)(params);
        const where = { supplierId };
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
            database_1.default.product.findMany({
                where,
                include: {
                    images: {
                        orderBy: { sortOrder: 'asc' },
                        take: 1,
                    },
                    categories: {
                        include: {
                            category: { select: { id: true, name: true, slug: true } },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            database_1.default.product.count({ where }),
        ]);
        return { products, total, page, limit };
    }
    /**
     * Toggle product active status for a supplier
     */
    async toggleSupplierProductStatus(supplierId, productId, active) {
        const product = await database_1.default.product.findFirst({
            where: { id: productId, supplierId },
        });
        if (!product) {
            throw new errorHandler_1.NotFoundError('Product');
        }
        const updated = await database_1.default.product.update({
            where: { id: productId },
            data: { active },
        });
        return updated;
    }
    /**
     * Bulk toggle products for a supplier
     */
    async bulkToggleSupplierProducts(supplierId, productIds, active) {
        const result = await database_1.default.product.updateMany({
            where: {
                id: { in: productIds },
                supplierId,
            },
            data: { active },
        });
        return { updated: result.count };
    }
    // ============================================
    // SUPPLIER ORDER MANAGEMENT (Admin)
    // ============================================
    /**
     * Get orders for a supplier (admin)
     */
    async getSupplierOrders(supplierId, params) {
        const { page, limit, skip } = (0, helpers_1.parsePaginationParams)(params);
        const where = { supplierId };
        if (params.fulfillmentStatus) {
            where.fulfillmentStatus = params.fulfillmentStatus;
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
            database_1.default.orderItem.findMany({
                where,
                include: {
                    order: {
                        select: {
                            id: true,
                            orderNumber: true,
                            customerName: true,
                            customerPhone: true,
                            customerAddress: true,
                            customerCity: true,
                            paymentStatus: true,
                            deliveryStatus: true,
                            createdAt: true,
                        },
                    },
                    product: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            database_1.default.orderItem.count({ where }),
        ]);
        return { orderItems, total, page, limit };
    }
    /**
     * Get supplier order stats
     */
    async getSupplierOrderStats(supplierId) {
        const [pending, confirmed, processing, shipped, delivered, cancelled] = await Promise.all([
            database_1.default.orderItem.count({ where: { supplierId, fulfillmentStatus: 'PENDING' } }),
            database_1.default.orderItem.count({ where: { supplierId, fulfillmentStatus: 'CONFIRMED' } }),
            database_1.default.orderItem.count({ where: { supplierId, fulfillmentStatus: 'PROCESSING' } }),
            database_1.default.orderItem.count({ where: { supplierId, fulfillmentStatus: 'SHIPPED' } }),
            database_1.default.orderItem.count({ where: { supplierId, fulfillmentStatus: 'DELIVERED' } }),
            database_1.default.orderItem.count({ where: { supplierId, fulfillmentStatus: 'CANCELLED' } }),
        ]);
        return { pending, confirmed, processing, shipped, delivered, cancelled };
    }
    /**
     * Update order item fulfillment status (admin)
     */
    async updateOrderItemFulfillment(supplierId, orderItemId, data) {
        const orderItem = await database_1.default.orderItem.findFirst({
            where: { id: orderItemId, supplierId },
        });
        if (!orderItem) {
            throw new errorHandler_1.NotFoundError('Order item');
        }
        const updateData = {
            fulfillmentStatus: data.fulfillmentStatus,
        };
        if (data.trackingNumber) {
            updateData.trackingNumber = data.trackingNumber;
        }
        if (data.notes) {
            updateData.notes = data.notes;
        }
        // Set timestamps based on status
        if (data.fulfillmentStatus === 'CONFIRMED') {
            updateData.fulfilledAt = new Date();
        }
        else if (data.fulfillmentStatus === 'SHIPPED') {
            updateData.shippedAt = new Date();
        }
        else if (data.fulfillmentStatus === 'DELIVERED') {
            updateData.deliveredAt = new Date();
        }
        const updated = await database_1.default.orderItem.update({
            where: { id: orderItemId },
            data: updateData,
        });
        return updated;
    }
}
exports.SupplierService = SupplierService;
exports.supplierService = new SupplierService();
//# sourceMappingURL=supplier.service.js.map