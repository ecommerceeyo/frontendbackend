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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController = __importStar(require("./auth.controller"));
const validate_1 = require("../../middleware/validate");
const auth_1 = require("../../middleware/auth");
const rateLimit_1 = require("../../middleware/rateLimit");
const validations_1 = require("../../validations");
const router = (0, express_1.Router)();
/**
 * @route   POST /api/admin/auth/login
 * @desc    Admin login
 * @access  Public
 */
router.post('/login', rateLimit_1.authLimiter, (0, validate_1.validate)(validations_1.loginSchema, 'body'), authController.login);
/**
 * @route   GET /api/admin/auth/profile
 * @desc    Get current admin profile
 * @access  Admin
 */
router.get('/profile', auth_1.authenticate, authController.getProfile);
/**
 * @route   PUT /api/admin/auth/password
 * @desc    Change password
 * @access  Admin
 */
router.put('/password', auth_1.authenticate, (0, validate_1.validate)(validations_1.changePasswordSchema, 'body'), authController.changePassword);
// ============================================
// SUPER ADMIN ROUTES
// ============================================
/**
 * @route   POST /api/admin/auth/admins
 * @desc    Create new admin
 * @access  Super Admin
 */
router.post('/admins', auth_1.authenticate, (0, auth_1.requireRole)('SUPER_ADMIN'), (0, validate_1.validate)(validations_1.createAdminSchema, 'body'), authController.createAdmin);
/**
 * @route   GET /api/admin/auth/admins
 * @desc    Get all admins
 * @access  Super Admin
 */
router.get('/admins', auth_1.authenticate, (0, auth_1.requireRole)('SUPER_ADMIN'), authController.getAdmins);
/**
 * @route   GET /api/admin/auth/admins/:id
 * @desc    Get admin by ID
 * @access  Super Admin
 */
router.get('/admins/:id', auth_1.authenticate, (0, auth_1.requireRole)('SUPER_ADMIN'), (0, validate_1.validate)(validations_1.idParamsSchema, 'params'), authController.getAdmin);
/**
 * @route   PUT /api/admin/auth/admins/:id
 * @desc    Update admin
 * @access  Super Admin
 */
router.put('/admins/:id', auth_1.authenticate, (0, auth_1.requireRole)('SUPER_ADMIN'), (0, validate_1.validate)(validations_1.idParamsSchema, 'params'), (0, validate_1.validate)(validations_1.updateAdminSchema, 'body'), authController.updateAdmin);
/**
 * @route   DELETE /api/admin/auth/admins/:id
 * @desc    Delete admin
 * @access  Super Admin
 */
router.delete('/admins/:id', auth_1.authenticate, (0, auth_1.requireRole)('SUPER_ADMIN'), (0, validate_1.validate)(validations_1.idParamsSchema, 'params'), authController.deleteAdmin);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map