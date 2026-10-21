import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  mergeGuestCart,
} from '../controllers/cartController.js';
import { optionalAuthenticate, authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuthenticate, getCart);
router.post('/add', optionalAuthenticate, addToCart);
router.put('/item/:itemId', optionalAuthenticate, updateCartItem);
router.delete('/item/:itemId', optionalAuthenticate, removeCartItem);
router.post('/merge', authenticate, mergeGuestCart);

export default router;
