import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Clock } from 'lucide-react';
import api from '../../services/api';
import { formatPKR } from '../../utils/currency';

const STATUS_STYLES = {
  pending: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-50 text-blue-800 border-blue-200',
  processing: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  dispatched: 'bg-purple-50 text-purple-800 border-purple-200',
  delivered: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  cancelled: 'bg-red-50 text-red-800 border-red-200',
};

export default function AccountOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my-orders')
      .then((res) => setOrders(res.data.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-24 bg-[#E7E3DC] animate-pulse" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white border border-[#E7E3DC] p-12 text-center">
        <Package size={32} className="mx-auto text-[#A59A8A] mb-3" strokeWidth={1.5} />
        <h3 className="font-serif text-xl text-[#1C1C1A]">No Orders Yet</h3>
        <p className="text-xs text-[#A59A8A] mt-2">Your order archive is empty. Start exploring our atelier collections.</p>
        <Link to="/shop" className="mt-5 inline-block px-6 py-2.5 bg-[#1C1C1A] text-white text-xs uppercase tracking-widest hover:bg-[#9A7955] transition-colors">
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-[#E7E3DC]">
        <h2 className="font-serif text-2xl text-[#1C1C1A]">Order Archive</h2>
        <span className="text-xs text-[#A59A8A]">{orders.length} total order{orders.length === 1 ? '' : 's'}</span>
      </div>

      {orders.map((order) => (
        <div key={order._id} className="bg-white border border-[#E7E3DC] p-5 hover:border-[#9A7955] transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono text-sm font-bold text-[#1C1C1A]">{order.orderNumber}</span>
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 border font-medium ${STATUS_STYLES[order.orderStatus] || STATUS_STYLES.pending}`}>
                  {order.orderStatus}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#A59A8A]">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Gateway'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#A59A8A]">
                <Clock size={12} />
                <span>{new Date(order.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span>•</span>
                <span>{order.items?.length} item{order.items?.length === 1 ? '' : 's'}</span>
              </div>
              {/* Preview thumbnails */}
              <div className="flex gap-2 mt-2">
                {order.items?.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="w-10 h-14 bg-[#E7E3DC] overflow-hidden border border-[#E7E3DC]">
                    {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
                ))}
                {order.items?.length > 3 && (
                  <div className="w-10 h-14 bg-[#E7E3DC] flex items-center justify-center text-xs text-[#A59A8A]">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 sm:gap-2">
              <div className="text-right">
                <span className="font-serif text-lg font-semibold text-[#1C1C1A] block">{formatPKR(order.total)}</span>
                <span className="text-[10px] uppercase tracking-wider text-[#A59A8A]">PKR</span>
              </div>
              <Link
                to={`/account/orders/${order._id}`}
                className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#1C1C1A] hover:text-[#9A7955] font-medium transition-colors"
              >
                <span>View Details</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
