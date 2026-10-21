import { Order } from '../models/Order.js';
import { PaymentAttempt } from '../models/PaymentAttempt.js';
import { PakistaniPaymentGatewayAdapter } from '../services/paymentGatewayAdapter.js';

export const getPaymentGatewayStatus = (req, res) => {
  const details = PakistaniPaymentGatewayAdapter.getGatewayDetails();
  res.status(200).json({
    success: true,
    ...details,
  });
};

export const initiatePayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'Order has already been paid.' });
    }

    const result = await PakistaniPaymentGatewayAdapter.initializePayment({
      order,
      customer: order.shippingAddress,
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    await PaymentAttempt.create({
      order: order._id,
      gateway: 'Safepay',
      amount: order.total,
      currency: 'PKR',
      status: 'initiated',
      gatewayTracker: result.token,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const handleWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-sfpy-signature'] || req.headers['x-signature'];
    const payload = JSON.stringify(req.body);

    const isValid = PakistaniPaymentGatewayAdapter.verifyWebhookSignature(payload, signature);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid cryptographic signature' });
    }

    const { event, data } = req.body;

    if (event === 'payment.completed' || event === 'charge.succeeded') {
      const orderNumber = data.order_id || data.metadata?.orderNumber;
      const order = await Order.findOne({ orderNumber });

      if (order && order.paymentStatus !== 'paid') {
        order.paymentStatus = 'paid';
        order.orderStatus = 'confirmed';
        order.paymentDetails = {
          gateway: 'Safepay',
          transactionId: data.token || data.id,
          referenceId: data.tracker,
          paidAt: new Date(),
        };
        order.statusHistory.push({
          status: 'confirmed',
          timestamp: new Date(),
          note: `Payment captured via online gateway (Ref: ${data.token || data.id}).`,
          changedBy: 'Gateway Webhook',
        });
        await order.save();
      }
    }

    res.status(200).json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    next(error);
  }
};
