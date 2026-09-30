import { io, Socket } from 'socket.io-client';
import type {
  DriverLocationEmitPayload,
  DriverLocationAckResponse,
  RideRequestSocketPayload,
  RideTakenSocketPayload,
  RideStatusSocketPayload,
  RideDriverLocationSocketPayload,
  RideCompletedSocketPayload,
  RidePaymentSocketPayload,
  RideCancelledSocketPayload,
  RideDriverSocketPayload,
} from '@/types/socket';

const DEFAULT_SOCKET_ORIGIN = 'https://node.aitechnotech.in';
const DEFAULT_SOCKET_PATH = '/carlinee/viamo/socket.io';

const SOCKET_ORIGIN =
  import.meta.env.VITE_SOCKET_ORIGIN || DEFAULT_SOCKET_ORIGIN;
const SOCKET_PATH =
  import.meta.env.VITE_SOCKET_PATH || DEFAULT_SOCKET_PATH;

class SocketService {
  private socket: Socket | null = null;
  private currentToken: string | null = null;
  private isConnecting = false;
  private connectionListeners: Array<(connected: boolean, err?: Error) => void> = [];

  /**
   * Initializes and connects to the socket server
   * @param token JWT auth token
   */
  public connect(token?: string): Socket | null {
    const activeToken =
      token ||
      localStorage.getItem('accessToken') ||
      localStorage.getItem('token');

    if (!activeToken) {
      console.warn('[Socket] No authentication token available. Connection deferred.');
      this.disconnect();
      return null;
    }

    // Clean Bearer prefix if present for socket auth token
    const cleanToken = activeToken.startsWith('Bearer ')
      ? activeToken.slice(7)
      : activeToken;

    // If already connected or connecting with the same token, reuse existing socket
    if (this.socket && (this.socket.connected || this.isConnecting) && this.currentToken === cleanToken) {
      return this.socket;
    }

    // Disconnect previous instance if token changed
    if (this.socket) {
      this.disconnect();
    }

    this.currentToken = cleanToken;
    this.isConnecting = true;

    console.log(`[Socket] Connecting to ${SOCKET_ORIGIN} with path ${SOCKET_PATH}`);

    this.socket = io(SOCKET_ORIGIN, {
      path: SOCKET_PATH,
      transports: ['websocket'],
      auth: {
        token: cleanToken,
      },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    this.setupInternalHandlers();
    return this.socket;
  }

  private setupInternalHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.isConnecting = false;
      console.log(`[Socket] Connected successfully with ID: ${this.socket?.id}`);
      this.notifyConnectionListeners(true);
    });

    this.socket.on('connect_error', (error) => {
      this.isConnecting = false;
      console.error('[Socket] Connection error:', error.message);
      this.notifyConnectionListeners(false, error);
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnecting = false;
      console.warn('[Socket] Disconnected:', reason);
      this.notifyConnectionListeners(false);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`[Socket] Reconnected after ${attemptNumber} attempts`);
      this.notifyConnectionListeners(true);
    });
  }

  public disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
    this.currentToken = null;
    this.isConnecting = false;
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  public getIsConnecting(): boolean {
    return this.isConnecting;
  }

  public isConnected(): boolean {
    return Boolean(this.socket?.connected);
  }

  public onConnectionChange(listener: (connected: boolean, err?: Error) => void): () => void {
    this.connectionListeners.push(listener);
    // Initial call
    listener(this.isConnected());
    return () => {
      this.connectionListeners = this.connectionListeners.filter((l) => l !== listener);
    };
  }

  private notifyConnectionListeners(connected: boolean, err?: Error) {
    this.connectionListeners.forEach((listener) => {
      try {
        listener(connected, err);
      } catch (e) {
        console.error('[Socket] Error in connection listener:', e);
      }
    });
  }

  // ----------------------------------------------------
  // DRIVER EMITS (Driver -> Server)
  // ----------------------------------------------------

  /**
   * Emit Driver Location to server
   * Emits `driverLocation` event with `{ rideId, latitude, longitude }`
   */
  public emitDriverLocation(
    data: DriverLocationEmitPayload,
    callback?: (response: DriverLocationAckResponse) => void
  ): boolean {
    if (!this.socket || !this.socket.connected) {
      return false;
    }

    const payload: DriverLocationEmitPayload = {
      latitude: data.latitude,
      longitude: data.longitude,
      ...(data.rideId ? { rideId: data.rideId } : {}),
      ...(data.heading !== undefined ? { heading: data.heading } : {}),
      ...(data.speed !== undefined ? { speed: data.speed } : {}),
    };

    if (callback) {
      this.socket.emit('driverLocation', payload, callback);
    } else {
      this.socket.emit('driverLocation', payload);
    }
    return true;
  }

  /**
   * Optional manual join to ride room (server usually auto-joins on connect)
   */
  public emitJoinRide(rideId: string): boolean {
    if (!this.socket || !this.socket.connected || !rideId) return false;
    this.socket.emit('joinRide', { rideId });
    return true;
  }

  // ----------------------------------------------------
  // EVENT LISTENERS (Server -> Driver App)
  // ----------------------------------------------------

  /**
   * 1. ride:request - New incoming ride request for drivers of that vehicle type
   */
  public onRideRequest(callback: (data: RideRequestSocketPayload) => void): () => void {
    if (!this.socket) return () => {};
    this.socket.on('ride:request', callback);
    return () => {
      this.socket?.off('ride:request', callback);
    };
  }

  /**
   * 2. ride:taken - Broadcast when another driver has accepted the request
   */
  public onRideTaken(callback: (data: RideTakenSocketPayload) => void): () => void {
    if (!this.socket) return () => {};
    this.socket.on('ride:taken', callback);
    return () => {
      this.socket?.off('ride:taken', callback);
    };
  }

  /**
   * 3. ride:status - Status change updates and nextAction
   */
  public onRideStatus(callback: (data: RideStatusSocketPayload) => void): () => void {
    if (!this.socket) return () => {};
    this.socket.on('ride:status', callback);
    return () => {
      this.socket?.off('ride:status', callback);
    };
  }

  /**
   * 4. ride:driver - Driver info update / assigned card
   */
  public onRideDriver(callback: (data: RideDriverSocketPayload) => void): () => void {
    if (!this.socket) return () => {};
    this.socket.on('ride:driver', callback);
    return () => {
      this.socket?.off('ride:driver', callback);
    };
  }

  /**
   * 5. ride:driverLocation - Location update and ETA changes
   */
  public onRideDriverLocation(
    callback: (data: RideDriverLocationSocketPayload) => void
  ): () => void {
    if (!this.socket) return () => {};
    this.socket.on('ride:driverLocation', callback);
    return () => {
      this.socket?.off('ride:driverLocation', callback);
    };
  }

  /**
   * 6. ride:completed - Trip completion event
   */
  public onRideCompleted(callback: (data: RideCompletedSocketPayload) => void): () => void {
    if (!this.socket) return () => {};
    this.socket.on('ride:completed', callback);
    return () => {
      this.socket?.off('ride:completed', callback);
    };
  }

  /**
   * 7. ride:payment - Payment received event
   */
  public onRidePayment(callback: (data: RidePaymentSocketPayload) => void): () => void {
    if (!this.socket) return () => {};
    this.socket.on('ride:payment', callback);
    return () => {
      this.socket?.off('ride:payment', callback);
    };
  }

  /**
   * 8. ride:cancelled - Ride cancellation event
   */
  public onRideCancelled(callback: (data: RideCancelledSocketPayload) => void): () => void {
    if (!this.socket) return () => {};
    this.socket.on('ride:cancelled', callback);
    return () => {
      this.socket?.off('ride:cancelled', callback);
    };
  }

  /**
   * 9. ride:created - Ride created / summary + otp
   */
  public onRideCreated(callback: (data: any) => void): () => void {
    if (!this.socket) return () => {};
    this.socket.on('ride:created', callback);
    return () => {
      this.socket?.off('ride:created', callback);
    };
  }
}

export const socketService = new SocketService();
export default socketService;
