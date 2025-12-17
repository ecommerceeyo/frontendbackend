/**
 * General API rate limiter
 */
export declare const apiLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Strict limiter for authentication endpoints
 */
export declare const authLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Limiter for checkout/payment endpoints
 */
export declare const checkoutLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Limiter for upload endpoints
 */
export declare const uploadLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Limiter for webhook endpoints (more permissive)
 */
export declare const webhookLimiter: import("express-rate-limit").RateLimitRequestHandler;
//# sourceMappingURL=rateLimit.d.ts.map