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
const paymentController = __importStar(require("./payment.controller"));
const validate_1 = require("../../middleware/validate");
const rateLimit_1 = require("../../middleware/rateLimit");
const validations_1 = require("../../validations");
const router = (0, express_1.Router)();
/**
 * @route   POST /api/payment/initiate
 * @desc    Initiate mobile money payment
 * @access  Public
 */
router.post('/initiate', rateLimit_1.checkoutLimiter, (0, validate_1.validate)(validations_1.initiatePaymentSchema, 'body'), paymentController.initiatePayment);
/**
 * @route   POST /api/payment/webhook
 * @desc    Handle payment webhook from mobile money provider
 * @access  Public (webhook from payment provider)
 */
router.post('/webhook', rateLimit_1.webhookLimiter, paymentController.handleWebhook);
/**
 * @route   GET /api/payment/verify/:transactionId
 * @desc    Verify payment status
 * @access  Public
 */
router.get('/verify/:transactionId', rateLimit_1.checkoutLimiter, paymentController.verifyPayment);
exports.default = router;
//# sourceMappingURL=payment.routes.js.map