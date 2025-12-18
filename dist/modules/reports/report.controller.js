"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = getDashboardStats;
exports.getSalesReport = getSalesReport;
exports.getInventoryReport = getInventoryReport;
exports.getOrderReport = getOrderReport;
exports.generateReport = generateReport;
exports.getReport = getReport;
exports.getReports = getReports;
exports.getReportSummary = getReportSummary;
const report_service_1 = require("./report.service");
const response_1 = require("../../utils/response");
/**
 * Get dashboard statistics
 */
async function getDashboardStats(req, res, next) {
    try {
        const period = req.query.period || 'month';
        const stats = await report_service_1.reportService.getDashboardStats(period);
        return (0, response_1.successResponse)(res, stats);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get sales report
 */
async function getSalesReport(req, res, next) {
    try {
        const { startDate, endDate, groupBy } = req.query;
        const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const end = endDate ? new Date(endDate) : new Date();
        const report = await report_service_1.reportService.getSalesReport(start, end, groupBy || 'day');
        return (0, response_1.successResponse)(res, report);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get inventory report
 */
async function getInventoryReport(req, res, next) {
    try {
        const { lowStock, outOfStock, categoryId } = req.query;
        const report = await report_service_1.reportService.getInventoryReport({
            lowStock: lowStock === 'true',
            outOfStock: outOfStock === 'true',
            categoryId: categoryId,
        });
        return (0, response_1.successResponse)(res, report);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get order report
 */
async function getOrderReport(req, res, next) {
    try {
        const { startDate, endDate } = req.query;
        const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const end = endDate ? new Date(endDate) : new Date();
        const report = await report_service_1.reportService.getOrderReport(start, end);
        return (0, response_1.successResponse)(res, report);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Generate a report (queued)
 */
async function generateReport(req, res, next) {
    try {
        const { type, startDate, endDate, format } = req.body;
        const report = await report_service_1.reportService.generateReport(type, {
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            format,
        }, req.admin.id);
        return (0, response_1.successResponse)(res, report, 'Report generation queued', 202);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get report by ID
 */
async function getReport(req, res, next) {
    try {
        const report = await report_service_1.reportService.getReportById(req.params.id);
        return (0, response_1.successResponse)(res, report);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get all reports
 */
async function getReports(req, res, next) {
    try {
        const { reports, total, page, limit } = await report_service_1.reportService.getReports(req.query);
        return (0, response_1.paginatedResponse)(res, reports, page, limit, total);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get report summary for admin reports page
 */
async function getReportSummary(req, res, next) {
    try {
        const { startDate, endDate } = req.query;
        const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const end = endDate ? new Date(endDate) : new Date();
        const report = await report_service_1.reportService.getReportSummary(start, end);
        return (0, response_1.successResponse)(res, report);
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=report.controller.js.map