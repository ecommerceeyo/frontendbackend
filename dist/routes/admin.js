"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
// Admin module routes
const products_1 = require("../modules/products");
const orders_1 = require("../modules/orders");
const reports_1 = require("../modules/reports");
const upload_1 = require("../modules/upload");
const categories_1 = require("../modules/categories");
const specifications_1 = require("../modules/specifications");
const suppliers_1 = require("../modules/suppliers");
const payouts_1 = require("../modules/payouts");
const router = (0, express_1.Router)();
// All admin routes require authentication
router.use(auth_1.authenticate);
router.use(auth_1.requireAdmin);
// Admin product management
router.use('/products', products_1.adminProductRoutes);
// Admin order management
router.use('/orders', orders_1.orderRoutes);
// Admin category management
router.use('/categories', categories_1.adminCategoryRoutes);
// Admin specification templates
router.use('/specifications', specifications_1.specificationRoutes);
// Supplier management (admin only)
router.get('/suppliers', suppliers_1.supplierController.getAllSuppliers);
router.post('/suppliers', (0, auth_1.requireRole)('ADMIN', 'SUPER_ADMIN'), suppliers_1.supplierController.createSupplier);
router.get('/suppliers/:supplierId', suppliers_1.supplierController.getSupplierAdmin);
router.put('/suppliers/:supplierId', (0, auth_1.requireRole)('ADMIN', 'SUPER_ADMIN'), suppliers_1.supplierController.updateSupplier);
router.patch('/suppliers/:supplierId/status', (0, auth_1.requireRole)('ADMIN', 'SUPER_ADMIN'), suppliers_1.supplierController.updateSupplierStatus);
router.patch('/suppliers/:supplierId/commission', (0, auth_1.requireRole)('ADMIN', 'SUPER_ADMIN'), suppliers_1.supplierController.updateSupplierCommission);
router.get('/suppliers/:supplierId/stats', suppliers_1.supplierController.getSupplierStats);
router.patch('/suppliers/:supplierId/max-users', (0, auth_1.requireRole)('ADMIN', 'SUPER_ADMIN'), suppliers_1.supplierController.updateSupplierMaxUsers);
router.patch('/suppliers/:supplierId/max-products', (0, auth_1.requireRole)('ADMIN', 'SUPER_ADMIN'), suppliers_1.supplierController.updateSupplierMaxProducts);
router.get('/suppliers/:supplierId/product-limits', suppliers_1.supplierController.getSupplierProductLimits);
// Supplier user management
router.get('/suppliers/:supplierId/users', suppliers_1.supplierController.getSupplierUsers);
router.post('/suppliers/:supplierId/users', (0, auth_1.requireRole)('ADMIN', 'SUPER_ADMIN'), suppliers_1.supplierController.createSupplierUser);
router.put('/suppliers/:supplierId/users/:userId', (0, auth_1.requireRole)('ADMIN', 'SUPER_ADMIN'), suppliers_1.supplierController.updateSupplierUser);
router.patch('/suppliers/:supplierId/users/:userId/permissions', (0, auth_1.requireRole)('ADMIN', 'SUPER_ADMIN'), suppliers_1.supplierController.updateSupplierUserPermissions);
router.delete('/suppliers/:supplierId/users/:userId', (0, auth_1.requireRole)('ADMIN', 'SUPER_ADMIN'), suppliers_1.supplierController.deleteSupplierUser);
// Supplier product management
router.get('/suppliers/:supplierId/products', suppliers_1.supplierController.getSupplierProductsAdmin);
router.patch('/suppliers/:supplierId/products/:productId/status', (0, auth_1.requireRole)('ADMIN', 'SUPER_ADMIN'), suppliers_1.supplierController.toggleSupplierProductStatus);
router.patch('/suppliers/:supplierId/products/bulk-status', (0, auth_1.requireRole)('ADMIN', 'SUPER_ADMIN'), suppliers_1.supplierController.bulkToggleSupplierProducts);
// Supplier order management
router.get('/suppliers/:supplierId/orders', suppliers_1.supplierController.getSupplierOrders);
router.get('/suppliers/:supplierId/orders/stats', suppliers_1.supplierController.getSupplierOrderStats);
router.patch('/suppliers/:supplierId/orders/:orderItemId/fulfillment', (0, auth_1.requireRole)('ADMIN', 'SUPER_ADMIN'), suppliers_1.supplierController.updateOrderItemFulfillment);
// Payout management (admin only)
router.use('/payouts', (0, auth_1.requireRole)('ADMIN', 'SUPER_ADMIN'), payouts_1.payoutRoutes);
// Reports (requires admin or super admin role)
router.use('/reports', (0, auth_1.requireRole)('ADMIN', 'SUPER_ADMIN'), reports_1.reportRoutes);
// Upload routes
router.use('/upload', upload_1.uploadRoutes);
exports.default = router;
//# sourceMappingURL=admin.js.map