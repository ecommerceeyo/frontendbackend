"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrderSchema = exports.updateDeliveryStatusSchema = exports.markShippedSchema = exports.updateOrderStatusSchema = exports.orderTrackingSchema = exports.orderListQuerySchema = void 0;
const zod_1 = require("zod");
const common_1 = require("./common");
const client_1 = require("@prisma/client");
// Order list query schema
exports.orderListQuerySchema = common_1.paginationSchema.extend({
    status: zod_1.z.nativeEnum(client_1.PaymentStatus).optional(),
    deliveryStatus: zod_1.z.nativeEnum(client_1.DeliveryStatus).optional(),
    search: zod_1.z.string().optional(),
    ...common_1.dateRangeSchema.shape,
});
// Order tracking schema
exports.orderTrackingSchema = zod_1.z.object({
    orderNumber: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
}).refine((data) => data.orderNumber || data.phone || data.email, {
    message: 'At least one of orderNumber, phone, or email is required',
});
// Update order status schema
exports.updateOrderStatusSchema = zod_1.z.object({
    paymentStatus: zod_1.z.nativeEnum(client_1.PaymentStatus).optional(),
    deliveryStatus: zod_1.z.nativeEnum(client_1.DeliveryStatus).optional(),
    notes: zod_1.z.string().max(500).optional(),
});
// Mark order as shipped schema
exports.markShippedSchema = zod_1.z.object({
    courierId: zod_1.z.string().optional(),
    trackingNumber: zod_1.z.string().optional(),
    estimatedDeliveryDate: zod_1.z.coerce.date().optional(),
    notes: zod_1.z.string().max(500).optional(),
});
// Update delivery status schema
exports.updateDeliveryStatusSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(client_1.DeliveryStatus),
    notes: zod_1.z.string().max(500).optional(),
    signature: zod_1.z.string().optional(), // Base64 signature for delivery confirmation
    deliveryProof: zod_1.z.string().url().optional(), // Photo URL
});
// Cancel order schema
exports.cancelOrderSchema = zod_1.z.object({
    reason: zod_1.z.string().min(1, 'Cancellation reason is required').max(500),
});
//# sourceMappingURL=order.js.map