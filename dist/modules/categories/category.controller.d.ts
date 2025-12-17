import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types';
/**
 * Get all categories (public)
 */
export declare function getCategories(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get category tree (public)
 */
export declare function getCategoryTree(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get category by ID or slug (public)
 */
export declare function getCategory(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get all categories (admin - includes inactive)
 */
export declare function getCategoriesAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Create category (admin)
 */
export declare function createCategory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Update category (admin)
 */
export declare function updateCategory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Delete category (admin)
 */
export declare function deleteCategory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Upload category image (admin)
 */
export declare function uploadCategoryImage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Delete category image (admin)
 */
export declare function deleteCategoryImage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=category.controller.d.ts.map