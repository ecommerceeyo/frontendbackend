import { ZodError } from 'zod';
import { validationErrorResponse } from '../utils/response';
/**
 * Middleware to validate request data using Zod schemas
 */
export function validate(schema, target = 'body') {
    return async (req, res, next) => {
        try {
            const data = req[target];
            const validated = await schema.parseAsync(data);
            req[target] = validated;
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                const errors = error.errors.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                }));
                return validationErrorResponse(res, errors);
            }
            next(error);
        }
    };
}
/**
 * Middleware to validate multiple targets at once
 */
export function validateRequest(options) {
    return async (req, res, next) => {
        try {
            const errors = [];
            if (options.body) {
                try {
                    req.body = await options.body.parseAsync(req.body);
                }
                catch (error) {
                    if (error instanceof ZodError) {
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
                    if (error instanceof ZodError) {
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
                    if (error instanceof ZodError) {
                        errors.push(...error.errors.map((e) => ({
                            field: `params.${e.path.join('.')}`,
                            message: e.message,
                        })));
                    }
                }
            }
            if (errors.length > 0) {
                return validationErrorResponse(res, errors);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=validate.js.map