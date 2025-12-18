"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierController = void 0;
exports.getSuppliers = getSuppliers;
exports.getSupplier = getSupplier;
exports.getSupplierProducts = getSupplierProducts;
exports.getAllSuppliers = getAllSuppliers;
exports.getSupplierAdmin = getSupplierAdmin;
exports.createSupplier = createSupplier;
exports.updateSupplier = updateSupplier;
exports.updateSupplierStatus = updateSupplierStatus;
exports.updateSupplierCommission = updateSupplierCommission;
exports.getSupplierStats = getSupplierStats;
exports.getSupplierUsers = getSupplierUsers;
exports.createSupplierUser = createSupplierUser;
exports.updateSupplierUser = updateSupplierUser;
exports.deleteSupplierUser = deleteSupplierUser;
exports.updateSupplierUserPermissions = updateSupplierUserPermissions;
exports.updateSupplierMaxUsers = updateSupplierMaxUsers;
exports.updateSupplierMaxProducts = updateSupplierMaxProducts;
exports.getSupplierProductLimits = getSupplierProductLimits;
exports.getSupplierProductsAdmin = getSupplierProductsAdmin;
exports.toggleSupplierProductStatus = toggleSupplierProductStatus;
exports.bulkToggleSupplierProducts = bulkToggleSupplierProducts;
exports.getSupplierOrders = getSupplierOrders;
exports.getSupplierOrderStats = getSupplierOrderStats;
exports.updateOrderItemFulfillment = updateOrderItemFulfillment;
const supplier_service_1 = require("./supplier.service");
const response_1 = require("../../utils/response");
/**
 * Get paginated list of suppliers (public - only ACTIVE)
 */
async function getSuppliers(req, res, next) {
    try {
        const { suppliers, total, page, limit } = await supplier_service_1.supplierService.getSuppliers(req.query);
        return (0, response_1.paginatedResponse)(res, suppliers, page, limit, total);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get supplier by ID or slug (public)
 */
async function getSupplier(req, res, next) {
    try {
        const supplier = await supplier_service_1.supplierService.getSupplierByIdOrSlug(req.params.idOrSlug);
        return (0, response_1.successResponse)(res, supplier);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get supplier's products (public)
 */
async function getSupplierProducts(req, res, next) {
    try {
        const supplier = await supplier_service_1.supplierService.getSupplierByIdOrSlug(req.params.idOrSlug);
        const { products, total, page, limit } = await supplier_service_1.supplierService.getSupplierProducts(supplier.id, req.query);
        return (0, response_1.paginatedResponse)(res, products, page, limit, total);
    }
    catch (error) {
        next(error);
    }
}
// ============================================
// ADMIN ENDPOINTS
// ============================================
/**
 * Get all suppliers (admin)
 */
async function getAllSuppliers(req, res, next) {
    try {
        const { suppliers, total, page, limit } = await supplier_service_1.supplierService.getAllSuppliers(req.query);
        return (0, response_1.paginatedResponse)(res, suppliers, page, limit, total);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get supplier by ID (admin)
 */
async function getSupplierAdmin(req, res, next) {
    try {
        const supplier = await supplier_service_1.supplierService.getSupplierById(req.params.supplierId);
        return (0, response_1.successResponse)(res, supplier);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Create supplier (admin)
 */
async function createSupplier(req, res, next) {
    try {
        const supplier = await supplier_service_1.supplierService.createSupplier(req.body);
        return (0, response_1.successResponse)(res, supplier, 'Supplier created successfully', 201);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Update supplier (admin)
 */
async function updateSupplier(req, res, next) {
    try {
        const supplier = await supplier_service_1.supplierService.updateSupplier(req.params.supplierId, req.body);
        return (0, response_1.successResponse)(res, supplier, 'Supplier updated successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Update supplier status (admin)
 */
async function updateSupplierStatus(req, res, next) {
    try {
        const { status } = req.body;
        const supplier = await supplier_service_1.supplierService.updateSupplierStatus(req.params.supplierId, status);
        return (0, response_1.successResponse)(res, supplier, 'Supplier status updated successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Update supplier commission (admin)
 */
async function updateSupplierCommission(req, res, next) {
    try {
        const { commissionRate } = req.body;
        const supplier = await supplier_service_1.supplierService.updateSupplierCommission(req.params.supplierId, commissionRate);
        return (0, response_1.successResponse)(res, supplier, 'Supplier commission updated successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get supplier stats (admin)
 */
async function getSupplierStats(req, res, next) {
    try {
        const stats = await supplier_service_1.supplierService.getSupplierStats(req.params.supplierId);
        return (0, response_1.successResponse)(res, stats);
    }
    catch (error) {
        next(error);
    }
}
// ============================================
// SUPPLIER USER MANAGEMENT (Admin)
// ============================================
/**
 * Get supplier users
 */
async function getSupplierUsers(req, res, next) {
    try {
        const result = await supplier_service_1.supplierService.getSupplierUsers(req.params.supplierId);
        return (0, response_1.successResponse)(res, result);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Create supplier user
 */
async function createSupplierUser(req, res, next) {
    try {
        const user = await supplier_service_1.supplierService.createSupplierUser(req.params.supplierId, req.body);
        return (0, response_1.successResponse)(res, user, 'Supplier user created successfully', 201);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Update supplier user
 */
async function updateSupplierUser(req, res, next) {
    try {
        const user = await supplier_service_1.supplierService.updateSupplierUser(req.params.supplierId, req.params.userId, req.body);
        return (0, response_1.successResponse)(res, user, 'Supplier user updated successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Delete supplier user
 */
async function deleteSupplierUser(req, res, next) {
    try {
        await supplier_service_1.supplierService.deleteSupplierUser(req.params.supplierId, req.params.userId);
        return (0, response_1.successResponse)(res, null, 'Supplier user deleted successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Update supplier user permissions
 */
async function updateSupplierUserPermissions(req, res, next) {
    try {
        const { permissions } = req.body;
        const user = await supplier_service_1.supplierService.updateSupplierUserPermissions(req.params.supplierId, req.params.userId, permissions);
        return (0, response_1.successResponse)(res, user, 'User permissions updated successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Update supplier max users
 */
async function updateSupplierMaxUsers(req, res, next) {
    try {
        const { maxUsers } = req.body;
        const supplier = await supplier_service_1.supplierService.updateSupplierMaxUsers(req.params.supplierId, maxUsers);
        return (0, response_1.successResponse)(res, supplier, 'Max users updated successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Update supplier max products
 */
async function updateSupplierMaxProducts(req, res, next) {
    try {
        const { maxProducts } = req.body;
        const supplier = await supplier_service_1.supplierService.updateSupplierMaxProducts(req.params.supplierId, maxProducts);
        return (0, response_1.successResponse)(res, supplier, 'Max products updated successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get supplier product limits
 */
async function getSupplierProductLimits(req, res, next) {
    try {
        const limits = await supplier_service_1.supplierService.getSupplierProductLimits(req.params.supplierId);
        return (0, response_1.successResponse)(res, limits);
    }
    catch (error) {
        next(error);
    }
}
// ============================================
// SUPPLIER PRODUCT MANAGEMENT (Admin)
// ============================================
/**
 * Get supplier products (admin)
 */
async function getSupplierProductsAdmin(req, res, next) {
    try {
        const { products, total, page, limit } = await supplier_service_1.supplierService.getSupplierProductsAdmin(req.params.supplierId, req.query);
        return (0, response_1.paginatedResponse)(res, products, page, limit, total);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Toggle supplier product status
 */
async function toggleSupplierProductStatus(req, res, next) {
    try {
        const { active } = req.body;
        const product = await supplier_service_1.supplierService.toggleSupplierProductStatus(req.params.supplierId, req.params.productId, active);
        return (0, response_1.successResponse)(res, product, `Product ${active ? 'enabled' : 'disabled'} successfully`);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Bulk toggle supplier products
 */
async function bulkToggleSupplierProducts(req, res, next) {
    try {
        const { productIds, active } = req.body;
        const result = await supplier_service_1.supplierService.bulkToggleSupplierProducts(req.params.supplierId, productIds, active);
        return (0, response_1.successResponse)(res, result, `${result.updated} products ${active ? 'enabled' : 'disabled'} successfully`);
    }
    catch (error) {
        next(error);
    }
}
// ============================================
// SUPPLIER ORDER MANAGEMENT (Admin)
// ============================================
/**
 * Get supplier orders (admin)
 */
async function getSupplierOrders(req, res, next) {
    try {
        const { orderItems, total, page, limit } = await supplier_service_1.supplierService.getSupplierOrders(req.params.supplierId, req.query);
        return (0, response_1.paginatedResponse)(res, orderItems, page, limit, total);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get supplier order stats
 */
async function getSupplierOrderStats(req, res, next) {
    try {
        const stats = await supplier_service_1.supplierService.getSupplierOrderStats(req.params.supplierId);
        return (0, response_1.successResponse)(res, stats);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Update order item fulfillment
 */
async function updateOrderItemFulfillment(req, res, next) {
    try {
        const orderItem = await supplier_service_1.supplierService.updateOrderItemFulfillment(req.params.supplierId, req.params.orderItemId, req.body);
        return (0, response_1.successResponse)(res, orderItem, 'Fulfillment status updated successfully');
    }
    catch (error) {
        next(error);
    }
}
// Export as object for easy import
exports.supplierController = {
    getSuppliers,
    getSupplier,
    getSupplierProducts,
    getAllSuppliers,
    getSupplierAdmin,
    createSupplier,
    updateSupplier,
    updateSupplierStatus,
    updateSupplierCommission,
    getSupplierStats,
    // User management
    getSupplierUsers,
    createSupplierUser,
    updateSupplierUser,
    deleteSupplierUser,
    updateSupplierUserPermissions,
    updateSupplierMaxUsers,
    // Product limits
    updateSupplierMaxProducts,
    getSupplierProductLimits,
    // Product management
    getSupplierProductsAdmin,
    toggleSupplierProductStatus,
    bulkToggleSupplierProducts,
    // Order management
    getSupplierOrders,
    getSupplierOrderStats,
    updateOrderItemFulfillment,
};
//# sourceMappingURL=supplier.controller.js.map