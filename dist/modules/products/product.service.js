"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = exports.ProductService = void 0;
const database_1 = __importDefault(require("../../config/database"));
const helpers_1 = require("../../utils/helpers");
const errorHandler_1 = require("../../middleware/errorHandler");
class ProductService {
    /**
     * Get paginated list of products (public)
     */
    async getProducts(params) {
        const { page, limit, skip, sortBy, sortOrder } = (0, helpers_1.parsePaginationParams)(params);
        const where = {
            active: params.includeInactive ? undefined : true,
        };
        // Category filter
        if (params.category) {
            where.categories = {
                some: {
                    category: {
                        OR: [
                            { id: params.category },
                            { slug: params.category },
                        ],
                    },
                },
            };
        }
        // Price range filter
        if (params.minPrice !== undefined || params.maxPrice !== undefined) {
            where.price = {};
            if (params.minPrice !== undefined) {
                where.price.gte = params.minPrice;
            }
            if (params.maxPrice !== undefined) {
                where.price.lte = params.maxPrice;
            }
        }
        // Stock filter
        if (params.inStock !== undefined) {
            where.stock = params.inStock ? { gt: 0 } : { equals: 0 };
        }
        // Featured filter
        if (params.featured !== undefined) {
            where.featured = params.featured;
        }
        // Active filter (for admin)
        if (params.active !== undefined) {
            where.active = params.active;
        }
        // Search filter
        if (params.search) {
            where.OR = [
                { name: { contains: params.search, mode: 'insensitive' } },
                { description: { contains: params.search, mode: 'insensitive' } },
                { sku: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        const [products, total] = await Promise.all([
            database_1.default.product.findMany({
                where,
                include: {
                    categories: {
                        include: {
                            category: {
                                select: { id: true, name: true, slug: true },
                            },
                        },
                    },
                    images: {
                        orderBy: { sortOrder: 'asc' },
                    },
                    specifications: {
                        orderBy: { sortOrder: 'asc' },
                    },
                    deliveryZones: {
                        orderBy: { zoneName: 'asc' },
                    },
                },
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: limit,
            }),
            database_1.default.product.count({ where }),
        ]);
        return { products, total, page, limit };
    }
    /**
     * Get single product by ID or slug
     */
    async getProductByIdOrSlug(idOrSlug) {
        const product = await database_1.default.product.findFirst({
            where: {
                OR: [{ id: idOrSlug }, { slug: idOrSlug }],
                active: true,
            },
            include: {
                categories: {
                    include: {
                        category: {
                            select: { id: true, name: true, slug: true },
                        },
                    },
                },
                images: {
                    orderBy: { sortOrder: 'asc' },
                },
                specifications: {
                    orderBy: [{ group: 'asc' }, { sortOrder: 'asc' }],
                },
                deliveryZones: {
                    where: { available: true },
                    orderBy: { zoneName: 'asc' },
                },
            },
        });
        if (!product) {
            throw new errorHandler_1.NotFoundError('Product');
        }
        return product;
    }
    /**
     * Get product by ID (admin - includes inactive)
     */
    async getProductById(id) {
        const product = await database_1.default.product.findUnique({
            where: { id },
            include: {
                categories: {
                    include: {
                        category: true,
                    },
                },
                images: {
                    orderBy: { sortOrder: 'asc' },
                },
                specifications: {
                    orderBy: [{ group: 'asc' }, { sortOrder: 'asc' }],
                },
                deliveryZones: {
                    orderBy: { zoneName: 'asc' },
                },
            },
        });
        if (!product) {
            throw new errorHandler_1.NotFoundError('Product');
        }
        return product;
    }
    /**
     * Create a new product
     */
    async createProduct(data) {
        const slug = data.slug || (0, helpers_1.slugify)(data.name);
        // Check if slug exists
        const existingProduct = await database_1.default.product.findUnique({
            where: { slug },
        });
        if (existingProduct) {
            throw new Error('A product with this slug already exists');
        }
        const product = await database_1.default.product.create({
            data: {
                name: data.name,
                slug,
                description: data.description,
                price: data.price,
                currency: data.currency || 'XAF',
                comparePrice: data.comparePrice,
                sku: data.sku,
                stock: data.stock || 0,
                lowStockThreshold: data.lowStockThreshold || 5,
                active: data.active ?? true,
                featured: data.featured ?? false,
                supplierId: data.supplierId || null,
                // Pre-order settings
                isPreorder: data.isPreorder ?? false,
                preorderNote: data.preorderNote,
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
                deliveryZones: data.deliveryZones?.length
                    ? {
                        create: data.deliveryZones.map((zone) => ({
                            zoneName: zone.zoneName,
                            zoneType: zone.zoneType || 'city',
                            region: zone.region,
                            minDays: zone.minDays,
                            maxDays: zone.maxDays,
                            deliveryFee: zone.deliveryFee,
                            available: zone.available ?? true,
                            notes: zone.notes,
                        })),
                    }
                    : undefined,
            },
            include: {
                categories: {
                    include: { category: true },
                },
                images: true,
                specifications: true,
                deliveryZones: true,
            },
        });
        return product;
    }
    /**
     * Update a product
     */
    async updateProduct(id, data) {
        const existingProduct = await database_1.default.product.findUnique({
            where: { id },
        });
        if (!existingProduct) {
            throw new errorHandler_1.NotFoundError('Product');
        }
        // Handle slug update
        let slug = data.slug;
        if (data.name && !data.slug) {
            slug = (0, helpers_1.slugify)(data.name);
        }
        if (slug && slug !== existingProduct.slug) {
            const slugExists = await database_1.default.product.findFirst({
                where: { slug, NOT: { id } },
            });
            if (slugExists) {
                throw new Error('A product with this slug already exists');
            }
        }
        // Update product in a transaction with extended timeout for complex updates
        const product = await database_1.default.$transaction(async (tx) => {
            // Update categories if provided
            if (data.categoryIds !== undefined) {
                await tx.productCategory.deleteMany({ where: { productId: id } });
                if (data.categoryIds.length > 0) {
                    await tx.productCategory.createMany({
                        data: data.categoryIds.map((categoryId, index) => ({
                            productId: id,
                            categoryId,
                            sortOrder: index,
                        })),
                    });
                }
            }
            // Update images if provided
            if (data.images !== undefined) {
                await tx.productImage.deleteMany({ where: { productId: id } });
                if (data.images.length > 0) {
                    await tx.productImage.createMany({
                        data: data.images.map((image, index) => ({
                            productId: id,
                            url: image.url,
                            publicId: image.publicId,
                            alt: image.alt,
                            sortOrder: image.sortOrder ?? index,
                            isPrimary: image.isPrimary ?? index === 0,
                        })),
                    });
                }
            }
            // Update specifications if provided
            if (data.specifications !== undefined) {
                await tx.productSpecification.deleteMany({ where: { productId: id } });
                if (data.specifications.length > 0) {
                    await tx.productSpecification.createMany({
                        data: data.specifications.map((spec, index) => ({
                            productId: id,
                            key: spec.key,
                            value: spec.value,
                            group: spec.group,
                            sortOrder: spec.sortOrder ?? index,
                        })),
                    });
                }
            }
            // Update delivery zones if provided
            if (data.deliveryZones !== undefined) {
                await tx.productDeliveryZone.deleteMany({ where: { productId: id } });
                if (data.deliveryZones.length > 0) {
                    await tx.productDeliveryZone.createMany({
                        data: data.deliveryZones.map((zone) => ({
                            productId: id,
                            zoneName: zone.zoneName,
                            zoneType: zone.zoneType || 'city',
                            region: zone.region,
                            minDays: zone.minDays,
                            maxDays: zone.maxDays,
                            deliveryFee: zone.deliveryFee,
                            available: zone.available ?? true,
                            notes: zone.notes,
                        })),
                    });
                }
            }
            // Update the product itself
            return tx.product.update({
                where: { id },
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
                    featured: data.featured,
                    ...(data.supplierId !== undefined && { supplierId: data.supplierId }),
                    ...(data.isPreorder !== undefined && { isPreorder: data.isPreorder }),
                    ...(data.preorderNote !== undefined && { preorderNote: data.preorderNote }),
                },
                include: {
                    categories: {
                        include: { category: true },
                    },
                    images: true,
                    specifications: true,
                    deliveryZones: true,
                },
            });
        }, {
            timeout: 30000, // 30 seconds timeout for complex product updates
        });
        return product;
    }
    /**
     * Delete a product
     */
    async deleteProduct(id) {
        const product = await database_1.default.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new errorHandler_1.NotFoundError('Product');
        }
        await database_1.default.product.delete({ where: { id } });
        return { success: true };
    }
    /**
     * Update product stock
     */
    async updateStock(id, stock, reason = 'MANUAL', referenceId) {
        const product = await database_1.default.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new errorHandler_1.NotFoundError('Product');
        }
        const previousStock = product.stock;
        const [updatedProduct] = await database_1.default.$transaction([
            database_1.default.product.update({
                where: { id },
                data: { stock },
            }),
            database_1.default.inventoryLog.create({
                data: {
                    productId: id,
                    productName: product.name,
                    previousStock,
                    newStock: stock,
                    change: stock - previousStock,
                    reason,
                    referenceId,
                    referenceType: reason === 'SALE' ? 'ORDER' : 'MANUAL',
                },
            }),
        ]);
        return updatedProduct;
    }
    /**
     * Bulk update stock
     */
    async bulkUpdateStock(updates) {
        const results = await database_1.default.$transaction(updates.map((update) => database_1.default.product.update({
            where: { id: update.productId },
            data: { stock: update.stock },
        })));
        return results;
    }
    /**
     * Get featured products
     */
    async getFeaturedProducts(limit = 8) {
        return database_1.default.product.findMany({
            where: { active: true, featured: true },
            include: {
                images: {
                    where: { isPrimary: true },
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
            take: limit,
        });
    }
    /**
     * Get low stock products
     */
    async getLowStockProducts() {
        return database_1.default.product.findMany({
            where: {
                active: true,
                stock: { lte: database_1.default.product.fields.lowStockThreshold },
            },
            orderBy: { stock: 'asc' },
        });
    }
    /**
     * Get inventory logs
     */
    async getInventoryLogs(params) {
        const { page, limit, skip } = (0, helpers_1.parsePaginationParams)(params);
        const where = {};
        if (params.productId) {
            where.productId = params.productId;
        }
        if (params.reason) {
            where.reason = params.reason;
        }
        const [logs, total] = await Promise.all([
            database_1.default.inventoryLog.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            database_1.default.inventoryLog.count({ where }),
        ]);
        return { logs, total, page, limit };
    }
}
exports.ProductService = ProductService;
exports.productService = new ProductService();
//# sourceMappingURL=product.service.js.map