import { useEffect, useState } from 'react';
import {
  X,
  Clock,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Navigation,
  Phone,
} from 'lucide-react';
import { getRideById } from '@/services/DriverBooking';
import { getErrorMessage } from '@/services/axiosClient';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDateTime } from '@/utils/formatDate';

interface RideDetailsModalProps {
  rideId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RideDetailsModal({ rideId, isOpen, onClose }: RideDetailsModalProps) {
  const [ride, setRide] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRideById(id);
      setRide(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && rideId) {
      fetchDetails(rideId);
    } else {
      setRide(null);
      setError(null);
    }
  }, [isOpen, rideId]);

  if (!isOpen) return null;

  const getStatusColor = (status: string = '') => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
      case 'PAID':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'ACCEPTED':
      case 'ARRIVED':
      case 'STARTED':
      case 'IN_PROGRESS':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const pickupAddr =
    typeof ride?.pickup === 'string'
      ? ride.pickup
      : ride?.pickup?.address || ride?.pickupAddress || 'Pickup location not specified';

  const dropAddr =
    typeof ride?.dropoff === 'string'
      ? ride.dropoff
      : ride?.dropoff?.address ||
        (typeof ride?.drop === 'string'
          ? ride.drop
          : ride?.drop?.address || ride?.dropAddress || 'Drop location not specified');

  const passengerName =
    ride?.passenger?.fullName ||
    ride?.passenger?.name ||
    ride?.user?.name ||
    ride?.userName ||
    'Passenger';

  const passengerPhone =
    ride?.passenger?.phoneNumber ||
    ride?.passenger?.phone ||
    ride?.user?.phone ||
    ride?.phoneNumber ||
    'Not provided';

  const fareTotal =
    ride?.totalFare ??
    ride?.payableFare ??
    ride?.fare?.totalFare ??
    ride?.fare?.payableFare ??
    ride?.fareBreakdown?.total ??
    ride?.fare ??
    ride?.totalAmount ??
    ride?.amount ??
    0;

  const tripDistance =
    ride?.distanceKm ??
    ride?.actualDistance ??
    ride?.distance ??
    0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900">Trip Details</h3>
              {ride?.status && (
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getStatusColor(
                    ride.status
                  )}`}
                >
                  {ride.status}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              ID: <span className="font-mono">{rideId}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {loading && (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-orange-200 border-t-[#FF5B26] rounded-full animate-spin" />
              <p className="text-sm font-medium text-gray-500">Fetching trip details...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-sm font-semibold">Failed to load trip</span>
              </div>
              <p className="text-xs text-red-600">{error}</p>
              {rideId && (
                <button
                  onClick={() => fetchDetails(rideId)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retry
                </button>
              )}
            </div>
          )}

          {!loading && !error && ride && (
            <>
              {/* Route Path */}
              <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-100 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Route</h4>

                <div className="space-y-3 relative pl-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
                  <div className="relative">
                    <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                    <p className="text-xs text-gray-400 font-medium">Pickup</p>
                    <p className="text-sm font-semibold text-gray-800 leading-snug">{pickupAddr}</p>
                  </div>

                  <div className="relative pt-1">
                    <div className="absolute -left-6 top-2 w-3.5 h-3.5 rounded-full bg-rose-500 ring-4 ring-rose-100" />
                    <p className="text-xs text-gray-400 font-medium">Dropoff</p>
                    <p className="text-sm font-semibold text-gray-800 leading-snug">{dropAddr}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200/70 text-center">
                  <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-400">Distance</p>
                    <p className="text-sm font-bold text-gray-800">
                      {tripDistance} km
                    </p>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-400">Total Fare</p>
                    <p className="text-sm font-bold text-emerald-600">
                      {formatCurrency(fareTotal)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Passenger Info */}
              <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Passenger
                </h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-orange-100 text-[#FF5B26] flex items-center justify-center font-bold text-base">
                      {passengerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{passengerName}</p>
                      <p className="text-xs text-gray-500">{passengerPhone}</p>
                    </div>
                  </div>

                  {passengerPhone && passengerPhone !== 'Not provided' && (
                    <a
                      href={`tel:${passengerPhone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold border border-emerald-200 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call
                    </a>
                  )}
                </div>
              </div>

              {/* Timing & Timeline */}
              <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Timestamps
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                  {ride.createdAt && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>Requested: {formatDateTime(ride.createdAt)}</span>
                    </div>
                  )}
                  {(ride.driverAssignedAt || ride.acceptedAt) && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                      <span>Assigned: {formatDateTime(ride.driverAssignedAt || ride.acceptedAt)}</span>
                    </div>
                  )}
                  {ride.startedAt && (
                    <div className="flex items-center gap-2">
                      <Navigation className="w-3.5 h-3.5 text-orange-500" />
                      <span>Started: {formatDateTime(ride.startedAt)}</span>
                    </div>
                  )}
                  {ride.completedAt && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Completed: {formatDateTime(ride.completedAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Fare & Payment Breakdown */}
              <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Payment Breakdown
                  </h4>
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                    {ride.paymentMethod || 'Cash'} • {ride.paymentStatus || 'Completed'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-gray-600 pt-1">
                  {(ride.fare?.basePrice !== undefined || ride.fareBreakdown?.baseFare !== undefined) && (
                    <div className="flex justify-between">
                      <span>Base Fare</span>
                      <span className="font-semibold">
                        {formatCurrency(ride.fare?.basePrice ?? ride.fareBreakdown?.baseFare)}
                      </span>
                    </div>
                  )}
                  {(ride.fare?.distanceRate !== undefined || ride.fareBreakdown?.distanceFare !== undefined) && (
                    <div className="flex justify-between">
                      <span>Distance Fare ({ride.fare?.distanceKm || tripDistance} km)</span>
                      <span className="font-semibold">
                        {formatCurrency(ride.fare?.distanceRate ?? ride.fareBreakdown?.distanceFare)}
                      </span>
                    </div>
                  )}
                  {(ride.fare?.timeRate !== undefined || ride.fareBreakdown?.timeFare !== undefined) && (
                    <div className="flex justify-between">
                      <span>Time Rate ({ride.fare?.durationMinutes || ride.durationMinutes || 0} min)</span>
                      <span className="font-semibold">
                        {formatCurrency(ride.fare?.timeRate ?? ride.fareBreakdown?.timeFare)}
                      </span>
                    </div>
                  )}
                  {(ride.fare?.discount !== undefined || ride.discount !== undefined || ride.fareBreakdown?.discount !== undefined) && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount</span>
                      <span className="font-semibold">
                        -{formatCurrency(ride.fare?.discount ?? ride.discount ?? ride.fareBreakdown?.discount ?? 0)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-100">
                    <span>Total Amount</span>
                    <span className="text-base text-emerald-600">{formatCurrency(fareTotal)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
