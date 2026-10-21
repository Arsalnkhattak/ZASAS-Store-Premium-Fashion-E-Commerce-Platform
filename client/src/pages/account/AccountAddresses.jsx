import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Plus, Trash2, Star } from 'lucide-react';
import api from '../../services/api';
import { fetchCurrentUser } from '../../store/authSlice';
import { setToast } from '../../store/uiSlice';
import { PAKISTAN_PROVINCES, MAJOR_PAKISTAN_CITIES } from '../../utils/constants';

const addressSchema = z.object({
  label: z.string().optional(),
  recipientName: z.string().min(2, 'Recipient name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  streetAddress: z.string().min(5, 'Street address is required'),
  apartment: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  province: z.string().min(2, 'Province is required'),
  postalCode: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export default function AccountAddresses() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(addressSchema),
  });

  const handleAddAddress = async (data) => {
    try {
      setLoading(true);
      await api.post('/auth/address', data);
      await dispatch(fetchCurrentUser());
      dispatch(setToast({ message: 'Address saved successfully.', type: 'success' }));
      setShowForm(false);
      reset();
    } catch (err) {
      dispatch(setToast({ message: err.message, type: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Remove this delivery address?')) return;
    try {
      await api.delete(`/auth/address/${addressId}`);
      await dispatch(fetchCurrentUser());
      dispatch(setToast({ message: 'Address removed.', type: 'success' }));
    } catch (err) {
      dispatch(setToast({ message: err.message, type: 'error' }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#E7E3DC]">
        <h2 className="font-serif text-2xl text-[#1C1C1A]">Saved Addresses</h2>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#1C1C1A] text-white text-xs uppercase tracking-wider hover:bg-[#9A7955] transition-colors"
        >
          <Plus size={14} />
          <span>Add Address</span>
        </button>
      </div>

      {/* Add Address Form */}
      {showForm && (
        <div className="bg-white border border-[#E7E3DC] p-6 animate-fade-in">
          <h3 className="font-serif text-lg text-[#1C1C1A] mb-5">New Delivery Address</h3>
          <form onSubmit={handleSubmit(handleAddAddress)} noValidate className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A59A8A] mb-1.5">Label (e.g. Home, Office)</label>
              <input type="text" {...register('label')}
                className="w-full p-2.5 text-sm border border-[#E7E3DC] bg-[#F8F5EF] focus:outline-none focus:border-[#9A7955]"
                placeholder="Home" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A59A8A] mb-1.5">Recipient Name *</label>
              <input type="text" {...register('recipientName')}
                className="w-full p-2.5 text-sm border border-[#E7E3DC] bg-[#F8F5EF] focus:outline-none focus:border-[#9A7955]" />
              {errors.recipientName && <p className="text-xs text-red-600 mt-1">{errors.recipientName.message}</p>}
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A59A8A] mb-1.5">Phone *</label>
              <input type="tel" {...register('phone')}
                className="w-full p-2.5 text-sm border border-[#E7E3DC] bg-[#F8F5EF] focus:outline-none focus:border-[#9A7955]"
                placeholder="03XX-XXXXXXX" />
              {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-[#A59A8A] mb-1.5">Street Address *</label>
              <input type="text" {...register('streetAddress')}
                className="w-full p-2.5 text-sm border border-[#E7E3DC] bg-[#F8F5EF] focus:outline-none focus:border-[#9A7955]" />
              {errors.streetAddress && <p className="text-xs text-red-600 mt-1">{errors.streetAddress.message}</p>}
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A59A8A] mb-1.5">City *</label>
              <select {...register('city')}
                className="w-full p-2.5 text-sm border border-[#E7E3DC] bg-[#F8F5EF] focus:outline-none focus:border-[#9A7955]">
                <option value="">Select City</option>
                {MAJOR_PAKISTAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city.message}</p>}
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A59A8A] mb-1.5">Province *</label>
              <select {...register('province')}
                className="w-full p-2.5 text-sm border border-[#E7E3DC] bg-[#F8F5EF] focus:outline-none focus:border-[#9A7955]">
                <option value="">Select Province</option>
                {PAKISTAN_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.province && <p className="text-xs text-red-600 mt-1">{errors.province.message}</p>}
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <input type="checkbox" id="isDefault" {...register('isDefault')} className="accent-[#9A7955]" />
              <label htmlFor="isDefault" className="text-xs text-[#A59A8A] cursor-pointer">
                Set as default delivery address
              </label>
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={loading}
                className="px-6 py-2.5 bg-[#1C1C1A] text-white text-xs uppercase tracking-widest hover:bg-[#9A7955] transition-colors disabled:opacity-60">
                {loading ? 'Saving...' : 'Save Address'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); reset(); }}
                className="px-6 py-2.5 border border-[#E7E3DC] text-xs uppercase tracking-widest hover:border-[#9A7955] transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address Cards */}
      {user?.addresses?.length === 0 ? (
        <div className="bg-white border border-[#E7E3DC] p-10 text-center">
          <MapPin size={28} className="mx-auto text-[#A59A8A] mb-3" strokeWidth={1.5} />
          <p className="font-serif text-lg text-[#1C1C1A]">No Saved Addresses</p>
          <p className="text-xs text-[#A59A8A] mt-1">Add a delivery address to speed up future checkouts.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {user.addresses.map((addr) => (
            <div key={addr._id} className={`bg-white border p-5 relative ${addr.isDefault ? 'border-[#9A7955]' : 'border-[#E7E3DC]'}`}>
              {addr.isDefault && (
                <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#9A7955] font-semibold">
                  <Star size={11} fill="#9A7955" />
                  <span>Default</span>
                </div>
              )}
              <div className="pr-16 space-y-1 text-xs text-[#1C1C1A]">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[10px] uppercase tracking-wider bg-[#E7E3DC] px-2 py-0.5 font-medium text-[#A59A8A]">
                    {addr.label || 'Address'}
                  </span>
                </div>
                <p className="font-semibold text-sm">{addr.recipientName}</p>
                <p className="text-[#A59A8A]">{addr.phone}</p>
                <p>{addr.streetAddress}</p>
                {addr.apartment && <p>{addr.apartment}</p>}
                <p>{addr.city}, {addr.province}</p>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteAddress(addr._id)}
                className="absolute bottom-4 right-4 p-1.5 text-[#A59A8A] hover:text-red-600 transition-colors"
                title="Remove address"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
