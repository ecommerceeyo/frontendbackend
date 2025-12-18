"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = uploadImage;
exports.uploadImages = uploadImages;
exports.deleteImage = deleteImage;
exports.deleteImages = deleteImages;
const upload_service_1 = require("./upload.service");
const response_1 = require("../../utils/response");
const validations_1 = require("../../validations");
/**
 * Upload single image
 */
async function uploadImage(req, res, next) {
    try {
        if (!req.file) {
            return (0, response_1.errorResponse)(res, 'No file uploaded', 400);
        }
        // Validate file
        const validation = (0, validations_1.validateImageFile)(req.file);
        if (!validation.valid) {
            return (0, response_1.errorResponse)(res, validation.error || 'Invalid file', 400);
        }
        const { folder, transformation } = req.body;
        const result = await upload_service_1.uploadService.uploadImage(req.file, {
            folder,
            transformation: transformation ? JSON.parse(transformation) : undefined,
        });
        return (0, response_1.successResponse)(res, result, 'Image uploaded successfully', 201);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Upload multiple images
 */
async function uploadImages(req, res, next) {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return (0, response_1.errorResponse)(res, 'No files uploaded', 400);
        }
        // Validate all files
        for (const file of files) {
            const validation = (0, validations_1.validateImageFile)(file);
            if (!validation.valid) {
                return (0, response_1.errorResponse)(res, `${file.originalname}: ${validation.error}`, 400);
            }
        }
        const { folder, transformation } = req.body;
        const results = await upload_service_1.uploadService.uploadImages(files, {
            folder,
            transformation: transformation ? JSON.parse(transformation) : undefined,
        });
        return (0, response_1.successResponse)(res, results, 'Images uploaded successfully', 201);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Delete image
 */
async function deleteImage(req, res, next) {
    try {
        const { publicId } = req.body;
        if (!publicId) {
            return (0, response_1.errorResponse)(res, 'Public ID is required', 400);
        }
        const success = await upload_service_1.uploadService.deleteImage(publicId);
        if (success) {
            return (0, response_1.successResponse)(res, null, 'Image deleted successfully');
        }
        else {
            return (0, response_1.errorResponse)(res, 'Failed to delete image', 500);
        }
    }
    catch (error) {
        next(error);
    }
}
/**
 * Delete multiple images
 */
async function deleteImages(req, res, next) {
    try {
        const { publicIds } = req.body;
        if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
            return (0, response_1.errorResponse)(res, 'Public IDs array is required', 400);
        }
        const results = await upload_service_1.uploadService.deleteImages(publicIds);
        return (0, response_1.successResponse)(res, results, 'Images deletion completed');
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=upload.controller.js.map