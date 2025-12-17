import { z } from 'zod';
export declare const productSpecificationSchema: z.ZodObject<{
    key: z.ZodString;
    value: z.ZodString;
    group: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    sortOrder?: number;
    key?: string;
    value?: string;
    group?: string;
}, {
    sortOrder?: number;
    key?: string;
    value?: string;
    group?: string;
}>;
export declare const productImageSchema: z.ZodObject<{
    url: z.ZodString;
    publicId: z.ZodString;
    alt: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodNumber>;
    isPrimary: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    sortOrder?: number;
    url?: string;
    publicId?: string;
    alt?: string;
    isPrimary?: boolean;
}, {
    sortOrder?: number;
    url?: string;
    publicId?: string;
    alt?: string;
    isPrimary?: boolean;
}>;
export declare const createProductSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodNumber;
    currency: z.ZodDefault<z.ZodString>;
    comparePrice: z.ZodOptional<z.ZodNumber>;
    sku: z.ZodOptional<z.ZodString>;
    stock: z.ZodDefault<z.ZodNumber>;
    lowStockThreshold: z.ZodDefault<z.ZodNumber>;
    categoryIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    images: z.ZodOptional<z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        publicId: z.ZodString;
        alt: z.ZodOptional<z.ZodString>;
        sortOrder: z.ZodDefault<z.ZodNumber>;
        isPrimary: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        sortOrder?: number;
        url?: string;
        publicId?: string;
        alt?: string;
        isPrimary?: boolean;
    }, {
        sortOrder?: number;
        url?: string;
        publicId?: string;
        alt?: string;
        isPrimary?: boolean;
    }>, "many">>;
    specifications: z.ZodOptional<z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        value: z.ZodString;
        group: z.ZodOptional<z.ZodString>;
        sortOrder: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        sortOrder?: number;
        key?: string;
        value?: string;
        group?: string;
    }, {
        sortOrder?: number;
        key?: string;
        value?: string;
        group?: string;
    }>, "many">>;
    active: z.ZodDefault<z.ZodBoolean>;
    featured: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    images?: {
        sortOrder?: number;
        url?: string;
        publicId?: string;
        alt?: string;
        isPrimary?: boolean;
    }[];
    currency?: string;
    name?: string;
    active?: boolean;
    slug?: string;
    description?: string;
    sku?: string;
    price?: number;
    comparePrice?: number;
    stock?: number;
    lowStockThreshold?: number;
    featured?: boolean;
    specifications?: {
        sortOrder?: number;
        key?: string;
        value?: string;
        group?: string;
    }[];
    categoryIds?: string[];
}, {
    images?: {
        sortOrder?: number;
        url?: string;
        publicId?: string;
        alt?: string;
        isPrimary?: boolean;
    }[];
    currency?: string;
    name?: string;
    active?: boolean;
    slug?: string;
    description?: string;
    sku?: string;
    price?: number;
    comparePrice?: number;
    stock?: number;
    lowStockThreshold?: number;
    featured?: boolean;
    specifications?: {
        sortOrder?: number;
        key?: string;
        value?: string;
        group?: string;
    }[];
    categoryIds?: string[];
}>;
export declare const updateProductSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    price: z.ZodOptional<z.ZodNumber>;
    currency: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    comparePrice: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    sku: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    stock: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    lowStockThreshold: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    categoryIds: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    images: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        publicId: z.ZodString;
        alt: z.ZodOptional<z.ZodString>;
        sortOrder: z.ZodDefault<z.ZodNumber>;
        isPrimary: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        sortOrder?: number;
        url?: string;
        publicId?: string;
        alt?: string;
        isPrimary?: boolean;
    }, {
        sortOrder?: number;
        url?: string;
        publicId?: string;
        alt?: string;
        isPrimary?: boolean;
    }>, "many">>>;
    specifications: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        value: z.ZodString;
        group: z.ZodOptional<z.ZodString>;
        sortOrder: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        sortOrder?: number;
        key?: string;
        value?: string;
        group?: string;
    }, {
        sortOrder?: number;
        key?: string;
        value?: string;
        group?: string;
    }>, "many">>>;
    active: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    featured: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    images?: {
        sortOrder?: number;
        url?: string;
        publicId?: string;
        alt?: string;
        isPrimary?: boolean;
    }[];
    currency?: string;
    name?: string;
    active?: boolean;
    slug?: string;
    description?: string;
    sku?: string;
    price?: number;
    comparePrice?: number;
    stock?: number;
    lowStockThreshold?: number;
    featured?: boolean;
    specifications?: {
        sortOrder?: number;
        key?: string;
        value?: string;
        group?: string;
    }[];
    categoryIds?: string[];
}, {
    images?: {
        sortOrder?: number;
        url?: string;
        publicId?: string;
        alt?: string;
        isPrimary?: boolean;
    }[];
    currency?: string;
    name?: string;
    active?: boolean;
    slug?: string;
    description?: string;
    sku?: string;
    price?: number;
    comparePrice?: number;
    stock?: number;
    lowStockThreshold?: number;
    featured?: boolean;
    specifications?: {
        sortOrder?: number;
        key?: string;
        value?: string;
        group?: string;
    }[];
    categoryIds?: string[];
}>;
export declare const productListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<["asc", "desc"]>>>;
} & {
    category: z.ZodOptional<z.ZodString>;
    minPrice: z.ZodOptional<z.ZodNumber>;
    maxPrice: z.ZodOptional<z.ZodNumber>;
    inStock: z.ZodOptional<z.ZodBoolean>;
    featured: z.ZodOptional<z.ZodBoolean>;
    active: z.ZodOptional<z.ZodBoolean>;
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    active?: boolean;
    featured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
}, {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    active?: boolean;
    featured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
}>;
export declare const adminProductListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<["asc", "desc"]>>>;
} & {
    category: z.ZodOptional<z.ZodString>;
    minPrice: z.ZodOptional<z.ZodNumber>;
    maxPrice: z.ZodOptional<z.ZodNumber>;
    inStock: z.ZodOptional<z.ZodBoolean>;
    featured: z.ZodOptional<z.ZodBoolean>;
    active: z.ZodOptional<z.ZodBoolean>;
    search: z.ZodOptional<z.ZodString>;
} & {
    includeInactive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    active?: boolean;
    featured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    includeInactive?: boolean;
}, {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    active?: boolean;
    featured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    includeInactive?: boolean;
}>;
export declare const bulkUpdateStockSchema: z.ZodObject<{
    updates: z.ZodArray<z.ZodObject<{
        productId: z.ZodString;
        stock: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        stock?: number;
        productId?: string;
    }, {
        stock?: number;
        productId?: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    updates?: {
        stock?: number;
        productId?: string;
    }[];
}, {
    updates?: {
        stock?: number;
        productId?: string;
    }[];
}>;
export declare const addSpecificationSchema: z.ZodObject<{
    key: z.ZodString;
    value: z.ZodString;
    group: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    sortOrder?: number;
    key?: string;
    value?: string;
    group?: string;
}, {
    sortOrder?: number;
    key?: string;
    value?: string;
    group?: string;
}>;
export declare const updateSpecificationSchema: z.ZodObject<{
    key: z.ZodOptional<z.ZodString>;
    value: z.ZodOptional<z.ZodString>;
    group: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    sortOrder: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    sortOrder?: number;
    key?: string;
    value?: string;
    group?: string;
}, {
    sortOrder?: number;
    key?: string;
    value?: string;
    group?: string;
}>;
//# sourceMappingURL=product.d.ts.map