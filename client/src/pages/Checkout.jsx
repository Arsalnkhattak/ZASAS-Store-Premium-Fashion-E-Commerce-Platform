import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldCheck, Package, Truck, CreditCard, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { setToast } from '../store/uiSlice';
import { clearCartState } from '../store/cartSlice';
import { formatPKR } from '../utils/currency';
import { PAKISTAN_PROVINCES, MAJOR_PAKISTAN_CITIES, BRAND_INFO } from '../utils/constants';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Valid Pakistani phone number is required (e.g. 03001234567)'),
  email: z.string().email('Valid email is required'),
  streetAddress: z.string().min(5, 'Complete street address is required'),
  apartment: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  province: z.string().min(2, 'Province is required'),
  postalCode: z.string().optional(),
  deliveryInstructions: z.string().optional(),
  paymentMethod: z.enum(['cod', 'online_gateway'], {
    errorMap: () => ({ message: 'Please select a payment method' }),
  }),
});

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, subtotal } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [submitting, setSubmitting] = useState(false);
  const [gatewayNotice, setGatewayNotice] = useState(null);
  const [couponCode] = useState('');

  const shippingFee = subtotal >= BRAND_INFO.freeShippingThreshold ? 0 : BRAND_INFO.standardShippingFee;
  const finalTotal = subtotal + shippingFee;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      streetAddress: user?.addresses?.[0]?.streetAddress || '',
      city: user?.addresses?.[0]?.city || '',
      province: user?.addresses?.[0]?.province || '',
      paymentMethod: 'cod',
    },
  });

  const selectedPayment = watch('paymentMethod');

  const onSubmit = async (formData) => {
    if (items.length === 0) {
      dispatch(setToast({ message: 'Your shopping bag is empty.', type: 'error' }));
      navigate('/shop');
      return;
    }

    try {
      setSubmitting(true);

      const orderPayload = {
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          streetAddress: formData.streetAddress,
          apartment: formData.apartment || '',
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode || '',
          deliveryInstructions: formData.deliveryInstructions || '',
        },
        items: items.map((item) => ({
          productId: item.productId,
          variantSku: item.variantSku,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        })),
        paymentMethod: formData.paymentMethod,
        couponCode: couponCode || null,
        idempotencyKey: `checkout-${user?._id || localStorage.getItem('zasas_guest_id')}-${Date.now()}`,
      };

      const res = await api.post('/orders', orderPayload);

      if (res.data.requiresConfiguration) {
        setGatewayNotice(res.data.gatewayNotice);
      } else {
        dispatch(clearCartState());
        dispatch(
          setToast({
            message: formData.paymentMethod === 'cod'
              ? `Order ${res.data.order.orderNumber} confirmed! Your ensemble will be dispatched within 24 hours.`
              : `Order ${res.data.order.orderNumber} created. Redirecting to secure payment...`,
            type: 'success',
          })
        );

        if (formData.paymentMethod === 'cod') {
          navigate(`/account/orders/${res.data.order._id}`);
        } else if (res.data.paymentInitiation?.checkoutUrl) {
          window.location.href = res.data.paymentInitiation.checkoutUrl;
        } else {
          navigate(`/account/orders/${res.data.order._id}`);
        }
      }
    } catch (error) {
      dispatch(setToast({ message: error.message || 'Checkout failed. Please review your bag and try again.', type: 'error' }));
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <ShieldCheck size={36} className="mx-auto text-[#A59A8A] mb-4" strokeWidth={1.5} />
        <h1 className="font-serif text-3xl text-[#1C1C1A]">Your bag is empty</h1>
        <p className="text-xs text-[#A59A8A] mt-2 mb-8">
          Add pieces to your shopping bag before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="inline-block px-8 py-3 bg-[#1C1C1A] text-white text-xs uppercase tracking-widest hover:bg-[#9A7955] transition-colors"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="mb-10 border-b border-[#E7E3DC] pb-4">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7955] font-semibold block">
          Secure Checkout
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1C1A] mt-1">
          Order Confirmation
        </h1>
        {!isAuthenticated && (
          <p className="text-xs text-[#A59A8A] mt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-[#9A7955] hover:underline">
              Sign in for a smoother checkout
            </Link>
          </p>
        )}
      </div>

      {/* Gateway Notice Alert */}
      {gatewayNotice && (
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded">
          <p className="font-medium">Online Payment Gateway Note:</p>
          <p className="mt-1">{gatewayNotice}</p>
          <p className="mt-2">Your order has been created. To complete payment, please set up the Safepay merchant gateway or select Cash on Delivery (COD).</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Shipping + Payment Form */}
          <div className="lg:col-span-7 space-y-10">
            {/* Shipping Details */}
            <div className="bg-white border border-[#E7E3DC] p-6 sm:p-8 space-y-6">
              <h2 className="font-serif text-xl text-[#1C1C1A] border-b border-[#E7E3DC] pb-4 flex items-center gap-2">
                <Truck size={20} className="text-[#9A7955]" />
                <span>Delivery Address</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="fullName" className="block text-xs uppercase tracking-wider text-[#A59A8A] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    {...register('fullName')}
                    className="w-full p-2.5 text-sm border border-[#E7E3DC] bg-[#F8F5EF] focus:outline-hidden focus:border-[#9A7955]"
                    placeholder="As it appears on your NIC"
                  />
                  {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName.message}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs uppercase tracking-wider text-[#A59A8A] mb-1.5">
                    Pakistani Mobile Number *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    className="w-full p-2.5 text-sm border border-[#E7E3DC] bg-[#F8F5EF] focus:outline-hidden focus:border-[#9A7955]"
                    placeholder="03XX-XXXXXXX"
                  />
                  {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs uppercase tracking-wider text-[#A59A8A] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="w-full p-2.5 text-sm border border-[#E7E3DC] bg-[#F8F5EF] focus:outline-hidden focus:border-[#9A7955]"
                    placeholder="For order confirmations"
                  />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="streetAddress" className="block text-xs uppercase tracking-wider text-[#A59A8A] mb-1.5">
                    Street Address & House/Flat No. *
                  </label>
                  <input
                    id="streetAddress"
                    type="text"
                    {...register('streetAddress')}
                    className="w-full p-2.5 text-sm border border-[#E7E3DC] bg-[#F8F5EF] focus:outline-hidden focus:border-[#9A7955]"
                    placeholder="House No., Street, Area"
                  />
                  {errors.streetAddress && <p className="text-xs text-red-600 mt-1">{errors.streetAddress.message}</p>}
                </div>

                <div>
                  <label htmlFor="apartment" className="block text-xs uppercase tracking-wider text-[#A59A8A] mb-1.5">
                    Apartment / Floor (Optional)
                  </label>
                  <input
                    id="apartment"
                    type="text"
                    {...register('apartment')}
                    className="w-full p-2.5 text-sm border border-[#E7E3DC] bg-[#F8F5EF] focus:outline-hidden focus:border-[#9A7955]"
                    placeholder="Floor 4, Suite B"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-xs uppercase tracking-wider text-[#A59A8A] mb-1.5">
                    City *
                  </label>
                  <select
                    id="city"
                    {...register('city')}
                    className="w-full p-2.5 text-sm border border-[#E7E3DC] bg-[#F8F5EF] focus:outline-hidden focus:border-[#9A7955]"
                  >
                    <option value="">Select City</option>
                    {MAJOR_PAKISTAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    <option value="Other">Other City</option>
                  </select>
                  {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city.message}</p>}
                </div>

                <div>
                  <label htmlFor="province" className="block text-xs uppercase tracking-wider text-[#A59A8A] mb-1.5">
                    Province *
                  </label>
                  <select
                    id="province"
                    {...register('province')}
                    className="w-full p-2.5 text-sm border border-[#E7E3DC] bg-[#F8F5EF] focus:outline-hidden focus:border-[#9A7955]"
                  >
                    <option value="">Select Province</option>
                    {PAKISTAN_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {errors.province && <p className="text-xs text-red-600 mt-1">{errors.province.message}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="deliveryInstructions" className="block text-xs uppercase tracking-wider text-[#A59A8A] mb-1.5">
                    Special Delivery Instructions (Optional)
                  </label>
                  <textarea
                    id="deliveryInstructions"
                    {...register('deliveryInstructions')}
                    rows={3}
                    className="w-full p-2.5 text-sm border border-[#E7E3DC] bg-[#F8F5EF] focus:outline-hidden focus:border-[#9A7955] resize-none"
                    placeholder="E.g. Call before arrival; ring main gate bell; leave with building guard..."
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-[#E7E3DC] p-6 sm:p-8 space-y-4">
              <h2 className="font-serif text-xl text-[#1C1C1A] border-b border-[#E7E3DC] pb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-[#9A7955]" />
                <span>Payment Method</span>
              </h2>

              <div className="space-y-3">
                {/* COD Option */}
                <label
                  htmlFor="pay-cod"
                  className={`flex items-start gap-4 p-4 border-2 cursor-pointer transition-colors ${
                    selectedPayment === 'cod' ? 'border-[#1C1C1A] bg-[#F8F5EF]' : 'border-[#E7E3DC] hover:border-[#A59A8A]'
                  }`}
                >
                  <input
                    id="pay-cod"
                    type="radio"
                    value="cod"
                    {...register('paymentMethod')}
                    className="mt-0.5 accent-[#9A7955]"
                  />
                  <div>
                    <span className="text-sm font-semibold text-[#1C1C1A] flex items-center gap-2">
                      <Package size={18} className="text-[#9A7955]" />
                      Cash on Delivery (COD)
                      <span className="text-[10px] uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-sm font-medium">
                        Recommended
                      </span>
                    </span>
                    <p className="text-xs text-[#A59A8A] mt-1">
                      Pay in Pakistani Rupees (PKR) when your order arrives at your doorstep. Available nationwide across all major cities.
                    </p>
                  </div>
                </label>

                {/* Online Gateway Option */}
                <label
                  htmlFor="pay-online"
                  className={`flex items-start gap-4 p-4 border-2 cursor-pointer transition-colors ${
                    selectedPayment === 'online_gateway' ? 'border-[#1C1C1A] bg-[#F8F5EF]' : 'border-[#E7E3DC] hover:border-[#A59A8A]'
                  }`}
                >
                  <input
                    id="pay-online"
                    type="radio"
                    value="online_gateway"
                    {...register('paymentMethod')}
                    className="mt-0.5 accent-[#9A7955]"
                  />
                  <div>
                    <span className="text-sm font-semibold text-[#1C1C1A] flex items-center gap-2">
                      <CreditCard size={18} className="text-[#9A7955]" />
                      Online Card / Wallet (Safepay)
                    </span>
                    <p className="text-xs text-[#A59A8A] mt-1">
                      Pakistani Debit/Credit Cards (Visa, Mastercard, 1Link), JazzCash, EasyPaisa, and 1Bill via Safepay encrypted gateway.
                    </p>
                    <p className="text-[11px] text-amber-700 mt-1 font-medium">
                      Note: Online gateway requires merchant credentials configuration. Contact atelier for setup or use COD.
                    </p>
                  </div>
                </label>
              </div>

              {errors.paymentMethod && <p className="text-xs text-red-600">{errors.paymentMethod.message}</p>}
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E7E3DC] p-6 sticky top-28">
              <h2 className="font-serif text-xl text-[#1C1C1A] border-b border-[#E7E3DC] pb-4">
                Order Overview
              </h2>

              <div className="mt-4 space-y-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-18 object-cover bg-[#E7E3DC]"
                      />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#1C1C1A] text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-serif text-[#1C1C1A] truncate">{item.name}</p>
                      <p className="text-[11px] text-[#A59A8A]">{item.size} / {item.color}</p>
                    </div>
                    <p className="text-xs font-semibold text-[#1C1C1A] whitespace-nowrap">
                      {formatPKR(item.itemTotal)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-6 border-t border-[#E7E3DC] pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-[#A59A8A]">
                  <span>Subtotal</span>
                  <span className="text-[#1C1C1A]">{formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#A59A8A]">
                  <span>Nationwide Shipping</span>
                  <span className="text-[#1C1C1A]">
                    {shippingFee === 0 ? 'FREE' : formatPKR(shippingFee)}
                  </span>
                </div>
                <div className="border-t border-[#E7E3DC] pt-3 flex justify-between items-center font-medium text-sm">
                  <span>Total Payable</span>
                  <span className="font-serif text-lg text-[#1C1C1A]">{formatPKR(finalTotal)}</span>
                </div>
                <p className="text-[11px] text-[#A59A8A]">Currency: Pakistani Rupees (PKR)</p>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={submitting}
                className="mt-6 w-full py-4 bg-[#1C1C1A] text-white text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#9A7955] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span>Placing Your Order...</span>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>
                      {selectedPayment === 'cod' ? 'Confirm Cash on Delivery Order' : 'Place Order & Pay Online'}
                    </span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-[#A59A8A] mt-3 leading-relaxed">
                By placing your order, you acknowledge our{' '}
                <Link to="/returns-policy" className="text-[#9A7955] hover:underline">
                  7-day exchange policy
                </Link>{' '}
                and{' '}
                <Link to="/terms" className="text-[#9A7955] hover:underline">
                  Terms of Service
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
