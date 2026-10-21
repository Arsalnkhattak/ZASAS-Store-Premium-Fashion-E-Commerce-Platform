import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useState } from 'react';
import { loginUser } from '../../store/authSlice';
import { mergeGuestCartThunk } from '../../store/cartSlice';
import { setToast } from '../../store/uiSlice';

const loginSchema = z.object({
  email: z.string().email('Valid email address is required'),
  password: z.string().min(1, 'Password is required'),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const redirectTo = new URLSearchParams(location.search).get('redirect') || '/account';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      const guestId = localStorage.getItem('zasas_guest_id');
      if (guestId) {
        await dispatch(mergeGuestCartThunk(guestId));
      }
      dispatch(setToast({ message: 'Welcome back to ZASAS Atelier.', type: 'success' }));
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    <div className="min-h-[80vh] flex">
      {/* Editorial Image Panel */}
      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1400')`,
        }}
      >
        <div className="h-full bg-gradient-to-r from-[#1C1C1A]/60 to-transparent flex items-end p-16">
          <div className="text-white">
            <span className="font-serif text-4xl tracking-[0.2em] font-light block">ZASAS</span>
            <span className="text-xs tracking-[0.3em] text-[#D9C8BE] uppercase mt-1 block">
              Haute Couture & Pret
            </span>
          </div>
        </div>
      </div>

      {/* Login Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#F8F5EF]">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7955] font-semibold block mb-2">
              Patron Access
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1C1A] font-light">
              Sign In to Your Account
            </h1>
            <p className="text-xs text-[#A59A8A] mt-2">
              Access your order archive, wishlist, and saved addresses.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-wider text-[#A59A8A] mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className="w-full p-3 text-sm border border-[#E7E3DC] bg-white focus:outline-none focus:border-[#9A7955] transition-colors"
                placeholder="your@email.com"
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs uppercase tracking-wider text-[#A59A8A]">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-[#9A7955] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password')}
                  className="w-full p-3 text-sm border border-[#E7E3DC] bg-white focus:outline-none focus:border-[#9A7955] transition-colors pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A59A8A] hover:text-[#1C1C1A]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#1C1C1A] text-white text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#9A7955] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <LogIn size={16} />
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-[#A59A8A]">
            New to ZASAS Atelier?{' '}
            <Link to="/register" className="text-[#9A7955] font-medium hover:underline">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
