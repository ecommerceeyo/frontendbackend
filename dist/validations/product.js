"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSpecificationSchema = exports.addSpecificationSchema = exports.bulkUpdateStockSchema = exports.adminProductListQuerySchema = exports.productListQuerySchema = exports.updateProductSchema = exports.createProductSchema = exports.productImageSchema = exports.productSpecificationSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("./common");
// Product specification schema
exports.productSpecificationSchema = zod_1.z.object({
    key: zod_1.z.string().min(1, 'Specification key is required'),
    value: zod_1.z.string().min(1, 'Specification value is required'),
    group: zod_1.z.string().optional(),
    sortOrder: zod_1.z.number().int().default(0),
});
// Product image schema
exports.productImageSchema = zod_1.z.object({
    url: zod_1.z.string().url('Invalid image URL'),
    publicId: zod_1.z.string().min(1, 'Public ID is required'),
    alt: zod_1.z.string().optional(),
    sortOrder: zod_1.z.number().int().default(0),
    isPrimary: zod_1.z.boolean().default(false),
});
// Create product schema
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(255),
    slug: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    price: common_1.priceSchema,
    currency: common_1.currencySchema,
    comparePrice: common_1.priceSchema.optional(),
    sku: zod_1.z.string().optional(),
    stock: zod_1.z.coerce.number().int().min(0).default(0),
    lowStockThreshold: zod_1.z.coerce.number().int().min(0).default(5),
    categoryIds: zod_1.z.array(zod_1.z.string()).optional(),
    images: zod_1.z.array(exports.productImageSchema).max(6, 'Maximum 6 images allowed').optional(),
    specifications: zod_1.z.array(exports.productSpecificationSchema).optional(),
    active: zod_1.z.boolean().default(true),
    featured: zod_1.z.boolean().default(false),
});
// Update product schema
exports.updateProductSchema = exports.createProductSchema.partial();
// Product list query schema
exports.productListQuerySchema = common_1.paginationSchema.extend({
    category: zod_1.z.string().optional(),
    minPrice: zod_1.z.coerce.number().optional(),
    maxPrice: zod_1.z.coerce.number().optional(),
    inStock: zod_1.z.coerce.boolean().optional(),
    featured: zod_1.z.coerce.boolean().optional(),
    active: zod_1.z.coerce.boolean().optional(),
    search: zod_1.z.string().optional(),
});
// Admin product list query schema
exports.adminProductListQuerySchema = exports.productListQuerySchema.extend({
    includeInactive: zod_1.z.coerce.boolean().optional().default(true),
});
// Bulk update stock schema
exports.bulkUpdateStockSchema = zod_1.z.object({
    updates: zod_1.z.array(zod_1.z.object({
        productId: zod_1.z.string().min(1),
        stock: zod_1.z.coerce.number().int().min(0),
    })),
});
// Add specification schema
exports.addSpecificationSchema = exports.productSpecificationSchema;
// Update specification schema
exports.updateSpecificationSchema = exports.productSpecificationSchema.partial();
//# sourceMappingURL=product.js.map