import { z } from 'zod';
export declare const orderListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<["asc", "desc"]>>>;
} & {
    startDate: z.ZodOptional<z.ZodDate>;
    endDate: z.ZodOptional<z.ZodDate>;
    status: z.ZodOptional<z.ZodNativeEnum<{
        PENDING: "PENDING";
        PAID: "PAID";
        FAILED: "FAILED";
    }>>;
    deliveryStatus: z.ZodOptional<z.ZodNativeEnum<{
        PENDING: "PENDING";
        PICKED_UP: "PICKED_UP";
        IN_TRANSIT: "IN_TRANSIT";
        DELIVERED: "DELIVERED";
    }>>;
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    status?: "PENDING" | "PAID" | "FAILED";
    startDate?: Date;
    endDate?: Date;
    deliveryStatus?: "PENDING" | "PICKED_UP" | "IN_TRANSIT" | "DELIVERED";
}, {
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    status?: "PENDING" | "PAID" | "FAILED";
    startDate?: Date;
    endDate?: Date;
    deliveryStatus?: "PENDING" | "PICKED_UP" | "IN_TRANSIT" | "DELIVERED";
}>;
export declare const orderTrackingSchema: z.ZodEffects<z.ZodObject<{
    orderNumber: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email?: string;
    phone?: string;
    orderNumber?: string;
}, {
    email?: string;
    phone?: string;
    orderNumber?: string;
}>, {
    email?: string;
    phone?: string;
    orderNumber?: string;
}, {
    email?: string;
    phone?: string;
    orderNumber?: string;
}>;
export declare const updateOrderStatusSchema: z.ZodObject<{
    paymentStatus: z.ZodOptional<z.ZodNativeEnum<{
        PENDING: "PENDING";
        PAID: "PAID";
        FAILED: "FAILED";
    }>>;
    deliveryStatus: z.ZodOptional<z.ZodNativeEnum<{
        PENDING: "PENDING";
        PICKED_UP: "PICKED_UP";
        IN_TRANSIT: "IN_TRANSIT";
        DELIVERED: "DELIVERED";
    }>>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    notes?: string;
    deliveryStatus?: "PENDING" | "PICKED_UP" | "IN_TRANSIT" | "DELIVERED";
    paymentStatus?: "PENDING" | "PAID" | "FAILED";
}, {
    notes?: string;
    deliveryStatus?: "PENDING" | "PICKED_UP" | "IN_TRANSIT" | "DELIVERED";
    paymentStatus?: "PENDING" | "PAID" | "FAILED";
}>;
export declare const markShippedSchema: z.ZodObject<{
    courierId: z.ZodOptional<z.ZodString>;
    trackingNumber: z.ZodOptional<z.ZodString>;
    estimatedDeliveryDate: z.ZodOptional<z.ZodDate>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    notes?: string;
    courierId?: string;
    trackingNumber?: string;
    estimatedDeliveryDate?: Date;
}, {
    notes?: string;
    courierId?: string;
    trackingNumber?: string;
    estimatedDeliveryDate?: Date;
}>;
export declare const updateDeliveryStatusSchema: z.ZodObject<{
    status: z.ZodNativeEnum<{
        PENDING: "PENDING";
        PICKED_UP: "PICKED_UP";
        IN_TRANSIT: "IN_TRANSIT";
        DELIVERED: "DELIVERED";
    }>;
    notes: z.ZodOptional<z.ZodString>;
    signature: z.ZodOptional<z.ZodString>;
    deliveryProof: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    notes?: string;
    status?: "PENDING" | "PICKED_UP" | "IN_TRANSIT" | "DELIVERED";
    signature?: string;
    deliveryProof?: string;
}, {
    notes?: string;
    status?: "PENDING" | "PICKED_UP" | "IN_TRANSIT" | "DELIVERED";
    signature?: string;
    deliveryProof?: string;
}>;
export declare const cancelOrderSchema: z.ZodObject<{
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reason?: string;
}, {
    reason?: string;
}>;
//# sourceMappingURL=order.d.ts.map