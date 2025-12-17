import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types';
/**
 * Get all specification templates
 */
export declare function getSpecificationTemplates(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get specification template by ID
 */
export declare function getSpecificationTemplate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get specification templates by group
 */
export declare function getSpecificationsByGroup(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get all unique groups
 */
export declare function getSpecificationGroups(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Create a new specification template
 */
export declare function createSpecificationTemplate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Update a specification template
 */
export declare function updateSpecificationTemplate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Delete a specification template
 */
export declare function deleteSpecificationTemplate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=specification.controller.d.ts.map