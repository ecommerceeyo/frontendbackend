"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierAuthService = exports.SupplierAuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../../config/database"));
const config_1 = __importDefault(require("../../config"));
const errorHandler_1 = require("../../middleware/errorHandler");
const helpers_1 = require("../../utils/helpers");
class SupplierAuthService {
    /**
     * Login supplier admin
     */
    async login(data) {
        const supplierAdmin = await database_1.default.supplierAdmin.findUnique({
            where: { email: data.email },
            include: {
                supplier: true,
            },
        });
        if (!supplierAdmin) {
            throw new errorHandler_1.UnauthorizedError('Invalid email or password');
        }
        if (!supplierAdmin.active) {
            throw new errorHandler_1.UnauthorizedError('Your account has been deactivated');
        }
        if (supplierAdmin.supplier.status !== 'ACTIVE') {
            throw new errorHandler_1.UnauthorizedError('Your supplier account is not active');
        }
        const isPasswordValid = await bcryptjs_1.default.compare(data.password, supplierAdmin.passwordHash);
        if (!isPasswordValid) {
            throw new errorHandler_1.UnauthorizedError('Invalid email or password');
        }
        // Update last login
        await database_1.default.supplierAdmin.update({
            where: { id: supplierAdmin.id },
            data: { lastLoginAt: new Date() },
        });
        // Generate token
        const tokenPayload = {
            type: 'supplier',
            supplierAdminId: supplierAdmin.id,
            supplierId: supplierAdmin.supplierId,
            email: supplierAdmin.email,
            role: supplierAdmin.role,
        };
        const token = jsonwebtoken_1.default.sign(tokenPayload, config_1.default.jwtSecret, {
            expiresIn: config_1.default.jwtExpiresIn,
        });
        return {
            token,
            supplierAdmin: {
                id: supplierAdmin.id,
                email: supplierAdmin.email,
                name: supplierAdmin.name,
                phone: supplierAdmin.phone,
                role: supplierAdmin.role,
            },
            supplier: {
                id: supplierAdmin.supplier.id,
                name: supplierAdmin.supplier.name,
                businessName: supplierAdmin.supplier.businessName,
                slug: supplierAdmin.supplier.slug,
                logo: supplierAdmin.supplier.logo,
                status: supplierAdmin.supplier.status,
                verified: supplierAdmin.supplier.verified,
            },
        };
    }
    /**
     * Register new supplier with owner account
     */
    async register(data) {
        const slug = (0, helpers_1.slugify)(data.supplierName);
        // Check if supplier email or slug exists
        const existingSupplier = await database_1.default.supplier.findFirst({
            where: {
                OR: [{ email: data.email }, { slug }],
            },
        });
        if (existingSupplier) {
            if (existingSupplier.email === data.email) {
                throw new Error('A supplier with this email already exists');
            }
            throw new Error('A supplier with this name already exists');
        }
        // Check if admin email exists
        const existingAdmin = await database_1.default.supplierAdmin.findUnique({
            where: { email: data.email },
        });
        if (existingAdmin) {
            throw new Error('An account with this email already exists');
        }
        // Hash password
        const passwordHash = await bcryptjs_1.default.hash(data.ownerPassword, 12);
        // Create supplier and owner in transaction
        const result = await database_1.default.$transaction(async (tx) => {
            const supplier = await tx.supplier.create({
                data: {
                    name: data.supplierName,
                    slug,
                    email: data.email,
                    phone: data.phone,
                    whatsapp: data.whatsapp,
                    description: data.description,
                    businessName: data.businessName,
                    businessAddress: data.businessAddress,
                    city: data.city,
                    region: data.region,
                    taxId: data.taxId,
                    status: 'PENDING',
                    commissionRate: 10, // Default commission
                },
            });
            const supplierAdmin = await tx.supplierAdmin.create({
                data: {
                    supplierId: supplier.id,
                    email: data.email,
                    passwordHash,
                    name: data.ownerName,
                    phone: data.ownerPhone,
                    role: 'OWNER',
                },
            });
            return { supplier, supplierAdmin };
        });
        return {
            message: 'Registration successful. Your account is pending approval.',
            supplier: {
                id: result.supplier.id,
                name: result.supplier.name,
                slug: result.supplier.slug,
                status: result.supplier.status,
            },
            supplierAdmin: {
                id: result.supplierAdmin.id,
                email: result.supplierAdmin.email,
                name: result.supplierAdmin.name,
                role: result.supplierAdmin.role,
            },
        };
    }
    /**
     * Get current supplier admin info
     */
    async getMe(supplierAdminId) {
        const supplierAdmin = await database_1.default.supplierAdmin.findUnique({
            where: { id: supplierAdminId },
            include: {
                supplier: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        logo: true,
                        banner: true,
                        email: true,
                        phone: true,
                        description: true,
                        businessName: true,
                        businessAddress: true,
                        city: true,
                        region: true,
                        status: true,
                        verified: true,
                        commissionRate: true,
                        createdAt: true,
                    },
                },
            },
        });
        if (!supplierAdmin) {
            throw new errorHandler_1.NotFoundError('Supplier admin');
        }
        return {
            id: supplierAdmin.id,
            email: supplierAdmin.email,
            name: supplierAdmin.name,
            phone: supplierAdmin.phone,
            role: supplierAdmin.role,
            supplier: supplierAdmin.supplier,
        };
    }
    /**
     * Change password
     */
    async changePassword(supplierAdminId, currentPassword, newPassword) {
        const supplierAdmin = await database_1.default.supplierAdmin.findUnique({
            where: { id: supplierAdminId },
        });
        if (!supplierAdmin) {
            throw new errorHandler_1.NotFoundError('Supplier admin');
        }
        const isPasswordValid = await bcryptjs_1.default.compare(currentPassword, supplierAdmin.passwordHash);
        if (!isPasswordValid) {
            throw new errorHandler_1.UnauthorizedError('Current password is incorrect');
        }
        const passwordHash = await bcryptjs_1.default.hash(newPassword, 12);
        await database_1.default.supplierAdmin.update({
            where: { id: supplierAdminId },
            data: { passwordHash },
        });
        return { message: 'Password changed successfully' };
    }
    /**
     * Create supplier staff (OWNER only)
     */
    async createStaff(supplierId, data) {
        // Check if email exists
        const existingAdmin = await database_1.default.supplierAdmin.findUnique({
            where: { email: data.email },
        });
        if (existingAdmin) {
            throw new Error('An account with this email already exists');
        }
        const passwordHash = await bcryptjs_1.default.hash(data.password, 12);
        const supplierAdmin = await database_1.default.supplierAdmin.create({
            data: {
                supplierId,
                email: data.email,
                passwordHash,
                name: data.name,
                phone: data.phone,
                role: data.role === 'OWNER' ? 'MANAGER' : data.role, // Can't create another owner
            },
        });
        return {
            id: supplierAdmin.id,
            email: supplierAdmin.email,
            name: supplierAdmin.name,
            phone: supplierAdmin.phone,
            role: supplierAdmin.role,
            createdAt: supplierAdmin.createdAt,
        };
    }
    /**
     * List supplier staff
     */
    async getStaff(supplierId) {
        const staff = await database_1.default.supplierAdmin.findMany({
            where: { supplierId },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                active: true,
                lastLoginAt: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'asc' },
        });
        return staff;
    }
    /**
     * Update staff status
     */
    async updateStaffStatus(supplierId, staffId, active) {
        const staff = await database_1.default.supplierAdmin.findFirst({
            where: { id: staffId, supplierId },
        });
        if (!staff) {
            throw new errorHandler_1.NotFoundError('Staff member');
        }
        if (staff.role === 'OWNER') {
            throw new Error('Cannot deactivate owner account');
        }
        await database_1.default.supplierAdmin.update({
            where: { id: staffId },
            data: { active },
        });
        return { message: `Staff ${active ? 'activated' : 'deactivated'} successfully` };
    }
    /**
     * Delete staff
     */
    async deleteStaff(supplierId, staffId) {
        const staff = await database_1.default.supplierAdmin.findFirst({
            where: { id: staffId, supplierId },
        });
        if (!staff) {
            throw new errorHandler_1.NotFoundError('Staff member');
        }
        if (staff.role === 'OWNER') {
            throw new Error('Cannot delete owner account');
        }
        await database_1.default.supplierAdmin.delete({
            where: { id: staffId },
        });
        return { message: 'Staff deleted successfully' };
    }
}
exports.SupplierAuthService = SupplierAuthService;
exports.supplierAuthService = new SupplierAuthService();
//# sourceMappingURL=supplier-auth.service.js.map