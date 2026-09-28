import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { LoginBackgroundPattern } from '@/components/auth/LoginBackgroundPattern';
import { api } from '@/services/api';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const response = await api.forgotpassword(email.trim());

      if (response?.success === false) {
        throw new Error(response?.message || 'Failed to send OTP for password reset.');
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error('Forgot password error:', err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to send password reset request. Please check your email and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center pt-20 sm:pt-24 lg:pt-20 pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <LoginBackgroundPattern />

      <div className="relative z-10 w-full max-w-[420px]">
        <div className="bg-white rounded-[26px] p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.45)] border border-white/80">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
              Reset Password
            </h1>
            <p className="text-xs sm:text-[13px] text-slate-400 mt-1.5 font-normal">
              Enter your registered email address and we'll send you an OTP to reset your password.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {submitted ? (
            <div className="space-y-4 animate-fade-in text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                OTP Sent Successfully!
              </p>
              <p className="text-xs text-slate-500">
                Please check your inbox at <span className="font-semibold text-slate-700">{email}</span> for the verification code.
              </p>
              <div className="pt-3 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/reset-password?email=${encodeURIComponent(email)}`)}
                  className="w-full bg-[#FF5B26] hover:bg-[#E04815] text-white font-bold py-2.5 px-4 rounded-xl tracking-wider text-xs uppercase shadow-md shadow-orange-500/25 transition-all duration-200"
                >
                  Enter OTP & Set Password
                </button>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold mt-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Login</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-[#FF5B26] hover:bg-[#E04815] active:bg-[#BC360B] text-white font-bold py-3 px-4 rounded-xl tracking-wider text-xs uppercase shadow-md shadow-orange-500/25 transition-all duration-200 disabled:opacity-60 active:scale-[0.99]"
              >
                {isLoading ? 'SENDING OTP...' : 'SEND OTP / RESET LINK'}
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
          )}
        </div>
      </div>
    </div>
  );
}