"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerAuthService = exports.CustomerAuthService = void 0;
const database_1 = __importDefault(require("../../config/database"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const errorHandler_1 = require("../../middleware/errorHandler");
const email_service_1 = require("../notifications/email.service");
class CustomerAuthService {
    /**
     * Register a new customer
     */
    async register(data) {
        // Check if email already exists
        const existingByEmail = await database_1.default.customer.findUnique({
            where: { email: data.email },
        });
        if (existingByEmail) {
            throw new errorHandler_1.AppError('An account with this email already exists', 409);
        }
        // Check if phone already exists
        const existingByPhone = await database_1.default.customer.findUnique({
            where: { phone: data.phone },
        });
        if (existingByPhone) {
            throw new errorHandler_1.AppError('An account with this phone number already exists', 409);
        }
        const passwordHash = await bcryptjs_1.default.hash(data.password, 10);
        const customer = await database_1.default.customer.create({
            data: {
                email: data.email,
                phone: data.phone,
                passwordHash,
                name: data.name,
            },
            select: {
                id: true,
                email: true,
                phone: true,
                name: true,
                profileImage: true,
                preferredPaymentMethod: true,
                emailVerified: true,
                phoneVerified: true,
                createdAt: true,
            },
        });
        // Send welcome email (async, don't wait for it)
        (0, email_service_1.sendWelcomeEmail)({
            customerName: customer.name,
            customerEmail: customer.email,
            customerPhone: customer.phone,
        }).catch((error) => {
            console.error('Failed to send welcome email:', error);
            // Don't fail registration if email fails
        });
        // Generate token
        const token = this.generateToken(customer);
        return {
            token,
            customer,
        };
    }
    /**
     * Customer login (by email or phone)
     */
    async login(data) {
        let customer;
        if (data.email) {
            customer = await database_1.default.customer.findUnique({
                where: { email: data.email },
            });
        }
        else if (data.phone) {
            customer = await database_1.default.customer.findUnique({
                where: { phone: data.phone },
            });
        }
        else {
            throw new errorHandler_1.AppError('Email or phone is required', 400);
        }
        if (!customer) {
            throw new errorHandler_1.UnauthorizedError('Invalid credentials');
        }
        if (!customer.active) {
            throw new errorHandler_1.UnauthorizedError('Account is disabled');
        }
        const isValidPassword = await bcryptjs_1.default.compare(data.password, customer.passwordHash);
        if (!isValidPassword) {
            throw new errorHandler_1.UnauthorizedError('Invalid credentials');
        }
        // Update last login
        await database_1.default.customer.update({
            where: { id: customer.id },
            data: { lastLoginAt: new Date() },
        });
        // Generate token
        const token = this.generateToken(customer);
        return {
            token,
            customer: {
                id: customer.id,
                email: customer.email,
                phone: customer.phone,
                name: customer.name,
                profileImage: customer.profileImage,
                preferredPaymentMethod: customer.preferredPaymentMethod,
                emailVerified: customer.emailVerified,
                phoneVerified: customer.phoneVerified,
            },
        };
    }
    /**
     * Google OAuth sign-in/sign-up
     * Creates account if doesn't exist, or logs in if exists
     */
    async googleAuth(data) {
        // Check if customer exists with this email
        let customer = await database_1.default.customer.findUnique({
            where: { email: data.email },
        });
        if (customer) {
            // Customer exists - update Google ID if not set and log in
            if (!customer.googleId) {
                customer = await database_1.default.customer.update({
                    where: { id: customer.id },
                    data: {
                        googleId: data.googleId,
                        profileImage: customer.profileImage || data.profileImage,
                        emailVerified: true, // Google email is verified
                        lastLoginAt: new Date(),
                    },
                });
            }
            else {
                // Just update last login
                await database_1.default.customer.update({
                    where: { id: customer.id },
                    data: { lastLoginAt: new Date() },
                });
            }
            if (!customer.active) {
                throw new errorHandler_1.UnauthorizedError('Account is disabled');
            }
        }
        else {
            // Create new customer with Google account
            // Generate a random password hash (user can set password later if needed)
            const randomPassword = Math.random().toString(36).slice(-12);
            const passwordHash = await bcryptjs_1.default.hash(randomPassword, 10);
            // Generate a placeholder phone (user must update this later)
            const placeholderPhone = `google_${data.googleId}`;
            customer = await database_1.default.customer.create({
                data: {
                    email: data.email,
                    phone: placeholderPhone,
                    passwordHash,
                    name: data.name,
                    profileImage: data.profileImage,
                    googleId: data.googleId,
                    emailVerified: true, // Google email is verified
                    phoneVerified: false,
                },
            });
            // Send welcome email to new Google sign-up (async, don't wait)
            (0, email_service_1.sendWelcomeEmail)({
                customerName: customer.name,
                customerEmail: customer.email,
                customerPhone: null, // No real phone yet for Google sign-ups
            }).catch((error) => {
                console.error('Failed to send welcome email:', error);
                // Don't fail sign-up if email fails
            });
        }
        // Generate token
        const token = this.generateToken(customer);
        // Check if phone needs to be updated (placeholder phone)
        const needsPhoneUpdate = customer.phone.startsWith('google_');
        return {
            token,
            customer: {
                id: customer.id,
                email: customer.email,
                phone: needsPhoneUpdate ? null : customer.phone,
                name: customer.name,
                profileImage: customer.profileImage,
                preferredPaymentMethod: customer.preferredPaymentMethod,
                emailVerified: customer.emailVerified,
                phoneVerified: customer.phoneVerified,
            },
            needsPhoneUpdate,
        };
    }
    /**
     * Get customer profile
     */
    async getProfile(customerId) {
        const customer = await database_1.default.customer.findUnique({
            where: { id: customerId },
            select: {
                id: true,
                email: true,
                phone: true,
                name: true,
                profileImage: true,
                preferredPaymentMethod: true,
                emailVerified: true,
                phoneVerified: true,
                createdAt: true,
                updatedAt: true,
                addresses: {
                    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
                },
            },
        });
        if (!customer) {
            throw new errorHandler_1.NotFoundError('Customer');
        }
        return customer;
    }
    /**
     * Update customer profile
     */
    async updateProfile(customerId, data) {
        const customer = await database_1.default.customer.findUnique({
            where: { id: customerId },
        });
        if (!customer) {
            throw new errorHandler_1.NotFoundError('Customer');
        }
        // Check email uniqueness if updating
        if (data.email && data.email !== customer.email) {
            const existing = await database_1.default.customer.findUnique({
                where: { email: data.email },
            });
            if (existing) {
                throw new errorHandler_1.AppError('Email is already in use', 409);
            }
        }
        // Check phone uniqueness if updating
        if (data.phone && data.phone !== customer.phone) {
            const existing = await database_1.default.customer.findUnique({
                where: { phone: data.phone },
            });
            if (existing) {
                throw new errorHandler_1.AppError('Phone number is already in use', 409);
            }
        }
        const updatedCustomer = await database_1.default.customer.update({
            where: { id: customerId },
            data: {
                ...data,
                // Reset verification if email/phone changed
                emailVerified: data.email && data.email !== customer.email ? false : undefined,
                phoneVerified: data.phone && data.phone !== customer.phone ? false : undefined,
            },
            select: {
                id: true,
                email: true,
                phone: true,
                name: true,
                profileImage: true,
                preferredPaymentMethod: true,
                emailVerified: true,
                phoneVerified: true,
                updatedAt: true,
            },
        });
        return updatedCustomer;
    }
    /**
     * Change password
     */
    async changePassword(customerId, currentPassword, newPassword) {
        const customer = await database_1.default.customer.findUnique({
            where: { id: customerId },
        });
        if (!customer) {
            throw new errorHandler_1.NotFoundError('Customer');
        }
        const isValidPassword = await bcryptjs_1.default.compare(currentPassword, customer.passwordHash);
        if (!isValidPassword) {
            throw new errorHandler_1.UnauthorizedError('Current password is incorrect');
        }
        const passwordHash = await bcryptjs_1.default.hash(newPassword, 10);
        await database_1.default.customer.update({
            where: { id: customerId },
            data: { passwordHash },
        });
        return { success: true };
    }
    /**
     * Get customer addresses
     */
    async getAddresses(customerId) {
        return database_1.default.customerAddress.findMany({
            where: { customerId },
            orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        });
    }
    /**
     * Add new address
     */
    async addAddress(customerId, data) {
        // If this is the default address, unset other defaults
        if (data.isDefault) {
            await database_1.default.customerAddress.updateMany({
                where: { customerId, isDefault: true },
                data: { isDefault: false },
            });
        }
        // Check if this is the first address, make it default
        const addressCount = await database_1.default.customerAddress.count({
            where: { customerId },
        });
        const address = await database_1.default.customerAddress.create({
            data: {
                customerId,
                ...data,
                isDefault: data.isDefault || addressCount === 0,
            },
        });
        return address;
    }
    /**
     * Update address
     */
    async updateAddress(customerId, addressId, data) {
        const address = await database_1.default.customerAddress.findFirst({
            where: { id: addressId, customerId },
        });
        if (!address) {
            throw new errorHandler_1.NotFoundError('Address');
        }
        // If setting as default, unset other defaults
        if (data.isDefault) {
            await database_1.default.customerAddress.updateMany({
                where: { customerId, isDefault: true, id: { not: addressId } },
                data: { isDefault: false },
            });
        }
        const updatedAddress = await database_1.default.customerAddress.update({
            where: { id: addressId },
            data,
        });
        return updatedAddress;
    }
    /**
     * Delete address
     */
    async deleteAddress(customerId, addressId) {
        const address = await database_1.default.customerAddress.findFirst({
            where: { id: addressId, customerId },
        });
        if (!address) {
            throw new errorHandler_1.NotFoundError('Address');
        }
        await database_1.default.customerAddress.delete({
            where: { id: addressId },
        });
        // If deleted address was default, make another one default
        if (address.isDefault) {
            const firstAddress = await database_1.default.customerAddress.findFirst({
                where: { customerId },
                orderBy: { createdAt: 'asc' },
            });
            if (firstAddress) {
                await database_1.default.customerAddress.update({
                    where: { id: firstAddress.id },
                    data: { isDefault: true },
                });
            }
        }
        return { success: true };
    }
    /**
     * Get customer order history
     */
    async getOrders(customerId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            database_1.default.order.findMany({
                where: { customerId },
                include: {
                    payment: true,
                    delivery: true,
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            database_1.default.order.count({ where: { customerId } }),
        ]);
        return {
            orders,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    /**
     * Get a single order (must belong to customer)
     */
    async getOrder(customerId, orderId) {
        const order = await database_1.default.order.findFirst({
            where: { id: orderId, customerId },
            include: {
                payment: true,
                delivery: {
                    include: { courier: true },
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                images: { where: { isPrimary: true }, take: 1 },
                            },
                        },
                    },
                },
            },
        });
        if (!order) {
            throw new errorHandler_1.NotFoundError('Order');
        }
        return order;
    }
    /**
     * Link guest cart to customer
     */
    async linkCartToCustomer(customerId, cartId) {
        // Check if customer already has an active cart
        const existingCart = await database_1.default.cart.findFirst({
            where: { customerId },
            include: { items: true },
        });
        const guestCart = await database_1.default.cart.findUnique({
            where: { cartId },
            include: { items: true },
        });
        if (!guestCart) {
            // No guest cart to link
            return existingCart;
        }
        if (existingCart && existingCart.items.length > 0) {
            // Merge guest cart items into existing customer cart
            for (const item of guestCart.items) {
                const existingItem = existingCart.items.find(i => i.productId === item.productId);
                if (existingItem) {
                    // Update quantity
                    await database_1.default.cartItem.update({
                        where: { id: existingItem.id },
                        data: { quantity: existingItem.quantity + item.quantity },
                    });
                }
                else {
                    // Add new item
                    await database_1.default.cartItem.create({
                        data: {
                            cartId: existingCart.id,
                            productId: item.productId,
                            quantity: item.quantity,
                            snapshotPrice: item.snapshotPrice,
                            snapshotName: item.snapshotName,
                            currency: item.currency,
                        },
                    });
                }
            }
            // Delete guest cart
            await database_1.default.cart.delete({ where: { id: guestCart.id } });
            return database_1.default.cart.findUnique({
                where: { id: existingCart.id },
                include: { items: { include: { product: true } } },
            });
        }
        else {
            // No existing cart, just assign guest cart to customer
            return database_1.default.cart.update({
                where: { id: guestCart.id },
                data: { customerId },
                include: { items: { include: { product: true } } },
            });
        }
    }
    /**
     * Generate JWT token for customer
     */
    generateToken(customer) {
        return jsonwebtoken_1.default.sign({
            type: 'customer',
            customerId: customer.id,
            email: customer.email,
            phone: customer.phone,
        }, config_1.default.jwtSecret, { expiresIn: config_1.default.jwtExpiresIn });
    }
    /**
     * Verify JWT token and get customer
     */
    async verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
            if (decoded.type !== 'customer') {
                throw new errorHandler_1.UnauthorizedError('Invalid token type');
            }
            const customer = await database_1.default.customer.findUnique({
                where: { id: decoded.customerId },
                select: {
                    id: true,
                    email: true,
                    phone: true,
                    name: true,
                    active: true,
                },
            });
            if (!customer || !customer.active) {
                throw new errorHandler_1.UnauthorizedError('Customer not found or inactive');
            }
            return customer;
        }
        catch (error) {
            if (error instanceof errorHandler_1.UnauthorizedError) {
                throw error;
            }
            throw new errorHandler_1.UnauthorizedError('Invalid or expired token');
        }
    }
}
exports.CustomerAuthService = CustomerAuthService;
exports.customerAuthService = new CustomerAuthService();
//# sourceMappingURL=customer-auth.service.js.map