import { z } from 'zod';
import { paginationSchema, priceSchema, currencySchema } from './common';

// Product specification schema
export const productSpecificationSchema = z.object({
  key: z.string().min(1, 'Specification key is required'),
  value: z.string().min(1, 'Specification value is required'),
  group: z.string().optional(),
  sortOrder: z.number().int().default(0),
});

// Product image schema
export const productImageSchema = z.object({
  url: z.string().url('Invalid image URL'),
  publicId: z.string().min(1, 'Public ID is required'),
  alt: z.string().optional(),
  sortOrder: z.number().int().default(0),
  isPrimary: z.boolean().default(false),
});

// Create product schema
export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  slug: z.string().optional(),
  description: z.string().optional(),
  price: priceSchema,
  currency: currencySchema,
  comparePrice: priceSchema.optional(),
  sku: z.string().optional(),
  stock: z.coerce.number().int().min(0).default(0),
  lowStockThreshold: z.coerce.number().int().min(0).default(5),
  categoryIds: z.array(z.string()).optional(),
  images: z.array(productImageSchema).max(6, 'Maximum 6 images allowed').optional(),
  specifications: z.array(productSpecificationSchema).optional(),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
});

// Update product schema
export const updateProductSchema = createProductSchema.partial();

// Product list query schema
export const productListQuerySchema = paginationSchema.extend({
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  inStock: z.coerce.boolean().optional(),
  featured: z.coerce.boolean().optional(),
  active: z.coerce.boolean().optional(),
  search: z.string().optional(),
});

// Admin product list query schema
export const adminProductListQuerySchema = productListQuerySchema.extend({
  includeInactive: z.coerce.boolean().optional().default(true),
});

// Bulk update stock schema
export const bulkUpdateStockSchema = z.object({
  updates: z.array(
    z.object({
      productId: z.string().min(1),
      stock: z.coerce.number().int().min(0),
    })
  ),
});

// Add specification schema
export const addSpecificationSchema = productSpecificationSchema;

// Update specification schema
export const updateSpecificationSchema = productSpecificationSchema.partial();
