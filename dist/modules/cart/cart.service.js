"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartService = exports.CartService = void 0;
const database_1 = __importDefault(require("../../config/database"));
const helpers_1 = require("../../utils/helpers");
const errorHandler_1 = require("../../middleware/errorHandler");
class CartService {
    /**
     * Create a new cart
     */
    async createCart() {
        const cart = await database_1.default.cart.create({
            data: {
                cartId: (0, helpers_1.generateCartId)(),
            },
            select: {
                id: true,
                cartId: true,
            },
        });
        return cart;
    }
    /**
     * Get cart by cartId (public UUID)
     */
    async getCart(cartId) {
        const cart = await database_1.default.cart.findUnique({
            where: { cartId },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                price: true,
                                stock: true,
                                active: true,
                                supplierId: true,
                                images: {
                                    where: { isPrimary: true },
                                    take: 1,
                                    select: { url: true, isPrimary: true },
                                },
                                supplier: {
                                    select: {
                                        id: true,
                                        businessName: true,
                                        slug: true,
                                    },
                                },
                            },
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
        if (!cart) {
            throw new errorHandler_1.NotFoundError('Cart');
        }
        return cart;
    }
    /**
     * Get or create cart
     */
    async getOrCreateCart(cartId) {
        if (cartId) {
            try {
                return await this.getCart(cartId);
            }
            catch {
                // Cart not found, create new one
            }
        }
        const newCart = await this.createCart();
        return this.getCart(newCart.cartId);
    }
    /**
     * Add item to cart
     */
    async addItem(cartId, productId, quantity) {
        // Get the cart
        const cart = await database_1.default.cart.findUnique({
            where: { cartId },
        });
        if (!cart) {
            throw new errorHandler_1.NotFoundError('Cart');
        }
        // Get the product
        const product = await database_1.default.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new errorHandler_1.NotFoundError('Product');
        }
        if (!product.active) {
            throw new errorHandler_1.AppError('Product is not available', 400);
        }
        if (product.stock < quantity) {
            throw new errorHandler_1.AppError(`Only ${product.stock} items available in stock`, 400);
        }
        // Check if item already exists in cart
        const existingItem = await database_1.default.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                },
            },
        });
        if (existingItem) {
            // Update quantity
            const newQuantity = existingItem.quantity + quantity;
            if (product.stock < newQuantity) {
                throw new errorHandler_1.AppError(`Only ${product.stock} items available in stock`, 400);
            }
            await database_1.default.cartItem.update({
                where: { id: existingItem.id },
                data: {
                    quantity: newQuantity,
                    snapshotPrice: product.price,
                    snapshotName: product.name,
                },
            });
        }
        else {
            // Create new item
            await database_1.default.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity,
                    snapshotPrice: product.price,
                    snapshotName: product.name,
                    currency: product.currency,
                },
            });
        }
        // Update cart timestamp
        await database_1.default.cart.update({
            where: { id: cart.id },
            data: { updatedAt: new Date() },
        });
        return this.getCart(cartId);
    }
    /**
     * Update cart item quantity
     */
    async updateItem(cartId, itemId, quantity) {
        const cart = await database_1.default.cart.findUnique({
            where: { cartId },
        });
        if (!cart) {
            throw new errorHandler_1.NotFoundError('Cart');
        }
        const item = await database_1.default.cartItem.findFirst({
            where: {
                id: itemId,
                cartId: cart.id,
            },
            include: { product: true },
        });
        if (!item) {
            throw new errorHandler_1.NotFoundError('Cart item');
        }
        if (item.product.stock < quantity) {
            throw new errorHandler_1.AppError(`Only ${item.product.stock} items available in stock`, 400);
        }
        await database_1.default.cartItem.update({
            where: { id: itemId },
            data: {
                quantity,
                snapshotPrice: item.product.price,
                snapshotName: item.product.name,
            },
        });
        // Update cart timestamp
        await database_1.default.cart.update({
            where: { id: cart.id },
            data: { updatedAt: new Date() },
        });
        return this.getCart(cartId);
    }
    /**
     * Remove item from cart
     */
    async removeItem(cartId, itemId) {
        const cart = await database_1.default.cart.findUnique({
            where: { cartId },
        });
        if (!cart) {
            throw new errorHandler_1.NotFoundError('Cart');
        }
        const item = await database_1.default.cartItem.findFirst({
            where: {
                id: itemId,
                cartId: cart.id,
            },
        });
        if (!item) {
            throw new errorHandler_1.NotFoundError('Cart item');
        }
        await database_1.default.cartItem.delete({
            where: { id: itemId },
        });
        // Update cart timestamp
        await database_1.default.cart.update({
            where: { id: cart.id },
            data: { updatedAt: new Date() },
        });
        return this.getCart(cartId);
    }
    /**
     * Clear all items from cart
     */
    async clearCart(cartId) {
        const cart = await database_1.default.cart.findUnique({
            where: { cartId },
        });
        if (!cart) {
            throw new errorHandler_1.NotFoundError('Cart');
        }
        await database_1.default.cartItem.deleteMany({
            where: { cartId: cart.id },
        });
        // Update cart timestamp
        await database_1.default.cart.update({
            where: { id: cart.id },
            data: { updatedAt: new Date() },
        });
        return this.getCart(cartId);
    }
    /**
     * Delete cart entirely
     */
    async deleteCart(cartId) {
        const cart = await database_1.default.cart.findUnique({
            where: { cartId },
        });
        if (!cart) {
            throw new errorHandler_1.NotFoundError('Cart');
        }
        await database_1.default.cart.delete({
            where: { id: cart.id },
        });
        return { success: true };
    }
    /**
     * Calculate cart totals
     */
    calculateCartTotals(cart, deliveryFee = 0) {
        const subtotal = cart.items.reduce((sum, item) => {
            return sum + Number(item.snapshotPrice) * item.quantity;
        }, 0);
        const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        // Group items by supplier
        const itemsBySupplier = new Map();
        for (const item of cart.items) {
            const supplierId = item.product.supplierId || 'platform';
            const existing = itemsBySupplier.get(supplierId) || [];
            existing.push(item);
            itemsBySupplier.set(supplierId, existing);
        }
        const supplierGroups = Array.from(itemsBySupplier.entries()).map(([supplierId, items]) => {
            const firstItem = items[0];
            const supplier = supplierId === 'platform'
                ? { id: 'platform', businessName: 'Platform', slug: 'platform' }
                : firstItem.product.supplier;
            return {
                supplierId,
                supplier,
                items: items.map(item => ({
                    id: item.id,
                    productId: item.productId,
                    name: item.snapshotName,
                    price: Number(item.snapshotPrice),
                    quantity: item.quantity,
                    total: Number(item.snapshotPrice) * item.quantity,
                    currency: item.currency,
                    product: item.product,
                })),
                subtotal: items.reduce((sum, item) => sum + Number(item.snapshotPrice) * item.quantity, 0),
            };
        });
        return {
            subtotal,
            deliveryFee,
            total: subtotal + deliveryFee,
            itemCount,
            supplierCount: itemsBySupplier.size,
            items: cart.items.map((item) => ({
                id: item.id,
                productId: item.productId,
                name: item.snapshotName,
                price: Number(item.snapshotPrice),
                quantity: item.quantity,
                total: Number(item.snapshotPrice) * item.quantity,
                currency: item.currency,
                product: item.product,
            })),
            supplierGroups,
        };
    }
    /**
     * Validate cart for checkout
     */
    async validateCartForCheckout(cartId) {
        const cart = await this.getCart(cartId);
        if (cart.items.length === 0) {
            throw new errorHandler_1.AppError('Cart is empty', 400);
        }
        const errors = [];
        for (const item of cart.items) {
            if (!item.product.active) {
                errors.push(`${item.snapshotName} is no longer available`);
            }
            if (item.product.stock < item.quantity) {
                errors.push(`${item.snapshotName}: only ${item.product.stock} available (requested ${item.quantity})`);
            }
        }
        if (errors.length > 0) {
            throw new errorHandler_1.AppError(`Cart validation failed: ${errors.join('; ')}`, 400);
        }
        return cart;
    }
}
exports.CartService = CartService;
exports.cartService = new CartService();
//# sourceMappingURL=cart.service.js.map