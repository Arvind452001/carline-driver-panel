export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  rating?: number;
  totalTrips?: number;
  todayEarnings?: number;
  onlineHours?: string;
  status?: string;
  joinedDate?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  employmentType?: string;
  preferredServiceArea?: string;
  fuelType?: string;
  transmission?: string;
  isActive?: boolean;
  isVerified?: boolean;
  role?: string;
  governmentIdUrl?: string;
  licenseCopyUrl?: string;
  vehicleRegistrationDocUrl?: string;
  insuranceProofUrl?: string;
  emergencyContact?: {
    name: string;
    phone: string;
  };
  vehicle?: {
    registrationNumber?: string;
    type?: string;
    make?: string;
    model?: string;
    year?: string | number;
    color?: string;
  };
  license?: {
    number?: string;
    class?: string;
    issueDate?: string;
    expiryDate?: string;
    verified?: boolean;
  };
  documents?: {
    id?: { name: string; verified: boolean };
    license?: { name: string; verified: boolean };
    registration?: { name: string; verified: boolean };
    insurance?: { name: string; verified: boolean };
  };
  bank?: {
    accountHolder?: string;
    bank?: string;
    accountNumber?: string;
    ifsc?: string;
  };
  company?: {
    _id?: string;
    legalName?: string;
    status?: string;
    address?: {
      streetAddress?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
      timezone?: string;
    };
  };
}