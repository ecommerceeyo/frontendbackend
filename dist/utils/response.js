"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = successResponse;
exports.errorResponse = errorResponse;
exports.paginatedResponse = paginatedResponse;
exports.notFoundResponse = notFoundResponse;
exports.unauthorizedResponse = unauthorizedResponse;
exports.forbiddenResponse = forbiddenResponse;
exports.validationErrorResponse = validationErrorResponse;
exports.serverErrorResponse = serverErrorResponse;
function successResponse(res, data, message, statusCode = 200) {
    const response = {
        success: true,
        data,
        message,
    };
    return res.status(statusCode).json(response);
}
function errorResponse(res, message, statusCode = 400, errors) {
    const response = {
        success: false,
        error: message,
        errors,
    };
    return res.status(statusCode).json(response);
}
function paginatedResponse(res, data, page, limit, total) {
    const totalPages = Math.ceil(total / limit);
    const response = {
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasMore: page < totalPages,
        },
    };
    return res.status(200).json({ success: true, ...response });
}
function notFoundResponse(res, resource = 'Resource') {
    return errorResponse(res, `${resource} not found`, 404);
}
function unauthorizedResponse(res, message = 'Unauthorized') {
    return errorResponse(res, message, 401);
}
function forbiddenResponse(res, message = 'Forbidden') {
    return errorResponse(res, message, 403);
}
function validationErrorResponse(res, errors) {
    return errorResponse(res, 'Validation failed', 400, errors);
}
function serverErrorResponse(res, error) {
    console.error('Server error:', error);
    return errorResponse(res, process.env.NODE_ENV === 'development' && error
        ? error.message
        : 'Internal server error', 500);
}
//# sourceMappingURL=response.js.map