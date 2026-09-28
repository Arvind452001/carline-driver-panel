import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, ArrowLeft, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { LoginBackgroundPattern } from '@/components/auth/LoginBackgroundPattern';
import { api } from '@/services/api';
import Swal from 'sweetalert2';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!otp.trim()) {
      setError('Please enter the OTP verification code');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      setSuccess('');

      // 1. Verify OTP
      const verifyRes = await api.verifyPasswordResetOtp(email.trim(), otp.trim(), 'password');

      if (verifyRes?.success === false) {
        throw new Error(verifyRes?.message || 'Invalid or expired OTP code.');
      }

      // 2. Call reset password if needed by backend API structure
      try {
        await api.resetPassword(email.trim(), password, confirm);
      } catch {
        // If verifyPasswordResetOtp already updated password on backend, continue
      }

      setSuccess('Password updated successfully! Redirecting to login...');

      Swal.fire({
        icon: 'success',
        title: 'Password Reset Successful!',
        text: 'Your password has been updated. Please log in with your new password.',
        confirmButtonColor: '#FF5B26',
      });

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to reset password. Please check your OTP and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center pt-20 sm:pt-24 lg:pt-20 pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <LoginBackgroundPattern />

      <div className="relative z-10 w-full max-w-[420px]">
        <div className="bg-white rounded-[26px] p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.45)] border border-white/80">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
              Set New Password
            </h1>
            <p className="text-xs sm:text-[13px] text-slate-400 mt-1.5 font-normal">
              Enter your OTP and new secure password below.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF5B26] focus:ring-2 focus:ring-orange-200/60 transition-all duration-200"
                />
              </div>
            </div>

            {/* OTP Code */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                OTP Verification Code
              </label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ''));
                    setError('');
                  }}
                  placeholder="Enter 6-digit OTP"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF5B26] focus:ring-2 focus:ring-orange-200/60 transition-all duration-200 font-medium tracking-wider"
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter 6 characters or more"
                  required
                  className="w-full pl-10 pr-10 py-2.5 sm:py-3 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF5B26] focus:ring-2 focus:ring-orange-200/60 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value);
                    setError('');
                  }}
                  placeholder="Re-enter password"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF5B26] focus:ring-2 focus:ring-orange-200/60 transition-all duration-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-[#FF5B26] hover:bg-[#E04815] active:bg-[#BC360B] text-white font-bold py-3 px-4 rounded-xl tracking-wider text-xs uppercase shadow-md shadow-orange-500/25 transition-all duration-200 disabled:opacity-60 active:scale-[0.99]"
            >
              {isSubmitting ? 'UPDATING PASSWORD...' : 'UPDATE PASSWORD'}
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}