import prisma from '../../config/database';
import config from '../../config';
import { PaymentStatus, MobileMoneyProvider } from '@prisma/client';
import { generateTransactionId } from '../../utils/helpers';
import { NotFoundError, AppError } from '../../middleware/errorHandler';
import { emailQueue, smsQueue, pdfQueue } from '../../config/queue';
import logger from '../../utils/logger';

interface MomoRequestBody {
  amount: string;
  currency: string;
  externalId: string;
  payer: {
    partyIdType: string;
    partyId: string;
  };
  payerMessage: string;
  payeeNote: string;
}

export class PaymentService {
  /**
   * Initiate mobile money payment
   */
  async initiatePayment(orderId: string, phoneNumber: string, provider: MobileMoneyProvider = 'MTN_MOMO') {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) {
      throw new NotFoundError('Order');
    }

    if (!order.payment) {
      throw new AppError('Payment record not found', 400);
    }

    if (order.payment.status === PaymentStatus.PAID) {
      throw new AppError('Order has already been paid', 400);
    }

    const transactionId = generateTransactionId();

    // Update payment with transaction ID
    await prisma.payment.update({
      where: { id: order.payment.id },
      data: {
        transactionId,
        provider,
        phoneNumber,
        status: PaymentStatus.PENDING,
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
      await prisma.payment.update({
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
    } catch (error) {
      logger.error('MoMo API error:', error);

      // Update payment status to failed
      await prisma.payment.update({
        where: { id: order.payment.id },
        data: {
          status: PaymentStatus.FAILED,
          failedAt: new Date(),
          failedReason: error instanceof Error ? error.message : 'Payment initiation failed',
        },
      });

      throw new AppError('Failed to initiate payment. Please try again.', 500);
    }
  }

  /**
   * Handle payment webhook from mobile money provider
   */
  async handleWebhook(payload: {
    externalId: string;
    status: 'SUCCESSFUL' | 'FAILED' | 'PENDING';
    financialTransactionId?: string;
    reason?: string;
  }) {
    const payment = await prisma.payment.findUnique({
      where: { transactionId: payload.externalId },
      include: { order: true },
    });

    if (!payment) {
      logger.warn(`Payment not found for transaction: ${payload.externalId}`);
      throw new NotFoundError('Payment');
    }

    // Log webhook payload
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        webhookPayload: payload as object,
      },
    });

    let newStatus: PaymentStatus;

    switch (payload.status) {
      case 'SUCCESSFUL':
        newStatus = PaymentStatus.PAID;
        break;
      case 'FAILED':
        newStatus = PaymentStatus.FAILED;
        break;
      default:
        newStatus = PaymentStatus.PENDING;
    }

    // Update payment and order
    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: newStatus,
          providerReference: payload.financialTransactionId || payment.providerReference,
          paidAt: newStatus === PaymentStatus.PAID ? new Date() : undefined,
          failedAt: newStatus === PaymentStatus.FAILED ? new Date() : undefined,
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
    if (newStatus === PaymentStatus.PAID) {
      await this.onPaymentSuccess(payment.orderId);
    } else if (newStatus === PaymentStatus.FAILED) {
      await this.onPaymentFailure(payment.orderId, payload.reason);
    }

    return { success: true, status: newStatus };
  }

  /**
   * Verify payment status
   */
  async verifyPayment(transactionId: string) {
    const payment = await prisma.payment.findUnique({
      where: { transactionId },
      include: { order: true },
    });

    if (!payment) {
      throw new NotFoundError('Payment');
    }

    // If already completed, return current status
    if (payment.status !== PaymentStatus.PENDING) {
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
        status: momoStatus.status === 'SUCCESSFUL' ? PaymentStatus.PAID :
                momoStatus.status === 'FAILED' ? PaymentStatus.FAILED : PaymentStatus.PENDING,
        amount: payment.amount,
        currency: payment.currency,
      };
    } catch (error) {
      logger.error('Error verifying payment:', error);
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
  private async callMomoApi(data: MomoRequestBody): Promise<{ referenceId: string }> {
    // In production, use proper MTN MoMo SDK
    // This is a simplified mock implementation

    if (config.nodeEnv === 'development' || config.momo.environment === 'sandbox') {
      // Simulate API call in development
      logger.info('MoMo API call (simulated):', data);
      return {
        referenceId: `MOMO-${Date.now()}`,
      };
    }

    // Production API call would go here
    const response = await fetch(`${config.momo.baseUrl}/collection/v1_0/requesttopay`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${await this.getMomoAccessToken()}`,
        'X-Reference-Id': data.externalId,
        'X-Target-Environment': config.momo.environment,
        'Ocp-Apim-Subscription-Key': config.momo.subscriptionKey,
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
  private async checkMomoStatus(referenceId: string): Promise<{
    status: 'SUCCESSFUL' | 'FAILED' | 'PENDING';
    financialTransactionId?: string;
    reason?: string;
  }> {
    if (config.nodeEnv === 'development' || config.momo.environment === 'sandbox') {
      // Simulate successful payment in development
      return {
        status: 'SUCCESSFUL',
        financialTransactionId: `FT-${Date.now()}`,
      };
    }

    const response = await fetch(
      `${config.momo.baseUrl}/collection/v1_0/requesttopay/${referenceId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await this.getMomoAccessToken()}`,
          'X-Target-Environment': config.momo.environment,
          'Ocp-Apim-Subscription-Key': config.momo.subscriptionKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`MoMo status check error: ${response.status}`);
    }

    const data = await response.json() as { status: 'PENDING' | 'FAILED' | 'SUCCESSFUL'; financialTransactionId?: string; reason?: string };
    return {
      status: data.status,
      financialTransactionId: data.financialTransactionId,
      reason: data.reason,
    };
  }

  /**
   * Get MoMo access token
   */
  private async getMomoAccessToken(): Promise<string> {
    // In production, implement proper token caching
    const credentials = Buffer.from(
      `${config.momo.apiUser}:${config.momo.apiKey}`
    ).toString('base64');

    const response = await fetch(`${config.momo.baseUrl}/collection/token/`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Ocp-Apim-Subscription-Key': config.momo.subscriptionKey,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get MoMo access token');
    }

    const data = await response.json() as { access_token: string };
    return data.access_token;
  }

  /**
   * Handle successful payment
   */
  private async onPaymentSuccess(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) return;

    // Generate invoice
    await pdfQueue.add('generate-invoice', {
      type: 'invoice',
      orderId,
    });

    // Send confirmation SMS
    await smsQueue.add('payment-success', {
      to: order.customerPhone,
      message: `Payment received for order ${order.orderNumber}. Total: ${order.total} ${order.currency}. Thank you for your purchase!`,
      orderId,
    });

    // Send confirmation email
    if (order.customerEmail) {
      await emailQueue.add('payment-success', {
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
  private async onPaymentFailure(orderId: string, reason?: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) return;

    // Send failure notification
    await smsQueue.add('payment-failed', {
      to: order.customerPhone,
      message: `Payment failed for order ${order.orderNumber}. ${reason || 'Please try again or contact support.'}`,
      orderId,
    });
  }
}

export const paymentService = new PaymentService();
