import express from 'express';
import { applyCoupon } from '../controllers/couponController.js';
import { validate } from '../middleware/validate.js';
import { applyCouponSchema } from '../validators/couponValidator.js';

const router = express.Router();

router.post('/apply', validate(applyCouponSchema), applyCoupon);

export default router;
