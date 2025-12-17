import { customerAuthService } from './customer-auth.service';
import { successResponse, paginatedResponse } from '../../utils/response';
/**
 * Register new customer
 */
export async function register(req, res, next) {
    try {
        const result = await customerAuthService.register(req.body);
        return successResponse(res, result, 'Registration successful', 201);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Customer login
 */
export async function login(req, res, next) {
    try {
        const result = await customerAuthService.login(req.body);
        // If guest cart ID provided, link it to customer
        const guestCartId = req.headers['x-cart-id'];
        if (guestCartId) {
            await customerAuthService.linkCartToCustomer(result.customer.id, guestCartId);
        }
        return successResponse(res, result, 'Login successful');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Google OAuth login/signup
 */
export async function googleAuth(req, res, next) {
    try {
        const { idToken, email, name, profileImage, googleId } = req.body;
        if (!idToken || !email || !name || !googleId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: idToken, email, name, googleId',
            });
        }
        const result = await customerAuthService.googleAuth({
            idToken,
            email,
            name,
            profileImage,
            googleId,
        });
        // If guest cart ID provided, link it to customer
        const guestCartId = req.headers['x-cart-id'];
        if (guestCartId) {
            await customerAuthService.linkCartToCustomer(result.customer.id, guestCartId);
        }
        return successResponse(res, result, 'Google authentication successful');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get customer profile
 */
export async function getProfile(req, res, next) {
    try {
        const customer = await customerAuthService.getProfile(req.customer.id);
        return successResponse(res, customer);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Update customer profile
 */
export async function updateProfile(req, res, next) {
    try {
        const customer = await customerAuthService.updateProfile(req.customer.id, req.body);
        return successResponse(res, customer, 'Profile updated');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Change password
 */
export async function changePassword(req, res, next) {
    try {
        const { currentPassword, newPassword } = req.body;
        await customerAuthService.changePassword(req.customer.id, currentPassword, newPassword);
        return successResponse(res, null, 'Password changed successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get customer addresses
 */
export async function getAddresses(req, res, next) {
    try {
        const addresses = await customerAuthService.getAddresses(req.customer.id);
        return successResponse(res, addresses);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Add new address
 */
export async function addAddress(req, res, next) {
    try {
        const address = await customerAuthService.addAddress(req.customer.id, req.body);
        return successResponse(res, address, 'Address added', 201);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Update address
 */
export async function updateAddress(req, res, next) {
    try {
        const address = await customerAuthService.updateAddress(req.customer.id, req.params.addressId, req.body);
        return successResponse(res, address, 'Address updated');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Delete address
 */
export async function deleteAddress(req, res, next) {
    try {
        await customerAuthService.deleteAddress(req.customer.id, req.params.addressId);
        return successResponse(res, null, 'Address deleted');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get customer orders
 */
export async function getOrders(req, res, next) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await customerAuthService.getOrders(req.customer.id, page, limit);
        return paginatedResponse(res, result.orders, result.page, result.limit, result.total);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get single order
 */
export async function getOrder(req, res, next) {
    try {
        const order = await customerAuthService.getOrder(req.customer.id, req.params.orderId);
        return successResponse(res, order);
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=customer-auth.controller.js.map