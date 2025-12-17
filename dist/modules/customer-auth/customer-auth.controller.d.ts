import { Request, Response, NextFunction } from 'express';
export interface CustomerRequest extends Request {
    customer?: {
        id: string;
        email: string;
        phone: string;
        name: string;
    };
}
/**
 * Register new customer
 */
export declare function register(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Customer login
 */
export declare function login(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Google OAuth login/signup
 */
export declare function googleAuth(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get customer profile
 */
export declare function getProfile(req: CustomerRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Update customer profile
 */
export declare function updateProfile(req: CustomerRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Change password
 */
export declare function changePassword(req: CustomerRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get customer addresses
 */
export declare function getAddresses(req: CustomerRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Add new address
 */
export declare function addAddress(req: CustomerRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Update address
 */
export declare function updateAddress(req: CustomerRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Delete address
 */
export declare function deleteAddress(req: CustomerRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get customer orders
 */
export declare function getOrders(req: CustomerRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get single order
 */
export declare function getOrder(req: CustomerRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=customer-auth.controller.d.ts.map