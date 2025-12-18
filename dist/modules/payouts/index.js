"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payoutService = exports.payoutController = exports.payoutRoutes = void 0;
const express_1 = require("express");
const payout_controller_1 = require("./payout.controller");
const router = (0, express_1.Router)();
// All routes are admin-only (authentication handled at route level)
router.get('/', payout_controller_1.payoutController.getPayouts);
router.get('/stats', payout_controller_1.payoutController.getPayoutStats);
router.get('/:payoutId', payout_controller_1.payoutController.getPayout);
router.post('/generate', payout_controller_1.payoutController.generatePayouts);
router.patch('/:payoutId/status', payout_controller_1.payoutController.updatePayoutStatus);
router.get('/supplier/:supplierId/earnings', payout_controller_1.payoutController.getSupplierEarnings);
exports.payoutRoutes = router;
var payout_controller_2 = require("./payout.controller");
Object.defineProperty(exports, "payoutController", { enumerable: true, get: function () { return payout_controller_2.payoutController; } });
var payout_service_1 = require("./payout.service");
Object.defineProperty(exports, "payoutService", { enumerable: true, get: function () { return payout_service_1.payoutService; } });
//# sourceMappingURL=index.js.map