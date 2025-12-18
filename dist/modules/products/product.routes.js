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
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminProductRoutes = void 0;
const express_1 = require("express");
const productController = __importStar(require("./product.controller"));
const validate_1 = require("../../middleware/validate");
const rateLimit_1 = require("../../middleware/rateLimit");
const validations_1 = require("../../validations");
const router = (0, express_1.Router)();
// ============================================
// PUBLIC ROUTES
// ============================================
/**
 * @route   GET /api/products
 * @desc    Get paginated list of products
 * @access  Public
 */
router.get('/', rateLimit_1.apiLimiter, (0, validate_1.validate)(validations_1.productListQuerySchema, 'query'), productController.getProducts);
/**
 * @route   GET /api/products/featured
 * @desc    Get featured products
 * @access  Public
 */
router.get('/featured', rateLimit_1.apiLimiter, productController.getFeaturedProducts);
/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID or slug
 * @access  Public
 */
router.get('/:id', rateLimit_1.apiLimiter, (0, validate_1.validate)(validations_1.idParamsSchema, 'params'), productController.getProduct);
exports.default = router;
// ============================================
// ADMIN ROUTES (used by /api/admin/products)
// ============================================
exports.adminProductRoutes = (0, express_1.Router)();
/**
 * @route   GET /api/admin/products
 * @desc    Get all products (including inactive)
 * @access  Admin
 */
exports.adminProductRoutes.get('/', productController.getProductsAdmin);
/**
 * @route   GET /api/admin/products/low-stock
 * @desc    Get low stock products
 * @access  Admin
 */
exports.adminProductRoutes.get('/low-stock', productController.getLowStockProducts);
/**
 * @route   GET /api/admin/products/:id
 * @desc    Get single product by ID (including inactive)
 * @access  Admin
 */
exports.adminProductRoutes.get('/:id', productController.getProductAdmin);
/**
 * @route   POST /api/admin/products
 * @desc    Create a new product
 * @access  Admin
 */
exports.adminProductRoutes.post('/', (0, validate_1.validate)(validations_1.createProductSchema), productController.createProduct);
/**
 * @route   PUT /api/admin/products/:id
 * @desc    Update a product
 * @access  Admin
 */
exports.adminProductRoutes.put('/:id', (0, validate_1.validate)(validations_1.updateProductSchema), productController.updateProduct);
/**
 * @route   DELETE /api/admin/products/:id
 * @desc    Delete a product
 * @access  Admin
 */
exports.adminProductRoutes.delete('/:id', productController.deleteProduct);
/**
 * @route   PATCH /api/admin/products/:id/stock
 * @desc    Update product stock
 * @access  Admin
 */
exports.adminProductRoutes.patch('/:id/stock', productController.updateProductStock);
/**
 * @route   POST /api/admin/products/bulk-stock
 * @desc    Bulk update stock
 * @access  Admin
 */
exports.adminProductRoutes.post('/bulk-stock', (0, validate_1.validate)(validations_1.bulkUpdateStockSchema), productController.bulkUpdateStock);
/**
 * @route   GET /api/admin/products/inventory-logs
 * @desc    Get inventory logs
 * @access  Admin
 */
exports.adminProductRoutes.get('/inventory-logs', productController.getInventoryLogs);
/**
 * @route   GET /api/admin/products/low-stock
 * @desc    Get low stock products
 * @access  Admin
 */
exports.adminProductRoutes.get('/low-stock', productController.getLowStockProducts);
//# sourceMappingURL=product.routes.js.map