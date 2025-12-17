import { z } from 'zod';
export declare const addCartItemSchema: z.ZodObject<{
    productId: z.ZodString;
    quantity: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    productId?: string;
    quantity?: number;
}, {
    productId?: string;
    quantity?: number;
}>;
export declare const updateCartItemSchema: z.ZodObject<{
    quantity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    quantity?: number;
}, {
    quantity?: number;
}>;
export declare const cartItemParamsSchema: z.ZodObject<{
    cartId: z.ZodString;
    itemId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    cartId?: string;
    itemId?: string;
}, {
    cartId?: string;
    itemId?: string;
}>;
export declare const bulkAddCartItemsSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        productId: z.ZodString;
        quantity: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        productId?: string;
        quantity?: number;
    }, {
        productId?: string;
        quantity?: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    items?: {
        productId?: string;
        quantity?: number;
    }[];
}, {
    items?: {
        productId?: string;
        quantity?: number;
    }[];
}>;
export declare const clearCartSchema: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
//# sourceMappingURL=cart.d.ts.map