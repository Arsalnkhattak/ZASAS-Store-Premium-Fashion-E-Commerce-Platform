import { z } from 'zod';

export const createOrderSchema = z.object({
  customerEmail: z.string().email('Valid customer email is required').toLowerCase(),
  customerPhone: z.string().min(10, 'Valid Pakistani phone number is required'),
  shippingAddress: z.object({
    fullName: z.string().min(2, 'Full name is required'),
    phone: z.string().min(10, 'Phone number is required'),
    email: z.string().email().optional(),
    streetAddress: z.string().min(5, 'Street address is required'),
    apartment: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    province: z.string().min(2, 'Province is required'),
    postalCode: z.string().optional(),
    deliveryInstructions: z.string().optional(),
  }),
  items: z.array(z.object({
    productId: z.string().min(1, 'Product ID is required'),
    variantSku: z.string().min(1, 'Variant SKU is required'),
    size: z.string().min(1, 'Size is required'),
    color: z.string().min(1, 'Color is required'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  })).min(1, 'At least one item is required in the order'),
  couponCode: z.string().optional().nullable(),
  paymentMethod: z.enum(['cod', 'online_gateway'], {
    errorMap: () => ({ message: 'Payment method must be COD or online gateway' }),
  }),
  idempotencyKey: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  orderStatus: z.enum(['pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled']),
  note: z.string().optional(),
});
