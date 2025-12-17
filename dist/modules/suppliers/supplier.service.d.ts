import { Prisma, SupplierStatus } from '@prisma/client';
export interface SupplierListParams {
    page?: number;
    limit?: number;
    status?: SupplierStatus;
    verified?: boolean;
    search?: string;
}
export interface CreateSupplierData {
    name: string;
    email: string;
    phone: string;
    whatsapp?: string;
    description?: string;
    businessName?: string;
    businessAddress: string;
    city: string;
    region: string;
    taxId?: string;
    logo?: string;
    banner?: string;
    bankName?: string;
    bankAccountNumber?: string;
    bankAccountName?: string;
    momoNumber?: string;
    momoProvider?: 'MTN_MOMO' | 'AIRTEL_MONEY' | 'ORANGE_MONEY';
    commissionRate?: number;
}
export declare class SupplierService {
    /**
     * Get paginated list of suppliers (public - only ACTIVE)
     */
    getSuppliers(params: SupplierListParams): Promise<{
        suppliers: {
            name: string;
            id: string;
            slug: string;
            description: string;
            _count: {
                products: number;
            };
            region: string;
            city: string;
            logo: string;
            banner: string;
            verified: boolean;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    /**
     * Get all suppliers (admin - includes all statuses)
     */
    getAllSuppliers(params: SupplierListParams): Promise<{
        suppliers: ({
            _count: {
                products: number;
                orderItems: number;
                admins: number;
            };
        } & {
            createdAt: Date;
            name: string;
            id: string;
            email: string;
            updatedAt: Date;
            slug: string;
            description: string | null;
            region: string;
            city: string;
            logo: string | null;
            banner: string | null;
            phone: string;
            whatsapp: string | null;
            businessName: string | null;
            businessAddress: string;
            taxId: string | null;
            bankName: string | null;
            bankAccountNumber: string | null;
            bankAccountName: string | null;
            momoNumber: string | null;
            momoProvider: import(".prisma/client").$Enums.MobileMoneyProvider | null;
            commissionRate: Prisma.Decimal;
            maxUsers: number;
            maxProducts: number;
            status: import(".prisma/client").$Enums.SupplierStatus;
            verified: boolean;
            verifiedAt: Date | null;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    /**
     * Get supplier by ID or slug (public - only ACTIVE)
     */
    getSupplierByIdOrSlug(idOrSlug: string): Promise<{
        createdAt: Date;
        name: string;
        id: string;
        slug: string;
        description: string;
        _count: {
            products: number;
        };
        region: string;
        city: string;
        logo: string;
        banner: string;
        verified: boolean;
    }>;
    /**
     * Get supplier by ID (admin)
     */
    getSupplierById(id: string): Promise<{
        _count: {
            products: number;
            orderItems: number;
            payouts: number;
        };
        admins: {
            createdAt: Date;
            name: string;
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.SupplierRole;
            active: boolean;
            lastLoginAt: Date;
            phone: string;
        }[];
    } & {
        createdAt: Date;
        name: string;
        id: string;
        email: string;
        updatedAt: Date;
        slug: string;
        description: string | null;
        region: string;
        city: string;
        logo: string | null;
        banner: string | null;
        phone: string;
        whatsapp: string | null;
        businessName: string | null;
        businessAddress: string;
        taxId: string | null;
        bankName: string | null;
        bankAccountNumber: string | null;
        bankAccountName: string | null;
        momoNumber: string | null;
        momoProvider: import(".prisma/client").$Enums.MobileMoneyProvider | null;
        commissionRate: Prisma.Decimal;
        maxUsers: number;
        maxProducts: number;
        status: import(".prisma/client").$Enums.SupplierStatus;
        verified: boolean;
        verifiedAt: Date | null;
    }>;
    /**
     * Create a new supplier
     */
    createSupplier(data: CreateSupplierData): Promise<{
        createdAt: Date;
        name: string;
        id: string;
        email: string;
        updatedAt: Date;
        slug: string;
        description: string | null;
        region: string;
        city: string;
        logo: string | null;
        banner: string | null;
        phone: string;
        whatsapp: string | null;
        businessName: string | null;
        businessAddress: string;
        taxId: string | null;
        bankName: string | null;
        bankAccountNumber: string | null;
        bankAccountName: string | null;
        momoNumber: string | null;
        momoProvider: import(".prisma/client").$Enums.MobileMoneyProvider | null;
        commissionRate: Prisma.Decimal;
        maxUsers: number;
        maxProducts: number;
        status: import(".prisma/client").$Enums.SupplierStatus;
        verified: boolean;
        verifiedAt: Date | null;
    }>;
    /**
     * Update supplier
     */
    updateSupplier(id: string, data: Partial<CreateSupplierData>): Promise<{
        createdAt: Date;
        name: string;
        id: string;
        email: string;
        updatedAt: Date;
        slug: string;
        description: string | null;
        region: string;
        city: string;
        logo: string | null;
        banner: string | null;
        phone: string;
        whatsapp: string | null;
        businessName: string | null;
        businessAddress: string;
        taxId: string | null;
        bankName: string | null;
        bankAccountNumber: string | null;
        bankAccountName: string | null;
        momoNumber: string | null;
        momoProvider: import(".prisma/client").$Enums.MobileMoneyProvider | null;
        commissionRate: Prisma.Decimal;
        maxUsers: number;
        maxProducts: number;
        status: import(".prisma/client").$Enums.SupplierStatus;
        verified: boolean;
        verifiedAt: Date | null;
    }>;
    /**
     * Update supplier status (admin)
     */
    updateSupplierStatus(id: string, status: SupplierStatus): Promise<{
        createdAt: Date;
        name: string;
        id: string;
        email: string;
        updatedAt: Date;
        slug: string;
        description: string | null;
        region: string;
        city: string;
        logo: string | null;
        banner: string | null;
        phone: string;
        whatsapp: string | null;
        businessName: string | null;
        businessAddress: string;
        taxId: string | null;
        bankName: string | null;
        bankAccountNumber: string | null;
        bankAccountName: string | null;
        momoNumber: string | null;
        momoProvider: import(".prisma/client").$Enums.MobileMoneyProvider | null;
        commissionRate: Prisma.Decimal;
        maxUsers: number;
        maxProducts: number;
        status: import(".prisma/client").$Enums.SupplierStatus;
        verified: boolean;
        verifiedAt: Date | null;
    }>;
    /**
     * Update supplier commission rate (admin)
     */
    updateSupplierCommission(id: string, commissionRate: number): Promise<{
        createdAt: Date;
        name: string;
        id: string;
        email: string;
        updatedAt: Date;
        slug: string;
        description: string | null;
        region: string;
        city: string;
        logo: string | null;
        banner: string | null;
        phone: string;
        whatsapp: string | null;
        businessName: string | null;
        businessAddress: string;
        taxId: string | null;
        bankName: string | null;
        bankAccountNumber: string | null;
        bankAccountName: string | null;
        momoNumber: string | null;
        momoProvider: import(".prisma/client").$Enums.MobileMoneyProvider | null;
        commissionRate: Prisma.Decimal;
        maxUsers: number;
        maxProducts: number;
        status: import(".prisma/client").$Enums.SupplierStatus;
        verified: boolean;
        verifiedAt: Date | null;
    }>;
    /**
     * Get supplier's products
     */
    getSupplierProducts(supplierId: string, params: {
        page?: number;
        limit?: number;
        active?: boolean;
    }): Promise<{
        products: ({
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
            categories: ({
                category: {
                    name: string;
                    id: string;
                    slug: string;
                };
            } & {
                createdAt: Date;
                sortOrder: number;
                id: string;
                productId: string;
                categoryId: string;
            })[];
        } & {
            currency: string;
            createdAt: Date;
            name: string;
            id: string;
            active: boolean;
            updatedAt: Date;
            slug: string;
            description: string | null;
            sku: string | null;
            price: Prisma.Decimal;
            comparePrice: Prisma.Decimal | null;
            stock: number;
            lowStockThreshold: number;
            isPreorder: boolean;
            preorderNote: string | null;
            supplierId: string | null;
            featured: boolean;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    /**
     * Get supplier stats for dashboard
     */
    getSupplierStats(supplierId: string): Promise<{
        totalProducts: number;
        activeProducts: number;
        totalOrders: number;
        pendingOrders: number;
        deliveredOrders: number;
        totalRevenue: number | Prisma.Decimal;
        pendingPayouts: number | Prisma.Decimal;
    }>;
    /**
     * Get supplier users/admins
     */
    getSupplierUsers(supplierId: string): Promise<{
        users: {
            createdAt: Date;
            name: string;
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.SupplierRole;
            active: boolean;
            lastLoginAt: Date;
            phone: string;
            permissions: Prisma.JsonValue;
        }[];
        maxUsers: number;
        currentCount: number;
    }>;
    /**
     * Create supplier user (admin only)
     */
    createSupplierUser(supplierId: string, data: {
        email: string;
        name: string;
        password: string;
        phone?: string;
        role: 'OWNER' | 'MANAGER' | 'STAFF';
    }): Promise<{
        createdAt: Date;
        name: string;
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.SupplierRole;
        active: boolean;
        phone: string;
    }>;
    /**
     * Update supplier user
     */
    updateSupplierUser(supplierId: string, userId: string, data: {
        name?: string;
        phone?: string;
        role?: 'OWNER' | 'MANAGER' | 'STAFF';
        active?: boolean;
        permissions?: Record<string, boolean> | null;
    }): Promise<{
        createdAt: Date;
        name: string;
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.SupplierRole;
        active: boolean;
        phone: string;
        permissions: Prisma.JsonValue;
    }>;
    /**
     * Update supplier user permissions (admin only)
     */
    updateSupplierUserPermissions(supplierId: string, userId: string, permissions: Record<string, boolean> | null): Promise<{
        createdAt: Date;
        name: string;
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.SupplierRole;
        active: boolean;
        phone: string;
        permissions: Prisma.JsonValue;
    }>;
    /**
     * Delete supplier user
     */
    deleteSupplierUser(supplierId: string, userId: string): Promise<{
        success: boolean;
    }>;
    /**
     * Update max users for supplier
     */
    updateSupplierMaxUsers(supplierId: string, maxUsers: number): Promise<{
        createdAt: Date;
        name: string;
        id: string;
        email: string;
        updatedAt: Date;
        slug: string;
        description: string | null;
        region: string;
        city: string;
        logo: string | null;
        banner: string | null;
        phone: string;
        whatsapp: string | null;
        businessName: string | null;
        businessAddress: string;
        taxId: string | null;
        bankName: string | null;
        bankAccountNumber: string | null;
        bankAccountName: string | null;
        momoNumber: string | null;
        momoProvider: import(".prisma/client").$Enums.MobileMoneyProvider | null;
        commissionRate: Prisma.Decimal;
        maxUsers: number;
        maxProducts: number;
        status: import(".prisma/client").$Enums.SupplierStatus;
        verified: boolean;
        verifiedAt: Date | null;
    }>;
    /**
     * Update max products for supplier
     */
    updateSupplierMaxProducts(supplierId: string, maxProducts: number): Promise<{
        createdAt: Date;
        name: string;
        id: string;
        email: string;
        updatedAt: Date;
        slug: string;
        description: string | null;
        region: string;
        city: string;
        logo: string | null;
        banner: string | null;
        phone: string;
        whatsapp: string | null;
        businessName: string | null;
        businessAddress: string;
        taxId: string | null;
        bankName: string | null;
        bankAccountNumber: string | null;
        bankAccountName: string | null;
        momoNumber: string | null;
        momoProvider: import(".prisma/client").$Enums.MobileMoneyProvider | null;
        commissionRate: Prisma.Decimal;
        maxUsers: number;
        maxProducts: number;
        status: import(".prisma/client").$Enums.SupplierStatus;
        verified: boolean;
        verifiedAt: Date | null;
    }>;
    /**
     * Get supplier product limits info
     */
    getSupplierProductLimits(supplierId: string): Promise<{
        maxProducts: number;
        currentCount: number;
        canAddMore: boolean;
        remaining: number;
    }>;
    /**
     * Get all products for a supplier (admin)
     */
    getSupplierProductsAdmin(supplierId: string, params: {
        page?: number;
        limit?: number;
        active?: boolean;
        search?: string;
    }): Promise<{
        products: ({
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
            categories: ({
                category: {
                    name: string;
                    id: string;
                    slug: string;
                };
            } & {
                createdAt: Date;
                sortOrder: number;
                id: string;
                productId: string;
                categoryId: string;
            })[];
        } & {
            currency: string;
            createdAt: Date;
            name: string;
            id: string;
            active: boolean;
            updatedAt: Date;
            slug: string;
            description: string | null;
            sku: string | null;
            price: Prisma.Decimal;
            comparePrice: Prisma.Decimal | null;
            stock: number;
            lowStockThreshold: number;
            isPreorder: boolean;
            preorderNote: string | null;
            supplierId: string | null;
            featured: boolean;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    /**
     * Toggle product active status for a supplier
     */
    toggleSupplierProductStatus(supplierId: string, productId: string, active: boolean): Promise<{
        currency: string;
        createdAt: Date;
        name: string;
        id: string;
        active: boolean;
        updatedAt: Date;
        slug: string;
        description: string | null;
        sku: string | null;
        price: Prisma.Decimal;
        comparePrice: Prisma.Decimal | null;
        stock: number;
        lowStockThreshold: number;
        isPreorder: boolean;
        preorderNote: string | null;
        supplierId: string | null;
        featured: boolean;
    }>;
    /**
     * Bulk toggle products for a supplier
     */
    bulkToggleSupplierProducts(supplierId: string, productIds: string[], active: boolean): Promise<{
        updated: number;
    }>;
    /**
     * Get orders for a supplier (admin)
     */
    getSupplierOrders(supplierId: string, params: {
        page?: number;
        limit?: number;
        fulfillmentStatus?: string;
        search?: string;
    }): Promise<{
        orderItems: ({
            product: {
                name: string;
                id: string;
                slug: string;
            };
            order: {
                customerAddress: string;
                createdAt: Date;
                id: string;
                deliveryStatus: import(".prisma/client").$Enums.DeliveryStatus;
                orderNumber: string;
                paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
                customerName: string;
                customerPhone: string;
                customerCity: string;
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
            commissionRate: Prisma.Decimal;
            productName: string;
            quantity: number;
            trackingNumber: string | null;
            orderId: string;
            deliveredAt: Date | null;
            productSku: string | null;
            unitPrice: Prisma.Decimal;
            totalPrice: Prisma.Decimal;
            commissionAmount: Prisma.Decimal;
            fulfillmentStatus: import(".prisma/client").$Enums.FulfillmentStatus;
            fulfilledAt: Date | null;
            shippedAt: Date | null;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    /**
     * Get supplier order stats
     */
    getSupplierOrderStats(supplierId: string): Promise<{
        pending: number;
        confirmed: number;
        processing: number;
        shipped: number;
        delivered: number;
        cancelled: number;
    }>;
    /**
     * Update order item fulfillment status (admin)
     */
    updateOrderItemFulfillment(supplierId: string, orderItemId: string, data: {
        fulfillmentStatus: string;
        trackingNumber?: string;
        notes?: string;
    }): Promise<{
        productImage: string | null;
        currency: string;
        createdAt: Date;
        id: string;
        updatedAt: Date;
        supplierId: string | null;
        productId: string;
        notes: string | null;
        commissionRate: Prisma.Decimal;
        productName: string;
        quantity: number;
        trackingNumber: string | null;
        orderId: string;
        deliveredAt: Date | null;
        productSku: string | null;
        unitPrice: Prisma.Decimal;
        totalPrice: Prisma.Decimal;
        commissionAmount: Prisma.Decimal;
        fulfillmentStatus: import(".prisma/client").$Enums.FulfillmentStatus;
        fulfilledAt: Date | null;
        shippedAt: Date | null;
    }>;
}
export declare const supplierService: SupplierService;
//# sourceMappingURL=supplier.service.d.ts.map