import { SupplierRole } from '@prisma/client';
export interface SupplierLoginData {
    email: string;
    password: string;
}
export interface SupplierRegisterData {
    supplierName: string;
    email: string;
    phone: string;
    whatsapp?: string;
    description?: string;
    businessName?: string;
    businessAddress: string;
    city: string;
    region: string;
    taxId?: string;
    ownerName: string;
    ownerPassword: string;
    ownerPhone?: string;
}
export interface SupplierTokenPayload {
    type: 'supplier';
    supplierAdminId: string;
    supplierId: string;
    email: string;
    role: SupplierRole;
}
export declare class SupplierAuthService {
    /**
     * Login supplier admin
     */
    login(data: SupplierLoginData): Promise<{
        token: string;
        supplierAdmin: {
            id: string;
            email: string;
            name: string;
            phone: string;
            role: import(".prisma/client").$Enums.SupplierRole;
        };
        supplier: {
            id: string;
            name: string;
            businessName: string;
            slug: string;
            logo: string;
            status: "ACTIVE";
            verified: boolean;
        };
    }>;
    /**
     * Register new supplier with owner account
     */
    register(data: SupplierRegisterData): Promise<{
        message: string;
        supplier: {
            id: string;
            name: string;
            slug: string;
            status: import(".prisma/client").$Enums.SupplierStatus;
        };
        supplierAdmin: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.SupplierRole;
        };
    }>;
    /**
     * Get current supplier admin info
     */
    getMe(supplierAdminId: string): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string;
        role: import(".prisma/client").$Enums.SupplierRole;
        supplier: {
            createdAt: Date;
            name: string;
            id: string;
            email: string;
            slug: string;
            description: string;
            region: string;
            city: string;
            logo: string;
            banner: string;
            phone: string;
            businessName: string;
            businessAddress: string;
            commissionRate: import("@prisma/client/runtime/library").Decimal;
            status: import(".prisma/client").$Enums.SupplierStatus;
            verified: boolean;
        };
    }>;
    /**
     * Change password
     */
    changePassword(supplierAdminId: string, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    /**
     * Create supplier staff (OWNER only)
     */
    createStaff(supplierId: string, data: {
        email: string;
        password: string;
        name: string;
        phone?: string;
        role: SupplierRole;
    }): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string;
        role: import(".prisma/client").$Enums.SupplierRole;
        createdAt: Date;
    }>;
    /**
     * List supplier staff
     */
    getStaff(supplierId: string): Promise<{
        createdAt: Date;
        name: string;
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.SupplierRole;
        active: boolean;
        lastLoginAt: Date;
        phone: string;
    }[]>;
    /**
     * Update staff status
     */
    updateStaffStatus(supplierId: string, staffId: string, active: boolean): Promise<{
        message: string;
    }>;
    /**
     * Delete staff
     */
    deleteStaff(supplierId: string, staffId: string): Promise<{
        message: string;
    }>;
}
export declare const supplierAuthService: SupplierAuthService;
//# sourceMappingURL=supplier-auth.service.d.ts.map