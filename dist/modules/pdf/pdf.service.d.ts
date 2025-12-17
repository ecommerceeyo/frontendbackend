import { PdfOptions } from './pdf.types';
export declare class PdfService {
    private getCompanyInfo;
    /**
     * Generate and upload invoice PDF
     */
    generateInvoice(orderId: string, options?: PdfOptions): Promise<string>;
    /**
     * Generate and upload delivery note PDF
     */
    generateDeliveryNote(orderId: string, options?: PdfOptions): Promise<string>;
    /**
     * Generate both invoice and delivery note
     */
    generateAllDocuments(orderId: string): Promise<{
        invoiceUrl: string;
        deliveryNoteUrl: string;
    }>;
    /**
     * Regenerate invoice for an order
     */
    regenerateInvoice(orderId: string): Promise<string>;
    /**
     * Get order data for PDF generation
     */
    private getOrderData;
    /**
     * Upload PDF buffer to Supabase Storage
     */
    private uploadToSupabase;
    /**
     * Delete PDF from Supabase Storage
     */
    private deleteFromSupabase;
}
export declare const pdfService: PdfService;
//# sourceMappingURL=pdf.service.d.ts.map