import React, { useEffect, useState } from 'react';
import { Ticket, Plus, Trash2, Calendar, Tag, CheckCircle2, X } from 'lucide-react';
import api from '../../services/api';
import { formatPKR } from '../../utils/currency';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 5000,
    maxDiscount: '',
    usageLimit: '',
    endDate: '',
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/coupons');
      setCoupons(res.data.coupons || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Delete coupon promotion "${code}"?`)) return;
    try {
      await api.delete(`/admin/coupons/${id}`);
      setCoupons(coupons.filter((c) => c._id !== id));
      setSuccess(`Coupon ${code} removed.`);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        code: formData.code.toUpperCase().trim(),
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        minOrderAmount: parseFloat(formData.minOrderAmount) || 0,
        maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit, 10) : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        isActive: formData.isActive,
      };

      await api.post('/admin/coupons', payload);
      setSuccess(`Coupon code "${payload.code}" published.`);
      setModalOpen(false);
      setFormData({
        code: '',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 5000,
        maxDiscount: '',
        usageLimit: '',
        endDate: '',
        isActive: true,
      });
      fetchCoupons();
    } catch (err) {
      setError(err.message || 'Failed to create coupon');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E3DC]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7955] font-semibold block">
            Promotions & Incentives
          </span>
          <h1 className="font-serif text-3xl text-[#1C1C1A] mt-0.5">
            Promotional Coupons ({coupons.length})
          </h1>
        </div>

        <button
          type="button"
          onClick={() => {
            setError('');
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1C1C1A] text-white text-xs uppercase tracking-widest hover:bg-[#9A7955] transition-colors"
        >
          <Plus size={15} />
          <span>New Coupon</span>
        </button>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess('')}><X size={14} /></button>
        </div>
      )}

      {/* Grid of Coupons */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-40 bg-[#E7E3DC]" />
          ))}
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-white border border-[#E7E3DC] p-12 text-center text-[#A59A8A]">
          <Ticket size={28} className="mx-auto mb-2 text-[#9A7955]" />
          <p className="text-xs">No active promotion vouchers.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((coupon) => (
            <div
              key={coupon._id}
              className="bg-white border border-[#E7E3DC] p-5 flex flex-col justify-between hover:border-[#9A7955] transition-colors relative group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-base font-bold text-[#1C1C1A] tracking-wider px-2 py-0.5 bg-[#F8F5EF] border border-[#E7E3DC]">
                      {coupon.code}
                    </span>
                    <p className="text-xs font-semibold text-[#9A7955] mt-2">
                      {coupon.discountType === 'percentage'
                        ? `${coupon.discountValue}% OFF`
                        : `${formatPKR(coupon.discountValue)} OFF`}
                    </p>
                  </div>

                  <span
                    className={`text-[9px] uppercase tracking-wider px-2 py-0.5 font-medium ${
                      coupon.isActive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {coupon.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <div className="mt-4 space-y-1 text-[11px] text-[#A59A8A]">
                  <p>
                    Min Order: <strong className="text-[#1C1C1A]">{formatPKR(coupon.minOrderAmount || 0)}</strong>
                  </p>
                  {coupon.maxDiscount && (
                    <p>
                      Max Discount Cap: <strong className="text-[#1C1C1A]">{formatPKR(coupon.maxDiscount)}</strong>
                    </p>
                  )}
                  {coupon.usageLimit && (
                    <p>
                      Usage: <strong className="text-[#1C1C1A]">{coupon.usedCount || 0} / {coupon.usageLimit}</strong>
                    </p>
                  )}
                  {coupon.endDate && (
                    <p className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>Expires: {new Date(coupon.endDate).toLocaleDateString('en-PK')}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E7E3DC] flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-[#A59A8A]">
                  {coupon.usedCount || 0} Redemptions
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(coupon._id, coupon.code)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Delete Coupon"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7E3DC] max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E3DC]">
              <h3 className="font-serif text-xl text-[#1C1C1A]">Create Promotion Code</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-[#A59A8A] hover:text-[#1C1C1A]"
              >
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium mb-1">
                  Coupon Code * (e.g. EID2026, WELCOME10)
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="EID2026"
                  className="w-full px-3 py-2 border border-[#E7E3DC] bg-white font-mono uppercase focus:outline-none focus:border-[#9A7955]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E7E3DC] bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (PKR ₨)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E7E3DC] bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium mb-1">
                    Min Order (PKR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E7E3DC] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium mb-1">
                    Max Cap (PKR, optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    placeholder="e.g. 5000"
                    className="w-full px-3 py-2 border border-[#E7E3DC] bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium mb-1">
                    Usage Limit (optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    placeholder="e.g. 100"
                    className="w-full px-3 py-2 border border-[#E7E3DC] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E7E3DC] bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-[#9A7955]"
                />
                <label htmlFor="isActive" className="text-xs text-[#1C1C1A] cursor-pointer">
                  Activate Code Immediately
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E7E3DC]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-[#E7E3DC] text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-[#1C1C1A] text-white text-xs uppercase tracking-widest hover:bg-[#9A7955] transition-colors"
                >
                  {submitting ? 'Creating...' : 'Create Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
