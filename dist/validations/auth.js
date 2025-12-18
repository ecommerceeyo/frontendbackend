"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.resetPasswordRequestSchema = exports.changePasswordSchema = exports.updateAdminSchema = exports.createAdminSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("./common");
const client_1 = require("@prisma/client");
// Login schema
exports.loginSchema = zod_1.z.object({
    email: common_1.emailSchema,
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
// Create admin schema
exports.createAdminSchema = zod_1.z.object({
    email: common_1.emailSchema,
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    name: zod_1.z.string().min(1, 'Name is required').max(100),
    role: zod_1.z.nativeEnum(client_1.AdminRole).default('ADMIN'),
});
// Update admin schema
exports.updateAdminSchema = zod_1.z.object({
    email: common_1.emailSchema.optional(),
    name: zod_1.z.string().min(1).max(100).optional(),
    role: zod_1.z.nativeEnum(client_1.AdminRole).optional(),
    active: zod_1.z.boolean().optional(),
});
// Change password schema
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, 'Current password is required'),
    newPassword: zod_1.z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: zod_1.z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
// Reset password request schema
exports.resetPasswordRequestSchema = zod_1.z.object({
    email: common_1.emailSchema,
});
// Reset password schema
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, 'Reset token is required'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: zod_1.z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
//# sourceMappingURL=auth.js.map