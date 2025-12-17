import { Request, Response, NextFunction } from 'express';
/**
 * Middleware to sanitize request body
 */
export declare function sanitizeBody(req: Request, _res: Response, next: NextFunction): void;
/**
 * Middleware to sanitize query parameters
 */
export declare function sanitizeQuery(req: Request, _res: Response, next: NextFunction): void;
/**
 * Combined sanitization middleware
 */
export declare function sanitize(req: Request, res: Response, next: NextFunction): void;
/**
 * Strip HTML tags from string
 */
export declare function stripHtml(str: string): string;
/**
 * Normalize whitespace
 */
export declare function normalizeWhitespace(str: string): string;
/**
 * Sanitize filename
 */
export declare function sanitizeFilename(filename: string): string;
//# sourceMappingURL=sanitize.d.ts.map