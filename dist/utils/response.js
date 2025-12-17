export function successResponse(res, data, message, statusCode = 200) {
    const response = {
        success: true,
        data,
        message,
    };
    return res.status(statusCode).json(response);
}
export function errorResponse(res, message, statusCode = 400, errors) {
    const response = {
        success: false,
        error: message,
        errors,
    };
    return res.status(statusCode).json(response);
}
export function paginatedResponse(res, data, page, limit, total) {
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
export function notFoundResponse(res, resource = 'Resource') {
    return errorResponse(res, `${resource} not found`, 404);
}
export function unauthorizedResponse(res, message = 'Unauthorized') {
    return errorResponse(res, message, 401);
}
export function forbiddenResponse(res, message = 'Forbidden') {
    return errorResponse(res, message, 403);
}
export function validationErrorResponse(res, errors) {
    return errorResponse(res, 'Validation failed', 400, errors);
}
export function serverErrorResponse(res, error) {
    console.error('Server error:', error);
    return errorResponse(res, process.env.NODE_ENV === 'development' && error
        ? error.message
        : 'Internal server error', 500);
}
//# sourceMappingURL=response.js.map