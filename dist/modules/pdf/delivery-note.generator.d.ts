import { OrderData, CompanyInfo, PdfOptions } from './pdf.types';
export declare class DeliveryNoteGenerator {
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
    private drawOrderInfo;
    private drawAddresses;
    private drawItemsChecklist;
    private drawQrCode;
    private drawSignatureSection;
    private drawFooter;
    private formatDate;
    private truncateText;
    private getStatusColor;
}
export declare function generateDeliveryNotePdf(order: OrderData, company: CompanyInfo, options?: PdfOptions): Promise<Buffer>;
//# sourceMappingURL=delivery-note.generator.d.ts.map