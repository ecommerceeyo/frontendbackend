import { ReportType, ReportStatus } from '@prisma/client';
export interface DashboardStats {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    topProducts: Array<{
        productId: string;
        name: string;
        quantity: number;
        revenue: number;
    }>;
    recentOrders: Array<{
        id: string;
        orderNumber: string;
        total: number;
        status: string;
        createdAt: Date;
    }>;
    ordersByStatus: Record<string, number>;
    revenueByPaymentMethod: Record<string, number>;
}
export declare class ReportService {
    /**
     * Get dashboard statistics
     */
    getDashboardStats(period?: 'today' | 'week' | 'month' | 'year'): Promise<DashboardStats>;
    /**
     * Get sales report data
     */
    getSalesReport(startDate: Date, endDate: Date, groupBy?: 'day' | 'week' | 'month'): Promise<{
        revenue: number;
        orders: number;
        items: number;
        date: string;
    }[]>;
    /**
     * Get inventory report
     */
    getInventoryReport(options?: {
        lowStock?: boolean;
        outOfStock?: boolean;
        categoryId?: string;
    }): Promise<{
        id: string;
        name: string;
        sku: string;
        stock: number;
        lowStockThreshold: number;
        isLowStock: boolean;
        isOutOfStock: boolean;
        categories: string[];
        price: number;
        stockValue: number;
    }[]>;
    /**
     * Get order report
     */
    getOrderReport(startDate: Date, endDate: Date): Promise<{
        summary: {
            total: number;
            byPaymentStatus: Record<string, number>;
            byDeliveryStatus: Record<string, number>;
            byPaymentMethod: Record<string, number>;
            totalRevenue: number;
            averageOrderValue: number;
        };
        orders: {
            id: string;
            orderNumber: string;
            customer: string;
            phone: string;
            total: number;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            deliveryStatus: import(".prisma/client").$Enums.DeliveryStatus;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            createdAt: Date;
        }[];
    }>;
    /**
     * Generate a report (async via queue)
     */
    generateReport(type: ReportType, parameters: {
        startDate: Date;
        endDate: Date;
        format?: 'pdf' | 'csv';
    }, adminId: string): Promise<{
        error: string | null;
        createdAt: Date;
        name: string;
        id: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ReportStatus;
        type: import(".prisma/client").$Enums.ReportType;
        parameters: import("@prisma/client/runtime/library").JsonValue | null;
        fileUrl: string | null;
        fileSize: number | null;
        startedAt: Date | null;
        completedAt: Date | null;
        generatedBy: string | null;
    }>;
    /**
     * Get report by ID
     */
    getReportById(id: string): Promise<{
        admin: {
            name: string;
            email: string;
        };
    } & {
        error: string | null;
        createdAt: Date;
        name: string;
        id: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ReportStatus;
        type: import(".prisma/client").$Enums.ReportType;
        parameters: import("@prisma/client/runtime/library").JsonValue | null;
        fileUrl: string | null;
        fileSize: number | null;
        startedAt: Date | null;
        completedAt: Date | null;
        generatedBy: string | null;
    }>;
    /**
     * Get all reports
     */
    getReports(params?: {
        type?: ReportType;
        status?: ReportStatus;
        page?: number;
        limit?: number;
    }): Promise<{
        reports: ({
            admin: {
                name: string;
            };
        } & {
            error: string | null;
            createdAt: Date;
            name: string;
            id: string;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ReportStatus;
            type: import(".prisma/client").$Enums.ReportType;
            parameters: import("@prisma/client/runtime/library").JsonValue | null;
            fileUrl: string | null;
            fileSize: number | null;
            startedAt: Date | null;
            completedAt: Date | null;
            generatedBy: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    /**
     * Update daily sales report (called by cron job)
     */
    updateDailySalesReport(date: Date): Promise<{
        totalOrders: number;
        completedOrders: number;
        cancelledOrders: number;
        pendingOrders: number;
        grossSales: number;
        totalDiscount: number;
        totalDeliveryFees: number;
        netSales: number;
        momoPayments: number;
        momoAmount: number;
        codPayments: number;
        codAmount: number;
        itemsSold: number;
        uniqueProducts: number;
    }>;
    /**
     * Get comprehensive report summary for admin reports page
     */
    getReportSummary(startDate: Date, endDate: Date): Promise<{
        summary: {
            totalRevenue: number;
            totalOrders: number;
            totalProducts: number;
            averageOrderValue: number;
            revenueChange: number;
            ordersChange: number;
            preorderOrders: number;
            avgDeliveryDays: number;
        };
        topProducts: {
            id: string;
            name: string;
            totalSold: number;
            revenue: number;
        }[];
        recentSales: {
            revenue: number;
            orders: number;
            date: string;
        }[];
        ordersByStatus: {
            status: string;
            count: number;
        }[];
        deliveryPerformance: {
            supplier: {
                id: string;
                businessName: string;
            };
            delivered: number;
            avgDays: number;
            onTime: number;
            late: number;
        }[];
        preorderProducts: {
            id: string;
            name: string;
            pendingOrders: number;
            totalOrdered: number;
        }[];
    }>;
}
export declare const reportService: ReportService;
//# sourceMappingURL=report.service.d.ts.map