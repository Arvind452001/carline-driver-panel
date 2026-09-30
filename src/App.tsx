import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { DriverLayout } from '@/layouts/DriverLayout';
import { HomePage } from '@/pages/public/HomePage';
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
import { PrivacyPolicyPage } from '@/pages/legal/PrivacyPolicyPage';
import { TermsPage } from '@/pages/legal/TermsPage';
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
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
            </Route>

            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Route>

            <Route path="/application-status" element={<ApplicationStatusPage />} />

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