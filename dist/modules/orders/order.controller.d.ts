import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types';
/**
 * Create order from checkout (public)
 */
export declare function checkout(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Track order (public)
 */
export declare function trackOrder(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get order by ID (public - limited info)
 */
export declare function getOrder(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get paginated list of orders (admin)
 */
export declare function getOrders(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get order by ID (admin - full info)
 */
export declare function getOrderAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Update order status (admin)
 */
export declare function updateOrderStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Mark order as shipped (admin)
 */
export declare function markAsShipped(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Generate invoice (admin)
 */
export declare function generateInvoice(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=order.controller.d.ts.map