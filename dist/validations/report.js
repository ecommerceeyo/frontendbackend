"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryReportQuerySchema = exports.salesReportQuerySchema = exports.dashboardStatsQuerySchema = exports.reportListQuerySchema = exports.generateReportSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("./common");
const client_1 = require("@prisma/client");
// Generate report schema
exports.generateReportSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(client_1.ReportType),
    startDate: zod_1.z.coerce.date(),
    endDate: zod_1.z.coerce.date(),
    format: zod_1.z.enum(['pdf', 'csv']).default('pdf'),
});
// Report list query schema
exports.reportListQuerySchema = common_1.paginationSchema.extend({
    type: zod_1.z.nativeEnum(client_1.ReportType).optional(),
    status: zod_1.z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']).optional(),
    ...common_1.dateRangeSchema.shape,
});
// Dashboard stats query schema
exports.dashboardStatsQuerySchema = zod_1.z.object({
    period: zod_1.z.enum(['today', 'week', 'month', 'year']).default('month'),
});
// Sales report query schema
exports.salesReportQuerySchema = common_1.dateRangeSchema.extend({
    groupBy: zod_1.z.enum(['day', 'week', 'month']).default('day'),
});
// Inventory report query schema
exports.inventoryReportQuerySchema = zod_1.z.object({
    lowStock: zod_1.z.coerce.boolean().optional(),
    outOfStock: zod_1.z.coerce.boolean().optional(),
    categoryId: zod_1.z.string().optional(),
});
//# sourceMappingURL=report.js.map