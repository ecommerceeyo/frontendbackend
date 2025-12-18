"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = getCategories;
exports.getCategoryTree = getCategoryTree;
exports.getCategory = getCategory;
exports.getCategoriesAdmin = getCategoriesAdmin;
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
exports.uploadCategoryImage = uploadCategoryImage;
exports.deleteCategoryImage = deleteCategoryImage;
const category_service_1 = require("./category.service");
const response_1 = require("../../utils/response");
const upload_service_1 = require("../upload/upload.service");
const validations_1 = require("../../validations");
/**
 * Get all categories (public)
 */
async function getCategories(req, res, next) {
    try {
        const { parentId, active } = req.query;
        const categories = await category_service_1.categoryService.getCategories({
            parentId: parentId,
            active: active === 'true' ? true : active === 'false' ? false : undefined,
        });
        return (0, response_1.successResponse)(res, categories);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get category tree (public)
 */
async function getCategoryTree(req, res, next) {
    try {
        const tree = await category_service_1.categoryService.getCategoryTree(true);
        return (0, response_1.successResponse)(res, tree);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get category by ID or slug (public)
 */
async function getCategory(req, res, next) {
    try {
        const category = await category_service_1.categoryService.getCategoryByIdOrSlug(req.params.id);
        return (0, response_1.successResponse)(res, category);
    }
    catch (error) {
        next(error);
    }
}
// ============================================
// ADMIN CONTROLLERS
// ============================================
/**
 * Get all categories (admin - includes inactive)
 */
async function getCategoriesAdmin(req, res, next) {
    try {
        const categories = await category_service_1.categoryService.getCategories();
        return (0, response_1.successResponse)(res, categories);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Create category (admin)
 */
async function createCategory(req, res, next) {
    try {
        const category = await category_service_1.categoryService.createCategory(req.body);
        return (0, response_1.successResponse)(res, category, 'Category created successfully', 201);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Update category (admin)
 */
async function updateCategory(req, res, next) {
    try {
        const category = await category_service_1.categoryService.updateCategory(req.params.id, req.body);
        return (0, response_1.successResponse)(res, category, 'Category updated successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Delete category (admin)
 */
async function deleteCategory(req, res, next) {
    try {
        await category_service_1.categoryService.deleteCategory(req.params.id);
        return (0, response_1.successResponse)(res, null, 'Category deleted successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Upload category image (admin)
 */
async function uploadCategoryImage(req, res, next) {
    try {
        if (!req.file) {
            return (0, response_1.errorResponse)(res, 'No file uploaded', 400);
        }
        // Validate file
        const validation = (0, validations_1.validateImageFile)(req.file);
        if (!validation.valid) {
            return (0, response_1.errorResponse)(res, validation.error || 'Invalid file', 400);
        }
        // Upload to Supabase Storage in 'categories' folder
        const result = await upload_service_1.uploadService.uploadImage(req.file, {
            folder: 'categories',
        });
        // Update category with new image URL
        const category = await category_service_1.categoryService.updateCategory(req.params.id, {
            image: result.url,
        });
        return (0, response_1.successResponse)(res, { category, image: result }, 'Category image uploaded successfully', 201);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Delete category image (admin)
 */
async function deleteCategoryImage(req, res, next) {
    try {
        const category = await category_service_1.categoryService.getCategoryByIdOrSlug(req.params.id);
        if (category.image) {
            // Extract publicId from the URL if it's a Supabase URL
            const url = category.image;
            if (url.includes('supabase.co')) {
                const pathMatch = url.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)/);
                if (pathMatch) {
                    await upload_service_1.uploadService.deleteImage(`supabase:${pathMatch[1]}`);
                }
            }
        }
        // Update category to remove image
        const updatedCategory = await category_service_1.categoryService.updateCategory(req.params.id, {
            image: undefined,
        });
        return (0, response_1.successResponse)(res, updatedCategory, 'Category image deleted successfully');
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=category.controller.js.map