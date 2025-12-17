import { Request, Response, NextFunction } from 'express';
/**
 * Initiate payment
 */
export declare function initiatePayment(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Handle payment webhook from mobile money provider
 */
export declare function handleWebhook(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Verify payment status
 */
export declare function verifyPayment(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=payment.controller.d.ts.map