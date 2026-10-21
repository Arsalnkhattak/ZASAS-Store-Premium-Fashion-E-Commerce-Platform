import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, ShoppingBag, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';
import api from '../../services/api';
import { formatPKR } from '../../utils/currency';

const STATUS_OPTIONS = [
  'pending',
  'confirmed',
  'processing',
  'dispatched',
  'delivered',
  'cancelled',
];

const STATUS_COLORS = {
  pending: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-50 text-blue-800 border-blue-200',
  processing: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  dispatched: 'bg-purple-50 text-purple-800 border-purple-200',
  delivered: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  cancelled: 'bg-red-50 text-red-800 border-red-200',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page, limit: 15 });
      if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);
      if (search) params.set('search', search);

      const res = await api.get(`/admin/orders?${params}`);
      setOrders(res.data.orders || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalCount(res.data.totalCount || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter, search]);

  const handleQuickStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, {
        orderStatus: newStatus,
        note: `Status updated to ${newStatus} from orders registry.`,
      });
      fetchOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E3DC]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7955] font-semibold block">
            Fulfillment & Logistics
          </span>
          <h1 className="font-serif text-3xl text-[#1C1C1A] mt-0.5">
            Client Orders ({totalCount})
          </h1>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 text-xs">
          {['all', ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              className={`px-3 py-1.5 uppercase text-[10px] tracking-wider font-medium whitespace-nowrap transition-colors border ${
                statusFilter === s
                  ? 'bg-[#1C1C1A] text-white border-[#1C1C1A]'
                  : 'bg-white text-[#4A4843] border-[#E7E3DC] hover:border-[#9A7955]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A59A8A]" />
          <input
            type="text"
            placeholder="Search order #, customer, city..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs border border-[#E7E3DC] bg-white focus:outline-none focus:border-[#9A7955]"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#E7E3DC] overflow-x-auto shadow-2xs">
        {loading ? (
          <div className="p-6 space-y-3 animate-pulse">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-12 bg-[#E7E3DC]" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-[#A59A8A]">
            <ShoppingBag size={28} className="mx-auto mb-2 text-[#9A7955]" />
            <p className="text-xs">No orders matching the current filter.</p>
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead className="bg-[#F8F5EF] border-b border-[#E7E3DC]">
              <tr>
                {['Order Number', 'Date', 'Customer & Destination', 'Items', 'Total', 'Payment', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="py-3 px-4 text-left text-[10px] uppercase tracking-wider text-[#A59A8A] font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E3DC]/60">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-[#F8F5EF] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#1C1C1A]">
                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="hover:text-[#9A7955] transition-colors"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>

                  <td className="py-3 px-4 text-[#A59A8A]">
                    {new Date(order.createdAt).toLocaleDateString('en-PK', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-medium text-[#1C1C1A]">{order.shippingAddress?.fullName || 'Guest Patron'}</p>
                    <p className="text-[11px] text-[#A59A8A]">
                      {order.shippingAddress?.city}, {order.shippingAddress?.province}
                    </p>
                  </td>

                  <td className="py-3 px-4 text-[#4A4843]">
                    {order.items?.length || 0} {order.items?.length === 1 ? 'piece' : 'pieces'}
                  </td>

                  <td className="py-3 px-4 font-serif font-semibold text-[#1C1C1A]">
                    {formatPKR(order.total)}
                  </td>

                  <td className="py-3 px-4">
                    <span className="uppercase font-mono text-[10px] text-[#1C1C1A] block">
                      {order.paymentMethod?.toUpperCase()}
                    </span>
                    <span
                      className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded inline-block mt-0.5 ${
                        order.paymentStatus === 'paid'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-yellow-50 text-yellow-700'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleQuickStatusChange(order._id, e.target.value)}
                      className={`text-[10px] uppercase font-semibold tracking-wider px-2 py-1 border rounded cursor-pointer ${
                        STATUS_COLORS[order.orderStatus] || 'bg-gray-50 text-gray-700'
                      }`}
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="py-3 px-4">
                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E7E3DC] hover:border-[#9A7955] text-[#1C1C1A] text-[11px] uppercase tracking-wider"
                    >
                      <Eye size={13} />
                      <span>Review</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={`w-8 h-8 text-xs font-medium ${
                page === p
                  ? 'bg-[#1C1C1A] text-white'
                  : 'bg-white border border-[#E7E3DC] text-[#1C1C1A] hover:border-[#9A7955]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
