import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import api from '../../services/api';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await api.post('/auth/reset-password', { token, newPassword });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.message || 'Reset token is invalid or has expired. Request a new reset link.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-md">
          <h2 className="font-serif text-2xl text-[#1C1C1A]">Invalid Reset Link</h2>
          <p className="text-xs text-[#A59A8A] mt-2">This reset link is missing the required token.</p>
          <Link to="/forgot-password" className="mt-4 inline-block text-xs text-[#9A7955] hover:underline">
            Request a New Reset Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md bg-white border border-[#E7E3DC] p-10">
        {success ? (
          <div className="text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
              <KeyRound size={24} className="text-emerald-600" />
            </div>
            <h1 className="font-serif text-2xl text-[#1C1C1A]">Password Updated</h1>
            <p className="text-xs text-[#A59A8A]">Your password has been reset. Redirecting to sign in...</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7955] font-semibold block mb-2">Secure Reset</span>
              <h1 className="font-serif text-3xl text-[#1C1C1A] font-light">Set New Password</h1>
            </div>

            {error && <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 text-xs">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="new-pass" className="block text-xs uppercase tracking-wider text-[#A59A8A] mb-1.5">New Password</label>
                <input id="new-pass" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
                  className="w-full p-3 text-sm border border-[#E7E3DC] bg-[#F8F5EF] focus:outline-none focus:border-[#9A7955]"
                  placeholder="Minimum 6 characters" />
              </div>
              <div>
                <label htmlFor="confirm-pass" className="block text-xs uppercase tracking-wider text-[#A59A8A] mb-1.5">Confirm New Password</label>
                <input id="confirm-pass" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                  className="w-full p-3 text-sm border border-[#E7E3DC] bg-[#F8F5EF] focus:outline-none focus:border-[#9A7955]"
                  placeholder="Re-enter new password" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-[#1C1C1A] text-white text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#9A7955] transition-colors disabled:opacity-60">
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
