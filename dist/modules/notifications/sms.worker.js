"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.smsWorker = void 0;
exports.startSmsWorker = startSmsWorker;
const bullmq_1 = require("bullmq");
const queue_1 = require("../../config/queue");
const logger_1 = __importDefault(require("../../utils/logger"));
const notification_service_1 = require("./notification.service");
// Twilio SMS Provider
class TwilioProvider {
    client;
    constructor() {
        // Lazy load twilio
        try {
            const twilio = require('twilio');
            this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        }
        catch {
            logger_1.default.warn('Twilio not configured');
        }
    }
    async send(to, message) {
        if (!this.client) {
            throw new Error('Twilio client not initialized');
        }
        const result = await this.client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to,
        });
        return { messageId: result.sid };
    }
}
// Africa's Talking SMS Provider (common in Cameroon)
class AfricasTalkingProvider {
    client;
    constructor() {
        try {
            const AfricasTalking = require('africastalking');
            const africastalking = AfricasTalking({
                apiKey: process.env.AT_API_KEY,
                username: process.env.AT_USERNAME,
            });
            this.client = africastalking.SMS;
        }
        catch {
            logger_1.default.warn("Africa's Talking not configured");
        }
    }
    async send(to, message) {
        if (!this.client) {
            throw new Error("Africa's Talking client not initialized");
        }
        const result = await this.client.send({
            to: [to],
            message,
            from: process.env.AT_SENDER_ID,
        });
        return { messageId: result.SMSMessageData?.Recipients?.[0]?.messageId || 'unknown' };
    }
}
// Mock SMS Provider for development
class MockSmsProvider {
    async send(to, message) {
        logger_1.default.info(`[MOCK SMS] To: ${to}, Message: ${message}`);
        return { messageId: `mock-${Date.now()}` };
    }
}
// Get SMS provider based on config
function getSmsProvider() {
    const provider = process.env.SMS_PROVIDER || 'mock';
    switch (provider) {
        case 'twilio':
            return new TwilioProvider();
        case 'africastalking':
            return new AfricasTalkingProvider();
        default:
            return new MockSmsProvider();
    }
}
const smsProvider = getSmsProvider();
// Process SMS job
async function processSms(job) {
    const { to, message, orderId } = job.data;
    logger_1.default.info(`Processing SMS job ${job.id} - To: ${to}`);
    try {
        // Format phone number (ensure it has country code)
        const formattedPhone = formatPhoneNumber(to);
        const result = await smsProvider.send(formattedPhone, message);
        // Log success
        await notification_service_1.notificationService.logNotification('SMS', to, message.substring(0, 100), 'SENT', orderId);
        logger_1.default.info(`SMS sent successfully: ${job.id}, MessageId: ${result.messageId}`);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        // Log failure
        await notification_service_1.notificationService.logNotification('SMS', to, message.substring(0, 100), 'FAILED', orderId, errorMessage);
        logger_1.default.error(`SMS failed: ${job.id}`, error);
        throw error;
    }
}
// Format phone number with country code (Cameroon: +237)
function formatPhoneNumber(phone) {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // If already has country code (237 for Cameroon)
    if (cleaned.startsWith('237') && cleaned.length === 12) {
        return `+${cleaned}`;
    }
    // If starts with 0, remove it and add country code
    if (cleaned.startsWith('0')) {
        return `+237${cleaned.substring(1)}`;
    }
    // If 9 digits (Cameroon local format), add country code
    if (cleaned.length === 9) {
        return `+237${cleaned}`;
    }
    // If already has + prefix
    if (phone.startsWith('+')) {
        return phone;
    }
    // Default: add +237 prefix
    return `+237${cleaned}`;
}
// Create and export worker
exports.smsWorker = new bullmq_1.Worker('sms', processSms, {
    connection: queue_1.connection,
    concurrency: 10,
    limiter: {
        max: 20,
        duration: 1000,
    },
});
// Worker event handlers
exports.smsWorker.on('completed', (job) => {
    logger_1.default.info(`SMS job ${job.id} completed`);
});
exports.smsWorker.on('failed', (job, err) => {
    logger_1.default.error(`SMS job ${job?.id} failed:`, err);
});
exports.smsWorker.on('error', (err) => {
    logger_1.default.error('SMS worker error:', err);
});
function startSmsWorker() {
    logger_1.default.info('SMS worker started');
}
//# sourceMappingURL=sms.worker.js.map