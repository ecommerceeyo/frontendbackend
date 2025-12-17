import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types';
/**
 * Get dashboard statistics
 */
export declare function getDashboardStats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get sales report
 */
export declare function getSalesReport(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get inventory report
 */
export declare function getInventoryReport(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get order report
 */
export declare function getOrderReport(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Generate a report (queued)
 */
export declare function generateReport(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get report by ID
 */
export declare function getReport(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get all reports
 */
export declare function getReports(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
/**
 * Get report summary for admin reports page
 */
export declare function getReportSummary(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=report.controller.d.ts.map