export interface UploadResult {
    url: string;
    publicId: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
}
export interface UploadOptions {
    folder?: string;
    transformation?: {
        width?: number;
        height?: number;
        crop?: string;
        quality?: number;
    };
}
export declare class UploadService {
    /**
     * Upload single image to Supabase Storage
     */
    uploadImage(file: Express.Multer.File, options?: UploadOptions): Promise<UploadResult>;
    /**
     * Local storage upload (fallback when Supabase fails or not configured)
     */
    private localUpload;
    /**
     * Upload multiple images
     */
    uploadImages(files: Express.Multer.File[], options?: UploadOptions): Promise<UploadResult[]>;
    /**
     * Delete image by public ID
     */
    deleteImage(publicId: string): Promise<boolean>;
    /**
     * Supabase storage delete
     */
    private supabaseDelete;
    /**
     * Local storage delete
     */
    private localDelete;
    /**
     * Delete multiple images
     */
    deleteImages(publicIds: string[]): Promise<{
        deleted: string[];
        failed: string[];
    }>;
    /**
     * Get optimized URL (for Supabase, returns the same URL as no transformations are available)
     * For image transformations, consider using Supabase Image Transformation or a CDN
     */
    getOptimizedUrl(publicId: string, _options?: {
        width?: number;
        height?: number;
        crop?: string;
        quality?: number;
        format?: string;
    }): string;
    /**
     * Generate thumbnail URL (same as optimized URL for Supabase)
     */
    getThumbnailUrl(publicId: string, _size?: number): string;
}
export declare const uploadService: UploadService;
//# sourceMappingURL=upload.service.d.ts.map