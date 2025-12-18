"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refundPaymentSchema = exports.verifyPaymentSchema = exports.paymentWebhookSchema = exports.momoWebhookSchema = exports.initiatePaymentSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("./common");
const client_1 = require("@prisma/client");
// Initiate payment schema
exports.initiatePaymentSchema = zod_1.z.object({
    orderId: zod_1.z.string().min(1, 'Order ID is required'),
    provider: zod_1.z.nativeEnum(client_1.MobileMoneyProvider).optional().default('MTN_MOMO'),
    phoneNumber: common_1.phoneSchema,
});
// Payment webhook schema (MTN MoMo)
exports.momoWebhookSchema = zod_1.z.object({
    financialTransactionId: zod_1.z.string().optional(),
    externalId: zod_1.z.string(), // Our transaction ID
    amount: zod_1.z.coerce.number(),
    currency: zod_1.z.string(),
    payer: zod_1.z.object({
        partyIdType: zod_1.z.string(),
        partyId: zod_1.z.string(),
    }).optional(),
    status: zod_1.z.enum(['SUCCESSFUL', 'FAILED', 'PENDING']),
    reason: zod_1.z.string().optional(),
});
// Generic payment webhook schema
exports.paymentWebhookSchema = zod_1.z.object({
    transactionId: zod_1.z.string(),
    status: zod_1.z.enum(['success', 'failed', 'pending']),
    amount: zod_1.z.coerce.number(),
    currency: zod_1.z.string().optional(),
    metadata: zod_1.z.record(zod_1.z.unknown()).optional(),
});
// Verify payment schema
exports.verifyPaymentSchema = zod_1.z.object({
    transactionId: zod_1.z.string().min(1, 'Transaction ID is required'),
});
// Refund payment schema
exports.refundPaymentSchema = zod_1.z.object({
    orderId: zod_1.z.string().min(1, 'Order ID is required'),
    amount: zod_1.z.coerce.number().positive().optional(), // Optional partial refund
    reason: zod_1.z.string().min(1, 'Refund reason is required').max(500),
});
//# sourceMappingURL=payment.js.map