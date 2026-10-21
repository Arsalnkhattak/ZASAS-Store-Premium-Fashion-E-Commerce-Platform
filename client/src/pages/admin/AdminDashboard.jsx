import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Layers, Users, TrendingUp, Package, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { formatPKR } from '../../utils/currency';

const STATUS_COLORS = {
  pending: 'text-yellow-700 bg-yellow-50',
  confirmed: 'text-blue-700 bg-blue-50',
  processing: 'text-indigo-700 bg-indigo-50',
  dispatched: 'text-purple-700 bg-purple-50',
  delivered: 'text-emerald-700 bg-emerald-50',
  cancelled: 'text-red-700 bg-red-50',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then((res) => setStats(res.data.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map((n) => <div key={n} className="h-28 bg-[#E7E3DC] rounded" />)}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Orders', value: stats?.totalOrders?.toLocaleString() || '0', icon: ShoppingBag, link: '/admin/orders', color: 'text-blue-600' },
    { label: 'Total Revenue', value: formatPKR(stats?.totalRevenue || 0), icon: TrendingUp, link: '/admin/orders', color: 'text-emerald-600' },
    { label: 'Active Products', value: stats?.totalProducts?.toLocaleString() || '0', icon: Layers, link: '/admin/products', color: 'text-purple-600' },
    { label: 'Customers', value: stats?.totalCustomers?.toLocaleString() || '0', icon: Users, link: '/admin/customers', color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7955] font-semibold block">Overview</span>
        <h1 className="font-serif text-3xl text-[#1C1C1A] mt-0.5">Atelier Dashboard</h1>
        <p className="text-xs text-[#A59A8A] mt-1">Live operational overview for ZASAS Pakistan operations.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className="bg-white border border-[#E7E3DC] p-6 hover:border-[#9A7955] transition-colors group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#A59A8A] font-medium">{card.label}</p>
                <p className="font-serif text-2xl font-semibold text-[#1C1C1A] mt-1.5">{card.value}</p>
              </div>
              <div className={`p-2 bg-[#F8F5EF] rounded ${card.color}`}>
                <card.icon size={22} strokeWidth={1.5} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Orders by Status */}
      {stats?.ordersByStatus && Object.keys(stats.ordersByStatus).length > 0 && (
        <div className="bg-white border border-[#E7E3DC] p-6">
          <h2 className="font-serif text-xl text-[#1C1C1A] mb-4">Orders by Status</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(stats.ordersByStatus).map(([status, count]) => (
              <div key={status} className={`p-3 rounded text-center ${STATUS_COLORS[status] || 'text-gray-700 bg-gray-50'}`}>
                <span className="text-xl font-bold block">{count}</span>
                <span className="text-[10px] uppercase tracking-wider capitalize block mt-0.5">{status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white border border-[#E7E3DC] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl text-[#1C1C1A]">Recent Orders</h2>
          <Link to="/admin/orders" className="text-xs uppercase tracking-wider text-[#9A7955] hover:underline">View All</Link>
        </div>

        {!stats?.recentOrders?.length ? (
          <div className="text-center py-8 text-[#A59A8A]">
            <Package size={24} className="mx-auto mb-2" strokeWidth={1.5} />
            <p className="text-xs">No orders yet in the system.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#E7E3DC]">
                  {['Order No.', 'Customer', 'Items', 'Total', 'Status', 'Date', ''].map((h) => (
                    <th key={h} className="pb-3 text-left text-[#A59A8A] uppercase tracking-wider font-medium pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E3DC]/50">
                {stats.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#F8F5EF] transition-colors">
                    <td className="py-3 pr-4 font-mono font-bold text-[#1C1C1A]">{order.orderNumber}</td>
                    <td className="py-3 pr-4 text-[#1C1C1A]">{order.customerEmail}</td>
                    <td className="py-3 pr-4 text-[#A59A8A]">{order.items?.length || 0} pcs</td>
                    <td className="py-3 pr-4 font-semibold text-[#1C1C1A]">{formatPKR(order.total)}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-medium ${STATUS_COLORS[order.orderStatus] || 'text-gray-700 bg-gray-50'}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-[#A59A8A]">{new Date(order.createdAt).toLocaleDateString('en-PK')}</td>
                    <td className="py-3">
                      <Link to={`/admin/orders/${order._id}`} className="text-[#9A7955] hover:underline">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
