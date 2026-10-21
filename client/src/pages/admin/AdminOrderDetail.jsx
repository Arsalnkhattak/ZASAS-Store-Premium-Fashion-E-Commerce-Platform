import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Clock,
  Printer,
  CheckCircle2,
  AlertTriangle,
  User,
  Phone,
  Mail,
  Truck,
} from 'lucide-react';
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

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data.order);
      setNewStatus(res.data.order.orderStatus);
      setPaymentStatus(res.data.order.paymentStatus);
    } catch (err) {
      setError(err.message || 'Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setSuccessMsg('');
    setError('');

    try {
      const res = await api.put(`/admin/orders/${id}/status`, {
        orderStatus: newStatus,
        paymentStatus,
        note: adminNote || `Status changed to ${newStatus}`,
      });
      setOrder(res.data.order);
      setAdminNote('');
      setSuccessMsg('Order record updated successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-[#E7E3DC] w-48" />
        <div className="h-64 bg-[#E7E3DC]" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-12 text-center bg-white border border-[#E7E3DC]">
        <h3 className="font-serif text-xl text-[#1C1C1A]">Order Record Not Found</h3>
        <p className="text-xs text-[#A59A8A] mt-2">{error || 'Unable to retrieve order details.'}</p>
        <Link
          to="/admin/orders"
          className="inline-block mt-4 px-5 py-2 bg-[#1C1C1A] text-white text-xs uppercase tracking-widest"
        >
          Return to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E3DC]">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/orders"
            className="p-2 border border-[#E7E3DC] bg-white text-[#1C1C1A] hover:bg-[#F8F5EF]"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-bold text-[#1C1C1A]">
                {order.orderNumber}
              </span>
              <span className="text-xs text-[#A59A8A]">•</span>
              <span className="text-xs text-[#A59A8A]">
                {new Date(order.createdAt).toLocaleString('en-PK', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#9A7955] font-semibold block mt-0.5">
              Atelier Order Dossier
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 border border-[#E7E3DC] bg-white text-[#1C1C1A] text-xs uppercase tracking-wider hover:bg-[#F8F5EF] transition-colors"
        >
          <Printer size={15} />
          <span>Print Packing Slip</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
          {successMsg}
        </div>
      )}

      {/* Grid: Main Info + Administrative Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Order Items & Customer Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Items */}
          <div className="bg-white border border-[#E7E3DC] p-6 space-y-4">
            <h3 className="font-serif text-lg text-[#1C1C1A] flex items-center gap-2">
              <Package size={18} className="text-[#9A7955]" />
              <span>Garments & Ensembles ({order.items?.length || 0})</span>
            </h3>

            <div className="divide-y divide-[#E7E3DC]">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                  <div className="w-16 h-20 bg-[#F8F5EF] border border-[#E7E3DC] overflow-hidden shrink-0">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-serif text-sm text-[#1C1C1A]">{item.name}</h4>
                    <p className="text-xs text-[#A59A8A] mt-0.5">
                      Size: <strong className="text-[#1C1C1A]">{item.size}</strong> | Color: <strong className="text-[#1C1C1A]">{item.color}</strong>
                    </p>
                    <p className="text-[11px] font-mono text-[#A59A8A] mt-0.5">SKU: {item.sku}</p>
                    <p className="text-xs text-[#1C1C1A] mt-1">
                      {formatPKR(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-serif font-semibold text-base text-[#1C1C1A]">
                      {formatPKR(item.subtotal)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Timeline */}
          <div className="bg-white border border-[#E7E3DC] p-6 space-y-4">
            <h3 className="font-serif text-lg text-[#1C1C1A] flex items-center gap-2">
              <Clock size={18} className="text-[#9A7955]" />
              <span>Fulfillment & Audit Timeline</span>
            </h3>

            <div className="space-y-4 border-l-2 border-[#E7E3DC] ml-2 pl-4">
              {order.statusHistory?.map((h, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-[#9A7955] border-2 border-white" />
                  <p className="text-xs uppercase font-semibold text-[#1C1C1A] tracking-wider">
                    {h.status}
                  </p>
                  <p className="text-xs text-[#4A4843] mt-0.5">{h.note}</p>
                  <p className="text-[10px] text-[#A59A8A] mt-0.5">
                    {new Date(h.timestamp).toLocaleString('en-PK')} • by {h.changedBy || 'System'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Customer Details, Financial Summary, Status Update */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status Update Card */}
          <div className="bg-white border border-[#E7E3DC] p-6 space-y-4">
            <h3 className="font-serif text-base text-[#1C1C1A] pb-2 border-b border-[#E7E3DC]">
              Manage Order Status
            </h3>

            <form onSubmit={handleUpdateStatus} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#A59A8A] font-semibold mb-1">
                  Order Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E7E3DC] bg-white font-medium"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#A59A8A] font-semibold mb-1">
                  Payment Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E7E3DC] bg-white font-medium"
                >
                  <option value="pending">PENDING</option>
                  <option value="paid">PAID</option>
                  <option value="failed">FAILED</option>
                  <option value="refunded">REFUNDED</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#A59A8A] font-semibold mb-1">
                  Audit / Courier Note
                </label>
                <textarea
                  rows={2}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="e.g. Courier tracking # TCS-998234 dispatched from Karachi hub..."
                  className="w-full px-3 py-1.5 border border-[#E7E3DC] bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full py-2 bg-[#1C1C1A] text-white text-xs uppercase tracking-widest hover:bg-[#9A7955] transition-colors"
              >
                {updating ? 'Updating...' : 'Commit Status'}
              </button>
            </form>
          </div>

          {/* Customer & Shipping Card */}
          <div className="bg-white border border-[#E7E3DC] p-6 space-y-4">
            <h3 className="font-serif text-base text-[#1C1C1A] pb-2 border-b border-[#E7E3DC] flex items-center gap-2">
              <MapPin size={16} className="text-[#9A7955]" />
              <span>Shipping & Patron Details</span>
            </h3>

            <div className="space-y-2 text-xs">
              <p className="font-semibold text-sm text-[#1C1C1A]">
                {order.shippingAddress?.fullName}
              </p>
              <div className="flex items-center gap-2 text-[#4A4843]">
                <Phone size={13} className="text-[#A59A8A]" />
                <a href={`tel:${order.shippingAddress?.phone}`} className="hover:underline">
                  {order.shippingAddress?.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-[#4A4843]">
                <Mail size={13} className="text-[#A59A8A]" />
                <span>{order.customerEmail}</span>
              </div>
              <p className="text-[#4A4843] pt-2 border-t border-[#E7E3DC]">
                {order.shippingAddress?.streetAddress}
                <br />
                {order.shippingAddress?.city}, {order.shippingAddress?.province}{' '}
                {order.shippingAddress?.postalCode}
              </p>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-white border border-[#E7E3DC] p-6 space-y-3">
            <h3 className="font-serif text-base text-[#1C1C1A] pb-2 border-b border-[#E7E3DC]">
              Financial Ledger
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#4A4843]">
                <span>Item Subtotal:</span>
                <span>{formatPKR(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#4A4843]">
                <span>Delivery Logistics:</span>
                <span>{order.shippingFee === 0 ? 'Complimentary' : formatPKR(order.shippingFee)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promotion Discount:</span>
                  <span>- {formatPKR(order.discountAmount)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-[#E7E3DC] flex justify-between font-serif text-base font-semibold text-[#1C1C1A]">
                <span>Grand Total:</span>
                <span>{formatPKR(order.total)}</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-[#A59A8A] uppercase tracking-wider">
              Method: <strong>{order.paymentMethod?.toUpperCase()}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
