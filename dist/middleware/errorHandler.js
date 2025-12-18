"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.ForbiddenError = exports.UnauthorizedError = exports.NotFoundError = exports.AppError = void 0;
exports.errorHandler = errorHandler;
exports.notFoundHandler = notFoundHandler;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("../utils/logger"));
const response_1 = require("../utils/response");
class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404);
    }
}
exports.NotFoundError = NotFoundError;
class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, 403);
    }
}
exports.ForbiddenError = ForbiddenError;
class ValidationError extends AppError {
    errors;
    constructor(errors) {
        super('Validation failed', 400);
        this.errors = errors;
    }
}
exports.ValidationError = ValidationError;
function errorHandler(err, req, res, _next) {
    logger_1.default.error(`${req.method} ${req.path}`, err);
    // Handle Zod validation errors
    if (err instanceof zod_1.ZodError) {
        const errors = err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
        }));
        return (0, response_1.validationErrorResponse)(res, errors);
    }
    // Handle custom validation errors
    if (err instanceof ValidationError) {
        return (0, response_1.validationErrorResponse)(res, err.errors);
    }
    // Handle custom app errors
    if (err instanceof AppError) {
        return (0, response_1.errorResponse)(res, err.message, err.statusCode);
    }
    // Handle Prisma errors
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case 'P2002':
                // Unique constraint violation
                const field = err.meta?.target?.join(', ') || 'field';
                return (0, response_1.errorResponse)(res, `A record with this ${field} already exists`, 409);
            case 'P2025':
                // Record not found
                return (0, response_1.errorResponse)(res, 'Record not found', 404);
            case 'P2003':
                // Foreign key constraint failed
                return (0, response_1.errorResponse)(res, 'Related record not found', 400);
            default:
                return (0, response_1.errorResponse)(res, 'Database error', 500);
        }
    }
    if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        return (0, response_1.errorResponse)(res, 'Invalid data provided', 400);
    }
    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return (0, response_1.errorResponse)(res, 'Invalid token', 401);
    }
    if (err.name === 'TokenExpiredError') {
        return (0, response_1.errorResponse)(res, 'Token expired', 401);
    }
    // Default server error
    return (0, response_1.serverErrorResponse)(res, err);
}
function notFoundHandler(req, res) {
    return (0, response_1.errorResponse)(res, `Route ${req.method} ${req.path} not found`, 404);
}
//# sourceMappingURL=errorHandler.js.map