import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email?: string;
    password?: string;
}, {
    email?: string;
    password?: string;
}>;
export declare const createAdminSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
    role: z.ZodDefault<z.ZodNativeEnum<{
        ADMIN: "ADMIN";
        SUPER_ADMIN: "SUPER_ADMIN";
        SUPPORT: "SUPPORT";
    }>>;
}, "strip", z.ZodTypeAny, {
    name?: string;
    email?: string;
    role?: "ADMIN" | "SUPER_ADMIN" | "SUPPORT";
    password?: string;
}, {
    name?: string;
    email?: string;
    role?: "ADMIN" | "SUPER_ADMIN" | "SUPPORT";
    password?: string;
}>;
export declare const updateAdminSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodNativeEnum<{
        ADMIN: "ADMIN";
        SUPER_ADMIN: "SUPER_ADMIN";
        SUPPORT: "SUPPORT";
    }>>;
    active: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name?: string;
    email?: string;
    role?: "ADMIN" | "SUPER_ADMIN" | "SUPPORT";
    active?: boolean;
}, {
    name?: string;
    email?: string;
    role?: "ADMIN" | "SUPER_ADMIN" | "SUPPORT";
    active?: boolean;
}>;
export declare const changePasswordSchema: z.ZodEffects<z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
    confirmPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}, {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}>, {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}, {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}>;
export declare const resetPasswordRequestSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email?: string;
}, {
    email?: string;
}>;
export declare const resetPasswordSchema: z.ZodEffects<z.ZodObject<{
    token: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password?: string;
    confirmPassword?: string;
    token?: string;
}, {
    password?: string;
    confirmPassword?: string;
    token?: string;
}>, {
    password?: string;
    confirmPassword?: string;
    token?: string;
}, {
    password?: string;
    confirmPassword?: string;
    token?: string;
}>;
//# sourceMappingURL=auth.d.ts.map