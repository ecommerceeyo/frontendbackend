import { Request, Response, NextFunction } from 'express';
import { SupplierRole } from '@prisma/client';
export interface SupplierAuthenticatedRequest extends Request {
    supplierAdmin?: {
        id: string;
        email: string;
        role: SupplierRole;
    };
    supplier?: {
        id: string;
        status: string;
    };
}
/**
 * Authenticate supplier admin from JWT token
 */
export declare function authenticateSupplier(req: SupplierAuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
/**
 * Require supplier account to be active
 */
export declare function requireActiveSupplier(req: SupplierAuthenticatedRequest, res: Response, next: NextFunction): void;
/**
 * Require specific supplier roles
 */
export declare function requireSupplierRole(...allowedRoles: SupplierRole[]): (req: SupplierAuthenticatedRequest, res: Response, next: NextFunction) => void;
/**
 * Ensure supplier can only access their own resources
 */
export declare function ensureSupplierOwnership(paramName?: string): (req: SupplierAuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=supplier-auth.middleware.d.ts.map