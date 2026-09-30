import { axiosInstance } from "./axiosClient";
import type {
  ActiveRide,
  AcceptRidePayload,
  ArrivedPayload,
  DriverDutyPayload,
  DriverLocationPayload,
  StartRidePayload,
  CompleteRidePayload,
  CollectPaymentPayload,
  CancelRidePayload,
} from "@/types/booking";

// Helper to safely unwrap backend data
const unwrapData = (res: any) => {
  return res?.data?.data !== undefined ? res.data.data : res?.data;
};

//----------------------------- Driver Ride APIs-------------------------//
export const getDriverRideHome = async () => {
  try {
    const res = await axiosInstance.get("/driver-ride/home");
    // console.log("resp getDriverRideHome:", res?.data);
    return unwrapData(res);
  } catch (err: any) {
    if (err?.response?.status === 403 || err?.response?.status === 404) {
      console.warn("getDriverRideHome notice:", err?.response?.status, err?.response?.data?.message || '');
      return null;
    }
    throw err;
  }
};

export const getDriverRideDashboard = async () => {
  try {
    const res = await axiosInstance.get("/driver-ride/dashboard");
    // console.log("resp getDriverRideDashboard:", res?.data);
    return unwrapData(res);
  } catch (err: any) {
    if (err?.response?.status === 403 || err?.response?.status === 404) {
      console.warn("getDriverRideDashboard notice:", err?.response?.status, err?.response?.data?.message || '');
      return null;
    }
    throw err;
  }
};

export const updateDriverDuty = async (data: DriverDutyPayload | unknown) => {
  const res = await axiosInstance.patch("/driver-ride/duty", data);
  // console.log("resp updateDriverDuty:", res?.data);
  return unwrapData(res);
};

export const updateDriverLocation = async (data: DriverLocationPayload | unknown) => {
  const res = await axiosInstance.post("/driver-ride/location", data);
  // console.log("resp updateDriverLocation:", res?.data);
  return unwrapData(res);
};

export const createRideRequest = async (data: unknown) => {
  const res = await axiosInstance.post("/driver-ride/request", data);
  // console.log("resp createRideRequest:", res?.data);
  return unwrapData(res);
};

export const getRideRequests = async () => {
  try {
    const res = await axiosInstance.get("/driver-ride/requests");
    // console.log("resp getRideRequests:", res?.data);
    const data = unwrapData(res);
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.requests)) return data.requests;
    if (Array.isArray(data)) return data;
    return [];
  } catch (err: any) {
    console.warn("getRideRequests notice:", err?.response?.status, err?.response?.data?.message || '');
    return [];
  }
};

export const getRideRequestById = async (id: string) => {
  const res = await axiosInstance.get(`/driver-ride/requests/${id}`);
  // console.log("resp getRideRequestById:", res?.data);
  return unwrapData(res);
};

export const acceptRideRequest = async (data: AcceptRidePayload | unknown) => {
  const res = await axiosInstance.post("/driver-ride/accept", data);
  // console.log("resp acceptRideRequest:", res?.data);
  return unwrapData(res);
};

export const markDriverArrived = async (data: ArrivedPayload | unknown) => {
  const res = await axiosInstance.patch("/driver-ride/arrived", data);
  // console.log("resp markDriverArrived:", res?.data);
  return unwrapData(res);
};

export const startRide = async (data: StartRidePayload | unknown) => {
  const res = await axiosInstance.post("/driver-ride/start", data);
  // console.log("resp startRide:", res?.data);
  return unwrapData(res);
};

export const completeRide = async (data: CompleteRidePayload | unknown) => {
  const res = await axiosInstance.post("/driver-ride/complete", data);
  // console.log("resp completeRide:", res?.data);
  return unwrapData(res);
};

export const collectRidePayment = async (data: CollectPaymentPayload | unknown) => {
  const res = await axiosInstance.post(
    "/driver-ride/collect-payment",
    data
  );
  // console.log("resp collectRidePayment:", res?.data);
  return unwrapData(res);
};

export const cancelRide = async (data: CancelRidePayload | unknown) => {
  const res = await axiosInstance.patch("/driver-ride/cancel", data);
  // console.log("resp cancelR/ide:/", res?.data);
  return unwrapData(res);
};

export const getActiveRide = async (): Promise<ActiveRide | null> => {
  try {
    const res = await axiosInstance.get("/driver-ride/active");
    // console.log("resp getActiveRide (/driver-ride/active):", res?.data);
    return unwrapData(res);
  } catch (err: any) {
    if (err?.response?.status === 404 || err?.response?.status === 403) {
      try {
        const fallback = await axiosInstance.get("/ride/active");
        // console.log("resp getActiveRide fallback (/ride/active):", fallback?.data);
        return unwrapData(fallback);
      } catch {
        return null;
      }
    }
    return null;
  }
};

export const getRideHistory = async (params?: {
  status?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const queryParams: Record<string, any> = {};
    if (params?.status) queryParams.status = params.status;
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;

    const res = await axiosInstance.get("/driver-ride/history", {
      params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
    });
    // console.log("resp getRideHistory:", res?.data);
    const data = res?.data?.data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data)) return data;
    if (Array.isArray(res?.data?.items)) return res.data.items;
    if (Array.isArray(res?.data)) return res.data;
    return data?.items || data || [];
  } catch (err: any) {
    if (err?.response?.status === 404) {
      try {
        const fallback = await axiosInstance.get("/ride/my?page=1&limit=20");
        const data = fallback?.data?.data;
        if (Array.isArray(data?.items)) return data.items;
        if (Array.isArray(data)) return data;
        return data?.items || data || [];
      } catch {
        return [];
      }
    }
    throw err;
  }
};

export const getRideById = async (id: string) => {
  try {
    const res = await axiosInstance.get(`/driver-ride/rides/${id}`);
    // console.log("resp getRideById (/driver-ride/rides):", res?.data);
    return unwrapData(res);
  } catch (err: any) {
    if (err?.response?.status === 404) {
      try {
        const fallback = await axiosInstance.get(`/ride/${id}`);
        // console.log("resp getRideById fallback (/ride):", fallback?.data);
        return unwrapData(fallback);
      } catch {
        throw err;
      }
    }
    throw err;
  }
};

export const getDriverEarnings = async (range?: 'TODAY' | 'WEEK' | 'MONTH' | 'ALL' | string) => {
  const res = await axiosInstance.get("/driver-ride/earnings", {
    params: range ? { range } : undefined,
  });
  // console.log("resp getDriverEarnings:", res?.data);
  return unwrapData(res);
};