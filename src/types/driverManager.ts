export type DriverStatus = 'ACTIVE' | 'INACTIVE' | 'ON_RIDE' | 'OFF_DUTY' | 'ALL';

export interface CompanyDriver {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phoneNumber: string;
  phone?: string; // fallback alias
  streetAddress?: string;
  city?: string;
  zipCode?: string;
  emergencyContactName?: string;
  emergencyPhone?: string;
  licenseNumber?: string;
  licenseClass?: string;
  expiryDate?: string;
  vehicleAssignment?: string;
  vehicleNumber?: string; // fallback alias
  vehicleType?: string;
  defaultAvailability?: string;
  dispatchPriority?: string;
  medallions?: string[];
  monHours?: string;
  tueHours?: string;
  wedHours?: string;
  thuHours?: string;
  friHours?: string;
  satHours?: string;
  sunHours?: string;
  bankName?: string;
  accountNumber?: string;
  routingCode?: string;
  status: DriverStatus | string;
  companyId?: string;
  companyName?: string;
  avatarUrl?: string;
  rating?: number;
  totalTrips?: number;
  joinedDate?: string;
  createdAt?: string;
  updatedAt?: string;
  licenseCopy?: string | File;
  insuranceProof?: string | File;
}

export interface CreateDriverPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  streetAddress?: string;
  city?: string;
  zipCode?: string;
  emergencyContactName?: string;
  emergencyPhone?: string;
  licenseNumber?: string;
  licenseClass?: string;
  expiryDate?: string;
  vehicleAssignment?: string;
  defaultAvailability?: string;
  dispatchPriority?: string;
  status?: string;
  companyId?: string;
  bankName?: string;
  accountNumber?: string;
  routingCode?: string;
  licenseCopy?: File | null;
  insuranceProof?: File | null;
}

export interface UpdateDriverPayload extends CreateDriverPayload {
  id: string;
}

export interface UpdateDriverStatusPayload {
  id: string;
  status: string;
}

export interface DriverQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  availability?: string;
  dispatchPriority?: string;
  licenseClass?: string;
  companyId?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
