"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = exports.CategoryService = void 0;
const database_1 = __importDefault(require("../../config/database"));
const helpers_1 = require("../../utils/helpers");
const errorHandler_1 = require("../../middleware/errorHandler");
class CategoryService {
    /**
     * Get all categories (with optional filters)
     */
    async getCategories(params = {}) {
        const where = {};
        if (params.parentId !== undefined) {
            where.parentId = params.parentId || null;
        }
        if (params.active !== undefined) {
            where.active = params.active;
        }
        const categories = await database_1.default.category.findMany({
            where,
            include: {
                children: {
                    where: params.active !== undefined ? { active: params.active } : {},
                    orderBy: { sortOrder: 'asc' },
                },
                parent: true,
                _count: {
                    select: { products: true },
                },
            },
            orderBy: { sortOrder: 'asc' },
        });
        return categories;
    }
    /**
     * Get category tree (hierarchical)
     */
    async getCategoryTree(activeOnly = true) {
        const where = {
            parentId: null,
        };
        if (activeOnly) {
            where.active = true;
        }
        const categories = await database_1.default.category.findMany({
            where,
            include: {
                children: {
                    where: activeOnly ? { active: true } : {},
                    include: {
                        children: {
                            where: activeOnly ? { active: true } : {},
                            orderBy: { sortOrder: 'asc' },
                        },
                    },
                    orderBy: { sortOrder: 'asc' },
                },
            },
            orderBy: { sortOrder: 'asc' },
        });
        return categories;
    }
    /**
     * Get category by ID or slug
     */
    async getCategoryByIdOrSlug(idOrSlug) {
        const category = await database_1.default.category.findFirst({
            where: {
                OR: [{ id: idOrSlug }, { slug: idOrSlug }],
            },
            include: {
                children: {
                    where: { active: true },
                    orderBy: { sortOrder: 'asc' },
                },
                parent: true,
                _count: {
                    select: { products: true },
                },
            },
        });
        if (!category) {
            throw new errorHandler_1.NotFoundError('Category');
        }
        return category;
    }
    /**
     * Create a new category
     */
    async createCategory(data) {
        const slug = data.slug || (0, helpers_1.slugify)(data.name);
        // Check if slug exists
        const existingCategory = await database_1.default.category.findUnique({
            where: { slug },
        });
        if (existingCategory) {
            throw new Error('A category with this slug already exists');
        }
        // Validate parentId if provided
        if (data.parentId) {
            const parentCategory = await database_1.default.category.findUnique({
                where: { id: data.parentId },
            });
            if (!parentCategory) {
                throw new errorHandler_1.NotFoundError('Parent category');
            }
        }
        const category = await database_1.default.category.create({
            data: {
                name: data.name,
                slug,
                description: data.description,
                image: data.image,
                parentId: data.parentId,
                active: data.active ?? true,
                sortOrder: data.sortOrder ?? 0,
            },
            include: {
                parent: true,
                children: true,
            },
        });
        return category;
    }
    /**
     * Update a category
     */
    async updateCategory(id, data) {
        const existingCategory = await database_1.default.category.findUnique({
            where: { id },
        });
        if (!existingCategory) {
            throw new errorHandler_1.NotFoundError('Category');
        }
        // Handle slug update
        let slug = data.slug;
        if (data.name && !data.slug) {
            slug = (0, helpers_1.slugify)(data.name);
        }
        if (slug && slug !== existingCategory.slug) {
            const slugExists = await database_1.default.category.findFirst({
                where: { slug, NOT: { id } },
            });
            if (slugExists) {
                throw new Error('A category with this slug already exists');
            }
        }
        // Validate parentId if provided
        if (data.parentId) {
            if (data.parentId === id) {
                throw new Error('A category cannot be its own parent');
            }
            const parentCategory = await database_1.default.category.findUnique({
                where: { id: data.parentId },
            });
            if (!parentCategory) {
                throw new errorHandler_1.NotFoundError('Parent category');
            }
        }
        const category = await database_1.default.category.update({
            where: { id },
            data: {
                name: data.name,
                slug,
                description: data.description,
                image: data.image,
                parentId: data.parentId,
                active: data.active,
                sortOrder: data.sortOrder,
            },
            include: {
                parent: true,
                children: true,
            },
        });
        return category;
    }
    /**
     * Delete a category
     */
    async deleteCategory(id) {
        const category = await database_1.default.category.findUnique({
            where: { id },
            include: {
                children: true,
                products: true,
            },
        });
        if (!category) {
            throw new errorHandler_1.NotFoundError('Category');
        }
        if (category.children.length > 0) {
            throw new Error('Cannot delete a category with child categories');
        }
        if (category.products.length > 0) {
            throw new Error('Cannot delete a category with associated products');
        }
        await database_1.default.category.delete({ where: { id } });
        return { success: true };
    }
}
exports.CategoryService = CategoryService;
exports.categoryService = new CategoryService();
//# sourceMappingURL=category.service.js.map