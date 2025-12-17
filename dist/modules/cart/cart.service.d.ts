import { Decimal } from '@prisma/client/runtime/library';
export interface CartWithItems {
    id: string;
    cartId: string;
    items: Array<{
        id: string;
        productId: string;
        quantity: number;
        snapshotPrice: Decimal;
        snapshotName: string;
        currency: string;
        product: {
            id: string;
            name: string;
            slug: string;
            price: Decimal;
            stock: number;
            active: boolean;
            supplierId: string | null;
            images: Array<{
                url: string;
                isPrimary: boolean;
            }>;
            supplier?: {
                id: string;
                businessName: string;
                slug: string;
            } | null;
        };
    }>;
    createdAt: Date;
    updatedAt: Date;
}
export declare class CartService {
    /**
     * Create a new cart
     */
    createCart(): Promise<{
        id: string;
        cartId: string;
    }>;
    /**
     * Get cart by cartId (public UUID)
     */
    getCart(cartId: string): Promise<CartWithItems>;
    /**
     * Get or create cart
     */
    getOrCreateCart(cartId?: string): Promise<CartWithItems>;
    /**
     * Add item to cart
     */
    addItem(cartId: string, productId: string, quantity: number): Promise<CartWithItems>;
    /**
     * Update cart item quantity
     */
    updateItem(cartId: string, itemId: string, quantity: number): Promise<CartWithItems>;
    /**
     * Remove item from cart
     */
    removeItem(cartId: string, itemId: string): Promise<CartWithItems>;
    /**
     * Clear all items from cart
     */
    clearCart(cartId: string): Promise<CartWithItems>;
    /**
     * Delete cart entirely
     */
    deleteCart(cartId: string): Promise<{
        success: boolean;
    }>;
    /**
     * Calculate cart totals
     */
    calculateCartTotals(cart: CartWithItems, deliveryFee?: number): {
        subtotal: number;
        deliveryFee: number;
        total: number;
        itemCount: number;
        supplierCount: number;
        items: {
            id: string;
            productId: string;
            name: string;
            price: number;
            quantity: number;
            total: number;
            currency: string;
            product: {
                id: string;
                name: string;
                slug: string;
                price: Decimal;
                stock: number;
                active: boolean;
                supplierId: string | null;
                images: Array<{
                    url: string;
                    isPrimary: boolean;
                }>;
                supplier?: {
                    id: string;
                    businessName: string;
                    slug: string;
                } | null;
            };
        }[];
        supplierGroups: {
            supplierId: string;
            supplier: {
                id: string;
                businessName: string;
                slug: string;
            };
            items: {
                id: string;
                productId: string;
                name: string;
                price: number;
                quantity: number;
                total: number;
                currency: string;
                product: {
                    id: string;
                    name: string;
                    slug: string;
                    price: Decimal;
                    stock: number;
                    active: boolean;
                    supplierId: string | null;
                    images: Array<{
                        url: string;
                        isPrimary: boolean;
                    }>;
                    supplier?: {
                        id: string;
                        businessName: string;
                        slug: string;
                    } | null;
                };
            }[];
            subtotal: number;
        }[];
    };
    /**
     * Validate cart for checkout
     */
    validateCartForCheckout(cartId: string): Promise<CartWithItems>;
}
export declare const cartService: CartService;
//# sourceMappingURL=cart.service.d.ts.map