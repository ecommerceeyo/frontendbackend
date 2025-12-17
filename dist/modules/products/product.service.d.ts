import { Prisma } from '@prisma/client';
export interface ProductListParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    featured?: boolean;
    active?: boolean;
    search?: string;
    includeInactive?: boolean;
}
export interface DeliveryZoneData {
    zoneName: string;
    zoneType?: string;
    region?: string;
    minDays: number;
    maxDays: number;
    deliveryFee?: number;
    available?: boolean;
    notes?: string;
}
export interface CreateProductData {
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
    supplierId?: string | null;
    isPreorder?: boolean;
    preorderNote?: string;
    deliveryZones?: DeliveryZoneData[];
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
    featured?: boolean;
}
export declare class ProductService {
    /**
     * Get paginated list of products (public)
     */
    getProducts(params: ProductListParams): Promise<{
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
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    /**
     * Get single product by ID or slug
     */
    getProductByIdOrSlug(idOrSlug: string): Promise<{
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
     * Get product by ID (admin - includes inactive)
     */
    getProductById(id: string): Promise<{
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
     * Create a new product
     */
    createProduct(data: CreateProductData): Promise<{
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
     * Update a product
     */
    updateProduct(id: string, data: Partial<CreateProductData>): Promise<{
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
     * Delete a product
     */
    deleteProduct(id: string): Promise<{
        success: boolean;
    }>;
    /**
     * Update product stock
     */
    updateStock(id: string, stock: number, reason?: string, referenceId?: string): Promise<{
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
     * Bulk update stock
     */
    bulkUpdateStock(updates: Array<{
        productId: string;
        stock: number;
    }>): Promise<{
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
    }[]>;
    /**
     * Get featured products
     */
    getFeaturedProducts(limit?: number): Promise<({
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
    })[]>;
    /**
     * Get low stock products
     */
    getLowStockProducts(): Promise<{
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
    }[]>;
    /**
     * Get inventory logs
     */
    getInventoryLogs(params: {
        page?: number;
        limit?: number;
        productId?: string;
        reason?: string;
    }): Promise<{
        logs: {
            createdAt: Date;
            id: string;
            productId: string;
            notes: string | null;
            productName: string;
            previousStock: number;
            newStock: number;
            change: number;
            reason: string;
            referenceId: string | null;
            referenceType: string | null;
            performedBy: string | null;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
}
export declare const productService: ProductService;
//# sourceMappingURL=product.service.d.ts.map