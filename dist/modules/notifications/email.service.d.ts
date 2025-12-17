export type EmailTemplate = 'order_confirmation' | 'payment_success' | 'delivery_update' | 'welcome';
export interface SendEmailOptions {
    to: string;
    template: EmailTemplate;
    data: Record<string, any>;
}
/**
 * Send email directly (without Redis queue)
 */
export declare function sendEmail(options: SendEmailOptions): Promise<boolean>;
/**
 * Send order confirmation email
 */
export declare function sendOrderConfirmationEmail(order: {
    orderNumber: string;
    customerName: string;
    customerEmail: string | null;
    customerAddress: string;
    customerCity?: string | null;
    customerRegion?: string | null;
    paymentMethod: string;
    itemsSnapshot: any[];
    subtotal: number | any;
    deliveryFee: number | any;
    total: number | any;
}): Promise<boolean>;
/**
 * Send payment success email
 */
export declare function sendPaymentSuccessEmail(order: {
    orderNumber: string;
    customerName: string;
    customerEmail: string | null;
    total: number | any;
    currency: string;
}): Promise<boolean>;
/**
 * Send delivery update email
 */
export declare function sendDeliveryUpdateEmail(order: {
    orderNumber: string;
    customerName: string;
    customerEmail: string | null;
    status: string;
    message: string;
    trackingNumber?: string | null;
}): Promise<boolean>;
/**
 * Send welcome email to new customer
 */
export declare function sendWelcomeEmail(customer: {
    customerName: string;
    customerEmail: string;
    customerPhone?: string | null;
}): Promise<boolean>;
//# sourceMappingURL=email.service.d.ts.map