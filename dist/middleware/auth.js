import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import config from '../config';
import { unauthorizedResponse, forbiddenResponse } from '../utils/response';
/**
 * Middleware to authenticate admin users
 */
export async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return unauthorizedResponse(res, 'No token provided');
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, config.jwtSecret);
        const admin = await prisma.admin.findUnique({
            where: { id: decoded.adminId },
        });
        if (!admin || !admin.active) {
            return unauthorizedResponse(res, 'Invalid or inactive account');
        }
        req.admin = admin;
        next();
    }
    catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return unauthorizedResponse(res, 'Invalid token');
        }
        if (error instanceof jwt.TokenExpiredError) {
            return unauthorizedResponse(res, 'Token expired');
        }
        next(error);
    }
}
/**
 * Middleware to require specific admin roles
 */
export function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.admin) {
            return unauthorizedResponse(res, 'Authentication required');
        }
        if (!roles.includes(req.admin.role)) {
            return forbiddenResponse(res, 'Insufficient permissions');
        }
        next();
    };
}
/**
 * Middleware to require admin role
 */
export function requireAdmin(req, res, next) {
    if (!req.admin) {
        return unauthorizedResponse(res, 'Authentication required');
    }
    next();
}
/**
 * Optional authentication - doesn't fail if no token
 */
export async function optionalAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, config.jwtSecret);
        const admin = await prisma.admin.findUnique({
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
export async function authenticateCustomer(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return unauthorizedResponse(res, 'No token provided');
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, config.jwtSecret);
        // Ensure it's a customer token
        if (decoded.type !== 'customer') {
            return unauthorizedResponse(res, 'Invalid token type');
        }
        const customer = await prisma.customer.findUnique({
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
            return unauthorizedResponse(res, 'Invalid or inactive account');
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
        if (error instanceof jwt.JsonWebTokenError) {
            return unauthorizedResponse(res, 'Invalid token');
        }
        if (error instanceof jwt.TokenExpiredError) {
            return unauthorizedResponse(res, 'Token expired');
        }
        next(error);
    }
}
/**
 * Optional customer authentication - doesn't fail if no token
 */
export async function optionalCustomerAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, config.jwtSecret);
        // Only proceed if it's a customer token
        if (decoded.type !== 'customer') {
            return next();
        }
        const customer = await prisma.customer.findUnique({
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