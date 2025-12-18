"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureSupplierOwnership = exports.requireSupplierRole = exports.requireActiveSupplier = exports.authenticateSupplier = exports.supplierAuthService = exports.supplierAuthController = exports.supplierAuthRoutes = void 0;
const express_1 = require("express");
const supplier_auth_controller_1 = require("./supplier-auth.controller");
const supplier_auth_middleware_1 = require("./supplier-auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.post('/register', supplier_auth_controller_1.supplierAuthController.register);
router.post('/login', supplier_auth_controller_1.supplierAuthController.login);
// Protected routes
router.get('/me', supplier_auth_middleware_1.authenticateSupplier, supplier_auth_controller_1.supplierAuthController.getMe);
router.post('/change-password', supplier_auth_middleware_1.authenticateSupplier, supplier_auth_controller_1.supplierAuthController.changePassword);
// Staff management (requires OWNER or MANAGER role)
router.get('/staff', supplier_auth_middleware_1.authenticateSupplier, supplier_auth_middleware_1.requireActiveSupplier, (0, supplier_auth_middleware_1.requireSupplierRole)('OWNER', 'MANAGER'), supplier_auth_controller_1.supplierAuthController.getStaff);
router.post('/staff', supplier_auth_middleware_1.authenticateSupplier, supplier_auth_middleware_1.requireActiveSupplier, (0, supplier_auth_middleware_1.requireSupplierRole)('OWNER', 'MANAGER'), supplier_auth_controller_1.supplierAuthController.createStaff);
router.patch('/staff/:staffId/status', supplier_auth_middleware_1.authenticateSupplier, supplier_auth_middleware_1.requireActiveSupplier, (0, supplier_auth_middleware_1.requireSupplierRole)('OWNER', 'MANAGER'), supplier_auth_controller_1.supplierAuthController.updateStaffStatus);
router.delete('/staff/:staffId', supplier_auth_middleware_1.authenticateSupplier, supplier_auth_middleware_1.requireActiveSupplier, (0, supplier_auth_middleware_1.requireSupplierRole)('OWNER'), supplier_auth_controller_1.supplierAuthController.deleteStaff);
exports.supplierAuthRoutes = router;
var supplier_auth_controller_2 = require("./supplier-auth.controller");
Object.defineProperty(exports, "supplierAuthController", { enumerable: true, get: function () { return supplier_auth_controller_2.supplierAuthController; } });
var supplier_auth_service_1 = require("./supplier-auth.service");
Object.defineProperty(exports, "supplierAuthService", { enumerable: true, get: function () { return supplier_auth_service_1.supplierAuthService; } });
var supplier_auth_middleware_2 = require("./supplier-auth.middleware");
Object.defineProperty(exports, "authenticateSupplier", { enumerable: true, get: function () { return supplier_auth_middleware_2.authenticateSupplier; } });
Object.defineProperty(exports, "requireActiveSupplier", { enumerable: true, get: function () { return supplier_auth_middleware_2.requireActiveSupplier; } });
Object.defineProperty(exports, "requireSupplierRole", { enumerable: true, get: function () { return supplier_auth_middleware_2.requireSupplierRole; } });
Object.defineProperty(exports, "ensureSupplierOwnership", { enumerable: true, get: function () { return supplier_auth_middleware_2.ensureSupplierOwnership; } });
//# sourceMappingURL=index.js.map