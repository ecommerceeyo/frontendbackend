"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkout = checkout;
exports.trackOrder = trackOrder;
exports.getOrder = getOrder;
exports.getOrders = getOrders;
exports.getOrderAdmin = getOrderAdmin;
exports.updateOrderStatus = updateOrderStatus;
exports.markAsShipped = markAsShipped;
exports.generateInvoice = generateInvoice;
const order_service_1 = require("./order.service");
const response_1 = require("../../utils/response");
/**
 * Create order from checkout (public)
 */
async function checkout(req, res, next) {
    try {
        const order = await order_service_1.orderService.checkout(req.body);
        return (0, response_1.successResponse)(res, order, 'Order placed successfully', 201);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Track order (public)
 */
async function trackOrder(req, res, next) {
    try {
        const { orderNumber, phone, email } = req.query;
        const orders = await order_service_1.orderService.trackOrder({
            orderNumber: orderNumber,
            phone: phone,
            email: email,
        });
        return (0, response_1.successResponse)(res, orders);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get order by ID (public - limited info)
 */
async function getOrder(req, res, next) {
    try {
        const order = await order_service_1.orderService.getOrderById(req.params.id);
        // Return limited info for public access
        return (0, response_1.successResponse)(res, {
            orderNumber: order.orderNumber,
            status: order.paymentStatus,
            deliveryStatus: order.deliveryStatus,
            items: order.itemsSnapshot,
            subtotal: order.subtotal,
            deliveryFee: order.deliveryFee,
            total: order.total,
            currency: order.currency,
            createdAt: order.createdAt,
            delivery: order.delivery
                ? {
                    status: order.delivery.status,
                    trackingNumber: order.delivery.trackingNumber,
                    estimatedDate: order.delivery.estimatedDate,
                }
                : null,
        });
    }
    catch (error) {
        next(error);
    }
}
// ============================================
// ADMIN CONTROLLERS
// ============================================
/**
 * Get paginated list of orders (admin)
 */
async function getOrders(req, res, next) {
    try {
        const { orders, total, page, limit } = await order_service_1.orderService.getOrders(req.query);
        return (0, response_1.paginatedResponse)(res, orders, page, limit, total);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get order by ID (admin - full info)
 */
async function getOrderAdmin(req, res, next) {
    try {
        const order = await order_service_1.orderService.getOrderById(req.params.id);
        return (0, response_1.successResponse)(res, order);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Update order status (admin)
 */
async function updateOrderStatus(req, res, next) {
    try {
        const order = await order_service_1.orderService.updateOrderStatus(req.params.id, req.body);
        return (0, response_1.successResponse)(res, order, 'Order status updated');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Mark order as shipped (admin)
 */
async function markAsShipped(req, res, next) {
    try {
        const order = await order_service_1.orderService.markAsShipped(req.params.id, req.body);
        return (0, response_1.successResponse)(res, order, 'Order marked as shipped');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Generate invoice (admin)
 */
async function generateInvoice(req, res, next) {
    try {
        const result = await order_service_1.orderService.generateInvoice(req.params.id);
        return (0, response_1.successResponse)(res, result);
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=order.controller.js.map