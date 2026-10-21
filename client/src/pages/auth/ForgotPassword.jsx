import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import api from '../../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [devToken, setDevToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      setLoading(true);
      const res = await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
      if (res.data.devToken) setDevToken(res.data.devToken);
    } catch (err) {
      setSubmitted(true); // Always show success to prevent enumeration
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md bg-white border border-[#E7E3DC] p-10">
        <Link to="/login" className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#A59A8A] hover:text-[#9A7955] mb-8">
          <ArrowLeft size={14} /><span>Back to Sign In</span>
        </Link>

        {submitted ? (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 bg-[#E7E3DC] rounded-full flex items-center justify-center mx-auto">
              <Mail size={24} className="text-[#9A7955]" />
            </div>
            <h1 className="font-serif text-2xl text-[#1C1C1A]">Check Your Inbox</h1>
            <p className="text-xs text-[#A59A8A] leading-relaxed">
              If an account exists for <strong>{email}</strong>, a password reset link has been dispatched to your inbox.
            </p>
            {devToken && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs text-left">
                <p className="font-semibold">Development Mode — Reset Token:</p>
                <p className="font-mono mt-1 break-all">{devToken}</p>
                <p className="mt-2">Use <Link to={`/reset-password?token=${devToken}`} className="underline text-amber-900">this link</Link> to reset your password.</p>
              </div>
            )}
            <Link to="/login" className="block mt-4 text-xs text-[#9A7955] hover:underline">Return to Sign In</Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7955] font-semibold block mb-2">Account Recovery</span>
              <h1 className="font-serif text-3xl text-[#1C1C1A] font-light">Reset Your Password</h1>
              <p className="text-xs text-[#A59A8A] mt-2">Enter your registered email address and we'll send you a secure reset link.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="forgot-email" className="block text-xs uppercase tracking-wider text-[#A59A8A] mb-1.5">Email Address</label>
                <input id="forgot-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full p-3 text-sm border border-[#E7E3DC] bg-[#F8F5EF] focus:outline-none focus:border-[#9A7955]"
                  placeholder="your@email.com" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-[#1C1C1A] text-white text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#9A7955] transition-colors disabled:opacity-60">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
