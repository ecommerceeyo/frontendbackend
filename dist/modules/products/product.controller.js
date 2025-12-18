"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = getProducts;
exports.getProduct = getProduct;
exports.getFeaturedProducts = getFeaturedProducts;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.updateProductStock = updateProductStock;
exports.bulkUpdateStock = bulkUpdateStock;
exports.getLowStockProducts = getLowStockProducts;
exports.getInventoryLogs = getInventoryLogs;
exports.getProductAdmin = getProductAdmin;
exports.getProductsAdmin = getProductsAdmin;
const product_service_1 = require("./product.service");
const response_1 = require("../../utils/response");
/**
 * Get paginated list of products (public)
 */
async function getProducts(req, res, next) {
    try {
        const { products, total, page, limit } = await product_service_1.productService.getProducts(req.query);
        return (0, response_1.paginatedResponse)(res, products, page, limit, total);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get single product by ID or slug (public)
 */
async function getProduct(req, res, next) {
    try {
        const product = await product_service_1.productService.getProductByIdOrSlug(req.params.id);
        return (0, response_1.successResponse)(res, product);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get featured products (public)
 */
async function getFeaturedProducts(req, res, next) {
    try {
        const limit = parseInt(req.query.limit) || 8;
        const products = await product_service_1.productService.getFeaturedProducts(limit);
        return (0, response_1.successResponse)(res, products);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Create a new product (admin)
 */
async function createProduct(req, res, next) {
    try {
        const product = await product_service_1.productService.createProduct(req.body);
        return (0, response_1.successResponse)(res, product, 'Product created successfully', 201);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Update a product (admin)
 */
async function updateProduct(req, res, next) {
    try {
        const product = await product_service_1.productService.updateProduct(req.params.id, req.body);
        return (0, response_1.successResponse)(res, product, 'Product updated successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Delete a product (admin)
 */
async function deleteProduct(req, res, next) {
    try {
        await product_service_1.productService.deleteProduct(req.params.id);
        return (0, response_1.successResponse)(res, null, 'Product deleted successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Update product stock (admin)
 */
async function updateProductStock(req, res, next) {
    try {
        const { stock, reason } = req.body;
        const product = await product_service_1.productService.updateStock(req.params.id, stock, reason);
        return (0, response_1.successResponse)(res, product, 'Stock updated successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Bulk update stock (admin)
 */
async function bulkUpdateStock(req, res, next) {
    try {
        const { updates } = req.body;
        const results = await product_service_1.productService.bulkUpdateStock(updates);
        return (0, response_1.successResponse)(res, results, 'Stock updated successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get low stock products (admin)
 */
async function getLowStockProducts(req, res, next) {
    try {
        const products = await product_service_1.productService.getLowStockProducts();
        return (0, response_1.successResponse)(res, products);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get inventory logs (admin)
 */
async function getInventoryLogs(req, res, next) {
    try {
        const { page, limit, productId, reason } = req.query;
        const result = await product_service_1.productService.getInventoryLogs({
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            productId: productId,
            reason: reason,
        });
        return (0, response_1.paginatedResponse)(res, result.logs, result.page, result.limit, result.total);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get product by ID (admin - includes inactive)
 */
async function getProductAdmin(req, res, next) {
    try {
        const product = await product_service_1.productService.getProductById(req.params.id);
        return (0, response_1.successResponse)(res, product);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get all products (admin - includes inactive)
 */
async function getProductsAdmin(req, res, next) {
    try {
        const params = { ...req.query, includeInactive: true };
        const { products, total, page, limit } = await product_service_1.productService.getProducts(params);
        return (0, response_1.paginatedResponse)(res, products, page, limit, total);
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=product.controller.js.map