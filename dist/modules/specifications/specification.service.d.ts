export interface CreateSpecificationTemplateInput {
    key: string;
    label: string;
    group?: string;
    type?: string;
    options?: string[];
    required?: boolean;
    sortOrder?: number;
}
export interface UpdateSpecificationTemplateInput {
    key?: string;
    label?: string;
    group?: string;
    type?: string;
    options?: string[];
    required?: boolean;
    sortOrder?: number;
}
export declare const specificationService: {
    getAll(): Promise<{
        createdAt: Date;
        sortOrder: number;
        id: string;
        updatedAt: Date;
        key: string;
        group: string;
        options: string[];
        type: string;
        label: string;
        required: boolean;
    }[]>;
    getById(id: string): Promise<{
        createdAt: Date;
        sortOrder: number;
        id: string;
        updatedAt: Date;
        key: string;
        group: string;
        options: string[];
        type: string;
        label: string;
        required: boolean;
    }>;
    getByGroup(group: string): Promise<{
        createdAt: Date;
        sortOrder: number;
        id: string;
        updatedAt: Date;
        key: string;
        group: string;
        options: string[];
        type: string;
        label: string;
        required: boolean;
    }[]>;
    create(data: CreateSpecificationTemplateInput): Promise<{
        createdAt: Date;
        sortOrder: number;
        id: string;
        updatedAt: Date;
        key: string;
        group: string;
        options: string[];
        type: string;
        label: string;
        required: boolean;
    }>;
    update(id: string, data: UpdateSpecificationTemplateInput): Promise<{
        createdAt: Date;
        sortOrder: number;
        id: string;
        updatedAt: Date;
        key: string;
        group: string;
        options: string[];
        type: string;
        label: string;
        required: boolean;
    }>;
    delete(id: string): Promise<{
        createdAt: Date;
        sortOrder: number;
        id: string;
        updatedAt: Date;
        key: string;
        group: string;
        options: string[];
        type: string;
        label: string;
        required: boolean;
    }>;
    getGroups(): Promise<string[]>;
};
//# sourceMappingURL=specification.service.d.ts.map