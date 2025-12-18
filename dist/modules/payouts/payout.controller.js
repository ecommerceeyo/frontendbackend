"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payoutController = exports.PayoutController = void 0;
const payout_service_1 = require("./payout.service");
class PayoutController {
    /**
     * Get all payouts
     */
    async getPayouts(req, res, next) {
        try {
            const { page, limit, supplierId, status, startDate, endDate } = req.query;
            const result = await payout_service_1.payoutService.getPayouts({
                page: page ? parseInt(page) : undefined,
                limit: limit ? parseInt(limit) : undefined,
                supplierId,
                status: status,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
            });
            res.json({
                success: true,
                data: {
                    items: result.payouts,
                    pagination: {
                        page: result.page,
                        limit: result.limit,
                        total: result.total,
                        totalPages: Math.ceil(result.total / result.limit),
                    },
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get single payout
     */
    async getPayout(req, res, next) {
        try {
            const { payoutId } = req.params;
            const payout = await payout_service_1.payoutService.getPayout(payoutId);
            res.json({
                success: true,
                data: payout,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Generate payouts for a period
     */
    async generatePayouts(req, res, next) {
        try {
            const { periodStart, periodEnd } = req.body;
            if (!periodStart || !periodEnd) {
                return res.status(400).json({
                    success: false,
                    error: 'Period start and end dates are required',
                });
            }
            const payouts = await payout_service_1.payoutService.generatePayouts(new Date(periodStart), new Date(periodEnd));
            res.status(201).json({
                success: true,
                data: payouts,
                message: `Generated ${payouts.length} payout(s)`,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update payout status
     */
    async updatePayoutStatus(req, res, next) {
        try {
            const { payoutId } = req.params;
            const { status, transactionId, notes } = req.body;
            if (!status) {
                return res.status(400).json({
                    success: false,
                    error: 'Status is required',
                });
            }
            const payout = await payout_service_1.payoutService.updatePayoutStatus(payoutId, status, transactionId, notes);
            res.json({
                success: true,
                data: payout,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get payout statistics
     */
    async getPayoutStats(req, res, next) {
        try {
            const stats = await payout_service_1.payoutService.getPayoutStats();
            res.json({
                success: true,
                data: stats,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get supplier earnings
     */
    async getSupplierEarnings(req, res, next) {
        try {
            const { supplierId } = req.params;
            const earnings = await payout_service_1.payoutService.getSupplierEarnings(supplierId);
            res.json({
                success: true,
                data: earnings,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PayoutController = PayoutController;
exports.payoutController = new PayoutController();
//# sourceMappingURL=payout.controller.js.map