"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCart = createCart;
exports.getCart = getCart;
exports.addCartItem = addCartItem;
exports.updateCartItem = updateCartItem;
exports.removeCartItem = removeCartItem;
exports.clearCart = clearCart;
exports.deleteCart = deleteCart;
const cart_service_1 = require("./cart.service");
const response_1 = require("../../utils/response");
const database_1 = __importDefault(require("../../config/database"));
/**
 * Create a new cart
 */
async function createCart(req, res, next) {
    try {
        const cart = await cart_service_1.cartService.createCart();
        return (0, response_1.successResponse)(res, cart, 'Cart created successfully', 201);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get cart by cartId
 */
async function getCart(req, res, next) {
    try {
        const { cartId } = req.params;
        const cart = await cart_service_1.cartService.getCart(cartId);
        // Get delivery settings for calculating totals
        const deliverySettings = await database_1.default.setting.findUnique({
            where: { key: 'delivery_settings' },
        });
        const settings = deliverySettings?.value;
        const defaultFee = settings?.default_fee || 2000;
        const freeThreshold = settings?.free_delivery_threshold || 100000;
        const totals = cart_service_1.cartService.calculateCartTotals(cart);
        const deliveryFee = totals.subtotal >= freeThreshold ? 0 : defaultFee;
        return (0, response_1.successResponse)(res, {
            ...cart,
            ...cart_service_1.cartService.calculateCartTotals(cart, deliveryFee),
        });
    }
    catch (error) {
        next(error);
    }
}
/**
 * Add item to cart
 */
async function addCartItem(req, res, next) {
    try {
        const { cartId } = req.params;
        const { productId, quantity } = req.body;
        const cart = await cart_service_1.cartService.addItem(cartId, productId, quantity);
        const totals = cart_service_1.cartService.calculateCartTotals(cart);
        return (0, response_1.successResponse)(res, { ...cart, ...totals }, 'Item added to cart');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Update cart item quantity
 */
async function updateCartItem(req, res, next) {
    try {
        const { cartId, itemId } = req.params;
        const { quantity } = req.body;
        const cart = await cart_service_1.cartService.updateItem(cartId, itemId, quantity);
        const totals = cart_service_1.cartService.calculateCartTotals(cart);
        return (0, response_1.successResponse)(res, { ...cart, ...totals }, 'Cart item updated');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Remove item from cart
 */
async function removeCartItem(req, res, next) {
    try {
        const { cartId, itemId } = req.params;
        const cart = await cart_service_1.cartService.removeItem(cartId, itemId);
        const totals = cart_service_1.cartService.calculateCartTotals(cart);
        return (0, response_1.successResponse)(res, { ...cart, ...totals }, 'Item removed from cart');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Clear all items from cart
 */
async function clearCart(req, res, next) {
    try {
        const { cartId } = req.params;
        const cart = await cart_service_1.cartService.clearCart(cartId);
        const totals = cart_service_1.cartService.calculateCartTotals(cart);
        return (0, response_1.successResponse)(res, { ...cart, ...totals }, 'Cart cleared');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Delete cart entirely
 */
async function deleteCart(req, res, next) {
    try {
        const { cartId } = req.params;
        await cart_service_1.cartService.deleteCart(cartId);
        return (0, response_1.successResponse)(res, null, 'Cart deleted');
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=cart.controller.js.map