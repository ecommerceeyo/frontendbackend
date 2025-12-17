import { z } from 'zod';
export declare const customerInfoSchema: z.ZodObject<{
    name: z.ZodString;
    phone: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    address: z.ZodString;
    city: z.ZodString;
    region: z.ZodOptional<z.ZodString>;
    deliveryNotes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string;
    email?: string;
    region?: string;
    city?: string;
    phone?: string;
    address?: string;
    deliveryNotes?: string;
}, {
    name?: string;
    email?: string;
    region?: string;
    city?: string;
    phone?: string;
    address?: string;
    deliveryNotes?: string;
}>;
export declare const checkoutSchema: z.ZodObject<{
    cartId: z.ZodString;
    customer: z.ZodObject<{
        name: z.ZodString;
        phone: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
        address: z.ZodString;
        city: z.ZodString;
        region: z.ZodOptional<z.ZodString>;
        deliveryNotes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name?: string;
        email?: string;
        region?: string;
        city?: string;
        phone?: string;
        address?: string;
        deliveryNotes?: string;
    }, {
        name?: string;
        email?: string;
        region?: string;
        city?: string;
        phone?: string;
        address?: string;
        deliveryNotes?: string;
    }>;
    paymentMethod: z.ZodNativeEnum<{
        MOMO: "MOMO";
        COD: "COD";
    }>;
    momoPhoneNumber: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    customer?: {
        name?: string;
        email?: string;
        region?: string;
        city?: string;
        phone?: string;
        address?: string;
        deliveryNotes?: string;
    };
    notes?: string;
    cartId?: string;
    paymentMethod?: "MOMO" | "COD";
    momoPhoneNumber?: string;
}, {
    customer?: {
        name?: string;
        email?: string;
        region?: string;
        city?: string;
        phone?: string;
        address?: string;
        deliveryNotes?: string;
    };
    notes?: string;
    cartId?: string;
    paymentMethod?: "MOMO" | "COD";
    momoPhoneNumber?: string;
}>;
export declare const checkoutSchemaRefined: z.ZodEffects<z.ZodObject<{
    cartId: z.ZodString;
    customer: z.ZodObject<{
        name: z.ZodString;
        phone: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
        address: z.ZodString;
        city: z.ZodString;
        region: z.ZodOptional<z.ZodString>;
        deliveryNotes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name?: string;
        email?: string;
        region?: string;
        city?: string;
        phone?: string;
        address?: string;
        deliveryNotes?: string;
    }, {
        name?: string;
        email?: string;
        region?: string;
        city?: string;
        phone?: string;
        address?: string;
        deliveryNotes?: string;
    }>;
    paymentMethod: z.ZodNativeEnum<{
        MOMO: "MOMO";
        COD: "COD";
    }>;
    momoPhoneNumber: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    customer?: {
        name?: string;
        email?: string;
        region?: string;
        city?: string;
        phone?: string;
        address?: string;
        deliveryNotes?: string;
    };
    notes?: string;
    cartId?: string;
    paymentMethod?: "MOMO" | "COD";
    momoPhoneNumber?: string;
}, {
    customer?: {
        name?: string;
        email?: string;
        region?: string;
        city?: string;
        phone?: string;
        address?: string;
        deliveryNotes?: string;
    };
    notes?: string;
    cartId?: string;
    paymentMethod?: "MOMO" | "COD";
    momoPhoneNumber?: string;
}>, {
    customer?: {
        name?: string;
        email?: string;
        region?: string;
        city?: string;
        phone?: string;
        address?: string;
        deliveryNotes?: string;
    };
    notes?: string;
    cartId?: string;
    paymentMethod?: "MOMO" | "COD";
    momoPhoneNumber?: string;
}, {
    customer?: {
        name?: string;
        email?: string;
        region?: string;
        city?: string;
        phone?: string;
        address?: string;
        deliveryNotes?: string;
    };
    notes?: string;
    cartId?: string;
    paymentMethod?: "MOMO" | "COD";
    momoPhoneNumber?: string;
}>;
//# sourceMappingURL=checkout.d.ts.map