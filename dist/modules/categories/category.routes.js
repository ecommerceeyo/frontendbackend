"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminCategoryRoutes = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const categoryController = __importStar(require("./category.controller"));
const validate_1 = require("../../middleware/validate");
const rateLimit_1 = require("../../middleware/rateLimit");
const validations_1 = require("../../validations");
const config_1 = __importDefault(require("../../config"));
// File filter for JPEG/JPG and PNG images only
const imageFileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const ext = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
        cb(null, true);
    }
    else {
        cb(new Error('Only JPEG and PNG images are allowed'));
    }
};
// Configure multer for memory storage
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: config_1.default.maxFileSize,
        files: 1,
    },
    fileFilter: imageFileFilter,
});
const router = (0, express_1.Router)();
/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get('/', rateLimit_1.apiLimiter, (0, validate_1.validate)(validations_1.categoryListQuerySchema, 'query'), categoryController.getCategories);
/**
 * @route   GET /api/categories/tree
 * @desc    Get category tree (hierarchical)
 * @access  Public
 */
router.get('/tree', rateLimit_1.apiLimiter, categoryController.getCategoryTree);
/**
 * @route   GET /api/categories/:id
 * @desc    Get category by ID or slug
 * @access  Public
 */
router.get('/:id', rateLimit_1.apiLimiter, (0, validate_1.validate)(validations_1.idParamsSchema, 'params'), categoryController.getCategory);
exports.default = router;
// ============================================
// ADMIN ROUTES (used by /api/admin/categories)
// ============================================
exports.adminCategoryRoutes = (0, express_1.Router)();
/**
 * @route   GET /api/admin/categories
 * @desc    Get all categories (including inactive)
 * @access  Admin
 */
exports.adminCategoryRoutes.get('/', categoryController.getCategoriesAdmin);
/**
 * @route   POST /api/admin/categories
 * @desc    Create a new category
 * @access  Admin
 */
exports.adminCategoryRoutes.post('/', categoryController.createCategory);
/**
 * @route   PUT /api/admin/categories/:id
 * @desc    Update a category
 * @access  Admin
 */
exports.adminCategoryRoutes.put('/:id', categoryController.updateCategory);
/**
 * @route   DELETE /api/admin/categories/:id
 * @desc    Delete a category
 * @access  Admin
 */
exports.adminCategoryRoutes.delete('/:id', categoryController.deleteCategory);
/**
 * @route   POST /api/admin/categories/:id/image
 * @desc    Upload category image
 * @access  Admin
 */
exports.adminCategoryRoutes.post('/:id/image', rateLimit_1.uploadLimiter, upload.single('image'), categoryController.uploadCategoryImage);
/**
 * @route   DELETE /api/admin/categories/:id/image
 * @desc    Delete category image
 * @access  Admin
 */
exports.adminCategoryRoutes.delete('/:id/image', categoryController.deleteCategoryImage);
//# sourceMappingURL=category.routes.js.map