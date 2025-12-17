import { MobileMoneyProvider } from '@prisma/client';
export declare class PaymentService {
    /**
     * Initiate mobile money payment
     */
    initiatePayment(orderId: string, phoneNumber: string, provider?: MobileMoneyProvider): Promise<{
        success: boolean;
        transactionId: string;
        referenceId: string;
        message: string;
    }>;
    /**
     * Handle payment webhook from mobile money provider
     */
    handleWebhook(payload: {
        externalId: string;
        status: 'SUCCESSFUL' | 'FAILED' | 'PENDING';
        financialTransactionId?: string;
        reason?: string;
    }): Promise<{
        success: boolean;
        status: import(".prisma/client").$Enums.PaymentStatus;
    }>;
    /**
     * Verify payment status
     */
    verifyPayment(transactionId: string): Promise<{
        transactionId: string;
        status: "PAID" | "FAILED";
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        paidAt: Date;
    } | {
        transactionId: string;
        status: "PENDING" | "PAID" | "FAILED";
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        paidAt?: undefined;
    }>;
    /**
     * Call MTN MoMo API (simplified implementation)
     */
    private callMomoApi;
    /**
     * Check MoMo payment status
     */
    private checkMomoStatus;
    /**
     * Get MoMo access token
     */
    private getMomoAccessToken;
    /**
     * Handle successful payment
     */
    private onPaymentSuccess;
    /**
     * Handle failed payment
     */
    private onPaymentFailure;
}
export declare const paymentService: PaymentService;
//# sourceMappingURL=payment.service.d.ts.map