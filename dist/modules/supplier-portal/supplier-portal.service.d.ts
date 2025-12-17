import { Prisma, FulfillmentStatus } from '@prisma/client';
export interface SupplierProductListParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    active?: boolean;
}
export interface CreateSupplierProductData {
    name: string;
    slug?: string;
    description?: string;
    price: number;
    currency?: string;
    comparePrice?: number;
    sku?: string;
    stock?: number;
    lowStockThreshold?: number;
    categoryIds?: string[];
    images?: Array<{
        url: string;
        publicId: string;
        alt?: string;
        sortOrder?: number;
        isPrimary?: boolean;
    }>;
    specifications?: Array<{
        key: string;
        value: string;
        group?: string;
        sortOrder?: number;
    }>;
    active?: boolean;
}
export declare class SupplierPortalService {
    /**
     * Get supplier dashboard stats
     */
    getDashboardStats(supplierId: string): Promise<{
        products: {
            total: number;
            active: number;
            lowStock: number;
            preorder: number;
        };
        orders: {
            today: number;
            pending: number;
            preorderPending: number;
        };
        revenue: {
            thisMonth: number;
            lastMonth: number;
            change: number;
        };
        recentOrders: {
            productName: string;
            isPreorder: boolean;
            product: {
                name: string;
                isPreorder: boolean;
            };
            order: {
                customerAddress: string;
                orderNumber: string;
                customerName: string;
            };
            productImage: string | null;
            currency: string;
            createdAt: Date;
            id: string;
            updatedAt: Date;
            supplierId: string | null;
            productId: string;
            notes: string | null;
            commissionRate: Prisma.Decimal;
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
        }[];
        preorderProducts: {
            id: string;
            name: string;
            pendingOrders: number;
            totalOrdered: number;
        }[];
    }>;
    /**
     * Get supplier's products
     */
    getProducts(supplierId: string, params: SupplierProductListParams): Promise<{
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
     * Get single product
     */
    getProduct(supplierId: string, productId: string): Promise<{
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
                createdAt: Date;
                sortOrder: number;
                name: string;
                id: string;
                active: boolean;
                updatedAt: Date;
                slug: string;
                description: string | null;
                image: string | null;
                parentId: string | null;
            };
        } & {
            createdAt: Date;
            sortOrder: number;
            id: string;
            productId: string;
            categoryId: string;
        })[];
        specifications: {
            createdAt: Date;
            sortOrder: number;
            id: string;
            productId: string;
            key: string;
            value: string;
            group: string | null;
        }[];
        deliveryZones: {
            createdAt: Date;
            id: string;
            updatedAt: Date;
            productId: string;
            zoneName: string;
            zoneType: string;
            region: string | null;
            minDays: number;
            maxDays: number;
            deliveryFee: Prisma.Decimal | null;
            available: boolean;
            notes: string | null;
        }[];
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
    }>;
    /**
     * Create a product for supplier
     */
    createProduct(supplierId: string, data: CreateSupplierProductData): Promise<{
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
                createdAt: Date;
                sortOrder: number;
                name: string;
                id: string;
                active: boolean;
                updatedAt: Date;
                slug: string;
                description: string | null;
                image: string | null;
                parentId: string | null;
            };
        } & {
            createdAt: Date;
            sortOrder: number;
            id: string;
            productId: string;
            categoryId: string;
        })[];
        specifications: {
            createdAt: Date;
            sortOrder: number;
            id: string;
            productId: string;
            key: string;
            value: string;
            group: string | null;
        }[];
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
    }>;
    /**
     * Update supplier's product
     */
    updateProduct(supplierId: string, productId: string, data: Partial<CreateSupplierProductData>): Promise<{
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
                createdAt: Date;
                sortOrder: number;
                name: string;
                id: string;
                active: boolean;
                updatedAt: Date;
                slug: string;
                description: string | null;
                image: string | null;
                parentId: string | null;
            };
        } & {
            createdAt: Date;
            sortOrder: number;
            id: string;
            productId: string;
            categoryId: string;
        })[];
        specifications: {
            createdAt: Date;
            sortOrder: number;
            id: string;
            productId: string;
            key: string;
            value: string;
            group: string | null;
        }[];
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
    }>;
    /**
     * Delete supplier's product
     */
    deleteProduct(supplierId: string, productId: string): Promise<{
        success: boolean;
    }>;
    /**
     * Get supplier's orders (order items)
     */
    getOrders(supplierId: string, params: {
        page?: number;
        limit?: number;
        status?: FulfillmentStatus;
        search?: string;
    }): Promise<{
        orderItems: ({
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
            order: {
                customerAddress: string;
                createdAt: Date;
                id: string;
                deliveryNotes: string;
                orderNumber: string;
                customerName: string;
                customerPhone: string;
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
     * Get single order item
     */
    getOrderItem(supplierId: string, orderItemId: string): Promise<{
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
        };
        order: {
            customerAddress: string;
            currency: string;
            createdAt: Date;
            id: string;
            updatedAt: Date;
            deliveryFee: Prisma.Decimal;
            notes: string | null;
            total: Prisma.Decimal;
            deliveryNotes: string | null;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            deliveryStatus: import(".prisma/client").$Enums.DeliveryStatus;
            orderNumber: string;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            customerId: string | null;
            subtotal: Prisma.Decimal;
            customerName: string;
            customerEmail: string | null;
            customerPhone: string;
            customerCity: string;
            customerRegion: string | null;
            itemsSnapshot: Prisma.JsonValue;
            discount: Prisma.Decimal;
            invoiceUrl: string | null;
            deliveryNoteUrl: string | null;
            supplierCount: number;
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
    }>;
    /**
     * Update fulfillment status
     */
    updateFulfillmentStatus(supplierId: string, orderItemId: string, status: FulfillmentStatus, trackingNumber?: string): Promise<{
        order: {
            orderNumber: string;
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
    }>;
    /**
     * Get supplier's payouts
     */
    getPayouts(supplierId: string, params: {
        page?: number;
        limit?: number;
    }): Promise<{
        payouts: {
            currency: string;
            createdAt: Date;
            id: string;
            updatedAt: Date;
            supplierId: string;
            notes: string | null;
            status: import(".prisma/client").$Enums.PayoutStatus;
            paymentMethod: string | null;
            paidAt: Date | null;
            commissionAmount: Prisma.Decimal;
            netAmount: Prisma.Decimal;
            grossAmount: Prisma.Decimal;
            itemCount: number;
            periodStart: Date;
            periodEnd: Date;
            paymentReference: string | null;
            orderItemIds: string[];
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    /**
     * Update supplier profile
     */
    updateProfile(supplierId: string, data: {
        businessName?: string;
        description?: string;
        logoUrl?: string;
        bannerUrl?: string;
        phone?: string;
        address?: string;
        bankName?: string;
        bankAccountNumber?: string;
        bankAccountName?: string;
        mobileMoneyProvider?: string;
        mobileMoneyNumber?: string;
    }): Promise<{
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
     * Get supplier profile
     */
    getProfile(supplierId: string): Promise<{
        _count: {
            products: number;
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
    }>;
}
export declare const supplierPortalService: SupplierPortalService;
//# sourceMappingURL=supplier-portal.service.d.ts.map