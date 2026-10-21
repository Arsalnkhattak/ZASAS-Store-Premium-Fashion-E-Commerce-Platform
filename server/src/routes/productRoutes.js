import express from 'express';
import {
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
  getNewArrivals,
  getRelatedProducts,
  toggleWishlist,
} from '../controllers/productController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/related/:id', getRelatedProducts);
router.get('/:slug', getProductBySlug);
router.post('/wishlist', authenticate, toggleWishlist);

export default router;
