import { Coupon } from '../models/Coupon.js';

export const applyCoupon = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase().trim(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or inactive promotional code.',
      });
    }

    const now = new Date();
    if (coupon.startDate && coupon.startDate > now) {
      return res.status(400).json({
        success: false,
        message: 'This promotional code is not yet active.',
      });
    }

    if (coupon.endDate && coupon.endDate < now) {
      return res.status(400).json({
        success: false,
        message: 'This promotional code has expired.',
      });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: 'This promotional code has reached its maximum usage limit.',
      });
    }

    if (subtotal < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Order subtotal must be at least Rs. ${coupon.minOrderAmount.toLocaleString()} to use this code.`,
      });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = Math.min(coupon.discountValue, subtotal);
    }

    discount = Math.round(discount);

    res.status(200).json({
      success: true,
      message: `Promotional code "${coupon.code}" applied successfully!`,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: discount,
      },
    });
  } catch (error) {
    next(error);
  }
};
