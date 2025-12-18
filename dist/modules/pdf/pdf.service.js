"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfService = exports.PdfService = void 0;
const database_1 = __importDefault(require("../../config/database"));
const supabase_1 = require("../../config/supabase");
const logger_1 = __importDefault(require("../../utils/logger"));
const invoice_generator_1 = require("./invoice.generator");
const delivery_note_generator_1 = require("./delivery-note.generator");
class PdfService {
    getCompanyInfo() {
        return {
            name: process.env.COMPANY_NAME || 'E-Commerce Store',
            address: process.env.COMPANY_ADDRESS || 'Douala, Cameroon',
            phone: process.env.COMPANY_PHONE || '+237 6XX XXX XXX',
            email: process.env.COMPANY_EMAIL || '',
            website: process.env.COMPANY_WEBSITE || '',
        };
    }
    /**
     * Generate and upload invoice PDF
     */
    async generateInvoice(orderId, options) {
        const order = await this.getOrderData(orderId);
        const company = this.getCompanyInfo();
        // Generate PDF
        const pdfBuffer = await (0, invoice_generator_1.generateInvoicePdf)(order, company, {
            ...options,
            qrCodeUrl: `${process.env.FRONTEND_URL}/track/${order.orderNumber}`,
        });
        // Upload to Supabase Storage
        const filename = `invoice-${order.orderNumber}.pdf`;
        const uploadResult = await this.uploadToSupabase(pdfBuffer, filename, 'invoices');
        // Update order with invoice URL
        await database_1.default.order.update({
            where: { id: orderId },
            data: { invoiceUrl: uploadResult.url },
        });
        logger_1.default.info(`Invoice generated for order ${order.orderNumber}: ${uploadResult.url}`);
        return uploadResult.url;
    }
    /**
     * Generate and upload delivery note PDF
     */
    async generateDeliveryNote(orderId, options) {
        const order = await this.getOrderData(orderId);
        const company = this.getCompanyInfo();
        // Generate PDF
        const pdfBuffer = await (0, delivery_note_generator_1.generateDeliveryNotePdf)(order, company, {
            ...options,
            qrCodeUrl: `${process.env.FRONTEND_URL}/track/${order.orderNumber}`,
        });
        // Upload to Supabase Storage
        const filename = `delivery-note-${order.orderNumber}.pdf`;
        const uploadResult = await this.uploadToSupabase(pdfBuffer, filename, 'delivery-notes');
        // Update order with delivery note URL
        await database_1.default.order.update({
            where: { id: orderId },
            data: { deliveryNoteUrl: uploadResult.url },
        });
        logger_1.default.info(`Delivery note generated for order ${order.orderNumber}: ${uploadResult.url}`);
        return uploadResult.url;
    }
    /**
     * Generate both invoice and delivery note
     */
    async generateAllDocuments(orderId) {
        const [invoiceUrl, deliveryNoteUrl] = await Promise.all([
            this.generateInvoice(orderId),
            this.generateDeliveryNote(orderId),
        ]);
        return { invoiceUrl, deliveryNoteUrl };
    }
    /**
     * Regenerate invoice for an order
     */
    async regenerateInvoice(orderId) {
        // Delete old invoice if exists
        const order = await database_1.default.order.findUnique({
            where: { id: orderId },
            select: { invoiceUrl: true, orderNumber: true },
        });
        if (order?.invoiceUrl) {
            await this.deleteFromSupabase(order.invoiceUrl);
        }
        return this.generateInvoice(orderId);
    }
    /**
     * Get order data for PDF generation
     */
    async getOrderData(orderId) {
        const order = await database_1.default.order.findUnique({
            where: { id: orderId },
            include: {
                payment: true,
                delivery: {
                    include: {
                        courier: true,
                    },
                },
            },
        });
        if (!order) {
            throw new Error(`Order not found: ${orderId}`);
        }
        return {
            id: order.id,
            orderNumber: order.orderNumber,
            createdAt: order.createdAt,
            customerName: order.customerName,
            customerPhone: order.customerPhone,
            customerEmail: order.customerEmail,
            deliveryAddress: order.customerAddress,
            deliveryNotes: order.deliveryNotes,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            deliveryStatus: order.deliveryStatus,
            subtotal: order.subtotal.toNumber(),
            deliveryFee: order.deliveryFee.toNumber(),
            total: order.total.toNumber(),
            currency: order.currency,
            itemsSnapshot: order.itemsSnapshot,
            payment: order.payment ? {
                id: order.payment.id,
                provider: order.payment.provider || '',
                transactionId: order.payment.transactionId,
                status: order.payment.status,
                paidAt: order.payment.paidAt,
            } : null,
            delivery: order.delivery ? {
                id: order.delivery.id,
                trackingNumber: order.delivery.trackingNumber,
                status: order.delivery.status,
                courier: order.delivery.courier ? {
                    name: order.delivery.courier.name,
                    phone: order.delivery.courier.phone,
                } : null,
            } : null,
        };
    }
    /**
     * Upload PDF buffer to Supabase Storage
     */
    async uploadToSupabase(buffer, filename, folder) {
        if (!(0, supabase_1.isSupabaseConfigured)()) {
            throw new Error('Supabase Storage is not configured');
        }
        const filePath = `documents/${folder}/${filename}`;
        const { data, error } = await supabase_1.supabase.storage
            .from(supabase_1.STORAGE_BUCKET)
            .upload(filePath, buffer, {
            contentType: 'application/pdf',
            cacheControl: '3600',
            upsert: true,
        });
        if (error) {
            logger_1.default.error('Supabase PDF upload error:', error);
            throw new Error(`Failed to upload PDF: ${error.message}`);
        }
        // Get public URL
        const { data: urlData } = supabase_1.supabase.storage
            .from(supabase_1.STORAGE_BUCKET)
            .getPublicUrl(filePath);
        return {
            url: urlData.publicUrl,
            path: filePath,
        };
    }
    /**
     * Delete PDF from Supabase Storage
     */
    async deleteFromSupabase(url) {
        try {
            if (!(0, supabase_1.isSupabaseConfigured)()) {
                return;
            }
            // Extract file path from URL
            const urlObj = new URL(url);
            const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)/);
            if (pathMatch) {
                const filePath = pathMatch[1];
                const { error } = await supabase_1.supabase.storage
                    .from(supabase_1.STORAGE_BUCKET)
                    .remove([filePath]);
                if (error) {
                    logger_1.default.error('Failed to delete PDF from Supabase:', error);
                }
            }
        }
        catch (error) {
            logger_1.default.error('Failed to delete PDF from Supabase:', error);
        }
    }
}
exports.PdfService = PdfService;
exports.pdfService = new PdfService();
//# sourceMappingURL=pdf.service.js.map