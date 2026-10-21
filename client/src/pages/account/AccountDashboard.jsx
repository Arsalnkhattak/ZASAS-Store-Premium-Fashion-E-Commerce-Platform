import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Package,
  Heart,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Phone,
  MessageCircle,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import api from '../../services/api';
import { formatPKR } from '../../utils/currency';
import { BRAND_INFO } from '../../utils/constants';

const STATUS_STYLES = {
  pending: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-50 text-blue-800 border-blue-200',
  processing: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  dispatched: 'bg-purple-50 text-purple-800 border-purple-200',
  delivered: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  cancelled: 'bg-red-50 text-red-800 border-red-200',
};

export default function AccountDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my-orders')
      .then((res) => setOrders(res.data.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalOrders = orders.length;
  const inTransitOrders = orders.filter((o) => ['confirmed', 'processing', 'dispatched'].includes(o.orderStatus));
  const wishlistCount = user?.wishlist?.length || 0;
  const addressesCount = user?.addresses?.length || 0;
  const defaultAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* 1. Patron Status Banner */}
      <div className="bg-[#1C1C1A] text-white p-6 sm:p-8 border border-[#333330] relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#9A7955]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#9A7955] text-white flex items-center justify-center font-serif text-2xl font-light shadow-md">
              {user?.name?.charAt(0) || 'P'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-2xl text-[#F8F5EF]">{user?.name}</h2>
                <span className="px-2 py-0.5 text-[9px] uppercase tracking-widest bg-[#9A7955]/20 text-[#D9C8BE] border border-[#9A7955]/40 rounded-xs">
                  Gold Patron
                </span>
              </div>
              <p className="text-xs text-[#A59A8A] mt-0.5">{user?.email} • {user?.phone || 'No phone added'}</p>
              <p className="text-[10px] text-[#9A7955] uppercase tracking-wider mt-1.5 flex items-center gap-1.5 font-medium">
                <Sparkles size={12} />
                <span>ZASAS Atelier VIP Privilege Circle</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/account/profile"
              className="px-4 py-2 border border-white/20 text-[#F8F5EF] text-xs uppercase tracking-wider hover:border-white transition-colors text-center"
            >
              Edit Profile
            </Link>
            <a
              href={`https://wa.me/923008272727?text=Hello%20ZASAS%20VIP%20Concierge,%20I%20am%20${encodeURIComponent(user?.name || 'a patron')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#9A7955] text-white text-xs uppercase tracking-wider hover:bg-[#7D5F3F] transition-colors flex items-center justify-center gap-1.5"
            >
              <MessageCircle size={14} />
              <span>VIP Concierge</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/account/orders"
          className="bg-white border border-[#E7E3DC] p-5 hover:border-[#9A7955] transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-[#A59A8A] font-medium">Total Orders</span>
            <Package size={18} className="text-[#9A7955] group-hover:scale-110 transition-transform" />
          </div>
          <p className="font-serif text-2xl font-semibold text-[#1C1C1A] mt-2">
            {loading ? '-' : totalOrders}
          </p>
          <span className="text-[10px] text-[#A59A8A] mt-1 block">Full order archive</span>
        </Link>

        <Link
          to="/account/orders"
          className="bg-white border border-[#E7E3DC] p-5 hover:border-[#9A7955] transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-[#A59A8A] font-medium">Active Dispatches</span>
            <Truck size={18} className="text-purple-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="font-serif text-2xl font-semibold text-[#1C1C1A] mt-2">
            {loading ? '-' : inTransitOrders.length}
          </p>
          <span className="text-[10px] text-purple-600 font-medium mt-1 block">
            {inTransitOrders.length > 0 ? 'In fulfillment or transit' : 'No active parcels'}
          </span>
        </Link>

        <Link
          to="/wishlist"
          className="bg-white border border-[#E7E3DC] p-5 hover:border-[#9A7955] transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-[#A59A8A] font-medium">Curated Wishlist</span>
            <Heart size={18} className="text-red-500 group-hover:scale-110 transition-transform" />
          </div>
          <p className="font-serif text-2xl font-semibold text-[#1C1C1A] mt-2">
            {wishlistCount}
          </p>
          <span className="text-[10px] text-[#A59A8A] mt-1 block">Saved creations</span>
        </Link>

        <Link
          to="/account/addresses"
          className="bg-white border border-[#E7E3DC] p-5 hover:border-[#9A7955] transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-[#A59A8A] font-medium">Saved Addresses</span>
            <MapPin size={18} className="text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="font-serif text-2xl font-semibold text-[#1C1C1A] mt-2">
            {addressesCount}
          </p>
          <span className="text-[10px] text-[#A59A8A] mt-1 block">Pakistan destinations</span>
        </Link>
      </div>

      {/* 3. In-Transit Alert (if any active order) */}
      {inTransitOrders.length > 0 && (
        <div className="bg-[#F8F5EF] border border-[#9A7955]/40 p-5 rounded-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1C1C1A] uppercase tracking-wider">
            <Truck size={16} className="text-[#9A7955]" />
            <span>Active Parcel in Progress</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 border border-[#E7E3DC]">
            <div>
              <p className="font-mono text-xs font-bold text-[#1C1C1A]">
                Order {inTransitOrders[0].orderNumber}
              </p>
              <p className="text-xs text-[#4A4843] mt-0.5">
                Status: <strong className="capitalize text-[#9A7955]">{inTransitOrders[0].orderStatus}</strong> • Destination: {inTransitOrders[0].shippingAddress?.city}
              </p>
            </div>
            <Link
              to={`/account/orders/${inTransitOrders[0]._id}`}
              className="px-4 py-2 bg-[#1C1C1A] text-white text-xs uppercase tracking-wider text-center hover:bg-[#9A7955] transition-colors"
            >
              Track Status
            </Link>
          </div>
        </div>
      )}

      {/* 4. Recent Orders Section */}
      <div className="bg-white border border-[#E7E3DC] p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E7E3DC]">
          <div>
            <h3 className="font-serif text-xl text-[#1C1C1A]">Recent Acquisitions</h3>
            <p className="text-xs text-[#A59A8A]">Your most recent couture & pret orders</p>
          </div>
          <Link
            to="/account/orders"
            className="text-xs text-[#9A7955] uppercase tracking-wider hover:underline flex items-center gap-1 font-medium"
          >
            <span>View All ({totalOrders})</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2].map((n) => <div key={n} className="h-16 bg-[#E7E3DC]" />)}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <ShoppingBag size={28} className="mx-auto text-[#A59A8A]" />
            <p className="font-serif text-lg text-[#1C1C1A]">No Orders Placed Yet</p>
            <p className="text-xs text-[#A59A8A] max-w-sm mx-auto">
              Explore our collections across Men, Women, Kids, Horology, Footwear, and Haute Parfumerie.
            </p>
            <Link
              to="/shop"
              className="inline-block mt-2 px-6 py-2.5 bg-[#1C1C1A] text-white text-xs uppercase tracking-widest hover:bg-[#9A7955] transition-colors"
            >
              Discover Collections
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#E7E3DC]">
            {recentOrders.map((order) => (
              <div key={order._id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-[#1C1C1A]">
                      {order.orderNumber}
                    </span>
                    <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 border font-semibold ${STATUS_STYLES[order.orderStatus] || 'bg-gray-50'}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-xs text-[#A59A8A]">
                    {new Date(order.createdAt).toLocaleDateString('en-PK', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })} • {order.items?.length || 0} item{(order.items?.length || 0) === 1 ? '' : 's'} • {order.paymentMethod?.toUpperCase()}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="font-serif text-base font-semibold text-[#1C1C1A]">
                    {formatPKR(order.total)}
                  </span>
                  <Link
                    to={`/account/orders/${order._id}`}
                    className="px-3 py-1.5 border border-[#E7E3DC] hover:border-[#9A7955] text-xs text-[#1C1C1A] uppercase tracking-wider transition-colors"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Address Book Snapshot & Patron Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Default Delivery Address */}
        <div className="bg-white border border-[#E7E3DC] p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E3DC]">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#9A7955]" />
                <h4 className="font-serif text-base text-[#1C1C1A]">Primary Dispatch Destination</h4>
              </div>
              <Link to="/account/addresses" className="text-[11px] text-[#9A7955] uppercase tracking-wider hover:underline">
                Manage
              </Link>
            </div>

            {defaultAddress ? (
              <div className="mt-3 text-xs space-y-1 text-[#4A4843]">
                <p className="font-semibold text-[#1C1C1A] text-sm">{defaultAddress.recipientName}</p>
                <p>{defaultAddress.streetAddress}</p>
                {defaultAddress.apartment && <p>{defaultAddress.apartment}</p>}
                <p>{defaultAddress.city}, {defaultAddress.province} {defaultAddress.postalCode}</p>
                <p className="font-mono pt-1 text-[#A59A8A]">Tel: {defaultAddress.phone}</p>
              </div>
            ) : (
              <div className="mt-3 text-xs text-[#A59A8A]">
                <p>No default address saved yet.</p>
                <Link to="/account/addresses" className="text-[#9A7955] underline block mt-2">
                  Add Delivery Address
                </Link>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#E7E3DC] text-[11px] text-[#A59A8A] flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span>Nationwide Cash on Delivery (COD) pre-authorized</span>
          </div>
        </div>

        {/* VIP Patron Care */}
        <div className="bg-white border border-[#E7E3DC] p-6 space-y-4">
          <div className="pb-3 border-b border-[#E7E3DC]">
            <h4 className="font-serif text-base text-[#1C1C1A]">Personal Atelier Styling & Care</h4>
            <p className="text-xs text-[#A59A8A]">Direct assistance from our Karachi flagship showroom</p>
          </div>

          <div className="text-xs text-[#4A4843] space-y-2">
            <p className="flex items-center gap-2">
              <Phone size={14} className="text-[#9A7955]" />
              <span>Hotline: <strong>{BRAND_INFO.phone}</strong> (10 AM - 8 PM PKT)</span>
            </p>
            <p className="flex items-center gap-2">
              <MessageCircle size={14} className="text-[#9A7955]" />
              <span>WhatsApp Concierge: <strong>{BRAND_INFO.whatsapp}</strong></span>
            </p>
            <p className="text-[11px] text-[#A59A8A] pt-1">
              Need custom bridal measurements, bespoke tailoring advice, or express Lahore/Islamabad dispatches? Our concierge consultants are standing by.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/contact"
              className="text-xs text-[#9A7955] uppercase tracking-wider hover:underline font-medium"
            >
              Book Showroom Fitting & Appointment →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
