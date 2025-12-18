"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierPortalController = exports.SupplierPortalController = void 0;
const supplier_portal_service_1 = require("./supplier-portal.service");
class SupplierPortalController {
    /**
     * Get dashboard statistics
     */
    async getDashboard(req, res, next) {
        try {
            const supplierId = req.supplier?.id;
            const stats = await supplier_portal_service_1.supplierPortalService.getDashboardStats(supplierId);
            res.json({
                success: true,
                data: stats,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get supplier's products
     */
    async getProducts(req, res, next) {
        try {
            const supplierId = req.supplier?.id;
            const { page, limit, search, active, sortBy, sortOrder } = req.query;
            const result = await supplier_portal_service_1.supplierPortalService.getProducts(supplierId, {
                page: page ? parseInt(page) : undefined,
                limit: limit ? parseInt(limit) : undefined,
                search,
                active: active !== undefined ? active === 'true' : undefined,
                sortBy,
                sortOrder,
            });
            res.json({
                success: true,
                data: {
                    items: result.products,
                    pagination: {
                        page: result.page,
                        limit: result.limit,
                        total: result.total,
                        totalPages: Math.ceil(result.total / result.limit),
                    },
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get single product
     */
    async getProduct(req, res, next) {
        try {
            const supplierId = req.supplier?.id;
            const { productId } = req.params;
            const product = await supplier_portal_service_1.supplierPortalService.getProduct(supplierId, productId);
            res.json({
                success: true,
                data: product,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Create a product
     */
    async createProduct(req, res, next) {
        try {
            const supplierId = req.supplier?.id;
            const productData = req.body;
            const product = await supplier_portal_service_1.supplierPortalService.createProduct(supplierId, productData);
            res.status(201).json({
                success: true,
                data: product,
                message: 'Product created successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update a product
     */
    async updateProduct(req, res, next) {
        try {
            const supplierId = req.supplier?.id;
            const { productId } = req.params;
            const productData = req.body;
            const product = await supplier_portal_service_1.supplierPortalService.updateProduct(supplierId, productId, productData);
            res.json({
                success: true,
                data: product,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Delete a product
     */
    async deleteProduct(req, res, next) {
        try {
            const supplierId = req.supplier?.id;
            const { productId } = req.params;
            await supplier_portal_service_1.supplierPortalService.deleteProduct(supplierId, productId);
            res.json({
                success: true,
                message: 'Product deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get orders (order items)
     */
    async getOrders(req, res, next) {
        try {
            const supplierId = req.supplier?.id;
            const { page, limit, status, search } = req.query;
            const result = await supplier_portal_service_1.supplierPortalService.getOrders(supplierId, {
                page: page ? parseInt(page) : undefined,
                limit: limit ? parseInt(limit) : undefined,
                status: status,
                search,
            });
            res.json({
                success: true,
                data: {
                    items: result.orderItems,
                    pagination: {
                        page: result.page,
                        limit: result.limit,
                        total: result.total,
                        totalPages: Math.ceil(result.total / result.limit),
                    },
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get single order item
     */
    async getOrderItem(req, res, next) {
        try {
            const supplierId = req.supplier?.id;
            const { orderItemId } = req.params;
            const orderItem = await supplier_portal_service_1.supplierPortalService.getOrderItem(supplierId, orderItemId);
            res.json({
                success: true,
                data: orderItem,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update fulfillment status
     */
    async updateFulfillmentStatus(req, res, next) {
        try {
            const supplierId = req.supplier?.id;
            const { orderItemId } = req.params;
            const { status, trackingNumber } = req.body;
            if (!status) {
                return res.status(400).json({
                    success: false,
                    error: 'Status is required',
                });
            }
            const orderItem = await supplier_portal_service_1.supplierPortalService.updateFulfillmentStatus(supplierId, orderItemId, status, trackingNumber);
            res.json({
                success: true,
                data: orderItem,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get payouts
     */
    async getPayouts(req, res, next) {
        try {
            const supplierId = req.supplier?.id;
            const { page, limit } = req.query;
            const result = await supplier_portal_service_1.supplierPortalService.getPayouts(supplierId, {
                page: page ? parseInt(page) : undefined,
                limit: limit ? parseInt(limit) : undefined,
            });
            res.json({
                success: true,
                data: {
                    items: result.payouts,
                    pagination: {
                        page: result.page,
                        limit: result.limit,
                        total: result.total,
                        totalPages: Math.ceil(result.total / result.limit),
                    },
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get supplier profile
     */
    async getProfile(req, res, next) {
        try {
            const supplierId = req.supplier?.id;
            const profile = await supplier_portal_service_1.supplierPortalService.getProfile(supplierId);
            res.json({
                success: true,
                data: profile,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update supplier profile
     */
    async updateProfile(req, res, next) {
        try {
            const supplierId = req.supplier?.id;
            const profileData = req.body;
            const profile = await supplier_portal_service_1.supplierPortalService.updateProfile(supplierId, profileData);
            res.json({
                success: true,
                data: profile,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SupplierPortalController = SupplierPortalController;
exports.supplierPortalController = new SupplierPortalController();
//# sourceMappingURL=supplier-portal.controller.js.map