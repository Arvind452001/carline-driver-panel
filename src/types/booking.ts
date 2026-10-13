export type RideStatus =
  | 'PENDING'
  | 'SEARCHING'
  | 'ACCEPTED'
  | 'ARRIVED'
  | 'STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'CANCELLED'
  | string;

export interface PassengerInfo {
  _id?: string;
  id?: string;
  name?: string;
  fullName?: string;
  phone?: string;
  phoneNumber?: string;
  avatar?: string;
  rating?: number;
}

export interface LocationPoint {
  address?: string;
  name?: string;
  latitude?: number;
  longitude?: number;
  lat?: number;
  lng?: number;
  coordinates?: [number, number]; // [lng, lat]
}

export interface FareBreakdown {
  baseFare?: number;
  distanceFare?: number;
  timeFare?: number;
  waitingCharge?: number;
  waitingCharges?: number;
  waitingMinutes?: number;
  perMinuteWaitingRate?: number;
  tax?: number;
  discount?: number;
  subtotal?: number;
  total?: number;
  payableFare?: number;
  driverEarnings?: number;
  commission?: number;
}

export interface RideRequest {
  _id?: string;
  id?: string;
  rideId?: string;
  passengerId?: string;
  passenger?: PassengerInfo;
  pickup?: LocationPoint | string;
  pickupAddress?: string;
  drop?: LocationPoint | string;
  dropAddress?: string;
  distance?: number; // km
  estimatedDuration?: number; // mins
  estimatedFare?: number;
  fare?: number;
  otp?: string;
  status?: RideStatus;
  paymentMethod?: 'CASH' | 'UPI' | 'ONLINE' | 'WALLET' | string;
  paymentStatus?: 'PENDING' | 'COMPLETED' | 'PAID' | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ActiveRide extends RideRequest {
  rideId?: string;
  acceptedAt?: string;
  arrivedAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  fareBreakdown?: FareBreakdown;
  actualDistance?: number;
  actualDuration?: number;
}

export interface DriverDutyPayload {
  isOnDuty?: boolean;
  isOnline?: boolean;
  dutyStatus?: 'ONLINE' | 'OFFLINE' | string;
  status?: string;
}

export interface DriverLocationPayload {
  latitude: number;
  longitude: number;
  rideId?: string;
  lat?: number;
  lng?: number;
  heading?: number;
  speed?: number;
  accuracy?: number;
}

export interface AcceptRidePayload {
  rideId: string;
}

export interface ArrivedPayload {
  rideId: string;
}

export interface StartRidePayload {
  rideId: string;
  otp?: string;
}

export interface CompleteRidePayload {
  rideId: string;
}

export interface CollectPaymentPayload {
  rideId: string;
  paymentMethod: 'CASH' | 'CARD' | 'UPI' | 'ONLINE' | string;
}

export interface CancelRidePayload {
  rideId: string;
  reason?: string;
}

export interface RejectRidePayload {
  rideId: string;
  reason?: string;
}

export interface DestinationReachedPayload {
  rideId: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
}

export interface WaitingStatusResponse {
  rideId?: string;
  waitingMinutes?: number;
  waitingSeconds?: number;
  totalWaitingSeconds?: number;
  gracePeriodMinutes?: number;
  gracePeriodSeconds?: number;
  gracePeriodRemainingSeconds?: number;
  isGracePeriodExpired?: boolean;
  perMinuteWaitingRate?: number;
  ratePerMinute?: number;
  accruedWaitingCharges?: number;
  waitingCharge?: number;
  waitingCharges?: number;
  baseFare?: number;
  totalUpdatedFare?: number;
  estimatedFare?: number;
  arrivedAt?: string;
  serverTime?: string;
  status?: string;
  [key: string]: any;
}

export interface FinalFareResponse {
  rideId?: string;
  baseFare?: number;
  distanceFare?: number;
  timeFare?: number;
  waitingCharge?: number;
  waitingCharges?: number;
  waitingMinutes?: number;
  extraCharges?: number;
  extras?: number;
  tax?: number;
  discount?: number;
  subtotal?: number;
  totalFare?: number;
  payableFare?: number;
  total?: number;
  currency?: string;
  [key: string]: any;
}

export interface TripTimelineItem {
  event?: string;
  status?: string;
  title?: string;
  description?: string;
  timestamp?: string;
  time?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface DriverRideHomeData {
  isOnline?: boolean;
  isOnDuty?: boolean;
  dutyStatus?: string;
  activeRide?: ActiveRide | null;
  pendingRequests?: RideRequest[];
  todayEarnings?: number;
  totalEarnings?: number;
  todayTrips?: number;
  totalTrips?: number;
  onlineHours?: number | string;
  rating?: number;
  cashCollected?: number;
}

export interface DriverEarningsSummary {
  totalEarnings?: number;
  todayEarnings?: number;
  weeklyEarnings?: number;
  monthlyEarnings?: number;
  tripEarnings?: number;
  incentives?: number;
  tips?: number;
  cashCollected?: number;
  onlinePayouts?: number;
  completedTrips?: number;
  weeklyData?: Array<{ day: string; amount: number }>;
}
