"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = exports.PaymentService = void 0;
const database_1 = __importDefault(require("../../config/database"));
const config_1 = __importDefault(require("../../config"));
const client_1 = require("@prisma/client");
const helpers_1 = require("../../utils/helpers");
const errorHandler_1 = require("../../middleware/errorHandler");
const queue_1 = require("../../config/queue");
const logger_1 = __importDefault(require("../../utils/logger"));
class PaymentService {
    /**
     * Initiate mobile money payment
     */
    async initiatePayment(orderId, phoneNumber, provider = 'MTN_MOMO') {
        const order = await database_1.default.order.findUnique({
            where: { id: orderId },
            include: { payment: true },
        });
        if (!order) {
            throw new errorHandler_1.NotFoundError('Order');
        }
        if (!order.payment) {
            throw new errorHandler_1.AppError('Payment record not found', 400);
        }
        if (order.payment.status === client_1.PaymentStatus.PAID) {
            throw new errorHandler_1.AppError('Order has already been paid', 400);
        }
        const transactionId = (0, helpers_1.generateTransactionId)();
        // Update payment with transaction ID
        await database_1.default.payment.update({
            where: { id: order.payment.id },
            data: {
                transactionId,
                provider,
                phoneNumber,
                status: client_1.PaymentStatus.PENDING,
            },
        });
        // Call MTN MoMo API (simplified - in production, use proper SDK)
        try {
            const momoResponse = await this.callMomoApi({
                amount: String(order.total),
                currency: order.currency,
                externalId: transactionId,
                payer: {
                    partyIdType: 'MSISDN',
                    partyId: phoneNumber.replace(/^\+/, ''),
                },
                payerMessage: `Payment for order ${order.orderNumber}`,
                payeeNote: `Order ${order.orderNumber}`,
            });
            // Update payment with provider reference
            await database_1.default.payment.update({
                where: { id: order.payment.id },
                data: {
                    providerReference: momoResponse.referenceId,
                },
            });
            return {
                success: true,
                transactionId,
                referenceId: momoResponse.referenceId,
                message: 'Payment initiated. Please approve the payment on your phone.',
            };
        }
        catch (error) {
            logger_1.default.error('MoMo API error:', error);
            // Update payment status to failed
            await database_1.default.payment.update({
                where: { id: order.payment.id },
                data: {
                    status: client_1.PaymentStatus.FAILED,
                    failedAt: new Date(),
                    failedReason: error instanceof Error ? error.message : 'Payment initiation failed',
                },
            });
            throw new errorHandler_1.AppError('Failed to initiate payment. Please try again.', 500);
        }
    }
    /**
     * Handle payment webhook from mobile money provider
     */
    async handleWebhook(payload) {
        const payment = await database_1.default.payment.findUnique({
            where: { transactionId: payload.externalId },
            include: { order: true },
        });
        if (!payment) {
            logger_1.default.warn(`Payment not found for transaction: ${payload.externalId}`);
            throw new errorHandler_1.NotFoundError('Payment');
        }
        // Log webhook payload
        await database_1.default.payment.update({
            where: { id: payment.id },
            data: {
                webhookPayload: payload,
            },
        });
        let newStatus;
        switch (payload.status) {
            case 'SUCCESSFUL':
                newStatus = client_1.PaymentStatus.PAID;
                break;
            case 'FAILED':
                newStatus = client_1.PaymentStatus.FAILED;
                break;
            default:
                newStatus = client_1.PaymentStatus.PENDING;
        }
        // Update payment and order
        await database_1.default.$transaction(async (tx) => {
            await tx.payment.update({
                where: { id: payment.id },
                data: {
                    status: newStatus,
                    providerReference: payload.financialTransactionId || payment.providerReference,
                    paidAt: newStatus === client_1.PaymentStatus.PAID ? new Date() : undefined,
                    failedAt: newStatus === client_1.PaymentStatus.FAILED ? new Date() : undefined,
                    failedReason: payload.reason,
                },
            });
            await tx.order.update({
                where: { id: payment.orderId },
                data: {
                    paymentStatus: newStatus,
                },
            });
        });
        // Queue notifications based on status
        if (newStatus === client_1.PaymentStatus.PAID) {
            await this.onPaymentSuccess(payment.orderId);
        }
        else if (newStatus === client_1.PaymentStatus.FAILED) {
            await this.onPaymentFailure(payment.orderId, payload.reason);
        }
        return { success: true, status: newStatus };
    }
    /**
     * Verify payment status
     */
    async verifyPayment(transactionId) {
        const payment = await database_1.default.payment.findUnique({
            where: { transactionId },
            include: { order: true },
        });
        if (!payment) {
            throw new errorHandler_1.NotFoundError('Payment');
        }
        // If already completed, return current status
        if (payment.status !== client_1.PaymentStatus.PENDING) {
            return {
                transactionId,
                status: payment.status,
                amount: payment.amount,
                currency: payment.currency,
                paidAt: payment.paidAt,
            };
        }
        // Check with MoMo API
        try {
            const momoStatus = await this.checkMomoStatus(payment.providerReference || transactionId);
            if (momoStatus.status !== 'PENDING') {
                await this.handleWebhook({
                    externalId: transactionId,
                    status: momoStatus.status,
                    financialTransactionId: momoStatus.financialTransactionId,
                    reason: momoStatus.reason,
                });
            }
            return {
                transactionId,
                status: momoStatus.status === 'SUCCESSFUL' ? client_1.PaymentStatus.PAID :
                    momoStatus.status === 'FAILED' ? client_1.PaymentStatus.FAILED : client_1.PaymentStatus.PENDING,
                amount: payment.amount,
                currency: payment.currency,
            };
        }
        catch (error) {
            logger_1.default.error('Error verifying payment:', error);
            return {
                transactionId,
                status: payment.status,
                amount: payment.amount,
                currency: payment.currency,
            };
        }
    }
    /**
     * Call MTN MoMo API (simplified implementation)
     */
    async callMomoApi(data) {
        // In production, use proper MTN MoMo SDK
        // This is a simplified mock implementation
        if (config_1.default.nodeEnv === 'development' || config_1.default.momo.environment === 'sandbox') {
            // Simulate API call in development
            logger_1.default.info('MoMo API call (simulated):', data);
            return {
                referenceId: `MOMO-${Date.now()}`,
            };
        }
        // Production API call would go here
        const response = await fetch(`${config_1.default.momo.baseUrl}/collection/v1_0/requesttopay`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${await this.getMomoAccessToken()}`,
                'X-Reference-Id': data.externalId,
                'X-Target-Environment': config_1.default.momo.environment,
                'Ocp-Apim-Subscription-Key': config_1.default.momo.subscriptionKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`MoMo API error: ${response.status}`);
        }
        return { referenceId: data.externalId };
    }
    /**
     * Check MoMo payment status
     */
    async checkMomoStatus(referenceId) {
        if (config_1.default.nodeEnv === 'development' || config_1.default.momo.environment === 'sandbox') {
            // Simulate successful payment in development
            return {
                status: 'SUCCESSFUL',
                financialTransactionId: `FT-${Date.now()}`,
            };
        }
        const response = await fetch(`${config_1.default.momo.baseUrl}/collection/v1_0/requesttopay/${referenceId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${await this.getMomoAccessToken()}`,
                'X-Target-Environment': config_1.default.momo.environment,
                'Ocp-Apim-Subscription-Key': config_1.default.momo.subscriptionKey,
            },
        });
        if (!response.ok) {
            throw new Error(`MoMo status check error: ${response.status}`);
        }
        const data = await response.json();
        return {
            status: data.status,
            financialTransactionId: data.financialTransactionId,
            reason: data.reason,
        };
    }
    /**
     * Get MoMo access token
     */
    async getMomoAccessToken() {
        // In production, implement proper token caching
        const credentials = Buffer.from(`${config_1.default.momo.apiUser}:${config_1.default.momo.apiKey}`).toString('base64');
        const response = await fetch(`${config_1.default.momo.baseUrl}/collection/token/`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Ocp-Apim-Subscription-Key': config_1.default.momo.subscriptionKey,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to get MoMo access token');
        }
        const data = await response.json();
        return data.access_token;
    }
    /**
     * Handle successful payment
     */
    async onPaymentSuccess(orderId) {
        const order = await database_1.default.order.findUnique({
            where: { id: orderId },
        });
        if (!order)
            return;
        // Generate invoice
        await queue_1.pdfQueue.add('generate-invoice', {
            type: 'invoice',
            orderId,
        });
        // Send confirmation SMS
        await queue_1.smsQueue.add('payment-success', {
            to: order.customerPhone,
            message: `Payment received for order ${order.orderNumber}. Total: ${order.total} ${order.currency}. Thank you for your purchase!`,
            orderId,
        });
        // Send confirmation email
        if (order.customerEmail) {
            await queue_1.emailQueue.add('payment-success', {
                to: order.customerEmail,
                subject: `Payment Confirmed - ${order.orderNumber}`,
                template: 'payment-success',
                data: {
                    orderNumber: order.orderNumber,
                    customerName: order.customerName,
                    total: Number(order.total),
                    currency: order.currency,
                },
                orderId,
            });
        }
    }
    /**
     * Handle failed payment
     */
    async onPaymentFailure(orderId, reason) {
        const order = await database_1.default.order.findUnique({
            where: { id: orderId },
        });
        if (!order)
            return;
        // Send failure notification
        await queue_1.smsQueue.add('payment-failed', {
            to: order.customerPhone,
            message: `Payment failed for order ${order.orderNumber}. ${reason || 'Please try again or contact support.'}`,
            orderId,
        });
    }
}
exports.PaymentService = PaymentService;
exports.paymentService = new PaymentService();
//# sourceMappingURL=payment.service.js.map