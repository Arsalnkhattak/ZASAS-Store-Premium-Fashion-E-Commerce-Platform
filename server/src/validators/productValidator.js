import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(2, 'Name is required').max(200),
  sku: z.string().min(3, 'SKU is required').toUpperCase(),
  category: z.string().min(1, 'Category ID is required'),
  subCategory: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  editorialStory: z.string().optional(),
  details: z.array(z.string()).optional(),
  fabricCare: z.array(z.string()).optional(),
  price: z.number().positive('Price must be greater than zero'),
  compareAtPrice: z.number().positive().optional().nullable(),
  images: z.array(z.string().url('Image must be a valid URL')).min(1, 'At least one image is required'),
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.object({
    name: z.string(),
    hex: z.string(),
  })).default([]),
  variants: z.array(z.object({
    sku: z.string(),
    size: z.string(),
    color: z.string(),
    stock: z.number().int().min(0, 'Stock cannot be negative'),
    priceOverride: z.number().positive().optional().nullable(),
  })).default([]),
  tags: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

export const updateProductSchema = createProductSchema.partial();
