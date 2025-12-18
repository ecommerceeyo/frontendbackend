"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const uploadController = __importStar(require("./upload.controller"));
const auth_1 = require("../../middleware/auth");
const rateLimit_1 = require("../../middleware/rateLimit");
const config_1 = __importDefault(require("../../config"));
const router = (0, express_1.Router)();
// File filter for JPEG/JPG and PNG images only
const imageFileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const ext = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
        cb(null, true);
    }
    else {
        cb(new Error('Only JPEG and PNG images are allowed'));
    }
};
// Configure multer for memory storage
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: config_1.default.maxFileSize,
        files: config_1.default.maxImagesPerProduct,
    },
    fileFilter: imageFileFilter,
});
// All routes require authentication
router.use(auth_1.authenticate);
/**
 * @route   POST /api/admin/upload/image
 * @desc    Upload single image
 * @access  Admin
 */
router.post('/image', rateLimit_1.uploadLimiter, upload.single('image'), uploadController.uploadImage);
/**
 * @route   POST /api/admin/upload/images
 * @desc    Upload multiple images (max 6)
 * @access  Admin
 */
router.post('/images', rateLimit_1.uploadLimiter, upload.array('images', config_1.default.maxImagesPerProduct), uploadController.uploadImages);
/**
 * @route   DELETE /api/admin/upload/image
 * @desc    Delete image by public ID
 * @access  Admin
 */
router.delete('/image', uploadController.deleteImage);
/**
 * @route   DELETE /api/admin/upload/images
 * @desc    Delete multiple images
 * @access  Admin
 */
router.delete('/images', uploadController.deleteImages);
exports.default = router;
//# sourceMappingURL=upload.routes.js.map