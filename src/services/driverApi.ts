import { axiosInstance } from "./axiosClient";
import {
  CompanyDriver,
  CreateDriverPayload,
  UpdateDriverPayload,
  UpdateDriverStatusPayload,
  DriverQueryParams,
} from "@/types/driverManager";

// const getCompanyName = (companyId?: string) => {
//   if (!companyId) return 'General Transport';
//   const comp = MOCK_COMPANIES.find((c) => c.value === companyId);
//   return comp ? comp.label : 'General Transport';
// };

export const getCompanies = async () => {
  let res = await axiosInstance.get("/driver/companies/all");
  console.log("resp",res.data.data)
  return res.data.data;
};

// export const getCompanyName = getCompanies;

export const registerDriver = (payload: FormData) => {
  return axiosInstance.post("/driver/register", payload);
};


export const getDriverProfile = async () => {
  const response = await axiosInstance.get('/driver/profile');

  return response.data;
};

const payloadToFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    const val = data[key];
    if (val !== undefined && val !== null && val !== "") {
      if (val instanceof File) {
        formData.append(key, val);
      } else if (Array.isArray(val)) {
        val.forEach((item) => formData.append(key, item));
      } else {
        formData.append(key, String(val));
      }
    }
  });
  return formData;
};

export const driverApi = {
  /**
   * GET /driver/companies/all
   */
  // getCompanies: async () => {
  //   return getCompanies();
  // },

  /**
   * POST /driver/register
   */
  registerDriver: async (payload: FormData) => {
    return registerDriver(payload);
  },
  /**
   * GET /api/v1/company/drivers
   * Query params: page, limit, search, status, availability, dispatchPriority, licenseClass
   */
  getDrivers: async (params?: DriverQueryParams): Promise<CompanyDriver[]> => {
    const apiParams: Record<string, any> = {
      page: params?.page || 1,
      limit: params?.limit || 10,
    };
    if (params?.search) apiParams.search = params.search;
    if (params?.status && params.status !== "all" && params.status !== "ALL") {
      apiParams.status = params.status;
    }
    if (params?.availability) apiParams.availability = params.availability;
    if (params?.dispatchPriority)
      apiParams.dispatchPriority = params.dispatchPriority;
    if (params?.licenseClass) apiParams.licenseClass = params.licenseClass;

    const response = await axiosInstance.get("/api/v1/company/drivers", {
      params: apiParams,
    });
    const responseData = response.data;

    // Normalize API response (support direct array, response.data, or response.data.drivers)
    const list = Array.isArray(responseData)
      ? responseData
      : Array.isArray(responseData?.data)
        ? responseData.data
        : Array.isArray(responseData?.drivers)
          ? responseData.drivers
          : [];

    return list.map((d: any) => ({
      ...d,
      id: d.id || d._id || `drv-${Math.random().toString(36).substring(2, 7)}`,
      firstName: d.firstName || d.name?.split(" ")[0] || "",
      lastName: d.lastName || d.name?.split(" ").slice(1).join(" ") || "",
      fullName:
        d.fullName ||
        `${d.firstName || ""} ${d.lastName || ""}`.trim() ||
        d.name ||
        "Unnamed Driver",
      phoneNumber: d.phoneNumber || d.phone || "",
      companyName: d.companyName || d.companyId || "General Transport",
      status: d.status || "ACTIVE",
    }));
  },

  /**
   * GET /api/v1/company/drivers/{id}
   */
  getDriverById: async (id: string): Promise<CompanyDriver> => {
    const response = await axiosInstance.get(`/api/v1/company/drivers/${id}`);
    const d = response.data?.data || response.data;
    return {
      ...d,
      id: d.id || id,
      fullName:
        d.fullName ||
        `${d.firstName || ""} ${d.lastName || ""}`.trim() ||
        d.name ||
        "Unnamed Driver",
      phoneNumber: d.phoneNumber || d.phone || "",
      companyName: d.companyName || d.companyId || "General Transport",
    };
  },

  /**
   * POST /api/v1/company/drivers
   * Content-Type: multipart/form-data
   */
  createDriver: async (
    payload: CreateDriverPayload,
  ): Promise<CompanyDriver> => {
    const formData = payloadToFormData(payload);
    const response = await axiosInstance.post(
      "/api/v1/company/drivers",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    const created = response.data?.data || response.data;
    return {
      ...created,
      fullName:
        created.fullName ||
        `${created.firstName || payload.firstName} ${created.lastName || payload.lastName}`.trim(),
      phoneNumber: created.phoneNumber || created.phone || payload.phoneNumber,
      companyName:
        created.companyName ||
        created.companyId ||
        payload.companyId ||
        "General Transport",
    };
  },

  /**
   * PUT /api/v1/company/drivers
   * Content-Type: multipart/form-data
   */
  updateDriver: async (
    payload: UpdateDriverPayload,
  ): Promise<CompanyDriver> => {
    const formData = payloadToFormData(payload);
    const response = await axiosInstance.put(
      "/api/v1/company/drivers",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    const updated = response.data?.data || response.data;
    return {
      ...updated,
      fullName:
        updated.fullName ||
        `${updated.firstName || payload.firstName} ${updated.lastName || payload.lastName}`.trim(),
      phoneNumber: updated.phoneNumber || updated.phone || payload.phoneNumber,
      companyName:
        updated.companyName ||
        updated.companyId ||
        payload.companyId ||
        "General Transport",
    };
  },

  /**
   * DELETE /api/v1/company/drivers/{id}
   */
  deleteDriver: async (
    id: string,
  ): Promise<{ success: boolean; message?: string }> => {
    const response = await axiosInstance.delete(
      `/api/v1/company/drivers/${id}`,
    );
    return response.data || { success: true };
  },

  /**
   * PATCH /api/v1/company/drivers/status
   * JSON payload: { id: string, status: string }
   */
  updateDriverStatus: async (
    payload: UpdateDriverStatusPayload,
  ): Promise<CompanyDriver> => {
    const response = await axiosInstance.patch(
      "/api/v1/company/drivers/status",
      {
        id: payload.id,
        status: payload.status,
      },
    );
    return response.data?.data || response.data;
  },

  /**
   * POST /api/v1/company/drivers/{id}/resend-credentials
   */
  resendDriverCredentials: async (
    id: string,
  ): Promise<{ success: boolean; message?: string }> => {
    const response = await axiosInstance.post(
      `/api/v1/company/drivers/${id}/resend-credentials`,
    );
    return (
      response.data || {
        success: true,
        message: "Credentials sent successfully",
      }
    );
  },
};
