import { z } from 'zod';
export declare const uploadImageSchema: z.ZodObject<{
    folder: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    transformation: z.ZodOptional<z.ZodObject<{
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        crop: z.ZodOptional<z.ZodString>;
        quality: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        width?: number;
        height?: number;
        crop?: string;
        quality?: number;
    }, {
        width?: number;
        height?: number;
        crop?: string;
        quality?: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    folder?: string;
    transformation?: {
        width?: number;
        height?: number;
        crop?: string;
        quality?: number;
    };
}, {
    folder?: string;
    transformation?: {
        width?: number;
        height?: number;
        crop?: string;
        quality?: number;
    };
}>;
export declare const deleteImageSchema: z.ZodObject<{
    publicId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    publicId?: string;
}, {
    publicId?: string;
}>;
export declare const bulkDeleteImagesSchema: z.ZodObject<{
    publicIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    publicIds?: string[];
}, {
    publicIds?: string[];
}>;
export declare const allowedImageTypes: string[];
export declare const maxFileSize: number;
export declare function validateImageFile(file: Express.Multer.File): {
    valid: boolean;
    error?: string;
};
//# sourceMappingURL=upload.d.ts.map