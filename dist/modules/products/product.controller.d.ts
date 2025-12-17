import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types';
/**
 * Get paginated list of products (public)
 */
export declare function getProducts(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get single product by ID or slug (public)
 */
export declare function getProduct(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get featured products (public)
 */
export declare function getFeaturedProducts(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Create a new product (admin)
 */
export declare function createProduct(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Update a product (admin)
 */
export declare function updateProduct(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Delete a product (admin)
 */
export declare function deleteProduct(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Update product stock (admin)
 */
export declare function updateProductStock(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Bulk update stock (admin)
 */
export declare function bulkUpdateStock(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get low stock products (admin)
 */
export declare function getLowStockProducts(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get inventory logs (admin)
 */
export declare function getInventoryLogs(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get product by ID (admin - includes inactive)
 */
export declare function getProductAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get all products (admin - includes inactive)
 */
export declare function getProductsAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=product.controller.d.ts.map