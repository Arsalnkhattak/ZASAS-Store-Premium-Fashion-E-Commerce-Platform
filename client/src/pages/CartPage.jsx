import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Ticket } from 'lucide-react';
import { updateCartQuantity, removeCartItem } from '../store/cartSlice';
import { setToast } from '../store/uiSlice';
import api from '../services/api';
import { formatPKR } from '../utils/currency';
import { BRAND_INFO } from '../utils/constants';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, subtotal, itemCount } = useSelector((state) => state.cart);

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [applying, setApplying] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    try {
      setApplying(true);
      setCouponError('');
      const res = await api.post('/coupons/apply', {
        code: couponInput.trim(),
        subtotal,
      });

      setAppliedCoupon(res.data.coupon);
      dispatch(setToast({ message: res.data.message, type: 'success' }));
    } catch (err) {
      setCouponError(err.message);
      setAppliedCoupon(null);
    } finally {
      setApplying(false);
    }
  };

  const discountAmount = appliedCoupon?.discountAmount || 0;
  const isFreeShipping = subtotal >= BRAND_INFO.freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : BRAND_INFO.standardShippingFee;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="font-serif text-3xl text-[#1C1C1A]">Your Shopping Bag</h1>
        <p className="text-xs text-[#A59A8A] mt-2 mb-8">
          You currently have no pieces in your shopping bag.
        </p>
        <Link
          to="/shop"
          className="inline-block px-8 py-3.5 bg-[#1C1C1A] text-white text-xs uppercase tracking-widest hover:bg-[#9A7955] transition-colors"
        >
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="mb-10 border-b border-[#E7E3DC] pb-4">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7955] font-semibold block">
          Review Order
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1C1A] mt-1">
          Shopping Bag ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Items Table */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-[#E7E3DC] divide-y divide-[#E7E3DC]">
            {items.map((item) => (
              <div key={item._id} className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                <div className="flex gap-4 items-center">
                  <Link to={`/product/${item.slug}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-28 object-cover bg-[#E7E3DC] border border-[#E7E3DC]"
                    />
                  </Link>
                  <div>
                    <h3 className="font-serif text-base text-[#1C1C1A] hover:text-[#9A7955]">
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </h3>
                    <p className="text-xs text-[#A59A8A] mt-1">
                      Size: <span className="text-[#1C1C1A] font-medium">{item.size}</span> | Color: <span className="text-[#1C1C1A] font-medium">{item.color}</span>
                    </p>
                    <p className="text-xs font-semibold text-[#1C1C1A] mt-1">
                      {formatPKR(item.price)}
                    </p>
                  </div>
                </div>

                {/* Quantity and Line Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  <div className="flex items-center border border-[#E7E3DC]">
                    <button
                      type="button"
                      onClick={() => {
                        if (item.quantity > 1) {
                          dispatch(updateCartQuantity({ itemId: item._id, quantity: item.quantity - 1 }));
                        } else {
                          dispatch(removeCartItem(item._id));
                        }
                      }}
                      className="p-1.5 hover:text-[#9A7955]"
                      aria-label="Decrease"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => dispatch(updateCartQuantity({ itemId: item._id, quantity: item.quantity + 1 }))}
                      className="p-1.5 hover:text-[#9A7955]"
                      aria-label="Increase"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  <div className="text-right min-w-24">
                    <span className="font-medium text-sm text-[#1C1C1A] block">
                      {formatPKR(item.itemTotal)}
                    </span>
                    <button
                      type="button"
                      onClick={() => dispatch(removeCartItem(item._id))}
                      className="text-xs text-[#A59A8A] hover:text-red-600 mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              to="/shop"
              className="text-xs uppercase tracking-widest text-[#1C1C1A] hover:text-[#9A7955] font-medium"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary & Coupon */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#E7E3DC] p-6 space-y-6">
            <h2 className="font-serif text-xl text-[#1C1C1A] border-b border-[#E7E3DC] pb-4">
              Order Summary
            </h2>

            {/* Calculations */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-[#1C1C1A]">
                <span className="text-[#A59A8A]">Subtotal</span>
                <span>{formatPKR(subtotal)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Promotional Discount ({appliedCoupon.code})</span>
                  <span>- {formatPKR(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#1C1C1A]">
                <span className="text-[#A59A8A]">Nationwide Shipping</span>
                <span>{isFreeShipping ? 'FREE' : formatPKR(shippingFee)}</span>
              </div>

              <div className="border-t border-[#E7E3DC] pt-3 flex justify-between items-baseline">
                <span className="text-sm font-medium uppercase tracking-wider">Estimated Total</span>
                <span className="font-serif text-xl font-semibold text-[#1C1C1A]">
                  {formatPKR(finalTotal)}
                </span>
              </div>
            </div>

            {/* Promotional Code Form */}
            <form onSubmit={handleApplyCoupon} className="pt-2">
              <label htmlFor="cart-coupon-input" className="block text-[11px] uppercase tracking-wider text-[#A59A8A] mb-1.5">
                Have a Promotional Voucher?
              </label>
              <div className="flex">
                <input
                  id="cart-coupon-input"
                  type="text"
                  placeholder="e.g. WELCOME10"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#F8F5EF] border border-[#E7E3DC] uppercase focus:outline-hidden focus:border-[#9A7955]"
                />
                <button
                  type="submit"
                  disabled={applying}
                  className="bg-[#1C1C1A] text-white px-4 text-xs uppercase tracking-wider hover:bg-[#9A7955] transition-colors disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-[11px] text-red-600 mt-1">{couponError}</p>}
              {appliedCoupon && (
                <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
                  <Ticket size={12} />
                  <span>Code {appliedCoupon.code} applied successfully!</span>
                </p>
              )}
            </form>

            {/* Checkout CTA */}
            <button
              type="button"
              onClick={() => navigate('/checkout', { state: { coupon: appliedCoupon } })}
              className="w-full py-4 bg-[#1C1C1A] text-white text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#9A7955] transition-colors flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={14} />
            </button>

            <div className="pt-2 text-center text-[11px] text-[#A59A8A]">
              Cash on Delivery (COD) and Online Gateway available.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
