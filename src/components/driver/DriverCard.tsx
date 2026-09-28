import { useState } from 'react';
import {
  Mail,
  Phone,
  Building2,
  Car,
  FileText,
  MoreVertical,
  Edit2,
  Trash2,
  Send,
  Star,
  Loader2,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import { CompanyDriver, DriverStatus } from '@/types/driverManager';

interface DriverCardProps {
  driver: CompanyDriver;
  onEdit: (driver: CompanyDriver) => void;
  onDelete: (driver: CompanyDriver) => void;
  onStatusChange: (driverId: string, newStatus: string) => void;
  onResendCredentials: (driver: CompanyDriver) => void;
  isResending?: boolean;
}

export function DriverCard({
  driver,
  onEdit,
  onDelete,
  onStatusChange,
  onResendCredentials,
  isResending = false,
}: DriverCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  const statusStr = String(driver.status || 'ACTIVE').toUpperCase();

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'ACTIVE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/60 ring-emerald-500/20';
      case 'ON_RIDE':
        return 'bg-blue-50 text-blue-700 border-blue-200/60 ring-blue-500/20';
      case 'OFF_DUTY':
        return 'bg-amber-50 text-amber-700 border-amber-200/60 ring-amber-500/20';
      case 'INACTIVE':
        return 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-400/20';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusDot = (st: string) => {
    switch (st) {
      case 'ACTIVE':
        return 'bg-emerald-500';
      case 'ON_RIDE':
        return 'bg-blue-500';
      case 'OFF_DUTY':
        return 'bg-amber-500';
      case 'INACTIVE':
        return 'bg-slate-400';
      default:
        return 'bg-slate-400';
    }
  };

  const name =
    driver.fullName ||
    `${driver.firstName || ''} ${driver.lastName || ''}`.trim() ||
    'Unnamed Driver';
  const email = driver.email || 'N/A';
  const phone = driver.phoneNumber || driver.phone || 'N/A';
  const companyName = driver.companyName || 'General Logistics';
  const licenseNumber = driver.licenseNumber || 'Not Uploaded';
  const vehicle = driver.vehicleAssignment || driver.vehicleNumber || 'Unassigned';
  const city = driver.city || '';

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const statuses: DriverStatus[] = ['ACTIVE', 'ON_RIDE', 'OFF_DUTY', 'INACTIVE'];

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-xl hover:border-orange-200 transition-all duration-300 flex flex-col justify-between">
      {/* Card Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            <div className="relative">
              {driver.avatarUrl ? (
                <img
                  src={driver.avatarUrl}
                  alt={name}
                  className="w-11 h-11 rounded-full object-cover border border-slate-100 shadow-xs"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform duration-200">
                  {initials}
                </div>
              )}
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusDot(
                  statusStr
                )}`}
              />
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-primary-600 transition-colors">
                {name}
              </h3>
              <div className="flex items-center gap-1 mt-0.5">
                <Building2 className="w-3 h-3 text-slate-400" />
                <span className="text-[11px] font-medium text-slate-500 truncate max-w-[130px]">
                  {companyName}
                </span>
                {city && (
                  <span className="text-[10px] text-slate-400 flex items-center gap-0.5 ml-1">
                    • <MapPin className="w-2.5 h-2.5 inline" /> {city}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-20 animate-fade-in">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(driver);
                    }}
                    className="w-full text-left px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-orange-50 hover:text-primary-600 flex items-center gap-2 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Driver</span>
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onResendCredentials(driver);
                    }}
                    disabled={isResending}
                    className="w-full text-left px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {isResending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Resend Credentials</span>
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(driver);
                    }}
                    className="w-full text-left px-3.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Driver</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="space-y-1.5 py-2.5 border-t border-b border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{email}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>{phone}</span>
          </div>
          <div className="flex items-center justify-between text-slate-600 pt-0.5">
            <div className="flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="font-medium text-slate-700 truncate max-w-[170px]">{vehicle}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="text-[11px]">DL: {licenseNumber}</span>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="pt-3 flex items-center justify-between">
        {/* Status Dropdown */}
        <div className="relative">
          <button
            onClick={() => setStatusMenuOpen(!statusMenuOpen)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ring-1 transition-all capitalize cursor-pointer hover:opacity-80 ${getStatusBadge(
              statusStr
            )}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(statusStr)}`} />
            <span>{statusStr}</span>
          </button>

          {statusMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setStatusMenuOpen(false)} />
              <div className="absolute left-0 bottom-full mb-1.5 w-36 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-20 animate-fade-in">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Update Status
                </div>
                {statuses.map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setStatusMenuOpen(false);
                      onStatusChange(driver.id, st);
                    }}
                    className={`w-full text-left px-3 py-1 text-xs capitalize flex items-center justify-between transition-colors ${
                      st === statusStr
                        ? 'bg-orange-50 font-bold text-primary-600'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{st}</span>
                    {st === statusStr && <CheckCircle2 className="w-3.5 h-3.5 text-primary-500" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Rating / Actions */}
        <div className="flex items-center gap-1 text-xs">
          {driver.rating ? (
            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md font-semibold border border-amber-200/50">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{driver.rating.toFixed(1)}</span>
            </div>
          ) : (
            <button
              onClick={() => onResendCredentials(driver)}
              disabled={isResending}
              title="Resend Credentials"
              className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50"
            >
              {isResending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
