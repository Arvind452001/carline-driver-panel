import { axiosInstance } from "./axiosClient";
import type {
  ActiveRide,
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
  const res = await axiosInstance.get("/driver-ride/home");
  console.log("resp getDriverRideHome:", res?.data);
  return unwrapData(res);
};

export const updateDriverDuty = async (data: DriverDutyPayload | unknown) => {
  const res = await axiosInstance.patch("/driver-ride/duty", data);
  console.log("resp updateDriverDuty:", res?.data);
  return unwrapData(res);
};

export const updateDriverLocation = async (data: DriverLocationPayload | unknown) => {
  const res = await axiosInstance.post("/driver-ride/location", data);
  console.log("resp updateDriverLocation:", res?.data);
  return unwrapData(res);
};

export const createRideRequest = async (data: unknown) => {
  const res = await axiosInstance.post("/driver-ride/request", data);
  console.log("resp createRideRequest:", res?.data);
  return unwrapData(res);
};

export const getRideRequestById = async (id: string) => {
  const res = await axiosInstance.get(`/driver-ride/requests/${id}`);
  console.log("resp getRideRequestById:", res?.data);
  return unwrapData(res);
};

export const acceptRideRequest = async (data: { rideRequestId?: string; rideId?: string; id?: string } | unknown) => {
  const res = await axiosInstance.post("/driver-ride/accept", data);
  console.log("resp acceptRideRequest:", res?.data);
  return unwrapData(res);
};

export const markDriverArrived = async (data: { rideId?: string; id?: string } | unknown) => {
  const res = await axiosInstance.patch("/driver-ride/arrived", data);
  console.log("resp markDriverArrived:", res?.data);
  return unwrapData(res);
};

export const startRide = async (data: StartRidePayload | unknown) => {
  const res = await axiosInstance.post("/driver-ride/start", data);
  console.log("resp startRide:", res?.data);
  return unwrapData(res);
};

export const completeRide = async (data: CompleteRidePayload | unknown) => {
  const res = await axiosInstance.post("/driver-ride/complete", data);
  console.log("resp completeRide:", res?.data);
  return unwrapData(res);
};

export const collectRidePayment = async (data: CollectPaymentPayload | unknown) => {
  const res = await axiosInstance.post(
    "/driver-ride/collect-payment",
    data
  );
  console.log("resp collectRidePayment:", res?.data);
  return unwrapData(res);
};

export const cancelRide = async (data: CancelRidePayload | unknown) => {
  const res = await axiosInstance.patch("/driver-ride/cancel", data);
  console.log("resp cancelRide:", res?.data);
  return unwrapData(res);
};

export const getActiveRide = async (): Promise<ActiveRide | null> => {
  const res = await axiosInstance.get("/driver-ride/active");
  console.log("resp getActiveRide:", res?.data);
  return unwrapData(res);
};

export const getRideHistory = async () => {
  const res = await axiosInstance.get("/driver-ride/history");
  console.log("resp getRideHistory:", res?.data);
  const data = res?.data?.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data)) return data;
  if (Array.isArray(res?.data?.items)) return res.data.items;
  if (Array.isArray(res?.data)) return res.data;
  return data?.items || data || [];
};

export const getRideById = async (id: string) => {
  const res = await axiosInstance.get(`/driver-ride/rides/${id}`);
  console.log("resp getRideById:", res?.data);
  return unwrapData(res);
};

export const getDriverEarnings = async () => {
  const res = await axiosInstance.get("/driver-ride/earnings");
  console.log("resp getDriverEarnings:", res?.data);
  return unwrapData(res);
};