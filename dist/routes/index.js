"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Public routes
const products_1 = require("../modules/products");
const cart_1 = require("../modules/cart");
const orders_1 = require("../modules/orders");
const categories_1 = require("../modules/categories");
const suppliers_1 = require("../modules/suppliers");
// Payment routes
const payments_1 = require("../modules/payments");
// Auth routes
const auth_1 = require("../modules/auth");
const supplier_auth_1 = require("../modules/supplier-auth");
const customer_auth_1 = require("../modules/customer-auth");
// Supplier portal routes
const supplier_portal_1 = require("../modules/supplier-portal");
// Admin routes
const admin_1 = __importDefault(require("./admin"));
const router = (0, express_1.Router)();
// Public API routes
router.use('/products', products_1.productRoutes);
router.use('/cart', cart_1.cartRoutes);
router.use('/orders', orders_1.orderRoutes);
router.use('/categories', categories_1.categoryRoutes);
router.use('/suppliers', suppliers_1.supplierRoutes);
// Payment routes
router.use('/payments', payments_1.paymentRoutes);
// Auth routes
router.use('/auth', auth_1.authRoutes);
router.use('/supplier-auth', supplier_auth_1.supplierAuthRoutes);
router.use('/customers', customer_auth_1.customerAuthRoutes);
// Supplier portal routes
router.use('/supplier-portal', supplier_portal_1.supplierPortalRoutes);
// Admin routes (all prefixed with /admin)
router.use('/admin', admin_1.default);
// Health check
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map