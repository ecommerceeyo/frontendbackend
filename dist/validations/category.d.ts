import { z } from 'zod';
export declare const createCategorySchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodString>;
    parentId: z.ZodOptional<z.ZodString>;
    active: z.ZodDefault<z.ZodBoolean>;
    sortOrder: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    sortOrder?: number;
    name?: string;
    active?: boolean;
    slug?: string;
    description?: string;
    image?: string;
    parentId?: string;
}, {
    sortOrder?: number;
    name?: string;
    active?: boolean;
    slug?: string;
    description?: string;
    image?: string;
    parentId?: string;
}>;
export declare const updateCategorySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    image: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    parentId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    active: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    sortOrder: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    sortOrder?: number;
    name?: string;
    active?: boolean;
    slug?: string;
    description?: string;
    image?: string;
    parentId?: string;
}, {
    sortOrder?: number;
    name?: string;
    active?: boolean;
    slug?: string;
    description?: string;
    image?: string;
    parentId?: string;
}>;
export declare const categoryListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<["asc", "desc"]>>>;
} & {
    parentId: z.ZodOptional<z.ZodString>;
    active: z.ZodOptional<z.ZodBoolean>;
    includeProducts: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    active?: boolean;
    parentId?: string;
    includeProducts?: boolean;
}, {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    active?: boolean;
    parentId?: string;
    includeProducts?: boolean;
}>;
//# sourceMappingURL=category.d.ts.map