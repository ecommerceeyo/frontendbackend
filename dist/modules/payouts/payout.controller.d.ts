import { Request, Response, NextFunction } from 'express';
export declare class PayoutController {
    /**
     * Get all payouts
     */
    getPayouts(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get single payout
     */
    getPayout(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Generate payouts for a period
     */
    generatePayouts(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    /**
     * Update payout status
     */
    updatePayoutStatus(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    /**
     * Get payout statistics
     */
    getPayoutStats(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get supplier earnings
     */
    getSupplierEarnings(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const payoutController: PayoutController;
//# sourceMappingURL=payout.controller.d.ts.map