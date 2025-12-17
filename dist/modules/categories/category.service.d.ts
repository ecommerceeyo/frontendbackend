export interface CreateCategoryData {
    name: string;
    slug?: string;
    description?: string;
    image?: string;
    parentId?: string;
    active?: boolean;
    sortOrder?: number;
}
export declare class CategoryService {
    /**
     * Get all categories (with optional filters)
     */
    getCategories(params?: {
        parentId?: string;
        active?: boolean;
        includeProducts?: boolean;
    }): Promise<({
        parent: {
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
        children: {
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
        }[];
        _count: {
            products: number;
        };
    } & {
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
    })[]>;
    /**
     * Get category tree (hierarchical)
     */
    getCategoryTree(activeOnly?: boolean): Promise<({
        children: ({
            children: {
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
            }[];
        } & {
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
        })[];
    } & {
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
    })[]>;
    /**
     * Get category by ID or slug
     */
    getCategoryByIdOrSlug(idOrSlug: string): Promise<{
        parent: {
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
        children: {
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
        }[];
        _count: {
            products: number;
        };
    } & {
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
    }>;
    /**
     * Create a new category
     */
    createCategory(data: CreateCategoryData): Promise<{
        parent: {
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
        children: {
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
        }[];
    } & {
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
    }>;
    /**
     * Update a category
     */
    updateCategory(id: string, data: Partial<CreateCategoryData>): Promise<{
        parent: {
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
        children: {
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
        }[];
    } & {
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
    }>;
    /**
     * Delete a category
     */
    deleteCategory(id: string): Promise<{
        success: boolean;
    }>;
}
export declare const categoryService: CategoryService;
//# sourceMappingURL=category.service.d.ts.map