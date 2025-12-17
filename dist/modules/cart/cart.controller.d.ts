import { Request, Response, NextFunction } from 'express';
/**
 * Create a new cart
 */
export declare function createCart(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get cart by cartId
 */
export declare function getCart(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Add item to cart
 */
export declare function addCartItem(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Update cart item quantity
 */
export declare function updateCartItem(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Remove item from cart
 */
export declare function removeCartItem(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Clear all items from cart
 */
export declare function clearCart(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Delete cart entirely
 */
export declare function deleteCart(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=cart.controller.d.ts.map