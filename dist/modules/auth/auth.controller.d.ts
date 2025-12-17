import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types';
/**
 * Admin login
 */
export declare function login(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get current admin profile
 */
export declare function getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Change password
 */
export declare function changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Create new admin (super admin only)
 */
export declare function createAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get all admins (super admin only)
 */
export declare function getAdmins(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get admin by ID (super admin only)
 */
export declare function getAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Update admin (super admin only)
 */
export declare function updateAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Delete admin (super admin only)
 */
export declare function deleteAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=auth.controller.d.ts.map