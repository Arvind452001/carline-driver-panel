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
  tax?: number;
  discount?: number;
  subtotal?: number;
  total?: number;
  driverEarnings?: number;
  commission?: number;
}

export interface RideRequest {
  _id?: string;
  id?: string;
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
  lat?: number;
  lng?: number;
  heading?: number;
  speed?: number;
  accuracy?: number;
}

export interface StartRidePayload {
  rideId?: string;
  id?: string;
  otp?: string;
}

export interface CompleteRidePayload {
  rideId?: string;
  id?: string;
  actualDistance?: number;
  fare?: number;
}

export interface CollectPaymentPayload {
  rideId?: string;
  id?: string;
  amount?: number;
  totalAmount?: number;
  paymentMode?: 'CASH' | 'UPI' | 'ONLINE' | string;
  isCollected?: boolean;
}

export interface CancelRidePayload {
  rideId?: string;
  id?: string;
  reason?: string;
  cancelledBy?: 'DRIVER' | string;
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
