import { OrderData, CompanyInfo, PdfOptions } from './pdf.types';
export declare class InvoiceGenerator {
    private doc;
    private order;
    private company;
    private options;
    private pageWidth;
    private margin;
    private contentWidth;
    constructor(order: OrderData, company: CompanyInfo, options?: PdfOptions);
    generate(): Promise<Buffer>;
    private drawHeader;
    private drawInvoiceInfo;
    private drawCustomerInfo;
    private drawItemsTable;
    private drawTotals;
    private drawPaymentInfo;
    private drawQrCode;
    private drawFooter;
    private formatCurrency;
    private formatDate;
    private truncateText;
    private getStatusColor;
}
export declare function generateInvoicePdf(order: OrderData, company: CompanyInfo, options?: PdfOptions): Promise<Buffer>;
//# sourceMappingURL=invoice.generator.d.ts.map