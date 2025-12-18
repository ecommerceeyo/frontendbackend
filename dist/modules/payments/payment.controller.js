"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initiatePayment = initiatePayment;
exports.handleWebhook = handleWebhook;
exports.verifyPayment = verifyPayment;
const payment_service_1 = require("./payment.service");
const response_1 = require("../../utils/response");
const logger_1 = __importDefault(require("../../utils/logger"));
/**
 * Initiate payment
 */
async function initiatePayment(req, res, next) {
    try {
        const { orderId, phoneNumber, provider } = req.body;
        const result = await payment_service_1.paymentService.initiatePayment(orderId, phoneNumber, provider);
        return (0, response_1.successResponse)(res, result);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Handle payment webhook from mobile money provider
 */
async function handleWebhook(req, res, next) {
    try {
        // Log incoming webhook
        logger_1.default.info('Payment webhook received:', JSON.stringify(req.body));
        const payload = req.body;
        // Handle MTN MoMo webhook format
        const result = await payment_service_1.paymentService.handleWebhook({
            externalId: payload.externalId,
            status: payload.status,
            financialTransactionId: payload.financialTransactionId,
            reason: payload.reason,
        });
        return (0, response_1.successResponse)(res, result);
    }
    catch (error) {
        // Log but don't expose error details to webhook caller
        logger_1.default.error('Webhook error:', error);
        // Return 200 to prevent retries for invalid requests
        return res.status(200).json({ success: false, message: 'Webhook processed' });
    }
}
/**
 * Verify payment status
 */
async function verifyPayment(req, res, next) {
    try {
        const { transactionId } = req.params;
        const result = await payment_service_1.paymentService.verifyPayment(transactionId);
        return (0, response_1.successResponse)(res, result);
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=payment.controller.js.map