import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} from '../controllers/orderController.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createOrderSchema } from '../validators/orderValidator.js';

const router = express.Router();

router.post('/', optionalAuthenticate, validate(createOrderSchema), createOrder);
router.get('/my-orders', authenticate, getMyOrders);
router.get('/:id', optionalAuthenticate, getOrderById);
router.post('/:id/cancel', optionalAuthenticate, cancelOrder);

export default router;
