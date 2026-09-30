import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { Socket } from 'socket.io-client';
import { socketService } from '@/services/socketService';
import { useAuth } from '@/context/AuthContext';
import type {
  DriverLocationEmitPayload,
  DriverLocationAckResponse,
  RideRequestSocketPayload,
  RideTakenSocketPayload,
  RideStatusSocketPayload,
  RideDriverSocketPayload,
  RideCompletedSocketPayload,
  RidePaymentSocketPayload,
  RideCancelledSocketPayload,
  RideDriverLocationSocketPayload,
} from '@/types/socket';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connectionError: string | null;
  reconnect: () => void;
  sendDriverLocation: (
    data: DriverLocationEmitPayload,
    callback?: (response: DriverLocationAckResponse) => void
  ) => boolean;
  joinRide: (rideId: string) => boolean;
  onRideRequest: (callback: (data: RideRequestSocketPayload) => void) => () => void;
  onRideTaken: (callback: (data: RideTakenSocketPayload) => void) => () => void;
  onRideStatus: (callback: (data: RideStatusSocketPayload) => void) => () => void;
  onRideDriver: (callback: (data: RideDriverSocketPayload) => void) => () => void;
  onRideDriverLocation: (callback: (data: RideDriverLocationSocketPayload) => void) => () => void;
  onRideCompleted: (callback: (data: RideCompletedSocketPayload) => void) => () => void;
  onRidePayment: (callback: (data: RidePaymentSocketPayload) => void) => () => void;
  onRideCancelled: (callback: (data: RideCancelledSocketPayload) => void) => () => void;
  onRideCreated: (callback: (data: any) => void) => () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Reconnect logic
  const reconnect = useCallback(() => {
    const token =
      localStorage.getItem('accessToken') || localStorage.getItem('token');
    if (token && isAuthenticated) {
      socketService.connect(token);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Listen for connection changes
    const unsub = socketService.onConnectionChange((connected, err) => {
      setIsConnected(connected);
      if (err) {
        setConnectionError(err.message || 'Socket connection failed');
      } else if (connected) {
        setConnectionError(null);
      }
    });

    if (isAuthenticated) {
      reconnect();
    } else {
      socketService.disconnect();
      setIsConnected(false);
      setConnectionError(null);
    }

    return () => {
      unsub();
    };
  }, [isAuthenticated, reconnect]);

  // Handle App resume / browser visibility changes / online event
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated) {
        console.log('[Socket] App resumed, verifying socket connection...');
        if (!socketService.isConnected()) {
          reconnect();
        }
      }
    };

    const handleOnline = () => {
      if (isAuthenticated) {
        console.log('[Socket] Network online detected, reconnecting socket...');
        reconnect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);
    window.addEventListener('online', handleOnline);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
    };
  }, [isAuthenticated, reconnect]);

  const sendDriverLocation = useCallback(
    (
      data: DriverLocationEmitPayload,
      callback?: (response: DriverLocationAckResponse) => void
    ) => {
      return socketService.emitDriverLocation(data, callback);
    },
    []
  );

  const joinRide = useCallback((rideId: string) => {
    return socketService.emitJoinRide(rideId);
  }, []);

  const onRideRequest = useCallback(
    (callback: (data: RideRequestSocketPayload) => void) => {
      return socketService.onRideRequest(callback);
    },
    []
  );

  const onRideTaken = useCallback(
    (callback: (data: RideTakenSocketPayload) => void) => {
      return socketService.onRideTaken(callback);
    },
    []
  );

  const onRideStatus = useCallback(
    (callback: (data: RideStatusSocketPayload) => void) => {
      return socketService.onRideStatus(callback);
    },
    []
  );

  const onRideDriver = useCallback(
    (callback: (data: RideDriverSocketPayload) => void) => {
      return socketService.onRideDriver(callback);
    },
    []
  );

  const onRideDriverLocation = useCallback(
    (callback: (data: RideDriverLocationSocketPayload) => void) => {
      return socketService.onRideDriverLocation(callback);
    },
    []
  );

  const onRideCompleted = useCallback(
    (callback: (data: RideCompletedSocketPayload) => void) => {
      return socketService.onRideCompleted(callback);
    },
    []
  );

  const onRidePayment = useCallback(
    (callback: (data: RidePaymentSocketPayload) => void) => {
      return socketService.onRidePayment(callback);
    },
    []
  );

  const onRideCancelled = useCallback(
    (callback: (data: RideCancelledSocketPayload) => void) => {
      return socketService.onRideCancelled(callback);
    },
    []
  );

  const onRideCreated = useCallback((callback: (data: any) => void) => {
    return socketService.onRideCreated(callback);
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket: socketService.getSocket(),
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
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket(): SocketContextType {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
