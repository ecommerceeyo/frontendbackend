import { Response, NextFunction } from 'express';
import { SupplierAuthenticatedRequest } from '../supplier-auth/supplier-auth.middleware';
export declare class SupplierPortalController {
    /**
     * Get dashboard statistics
     */
    getDashboard(req: SupplierAuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get supplier's products
     */
    getProducts(req: SupplierAuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get single product
     */
    getProduct(req: SupplierAuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Create a product
     */
    createProduct(req: SupplierAuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update a product
     */
    updateProduct(req: SupplierAuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Delete a product
     */
    deleteProduct(req: SupplierAuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get orders (order items)
     */
    getOrders(req: SupplierAuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get single order item
     */
    getOrderItem(req: SupplierAuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update fulfillment status
     */
    updateFulfillmentStatus(req: SupplierAuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    /**
     * Get payouts
     */
    getPayouts(req: SupplierAuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get supplier profile
     */
    getProfile(req: SupplierAuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update supplier profile
     */
    updateProfile(req: SupplierAuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const supplierPortalController: SupplierPortalController;
//# sourceMappingURL=supplier-portal.controller.d.ts.map