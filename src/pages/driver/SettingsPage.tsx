import { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  ShieldCheck,
  Smartphone,
  X,
} from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import Swal from 'sweetalert2';

type PasswordStep =
  | 'otp'
  | 'password';

export function SettingsPage() {
  const { user } = useAuth();

  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  const [emailNotif, setEmailNotif] =
    useState(true);

  const [pushNotif, setPushNotif] =
    useState(false);

  // ==========================================
  // PASSWORD MODAL
  // ==========================================

  const [showPasswordModal, setShowPasswordModal] =
    useState(false);

  const [passwordStep, setPasswordStep] =
    useState<PasswordStep>('otp');

  // ==========================================
  // EMAIL
  // ==========================================

  const [resetEmail, setResetEmail] =
    useState('');

  // ==========================================
  // OTP
  // ==========================================

  const [otp, setOtp] =
    useState('');

  const [isSendingOtp, setIsSendingOtp] =
    useState(false);

  const [isVerifyingOtp, setIsVerifyingOtp] =
    useState(false);

  const [isResendingOtp, setIsResendingOtp] =
    useState(false);

  const [otpVerified, setOtpVerified] =
    useState(false);

  // ==========================================
  // PASSWORD
  // ==========================================

  const [password, setPassword] =
    useState('');

  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [isResettingPassword, setIsResettingPassword] =
    useState(false);

  // ==========================================
  // GENERAL
  // ==========================================

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  const [isLoggingOutAll, setIsLoggingOutAll] =
    useState(false);

  // ==========================================
  // USER EMAIL
  // ==========================================

const getUserEmail = (): string => {
  if (user?.email) {
    return user.email;
  }
  const directEmail = localStorage.getItem('email');
  if (directEmail) {
    return directEmail;
  }
  try {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      const email =
        parsed?.email ||
        parsed?.data?.email ||
        parsed?.user?.email;
      if (email) return email;
    }
  } catch (e) {
    console.error('Error parsing user from localStorage:', e);
  }
  return '';
};

const userEmail = getUserEmail();

  // ==========================================
  // OPEN CHANGE PASSWORD
  // ==========================================

  const handleOpenPasswordModal = async () => {
    setError('');
    setSuccess('');

    setOtp('');
    setPassword('');
    setConfirmPassword('');

    setOtpVerified(false);
    setPasswordStep('otp');

    let currentEmail = getUserEmail();

    if (!currentEmail) {
      try {
        setIsSendingOtp(true);
        const profileRes = await api.getDriverProfile();
        const profileData = profileRes?.data || profileRes;
        currentEmail = profileData?.email || profileData?.data?.email || '';

        if (currentEmail) {
          localStorage.setItem('email', currentEmail);
          const savedUser = localStorage.getItem('user');
          const userObj = savedUser ? JSON.parse(savedUser) : {};
          userObj.email = currentEmail;
          localStorage.setItem('user', JSON.stringify(userObj));
        }
      } catch (err) {
        console.error('Failed to fetch profile email:', err);
      } finally {
        setIsSendingOtp(false);
      }
    }

    setResetEmail(currentEmail);
    setShowPasswordModal(true);

    if (currentEmail) {
      await sendOtp(currentEmail);
    } else {
      setError(
        'Email address is not available. Please check your profile or log in again.'
      );
    }
  };

  // ==========================================
  // SEND OTP
  // ==========================================

 const sendOtp = async (email: string) => {
  try {
    setIsSendingOtp(true);
    setError('');
    setSuccess('');

    const response = await api.forgotpassword(email);

    if (!response?.success) {
      throw new Error(
        response?.message || 'Failed to send OTP.'
      );
    }

    setSuccess(
      'OTP sent successfully. Please check your email for the OTP.'
    );
  } catch (err: any) {
    setError(
      err?.response?.data?.message ||
        err?.message ||
        'Unable to send OTP. Please try again.'
    );
  } finally {
    setIsSendingOtp(false);
  }
};

  // ==========================================
  // VERIFY OTP
  // ==========================================

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setError('Please enter the OTP.');
      return;
    }

    if (otp.trim().length < 4) {
      setError('Please enter a valid OTP.');
      return;
    }

    try {
      setIsVerifyingOtp(true);
      setError('');
      setSuccess('');

      const response =
        await api.verifyPasswordResetOtp(
          resetEmail,
          otp.trim(),
          'password'
        );

      console.log(
        'Verify OTP response:',
        response
      );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            'Invalid OTP.'
        );
      }

      setOtpVerified(true);

      setPasswordStep('password');

      setSuccess(
        'OTP verified successfully. You can now create a new password.'
      );
    } catch (err: any) {
      console.error(
        'Verify OTP error:',
        err
      );

      setOtpVerified(false);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Invalid or expired OTP. Please try again.'
      );
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // ==========================================
  // RESEND OTP
  // ==========================================

  const handleResendOtp = async () => {
    if (!resetEmail) {
      setError(
        'Email address is not available.'
      );
      return;
    }

    try {
      setIsResendingOtp(true);
      setError('');
      setSuccess('');

      const response =
        await api.forgotpassword(
          resetEmail
        );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            'Failed to resend OTP.'
        );
      }

      setOtp('');

      setSuccess(
        'A new OTP has been sent. Please check your email.'
      );
    } catch (err: any) {
      console.error(
        'Resend OTP error:',
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Unable to resend OTP.'
      );
    } finally {
      setIsResendingOtp(false);
    }
  };

  // ==========================================
  // RESET PASSWORD
  // ==========================================

  const handleResetPassword = async () => {
    setError('');
    setSuccess('');

    if (!password) {
      setError(
        'Please enter a new password.'
      );
      return;
    }

    if (password.length < 8) {
      setError(
        'Password must be at least 8 characters.'
      );
      return;
    }

    if (!confirmPassword) {
      setError(
        'Please confirm your password.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        'Passwords do not match.'
      );
      return;
    }

    if (!otpVerified) {
      setError(
        'Please verify the OTP first.'
      );
      return;
    }

    try {
      setIsResettingPassword(true);

      const response =
        await api.resetPassword(
          resetEmail,
          password,
          confirmPassword
        );

      console.log(
        'Reset password response:',
        response
      );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            'Failed to reset password.'
        );
      }

      setSuccess(
        'Password changed successfully.'
      );

      setPassword('');
      setConfirmPassword('');

      Swal.fire({
        icon: 'success',
        title: 'Password Updated!',
        text: 'Your password has been changed successfully.',
        confirmButtonColor: '#FF5B26',
      });

      // Close after short delay
      setTimeout(() => {
        setShowPasswordModal(false);
        setSuccess('');
        setError('');
      }, 1200);
    } catch (err: any) {
      console.error(
        'Reset password error:',
        err
      );

      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Unable to reset password. Please try again.';

      setError(msg);

      Swal.fire({
        icon: 'error',
        title: 'Password Reset Failed',
        text: msg,
        confirmButtonColor: '#FF5B26',
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  // ==========================================
  // CLOSE PASSWORD MODAL
  // ==========================================

  const closePasswordModal = () => {
    if (
      isSendingOtp ||
      isVerifyingOtp ||
      isResettingPassword
    ) {
      return;
    }

    setShowPasswordModal(false);

    setOtp('');
    setPassword('');
    setConfirmPassword('');

    setError('');
    setSuccess('');

    setOtpVerified(false);

    setPasswordStep('otp');
  };

  // ==========================================
  // LOGOUT ALL DEVICES
  // ==========================================

  const handleLogoutAllDevices = async () => {
    const confirmResult = await Swal.fire({
      title: 'Logout All Devices?',
      text: 'Are you sure you want to log out from all other devices?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF5B26',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Logout All',
    });

    if (!confirmResult.isConfirmed) return;

    try {
      setIsLoggingOutAll(true);
      setError('');
      setSuccess('');

      const response =
        await api.logoutAllDevices();

      if (!response?.success) {
        throw new Error(
          response?.message ||
            'Failed to logout from all devices.'
        );
      }

      setSuccess(
        'You have been logged out from all other devices.'
      );

      Swal.fire({
        icon: 'success',
        title: 'Logged Out All Devices',
        text: 'You have been successfully logged out from all other devices.',
        confirmButtonColor: '#FF5B26',
      });
    } catch (err: any) {
      console.error(
        'Logout all devices error:',
        err
      );

      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Unable to logout from all devices.';

      setError(msg);

      Swal.fire({
        icon: 'error',
        title: 'Logout Failed',
        text: msg,
        confirmButtonColor: '#FF5B26',
      });
    } finally {
      setIsLoggingOutAll(false);
    }
  };

  return (
    <>
      {/* ==================================================
          MAIN SETTINGS PAGE
      ================================================== */}

      <div className="space-y-6 pb-8">

        {/* Header */}

        <div>
          <p className="mb-1 text-sm font-medium text-primary-500">
            Account Settings
          </p>

          <h2 className="text-2xl font-bold text-navy">
            Settings
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage your account, notifications and
            security preferences.
          </p>
        </div>

        {/* =================================================
            GLOBAL SUCCESS
        ================================================= */}

        {success && !showPasswordModal && (
          <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

            <p className="text-sm font-medium text-emerald-700">
              {success}
            </p>
          </div>
        )}

        {/* =================================================
            GLOBAL ERROR
        ================================================= */}

        {error && !showPasswordModal && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* =================================================
            ACCOUNT
        ================================================= */}

        <div className="card overflow-hidden">

          <div className="mb-5 flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <KeyRound className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Account
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Manage your account and password.
              </p>
            </div>

          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-3">

                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                  <Lock className="h-4 w-4 text-gray-600" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Password
                  </p>

                  <p className="mt-0.5 text-xs text-gray-500">
                    Change your password securely using email OTP verification.
                  </p>

                  {userEmail && (
                    <p className="mt-1 text-xs font-medium text-gray-600">
                      Recovery email: {userEmail}
                    </p>
                  )}
                </div>

              </div>

              <button
                type="button"
                onClick={handleOpenPasswordModal}
                className="btn-secondary inline-flex shrink-0 items-center justify-center gap-2"
              >
                <KeyRound className="h-4 w-4" />
                Change Password
              </button>

            </div>

          </div>
        </div>

        {/* =================================================
            NOTIFICATIONS
        ================================================= */}

        <div className="card">

          <div className="mb-5 flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Bell className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Notifications
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Choose how you want to receive notifications.
              </p>
            </div>

          </div>

          <div className="divide-y divide-gray-100 rounded-xl border border-gray-100">

            {/* Email */}

            <div className="flex items-center justify-between gap-4 p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Mail className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Email Notifications
                  </p>

                  <p className="text-xs text-gray-500">
                    Receive important updates by email.
                  </p>
                </div>

              </div>

              <button
                type="button"
                role="switch"
                aria-checked={emailNotif}
                onClick={() =>
                  setEmailNotif(
                    (prev) => !prev
                  )
                }
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  emailNotif
                    ? 'bg-primary-500'
                    : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                    emailNotif
                      ? 'left-6'
                      : 'left-1'
                  }`}
                />
              </button>

            </div>

            {/* Push */}

            <div className="flex items-center justify-between gap-4 p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                  <Smartphone className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Push Notifications
                  </p>

                  <p className="text-xs text-gray-500">
                    Receive alerts directly on your device.
                  </p>
                </div>

              </div>

              <button
                type="button"
                role="switch"
                aria-checked={pushNotif}
                onClick={() =>
                  setPushNotif(
                    (prev) => !prev
                  )
                }
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  pushNotif
                    ? 'bg-primary-500'
                    : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                    pushNotif
                      ? 'left-6'
                      : 'left-1'
                  }`}
                />
              </button>

            </div>

          </div>
        </div>

        {/* =================================================
            SECURITY
        ================================================= */}

        <div className="card">

          <div className="mb-5 flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Security
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Manage your active sessions and account security.
              </p>
            </div>

          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-3">

                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                  <LogOut className="h-4 w-4 text-gray-600" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Logout from all devices
                  </p>

                  <p className="mt-0.5 text-xs text-gray-500">
                    Sign out of your account on all other devices.
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={
                  handleLogoutAllDevices
                }
                disabled={
                  isLoggingOutAll
                }
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoggingOutAll ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
                    Processing...
                  </>
                ) : (
                  <>
                    <LogOut className="h-4 w-4" />
                    Logout All Devices
                  </>
                )}
              </button>

            </div>

          </div>
        </div>

      </div>

      {/* ==================================================
          CHANGE PASSWORD MODAL
      ================================================== */}

      {showPasswordModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget
            ) {
              closePasswordModal();
            }
          }}
        >

          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* ============================================
                MODAL HEADER
            ============================================ */}

            <div className="border-b border-gray-100 px-5 py-4">

              <div className="flex items-start justify-between gap-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    {passwordStep === 'otp' ? (
                      <Mail className="h-5 w-5" />
                    ) : (
                      <Lock className="h-5 w-5" />
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">
                      {passwordStep === 'otp'
                        ? 'Verify Your Email'
                        : 'Create New Password'}
                    </h3>

                    <p className="mt-0.5 text-xs text-gray-500">
                      {passwordStep === 'otp'
                        ? 'Step 1 of 2'
                        : 'Step 2 of 2'}
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={
                    closePasswordModal
                  }
                  disabled={
                    isSendingOtp ||
                    isVerifyingOtp ||
                    isResettingPassword
                  }
                  className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
                >
                  <X className="h-5 w-5" />
                </button>

              </div>

              {/* Progress */}

              <div className="mt-4 flex gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-primary-500" />

                <div
                  className={`h-1.5 flex-1 rounded-full transition ${
                    passwordStep ===
                    'password'
                      ? 'bg-primary-500'
                      : 'bg-gray-200'
                  }`}
                />
              </div>

            </div>

            {/* ============================================
                MODAL BODY
            ============================================ */}

            <div className="space-y-5 p-5">

              {/* Error */}

              {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                  <p className="text-sm font-medium text-red-700">
                    {error}
                  </p>
                </div>
              )}

              {/* Success */}

              {success && (
                <div className="flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                  <p className="text-sm font-medium text-emerald-700">
                    {success}
                  </p>
                </div>
              )}

              {/* ==========================================
                  OTP STEP
              ========================================== */}

              {passwordStep ===
                'otp' && (
                <>
                  <div className="rounded-xl bg-primary-50/60 p-4">

                    <div className="flex items-start gap-3">

                      <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />

                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          Check your email for OTP
                        </p>

                        <p className="mt-1 text-xs leading-5 text-gray-600">
                          We've sent a verification code to
                        </p>

                        <p className="mt-1 break-all text-sm font-bold text-primary-600">
                          {resetEmail ||
                            'your registered email'}
                        </p>
                      </div>

                    </div>

                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Enter OTP
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => {
                        const value =
                          e.target.value.replace(
                            /\D/g,
                            ''
                          );

                        setOtp(value);
                        setError('');
                      }}
                      placeholder="Enter 6-digit OTP"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center text-lg font-bold tracking-[0.4em] outline-none transition focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">

                    <span className="text-gray-500">
                      Didn't receive OTP?
                    </span>

                    <button
                      type="button"
                      onClick={
                        handleResendOtp
                      }
                      disabled={
                        isResendingOtp ||
                        isSendingOtp
                      }
                      className="font-semibold text-primary-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isResendingOtp
                        ? 'Sending...'
                        : 'Resend OTP'}
                    </button>

                  </div>

                  <button
                    type="button"
                    onClick={
                      handleVerifyOtp
                    }
                    disabled={
                      isVerifyingOtp ||
                      otp.length < 4
                    }
                    className="btn-primary flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isVerifyingOtp ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4" />
                        Verify OTP
                      </>
                    )}
                  </button>
                </>
              )}

              {/* ==========================================
                  PASSWORD STEP
              ========================================== */}

              {passwordStep ===
                'password' && (
                <>
                  <div className="rounded-xl bg-emerald-50 p-4">

                    <div className="flex items-start gap-3">

                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                      <div>
                        <p className="text-sm font-semibold text-emerald-800">
                          Email verified
                        </p>

                        <p className="mt-1 text-xs text-emerald-700">
                          OTP verified successfully. Create your new password below.
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* Email - hidden from user but included in payload */}

                  <input
                    type="hidden"
                    value={resetEmail}
                    readOnly
                  />

                  {/* Password */}

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      New Password
                    </label>

                    <div className="relative">

                      <input
                        type={
                          showPassword
                            ? 'text'
                            : 'password'
                        }
                        value={password}
                        onChange={(e) => {
                          setPassword(
                            e.target.value
                          );
                          setError('');
                        }}
                        placeholder="Enter new password"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-11 text-sm outline-none transition focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (prev) =>
                              !prev
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>

                    </div>

                    <p className="mt-1.5 text-xs text-gray-500">
                      Password must be at least 8 characters.
                    </p>
                  </div>

                  {/* Confirm Password */}

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Confirm Password
                    </label>

                    <div className="relative">

                      <input
                        type={
                          showConfirmPassword
                            ? 'text'
                            : 'password'
                        }
                        value={
                          confirmPassword
                        }
                        onChange={(e) => {
                          setConfirmPassword(
                            e.target.value
                          );
                          setError('');
                        }}
                        placeholder="Confirm new password"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-11 text-sm outline-none transition focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (prev) =>
                              !prev
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>

                    </div>
                  </div>

                  {/* Password Match */}

                  {confirmPassword && (
                    <div
                      className={`rounded-lg px-3 py-2 text-xs font-medium ${
                        password ===
                        confirmPassword
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {password ===
                      confirmPassword
                        ? '✓ Passwords match'
                        : '✕ Passwords do not match'}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={
                      handleResetPassword
                    }
                    disabled={
                      isResettingPassword
                    }
                    className="btn-primary flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isResettingPassword ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Updating Password...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        Update Password
                      </>
                    )}
                  </button>
                </>
              )}

            </div>

          </div>
        </div>
      )}
    </>
  );
}