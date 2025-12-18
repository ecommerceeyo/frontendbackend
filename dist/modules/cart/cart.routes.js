"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cartController = __importStar(require("./cart.controller"));
const validate_1 = require("../../middleware/validate");
const rateLimit_1 = require("../../middleware/rateLimit");
const validations_1 = require("../../validations");
const router = (0, express_1.Router)();
/**
 * @route   POST /api/cart
 * @desc    Create a new cart
 * @access  Public
 */
router.post('/', rateLimit_1.apiLimiter, cartController.createCart);
/**
 * @route   GET /api/cart/:cartId
 * @desc    Get cart by cartId
 * @access  Public
 */
router.get('/:cartId', rateLimit_1.apiLimiter, (0, validate_1.validate)(validations_1.cartIdParamsSchema, 'params'), cartController.getCart);
/**
 * @route   POST /api/cart/:cartId/items
 * @desc    Add item to cart
 * @access  Public
 */
router.post('/:cartId/items', rateLimit_1.apiLimiter, (0, validate_1.validate)(validations_1.cartIdParamsSchema, 'params'), (0, validate_1.validate)(validations_1.addCartItemSchema, 'body'), cartController.addCartItem);
/**
 * @route   PUT /api/cart/:cartId/items/:itemId
 * @desc    Update cart item quantity
 * @access  Public
 */
router.put('/:cartId/items/:itemId', rateLimit_1.apiLimiter, (0, validate_1.validate)(validations_1.cartItemParamsSchema, 'params'), (0, validate_1.validate)(validations_1.updateCartItemSchema, 'body'), cartController.updateCartItem);
/**
 * @route   DELETE /api/cart/:cartId/items/:itemId
 * @desc    Remove item from cart
 * @access  Public
 */
router.delete('/:cartId/items/:itemId', rateLimit_1.apiLimiter, (0, validate_1.validate)(validations_1.cartItemParamsSchema, 'params'), cartController.removeCartItem);
/**
 * @route   DELETE /api/cart/:cartId/items
 * @desc    Clear all items from cart
 * @access  Public
 */
router.delete('/:cartId/items', rateLimit_1.apiLimiter, (0, validate_1.validate)(validations_1.cartIdParamsSchema, 'params'), cartController.clearCart);
/**
 * @route   DELETE /api/cart/:cartId
 * @desc    Delete cart entirely
 * @access  Public
 */
router.delete('/:cartId', rateLimit_1.apiLimiter, (0, validate_1.validate)(validations_1.cartIdParamsSchema, 'params'), cartController.deleteCart);
exports.default = router;
//# sourceMappingURL=cart.routes.js.map