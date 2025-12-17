import { Response } from 'express';
export declare function successResponse<T>(res: Response, data: T, message?: string, statusCode?: number): Response;
export declare function errorResponse(res: Response, message: string, statusCode?: number, errors?: Array<{
    field: string;
    message: string;
}>): Response;
export declare function paginatedResponse<T>(res: Response, data: T[], page: number, limit: number, total: number): Response;
export declare function notFoundResponse(res: Response, resource?: string): Response;
export declare function unauthorizedResponse(res: Response, message?: string): Response;
export declare function forbiddenResponse(res: Response, message?: string): Response;
export declare function validationErrorResponse(res: Response, errors: Array<{
    field: string;
    message: string;
}>): Response;
export declare function serverErrorResponse(res: Response, error?: Error): Response;
//# sourceMappingURL=response.d.ts.map