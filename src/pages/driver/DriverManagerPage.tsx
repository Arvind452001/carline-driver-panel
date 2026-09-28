import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  RefreshCw,
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Car,
  ShieldAlert,
  Lock,
  Key,
} from 'lucide-react';
import { CompanyDriver, CreateDriverPayload } from '@/types/driverManager';
import { driverApi } from '@/services/driverApi';
import { getErrorMessage } from '@/services/axiosClient';
import { DriverCard } from '@/components/driver/DriverCard';
import { DriverFormModal } from '@/components/driver/DriverFormModal';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { ToastContainer, ToastMessage } from '@/components/ui/Toast';
import { MOCK_COMPANIES } from '@/constants/companies';
import Swal from 'sweetalert2';

export function DriverManagerPage() {
  const [drivers, setDrivers] = useState<CompanyDriver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [errorStatusCode, setErrorStatusCode] = useState<number | null>(null);

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Token management helper for testing real backend authorization
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [customToken, setCustomToken] = useState(
    localStorage.getItem('token') || localStorage.getItem('auth_token') || ''
  );

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<CompanyDriver | null>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const [deletingDriver, setDeletingDriver] = useState<CompanyDriver | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [resendingDriver, setResendingDriver] = useState<CompanyDriver | null>(null);
  const [isResending, setIsResending] = useState(false);

  // Toast state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch Drivers List via GET /api/v1/company/drivers?page=1&limit=10
  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    setError(null);
    setErrorStatusCode(null);
    try {
      const data = await driverApi.getDrivers({
        page: 1,
        limit: 10,
        search: searchQuery,
        companyId: selectedCompany,
        status: selectedStatus,
      });
      setDrivers(data);
    } catch (err: any) {
      const msg = getErrorMessage(err);
      setError(msg);
      if (err?.response?.status) {
        setErrorStatusCode(err.response.status);
      } else if (msg.includes('403')) {
        setErrorStatusCode(403);
      } else if (msg.includes('401')) {
        setErrorStatusCode(401);
      }
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCompany, selectedStatus]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  // Handle Token Update
  const handleSaveToken = () => {
    if (customToken.trim()) {
      localStorage.setItem('token', customToken.trim());
      localStorage.setItem('auth_token', customToken.trim());
      localStorage.setItem('access_token', customToken.trim());
      addToast('success', 'Authentication token saved to storage.');
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('access_token');
      addToast('info', 'Token cleared from storage.');
    }
    setShowTokenInput(false);
    fetchDrivers();
  };

  // Handle Driver Create/Edit Submission
  const handleFormSubmit = async (payload: CreateDriverPayload) => {
    setIsSubmittingForm(true);
    try {
      if (editingDriver) {
        await driverApi.updateDriver({
          ...payload,
          id: editingDriver.id,
        });
        Swal.fire({
          icon: 'success',
          title: 'Driver Updated!',
          text: `Driver ${payload.firstName} ${payload.lastName} has been updated successfully.`,
          confirmButtonColor: '#FF5B26',
        });
      } else {
        await driverApi.createDriver(payload);
        Swal.fire({
          icon: 'success',
          title: 'Driver Registered!',
          text: `Driver ${payload.firstName} ${payload.lastName} has been registered successfully.`,
          confirmButtonColor: '#FF5B26',
        });
      }
      setIsFormModalOpen(false);
      setEditingDriver(null);
      fetchDrivers();
    } catch (err) {
      const msg = getErrorMessage(err);
      Swal.fire({
        icon: 'error',
        title: 'Operation Failed',
        text: msg,
        confirmButtonColor: '#FF5B26',
      });
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Handle Driver Status Toggle
  const handleStatusChange = async (driverId: string, newStatus: string) => {
    try {
      await driverApi.updateDriverStatus({ id: driverId, status: newStatus });
      setDrivers((prev) =>
        prev.map((d) => (d.id === driverId ? { ...d, status: newStatus } : d))
      );
      Swal.fire({
        icon: 'success',
        title: 'Status Updated!',
        text: `Driver status changed to "${newStatus}".`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      const msg = getErrorMessage(err);
      Swal.fire({
        icon: 'error',
        title: 'Status Update Failed',
        text: msg,
        confirmButtonColor: '#FF5B26',
      });
    }
  };

  // Handle Delete Driver
  const handleDeleteConfirm = async () => {
    if (!deletingDriver) return;
    const name =
      deletingDriver.fullName ||
      `${deletingDriver.firstName || ''} ${deletingDriver.lastName || ''}`.trim();
    setIsDeleting(true);
    try {
      await driverApi.deleteDriver(deletingDriver.id);
      Swal.fire({
        icon: 'success',
        title: 'Driver Deleted!',
        text: `Driver ${name} has been removed successfully.`,
        confirmButtonColor: '#FF5B26',
      });
      setDeletingDriver(null);
      fetchDrivers();
    } catch (err) {
      const msg = getErrorMessage(err);
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: msg,
        confirmButtonColor: '#FF5B26',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Resend Credentials
  const handleResendCredentialsConfirm = async () => {
    if (!resendingDriver) return;
    setIsResending(true);
    try {
      const res = await driverApi.resendDriverCredentials(resendingDriver.id);
      Swal.fire({
        icon: 'success',
        title: 'Credentials Sent!',
        text: res.message || `Credentials login link sent to ${resendingDriver.email}.`,
        confirmButtonColor: '#FF5B26',
      });
      setResendingDriver(null);
    } catch (err) {
      const msg = getErrorMessage(err);
      Swal.fire({
        icon: 'error',
        title: 'Resend Failed',
        text: msg,
        confirmButtonColor: '#FF5B26',
      });
    } finally {
      setIsResending(false);
    }
  };

  // Stats Counters
  const totalCount = drivers.length;
  const activeCount = drivers.filter(
    (d) => String(d.status).toUpperCase() === 'ACTIVE'
  ).length;
  const onRideCount = drivers.filter(
    (d) => String(d.status).toUpperCase() === 'ON_RIDE'
  ).length;
  const offDutyCount = drivers.filter(
    (d) => String(d.status).toUpperCase() === 'OFF_DUTY'
  ).length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-primary-500" />
            Driver Manager
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage company drivers, status authorizations, and fleet credentials via API.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTokenInput(!showTokenInput)}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold shadow-xs transition-colors"
            title="Configure Auth Token"
          >
            <Key className="w-4 h-4 text-amber-500" />
            <span>{showTokenInput ? 'Close Auth Settings' : 'Auth Token'}</span>
          </button>

          <button
            onClick={() => {
              setEditingDriver(null);
              setIsFormModalOpen(true);
            }}
            className="btn-primary flex items-center justify-center gap-2 text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all py-2.5 px-5 rounded-xl font-semibold"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Driver</span>
          </button>
        </div>
      </div>

      {/* Optional Token Configuration Bar for Debugging Authorization */}
      {showTokenInput && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 space-y-3 animate-fade-in shadow-xs">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
            <Key className="w-4 h-4 text-amber-600" />
            Bearer Token Configuration (GET /api/v1/company/drivers)
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            Enter or update your company JWT Bearer token below. This token will be sent in the{' '}
            <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-mono">Authorization: Bearer &lt;token&gt;</code> header on all Driver API requests.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customToken}
              onChange={(e) => setCustomToken(e.target.value)}
              placeholder="Paste Bearer Token here (e.g. eyJhbGciOi...)"
              className="flex-1 px-3.5 py-2 rounded-xl border border-amber-300 bg-white text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              onClick={handleSaveToken}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shadow-xs"
            >
              Save & Test API
            </button>
          </div>
        </div>
      )}

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card flex items-center gap-4 p-4 border border-slate-100 shadow-xs hover:border-orange-100 transition-all">
          <div className="p-3 bg-orange-50 text-primary-500 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{totalCount}</div>
            <div className="text-xs text-slate-500 font-medium">Total Drivers</div>
          </div>
        </div>

        <div className="card flex items-center gap-4 p-4 border border-slate-100 shadow-xs hover:border-emerald-100 transition-all">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{activeCount}</div>
            <div className="text-xs text-slate-500 font-medium">Active Fleet</div>
          </div>
        </div>

        <div className="card flex items-center gap-4 p-4 border border-slate-100 shadow-xs hover:border-blue-100 transition-all">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{onRideCount}</div>
            <div className="text-xs text-slate-500 font-medium">On Ride</div>
          </div>
        </div>

        <div className="card flex items-center gap-4 p-4 border border-slate-100 shadow-xs hover:border-amber-100 transition-all">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{offDutyCount}</div>
            <div className="text-xs text-slate-500 font-medium">Off Duty</div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by full name, email, phone, or license number..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all text-sm outline-none font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5 min-w-[150px]">
            <Building2 className="w-4 h-4 text-slate-400 hidden sm:inline" />
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:border-primary-500 transition-all text-xs font-semibold outline-none"
            >
              <option value="all">All Companies</option>
              {MOCK_COMPANIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 min-w-[130px]">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:inline" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:border-primary-500 transition-all text-xs font-semibold outline-none uppercase"
            >
              <option value="ALL">ALL STATUSES</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="ON_RIDE">ON_RIDE</option>
              <option value="OFF_DUTY">OFF_DUTY</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          <button
            onClick={fetchDrivers}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-primary-600 hover:bg-orange-50 transition-colors"
            title="Refresh API Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        /* Loading Skeletons */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-slate-200" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2 py-3 border-y border-slate-100">
                <div className="h-3 bg-slate-200 rounded w-full" />
                <div className="h-3 bg-slate-200 rounded w-2/3" />
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 bg-slate-200 rounded-full w-20" />
                <div className="h-6 bg-slate-200 rounded-md w-12" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        /* Distinct Error Handling for 403 Forbidden, 401 Unauthorized, and General Errors */
        errorStatusCode === 403 || error?.includes('403') ? (
          <div className="bg-red-50/90 border border-red-200 rounded-2xl p-8 text-center space-y-5 max-w-xl mx-auto my-8 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-950">Access Forbidden (403 Error)</h3>
              <p className="text-sm text-red-800 mt-2 leading-relaxed">
                You don't have permission to access the Driver Manager endpoint (<code className="bg-red-100 px-1 py-0.5 rounded text-red-900 font-mono">/api/v1/company/drivers</code>).
              </p>
              <div className="bg-white/80 border border-red-200/60 rounded-xl p-3.5 mt-4 text-left text-xs text-slate-700 space-y-1">
                <div className="font-semibold text-red-900 mb-1">Authorization Troubleshooting Checklist:</div>
                <div>• Ensure the logged-in account has Company Manager / Admin privileges.</div>
                <div>• Verify that your authorization token is attached to the request headers.</div>
                <div>• Click "Auth Token" above to set or test your Company Bearer Token.</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowTokenInput(true)}
                className="btn-secondary text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5 text-amber-500" />
                <span>Update Auth Token</span>
              </button>
              <button
                onClick={fetchDrivers}
                className="btn-primary bg-red-600 hover:bg-red-700 text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry API Call</span>
              </button>
            </div>
          </div>
        ) : errorStatusCode === 401 || error?.includes('401') ? (
          <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-8 text-center space-y-4 max-w-xl mx-auto my-8 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-950">Authentication Required (401 Error)</h3>
              <p className="text-sm text-amber-800 mt-2 leading-relaxed">
                Your authentication token is missing, invalid, or expired. Please log in again to receive a valid Bearer token.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowTokenInput(true)}
                className="btn-secondary text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Provide Bearer Token</span>
              </button>
              <button
                onClick={fetchDrivers}
                className="btn-primary bg-amber-600 hover:bg-amber-700 text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center space-y-4 max-w-lg mx-auto my-8">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-900">API Request Failed</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button
              onClick={fetchDrivers}
              className="btn-primary bg-red-600 hover:bg-red-700 text-sm px-6 py-2.5 rounded-xl"
            >
              Retry API Request
            </button>
          </div>
        )
      ) : drivers.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-5 max-w-md mx-auto my-6 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-orange-50 text-primary-500 flex items-center justify-center mx-auto">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">No Drivers Found</h3>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
              {searchQuery || selectedCompany !== 'all' || selectedStatus !== 'ALL'
                ? 'No drivers matched your search parameters. Try resetting your query or status filters.'
                : 'The backend returned an empty driver list. Get started by adding your first driver.'}
            </p>
          </div>
          <div className="pt-2">
            {searchQuery || selectedCompany !== 'all' || selectedStatus !== 'ALL' ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCompany('all');
                  setSelectedStatus('ALL');
                }}
                className="btn-secondary text-xs px-5 py-2.5 rounded-xl"
              >
                Clear All Filters
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditingDriver(null);
                  setIsFormModalOpen(true);
                }}
                className="btn-primary text-xs px-5 py-2.5 rounded-xl"
              >
                + Add First Driver
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Driver Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drivers.map((driver) => (
            <DriverCard
              key={driver.id}
              driver={driver}
              onEdit={(d) => {
                setEditingDriver(d);
                setIsFormModalOpen(true);
              }}
              onDelete={(d) => setDeletingDriver(d)}
              onStatusChange={handleStatusChange}
              onResendCredentials={(d) => setResendingDriver(d)}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      <DriverFormModal
        isOpen={isFormModalOpen}
        driver={editingDriver}
        isLoading={isSubmittingForm}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingDriver(null);
        }}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deletingDriver)}
        title="Delete Driver Account"
        message={`Are you sure you want to delete ${
          deletingDriver?.fullName ||
          `${deletingDriver?.firstName || ''} ${deletingDriver?.lastName || ''}`.trim()
        }? This action will send a DELETE request to /api/v1/company/drivers/${deletingDriver?.id}.`}
        confirmText="Delete Driver"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingDriver(null)}
      />

      {/* Resend Credentials Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(resendingDriver)}
        title="Resend Credentials"
        message={`Send credential login instructions to ${
          resendingDriver?.fullName ||
          `${resendingDriver?.firstName || ''} ${resendingDriver?.lastName || ''}`.trim()
        } (${resendingDriver?.email})?`}
        confirmText="Send Login Link"
        variant="info"
        isLoading={isResending}
        onConfirm={handleResendCredentialsConfirm}
        onClose={() => setResendingDriver(null)}
      />
    </div>
  );
}
