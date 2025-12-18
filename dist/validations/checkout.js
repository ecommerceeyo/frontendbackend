"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutSchemaRefined = exports.checkoutSchema = exports.customerInfoSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("./common");
const client_1 = require("@prisma/client");
// Customer information schema
exports.customerInfoSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(100),
    phone: common_1.phoneSchema,
    email: common_1.emailSchema.optional(),
    address: zod_1.z.string().min(1, 'Address is required').max(500),
    city: zod_1.z.string().min(1, 'City is required').max(100),
    region: zod_1.z.string().optional(),
    deliveryNotes: zod_1.z.string().max(500).optional(),
});
// Checkout schema
exports.checkoutSchema = zod_1.z.object({
    cartId: zod_1.z.string().min(1, 'Cart ID is required'),
    customer: exports.customerInfoSchema,
    paymentMethod: zod_1.z.nativeEnum(client_1.PaymentMethod),
    momoPhoneNumber: zod_1.z.string().optional(),
    notes: zod_1.z.string().max(500).optional(),
});
// Validate checkout - ensure momoPhoneNumber is provided for MOMO payments
exports.checkoutSchemaRefined = exports.checkoutSchema.refine((data) => {
    if (data.paymentMethod === 'MOMO' && !data.momoPhoneNumber) {
        return false;
    }
    return true;
}, {
    message: 'Mobile money phone number is required for MOMO payments',
    path: ['momoPhoneNumber'],
});
//# sourceMappingURL=checkout.js.map