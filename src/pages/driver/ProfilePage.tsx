import { useState, useEffect } from 'react';
import {
  Edit3,
  Save,
  X,
  FileText,
  ExternalLink,
  Building2,
  Car,
  ShieldCheck,
  User,
} from 'lucide-react';

import { api } from '@/services/api';
import { Driver } from '@/types/driver';
import { getDriverProfile } from '@/services/driverApi';
import Swal from 'sweetalert2';

interface FieldProps {
  label: string;
  value: string | number | undefined | null;
  onChange: (val: string) => void;
  type?: string;
  editing: boolean;
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  editing,
}: FieldProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">
        {label}
      </label>

      {editing ? (
        <input
          type={type}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10"
        />
      ) : (
        <p className="text-sm font-medium text-gray-800 break-words">
          {value !== undefined && value !== null && value !== ''
            ? value
            : '—'}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   API RESPONSE TYPES
========================================================= */

interface DriverProfileResponse {
  _id: string;

  fullName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  email: string;

  companyId: string;

  licenseNumber: string;
  licenseClass: string;
  issueDate: string;
  expiryDate: string;

  employmentType: string;
  preferredServiceArea: string;

  vehicleType: string;
  fuelType: string;
  transmission: string;
  vehicleRegistrationNumber: string;
  make: string;
  modelAndYear: string;

  governmentIdUrl?: string;
  licenseCopyUrl?: string;
  vehicleRegistrationDocUrl?: string;
  insuranceProofUrl?: string;

  termsAccepted: boolean;

  status: string;
  role: string;

  avatar?: string;

  isVerified: boolean;
  isActive: boolean;

  rejectionReason?: string | null;
  isPasswordReset: boolean;

  createdAt: string;
  updatedAt: string;

  company?: {
    _id: string;
    legalName: string;
    status: string;

    address?: {
      streetAddress: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      timezone: string;
    };

    branding?: {
      logo?: string;
      brandColor?: string;
      displayNameOverride?: string;
    };
  };
}

/* =========================================================
   MAP API DATA -> UI DRIVER DATA
========================================================= */

const mapDriverProfileToDriver = (
  data: DriverProfileResponse
): Driver => {
  return {
    id: data._id,
    ...data,

    // -----------------------------------------
    // Personal
    // -----------------------------------------
    name: data.fullName,
    phone: data.phoneNumber,

    // -----------------------------------------
    // Address
    // -----------------------------------------
    address: data.company?.address
      ? [
          data.company.address.streetAddress,
          data.company.address.city,
          data.company.address.state,
          data.company.address.zipCode,
          data.company.address.country,
        ]
          .filter(Boolean)
          .join(', ')
      : '',

    // -----------------------------------------
    // Vehicle
    // -----------------------------------------
    vehicle: {
      registrationNumber: data.vehicleRegistrationNumber,
      type: data.vehicleType,
      make: data.make,
      model: data.modelAndYear,
      year:
        data.modelAndYear?.match(/\d{4}/)?.[0] || '',
      color: '',
    },

    // -----------------------------------------
    // License
    // -----------------------------------------
    license: {
      number: data.licenseNumber,
      class: data.licenseClass,
      issueDate: data.issueDate,
      expiryDate: data.expiryDate,
      verified: data.isVerified,
    },

    // -----------------------------------------
    // Bank
    // API doesn't currently return bank details
    // -----------------------------------------
    bank: {
      accountHolder: '',
      bank: '',
      accountNumber: '',
      ifsc: '',
    },
  } as unknown as Driver;
};

/* =========================================================
   UPDATE PAYLOAD
========================================================= */

const buildUpdatePayload = (form: Driver) => {
  return {
    fullName: form.name,

    dateOfBirth: form.dateOfBirth,

    gender: (form as any).gender,

    phoneNumber: form.phone,

    email: form.email,

    licenseNumber: form.license?.number,

    licenseClass: form.license?.class,

    issueDate: form.license?.issueDate,

    expiryDate: form.license?.expiryDate,

    employmentType: (form as any).employmentType,

    preferredServiceArea: (form as any).preferredServiceArea,

    vehicleType: form.vehicle?.type,

    fuelType: (form as any).fuelType,

    transmission: (form as any).transmission,

    vehicleRegistrationNumber:
      form.vehicle?.registrationNumber,

    make: form.vehicle?.make,

    modelAndYear: form.vehicle?.model,
  };
};

/* =========================================================
   PROFILE PAGE
========================================================= */

export function ProfilePage() {

  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState<Driver | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState<string | null>(
    null
  );

  /* =======================================================
     FETCH PROFILE
  ======================================================= */

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getDriverProfile();

        console.log(
          'Driver profile response:',
          response
        );

        if (!response?.success || !response?.data) {
          throw new Error(
            response?.message ||
              'Failed to load driver profile.'
          );
        }

        const driverData =
          response.data as DriverProfileResponse;

        const mappedDriver =
          mapDriverProfileToDriver(driverData);

        if (isMounted) {
          setForm(mappedDriver);
        }
      } catch (err: any) {
        console.error(
          'Failed to fetch driver profile:',
          err
        );

        if (isMounted) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              'Failed to load driver profile.'
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  /* =======================================================
     UPDATE NESTED SECTION
  ======================================================= */

  const updateSection = (
    section: keyof Driver,
    field: string,
    value: any
  ) => {
    setForm((prev) => {
      if (!prev) return prev;

      const currentSection =
        (prev[section] as Record<string, any>) || {};

      return {
        ...prev,

        [section]: {
          ...currentSection,
          [field]: value,
        },
      };
    });
  };

  /* =======================================================
     UPDATE NORMAL FIELD
  ======================================================= */

  const updateField = (
    field: keyof Driver,
    value: any
  ) => {
    setForm((prev) =>
      prev
        ? {
            ...prev,
            [field]: value,
          }
        : prev
    );
  };

  /* =======================================================
     CANCEL EDIT
  ======================================================= */

  const cancelEdit = async () => {
    try {
      setEditing(false);

      // Reload original API data instead of relying
      // on the old auth user object.
      const response = await getDriverProfile();

      if (response?.success && response?.data) {
        setForm(
          mapDriverProfileToDriver(response.data)
        );
      }
    } catch (err) {
      console.error(
        'Failed to restore profile:',
        err
      );
    }
  };

  /* =======================================================
     SAVE PROFILE
  ======================================================= */

  const saveProfile = async () => {
    if (!form) return;

    try {
      setIsSaving(true);
      setError(null);

      const payload = buildUpdatePayload(form);

      console.log(
        'Update profile payload:',
        payload
      );

      await api.updateDriverProfile(payload);

      // Fetch fresh data after successful update
      const response = await getDriverProfile();

      if (response?.success && response?.data) {
        setForm(
          mapDriverProfileToDriver(response.data)
        );
      }

      setEditing(false);

      Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: 'Your driver profile details have been updated successfully.',
        confirmButtonColor: '#FF5B26',
      });
    } catch (err: any) {
      console.error(
        'Error saving profile:',
        err
      );

      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to update profile.';

      setError(errorMsg);

      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: errorMsg,
        confirmButtonColor: '#FF5B26',
      });
    } finally {
      setIsSaving(false);
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-primary-500" />

          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error && !form) {
    return (
      <div className="space-y-6 pb-6">
        <div>
          <p className="mb-1 text-sm font-medium text-primary-500">
            Account Settings
          </p>

          <h2 className="text-2xl font-bold text-navy">
            Profile
          </h2>
        </div>

        <div className="rounded-xl border border-red-100 bg-red-50 p-5">
          <p className="font-semibold text-red-700">
            Unable to load profile
          </p>

          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!form) {
    return null;
  }

  /* =======================================================
     COMPANY DATA
  ======================================================= */

  const company = (form as any).company;

  /* =======================================================
     DOCUMENTS
  ======================================================= */

  const documents = [
    {
      label: 'Government ID',
      url: (form as any).governmentIdUrl,
    },
    {
      label: 'Driving License',
      url: (form as any).licenseCopyUrl,
    },
    {
      label: 'Vehicle Registration',
      url: (form as any)
        .vehicleRegistrationDocUrl,
    },
    {
      label: 'Insurance Proof',
      url: (form as any).insuranceProofUrl,
    },
  ];

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="space-y-6 pb-8">

      {/* ===================================================
          PAGE HEADER
      =================================================== */}

      <div>
        <p className="mb-1 text-sm font-medium text-primary-500">
          Account Settings
        </p>

        <h2 className="text-2xl font-bold text-navy">
          Profile
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage your personal and vehicle information.
        </p>
      </div>

      {/* ===================================================
          ERROR ALERT
      =================================================== */}

      {error && form && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* ===================================================
          PROFILE HEADER
      =================================================== */}

      <div className="card overflow-hidden bg-gradient-to-r from-primary-50/70 via-white to-white shadow-[0_6px_25px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

          {/* Avatar */}

          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-3xl font-bold text-primary-600 shadow-sm">

            {form.avatar ? (
              <img
                src={form.avatar}
                alt={form.name || 'Driver'}
                className="h-full w-full object-cover"
              />
            ) : (
              form.name
                ?.charAt(0)
                ?.toUpperCase() || 'D'
            )}

          </div>

          {/* Name */}

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h3 className="truncate text-xl font-bold text-navy">
              {form.name || 'Driver'}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {String(
                (form as any).role || 'DRIVER'
              )}
            </p>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                  form.isActive
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-red-50 text-red-600'
                }`}
              >
                {form.isActive
                  ? 'Active'
                  : 'Inactive'}
              </span>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                  (form as any).isVerified
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {(form as any).isVerified
                  ? 'Verified'
                  : 'Not Verified'}
              </span>

            </div>
          </div>

          {/* Actions */}

          <div className="flex justify-center gap-2 sm:ml-auto">

            {!editing ? (
              <button
                onClick={() => {
                  setEditing(true);
                  setError(null);
                }}
                className="btn-secondary inline-flex items-center gap-2 shadow-sm"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={cancelEdit}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>

                <button
                  onClick={saveProfile}
                  disabled={isSaving}
                  className="btn-primary inline-flex items-center gap-2 shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save
                    </>
                  )}
                </button>
              </>
            )}

          </div>
        </div>
      </div>

      {/* ===================================================
          INFORMATION GRID
      =================================================== */}

      <div className="grid gap-5 md:grid-cols-2">

        {/* =================================================
            PERSONAL INFORMATION
        ================================================= */}

        <div className="card bg-blue-50/30 shadow-[0_5px_20px_rgba(0,0,0,0.04)]">

          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <User className="h-5 w-5" />
            </div>

            <h4 className="font-bold text-gray-900">
              Personal Information
            </h4>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <Field
              label="Full Name"
              value={form.name}
              editing={editing}
              onChange={(v) =>
                updateField('name', v)
              }
            />

            <Field
              label="Date of Birth"
              value={form.dateOfBirth}
              editing={editing}
              onChange={(v) =>
                updateField('dateOfBirth', v)
              }
            />

            <Field
              label="Gender"
              value={(form as any).gender}
              editing={editing}
              onChange={(v) =>
                updateField('gender', v)
              }
            />

            <Field
              label="Email"
              value={form.email}
              type="email"
              editing={editing}
              onChange={(v) =>
                updateField('email', v)
              }
            />

            <Field
              label="Phone"
              value={form.phone}
              type="tel"
              editing={editing}
              onChange={(v) =>
                updateField('phone', v)
              }
            />

            <Field
              label="Employment Type"
              value={
                (form as any).employmentType
              }
              editing={editing}
              onChange={(v) =>
                updateField(
                  'employmentType',
                  v
                )
              }
            />

            <div className="sm:col-span-2">
              <Field
                label="Preferred Service Area"
                value={
                  (form as any)
                    .preferredServiceArea
                }
                editing={editing}
                onChange={(v) =>
                  updateField(
                    'preferredServiceArea',
                    v
                  )
                }
              />
            </div>

            <div className="sm:col-span-2">
              <Field
                label="Address"
                value={form.address}
                editing={editing}
                onChange={(v) =>
                  updateField('address', v)
                }
              />
            </div>

          </div>
        </div>

        {/* =================================================
            VEHICLE INFORMATION
        ================================================= */}

        <div className="card bg-orange-50/30 shadow-[0_5px_20px_rgba(0,0,0,0.04)]">

          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
              <Car className="h-5 w-5" />
            </div>

            <h4 className="font-bold text-gray-900">
              Vehicle Information
            </h4>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <Field
              label="Registration Number"
              value={
                form.vehicle
                  ?.registrationNumber
              }
              editing={editing}
              onChange={(v) =>
                updateSection(
                  'vehicle',
                  'registrationNumber',
                  v
                )
              }
            />

            <Field
              label="Vehicle Type"
              value={form.vehicle?.type}
              editing={editing}
              onChange={(v) =>
                updateSection(
                  'vehicle',
                  'type',
                  v
                )
              }
            />

            <Field
              label="Make"
              value={form.vehicle?.make}
              editing={editing}
              onChange={(v) =>
                updateSection(
                  'vehicle',
                  'make',
                  v
                )
              }
            />

            <Field
              label="Model & Year"
              value={form.vehicle?.model}
              editing={editing}
              onChange={(v) =>
                updateSection(
                  'vehicle',
                  'model',
                  v
                )
              }
            />

            <Field
              label="Fuel Type"
              value={
                (form as any).fuelType
              }
              editing={editing}
              onChange={(v) =>
                updateField(
                  'fuelType',
                  v
                )
              }
            />

            <Field
              label="Transmission"
              value={
                (form as any).transmission
              }
              editing={editing}
              onChange={(v) =>
                updateField(
                  'transmission',
                  v
                )
              }
            />

          </div>
        </div>

        {/* =================================================
            LICENSE INFORMATION
        ================================================= */}

        <div className="card bg-purple-50/30 shadow-[0_5px_20px_rgba(0,0,0,0.04)]">

          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <h4 className="font-bold text-gray-900">
              License Information
            </h4>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <Field
              label="License Number"
              value={
                form.license?.number
              }
              editing={editing}
              onChange={(v) =>
                updateSection(
                  'license',
                  'number',
                  v
                )
              }
            />

            <Field
              label="License Class"
              value={
                form.license?.class
              }
              editing={editing}
              onChange={(v) =>
                updateSection(
                  'license',
                  'class',
                  v
                )
              }
            />

            <Field
              label="Issue Date"
              value={
                form.license?.issueDate
              }
              editing={editing}
              onChange={(v) =>
                updateSection(
                  'license',
                  'issueDate',
                  v
                )
              }
            />

            <Field
              label="Expiry Date"
              value={
                form.license?.expiryDate
              }
              editing={editing}
              onChange={(v) =>
                updateSection(
                  'license',
                  'expiryDate',
                  v
                )
              }
            />

            {/* Verification */}

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-3 py-3">

                <span className="text-xs font-semibold text-gray-500">
                  Verification Status
                </span>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                    form.license?.verified
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {form.license?.verified
                    ? 'Verified'
                    : 'Not Verified'}
                </span>

              </div>
            </div>

          </div>
        </div>

        {/* =================================================
            COMPANY INFORMATION
        ================================================= */}

        <div className="card bg-slate-50/60 shadow-[0_5px_20px_rgba(0,0,0,0.04)]">

          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-200 text-slate-700">
              <Building2 className="h-5 w-5" />
            </div>

            <h4 className="font-bold text-gray-900">
              Company Information
            </h4>
          </div>

          {company ? (
            <div className="grid gap-4 sm:grid-cols-2">

              <Field
                label="Company"
                value={company.legalName}
                editing={false}
                onChange={() => {}}
              />

              <Field
                label="Company Status"
                value={company.status}
                editing={false}
                onChange={() => {}}
              />

              <Field
                label="City"
                value={
                  company.address?.city
                }
                editing={false}
                onChange={() => {}}
              />

              <Field
                label="State"
                value={
                  company.address?.state
                }
                editing={false}
                onChange={() => {}}
              />

              <Field
                label="Country"
                value={
                  company.address?.country
                }
                editing={false}
                onChange={() => {}}
              />

              <Field
                label="Timezone"
                value={
                  company.address?.timezone
                }
                editing={false}
                onChange={() => {}}
              />

            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Company information not available.
            </p>
          )}

        </div>

      </div>

      {/* ===================================================
          DOCUMENTS
      =================================================== */}

      <div className="card bg-white shadow-[0_5px_20px_rgba(0,0,0,0.04)]">

        <div className="mb-5 flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
            <FileText className="h-5 w-5" />
          </div>

          <div>
            <h4 className="font-bold text-gray-900">
              Documents
            </h4>

            <p className="text-xs text-gray-500">
              Your uploaded verification documents
            </p>
          </div>

        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {documents.map((document) => (
            <div
              key={document.label}
              className="rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:border-primary-100 hover:bg-primary-50/30"
            >

              <div className="flex items-start justify-between gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm">
                  <FileText className="h-4 w-4" />
                </div>

                {document.url && (
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                )}

              </div>

              <p className="mt-3 text-sm font-semibold text-gray-800">
                {document.label}
              </p>

              {document.url ? (
                <a
                  href={document.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:underline"
                >
                  View Document
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : (
                <p className="mt-3 text-sm text-gray-400">
                  Not available
                </p>
              )}

            </div>
          ))}

        </div>
      </div>

    </div>
  );
}