import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types';
/**
 * Upload single image
 */
export declare function uploadImage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Upload multiple images
 */
export declare function uploadImages(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Delete image
 */
export declare function deleteImage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Delete multiple images
 */
export declare function deleteImages(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=upload.controller.d.ts.map