import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, CreditCard, AlertTriangle } from 'lucide-react';
import api from '../../services/api';
import { formatPKR } from '../../utils/currency';

const STATUS_STYLES = {
  pending: 'bg-yellow-50 text-yellow-800',
  confirmed: 'bg-blue-50 text-blue-800',
  processing: 'bg-indigo-50 text-indigo-800',
  dispatched: 'bg-purple-50 text-purple-800',
  delivered: 'bg-emerald-50 text-emerald-800',
  cancelled: 'bg-red-50 text-red-800',
};

export default function AccountOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then((res) => setOrder(res.data.order))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      setCancelling(true);
      const res = await api.post(`/orders/${id}/cancel`, { reason: cancelReason || 'Cancelled by customer' });
      setOrder(res.data.order);
    } catch (err) {
      alert(err.message);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-[#E7E3DC] w-48" />
        <div className="h-48 bg-[#E7E3DC]" />
        <div className="h-32 bg-[#E7E3DC]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h3 className="font-serif text-xl text-[#1C1C1A]">Order Not Found</h3>
        <Link to="/account/orders" className="text-xs text-[#9A7955] mt-2 hover:underline block">
          Back to Order Archive
        </Link>
      </div>
    );
  }

  const canCancel = !['dispatched', 'delivered', 'cancelled'].includes(order.orderStatus);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 pb-4 border-b border-[#E7E3DC]">
        <Link to="/account/orders" className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#A59A8A] hover:text-[#9A7955]">
          <ArrowLeft size={14} /><span>Orders</span>
        </Link>
        <span className="text-[#A59A8A]">/</span>
        <span className="font-mono text-sm font-bold text-[#1C1C1A]">{order.orderNumber}</span>
        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 font-medium ${STATUS_STYLES[order.orderStatus]}`}>
          {order.orderStatus}
        </span>
      </div>

      {/* Order Items */}
      <div className="bg-white border border-[#E7E3DC] p-6">
        <h3 className="font-serif text-lg text-[#1C1C1A] mb-4 flex items-center gap-2">
          <Package size={18} className="text-[#9A7955]" />
          <span>Ordered Pieces</span>
        </h3>
        <div className="space-y-4 divide-y divide-[#E7E3DC]">
          {order.items?.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 pt-4 first:pt-0">
              <div className="w-16 h-22 bg-[#E7E3DC] overflow-hidden shrink-0 border border-[#E7E3DC]">
                {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1">
                <h4 className="font-serif text-sm text-[#1C1C1A]">{item.name}</h4>
                <p className="text-xs text-[#A59A8A] mt-0.5">Size: {item.size} | Color: {item.color}</p>
                <p className="text-xs text-[#A59A8A]">SKU: {item.sku}</p>
                <p className="text-xs font-medium text-[#1C1C1A] mt-1">{formatPKR(item.price)} × {item.quantity}</p>
              </div>
              <div className="text-right">
                <span className="font-serif text-base font-semibold text-[#1C1C1A]">{formatPKR(item.subtotal)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-white border border-[#E7E3DC] p-6">
          <h3 className="text-xs uppercase tracking-widest font-semibold text-[#A59A8A] mb-3 flex items-center gap-2">
            <MapPin size={14} className="text-[#9A7955]" /><span>Delivery Address</span>
          </h3>
          <div className="text-xs text-[#1C1C1A] space-y-1 leading-relaxed">
            <p className="font-semibold text-sm">{order.shippingAddress?.fullName}</p>
            <p>{order.shippingAddress?.phone}</p>
            <p>{order.shippingAddress?.streetAddress}</p>
            {order.shippingAddress?.apartment && <p>{order.shippingAddress.apartment}</p>}
            <p>{order.shippingAddress?.city}, {order.shippingAddress?.province}</p>
            {order.shippingAddress?.deliveryInstructions && (
              <p className="text-[#A59A8A] italic mt-2">"{order.shippingAddress.deliveryInstructions}"</p>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white border border-[#E7E3DC] p-6">
          <h3 className="text-xs uppercase tracking-widest font-semibold text-[#A59A8A] mb-3 flex items-center gap-2">
            <CreditCard size={14} className="text-[#9A7955]" /><span>Financial Summary</span>
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-[#A59A8A]">Subtotal</span><span>{formatPKR(order.subtotal)}</span></div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount ({order.couponCode})</span>
                <span>- {formatPKR(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between"><span className="text-[#A59A8A]">Shipping</span><span>{order.shippingFee === 0 ? 'FREE' : formatPKR(order.shippingFee)}</span></div>
            <div className="border-t border-[#E7E3DC] pt-2 flex justify-between font-semibold text-sm">
              <span>Total Paid</span>
              <span className="font-serif text-base">{formatPKR(order.total)}</span>
            </div>
            <div className="pt-2 space-y-1">
              <div className="flex justify-between text-[10px] uppercase tracking-wider">
                <span className="text-[#A59A8A]">Payment Method</span>
                <span className="font-medium">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Gateway'}</span>
              </div>
              <div className="flex justify-between text-[10px] uppercase tracking-wider">
                <span className="text-[#A59A8A]">Payment Status</span>
                <span className={`font-medium ${order.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-yellow-700'}`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status History */}
      {order.statusHistory?.length > 0 && (
        <div className="bg-white border border-[#E7E3DC] p-6">
          <h3 className="text-xs uppercase tracking-widest font-semibold text-[#A59A8A] mb-4">Order Timeline</h3>
          <div className="space-y-4">
            {order.statusHistory.map((event, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#9A7955] mt-0.5" />
                  {idx < order.statusHistory.length - 1 && <div className="flex-1 w-px bg-[#E7E3DC] mt-1.5" />}
                </div>
                <div className="pb-4">
                  <p className="text-xs font-semibold text-[#1C1C1A] capitalize">{event.status}</p>
                  <p className="text-[11px] text-[#A59A8A] mt-0.5">{event.note}</p>
                  <p className="text-[10px] text-[#A59A8A] mt-0.5">
                    {new Date(event.timestamp).toLocaleString('en-PK')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cancel Order */}
      {canCancel && (
        <div className="bg-red-50 border border-red-200 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-800">Cancel This Order</h4>
              <p className="text-xs text-red-700 mt-1">
                Once cancelled, this order cannot be reinstated. Stock will be released automatically.
              </p>
              <div className="mt-3 flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Reason for cancellation (optional)"
                  className="flex-1 p-2 text-xs border border-red-200 bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="px-4 py-2 bg-red-600 text-white text-xs uppercase tracking-wider hover:bg-red-700 transition-colors disabled:opacity-60 whitespace-nowrap"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
