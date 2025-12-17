import { Prisma, PayoutStatus } from '@prisma/client';
export interface PayoutListParams {
    page?: number;
    limit?: number;
    supplierId?: string;
    status?: PayoutStatus;
    startDate?: Date;
    endDate?: Date;
}
export declare class PayoutService {
    /**
     * Get all payouts (admin)
     */
    getPayouts(params: PayoutListParams): Promise<{
        payouts: ({
            supplier: {
                id: string;
                email: string;
                businessName: string;
            };
        } & {
            currency: string;
            createdAt: Date;
            id: string;
            updatedAt: Date;
            supplierId: string;
            notes: string | null;
            status: import(".prisma/client").$Enums.PayoutStatus;
            paymentMethod: string | null;
            paidAt: Date | null;
            commissionAmount: Prisma.Decimal;
            netAmount: Prisma.Decimal;
            grossAmount: Prisma.Decimal;
            itemCount: number;
            periodStart: Date;
            periodEnd: Date;
            paymentReference: string | null;
            orderItemIds: string[];
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    /**
     * Get single payout
     */
    getPayout(payoutId: string): Promise<{
        supplier: {
            id: string;
            email: string;
            businessName: string;
            bankName: string;
            bankAccountNumber: string;
            bankAccountName: string;
        };
    } & {
        currency: string;
        createdAt: Date;
        id: string;
        updatedAt: Date;
        supplierId: string;
        notes: string | null;
        status: import(".prisma/client").$Enums.PayoutStatus;
        paymentMethod: string | null;
        paidAt: Date | null;
        commissionAmount: Prisma.Decimal;
        netAmount: Prisma.Decimal;
        grossAmount: Prisma.Decimal;
        itemCount: number;
        periodStart: Date;
        periodEnd: Date;
        paymentReference: string | null;
        orderItemIds: string[];
    }>;
    /**
     * Generate payouts for a period
     */
    generatePayouts(periodStart: Date, periodEnd: Date): Promise<{
        currency: string;
        createdAt: Date;
        id: string;
        updatedAt: Date;
        supplierId: string;
        notes: string | null;
        status: import(".prisma/client").$Enums.PayoutStatus;
        paymentMethod: string | null;
        paidAt: Date | null;
        commissionAmount: Prisma.Decimal;
        netAmount: Prisma.Decimal;
        grossAmount: Prisma.Decimal;
        itemCount: number;
        periodStart: Date;
        periodEnd: Date;
        paymentReference: string | null;
        orderItemIds: string[];
    }[]>;
    /**
     * Update payout status
     */
    updatePayoutStatus(payoutId: string, status: PayoutStatus, paymentReference?: string, notes?: string): Promise<{
        supplier: {
            businessName: string;
        };
    } & {
        currency: string;
        createdAt: Date;
        id: string;
        updatedAt: Date;
        supplierId: string;
        notes: string | null;
        status: import(".prisma/client").$Enums.PayoutStatus;
        paymentMethod: string | null;
        paidAt: Date | null;
        commissionAmount: Prisma.Decimal;
        netAmount: Prisma.Decimal;
        grossAmount: Prisma.Decimal;
        itemCount: number;
        periodStart: Date;
        periodEnd: Date;
        paymentReference: string | null;
        orderItemIds: string[];
    }>;
    /**
     * Get payout summary statistics
     */
    getPayoutStats(): Promise<{
        pending: {
            count: number;
            amount: number;
        };
        processing: {
            count: number;
            amount: number;
        };
        completed: {
            count: number;
            amount: number;
        };
        failed: {
            count: number;
            amount: number;
        };
    }>;
    /**
     * Get supplier earnings summary
     */
    getSupplierEarnings(supplierId: string): Promise<{
        lifetimeEarnings: number;
        monthlyEarnings: number;
        pendingPayouts: number;
        totalPaid: number;
    }>;
}
export declare const payoutService: PayoutService;
//# sourceMappingURL=payout.service.d.ts.map