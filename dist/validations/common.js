"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartIdParamsSchema = exports.idParamsSchema = exports.dateRangeSchema = exports.currencySchema = exports.slugSchema = exports.quantitySchema = exports.priceSchema = exports.emailSchema = exports.phoneSchema = exports.searchSchema = exports.paginationSchema = exports.idSchema = void 0;
const zod_1 = require("zod");
// Common field schemas
exports.idSchema = zod_1.z.string().min(1, 'ID is required');
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
    sortBy: zod_1.z.string().optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional().default('desc'),
});
exports.searchSchema = zod_1.z.object({
    q: zod_1.z.string().optional(),
    ...exports.paginationSchema.shape,
});
exports.phoneSchema = zod_1.z
    .string()
    .min(9, 'Phone number must be at least 9 digits')
    .regex(/^[\d\s\-+()]+$/, 'Invalid phone number format');
exports.emailSchema = zod_1.z.string().email('Invalid email address');
exports.priceSchema = zod_1.z.coerce.number().positive('Price must be positive');
exports.quantitySchema = zod_1.z.coerce.number().int().positive('Quantity must be a positive integer');
exports.slugSchema = zod_1.z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format');
exports.currencySchema = zod_1.z.string().default('XAF');
exports.dateRangeSchema = zod_1.z.object({
    startDate: zod_1.z.coerce.date().optional(),
    endDate: zod_1.z.coerce.date().optional(),
});
// ID params schema
exports.idParamsSchema = zod_1.z.object({
    id: exports.idSchema,
});
// Cart ID params schema
exports.cartIdParamsSchema = zod_1.z.object({
    cartId: zod_1.z.string().min(1, 'Cart ID is required'),
});
//# sourceMappingURL=common.js.map