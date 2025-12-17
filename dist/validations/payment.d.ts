import { z } from 'zod';
export declare const initiatePaymentSchema: z.ZodObject<{
    orderId: z.ZodString;
    provider: z.ZodDefault<z.ZodOptional<z.ZodNativeEnum<{
        MTN_MOMO: "MTN_MOMO";
        AIRTEL_MONEY: "AIRTEL_MONEY";
        ORANGE_MONEY: "ORANGE_MONEY";
    }>>>;
    phoneNumber: z.ZodString;
}, "strip", z.ZodTypeAny, {
    orderId?: string;
    provider?: "MTN_MOMO" | "AIRTEL_MONEY" | "ORANGE_MONEY";
    phoneNumber?: string;
}, {
    orderId?: string;
    provider?: "MTN_MOMO" | "AIRTEL_MONEY" | "ORANGE_MONEY";
    phoneNumber?: string;
}>;
export declare const momoWebhookSchema: z.ZodObject<{
    financialTransactionId: z.ZodOptional<z.ZodString>;
    externalId: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodString;
    payer: z.ZodOptional<z.ZodObject<{
        partyIdType: z.ZodString;
        partyId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        partyIdType?: string;
        partyId?: string;
    }, {
        partyIdType?: string;
        partyId?: string;
    }>>;
    status: z.ZodEnum<["SUCCESSFUL", "FAILED", "PENDING"]>;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    currency?: string;
    status?: "PENDING" | "FAILED" | "SUCCESSFUL";
    reason?: string;
    financialTransactionId?: string;
    externalId?: string;
    amount?: number;
    payer?: {
        partyIdType?: string;
        partyId?: string;
    };
}, {
    currency?: string;
    status?: "PENDING" | "FAILED" | "SUCCESSFUL";
    reason?: string;
    financialTransactionId?: string;
    externalId?: string;
    amount?: number;
    payer?: {
        partyIdType?: string;
        partyId?: string;
    };
}>;
export declare const paymentWebhookSchema: z.ZodObject<{
    transactionId: z.ZodString;
    status: z.ZodEnum<["success", "failed", "pending"]>;
    amount: z.ZodNumber;
    currency: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    currency?: string;
    status?: "success" | "failed" | "pending";
    amount?: number;
    transactionId?: string;
    metadata?: Record<string, unknown>;
}, {
    currency?: string;
    status?: "success" | "failed" | "pending";
    amount?: number;
    transactionId?: string;
    metadata?: Record<string, unknown>;
}>;
export declare const verifyPaymentSchema: z.ZodObject<{
    transactionId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    transactionId?: string;
}, {
    transactionId?: string;
}>;
export declare const refundPaymentSchema: z.ZodObject<{
    orderId: z.ZodString;
    amount: z.ZodOptional<z.ZodNumber>;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reason?: string;
    orderId?: string;
    amount?: number;
}, {
    reason?: string;
    orderId?: string;
    amount?: number;
}>;
//# sourceMappingURL=payment.d.ts.map