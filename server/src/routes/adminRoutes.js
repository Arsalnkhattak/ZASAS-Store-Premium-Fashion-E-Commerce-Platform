import express from 'express';
import {
  getDashboardStats,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllOrders,
  updateOrderStatus,
  getCustomers,
  getAdminCoupons,
  createCoupon,
  deleteCoupon,
  getSettings,
} from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';
import { validate } from '../middleware/validate.js';
import { createProductSchema, updateProductSchema } from '../validators/productValidator.js';
import { updateOrderStatusSchema } from '../validators/orderValidator.js';
import { createCouponSchema } from '../validators/couponValidator.js';

const router = express.Router();

// Require both authentication and admin role for all routes in this router
router.use(authenticate, requireAdmin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Products
router.get('/products', getAdminProducts);
router.post('/products', validate(createProductSchema), createProduct);
router.put('/products/:id', validate(updateProductSchema), updateProduct);
router.delete('/products/:id', deleteProduct);

// Categories
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Orders
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', validate(updateOrderStatusSchema), updateOrderStatus);

// Customers
router.get('/customers', getCustomers);

// Coupons
router.get('/coupons', getAdminCoupons);
router.post('/coupons', validate(createCouponSchema), createCoupon);
router.delete('/coupons/:id', deleteCoupon);

// Settings
router.get('/settings', getSettings);

export default router;
