import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
type ValidationTarget = 'body' | 'query' | 'params';
interface ValidateOptions {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
}
/**
 * Middleware to validate request data using Zod schemas
 */
export declare function validate(schema: ZodSchema, target?: ValidationTarget): (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
/**
 * Middleware to validate multiple targets at once
 */
export declare function validateRequest(options: ValidateOptions): (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=validate.d.ts.map