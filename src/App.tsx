import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { DriverLayout } from '@/layouts/DriverLayout';
import { HomePage } from '@/pages/public/HomePage';
import { AboutPage } from '@/pages/public/AboutPage';
import { CareersPage } from '@/pages/public/CareersPage';
import { HowItWorksPage } from '@/pages/public/HowItWorksPage';
import { PressPage } from '@/pages/public/PressPage';
import { HelpCenterPage } from '@/pages/public/HelpCenterPage';
import { SafetyPage } from '@/pages/public/SafetyPage';
import { ContactPage } from '@/pages/public/ContactPage';
import { PrivacyPolicyPage } from '@/pages/legal/PrivacyPolicyPage';
import { TermsPage } from '@/pages/legal/TermsPage';
import { CookiePolicyPage } from '@/pages/legal/CookiePolicyPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';
import { ApplicationStatusPage } from '@/pages/application/ApplicationStatusPage';
import { DashboardPage } from '@/pages/driver/DashboardPage';
import { DriverManagerPage } from '@/pages/driver/DriverManagerPage';
import { EarningsPage } from '@/pages/driver/EarningsPage';
import { TripsPage } from '@/pages/driver/TripsPage';
import { OnlineHoursPage } from '@/pages/driver/OnlineHoursPage';
import { RatingPage } from '@/pages/driver/RatingPage';
import { TransactionsPage } from '@/pages/driver/TransactionsPage';
import { ProfilePage } from '@/pages/driver/ProfilePage';
import { SupportPage } from '@/pages/driver/SupportPage';
import { NotificationsPage } from '@/pages/driver/NotificationsPage';
import { SettingsPage } from '@/pages/driver/SettingsPage';
import { AuthProvider } from '@/context/AuthContext';
import { SocketProvider } from '@/context/SocketContext';
import { NotificationProvider } from '@/context/NotificationContext';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <Routes>
              {/* Public Routes with Shared Layout (Navbar + Footer) */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/press" element={<PressPage />} />
                <Route path="/help" element={<HelpCenterPage />} />
                <Route path="/help-center" element={<HelpCenterPage />} />
                <Route path="/safety" element={<SafetyPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/cookies" element={<CookiePolicyPage />} />
                <Route path="/cookie-policy" element={<CookiePolicyPage />} />
              </Route>

              {/* Auth Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
              </Route>

              <Route path="/application-status" element={<ApplicationStatusPage />} />

              {/* Protected Driver Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DriverLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/driver-manager" element={<DriverManagerPage />} />
                  <Route path="/earnings" element={<EarningsPage />} />
                  <Route path="/trips" element={<TripsPage />} />
                  <Route path="/online-hours" element={<OnlineHoursPage />} />
                  <Route path="/rating" element={<RatingPage />} />
                  <Route path="/transactions" element={<TransactionsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/support" element={<SupportPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;