import { useEffect, useMemo, useState } from "react";
import { formatDateTime } from "@/utils/formatDate";
import { getRideHistory } from "@/services/DriverBooking";
import { RideDetailsModal } from "@/components/booking/RideDetailsModal";
import { Eye, RefreshCw, AlertCircle } from "lucide-react";

type FilterType = "all" | "today" | "week" | "month";

interface Trip {
  _id?: string;
  id?: string;
  rideId?: string;
  createdAt?: string;
  updatedAt?: string;
  date?: string;
  completedAt?: string;
  startedAt?: string;
  driverAssignedAt?: string;
  cancelledAt?: string;
  pickup?: any;
  pickupLocation?: string;
  pickupAddress?: string;
  drop?: any;
  dropoff?: any;
  dropLocation?: string;
  dropAddress?: string;
  distance?: number;
  distanceKm?: number;
  distanceMiles?: number;
  totalDistance?: number;
  durationMinutes?: number;
  etaMinutes?: number;
  duration?: number;
  amount?: number;
  fare?: any;
  totalFare?: number;
  payableFare?: number;
  totalAmount?: number;
  discount?: number;
  promoCode?: string;
  passengerCount?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  paymentCollectedAt?: string;
  notes?: string;
  vehicleType?: any;
  passenger?: any;
  status?: string;
  rideType?: string;
}

const ITEMS_PER_PAGE = 10;

export function TripsPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getRideHistory();
      console.log("response ride history:", response);

      setTrips(Array.isArray(response) ? response : []);
    } catch (err: any) {
      console.error("Failed to fetch ride history:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load trip history"
      );

      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const getTripDate = (trip: Trip) =>
    trip.createdAt ||
    trip.completedAt ||
    trip.date ||
    trip.updatedAt ||
    "";

  const filteredTrips = useMemo(() => {
    if (filter === "all") return trips;

    const now = new Date();

    return trips.filter((trip) => {
      const dateString = getTripDate(trip);

      if (!dateString) return true;

      const tripDate = new Date(dateString);

      if (Number.isNaN(tripDate.getTime())) return true;

      if (filter === "today") {
        return (
          tripDate.getDate() === now.getDate() &&
          tripDate.getMonth() === now.getMonth() &&
          tripDate.getFullYear() === now.getFullYear()
        );
      }

      if (filter === "week") {
        const startOfWeek = new Date(now);
        const day = startOfWeek.getDay();
        const diff = day === 0 ? 6 : day - 1;

        startOfWeek.setDate(startOfWeek.getDate() - diff);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        return tripDate >= startOfWeek && tripDate <= endOfWeek;
      }

      return (
        tripDate.getMonth() === now.getMonth() &&
        tripDate.getFullYear() === now.getFullYear()
      );
    });
  }, [trips, filter]);

  const totalPages = Math.max(1, Math.ceil(filteredTrips.length / ITEMS_PER_PAGE));

  const paginatedTrips = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredTrips.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredTrips, currentPage]);

  const getTripId = (trip: Trip) =>
    trip.rideId || trip._id || trip.id || "-";

  const getPickup = (trip: Trip) => {
    if (typeof trip.pickup === 'string') return trip.pickup;
    return (
      trip.pickup?.address ||
      trip.pickupLocation ||
      trip.pickupAddress ||
      "-"
    );
  };

  const getDrop = (trip: Trip) => {
    if (typeof trip.dropoff === 'string') return trip.dropoff;
    if (trip.dropoff?.address) return trip.dropoff.address;
    if (typeof trip.drop === 'string') return trip.drop;
    return (
      trip.drop?.address ||
      trip.dropLocation ||
      trip.dropAddress ||
      "-"
    );
  };

  const getDistance = (trip: Trip) =>
    trip.distanceKm ?? trip.distance ?? trip.totalDistance ?? 0;

  const getDuration = (trip: Trip) =>
    trip.durationMinutes ?? trip.duration ?? trip.etaMinutes ?? 0;

  const getAmount = (trip: Trip) =>
    trip.payableFare ??
    trip.totalFare ??
    (typeof trip.fare === 'number' ? trip.fare : (trip.fare?.payableFare ?? trip.fare?.totalFare)) ??
    trip.amount ??
    trip.totalAmount ??
    0;

  const formatTripFare = (trip: Trip) => {
    const amount = getAmount(trip);
    const curr = trip.fare?.currency || "USD";
    try {
      return new Intl.NumberFormat(curr === 'INR' ? 'en-IN' : 'en-US', {
        style: 'currency',
        currency: curr,
        minimumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `${curr === 'INR' ? '₹' : '$'}${amount.toFixed(2)}`;
    }
  };

  const getPassengerName = (trip: Trip) =>
    trip.passenger?.fullName ||
    (trip.passenger?.firstName
      ? `${trip.passenger.firstName} ${trip.passenger.lastName || ''}`.trim()
      : '') ||
    trip.passenger?.name ||
    'Passenger';

  const getPassengerPhone = (trip: Trip) =>
    trip.passenger?.phoneNumber ||
    trip.passenger?.phone ||
    '';

  const getStatus = (trip: Trip) => {
    if (trip.status === "RIDE_COMPLETED") return "Completed";
    if (trip.status === "RIDE_CANCELLED") return "Cancelled";
    if (trip.status === "RIDE_STARTED" || trip.status === "IN_PROGRESS") return "In Progress";
    if (trip.status === "DRIVER_ASSIGNED") return "Assigned";
    return trip.status ? trip.status.replace(/_/g, ' ') : "Completed";
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "ride_completed":
      case "paid":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";

      case "cancelled":
      case "ride_cancelled":
      case "canceled":
        return "bg-rose-50 text-rose-700 border border-rose-200";

      case "started":
      case "in progress":
      case "ride_started":
      case "in_progress":
        return "bg-blue-50 text-blue-700 border border-blue-200";

      default:
        return "bg-amber-50 text-amber-700 border border-amber-200";
    }
  };

  const handleOpenDetails = (trip: Trip) => {
    const tripId = getTripId(trip);
    if (tripId !== '-') {
      setSelectedRideId(tripId);
      setSelectedTrip(trip);
    }
  };

  return (
    <div className="space-y-6 w-full min-w-0 max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy tracking-tight">
            Trips
          </h2>

          <p className="text-sm text-gray-500 mt-0.5">
            View and manage your completed ride history and details.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 bg-orange-50 text-[#FF5B26] border border-orange-100 rounded-xl shadow-sm">
            {filteredTrips.length} trips
          </span>

          <button
            onClick={fetchTrips}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 shadow-sm transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#FF5B26]" : "text-gray-500"}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {[
          { label: "All Trips", value: "all" },
          { label: "Today", value: "today" },
          { label: "This Week", value: "week" },
          { label: "This Month", value: "month" },
        ].map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() =>
              setFilter(tab.value as FilterType)
            }
            className={`px-4 py-3 text-sm font-semibold transition-colors relative outline-none ${
              filter === tab.value
                ? "border-b-2 border-[#FF5B26] text-[#FF5B26]"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center justify-between gap-3 text-sm text-red-600">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchTrips}
            className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table Container strictly bounded to parent width */}
      <div className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <table className="w-full min-w-[960px] divide-y divide-gray-100 text-left">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                  Trip ID
                </th>

                <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                  Date & Time
                </th>

                <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                  Passenger
                </th>

                <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                  Pickup & Dropoff
                </th>

                <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                  Distance & Time
                </th>

                <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                  Fare Amount
                </th>

                <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                  Status
                </th>

                <th className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-gray-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {loading &&
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    {Array.from({ length: 8 }).map(
                      (_, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-5 py-4"
                        >
                          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                        </td>
                      )
                    )}
                  </tr>
                ))}

              {!loading &&
                paginatedTrips.map((trip) => {
                  const status = getStatus(trip);
                  const tripId = getTripId(trip);
                  const passName = getPassengerName(trip);
                  const passPhone = getPassengerPhone(trip);
                  const distance = getDistance(trip);
                  const duration = getDuration(trip);

                  return (
                    <tr
                      key={tripId}
                      className="hover:bg-gray-50/80 transition-colors cursor-pointer group"
                      onClick={() => handleOpenDetails(trip)}
                    >
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-mono font-bold text-gray-900 group-hover:text-[#FF5B26] transition-colors">
                            {tripId}
                          </span>
                          {trip.rideType && (
                            <span className="text-[10px] font-semibold text-gray-500 uppercase">
                              {trip.rideType}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-xs text-gray-600">
                        {getTripDate(trip)
                          ? formatDateTime(getTripDate(trip))
                          : "-"}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-orange-50 text-[#FF5B26] flex items-center justify-center font-bold text-xs shrink-0">
                            {passName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-900 truncate">
                              {passName}
                            </p>
                            {passPhone && (
                              <p className="text-[11px] text-gray-500 truncate">
                                {passPhone}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="max-w-[260px] px-5 py-4 text-xs space-y-1">
                        <div className="flex items-start gap-1.5 truncate" title={getPickup(trip)}>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1" />
                          <span className="text-gray-700 truncate">{getPickup(trip)}</span>
                        </div>
                        <div className="flex items-start gap-1.5 truncate" title={getDrop(trip)}>
                          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1" />
                          <span className="text-gray-700 truncate">{getDrop(trip)}</span>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-xs text-gray-600">
                        <span className="font-semibold text-gray-900">{distance} km</span>
                        {duration > 0 && (
                          <span className="text-gray-400 block text-[11px]">{duration} mins</span>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-xs">
                        <span className="font-bold text-gray-900 text-sm">
                          {formatTripFare(trip)}
                        </span>
                        {trip.paymentMethod && (
                          <span className="text-[10px] text-gray-400 block uppercase">
                            {trip.paymentMethod} • {trip.paymentStatus || 'PAID'}
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetails(trip);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#FF5B26] bg-orange-50/60 hover:bg-orange-100 hover:text-[#e04f20] rounded-xl transition-all shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}

              {!loading &&
                !error &&
                paginatedTrips.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-12 text-center text-sm text-gray-500"
                    >
                      No trips found for this period.
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>

        {!loading && filteredTrips.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-5 py-4">
            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-700">
                {Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredTrips.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">
                {filteredTrips.length}
              </span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.max(page - 1, 1)
                  )
                }
                className="rounded-xl border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
              >
                Previous
              </button>

              <span className="rounded-xl bg-[#FF5B26] px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(page + 1, totalPages)
                  )
                }
                className="rounded-xl border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Ride Details Modal */}
      <RideDetailsModal
        rideId={selectedRideId}
        initialData={selectedTrip}
        isOpen={Boolean(selectedRideId)}
        onClose={() => {
          setSelectedRideId(null);
          setSelectedTrip(null);
        }}
      />
    </div>
  );
}

