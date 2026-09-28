import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, AlertCircle, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { LoginIllustration } from '@/components/auth/LoginIllustration';
import { LoginBackgroundPattern } from '@/components/auth/LoginBackgroundPattern';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'john@example.com',
      password: 'password',
      remember: false,
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center pt-20 sm:pt-24 lg:pt-16 pb-6 sm:pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden">

      {/* Dynamic Dark Road Map & Orange Ambient Glow Background */}
      <LoginBackgroundPattern />

      {/* Main Content Grid with Compact Proportions */}
      <div className="relative z-10 w-full max-w-[1020px] grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

        {/* Left: Elevated White Form Card */}
        <div className="lg:col-span-5 w-full flex justify-center lg:justify-end order-2 lg:order-1">
          <div className="w-full max-w-[360px] bg-white rounded-[22px] p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-white/80">

            {/* Header */}
            <div className="mb-4 sm:mb-5">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
                Login
              </h1>
              <p className="text-[12px] text-slate-400 mt-1 font-normal">
                Doesn't have an account yet?{' '}
                <Link
                  to="/signup"
                  className="text-[#FF5B26] hover:text-[#E04815] font-semibold underline underline-offset-2 transition-colors"
                >
                  Sign Up
                </Link>
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50/90 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg flex items-center gap-2 mb-3.5 animate-fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">

              {/* Email Address */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="you@example.com"
                    className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-200 ${errors.email
                      ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500'
                      : 'border-slate-200 focus:border-[#FF5B26] focus:ring-2 focus:ring-orange-200/60'
                      }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-[10px] mt-1 font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-700">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[11px] text-[#FF5B26] hover:text-[#E04815] font-medium transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="Enter 6 character or more"
                    className={`w-full px-3 pr-9 py-2 text-xs sm:text-sm rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-200 ${errors.password
                      ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500'
                      : 'border-slate-200 focus:border-[#FF5B26] focus:ring-2 focus:ring-orange-200/60'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-[10px] mt-1 font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember me */}
              <div className="flex items-center pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    {...register('remember')}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-[#FF5B26] focus:ring-orange-300 accent-[#FF5B26] cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-600 font-normal">
                    Remember me
                  </span>
                </label>
              </div>

              {/* Login Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-1.5 bg-[#FF5B26] hover:bg-[#E04815] active:bg-[#BC360B] text-white font-bold py-2.5 sm:py-3 px-4 rounded-lg tracking-wider text-[11px] uppercase shadow-md shadow-orange-500/25 hover:shadow-orange-500/35 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.99]"
              >
                {isSubmitting ? 'LOGGING IN...' : 'CONTINUE'}
              </button>
            </form>

          </div>
        </div>

        {/* Right: Modern Taxi Showcase with Compact Spotlight */}
        <div className="flex lg:col-span-7 flex-col items-center justify-center w-full h-full order-1 lg:order-2">
          <LoginIllustration />
        </div>

      </div>
    </div>
  );
}