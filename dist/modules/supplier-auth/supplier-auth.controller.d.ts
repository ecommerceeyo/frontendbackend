import { Request, Response, NextFunction } from 'express';
import { SupplierAuthenticatedRequest } from './supplier-auth.middleware';
export declare class SupplierAuthController {
    /**
     * Register a new supplier
     */
    register(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    /**
     * Login as supplier admin
     */
    login(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    /**
     * Get current supplier admin profile
     */
    getMe(req: SupplierAuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    /**
     * Change password
     */
    changePassword(req: SupplierAuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    /**
     * Get staff members for current supplier
     */
    getStaff(req: SupplierAuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Create a new staff member
     */
    createStaff(req: SupplierAuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    /**
     * Update staff member status
     */
    updateStaffStatus(req: SupplierAuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    /**
     * Delete staff member
     */
    deleteStaff(req: SupplierAuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const supplierAuthController: SupplierAuthController;
//# sourceMappingURL=supplier-auth.controller.d.ts.map