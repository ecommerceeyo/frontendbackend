import { AdminRole } from '@prisma/client';
export interface LoginData {
    email: string;
    password: string;
}
export interface CreateAdminData {
    email: string;
    password: string;
    name: string;
    role?: AdminRole;
}
export declare class AuthService {
    /**
     * Admin login
     */
    login(data: LoginData): Promise<{
        token: string;
        admin: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.AdminRole;
        };
    }>;
    /**
     * Create a new admin
     */
    createAdmin(data: CreateAdminData, createdBy?: string): Promise<{
        createdAt: Date;
        name: string;
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.AdminRole;
        active: boolean;
    }>;
    /**
     * Get admin by ID
     */
    getAdminById(id: string): Promise<{
        createdAt: Date;
        name: string;
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.AdminRole;
        active: boolean;
        lastLoginAt: Date;
        updatedAt: Date;
    }>;
    /**
     * Get all admins
     */
    getAdmins(): Promise<{
        createdAt: Date;
        name: string;
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.AdminRole;
        active: boolean;
        lastLoginAt: Date;
    }[]>;
    /**
     * Update admin
     */
    updateAdmin(id: string, data: {
        email?: string;
        name?: string;
        role?: AdminRole;
        active?: boolean;
    }, updatedBy: string): Promise<{
        name: string;
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.AdminRole;
        active: boolean;
        updatedAt: Date;
    }>;
    /**
     * Change password
     */
    changePassword(adminId: string, currentPassword: string, newPassword: string): Promise<{
        success: boolean;
    }>;
    /**
     * Delete admin
     */
    deleteAdmin(id: string, deletedBy: string): Promise<{
        success: boolean;
    }>;
    /**
     * Get current admin profile
     */
    getProfile(adminId: string): Promise<{
        createdAt: Date;
        name: string;
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.AdminRole;
        active: boolean;
        lastLoginAt: Date;
        updatedAt: Date;
    }>;
    /**
     * Generate JWT token
     */
    private generateToken;
}
export declare const authService: AuthService;
//# sourceMappingURL=auth.service.d.ts.map