"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
exports.validateRequest = validateRequest;
const zod_1 = require("zod");
const response_1 = require("../utils/response");
/**
 * Middleware to validate request data using Zod schemas
 */
function validate(schema, target = 'body') {
    return async (req, res, next) => {
        try {
            const data = req[target];
            const validated = await schema.parseAsync(data);
            req[target] = validated;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errors = error.errors.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                }));
                return (0, response_1.validationErrorResponse)(res, errors);
            }
            next(error);
        }
    };
}
/**
 * Middleware to validate multiple targets at once
 */
function validateRequest(options) {
    return async (req, res, next) => {
        try {
            const errors = [];
            if (options.body) {
                try {
                    req.body = await options.body.parseAsync(req.body);
                }
                catch (error) {
                    if (error instanceof zod_1.ZodError) {
                        errors.push(...error.errors.map((e) => ({
                            field: `body.${e.path.join('.')}`,
                            message: e.message,
                        })));
                    }
                }
            }
            if (options.query) {
                try {
                    req.query = await options.query.parseAsync(req.query);
                }
                catch (error) {
                    if (error instanceof zod_1.ZodError) {
                        errors.push(...error.errors.map((e) => ({
                            field: `query.${e.path.join('.')}`,
                            message: e.message,
                        })));
                    }
                }
            }
            if (options.params) {
                try {
                    req.params = await options.params.parseAsync(req.params);
                }
                catch (error) {
                    if (error instanceof zod_1.ZodError) {
                        errors.push(...error.errors.map((e) => ({
                            field: `params.${e.path.join('.')}`,
                            message: e.message,
                        })));
                    }
                }
            }
            if (errors.length > 0) {
                return (0, response_1.validationErrorResponse)(res, errors);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=validate.js.map