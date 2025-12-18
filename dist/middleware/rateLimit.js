"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookLimiter = exports.uploadLimiter = exports.checkoutLimiter = exports.authLimiter = exports.apiLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const config_1 = __importDefault(require("../config"));
/**
 * General API rate limiter
 */
exports.apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: config_1.default.rateLimit.windowMs,
    max: config_1.default.rateLimit.max,
    message: {
        success: false,
        error: 'Too many requests, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
/**
 * Strict limiter for authentication endpoints
 */
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    message: {
        success: false,
        error: 'Too many login attempts, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
/**
 * Limiter for checkout/payment endpoints
 */
exports.checkoutLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute
    message: {
        success: false,
        error: 'Too many checkout attempts, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
/**
 * Limiter for upload endpoints
 */
exports.uploadLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // 20 uploads per minute
    message: {
        success: false,
        error: 'Too many upload requests, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
/**
 * Limiter for webhook endpoints (more permissive)
 */
exports.webhookLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: {
        success: false,
        error: 'Rate limit exceeded',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
//# sourceMappingURL=rateLimit.js.map