import { z } from 'zod';
export declare const generateReportSchema: z.ZodObject<{
    type: z.ZodNativeEnum<{
        SALES: "SALES";
        INVENTORY: "INVENTORY";
        ORDERS: "ORDERS";
        PAYMENTS: "PAYMENTS";
        DELIVERIES: "DELIVERIES";
    }>;
    startDate: z.ZodDate;
    endDate: z.ZodDate;
    format: z.ZodDefault<z.ZodEnum<["pdf", "csv"]>>;
}, "strip", z.ZodTypeAny, {
    type?: "SALES" | "INVENTORY" | "ORDERS" | "PAYMENTS" | "DELIVERIES";
    startDate?: Date;
    endDate?: Date;
    format?: "pdf" | "csv";
}, {
    type?: "SALES" | "INVENTORY" | "ORDERS" | "PAYMENTS" | "DELIVERIES";
    startDate?: Date;
    endDate?: Date;
    format?: "pdf" | "csv";
}>;
export declare const reportListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<["asc", "desc"]>>>;
} & {
    startDate: z.ZodOptional<z.ZodDate>;
    endDate: z.ZodOptional<z.ZodDate>;
    type: z.ZodOptional<z.ZodNativeEnum<{
        SALES: "SALES";
        INVENTORY: "INVENTORY";
        ORDERS: "ORDERS";
        PAYMENTS: "PAYMENTS";
        DELIVERIES: "DELIVERIES";
    }>>;
    status: z.ZodOptional<z.ZodEnum<["PENDING", "PROCESSING", "COMPLETED", "FAILED"]>>;
}, "strip", z.ZodTypeAny, {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    status?: "PENDING" | "FAILED" | "PROCESSING" | "COMPLETED";
    type?: "SALES" | "INVENTORY" | "ORDERS" | "PAYMENTS" | "DELIVERIES";
    startDate?: Date;
    endDate?: Date;
}, {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    status?: "PENDING" | "FAILED" | "PROCESSING" | "COMPLETED";
    type?: "SALES" | "INVENTORY" | "ORDERS" | "PAYMENTS" | "DELIVERIES";
    startDate?: Date;
    endDate?: Date;
}>;
export declare const dashboardStatsQuerySchema: z.ZodObject<{
    period: z.ZodDefault<z.ZodEnum<["today", "week", "month", "year"]>>;
}, "strip", z.ZodTypeAny, {
    period?: "today" | "week" | "month" | "year";
}, {
    period?: "today" | "week" | "month" | "year";
}>;
export declare const salesReportQuerySchema: z.ZodObject<{
    startDate: z.ZodOptional<z.ZodDate>;
    endDate: z.ZodOptional<z.ZodDate>;
} & {
    groupBy: z.ZodDefault<z.ZodEnum<["day", "week", "month"]>>;
}, "strip", z.ZodTypeAny, {
    startDate?: Date;
    endDate?: Date;
    groupBy?: "week" | "month" | "day";
}, {
    startDate?: Date;
    endDate?: Date;
    groupBy?: "week" | "month" | "day";
}>;
export declare const inventoryReportQuerySchema: z.ZodObject<{
    lowStock: z.ZodOptional<z.ZodBoolean>;
    outOfStock: z.ZodOptional<z.ZodBoolean>;
    categoryId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    categoryId?: string;
    lowStock?: boolean;
    outOfStock?: boolean;
}, {
    categoryId?: string;
    lowStock?: boolean;
    outOfStock?: boolean;
}>;
//# sourceMappingURL=report.d.ts.map