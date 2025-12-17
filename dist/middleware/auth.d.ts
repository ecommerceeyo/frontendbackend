import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { AdminRole } from '@prisma/client';
export interface CustomerRequest extends Request {
    customer?: {
        id: string;
        email: string;
        phone: string;
        name: string;
    };
}
/**
 * Middleware to authenticate admin users
 */
export declare function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Middleware to require specific admin roles
 */
export declare function requireRole(...roles: AdminRole[]): (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
/**
 * Middleware to require admin role
 */
export declare function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): Response<any, Record<string, any>>;
/**
 * Optional authentication - doesn't fail if no token
 */
export declare function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
/**
 * Middleware to authenticate customer users
 */
export declare function authenticateCustomer(req: CustomerRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Optional customer authentication - doesn't fail if no token
 */
export declare function optionalCustomerAuth(req: CustomerRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=auth.d.ts.map