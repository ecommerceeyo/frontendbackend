"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.whatsappWorker = void 0;
exports.startWhatsAppWorker = startWhatsAppWorker;
const bullmq_1 = require("bullmq");
const queue_1 = require("../../config/queue");
const logger_1 = __importDefault(require("../../utils/logger"));
const notification_service_1 = require("./notification.service");
// Meta WhatsApp Business API Provider
class MetaWhatsAppProvider {
    phoneNumberId;
    accessToken;
    apiVersion;
    constructor() {
        this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
        this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';
        this.apiVersion = process.env.WHATSAPP_API_VERSION || 'v18.0';
    }
    async sendTemplate(to, template, data) {
        if (!this.phoneNumberId || !this.accessToken) {
            throw new Error('WhatsApp credentials not configured');
        }
        const url = `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`;
        // Build template components based on data
        const components = this.buildTemplateComponents(template, data);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: to.replace(/\D/g, ''),
                type: 'template',
                template: {
                    name: template,
                    language: { code: 'en' },
                    components,
                },
            }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(`WhatsApp API error: ${JSON.stringify(error)}`);
        }
        const result = await response.json();
        return { messageId: result.messages?.[0]?.id || 'unknown' };
    }
    buildTemplateComponents(template, data) {
        // Build components based on template type
        switch (template) {
            case 'order_confirmation':
                return [
                    {
                        type: 'body',
                        parameters: [
                            { type: 'text', text: data.orderNumber },
                            { type: 'text', text: `${data.total} ${data.currency}` },
                        ],
                    },
                ];
            case 'delivery_update':
                return [
                    {
                        type: 'body',
                        parameters: [
                            { type: 'text', text: data.orderNumber },
                            { type: 'text', text: data.status },
                        ],
                    },
                ];
            default:
                return [];
        }
    }
}
// Twilio WhatsApp Provider
class TwilioWhatsAppProvider {
    client;
    constructor() {
        try {
            const twilio = require('twilio');
            this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        }
        catch {
            logger_1.default.warn('Twilio not configured for WhatsApp');
        }
    }
    async sendTemplate(to, template, data) {
        if (!this.client) {
            throw new Error('Twilio client not initialized');
        }
        // Format message based on template
        const message = this.formatMessage(template, data);
        const result = await this.client.messages.create({
            body: message,
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${to}`,
        });
        return { messageId: result.sid };
    }
    formatMessage(template, data) {
        switch (template) {
            case 'order_confirmation':
                return `🛒 Order Confirmed!\n\nOrder: ${data.orderNumber}\nTotal: ${data.total} ${data.currency}\n\nThank you for your order!`;
            case 'delivery_update':
                return `📦 Delivery Update\n\nOrder: ${data.orderNumber}\nStatus: ${data.status}\n\nTrack your order in our app.`;
            default:
                return JSON.stringify(data);
        }
    }
}
// Mock WhatsApp Provider for development
class MockWhatsAppProvider {
    async sendTemplate(to, template, data) {
        logger_1.default.info(`[MOCK WHATSAPP] To: ${to}, Template: ${template}, Data:`, data);
        return { messageId: `mock-wa-${Date.now()}` };
    }
}
// Get WhatsApp provider based on config
function getWhatsAppProvider() {
    const provider = process.env.WHATSAPP_PROVIDER || 'mock';
    switch (provider) {
        case 'meta':
            return new MetaWhatsAppProvider();
        case 'twilio':
            return new TwilioWhatsAppProvider();
        default:
            return new MockWhatsAppProvider();
    }
}
const whatsappProvider = getWhatsAppProvider();
// Process WhatsApp job
async function processWhatsApp(job) {
    const { to, template, data, orderId } = job.data;
    logger_1.default.info(`Processing WhatsApp job ${job.id} - Template: ${template}, To: ${to}`);
    try {
        // Format phone number
        const formattedPhone = formatWhatsAppNumber(to);
        const result = await whatsappProvider.sendTemplate(formattedPhone, template, data);
        // Log success
        await notification_service_1.notificationService.logNotification('WHATSAPP', to, `Template: ${template}`, 'SENT', orderId);
        logger_1.default.info(`WhatsApp sent successfully: ${job.id}, MessageId: ${result.messageId}`);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        // Log failure
        await notification_service_1.notificationService.logNotification('WHATSAPP', to, `Template: ${template}`, 'FAILED', orderId, errorMessage);
        logger_1.default.error(`WhatsApp failed: ${job.id}`, error);
        throw error;
    }
}
// Format phone number for WhatsApp (needs country code without +)
function formatWhatsAppNumber(phone) {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // If already has country code (237 for Cameroon)
    if (cleaned.startsWith('237') && cleaned.length === 12) {
        return cleaned;
    }
    // If starts with 0, remove it and add country code
    if (cleaned.startsWith('0')) {
        return `237${cleaned.substring(1)}`;
    }
    // If 9 digits (Cameroon local format), add country code
    if (cleaned.length === 9) {
        return `237${cleaned}`;
    }
    return cleaned;
}
// Create and export worker
exports.whatsappWorker = new bullmq_1.Worker('whatsapp', processWhatsApp, {
    connection: queue_1.connection,
    concurrency: 5,
    limiter: {
        max: 10,
        duration: 1000,
    },
});
// Worker event handlers
exports.whatsappWorker.on('completed', (job) => {
    logger_1.default.info(`WhatsApp job ${job.id} completed`);
});
exports.whatsappWorker.on('failed', (job, err) => {
    logger_1.default.error(`WhatsApp job ${job?.id} failed:`, err);
});
exports.whatsappWorker.on('error', (err) => {
    logger_1.default.error('WhatsApp worker error:', err);
});
function startWhatsAppWorker() {
    logger_1.default.info('WhatsApp worker started');
}
//# sourceMappingURL=whatsapp.worker.js.map