export interface EmailJobData {
    to: string;
    subject: string;
    template: 'order_confirmation' | 'payment_success' | 'payment_failed' | 'delivery_update' | 'invoice';
    data: Record<string, any>;
    orderId?: string;
}
export interface SmsJobData {
    to: string;
    message: string;
    orderId?: string;
}
export interface WhatsAppJobData {
    to: string;
    template: string;
    data: Record<string, any>;
    orderId?: string;
}
export interface PdfJobData {
    type: 'invoice' | 'delivery_note';
    orderId: string;
}
export declare class NotificationService {
    /**
     * Queue email notification
     */
    queueEmail(data: EmailJobData): Promise<string | null>;
    /**
     * Queue SMS notification
     */
    queueSms(data: SmsJobData): Promise<string | null>;
    /**
     * Queue WhatsApp notification
     */
    queueWhatsApp(data: WhatsAppJobData): Promise<string | null>;
    /**
     * Queue PDF generation
     */
    queuePdfGeneration(data: PdfJobData): Promise<string | null>;
    /**
     * Send order confirmation notifications
     */
    sendOrderConfirmation(orderId: string): Promise<void>;
    /**
     * Send payment success notifications
     */
    sendPaymentSuccess(orderId: string): Promise<void>;
    /**
     * Send payment failed notifications
     */
    sendPaymentFailed(orderId: string, reason?: string): Promise<void>;
    /**
     * Send delivery update notifications
     */
    sendDeliveryUpdate(orderId: string, status: string): Promise<void>;
    /**
     * Log notification to database
     */
    logNotification(type: 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH', recipient: string, subject: string, status: 'PENDING' | 'SENT' | 'FAILED', orderId?: string, error?: string): Promise<void>;
}
export declare const notificationService: NotificationService;
//# sourceMappingURL=notification.service.d.ts.map