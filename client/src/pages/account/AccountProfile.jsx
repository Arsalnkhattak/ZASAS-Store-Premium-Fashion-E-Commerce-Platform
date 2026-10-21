import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, User } from 'lucide-react';
import api from '../../services/api';
import { fetchCurrentUser } from '../../store/authSlice';
import { setToast } from '../../store/uiSlice';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function AccountProfile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [savingProfile, setSavingProfile] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '', phone: user?.phone || '' },
  });

  const onSaveProfile = async (data) => {
    try {
      setSavingProfile(true);
      await api.put('/auth/profile', data);
      await dispatch(fetchCurrentUser());
      dispatch(setToast({ message: 'Profile updated successfully.', type: 'success' }));
    } catch (err) {
      dispatch(setToast({ message: err.message, type: 'error' }));
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Card */}
      <div className="bg-white border border-[#E7E3DC] p-6 sm:p-8">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#E7E3DC]">
          <div className="w-16 h-16 rounded-full bg-[#1C1C1A] text-[#F8F5EF] flex items-center justify-center font-serif text-2xl">
            {user?.name?.charAt(0) || 'P'}
          </div>
          <div>
            <h2 className="font-serif text-xl text-[#1C1C1A]">{user?.name}</h2>
            <p className="text-xs text-[#A59A8A]">{user?.email}</p>
            <span className="text-[10px] uppercase tracking-wider text-[#9A7955] font-medium">
              {user?.role === 'admin' ? 'Atelier Director' : 'Valued Patron'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-5">
          <h3 className="text-xs uppercase tracking-widest font-semibold text-[#1C1C1A]">Personal Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="profile-name" className="block text-xs uppercase tracking-wider text-[#A59A8A] mb-1.5">Full Name</label>
              <input id="profile-name" type="text" {...register('name')}
                className="w-full p-2.5 text-sm border border-[#E7E3DC] bg-[#F8F5EF] focus:outline-none focus:border-[#9A7955]" />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A59A8A] mb-1.5">Email Address</label>
              <input type="email" value={user?.email} disabled
                className="w-full p-2.5 text-sm border border-[#E7E3DC] bg-[#E7E3DC]/50 text-[#A59A8A] cursor-not-allowed" />
              <p className="text-[10px] text-[#A59A8A] mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label htmlFor="profile-phone" className="block text-xs uppercase tracking-wider text-[#A59A8A] mb-1.5">Mobile Number</label>
              <input id="profile-phone" type="tel" {...register('phone')}
                className="w-full p-2.5 text-sm border border-[#E7E3DC] bg-[#F8F5EF] focus:outline-none focus:border-[#9A7955]"
                placeholder="03XX-XXXXXXX" />
            </div>
          </div>

          <button type="submit" disabled={savingProfile}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1C1C1A] text-white text-xs uppercase tracking-widest hover:bg-[#9A7955] transition-colors disabled:opacity-60">
            <Save size={14} />
            <span>{savingProfile ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </form>
      </div>

      {/* Account Info Summary */}
      <div className="bg-[#E7E3DC]/30 border border-[#E7E3DC] p-6">
        <h3 className="text-xs uppercase tracking-widest font-semibold text-[#A59A8A] mb-3">Patron Registry Details</h3>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[#A59A8A] block">Member Since</span>
            <span className="text-[#1C1C1A] font-medium">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-[#A59A8A] block">Wishlist Items</span>
            <span className="text-[#1C1C1A] font-medium">{user?.wishlist?.length || 0} saved pieces</span>
          </div>
          <div>
            <span className="text-[#A59A8A] block">Market</span>
            <span className="text-[#1C1C1A] font-medium">Pakistan (PKR)</span>
          </div>
          <div>
            <span className="text-[#A59A8A] block">Account Status</span>
            <span className="text-emerald-700 font-medium">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
