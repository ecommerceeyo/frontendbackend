import { PaymentMethod } from '@prisma/client';
export interface CustomerRegisterData {
    email: string;
    phone: string;
    password: string;
    name: string;
}
export interface CustomerLoginData {
    email?: string;
    phone?: string;
    password: string;
}
export interface GoogleAuthData {
    idToken: string;
    email: string;
    name: string;
    profileImage?: string;
    googleId: string;
}
export interface UpdateProfileData {
    name?: string;
    email?: string;
    phone?: string;
    profileImage?: string;
    preferredPaymentMethod?: PaymentMethod;
}
export interface AddAddressData {
    label?: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    region?: string;
    landmark?: string;
    isDefault?: boolean;
}
export declare class CustomerAuthService {
    /**
     * Register a new customer
     */
    register(data: CustomerRegisterData): Promise<{
        token: string;
        customer: {
            createdAt: Date;
            name: string;
            id: string;
            email: string;
            phone: string;
            profileImage: string;
            preferredPaymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            emailVerified: boolean;
            phoneVerified: boolean;
        };
    }>;
    /**
     * Customer login (by email or phone)
     */
    login(data: CustomerLoginData): Promise<{
        token: string;
        customer: {
            id: string;
            email: string;
            phone: string;
            name: string;
            profileImage: string;
            preferredPaymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            emailVerified: boolean;
            phoneVerified: boolean;
        };
    }>;
    /**
     * Google OAuth sign-in/sign-up
     * Creates account if doesn't exist, or logs in if exists
     */
    googleAuth(data: GoogleAuthData): Promise<{
        token: string;
        customer: {
            id: string;
            email: string;
            phone: string;
            name: string;
            profileImage: string;
            preferredPaymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            emailVerified: boolean;
            phoneVerified: boolean;
        };
        needsPhoneUpdate: boolean;
    }>;
    /**
     * Get customer profile
     */
    getProfile(customerId: string): Promise<{
        createdAt: Date;
        name: string;
        id: string;
        email: string;
        updatedAt: Date;
        phone: string;
        profileImage: string;
        preferredPaymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        emailVerified: boolean;
        phoneVerified: boolean;
        addresses: {
            createdAt: Date;
            name: string;
            id: string;
            updatedAt: Date;
            region: string | null;
            city: string;
            phone: string;
            address: string;
            customerId: string;
            isDefault: boolean;
            label: string | null;
            landmark: string | null;
        }[];
    }>;
    /**
     * Update customer profile
     */
    updateProfile(customerId: string, data: UpdateProfileData): Promise<{
        name: string;
        id: string;
        email: string;
        updatedAt: Date;
        phone: string;
        profileImage: string;
        preferredPaymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        emailVerified: boolean;
        phoneVerified: boolean;
    }>;
    /**
     * Change password
     */
    changePassword(customerId: string, currentPassword: string, newPassword: string): Promise<{
        success: boolean;
    }>;
    /**
     * Get customer addresses
     */
    getAddresses(customerId: string): Promise<{
        createdAt: Date;
        name: string;
        id: string;
        updatedAt: Date;
        region: string | null;
        city: string;
        phone: string;
        address: string;
        customerId: string;
        isDefault: boolean;
        label: string | null;
        landmark: string | null;
    }[]>;
    /**
     * Add new address
     */
    addAddress(customerId: string, data: AddAddressData): Promise<{
        createdAt: Date;
        name: string;
        id: string;
        updatedAt: Date;
        region: string | null;
        city: string;
        phone: string;
        address: string;
        customerId: string;
        isDefault: boolean;
        label: string | null;
        landmark: string | null;
    }>;
    /**
     * Update address
     */
    updateAddress(customerId: string, addressId: string, data: Partial<AddAddressData>): Promise<{
        createdAt: Date;
        name: string;
        id: string;
        updatedAt: Date;
        region: string | null;
        city: string;
        phone: string;
        address: string;
        customerId: string;
        isDefault: boolean;
        label: string | null;
        landmark: string | null;
    }>;
    /**
     * Delete address
     */
    deleteAddress(customerId: string, addressId: string): Promise<{
        success: boolean;
    }>;
    /**
     * Get customer order history
     */
    getOrders(customerId: string, page?: number, limit?: number): Promise<{
        orders: ({
            payment: {
                currency: string;
                createdAt: Date;
                id: string;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.PaymentStatus;
                orderId: string;
                provider: import(".prisma/client").$Enums.MobileMoneyProvider | null;
                phoneNumber: string | null;
                amount: import("@prisma/client/runtime/library").Decimal;
                transactionId: string | null;
                failedReason: string | null;
                method: import(".prisma/client").$Enums.PaymentMethod;
                providerReference: string | null;
                paidAt: Date | null;
                failedAt: Date | null;
                webhookPayload: import("@prisma/client/runtime/library").JsonValue | null;
            };
            delivery: {
                createdAt: Date;
                id: string;
                updatedAt: Date;
                notes: string | null;
                status: import(".prisma/client").$Enums.DeliveryStatus;
                courierId: string | null;
                trackingNumber: string | null;
                signature: string | null;
                deliveryProof: string | null;
                orderId: string;
                estimatedDate: Date | null;
                assignedAt: Date | null;
                pickedUpAt: Date | null;
                inTransitAt: Date | null;
                deliveredAt: Date | null;
            };
        } & {
            customerAddress: string;
            currency: string;
            createdAt: Date;
            id: string;
            updatedAt: Date;
            deliveryFee: import("@prisma/client/runtime/library").Decimal;
            notes: string | null;
            total: import("@prisma/client/runtime/library").Decimal;
            deliveryNotes: string | null;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            deliveryStatus: import(".prisma/client").$Enums.DeliveryStatus;
            orderNumber: string;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            customerId: string | null;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            customerName: string;
            customerEmail: string | null;
            customerPhone: string;
            customerCity: string;
            customerRegion: string | null;
            itemsSnapshot: import("@prisma/client/runtime/library").JsonValue;
            discount: import("@prisma/client/runtime/library").Decimal;
            invoiceUrl: string | null;
            deliveryNoteUrl: string | null;
            supplierCount: number;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    /**
     * Get a single order (must belong to customer)
     */
    getOrder(customerId: string, orderId: string): Promise<{
        payment: {
            currency: string;
            createdAt: Date;
            id: string;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            provider: import(".prisma/client").$Enums.MobileMoneyProvider | null;
            phoneNumber: string | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            transactionId: string | null;
            failedReason: string | null;
            method: import(".prisma/client").$Enums.PaymentMethod;
            providerReference: string | null;
            paidAt: Date | null;
            failedAt: Date | null;
            webhookPayload: import("@prisma/client/runtime/library").JsonValue | null;
        };
        delivery: {
            courier: {
                createdAt: Date;
                name: string;
                id: string;
                email: string | null;
                active: boolean;
                updatedAt: Date;
                phone: string;
            };
        } & {
            createdAt: Date;
            id: string;
            updatedAt: Date;
            notes: string | null;
            status: import(".prisma/client").$Enums.DeliveryStatus;
            courierId: string | null;
            trackingNumber: string | null;
            signature: string | null;
            deliveryProof: string | null;
            orderId: string;
            estimatedDate: Date | null;
            assignedAt: Date | null;
            pickedUpAt: Date | null;
            inTransitAt: Date | null;
            deliveredAt: Date | null;
        };
        items: ({
            product: {
                images: {
                    createdAt: Date;
                    sortOrder: number;
                    id: string;
                    productId: string;
                    url: string;
                    publicId: string;
                    alt: string | null;
                    isPrimary: boolean;
                }[];
                name: string;
                id: string;
            };
        } & {
            productImage: string | null;
            currency: string;
            createdAt: Date;
            id: string;
            updatedAt: Date;
            supplierId: string | null;
            productId: string;
            notes: string | null;
            commissionRate: import("@prisma/client/runtime/library").Decimal;
            productName: string;
            quantity: number;
            trackingNumber: string | null;
            orderId: string;
            deliveredAt: Date | null;
            productSku: string | null;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            totalPrice: import("@prisma/client/runtime/library").Decimal;
            commissionAmount: import("@prisma/client/runtime/library").Decimal;
            fulfillmentStatus: import(".prisma/client").$Enums.FulfillmentStatus;
            fulfilledAt: Date | null;
            shippedAt: Date | null;
        })[];
    } & {
        customerAddress: string;
        currency: string;
        createdAt: Date;
        id: string;
        updatedAt: Date;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        notes: string | null;
        total: import("@prisma/client/runtime/library").Decimal;
        deliveryNotes: string | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        deliveryStatus: import(".prisma/client").$Enums.DeliveryStatus;
        orderNumber: string;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        customerId: string | null;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        customerName: string;
        customerEmail: string | null;
        customerPhone: string;
        customerCity: string;
        customerRegion: string | null;
        itemsSnapshot: import("@prisma/client/runtime/library").JsonValue;
        discount: import("@prisma/client/runtime/library").Decimal;
        invoiceUrl: string | null;
        deliveryNoteUrl: string | null;
        supplierCount: number;
    }>;
    /**
     * Link guest cart to customer
     */
    linkCartToCustomer(customerId: string, cartId: string): Promise<{
        items: {
            currency: string;
            createdAt: Date;
            id: string;
            updatedAt: Date;
            productId: string;
            cartId: string;
            quantity: number;
            snapshotPrice: import("@prisma/client/runtime/library").Decimal;
            snapshotName: string;
        }[];
    } & {
        createdAt: Date;
        id: string;
        updatedAt: Date;
        cartId: string;
        customerId: string | null;
    }>;
    /**
     * Generate JWT token for customer
     */
    private generateToken;
    /**
     * Verify JWT token and get customer
     */
    verifyToken(token: string): Promise<{
        name: string;
        id: string;
        email: string;
        active: boolean;
        phone: string;
    }>;
}
export declare const customerAuthService: CustomerAuthService;
//# sourceMappingURL=customer-auth.service.d.ts.map