import { supplierService } from './supplier.service';
import { successResponse, paginatedResponse } from '../../utils/response';
/**
 * Get paginated list of suppliers (public - only ACTIVE)
 */
export async function getSuppliers(req, res, next) {
    try {
        const { suppliers, total, page, limit } = await supplierService.getSuppliers(req.query);
        return paginatedResponse(res, suppliers, page, limit, total);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get supplier by ID or slug (public)
 */
export async function getSupplier(req, res, next) {
    try {
        const supplier = await supplierService.getSupplierByIdOrSlug(req.params.idOrSlug);
        return successResponse(res, supplier);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get supplier's products (public)
 */
export async function getSupplierProducts(req, res, next) {
    try {
        const supplier = await supplierService.getSupplierByIdOrSlug(req.params.idOrSlug);
        const { products, total, page, limit } = await supplierService.getSupplierProducts(supplier.id, req.query);
        return paginatedResponse(res, products, page, limit, total);
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
export async function getAllSuppliers(req, res, next) {
    try {
        const { suppliers, total, page, limit } = await supplierService.getAllSuppliers(req.query);
        return paginatedResponse(res, suppliers, page, limit, total);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get supplier by ID (admin)
 */
export async function getSupplierAdmin(req, res, next) {
    try {
        const supplier = await supplierService.getSupplierById(req.params.supplierId);
        return successResponse(res, supplier);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Create supplier (admin)
 */
export async function createSupplier(req, res, next) {
    try {
        const supplier = await supplierService.createSupplier(req.body);
        return successResponse(res, supplier, 'Supplier created successfully', 201);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Update supplier (admin)
 */
export async function updateSupplier(req, res, next) {
    try {
        const supplier = await supplierService.updateSupplier(req.params.supplierId, req.body);
        return successResponse(res, supplier, 'Supplier updated successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Update supplier status (admin)
 */
export async function updateSupplierStatus(req, res, next) {
    try {
        const { status } = req.body;
        const supplier = await supplierService.updateSupplierStatus(req.params.supplierId, status);
        return successResponse(res, supplier, 'Supplier status updated successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Update supplier commission (admin)
 */
export async function updateSupplierCommission(req, res, next) {
    try {
        const { commissionRate } = req.body;
        const supplier = await supplierService.updateSupplierCommission(req.params.supplierId, commissionRate);
        return successResponse(res, supplier, 'Supplier commission updated successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get supplier stats (admin)
 */
export async function getSupplierStats(req, res, next) {
    try {
        const stats = await supplierService.getSupplierStats(req.params.supplierId);
        return successResponse(res, stats);
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
export async function getSupplierUsers(req, res, next) {
    try {
        const result = await supplierService.getSupplierUsers(req.params.supplierId);
        return successResponse(res, result);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Create supplier user
 */
export async function createSupplierUser(req, res, next) {
    try {
        const user = await supplierService.createSupplierUser(req.params.supplierId, req.body);
        return successResponse(res, user, 'Supplier user created successfully', 201);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Update supplier user
 */
export async function updateSupplierUser(req, res, next) {
    try {
        const user = await supplierService.updateSupplierUser(req.params.supplierId, req.params.userId, req.body);
        return successResponse(res, user, 'Supplier user updated successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Delete supplier user
 */
export async function deleteSupplierUser(req, res, next) {
    try {
        await supplierService.deleteSupplierUser(req.params.supplierId, req.params.userId);
        return successResponse(res, null, 'Supplier user deleted successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Update supplier user permissions
 */
export async function updateSupplierUserPermissions(req, res, next) {
    try {
        const { permissions } = req.body;
        const user = await supplierService.updateSupplierUserPermissions(req.params.supplierId, req.params.userId, permissions);
        return successResponse(res, user, 'User permissions updated successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Update supplier max users
 */
export async function updateSupplierMaxUsers(req, res, next) {
    try {
        const { maxUsers } = req.body;
        const supplier = await supplierService.updateSupplierMaxUsers(req.params.supplierId, maxUsers);
        return successResponse(res, supplier, 'Max users updated successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Update supplier max products
 */
export async function updateSupplierMaxProducts(req, res, next) {
    try {
        const { maxProducts } = req.body;
        const supplier = await supplierService.updateSupplierMaxProducts(req.params.supplierId, maxProducts);
        return successResponse(res, supplier, 'Max products updated successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get supplier product limits
 */
export async function getSupplierProductLimits(req, res, next) {
    try {
        const limits = await supplierService.getSupplierProductLimits(req.params.supplierId);
        return successResponse(res, limits);
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
export async function getSupplierProductsAdmin(req, res, next) {
    try {
        const { products, total, page, limit } = await supplierService.getSupplierProductsAdmin(req.params.supplierId, req.query);
        return paginatedResponse(res, products, page, limit, total);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Toggle supplier product status
 */
export async function toggleSupplierProductStatus(req, res, next) {
    try {
        const { active } = req.body;
        const product = await supplierService.toggleSupplierProductStatus(req.params.supplierId, req.params.productId, active);
        return successResponse(res, product, `Product ${active ? 'enabled' : 'disabled'} successfully`);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Bulk toggle supplier products
 */
export async function bulkToggleSupplierProducts(req, res, next) {
    try {
        const { productIds, active } = req.body;
        const result = await supplierService.bulkToggleSupplierProducts(req.params.supplierId, productIds, active);
        return successResponse(res, result, `${result.updated} products ${active ? 'enabled' : 'disabled'} successfully`);
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
export async function getSupplierOrders(req, res, next) {
    try {
        const { orderItems, total, page, limit } = await supplierService.getSupplierOrders(req.params.supplierId, req.query);
        return paginatedResponse(res, orderItems, page, limit, total);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get supplier order stats
 */
export async function getSupplierOrderStats(req, res, next) {
    try {
        const stats = await supplierService.getSupplierOrderStats(req.params.supplierId);
        return successResponse(res, stats);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Update order item fulfillment
 */
export async function updateOrderItemFulfillment(req, res, next) {
    try {
        const orderItem = await supplierService.updateOrderItemFulfillment(req.params.supplierId, req.params.orderItemId, req.body);
        return successResponse(res, orderItem, 'Fulfillment status updated successfully');
    }
    catch (error) {
        next(error);
    }
}
// Export as object for easy import
export const supplierController = {
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