"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailWorker = void 0;
exports.startEmailWorker = startEmailWorker;
const bullmq_1 = require("bullmq");
const nodemailer_1 = __importDefault(require("nodemailer"));
const queue_1 = require("../../config/queue");
const config_1 = __importDefault(require("../../config"));
const logger_1 = __importDefault(require("../../utils/logger"));
const notification_service_1 = require("./notification.service");
// Email templates
const templates = {
    order_confirmation: (data) => ({
        subject: `Order Confirmation - ${data.orderNumber}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Order Confirmed!</h1>
        <p>Dear ${data.customerName},</p>
        <p>Thank you for your order. Your order <strong>${data.orderNumber}</strong> has been confirmed.</p>

        <h2 style="color: #555;">Order Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Item</th>
              <th style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">Qty</th>
              <th style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map((item) => `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
                <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">${item.quantity}</td>
                <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">${item.price} XAF</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
              <td style="padding: 10px; text-align: right;">${data.subtotal} XAF</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right;"><strong>Delivery Fee:</strong></td>
              <td style="padding: 10px; text-align: right;">${data.deliveryFee} XAF</td>
            </tr>
            <tr style="background-color: #f5f5f5;">
              <td colspan="2" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
              <td style="padding: 10px; text-align: right;"><strong>${data.total} XAF</strong></td>
            </tr>
          </tfoot>
        </table>

        <h2 style="color: #555;">Delivery Address</h2>
        <p>${data.deliveryAddress}</p>

        <h2 style="color: #555;">Payment Method</h2>
        <p>${data.paymentMethod === 'MOMO' ? 'Mobile Money' : 'Cash on Delivery'}</p>

        <p style="margin-top: 30px;">Thank you for shopping with us!</p>
      </div>
    `,
    }),
    payment_success: (data) => ({
        subject: `Payment Received - ${data.orderNumber}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #28a745;">Payment Successful!</h1>
        <p>Dear ${data.customerName},</p>
        <p>We have received your payment for order <strong>${data.orderNumber}</strong>.</p>
        <p><strong>Amount:</strong> ${data.total} ${data.currency}</p>
        <p>Your order is now being processed and will be shipped soon.</p>
        <p style="margin-top: 30px;">Thank you for your purchase!</p>
      </div>
    `,
    }),
    payment_failed: (data) => ({
        subject: `Payment Failed - ${data.orderNumber}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc3545;">Payment Failed</h1>
        <p>Dear ${data.customerName},</p>
        <p>Unfortunately, the payment for order <strong>${data.orderNumber}</strong> could not be processed.</p>
        <p><strong>Reason:</strong> ${data.reason}</p>
        <p><strong>Amount:</strong> ${data.total} ${data.currency}</p>
        <p>Please try again or contact our support team for assistance.</p>
      </div>
    `,
    }),
    delivery_update: (data) => ({
        subject: `Delivery Update - ${data.orderNumber}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #007bff;">Delivery Update</h1>
        <p>Dear ${data.customerName},</p>
        <p>Your order <strong>${data.orderNumber}</strong> status has been updated.</p>
        <p><strong>Status:</strong> ${data.status}</p>
        <p>${data.message}</p>
        ${data.trackingNumber ? `<p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>` : ''}
      </div>
    `,
    }),
    invoice: (data) => ({
        subject: `Invoice - ${data.orderNumber}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Invoice</h1>
        <p>Please find your invoice attached for order <strong>${data.orderNumber}</strong>.</p>
      </div>
    `,
    }),
};
// Create transporter
const createTransporter = () => {
    return nodemailer_1.default.createTransport({
        host: config_1.default.smtp.host,
        port: config_1.default.smtp.port,
        secure: config_1.default.smtp.port === 465,
        auth: {
            user: config_1.default.smtp.user,
            pass: config_1.default.smtp.pass,
        },
    });
};
// Process email job
async function processEmail(job) {
    const { to, template, data, orderId } = job.data;
    logger_1.default.info(`Processing email job ${job.id} - Template: ${template}, To: ${to}`);
    try {
        const transporter = createTransporter();
        const emailTemplate = templates[template](data);
        await transporter.sendMail({
            from: `"${config_1.default.smtp.fromName}" <${config_1.default.smtp.fromEmail}>`,
            to,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
        });
        // Log success
        await notification_service_1.notificationService.logNotification('EMAIL', to, emailTemplate.subject, 'SENT', orderId);
        logger_1.default.info(`Email sent successfully: ${job.id}`);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        // Log failure
        await notification_service_1.notificationService.logNotification('EMAIL', to, job.data.subject, 'FAILED', orderId, errorMessage);
        logger_1.default.error(`Email failed: ${job.id}`, error);
        throw error;
    }
}
// Create and export worker
exports.emailWorker = new bullmq_1.Worker('email', processEmail, {
    connection: queue_1.connection,
    concurrency: 5,
    limiter: {
        max: 10,
        duration: 1000,
    },
});
// Worker event handlers
exports.emailWorker.on('completed', (job) => {
    logger_1.default.info(`Email job ${job.id} completed`);
});
exports.emailWorker.on('failed', (job, err) => {
    logger_1.default.error(`Email job ${job?.id} failed:`, err);
});
exports.emailWorker.on('error', (err) => {
    logger_1.default.error('Email worker error:', err);
});
function startEmailWorker() {
    logger_1.default.info('Email worker started');
}
//# sourceMappingURL=email.worker.js.map