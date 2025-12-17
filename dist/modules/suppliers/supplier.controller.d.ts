import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types';
/**
 * Get paginated list of suppliers (public - only ACTIVE)
 */
export declare function getSuppliers(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get supplier by ID or slug (public)
 */
export declare function getSupplier(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get supplier's products (public)
 */
export declare function getSupplierProducts(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get all suppliers (admin)
 */
export declare function getAllSuppliers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get supplier by ID (admin)
 */
export declare function getSupplierAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Create supplier (admin)
 */
export declare function createSupplier(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Update supplier (admin)
 */
export declare function updateSupplier(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Update supplier status (admin)
 */
export declare function updateSupplierStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Update supplier commission (admin)
 */
export declare function updateSupplierCommission(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get supplier stats (admin)
 */
export declare function getSupplierStats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get supplier users
 */
export declare function getSupplierUsers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Create supplier user
 */
export declare function createSupplierUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Update supplier user
 */
export declare function updateSupplierUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Delete supplier user
 */
export declare function deleteSupplierUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Update supplier user permissions
 */
export declare function updateSupplierUserPermissions(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Update supplier max users
 */
export declare function updateSupplierMaxUsers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Update supplier max products
 */
export declare function updateSupplierMaxProducts(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get supplier product limits
 */
export declare function getSupplierProductLimits(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get supplier products (admin)
 */
export declare function getSupplierProductsAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Toggle supplier product status
 */
export declare function toggleSupplierProductStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Bulk toggle supplier products
 */
export declare function bulkToggleSupplierProducts(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get supplier orders (admin)
 */
export declare function getSupplierOrders(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get supplier order stats
 */
export declare function getSupplierOrderStats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Update order item fulfillment
 */
export declare function updateOrderItemFulfillment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
export declare const supplierController: {
    getSuppliers: typeof getSuppliers;
    getSupplier: typeof getSupplier;
    getSupplierProducts: typeof getSupplierProducts;
    getAllSuppliers: typeof getAllSuppliers;
    getSupplierAdmin: typeof getSupplierAdmin;
    createSupplier: typeof createSupplier;
    updateSupplier: typeof updateSupplier;
    updateSupplierStatus: typeof updateSupplierStatus;
    updateSupplierCommission: typeof updateSupplierCommission;
    getSupplierStats: typeof getSupplierStats;
    getSupplierUsers: typeof getSupplierUsers;
    createSupplierUser: typeof createSupplierUser;
    updateSupplierUser: typeof updateSupplierUser;
    deleteSupplierUser: typeof deleteSupplierUser;
    updateSupplierUserPermissions: typeof updateSupplierUserPermissions;
    updateSupplierMaxUsers: typeof updateSupplierMaxUsers;
    updateSupplierMaxProducts: typeof updateSupplierMaxProducts;
    getSupplierProductLimits: typeof getSupplierProductLimits;
    getSupplierProductsAdmin: typeof getSupplierProductsAdmin;
    toggleSupplierProductStatus: typeof toggleSupplierProductStatus;
    bulkToggleSupplierProducts: typeof bulkToggleSupplierProducts;
    getSupplierOrders: typeof getSupplierOrders;
    getSupplierOrderStats: typeof getSupplierOrderStats;
    updateOrderItemFulfillment: typeof updateOrderItemFulfillment;
};
//# sourceMappingURL=supplier.controller.d.ts.map