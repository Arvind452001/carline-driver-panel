import { useEffect, useState, useCallback, useRef } from 'react';
import { useSocket } from '@/context/SocketContext';
import Swal from 'sweetalert2';
import type {
  ActiveRide,
  RideRequest,
} from '@/types/booking';
import type {
  NextActionType,
  RideRequestSocketPayload,
  RideTakenSocketPayload,
  RideStatusSocketPayload,
  RideDriverSocketPayload,
  RideCompletedSocketPayload,
  RidePaymentSocketPayload,
  RideCancelledSocketPayload,
  DriverLocationAckResponse,
} from '@/types/socket';

interface UseRideSocketOptions {
  onNewRequest?: (req: RideRequestSocketPayload) => void;
  onRequestTaken?: (data: RideTakenSocketPayload) => void;
  onStatusChange?: (data: RideStatusSocketPayload) => void;
  onTripDriver?: (data: RideDriverSocketPayload) => void;
  onTripCompleted?: (data: RideCompletedSocketPayload) => void;
  onTripPayment?: (data: RidePaymentSocketPayload) => void;
  onTripCancelled?: (data: RideCancelledSocketPayload) => void;
}

export function useRideSocket(options: UseRideSocketOptions = {}) {
  const {
    socket,
    isConnected,
    connectionError,
    reconnect,
    sendDriverLocation,
    joinRide,
    onRideRequest,
    onRideTaken,
    onRideStatus,
    onRideDriver,
    onRideDriverLocation,
    onRideCompleted,
    onRidePayment,
    onRideCancelled,
    onRideCreated,
  } = useSocket();

  const [activeRide, setActiveRide] = useState<ActiveRide | null>(null);
  const [pendingRequests, setPendingRequests] = useState<RideRequest[]>([]);
  const [nextAction, setNextAction] = useState<NextActionType>(null);
  const [lastLocationAck, setLastLocationAck] = useState<DriverLocationAckResponse | null>(null);

  const activeRideRef = useRef<ActiveRide | null>(activeRide);
  useEffect(() => {
    activeRideRef.current = activeRide;
  }, [activeRide]);

  // Derive nextAction from ride status if not explicitly sent
  const deriveNextAction = (status?: string): NextActionType => {
    if (!status) return null;
    const s = status.toUpperCase();
    if (s === 'ACCEPTED' || s === 'DRIVER_ASSIGNED') return 'MARK_ARRIVED';
    if (s === 'ARRIVED' || s === 'DRIVER_ARRIVED') return 'START_TRIP';
    if (s === 'STARTED' || s === 'RIDE_STARTED' || s === 'IN_PROGRESS') return 'END_TRIP';
    if (s === 'COMPLETED' || s === 'RIDE_COMPLETED' || s === 'PAYMENT_PENDING') return 'COLLECT_PAYMENT';
    return null;
  };

  // 1. Listen for new ride requests
  useEffect(() => {
    const unsub = onRideRequest((req) => {
      console.log('[Socket] Incoming ride:request', req);
      const reqId = req.rideId || req.requestId || req.id || req._id;

      setPendingRequests((prev) => {
        const exists = prev.some((r) => (r.id || r._id || r.rideId) === reqId);
        if (exists) return prev;
        return [req, ...prev];
      });

      // Show instant toast notification
      try {
        const pPickup =
          typeof req.pickup === 'string'
            ? req.pickup
            : (req.pickup as any)?.address || (req as any).pickupAddress || 'Pickup address';
        const pDrop =
          typeof (req as any).dropoff === 'string'
            ? (req as any).dropoff
            : (req as any).dropoff?.address ||
              (typeof (req as any).drop === 'string'
                ? (req as any).drop
                : (req as any).drop?.address || (req as any).dropAddress || 'Dropoff destination');
        const fare =
          req.payableFare ??
          req.totalFare ??
          (typeof req.fare === 'number'
            ? req.fare
            : (req.fare as any)?.payableFare ?? (req.fare as any)?.totalFare) ??
          req.estimatedFare ??
          0;
        const dist = req.distanceKm ?? req.distance ?? (req as any).distanceMiles ?? 0;

        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'info',
          title: '🔔 New Ride Request!',
          html: `<div class="text-xs text-left leading-relaxed"><b>Pickup:</b> ${pPickup}<br/><b>Dropoff:</b> ${pDrop}<br/><b>Distance:</b> ${dist} km • <b>Fare:</b> ₹${fare}</div>`,
          showConfirmButton: false,
          timer: 7000,
          timerProgressBar: true,
        });
      } catch (e) {
        console.error('Error showing request toast', e);
      }

      options.onNewRequest?.(req);
    });

    return () => {
      unsub();
    };
  }, [onRideRequest, options]);

  // 2. Listen for ride:taken (another driver accepted)
  useEffect(() => {
    const unsub = onRideTaken((data) => {
      console.log('[Socket] ride:taken event', data);
      setPendingRequests((prev) =>
        prev.filter((r) => (r.id || r._id || r.rideId) !== data.rideId)
      );

      options.onRequestTaken?.(data);
    });

    return () => {
      unsub();
    };
  }, [onRideTaken, options]);

  // 3. Listen for ride:status
  useEffect(() => {
    const unsub = onRideStatus((data) => {
      console.log('[Socket] ride:status event', data);
      const { rideId, status, nextAction: serverNextAction, etaMinutes } = data;

      if (serverNextAction) {
        setNextAction(serverNextAction);
      } else {
        setNextAction(deriveNextAction(status));
      }

      setActiveRide((prev) => {
        if (!prev) return prev;
        const currentId = prev.id || prev._id || prev.rideId;
        if (currentId && currentId !== rideId) return prev;
        return {
          ...prev,
          status,
          ...(etaMinutes !== undefined ? { estimatedDuration: etaMinutes } : {}),
        };
      });

      options.onStatusChange?.(data);
    });

    return () => {
      unsub();
    };
  }, [onRideStatus, options]);

  // 3b. Listen for ride:driver (assigned / driver assigned refresh)
  useEffect(() => {
    const unsub = onRideDriver((data) => {
      console.log('[Socket] ride:driver event', data);
      const { rideId, status, etaMinutes, driver } = data;

      setActiveRide((prev) => {
        if (!prev) return prev;
        const currentId = prev.id || prev._id || prev.rideId;
        if (currentId && currentId !== rideId) return prev;
        return {
          ...prev,
          ...(status ? { status } : {}),
          ...(etaMinutes !== undefined ? { estimatedDuration: etaMinutes } : {}),
          ...(driver ? { driver } : {}),
        };
      });

      options.onTripDriver?.(data);
    });

    return () => {
      unsub();
    };
  }, [onRideDriver, options]);

  // 4. Listen for ride:driverLocation
  useEffect(() => {
    const unsub = onRideDriverLocation((data) => {
      console.log('[Socket] ride:driverLocation event', data);
      if (data.etaMinutes !== undefined) {
        setActiveRide((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            estimatedDuration: data.etaMinutes,
            actualDistance: data.distanceKm ?? prev.actualDistance,
          };
        });
      }
    });

    return () => {
      unsub();
    };
  }, [onRideDriverLocation]);

  // 5. Listen for ride:completed
  useEffect(() => {
    const unsub = onRideCompleted((data) => {
      console.log('[Socket] ride:completed event', data);
      const serverNext = data.nextAction || deriveNextAction(data.status || 'COMPLETED');
      setNextAction(serverNext);

      setActiveRide((prev) => {
        const base = prev || ({} as ActiveRide);
        return {
          ...base,
          ...data,
          id: data.rideId || base.id || base.rideId,
          rideId: data.rideId || base.rideId,
          status: data.status || 'COMPLETED',
          fare: data.payableFare ?? data.totalFare ?? data.fare ?? base.fare,
          paymentStatus: data.paymentStatus || base.paymentStatus || 'PENDING',
          completedAt: data.completedAt || new Date().toISOString(),
        };
      });

      options.onTripCompleted?.(data);
    });

    return () => {
      unsub();
    };
  }, [onRideCompleted, options]);

  // 6. Listen for ride:payment
  useEffect(() => {
    const unsub = onRidePayment((data) => {
      console.log('[Socket] ride:payment event', data);
      if (data.nextAction !== undefined) {
        setNextAction(data.nextAction);
      }

      setActiveRide((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          ...data,
          id: data.rideId || prev.id || prev.rideId,
          rideId: data.rideId || prev.rideId,
          paymentStatus: data.paymentStatus || 'PAID',
          status: data.status || prev.status,
        };
      });

      options.onTripPayment?.(data);
    });

    return () => {
      unsub();
    };
  }, [onRidePayment, options]);

  // 7. Listen for ride:cancelled
  useEffect(() => {
    const unsub = onRideCancelled((data) => {
      console.log('[Socket] ride:cancelled event', data);
      const cancelledId = data.rideId;

      setPendingRequests((prev) =>
        prev.filter((r) => (r.id || r._id || r.rideId) !== cancelledId)
      );

      setActiveRide((prev) => {
        const currentId = prev?.id || prev?._id || prev?.rideId;
        if (currentId === cancelledId) {
          return {
            ...prev,
            status: 'CANCELLED',
            cancellationReason: data.reason,
          };
        }
        return prev;
      });

      Swal.fire({
        icon: 'warning',
        title: 'Ride Cancelled',
        text: `Ride was cancelled by ${data.cancelledBy || 'user'}${data.reason ? ': ' + data.reason : ''}`,
        confirmButtonColor: '#FF5B26',
      });

      options.onTripCancelled?.(data);
    });

    return () => {
      unsub();
    };
  }, [onRideCancelled, options]);

  // 8. Listen for ride:created
  useEffect(() => {
    const unsub = onRideCreated((data) => {
      console.log('[Socket] ride:created event', data);
    });

    return () => {
      unsub();
    };
  }, [onRideCreated]);

  // Emit current driver location helper
  const emitLocation = useCallback(
    (coords: { latitude: number; longitude: number; heading?: number; speed?: number }) => {
      const currentRideId =
        activeRideRef.current?.rideId ||
        activeRideRef.current?.id ||
        activeRideRef.current?._id;

      sendDriverLocation(
        {
          latitude: coords.latitude,
          longitude: coords.longitude,
          rideId: currentRideId,
          heading: coords.heading,
          speed: coords.speed,
        },
        (ack) => {
          if (ack) {
            setLastLocationAck(ack);
          }
        }
      );
    },
    [sendDriverLocation]
  );

  return {
    socket,
    isConnected,
    connectionError,
    reconnect,
    activeRide,
    setActiveRide,
    pendingRequests,
    setPendingRequests,
    nextAction,
    setNextAction,
    lastLocationAck,
    emitLocation,
    joinRide,
  };
}
