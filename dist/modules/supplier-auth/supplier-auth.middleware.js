"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateSupplier = authenticateSupplier;
exports.requireActiveSupplier = requireActiveSupplier;
exports.requireSupplierRole = requireSupplierRole;
exports.ensureSupplierOwnership = ensureSupplierOwnership;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../../config/database"));
const config_1 = __importDefault(require("../../config"));
const errorHandler_1 = require("../../middleware/errorHandler");
/**
 * Authenticate supplier admin from JWT token
 */
async function authenticateSupplier(req, res, next) {
    try {
        const authHeader = req.headers?.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new errorHandler_1.UnauthorizedError('No token provided');
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
        // Verify it's a supplier token
        if (decoded.type !== 'supplier') {
            throw new errorHandler_1.UnauthorizedError('Invalid token type');
        }
        // Verify supplier admin exists and is active
        const supplierAdmin = await database_1.default.supplierAdmin.findUnique({
            where: { id: decoded.supplierAdminId },
            include: {
                supplier: {
                    select: { id: true, status: true },
                },
            },
        });
        if (!supplierAdmin || !supplierAdmin.active) {
            throw new errorHandler_1.UnauthorizedError('Account not found or inactive');
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
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            next(new errorHandler_1.UnauthorizedError('Invalid token'));
        }
        else {
            next(error);
        }
    }
}
/**
 * Require supplier account to be active
 */
function requireActiveSupplier(req, res, next) {
    const supplier = req.supplier;
    if (!supplier || supplier.status !== 'ACTIVE') {
        return next(new errorHandler_1.ForbiddenError('Supplier account is not active'));
    }
    next();
}
/**
 * Require specific supplier roles
 */
function requireSupplierRole(...allowedRoles) {
    return (req, res, next) => {
        const supplierAdmin = req.supplierAdmin;
        if (!supplierAdmin) {
            return next(new errorHandler_1.UnauthorizedError('Not authenticated'));
        }
        if (!allowedRoles.includes(supplierAdmin.role)) {
            return next(new errorHandler_1.ForbiddenError('Insufficient permissions'));
        }
        next();
    };
}
/**
 * Ensure supplier can only access their own resources
 */
function ensureSupplierOwnership(paramName = 'supplierId') {
    return async (req, res, next) => {
        const supplier = req.supplier;
        const requestedSupplierId = req.params[paramName];
        if (requestedSupplierId && requestedSupplierId !== supplier?.id) {
            return next(new errorHandler_1.ForbiddenError('Access denied'));
        }
        next();
    };
}
//# sourceMappingURL=supplier-auth.middleware.js.map