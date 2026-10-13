import { useEffect, useRef, useState, useCallback } from 'react';
import { updateDriverLocation } from '@/services/DriverBooking';
import type { DriverLocationEmitPayload, DriverLocationAckResponse } from '@/types/socket';

export interface LocationCoords {
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  accuracy?: number;
}

export type LocationPermissionState = 'prompt' | 'granted' | 'denied' | 'unavailable';

export interface UseDriverLocationTrackerOptions {
  isOnline: boolean;
  activeRideId?: string | null;
  isSocketConnected: boolean;
  sendSocketLocation: (
    data: DriverLocationEmitPayload,
    callback?: (response: DriverLocationAckResponse) => void
  ) => boolean;
  throttleMs?: number; // default 3500ms
  onLocationUpdate?: (coords: LocationCoords) => void;
  onError?: (error: string) => void;
}

export function useDriverLocationTracker({
  isOnline,
  activeRideId,
  isSocketConnected,
  sendSocketLocation,
  throttleMs = 3500,
  onLocationUpdate,
  onError,
}: UseDriverLocationTrackerOptions) {
  const [currentCoords, setCurrentCoords] = useState<LocationCoords | null>(null);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [permissionState, setPermissionState] = useState<LocationPermissionState>('prompt');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [lastSentAt, setLastSentAt] = useState<number | null>(null);
  const [lastSentMode, setLastSentMode] = useState<'socket' | 'rest' | null>(null);

  // Refs for tracking lifecycle
  const watchIdRef = useRef<number | null>(null);
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastEmittedCoordsRef = useRef<{ lat: number; lng: number; time: number } | null>(null);
  const isRestSyncingRef = useRef<boolean>(false);
  const isOnlineRef = useRef<boolean>(isOnline);
  const activeRideIdRef = useRef<string | null>(activeRideId || null);
  const isSocketConnectedRef = useRef<boolean>(isSocketConnected);

  // Keep refs up-to-date to avoid stale closures in watch callbacks
  useEffect(() => {
    isOnlineRef.current = isOnline;
  }, [isOnline]);

  useEffect(() => {
    activeRideIdRef.current = activeRideId || null;
  }, [activeRideId]);

  useEffect(() => {
    isSocketConnectedRef.current = isSocketConnected;
  }, [isSocketConnected]);

  // Haversine distance calculator in meters to avoid emitting sub-meter jitter
  const calculateDistanceMeters = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371e3; // Earth's radius in meters
    const rad = Math.PI / 180;
    const dLat = (lat2 - lat1) * rad;
    const dLon = (lon2 - lon1) * rad;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Dispatch location update over Socket (primary) or REST API (fallback)
  const dispatchLocationUpdate = useCallback(
    async (coords: LocationCoords) => {
      const now = Date.now();
      const currentActiveRideId = activeRideIdRef.current;
      const lastEmitted = lastEmittedCoordsRef.current;

      // Filter jitter / redundant stationary pings if sent very recently (< throttleMs)
      if (lastEmitted) {
        const timeDiff = now - lastEmitted.time;
        const distanceMoved = calculateDistanceMeters(
          lastEmitted.lat,
          lastEmitted.lng,
          coords.latitude,
          coords.longitude
        );

        // If moved less than 2 meters and less than 5 seconds passed since last heartbeat, skip
        if (distanceMoved < 2 && timeDiff < 5000) {
          return;
        }

        // Enforce throttle interval
        if (timeDiff < throttleMs) {
          return;
        }
      }

      const payload: DriverLocationEmitPayload = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        ...(currentActiveRideId ? { rideId: currentActiveRideId } : {}),
        ...(coords.heading !== undefined ? { heading: coords.heading } : {}),
        ...(coords.speed !== undefined ? { speed: coords.speed } : {}),
      };

      // 1. Primary: Socket.IO
      if (isSocketConnectedRef.current) {
        const emitted = sendSocketLocation(payload);
        if (emitted) {
          lastEmittedCoordsRef.current = {
            lat: coords.latitude,
            lng: coords.longitude,
            time: now,
          };
          setLastSentAt(now);
          setLastSentMode('socket');
          return;
        }
      }

      // 2. Fallback: REST API (used when WebSockets connection is offline)
      if (!isRestSyncingRef.current) {
        // Enforce minimum 4.5s spacing for HTTP requests to prevent flooding
        if (lastEmitted && now - lastEmitted.time < 4500) {
          return;
        }

        isRestSyncingRef.current = true;
        try {
          await updateDriverLocation({
            latitude: coords.latitude,
            longitude: coords.longitude,
            ...(currentActiveRideId ? { rideId: currentActiveRideId } : {}),
            heading: coords.heading,
            speed: coords.speed,
            accuracy: coords.accuracy,
          });

          lastEmittedCoordsRef.current = {
            lat: coords.latitude,
            lng: coords.longitude,
            time: now,
          };
          setLastSentAt(now);
          setLastSentMode('rest');
        } catch (err: any) {
          console.warn('[LocationTracker] REST fallback sync warning:', err?.message || err);
        } finally {
          isRestSyncingRef.current = false;
        }
      }
    },
    [sendSocketLocation, throttleMs]
  );

  // Position processing handler
  const handlePositionSuccess = useCallback(
    (position: GeolocationPosition) => {
      const coords: LocationCoords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        heading: position.coords.heading ?? undefined,
        speed: position.coords.speed ?? undefined,
        accuracy: position.coords.accuracy ?? undefined,
      };

      setCurrentCoords(coords);
      setLocationError(null);
      setPermissionState('granted');
      onLocationUpdate?.(coords);

      // Only dispatch if driver is online OR actively on a ride
      if (isOnlineRef.current || activeRideIdRef.current) {
        dispatchLocationUpdate(coords);
      }
    },
    [dispatchLocationUpdate, onLocationUpdate]
  );

  const handlePositionError = useCallback(
    (err: GeolocationPositionError) => {
      let message = 'An error occurred while retrieving your location.';
      if (err.code === err.PERMISSION_DENIED) {
        message = 'Location permission denied. Please allow location access in your browser settings to receive and execute rides.';
        setPermissionState('denied');
      } else if (err.code === err.POSITION_UNAVAILABLE) {
        message = 'GPS position unavailable. Please ensure your device GPS/Location service is turned on.';
      } else if (err.code === err.TIMEOUT) {
        message = 'GPS location request timed out. Retrying...';
      }

      setLocationError(message);
      onError?.(message);
    },
    [onError]
  );

  // Start / Stop Geolocation Watcher
  useEffect(() => {
    // Determine whether GPS tracking should be active
    const shouldTrack = Boolean(isOnline || activeRideId);

    if (!shouldTrack) {
      if (watchIdRef.current !== null) {
        navigator.geolocation?.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
      setIsTracking(false);
      return;
    }

    if (!('geolocation' in navigator)) {
      setPermissionState('unavailable');
      setLocationError('Geolocation is not supported by your browser.');
      setIsTracking(false);
      return;
    }

    setIsTracking(true);

    const geoOptions: PositionOptions = {
      enableHighAccuracy: true,
      maximumAge: 3000,
      timeout: 10000,
    };

    // Immediate single position query
    navigator.geolocation.getCurrentPosition(
      handlePositionSuccess,
      handlePositionError,
      geoOptions
    );

    // Continuous watch position
    if (watchIdRef.current === null) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        handlePositionSuccess,
        handlePositionError,
        geoOptions
      );
    }

    // Periodic heartbeat every 4 seconds to guarantee consistent 3-5s emission even when stationary
    if (!heartbeatIntervalRef.current) {
      heartbeatIntervalRef.current = setInterval(() => {
        if (isOnlineRef.current || activeRideIdRef.current) {
          navigator.geolocation.getCurrentPosition(
            handlePositionSuccess,
            () => {},
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 3000 }
          );
        }
      }, 4000);
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation?.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
      setIsTracking(false);
    };
  }, [isOnline, activeRideId, handlePositionSuccess, handlePositionError]);

  // Manual refresh / retry helper
  const retryLocation = useCallback(() => {
    if (!('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      handlePositionSuccess,
      handlePositionError,
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [handlePositionSuccess, handlePositionError]);

  return {
    currentCoords,
    isTracking,
    permissionState,
    locationError,
    lastSentAt,
    lastSentMode,
    retryLocation,
  };
}
