"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCartSchema = exports.bulkAddCartItemsSchema = exports.cartItemParamsSchema = exports.updateCartItemSchema = exports.addCartItemSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("./common");
// Add item to cart schema
exports.addCartItemSchema = zod_1.z.object({
    productId: zod_1.z.string().min(1, 'Product ID is required'),
    quantity: common_1.quantitySchema.default(1),
});
// Update cart item schema
exports.updateCartItemSchema = zod_1.z.object({
    quantity: common_1.quantitySchema,
});
// Cart item ID params
exports.cartItemParamsSchema = zod_1.z.object({
    cartId: zod_1.z.string().min(1, 'Cart ID is required'),
    itemId: zod_1.z.string().min(1, 'Item ID is required'),
});
// Bulk add items to cart
exports.bulkAddCartItemsSchema = zod_1.z.object({
    items: zod_1.z.array(exports.addCartItemSchema).min(1, 'At least one item is required'),
});
// Clear cart schema (empty body is valid)
exports.clearCartSchema = zod_1.z.object({}).optional();
//# sourceMappingURL=cart.js.map