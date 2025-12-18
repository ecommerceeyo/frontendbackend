"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadService = exports.UploadService = void 0;
const supabase_1 = require("../../config/supabase");
const config_1 = __importDefault(require("../../config"));
const errorHandler_1 = require("../../middleware/errorHandler");
const logger_1 = __importDefault(require("../../utils/logger"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
class UploadService {
    /**
     * Upload single image to Supabase Storage
     */
    async uploadImage(file, options = {}) {
        const folder = options.folder || 'products';
        // Use local storage if Supabase is not configured
        if (!(0, supabase_1.isSupabaseConfigured)()) {
            logger_1.default.warn('Supabase not configured, falling back to local storage');
            return this.localUpload(file, folder);
        }
        try {
            // Generate unique filename
            const uniqueId = crypto_1.default.randomBytes(8).toString('hex');
            const ext = path_1.default.extname(file.originalname).toLowerCase() || '.jpg';
            const filename = `${uniqueId}${ext}`;
            const filePath = `${folder}/${filename}`;
            // Upload to Supabase Storage
            const { data, error } = await supabase_1.supabase.storage
                .from(supabase_1.STORAGE_BUCKET)
                .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                cacheControl: '3600',
                upsert: false,
            });
            if (error) {
                logger_1.default.error('Supabase upload error:', error);
                throw new errorHandler_1.AppError(`Upload failed: ${error.message}`, 500);
            }
            // Get public URL
            const { data: urlData } = supabase_1.supabase.storage
                .from(supabase_1.STORAGE_BUCKET)
                .getPublicUrl(filePath);
            logger_1.default.info(`Supabase upload successful: ${urlData.publicUrl}`);
            return {
                url: urlData.publicUrl,
                publicId: `supabase:${filePath}`,
                width: 800, // Supabase doesn't return dimensions
                height: 600,
                format: ext.replace('.', ''),
                bytes: file.size,
            };
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError) {
                throw error;
            }
            // Fallback to local storage if Supabase fails
            logger_1.default.warn('Supabase upload failed, falling back to local storage:', error);
            return this.localUpload(file, folder);
        }
    }
    /**
     * Local storage upload (fallback when Supabase fails or not configured)
     */
    async localUpload(file, folder) {
        try {
            // Create uploads directory if it doesn't exist
            const uploadsDir = path_1.default.join(process.cwd(), 'public', 'uploads', folder);
            if (!fs_1.default.existsSync(uploadsDir)) {
                fs_1.default.mkdirSync(uploadsDir, { recursive: true });
            }
            // Generate unique filename
            const uniqueId = crypto_1.default.randomBytes(8).toString('hex');
            const ext = path_1.default.extname(file.originalname).toLowerCase() || '.jpg';
            const filename = `${uniqueId}${ext}`;
            const filepath = path_1.default.join(uploadsDir, filename);
            // Write file to disk
            fs_1.default.writeFileSync(filepath, file.buffer);
            // Return result with local prefix to identify local uploads
            const publicId = `local:${folder}/${uniqueId}`;
            const url = `http://localhost:${config_1.default.port}/uploads/${folder}/${filename}`;
            logger_1.default.info(`Local upload saved: ${url}`);
            return {
                url,
                publicId,
                width: 800,
                height: 600,
                format: ext.replace('.', ''),
                bytes: file.size,
            };
        }
        catch (error) {
            logger_1.default.error('Local upload error:', error);
            throw new errorHandler_1.AppError('Failed to upload image', 500);
        }
    }
    /**
     * Upload multiple images
     */
    async uploadImages(files, options = {}) {
        if (files.length > config_1.default.maxImagesPerProduct) {
            throw new errorHandler_1.AppError(`Maximum ${config_1.default.maxImagesPerProduct} images allowed`, 400);
        }
        const results = await Promise.all(files.map((file) => this.uploadImage(file, options)));
        return results;
    }
    /**
     * Delete image by public ID
     */
    async deleteImage(publicId) {
        // Check if it's a local upload (prefixed with "local:")
        if (publicId.startsWith('local:')) {
            return this.localDelete(publicId.replace('local:', ''));
        }
        // Check if it's a Supabase upload (prefixed with "supabase:")
        if (publicId.startsWith('supabase:')) {
            return this.supabaseDelete(publicId.replace('supabase:', ''));
        }
        // Try Supabase delete for legacy uploads without prefix
        if ((0, supabase_1.isSupabaseConfigured)()) {
            return this.supabaseDelete(publicId);
        }
        // Fallback to local delete
        return this.localDelete(publicId);
    }
    /**
     * Supabase storage delete
     */
    async supabaseDelete(filePath) {
        try {
            const { error } = await supabase_1.supabase.storage
                .from(supabase_1.STORAGE_BUCKET)
                .remove([filePath]);
            if (error) {
                logger_1.default.error('Supabase delete error:', error);
                return false;
            }
            logger_1.default.info(`Supabase delete successful: ${filePath}`);
            return true;
        }
        catch (error) {
            logger_1.default.error('Supabase delete error:', error);
            return false;
        }
    }
    /**
     * Local storage delete
     */
    localDelete(publicId) {
        try {
            // Find and delete the file from local storage
            const uploadsDir = path_1.default.join(process.cwd(), 'public', 'uploads');
            const parts = publicId.split('/');
            const folder = parts[0];
            const fileId = parts[1];
            // Try to find and delete file with any extension
            const folderPath = path_1.default.join(uploadsDir, folder);
            if (fs_1.default.existsSync(folderPath)) {
                const files = fs_1.default.readdirSync(folderPath);
                const matchingFile = files.find(f => f.startsWith(fileId));
                if (matchingFile) {
                    fs_1.default.unlinkSync(path_1.default.join(folderPath, matchingFile));
                    logger_1.default.info(`Local delete: ${publicId}`);
                    return true;
                }
            }
            return true; // Return true even if file not found (already deleted)
        }
        catch (error) {
            logger_1.default.error('Local delete error:', error);
            return false;
        }
    }
    /**
     * Delete multiple images
     */
    async deleteImages(publicIds) {
        const results = {
            deleted: [],
            failed: [],
        };
        await Promise.all(publicIds.map(async (publicId) => {
            try {
                const success = await this.deleteImage(publicId);
                if (success) {
                    results.deleted.push(publicId);
                }
                else {
                    results.failed.push(publicId);
                }
            }
            catch {
                results.failed.push(publicId);
            }
        }));
        return results;
    }
    /**
     * Get optimized URL (for Supabase, returns the same URL as no transformations are available)
     * For image transformations, consider using Supabase Image Transformation or a CDN
     */
    getOptimizedUrl(publicId, _options = {}) {
        // Supabase Storage doesn't have built-in transformations
        // Return the public URL directly
        if (publicId.startsWith('supabase:')) {
            const filePath = publicId.replace('supabase:', '');
            const { data } = supabase_1.supabase.storage
                .from(supabase_1.STORAGE_BUCKET)
                .getPublicUrl(filePath);
            return data.publicUrl;
        }
        // For local files, return as-is
        return publicId;
    }
    /**
     * Generate thumbnail URL (same as optimized URL for Supabase)
     */
    getThumbnailUrl(publicId, _size = 150) {
        return this.getOptimizedUrl(publicId);
    }
}
exports.UploadService = UploadService;
exports.uploadService = new UploadService();
//# sourceMappingURL=upload.service.js.map