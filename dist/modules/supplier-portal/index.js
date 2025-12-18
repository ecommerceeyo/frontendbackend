"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierPortalService = exports.supplierPortalController = exports.supplierPortalRoutes = void 0;
const express_1 = require("express");
const supplier_portal_controller_1 = require("./supplier-portal.controller");
const supplier_auth_middleware_1 = require("../supplier-auth/supplier-auth.middleware");
const router = (0, express_1.Router)();
// All routes require supplier authentication
router.use(supplier_auth_middleware_1.authenticateSupplier);
router.use(supplier_auth_middleware_1.requireActiveSupplier);
// Dashboard
router.get('/dashboard', supplier_portal_controller_1.supplierPortalController.getDashboard);
// Profile
router.get('/profile', supplier_portal_controller_1.supplierPortalController.getProfile);
router.put('/profile', (0, supplier_auth_middleware_1.requireSupplierRole)('OWNER', 'MANAGER'), supplier_portal_controller_1.supplierPortalController.updateProfile);
// Products
router.get('/products', supplier_portal_controller_1.supplierPortalController.getProducts);
router.get('/products/:productId', supplier_portal_controller_1.supplierPortalController.getProduct);
router.post('/products', (0, supplier_auth_middleware_1.requireSupplierRole)('OWNER', 'MANAGER'), supplier_portal_controller_1.supplierPortalController.createProduct);
router.put('/products/:productId', (0, supplier_auth_middleware_1.requireSupplierRole)('OWNER', 'MANAGER'), supplier_portal_controller_1.supplierPortalController.updateProduct);
router.delete('/products/:productId', (0, supplier_auth_middleware_1.requireSupplierRole)('OWNER'), supplier_portal_controller_1.supplierPortalController.deleteProduct);
// Orders
router.get('/orders', supplier_portal_controller_1.supplierPortalController.getOrders);
router.get('/orders/:orderItemId', supplier_portal_controller_1.supplierPortalController.getOrderItem);
router.patch('/orders/:orderItemId/fulfillment', (0, supplier_auth_middleware_1.requireSupplierRole)('OWNER', 'MANAGER', 'STAFF'), supplier_portal_controller_1.supplierPortalController.updateFulfillmentStatus);
// Payouts
router.get('/payouts', supplier_portal_controller_1.supplierPortalController.getPayouts);
exports.supplierPortalRoutes = router;
var supplier_portal_controller_2 = require("./supplier-portal.controller");
Object.defineProperty(exports, "supplierPortalController", { enumerable: true, get: function () { return supplier_portal_controller_2.supplierPortalController; } });
var supplier_portal_service_1 = require("./supplier-portal.service");
Object.defineProperty(exports, "supplierPortalService", { enumerable: true, get: function () { return supplier_portal_service_1.supplierPortalService; } });
//# sourceMappingURL=index.js.map