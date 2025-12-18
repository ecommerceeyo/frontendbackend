"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.getProfile = getProfile;
exports.changePassword = changePassword;
exports.createAdmin = createAdmin;
exports.getAdmins = getAdmins;
exports.getAdmin = getAdmin;
exports.updateAdmin = updateAdmin;
exports.deleteAdmin = deleteAdmin;
const auth_service_1 = require("./auth.service");
const response_1 = require("../../utils/response");
/**
 * Admin login
 */
async function login(req, res, next) {
    try {
        const result = await auth_service_1.authService.login(req.body);
        return (0, response_1.successResponse)(res, result, 'Login successful');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get current admin profile
 */
async function getProfile(req, res, next) {
    try {
        const profile = await auth_service_1.authService.getProfile(req.admin.id);
        return (0, response_1.successResponse)(res, profile);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Change password
 */
async function changePassword(req, res, next) {
    try {
        const { currentPassword, newPassword } = req.body;
        await auth_service_1.authService.changePassword(req.admin.id, currentPassword, newPassword);
        return (0, response_1.successResponse)(res, null, 'Password changed successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Create new admin (super admin only)
 */
async function createAdmin(req, res, next) {
    try {
        const admin = await auth_service_1.authService.createAdmin(req.body, req.admin.id);
        return (0, response_1.successResponse)(res, admin, 'Admin created successfully', 201);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get all admins (super admin only)
 */
async function getAdmins(req, res, next) {
    try {
        const admins = await auth_service_1.authService.getAdmins();
        return (0, response_1.successResponse)(res, admins);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get admin by ID (super admin only)
 */
async function getAdmin(req, res, next) {
    try {
        const admin = await auth_service_1.authService.getAdminById(req.params.id);
        return (0, response_1.successResponse)(res, admin);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Update admin (super admin only)
 */
async function updateAdmin(req, res, next) {
    try {
        const admin = await auth_service_1.authService.updateAdmin(req.params.id, req.body, req.admin.id);
        return (0, response_1.successResponse)(res, admin, 'Admin updated successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Delete admin (super admin only)
 */
async function deleteAdmin(req, res, next) {
    try {
        await auth_service_1.authService.deleteAdmin(req.params.id, req.admin.id);
        return (0, response_1.successResponse)(res, null, 'Admin deleted successfully');
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=auth.controller.js.map