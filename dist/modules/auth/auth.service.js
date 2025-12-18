"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const database_1 = __importDefault(require("../../config/database"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const client_1 = require("@prisma/client");
const errorHandler_1 = require("../../middleware/errorHandler");
class AuthService {
    /**
     * Admin login
     */
    async login(data) {
        const admin = await database_1.default.admin.findUnique({
            where: { email: data.email },
        });
        if (!admin) {
            throw new errorHandler_1.UnauthorizedError('Invalid email or password');
        }
        if (!admin.active) {
            throw new errorHandler_1.UnauthorizedError('Account is disabled');
        }
        const isValidPassword = await bcryptjs_1.default.compare(data.password, admin.passwordHash);
        if (!isValidPassword) {
            throw new errorHandler_1.UnauthorizedError('Invalid email or password');
        }
        // Update last login
        await database_1.default.admin.update({
            where: { id: admin.id },
            data: { lastLoginAt: new Date() },
        });
        // Generate token
        const token = this.generateToken(admin);
        // Create audit log
        await database_1.default.auditLog.create({
            data: {
                adminId: admin.id,
                action: 'LOGIN',
                entity: 'Admin',
                entityId: admin.id,
            },
        });
        return {
            token,
            admin: {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
            },
        };
    }
    /**
     * Create a new admin
     */
    async createAdmin(data, createdBy) {
        const existingAdmin = await database_1.default.admin.findUnique({
            where: { email: data.email },
        });
        if (existingAdmin) {
            throw new errorHandler_1.AppError('An admin with this email already exists', 409);
        }
        const passwordHash = await bcryptjs_1.default.hash(data.password, 10);
        const admin = await database_1.default.admin.create({
            data: {
                email: data.email,
                passwordHash,
                name: data.name,
                role: data.role || client_1.AdminRole.ADMIN,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                active: true,
                createdAt: true,
            },
        });
        // Create audit log
        if (createdBy) {
            await database_1.default.auditLog.create({
                data: {
                    adminId: createdBy,
                    action: 'CREATE',
                    entity: 'Admin',
                    entityId: admin.id,
                    newValues: { email: admin.email, name: admin.name, role: admin.role },
                },
            });
        }
        return admin;
    }
    /**
     * Get admin by ID
     */
    async getAdminById(id) {
        const admin = await database_1.default.admin.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                active: true,
                lastLoginAt: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!admin) {
            throw new errorHandler_1.NotFoundError('Admin');
        }
        return admin;
    }
    /**
     * Get all admins
     */
    async getAdmins() {
        return database_1.default.admin.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                active: true,
                lastLoginAt: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    /**
     * Update admin
     */
    async updateAdmin(id, data, updatedBy) {
        const admin = await database_1.default.admin.findUnique({ where: { id } });
        if (!admin) {
            throw new errorHandler_1.NotFoundError('Admin');
        }
        // Check email uniqueness if updating email
        if (data.email && data.email !== admin.email) {
            const existingAdmin = await database_1.default.admin.findUnique({
                where: { email: data.email },
            });
            if (existingAdmin) {
                throw new errorHandler_1.AppError('An admin with this email already exists', 409);
            }
        }
        const oldValues = { email: admin.email, name: admin.name, role: admin.role, active: admin.active };
        const updatedAdmin = await database_1.default.admin.update({
            where: { id },
            data,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                active: true,
                updatedAt: true,
            },
        });
        // Create audit log
        await database_1.default.auditLog.create({
            data: {
                adminId: updatedBy,
                action: 'UPDATE',
                entity: 'Admin',
                entityId: id,
                oldValues,
                newValues: data,
            },
        });
        return updatedAdmin;
    }
    /**
     * Change password
     */
    async changePassword(adminId, currentPassword, newPassword) {
        const admin = await database_1.default.admin.findUnique({ where: { id: adminId } });
        if (!admin) {
            throw new errorHandler_1.NotFoundError('Admin');
        }
        const isValidPassword = await bcryptjs_1.default.compare(currentPassword, admin.passwordHash);
        if (!isValidPassword) {
            throw new errorHandler_1.UnauthorizedError('Current password is incorrect');
        }
        const passwordHash = await bcryptjs_1.default.hash(newPassword, 10);
        await database_1.default.admin.update({
            where: { id: adminId },
            data: { passwordHash },
        });
        // Create audit log
        await database_1.default.auditLog.create({
            data: {
                adminId,
                action: 'PASSWORD_CHANGE',
                entity: 'Admin',
                entityId: adminId,
            },
        });
        return { success: true };
    }
    /**
     * Delete admin
     */
    async deleteAdmin(id, deletedBy) {
        const admin = await database_1.default.admin.findUnique({ where: { id } });
        if (!admin) {
            throw new errorHandler_1.NotFoundError('Admin');
        }
        if (admin.role === client_1.AdminRole.SUPER_ADMIN) {
            // Check if this is the last super admin
            const superAdminCount = await database_1.default.admin.count({
                where: { role: client_1.AdminRole.SUPER_ADMIN, active: true },
            });
            if (superAdminCount <= 1) {
                throw new errorHandler_1.AppError('Cannot delete the last super admin', 400);
            }
        }
        await database_1.default.admin.delete({ where: { id } });
        // Create audit log
        await database_1.default.auditLog.create({
            data: {
                adminId: deletedBy,
                action: 'DELETE',
                entity: 'Admin',
                entityId: id,
                oldValues: { email: admin.email, name: admin.name },
            },
        });
        return { success: true };
    }
    /**
     * Get current admin profile
     */
    async getProfile(adminId) {
        return this.getAdminById(adminId);
    }
    /**
     * Generate JWT token
     */
    generateToken(admin) {
        return jsonwebtoken_1.default.sign({
            adminId: admin.id,
            email: admin.email,
            role: admin.role,
        }, config_1.default.jwtSecret, { expiresIn: config_1.default.jwtExpiresIn });
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map