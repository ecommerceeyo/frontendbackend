/**
 * Sanitize string input to prevent XSS
 */
function sanitizeString(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}
/**
 * Recursively sanitize an object
 */
function sanitizeObject(obj) {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            sanitized[key] = sanitizeString(value);
        }
        else if (Array.isArray(value)) {
            sanitized[key] = value.map((item) => {
                if (typeof item === 'string')
                    return sanitizeString(item);
                if (typeof item === 'object' && item !== null) {
                    return sanitizeObject(item);
                }
                return item;
            });
        }
        else if (typeof value === 'object' && value !== null) {
            sanitized[key] = sanitizeObject(value);
        }
        else {
            sanitized[key] = value;
        }
    }
    return sanitized;
}
/**
 * Middleware to sanitize request body
 */
export function sanitizeBody(req, _res, next) {
    if (req.body && typeof req.body === 'object') {
        req.body = sanitizeObject(req.body);
    }
    next();
}
/**
 * Middleware to sanitize query parameters
 */
export function sanitizeQuery(req, _res, next) {
    if (req.query && typeof req.query === 'object') {
        req.query = sanitizeObject(req.query);
    }
    next();
}
/**
 * Combined sanitization middleware
 */
export function sanitize(req, res, next) {
    sanitizeBody(req, res, () => {
        sanitizeQuery(req, res, next);
    });
}
/**
 * Strip HTML tags from string
 */
export function stripHtml(str) {
    return str.replace(/<[^>]*>/g, '');
}
/**
 * Normalize whitespace
 */
export function normalizeWhitespace(str) {
    return str.replace(/\s+/g, ' ').trim();
}
/**
 * Sanitize filename
 */
export function sanitizeFilename(filename) {
    return filename
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/_{2,}/g, '_')
        .toLowerCase();
}
//# sourceMappingURL=sanitize.js.map