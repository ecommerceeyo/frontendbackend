"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.googleAuth = googleAuth;
exports.getProfile = getProfile;
exports.updateProfile = updateProfile;
exports.changePassword = changePassword;
exports.getAddresses = getAddresses;
exports.addAddress = addAddress;
exports.updateAddress = updateAddress;
exports.deleteAddress = deleteAddress;
exports.getOrders = getOrders;
exports.getOrder = getOrder;
const customer_auth_service_1 = require("./customer-auth.service");
const response_1 = require("../../utils/response");
/**
 * Register new customer
 */
async function register(req, res, next) {
    try {
        const result = await customer_auth_service_1.customerAuthService.register(req.body);
        return (0, response_1.successResponse)(res, result, 'Registration successful', 201);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Customer login
 */
async function login(req, res, next) {
    try {
        const result = await customer_auth_service_1.customerAuthService.login(req.body);
        // If guest cart ID provided, link it to customer
        const guestCartId = req.headers['x-cart-id'];
        if (guestCartId) {
            await customer_auth_service_1.customerAuthService.linkCartToCustomer(result.customer.id, guestCartId);
        }
        return (0, response_1.successResponse)(res, result, 'Login successful');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Google OAuth login/signup
 */
async function googleAuth(req, res, next) {
    try {
        const { idToken, email, name, profileImage, googleId } = req.body;
        if (!idToken || !email || !name || !googleId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: idToken, email, name, googleId',
            });
        }
        const result = await customer_auth_service_1.customerAuthService.googleAuth({
            idToken,
            email,
            name,
            profileImage,
            googleId,
        });
        // If guest cart ID provided, link it to customer
        const guestCartId = req.headers['x-cart-id'];
        if (guestCartId) {
            await customer_auth_service_1.customerAuthService.linkCartToCustomer(result.customer.id, guestCartId);
        }
        return (0, response_1.successResponse)(res, result, 'Google authentication successful');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get customer profile
 */
async function getProfile(req, res, next) {
    try {
        const customer = await customer_auth_service_1.customerAuthService.getProfile(req.customer.id);
        return (0, response_1.successResponse)(res, customer);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Update customer profile
 */
async function updateProfile(req, res, next) {
    try {
        const customer = await customer_auth_service_1.customerAuthService.updateProfile(req.customer.id, req.body);
        return (0, response_1.successResponse)(res, customer, 'Profile updated');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Change password
 */
async function changePassword(req, res, next) {
    try {
        const { currentPassword, newPassword } = req.body;
        await customer_auth_service_1.customerAuthService.changePassword(req.customer.id, currentPassword, newPassword);
        return (0, response_1.successResponse)(res, null, 'Password changed successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get customer addresses
 */
async function getAddresses(req, res, next) {
    try {
        const addresses = await customer_auth_service_1.customerAuthService.getAddresses(req.customer.id);
        return (0, response_1.successResponse)(res, addresses);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Add new address
 */
async function addAddress(req, res, next) {
    try {
        const address = await customer_auth_service_1.customerAuthService.addAddress(req.customer.id, req.body);
        return (0, response_1.successResponse)(res, address, 'Address added', 201);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Update address
 */
async function updateAddress(req, res, next) {
    try {
        const address = await customer_auth_service_1.customerAuthService.updateAddress(req.customer.id, req.params.addressId, req.body);
        return (0, response_1.successResponse)(res, address, 'Address updated');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Delete address
 */
async function deleteAddress(req, res, next) {
    try {
        await customer_auth_service_1.customerAuthService.deleteAddress(req.customer.id, req.params.addressId);
        return (0, response_1.successResponse)(res, null, 'Address deleted');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get customer orders
 */
async function getOrders(req, res, next) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await customer_auth_service_1.customerAuthService.getOrders(req.customer.id, page, limit);
        return (0, response_1.paginatedResponse)(res, result.orders, result.page, result.limit, result.total);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get single order
 */
async function getOrder(req, res, next) {
    try {
        const order = await customer_auth_service_1.customerAuthService.getOrder(req.customer.id, req.params.orderId);
        return (0, response_1.successResponse)(res, order);
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=customer-auth.controller.js.map