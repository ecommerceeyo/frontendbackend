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
const orderController = __importStar(require("./order.controller"));
const validate_1 = require("../../middleware/validate");
const rateLimit_1 = require("../../middleware/rateLimit");
const validations_1 = require("../../validations");
const router = (0, express_1.Router)();
// ============================================
// PUBLIC ROUTES
// ============================================
/**
 * @route   POST /api/checkout
 * @desc    Create order from cart
 * @access  Public
 */
router.post('/checkout', rateLimit_1.checkoutLimiter, (0, validate_1.validate)(validations_1.checkoutSchemaRefined, 'body'), orderController.checkout);
/**
 * @route   GET /api/orders/track
 * @desc    Track order by order number, phone, or email
 * @access  Public
 */
router.get('/track', rateLimit_1.apiLimiter, (0, validate_1.validate)(validations_1.orderTrackingSchema, 'query'), orderController.trackOrder);
/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID (limited info)
 * @access  Public
 */
router.get('/:id', rateLimit_1.apiLimiter, (0, validate_1.validate)(validations_1.idParamsSchema, 'params'), orderController.getOrder);
exports.default = router;
//# sourceMappingURL=order.routes.js.map