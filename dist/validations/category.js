"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryListQuerySchema = exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
const common_1 = require("./common");
// Create category schema
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(100),
    slug: zod_1.z.string().optional(),
    description: zod_1.z.string().max(500).optional(),
    image: zod_1.z.string().url().optional(),
    parentId: zod_1.z.string().optional(),
    active: zod_1.z.boolean().default(true),
    sortOrder: zod_1.z.coerce.number().int().default(0),
});
// Update category schema
exports.updateCategorySchema = exports.createCategorySchema.partial();
// Category list query schema
exports.categoryListQuerySchema = common_1.paginationSchema.extend({
    parentId: zod_1.z.string().optional(),
    active: zod_1.z.coerce.boolean().optional(),
    includeProducts: zod_1.z.coerce.boolean().optional().default(false),
});
//# sourceMappingURL=category.js.map