import jwt from 'jsonwebtoken';
import prisma from '../../config/database';
import config from '../../config';
import { UnauthorizedError, ForbiddenError } from '../../middleware/errorHandler';
/**
 * Authenticate supplier admin from JWT token
 */
export async function authenticateSupplier(req, res, next) {
    try {
        const authHeader = req.headers?.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('No token provided');
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, config.jwtSecret);
        // Verify it's a supplier token
        if (decoded.type !== 'supplier') {
            throw new UnauthorizedError('Invalid token type');
        }
        // Verify supplier admin exists and is active
        const supplierAdmin = await prisma.supplierAdmin.findUnique({
            where: { id: decoded.supplierAdminId },
            include: {
                supplier: {
                    select: { id: true, status: true },
                },
            },
        });
        if (!supplierAdmin || !supplierAdmin.active) {
            throw new UnauthorizedError('Account not found or inactive');
        }
        // Attach to request
        req.supplierAdmin = {
            id: supplierAdmin.id,
            email: supplierAdmin.email,
            role: supplierAdmin.role,
        };
        req.supplier = supplierAdmin.supplier;
        next();
    }
    catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            next(new UnauthorizedError('Invalid token'));
        }
        else {
            next(error);
        }
    }
}
/**
 * Require supplier account to be active
 */
export function requireActiveSupplier(req, res, next) {
    const supplier = req.supplier;
    if (!supplier || supplier.status !== 'ACTIVE') {
        return next(new ForbiddenError('Supplier account is not active'));
    }
    next();
}
/**
 * Require specific supplier roles
 */
export function requireSupplierRole(...allowedRoles) {
    return (req, res, next) => {
        const supplierAdmin = req.supplierAdmin;
        if (!supplierAdmin) {
            return next(new UnauthorizedError('Not authenticated'));
        }
        if (!allowedRoles.includes(supplierAdmin.role)) {
            return next(new ForbiddenError('Insufficient permissions'));
        }
        next();
    };
}
/**
 * Ensure supplier can only access their own resources
 */
export function ensureSupplierOwnership(paramName = 'supplierId') {
    return async (req, res, next) => {
        const supplier = req.supplier;
        const requestedSupplierId = req.params[paramName];
        if (requestedSupplierId && requestedSupplierId !== supplier?.id) {
            return next(new ForbiddenError('Access denied'));
        }
        next();
    };
}
//# sourceMappingURL=supplier-auth.middleware.js.map