import express from 'express';
import {
  getPaymentGatewayStatus,
  initiatePayment,
  handleWebhook,
} from '../controllers/paymentController.js';
import { optionalAuthenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/status', getPaymentGatewayStatus);
router.post('/initiate', optionalAuthenticate, initiatePayment);
router.post('/webhook', handleWebhook);

export default router;
