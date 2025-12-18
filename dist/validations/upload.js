"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maxFileSize = exports.allowedImageTypes = exports.bulkDeleteImagesSchema = exports.deleteImageSchema = exports.uploadImageSchema = void 0;
exports.validateImageFile = validateImageFile;
const zod_1 = require("zod");
// Upload image schema
exports.uploadImageSchema = zod_1.z.object({
    folder: zod_1.z.string().optional().default('products'),
    transformation: zod_1.z
        .object({
        width: zod_1.z.coerce.number().int().positive().optional(),
        height: zod_1.z.coerce.number().int().positive().optional(),
        crop: zod_1.z.string().optional(),
        quality: zod_1.z.coerce.number().int().min(1).max(100).optional(),
    })
        .optional(),
});
// Delete image schema
exports.deleteImageSchema = zod_1.z.object({
    publicId: zod_1.z.string().min(1, 'Public ID is required'),
});
// Bulk delete images schema
exports.bulkDeleteImagesSchema = zod_1.z.object({
    publicIds: zod_1.z.array(zod_1.z.string()).min(1, 'At least one public ID is required'),
});
// Upload validation
exports.allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
exports.maxFileSize = 5 * 1024 * 1024; // 5MB
function validateImageFile(file) {
    if (!exports.allowedImageTypes.includes(file.mimetype)) {
        return {
            valid: false,
            error: `Invalid file type. Allowed types: ${exports.allowedImageTypes.join(', ')}`,
        };
    }
    if (file.size > exports.maxFileSize) {
        return {
            valid: false,
            error: `File size exceeds maximum allowed size of ${exports.maxFileSize / (1024 * 1024)}MB`,
        };
    }
    return { valid: true };
}
//# sourceMappingURL=upload.js.map