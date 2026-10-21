import { Order } from '../models/Order.js';
import { Coupon } from '../models/Coupon.js';
import { Cart } from '../models/Cart.js';
import { validateAndReserveStock, releaseStock } from '../services/inventoryService.js';
import { PakistaniPaymentGatewayAdapter } from '../services/paymentGatewayAdapter.js';
import { ENV } from '../config/env.js';

export const createOrder = async (req, res, next) => {
  try {
    const {
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      couponCode,
      paymentMethod,
      idempotencyKey,
    } = req.body;

    const userId = req.user?._id || null;

    // Check idempotency if key provided
    if (idempotencyKey) {
      const existingOrder = await Order.findOne({ idempotencyKey });
      if (existingOrder) {
        return res.status(200).json({
          success: true,
          message: 'Order retrieved from previous checkout request.',
          order: existingOrder,
        });
      }
    }

    // 1. Validate & Reserve stock atomically
    const { verifiedItems, subtotal } = await validateAndReserveStock(items);

    // 2. Calculate discounts server-side
    let discount = 0;
    let validatedCoupon = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase().trim(),
        isActive: true,
      });

      if (coupon && (!coupon.minOrderAmount || subtotal >= coupon.minOrderAmount)) {
        if (coupon.discountType === 'percentage') {
          discount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else {
          discount = Math.min(coupon.discountValue, subtotal);
        }
        discount = Math.round(discount);
        validatedCoupon = coupon;
      }
    }

    // 3. Calculate shipping fee
    const shippingFee = subtotal >= ENV.FREE_SHIPPING_THRESHOLD ? 0 : ENV.STANDARD_SHIPPING_FEE;
    const finalTotal = Math.max(0, subtotal - discount + shippingFee);

    // 4. Generate Luxury Order Number (e.g. ZS-2026-98124)
    const datePrefix = new Date().getFullYear().toString();
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `ZS-${datePrefix}-${randomSuffix}`;

    const orderStatus = paymentMethod === 'cod' ? 'confirmed' : 'pending';
    const initialNote = paymentMethod === 'cod'
      ? 'Order received via Cash on Delivery. Queued for fulfillment and verification.'
      : 'Order created awaiting online gateway authorization.';

    const order = new Order({
      orderNumber,
      user: userId,
      customerEmail,
      customerPhone,
      shippingAddress,
      items: verifiedItems,
      subtotal,
      discount,
      couponCode: validatedCoupon ? validatedCoupon.code : null,
      shippingFee,
      total: finalTotal,
      currency: 'PKR',
      paymentMethod,
      paymentStatus: 'pending',
      orderStatus,
      statusHistory: [
        {
          status: orderStatus,
          timestamp: new Date(),
          note: initialNote,
          changedBy: userId ? 'Customer' : 'Guest',
        },
      ],
      idempotencyKey: idempotencyKey || null,
    });

    await order.save();

    // Increment coupon usage
    if (validatedCoupon) {
      await Coupon.updateOne({ _id: validatedCoupon._id }, { $inc: { usedCount: 1 } });
    }

    // Clear cart if user has a cart
    if (userId) {
      await Cart.deleteOne({ user: userId });
    }

    // Handle online gateway initiation if chosen
    let paymentInitiation = null;
    if (paymentMethod === 'online_gateway') {
      paymentInitiation = await PakistaniPaymentGatewayAdapter.initializePayment({
        order,
        customer: shippingAddress,
      });

      if (paymentInitiation.requiresConfiguration) {
        // Return order with gateway requirement note
        return res.status(201).json({
          success: true,
          message: 'Order created. Note: Online payment gateway requires merchant API credentials.',
          order,
          gatewayNotice: paymentInitiation.message,
          requiresConfiguration: true,
        });
      }
    }

    res.status(201).json({
      success: true,
      message: paymentMethod === 'cod' 
        ? 'Your order has been confirmed successfully with Cash on Delivery.'
        : 'Order created. Complete payment via the payment gateway.',
      order,
      paymentInitiation,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let order;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    } else {
      order = await Order.findOne({ orderNumber: id });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Authorization: owner, admin, or guest matching order email
    const isOwner = req.user && order.user && order.user.toString() === req.user._id.toString();
    const isAdmin = req.user && req.user.role === 'admin';
    const emailHeader = req.headers['x-order-email'];
    const isGuestMatch = emailHeader && order.customerEmail.toLowerCase() === emailHeader.toLowerCase();

    if (!isOwner && !isAdmin && !isGuestMatch && order.user) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this order.',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const isOwner = req.user && order.user && order.user.toString() === req.user._id.toString();
    const isAdmin = req.user && req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Unauthorized to cancel this order.' });
    }

    if (['dispatched', 'delivered', 'cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is already ${order.orderStatus}.`,
      });
    }

    // Release stock back to inventory
    await releaseStock(order.items);

    order.orderStatus = 'cancelled';
    order.cancelReason = reason || 'Cancelled by customer';
    order.statusHistory.push({
      status: 'cancelled',
      timestamp: new Date(),
      note: reason || 'Cancelled by customer',
      changedBy: isAdmin ? 'Admin' : 'Customer',
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order has been cancelled and stock has been restored.',
      order,
    });
  } catch (error) {
    next(error);
  }
};
