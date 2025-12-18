"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.payoutService = exports.PayoutService = void 0;
const database_1 = __importDefault(require("../../config/database"));
const client_1 = require("@prisma/client");
const helpers_1 = require("../../utils/helpers");
const errorHandler_1 = require("../../middleware/errorHandler");
class PayoutService {
    /**
     * Get all payouts (admin)
     */
    async getPayouts(params) {
        const { page, limit, skip } = (0, helpers_1.parsePaginationParams)(params);
        const where = {};
        if (params.supplierId) {
            where.supplierId = params.supplierId;
        }
        if (params.status) {
            where.status = params.status;
        }
        if (params.startDate || params.endDate) {
            where.periodStart = {};
            if (params.startDate) {
                where.periodStart.gte = params.startDate;
            }
            if (params.endDate) {
                where.periodEnd = { lte: params.endDate };
            }
        }
        const [payouts, total] = await Promise.all([
            database_1.default.supplierPayout.findMany({
                where,
                include: {
                    supplier: {
                        select: {
                            id: true,
                            businessName: true,
                            email: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            database_1.default.supplierPayout.count({ where }),
        ]);
        return { payouts, total, page, limit };
    }
    /**
     * Get single payout
     */
    async getPayout(payoutId) {
        const payout = await database_1.default.supplierPayout.findUnique({
            where: { id: payoutId },
            include: {
                supplier: {
                    select: {
                        id: true,
                        businessName: true,
                        email: true,
                        bankName: true,
                        bankAccountNumber: true,
                        bankAccountName: true,
                    },
                },
            },
        });
        if (!payout) {
            throw new errorHandler_1.NotFoundError('Payout');
        }
        return payout;
    }
    /**
     * Generate payouts for a period
     */
    async generatePayouts(periodStart, periodEnd) {
        // Get all active suppliers
        const suppliers = await database_1.default.supplier.findMany({
            where: { status: 'ACTIVE' },
            select: {
                id: true,
                businessName: true,
                commissionRate: true,
            },
        });
        const payouts = [];
        for (const supplier of suppliers) {
            // Calculate earnings for this period
            const orderItems = await database_1.default.orderItem.findMany({
                where: {
                    supplierId: supplier.id,
                    fulfillmentStatus: 'DELIVERED',
                    deliveredAt: {
                        gte: periodStart,
                        lte: periodEnd,
                    },
                },
                select: {
                    id: true,
                    totalPrice: true,
                    commissionAmount: true,
                },
            });
            if (orderItems.length === 0)
                continue;
            const grossAmount = orderItems.reduce((sum, item) => sum + item.totalPrice.toNumber(), 0);
            const commissionAmount = orderItems.reduce((sum, item) => sum + item.commissionAmount.toNumber(), 0);
            const netAmount = grossAmount - commissionAmount;
            // Check if payout already exists for this period
            const existingPayout = await database_1.default.supplierPayout.findFirst({
                where: {
                    supplierId: supplier.id,
                    periodStart,
                    periodEnd,
                },
            });
            if (existingPayout)
                continue;
            // Create payout record
            const payout = await database_1.default.supplierPayout.create({
                data: {
                    supplierId: supplier.id,
                    periodStart,
                    periodEnd,
                    grossAmount,
                    commissionAmount,
                    netAmount,
                    currency: 'XAF',
                    status: 'PENDING',
                    orderItemIds: orderItems.map(item => item.id),
                    itemCount: orderItems.length,
                },
            });
            payouts.push(payout);
        }
        return payouts;
    }
    /**
     * Update payout status
     */
    async updatePayoutStatus(payoutId, status, paymentReference, notes) {
        const payout = await database_1.default.supplierPayout.findUnique({
            where: { id: payoutId },
        });
        if (!payout) {
            throw new errorHandler_1.NotFoundError('Payout');
        }
        const updates = {
            status,
        };
        if (paymentReference) {
            updates.paymentReference = paymentReference;
        }
        if (notes) {
            updates.notes = notes;
        }
        if (status === client_1.PayoutStatus.COMPLETED) {
            updates.paidAt = new Date();
        }
        const updatedPayout = await database_1.default.supplierPayout.update({
            where: { id: payoutId },
            data: updates,
            include: {
                supplier: {
                    select: { businessName: true },
                },
            },
        });
        return updatedPayout;
    }
    /**
     * Get payout summary statistics
     */
    async getPayoutStats() {
        const [pending, processing, completed, failed] = await Promise.all([
            database_1.default.supplierPayout.aggregate({
                where: { status: client_1.PayoutStatus.PENDING },
                _sum: { netAmount: true },
                _count: true,
            }),
            database_1.default.supplierPayout.aggregate({
                where: { status: client_1.PayoutStatus.PROCESSING },
                _sum: { netAmount: true },
                _count: true,
            }),
            database_1.default.supplierPayout.aggregate({
                where: { status: client_1.PayoutStatus.COMPLETED },
                _sum: { netAmount: true },
                _count: true,
            }),
            database_1.default.supplierPayout.aggregate({
                where: { status: client_1.PayoutStatus.FAILED },
                _sum: { netAmount: true },
                _count: true,
            }),
        ]);
        return {
            pending: {
                count: pending._count,
                amount: pending._sum.netAmount?.toNumber() || 0,
            },
            processing: {
                count: processing._count,
                amount: processing._sum.netAmount?.toNumber() || 0,
            },
            completed: {
                count: completed._count,
                amount: completed._sum.netAmount?.toNumber() || 0,
            },
            failed: {
                count: failed._count,
                amount: failed._sum.netAmount?.toNumber() || 0,
            },
        };
    }
    /**
     * Get supplier earnings summary
     */
    async getSupplierEarnings(supplierId) {
        const thisMonth = new Date();
        thisMonth.setDate(1);
        thisMonth.setHours(0, 0, 0, 0);
        const [lifetimeEarnings, monthlyEarnings, pendingPayouts, completedPayouts,] = await Promise.all([
            database_1.default.orderItem.aggregate({
                where: {
                    supplierId,
                    fulfillmentStatus: 'DELIVERED',
                },
                _sum: { totalPrice: true },
            }),
            database_1.default.orderItem.aggregate({
                where: {
                    supplierId,
                    fulfillmentStatus: 'DELIVERED',
                    deliveredAt: { gte: thisMonth },
                },
                _sum: { totalPrice: true },
            }),
            database_1.default.supplierPayout.aggregate({
                where: {
                    supplierId,
                    status: client_1.PayoutStatus.PENDING,
                },
                _sum: { netAmount: true },
            }),
            database_1.default.supplierPayout.aggregate({
                where: {
                    supplierId,
                    status: client_1.PayoutStatus.COMPLETED,
                },
                _sum: { netAmount: true },
            }),
        ]);
        return {
            lifetimeEarnings: lifetimeEarnings._sum.totalPrice?.toNumber() || 0,
            monthlyEarnings: monthlyEarnings._sum.totalPrice?.toNumber() || 0,
            pendingPayouts: pendingPayouts._sum.netAmount?.toNumber() || 0,
            totalPaid: completedPayouts._sum.netAmount?.toNumber() || 0,
        };
    }
}
exports.PayoutService = PayoutService;
exports.payoutService = new PayoutService();
//# sourceMappingURL=payout.service.js.map