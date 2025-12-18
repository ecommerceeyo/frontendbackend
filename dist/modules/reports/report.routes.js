"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportController = __importStar(require("./report.controller"));
const validate_1 = require("../../middleware/validate");
const auth_1 = require("../../middleware/auth");
const validations_1 = require("../../validations");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticate);
/**
 * @route   GET /api/admin/reports/dashboard
 * @desc    Get dashboard statistics
 * @access  Admin
 */
router.get('/dashboard', (0, validate_1.validate)(validations_1.dashboardStatsQuerySchema, 'query'), reportController.getDashboardStats);
/**
 * @route   GET /api/admin/reports/sales
 * @desc    Get sales report
 * @access  Admin
 */
router.get('/sales', (0, validate_1.validate)(validations_1.salesReportQuerySchema, 'query'), reportController.getSalesReport);
/**
 * @route   GET /api/admin/reports/inventory
 * @desc    Get inventory report
 * @access  Admin
 */
router.get('/inventory', (0, validate_1.validate)(validations_1.inventoryReportQuerySchema, 'query'), reportController.getInventoryReport);
/**
 * @route   GET /api/admin/reports/orders
 * @desc    Get order report
 * @access  Admin
 */
router.get('/orders', reportController.getOrderReport);
/**
 * @route   GET /api/admin/reports/summary
 * @desc    Get comprehensive report summary for admin reports page
 * @access  Admin
 */
router.get('/summary', reportController.getReportSummary);
/**
 * @route   POST /api/admin/reports/generate
 * @desc    Generate a report (queued)
 * @access  Admin
 */
router.post('/generate', (0, validate_1.validate)(validations_1.generateReportSchema, 'body'), reportController.generateReport);
/**
 * @route   GET /api/admin/reports
 * @desc    Get all generated reports
 * @access  Admin
 */
router.get('/', (0, validate_1.validate)(validations_1.reportListQuerySchema, 'query'), reportController.getReports);
/**
 * @route   GET /api/admin/reports/:id
 * @desc    Get report by ID
 * @access  Admin
 */
router.get('/:id', (0, validate_1.validate)(validations_1.idParamsSchema, 'params'), reportController.getReport);
exports.default = router;
//# sourceMappingURL=report.routes.js.map