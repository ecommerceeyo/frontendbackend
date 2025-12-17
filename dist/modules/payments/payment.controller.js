import { paymentService } from './payment.service';
import { successResponse } from '../../utils/response';
import logger from '../../utils/logger';
/**
 * Initiate payment
 */
export async function initiatePayment(req, res, next) {
    try {
        const { orderId, phoneNumber, provider } = req.body;
        const result = await paymentService.initiatePayment(orderId, phoneNumber, provider);
        return successResponse(res, result);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Handle payment webhook from mobile money provider
 */
export async function handleWebhook(req, res, next) {
    try {
        // Log incoming webhook
        logger.info('Payment webhook received:', JSON.stringify(req.body));
        const payload = req.body;
        // Handle MTN MoMo webhook format
        const result = await paymentService.handleWebhook({
            externalId: payload.externalId,
            status: payload.status,
            financialTransactionId: payload.financialTransactionId,
            reason: payload.reason,
        });
        return successResponse(res, result);
    }
    catch (error) {
        // Log but don't expose error details to webhook caller
        logger.error('Webhook error:', error);
        // Return 200 to prevent retries for invalid requests
        return res.status(200).json({ success: false, message: 'Webhook processed' });
    }
}
/**
 * Verify payment status
 */
export async function verifyPayment(req, res, next) {
    try {
        const { transactionId } = req.params;
        const result = await paymentService.verifyPayment(transactionId);
        return successResponse(res, result);
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=payment.controller.js.map