import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { registerUser } from '../../store/authSlice';
import { mergeGuestCartThunk } from '../../store/cartSlice';
import { setToast } from '../../store/uiSlice';

const registerSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Valid email address is required'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
    }));
    if (registerUser.fulfilled.match(result)) {
      const guestId = localStorage.getItem('zasas_guest_id');
      if (guestId) await dispatch(mergeGuestCartThunk(guestId));
      dispatch(setToast({ message: 'Welcome to ZASAS. Your account has been created.', type: 'success' }));
      navigate('/account');
    }
  };

  return (
    <div className="min-h-[80vh] flex">
      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1400')` }}
      >
        <div className="h-full bg-gradient-to-r from-[#1C1C1A]/60 to-transparent flex items-end p-16">
          <div className="text-white">
            <span className="font-serif text-4xl tracking-[0.2em] font-light block">ZASAS</span>
            <span className="text-xs tracking-[0.3em] text-[#D9C8BE] uppercase mt-1 block">Join The Atelier Circle</span>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#F8F5EF]">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7955] font-semibold block mb-2">New Membership</span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1C1A] font-light">Create Your Account</h1>
            <p className="text-xs text-[#A59A8A] mt-2">Join the ZASAS Atelier circle for exclusive trunk shows, bridal consultations, and early collection access.</p>
          </div>

          {error && <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs">{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-xs uppercase tracking-wider text-[#A59A8A] mb-1.5">Full Name *</label>
              <input id="name" type="text" autoComplete="name" {...register('name')}
                className="w-full p-3 text-sm border border-[#E7E3DC] bg-white focus:outline-none focus:border-[#9A7955]"
                placeholder="Your full name" />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-xs uppercase tracking-wider text-[#A59A8A] mb-1.5">Email Address *</label>
              <input id="reg-email" type="email" autoComplete="email" {...register('email')}
                className="w-full p-3 text-sm border border-[#E7E3DC] bg-white focus:outline-none focus:border-[#9A7955]"
                placeholder="your@email.com" />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs uppercase tracking-wider text-[#A59A8A] mb-1.5">Mobile Number (Optional)</label>
              <input id="phone" type="tel" autoComplete="tel" {...register('phone')}
                className="w-full p-3 text-sm border border-[#E7E3DC] bg-white focus:outline-none focus:border-[#9A7955]"
                placeholder="03XX-XXXXXXX" />
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-xs uppercase tracking-wider text-[#A59A8A] mb-1.5">Password *</label>
              <div className="relative">
                <input id="reg-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" {...register('password')}
                  className="w-full p-3 text-sm border border-[#E7E3DC] bg-white focus:outline-none focus:border-[#9A7955] pr-10"
                  placeholder="Minimum 6 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A59A8A]">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs uppercase tracking-wider text-[#A59A8A] mb-1.5">Confirm Password *</label>
              <input id="confirmPassword" type="password" autoComplete="new-password" {...register('confirmPassword')}
                className="w-full p-3 text-sm border border-[#E7E3DC] bg-white focus:outline-none focus:border-[#9A7955]"
                placeholder="Re-enter your password" />
              {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-[#1C1C1A] text-white text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#9A7955] transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
              <UserPlus size={16} />
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-[#A59A8A]">
            Already a patron?{' '}
            <Link to="/login" className="text-[#9A7955] font-medium hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
