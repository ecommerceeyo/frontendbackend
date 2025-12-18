"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.requireRole = requireRole;
exports.requireAdmin = requireAdmin;
exports.optionalAuth = optionalAuth;
exports.authenticateCustomer = authenticateCustomer;
exports.optionalCustomerAuth = optionalCustomerAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../config/database"));
const config_1 = __importDefault(require("../config"));
const response_1 = require("../utils/response");
/**
 * Middleware to authenticate admin users
 */
async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return (0, response_1.unauthorizedResponse)(res, 'No token provided');
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
        const admin = await database_1.default.admin.findUnique({
            where: { id: decoded.adminId },
        });
        if (!admin || !admin.active) {
            return (0, response_1.unauthorizedResponse)(res, 'Invalid or inactive account');
        }
        req.admin = admin;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return (0, response_1.unauthorizedResponse)(res, 'Invalid token');
        }
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return (0, response_1.unauthorizedResponse)(res, 'Token expired');
        }
        next(error);
    }
}
/**
 * Middleware to require specific admin roles
 */
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.admin) {
            return (0, response_1.unauthorizedResponse)(res, 'Authentication required');
        }
        if (!roles.includes(req.admin.role)) {
            return (0, response_1.forbiddenResponse)(res, 'Insufficient permissions');
        }
        next();
    };
}
/**
 * Middleware to require admin role
 */
function requireAdmin(req, res, next) {
    if (!req.admin) {
        return (0, response_1.unauthorizedResponse)(res, 'Authentication required');
    }
    next();
}
/**
 * Optional authentication - doesn't fail if no token
 */
async function optionalAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
        const admin = await database_1.default.admin.findUnique({
            where: { id: decoded.adminId },
        });
        if (admin && admin.active) {
            req.admin = admin;
        }
        next();
    }
    catch {
        // Ignore errors, just continue without auth
        next();
    }
}
/**
 * Middleware to authenticate customer users
 */
async function authenticateCustomer(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return (0, response_1.unauthorizedResponse)(res, 'No token provided');
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
        // Ensure it's a customer token
        if (decoded.type !== 'customer') {
            return (0, response_1.unauthorizedResponse)(res, 'Invalid token type');
        }
        const customer = await database_1.default.customer.findUnique({
            where: { id: decoded.customerId },
            select: {
                id: true,
                email: true,
                phone: true,
                name: true,
                active: true,
            },
        });
        if (!customer || !customer.active) {
            return (0, response_1.unauthorizedResponse)(res, 'Invalid or inactive account');
        }
        req.customer = {
            id: customer.id,
            email: customer.email,
            phone: customer.phone,
            name: customer.name,
        };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return (0, response_1.unauthorizedResponse)(res, 'Invalid token');
        }
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return (0, response_1.unauthorizedResponse)(res, 'Token expired');
        }
        next(error);
    }
}
/**
 * Optional customer authentication - doesn't fail if no token
 */
async function optionalCustomerAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
        // Only proceed if it's a customer token
        if (decoded.type !== 'customer') {
            return next();
        }
        const customer = await database_1.default.customer.findUnique({
            where: { id: decoded.customerId },
            select: {
                id: true,
                email: true,
                phone: true,
                name: true,
                active: true,
            },
        });
        if (customer && customer.active) {
            req.customer = {
                id: customer.id,
                email: customer.email,
                phone: customer.phone,
                name: customer.name,
            };
        }
        next();
    }
    catch {
        // Ignore errors, just continue without auth
        next();
    }
}
//# sourceMappingURL=auth.js.map