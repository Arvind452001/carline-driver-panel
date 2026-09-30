import type { RideStatus, RideRequest } from './booking';

export type NextActionType =
  | 'MARK_ARRIVED'
  | 'START_TRIP'
  | 'END_TRIP'
  | 'COLLECT_PAYMENT'
  | null;

export interface VehicleTypeSummary {
  vehicleTypeId?: string;
  name?: string;
  seats?: number;
  badge?: string;
  etaText?: string;
  image?: string;
  description?: string;
  basePrice?: number;
  perKmRate?: number;
  perMinuteRate?: number;
}

export interface RidePassengerSummary {
  userId?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  phone?: string;
  avatar?: string;
  rating?: number;
}

export interface RideLocationSummary {
  address?: string;
  latitude?: number;
  longitude?: number;
  lat?: number;
  lng?: number;
}

export interface RideRequestSocketPayload extends RideRequest {
  rideId: string;
  requestId?: string;
  status: RideStatus | 'SEARCHING_DRIVER';
  otp?: string;
  vehicleType?: VehicleTypeSummary;
  vehicleTypeId?: string;
  pickup: RideLocationSummary | any;
  dropoff?: RideLocationSummary | any;
  distanceKm?: number;
  distanceMiles?: number;
  durationMinutes?: number;
  etaMinutes?: number;
  routeSource?: string;
  fare?: number;
  totalFare?: number;
  payableFare?: number;
  promoCode?: string;
  discount?: number;
  passengerCount?: number;
  rideType?: 'INSTANT' | 'SCHEDULED' | 'RECURRING' | string;
  scheduledAt?: string;
  recurringId?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  notes?: string;
  driver?: any;
  createdAt?: string;
}

export interface RideTakenSocketPayload {
  rideId: string;
  status?: string;
  driverId?: string;
}

export interface RideStatusSocketPayload {
  rideId: string;
  status: RideStatus;
  etaMinutes?: number;
  driverId?: string;
  nextAction?: NextActionType;
}

export interface RideDriverSocketPayload {
  rideId: string;
  status?: string;
  etaMinutes?: number;
  driver?: any;
}

export interface RideDriverLocationSocketPayload {
  rideId: string;
  driverId: string;
  latitude: number;
  longitude: number;
  distanceKm?: number;
  etaMinutes?: number;
  updatedAt?: string;
}

export interface FullRidePayload {
  rideId: string;
  status: RideStatus | string;
  rideType?: 'INSTANT' | 'SCHEDULED' | 'RECURRING' | string;
  scheduledAt?: string;
  pickup?: RideLocationSummary | any;
  dropoff?: RideLocationSummary | any;
  distanceKm?: number;
  distanceMiles?: number;
  durationMinutes?: number;
  etaMinutes?: number;
  routeSource?: string;
  fare?: number;
  totalFare?: number;
  payableFare?: number;
  discount?: number;
  promoCode?: string;
  passengerCount?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  paymentCollectedAt?: string;
  nextAction?: NextActionType;
  notes?: string;
  cancelReason?: string;
  cancelledBy?: string;
  recurringId?: string;
  vehicleType?: VehicleTypeSummary;
  passenger?: RidePassengerSummary;
  createdAt?: string;
  driverAssignedAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  [key: string]: any;
}

export type RideCompletedSocketPayload = FullRidePayload;
export type RidePaymentSocketPayload = FullRidePayload;

export interface RideCancelledSocketPayload {
  rideId: string;
  status: string;
  reason?: string;
  cancelledBy?: 'PASSENGER' | 'DRIVER' | 'SYSTEM' | string;
  cancelledAt?: string;
}

export interface DriverLocationEmitPayload {
  latitude: number;
  longitude: number;
  rideId?: string;
  heading?: number;
  speed?: number;
}

export interface DriverLocationAckResponse {
  success?: boolean;
  rideId?: string;
  driverId?: string;
  latitude?: number;
  longitude?: number;
  distanceKm?: number;
  etaMinutes?: number;
  updatedAt?: string;
  message?: string;
}
