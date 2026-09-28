import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ChevronDown,
  Check,
  Upload,
  FileText,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

import { LoginBackgroundPattern } from '@/components/auth/LoginBackgroundPattern';
import { driverApi, getCompanies } from '@/services/driverApi';
import Swal from 'sweetalert2';

// ----------------------------------------------------
// Helper Utilities
// ----------------------------------------------------

/**
 * Converts date string from HTML input (YYYY-MM-DD) to MM/DD/YYYY format expected by API.
 */
const formatDateToMMDDYYYY = (dateStr?: string): string => {
  if (!dateStr) return '';
  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts.length === 3 && parts[0].length === 4) {
      const [year, month, day] = parts;
      return `${month}/${day}/${year}`;
    }
  }
  return dateStr;
};

// ----------------------------------------------------
// File Validation Helpers
// ----------------------------------------------------

const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const validateSingleFile = (file: File | null, label: string): string | null => {
  if (!file) {
    return `${label} is required.`;
  }
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();
  const isTypeValid =
    ALLOWED_MIME_TYPES.includes(fileType) ||
    ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));

  if (!isTypeValid) {
    return `${label} must be a PDF, JPG, JPEG, or PNG file.`;
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return `${label} exceeds the 10 MB size limit (current size: ${sizeMb} MB).`;
  }
  return null;
};

// ----------------------------------------------------
// Validation Schemas (Strictly matching API Contract)
// ----------------------------------------------------

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['Male', 'Female', 'Other'], {
    errorMap: () => ({ message: 'Gender is required' }),
  }),
  phoneNumber: z.string().min(10, 'Valid phone number is required (min 10 digits)'),
  email: z.string().email('Valid email address is required'),
  companyId: z.string().optional(),
});

const credentialsSchema = z.object({
  licenseNumber: z.string().min(1, 'License number is required'),
  licenseClass: z.string().optional(),
  issueDate: z.string().optional(),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  employmentType: z.string().optional(),
  preferredServiceArea: z.string().optional(),
});

const vehicleSchema = z.object({
  vehicleRegistrationNumber: z.string().min(1, 'Vehicle registration number is required'),
  vehicleType: z.string().optional(),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  make: z.string().optional(),
  modelAndYear: z.string().optional(),
});

// ----------------------------------------------------
// Types
// ----------------------------------------------------

type Step = 1 | 2 | 3 | 4;

type Company = {
  id: string;
  name: string;
};

type FilesState = {
  governmentId: File | null;
  licenseCopy: File | null;
  vehicleRegistrationDoc: File | null;
  insuranceProof: File | null;
};

// ----------------------------------------------------
// Signup Page Component
// ----------------------------------------------------

export function SignupPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(1);

  const [formData, setFormData] = useState<any>({
    gender: 'Male',
    employmentType: 'Full-Time',
    vehicleType: 'Sedan',
    fuelType: 'Petrol',
    transmission: 'Automatic',
  });

  // Companies state
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);

  // Documents state
  const [files, setFiles] = useState<FilesState>({
    governmentId: null,
    licenseCopy: null,
    vehicleRegistrationDoc: null,
    insuranceProof: null,
  });

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --------------------------------------------------
  // Fetch Companies on Mount
  // --------------------------------------------------
useEffect(() => {
  let isMounted = true;

  const fetchCompanies = async () => {
    try {
      setIsLoadingCompanies(true);
      setError(null);

      const response = await getCompanies();
      console.log("response", response);

      // API response: { statusCode, data: [...], message, success }
      const rawList = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];

      const mappedCompanies: Company[] = rawList.map((item: any) => ({
        id: String(
          item._id ||
          item.companyId ||
          item.id ||
          item.value ||
          ""
        ),
        name: String(
          item.displayName ||
          item.legalName ||
          item.companyName ||
          item.name ||
          item.title ||
          item.label ||
          "Unnamed Company"
        ),
      }));

      console.log("mappedCompanies", mappedCompanies);

      if (isMounted) {
        setCompanies(mappedCompanies);
      }
    } catch (err: any) {
      console.error("Failed to fetch companies:", err);

      if (isMounted) {
        const apiError =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load companies list.";

        setError(apiError);
        setCompanies([]);
      }
    } finally {
      if (isMounted) {
        setIsLoadingCompanies(false);
      }
    }
  };

  fetchCompanies();

  return () => {
    isMounted = false;
  };
}, []);

  // --------------------------------------------------
  // Stepper Info
  // --------------------------------------------------

  const stepsInfo = [
    {
      number: 1,
      title: 'Personal Info',
      desc: 'Basic details & contact',
    },
    {
      number: 2,
      title: 'Credentials',
      desc: 'Driver license & region',
    },
    {
      number: 3,
      title: 'Vehicle Info',
      desc: 'Car specs & registration',
    },
    {
      number: 4,
      title: 'Documents',
      desc: 'Upload docs & confirm',
    },
  ];

  // --------------------------------------------------
  // Step Navigation Handlers
  // --------------------------------------------------

  const handleNext = (stepData: any) => {
    setFormData((prev: any) => ({
      ...prev,
      ...stepData,
    }));
    setStep((s) => (s + 1) as Step);
    setError(null);
  };

  const handlePrev = () => {
    setStep((s) => (s - 1) as Step);
    setError(null);
  };

  const handleFileChange = (key: keyof FilesState, file: File | null) => {
    setFiles((prev) => ({
      ...prev,
      [key]: file,
    }));
  };

  // --------------------------------------------------
  // Final Registration API Submission
  // --------------------------------------------------

  const handleSubmitAll = async (termsAccepted: boolean) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = new FormData();

      // 1. Personal Information
      payload.append('fullName', formData.fullName || '');
      payload.append('dateOfBirth', formatDateToMMDDYYYY(formData.dateOfBirth));
      payload.append('gender', formData.gender || '');
      payload.append('phoneNumber', formData.phoneNumber || '');
      payload.append('email', formData.email || '');

      if (formData.companyId) {
        payload.append('companyId', formData.companyId);
      }

      // 2. Driving Credentials
      payload.append('licenseNumber', formData.licenseNumber || '');

      if (formData.licenseClass) {
        payload.append('licenseClass', formData.licenseClass);
      }

      if (formData.issueDate) {
        payload.append('issueDate', formatDateToMMDDYYYY(formData.issueDate));
      }

      payload.append('expiryDate', formatDateToMMDDYYYY(formData.expiryDate));

      if (formData.employmentType) {
        payload.append('employmentType', formData.employmentType);
      }

      if (formData.preferredServiceArea) {
        payload.append('preferredServiceArea', formData.preferredServiceArea);
      }

      // 3. Vehicle Information
      if (formData.vehicleType) {
        payload.append('vehicleType', formData.vehicleType);
      }

      if (formData.fuelType) {
        payload.append('fuelType', formData.fuelType);
      }

      if (formData.transmission) {
        payload.append('transmission', formData.transmission);
      }

      payload.append('vehicleRegistrationNumber', formData.vehicleRegistrationNumber || '');

      if (formData.make) {
        payload.append('make', formData.make);
      }

      if (formData.modelAndYear) {
        payload.append('modelAndYear', formData.modelAndYear);
      }

      // 4. Terms
      payload.append('termsAccepted', String(termsAccepted));

      // 5. Document Files
      if (files.governmentId) {
        payload.append('governmentId', files.governmentId);
      }

      if (files.licenseCopy) {
        payload.append('licenseCopy', files.licenseCopy);
      }

      if (files.vehicleRegistrationDoc) {
        payload.append('vehicleRegistrationDoc', files.vehicleRegistrationDoc);
      }

      if (files.insuranceProof) {
        payload.append('insuranceProof', files.insuranceProof);
      }

      // Call API Service
      await driverApi.registerDriver(payload);

      await Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        text: 'Your driver application has been submitted successfully.',
        confirmButtonColor: '#FF5B26',
      });

      // Navigate to application status on success
      navigate('/application-status');
    } catch (err: any) {
      console.error('Driver registration failed:', err);

      const backendMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'An error occurred during driver registration. Please try again.';

      setError(backendMsg);

      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: backendMsg,
        confirmButtonColor: '#FF5B26',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return 'Step 1: Personal Information';
      case 2:
        return 'Step 2: Driving Credentials & Service Area';
      case 3:
        return 'Step 3: Vehicle Specifications';
      case 4:
        return 'Step 4: Document Verification & Terms';
      default:
        return '';
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center pt-20 sm:pt-24 lg:pt-20 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <LoginBackgroundPattern />

      <div className="relative z-10 w-full max-w-[1040px]">
        <div className="bg-white rounded-[24px] sm:rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.45)] border border-white/80 p-5 sm:p-8 md:p-10 transition-all duration-300">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
                Driver Registration
              </h1>
              <p className="text-xs sm:text-[13px] text-slate-400 mt-1">
                Follow the 4 simple steps to complete your driver application.
              </p>
            </div>

            <div className="text-xs sm:text-[13px] text-slate-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-[#FF5B26] hover:text-[#E04815] font-semibold underline underline-offset-2 transition-colors ml-1"
              >
                Log In
              </Link>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            {/* Left Stepper */}
            <div className="lg:col-span-4 flex flex-col justify-start py-1">
              <div className="relative flex lg:flex-col gap-4 sm:gap-6 lg:gap-8 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                <div className="hidden lg:block absolute left-[15px] top-6 bottom-6 w-[2px] bg-slate-100 -z-10" />

                {stepsInfo.map((s) => {
                  const isCompleted = step > s.number;
                  const isActive = step === s.number;

                  return (
                    <div key={s.number} className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center justify-center">
                        {isCompleted ? (
                          <div className="w-[30px] h-[30px] sm:w-[32px] sm:h-[32px] rounded-full bg-[#EBFBF5] border border-[#31C48D] flex items-center justify-center text-[#31C48D] transition-all duration-300">
                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                          </div>
                        ) : isActive ? (
                          <div className="w-[30px] h-[30px] sm:w-[32px] sm:h-[32px] rounded-full bg-[#FF5B26] text-white flex items-center justify-center text-xs sm:text-[13px] font-bold transition-all duration-300 ring-4 ring-orange-100 shadow-sm">
                            {s.number}
                          </div>
                        ) : (
                          <div className="w-[30px] h-[30px] sm:w-[32px] sm:h-[32px] rounded-full border border-slate-200 bg-white text-slate-400 flex items-center justify-center text-xs sm:text-[13px] font-medium transition-all duration-300">
                            {s.number}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <span
                          className={`text-xs sm:text-[13px] font-bold leading-tight ${
                            isActive
                              ? 'text-[#111827]'
                              : isCompleted
                              ? 'text-slate-700'
                              : 'text-slate-400'
                          }`}
                        >
                          {s.title}
                        </span>
                        <span className="hidden sm:inline text-[10px] sm:text-[11px] text-slate-400">
                          {s.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-8 bg-slate-50/50 rounded-2xl p-4 sm:p-6 border border-slate-100">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2 animate-fade-in">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              <h2 className="text-sm sm:text-base font-bold text-[#111827] tracking-tight mb-5 pb-2 border-b border-slate-200/70 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF5B26]" />
                {getStepTitle()}
              </h2>

              {step === 1 && (
                <ProfileStep
                  data={formData}
                  companies={companies}
                  isLoadingCompanies={isLoadingCompanies}
                  onNext={handleNext}
                />
              )}

              {step === 2 && (
                <CredentialsStep
                  data={formData}
                  onNext={handleNext}
                  onPrev={handlePrev}
                />
              )}

              {step === 3 && (
                <VehicleStep
                  data={formData}
                  onNext={handleNext}
                  onPrev={handlePrev}
                />
              )}

              {step === 4 && (
                <SummaryStep
                  files={files}
                  onFileChange={handleFileChange}
                  onPrev={handlePrev}
                  onSubmit={handleSubmitAll}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ====================================================
// UI Reusable Input Component
// ====================================================

function FormInput({ label, name, type = 'text', register, errors, ...props }: any) {
  return (
    <div className="space-y-1">
      <label className="block text-[11px] font-semibold text-slate-700">{label}</label>
      <input
        type={type}
        {...register(name)}
        className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border bg-white text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-200 ${
          errors[name]
            ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500'
            : 'border-slate-200 focus:border-[#FF5B26] focus:ring-2 focus:ring-orange-200/60'
        }`}
        {...props}
      />
      {errors[name] && (
        <p className="text-red-500 text-[10px] font-medium mt-0.5">{errors[name].message}</p>
      )}
    </div>
  );
}

// ====================================================
// UI Reusable Select Component
// ====================================================

function FormSelect({ label, name, options, register, errors, disabled = false }: any) {
  return (
    <div className="space-y-1 relative">
      <label className="block text-[11px] font-semibold text-slate-700">{label}</label>
      <div className="relative">
        <select
          {...register(name)}
          disabled={disabled}
          className={`w-full px-3 py-2 pr-8 text-xs sm:text-sm rounded-xl border bg-white text-slate-800 focus:outline-none appearance-none cursor-pointer transition-all duration-200 ${
            errors[name]
              ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500'
              : 'border-slate-200 focus:border-[#FF5B26] focus:ring-2 focus:ring-orange-200/60'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
      </div>
      {errors[name] && (
        <p className="text-red-500 text-[10px] font-medium mt-0.5">{errors[name].message}</p>
      )}
    </div>
  );
}

// ====================================================
// Step 1: Personal Profile
// ====================================================

function ProfileStep({ data, companies, isLoadingCompanies, onNext }: any) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: data,
    resolver: zodResolver(profileSchema),
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <FormInput
          label="Full Name *"
          name="fullName"
          placeholder="e.g. John Doe"
          register={register}
          errors={errors}
        />

        <FormInput
          label="Date of Birth *"
          name="dateOfBirth"
          type="date"
          register={register}
          errors={errors}
        />

        <FormSelect
          label="Gender *"
          name="gender"
          options={[
            { label: 'Male', value: 'Male' },
            { label: 'Female', value: 'Female' },
            { label: 'Other', value: 'Other' },
          ]}
          register={register}
          errors={errors}
        />

        <FormInput
          label="Phone Number *"
          name="phoneNumber"
          placeholder="e.g. +1 555-0199"
          type="tel"
          register={register}
          errors={errors}
        />

        <FormInput
          label="Email Address *"
          name="email"
          placeholder="you@example.com"
          type="email"
          register={register}
          errors={errors}
        />

        {/* Company Dropdown populated dynamically from Backend API */}
        <FormSelect
          label="Company (Optional)"
          name="companyId"
          disabled={isLoadingCompanies}
          options={[
            {
              label: isLoadingCompanies ? 'Loading companies...' : 'Select Company',
              value: '',
            },
            ...companies.map((company: Company) => ({
              label: company.name,
              value: company.id,
            })),
          ]}
          register={register}
          errors={errors}
        />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-slate-200/60">
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 bg-[#FF5B26] hover:bg-[#E04815] active:bg-[#BC360B] text-white font-bold py-2.5 px-5 rounded-xl tracking-wider text-xs uppercase shadow-md shadow-orange-500/25 transition-all duration-200 active:scale-[0.99]"
        >
          <span>CONTINUE</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </form>
  );
}

// ====================================================
// Step 2: Credentials
// ====================================================

function CredentialsStep({ data, onNext, onPrev }: any) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: data,
    resolver: zodResolver(credentialsSchema),
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <FormInput
          label="Driver License Number *"
          name="licenseNumber"
          placeholder="e.g. DL-982348"
          register={register}
          errors={errors}
        />

        <FormInput
          label="License Class"
          name="licenseClass"
          placeholder="e.g. Commercial / Class A"
          register={register}
          errors={errors}
        />

        <FormInput
          label="Issue Date"
          name="issueDate"
          type="date"
          register={register}
          errors={errors}
        />

        <FormInput
          label="Expiry Date *"
          name="expiryDate"
          type="date"
          register={register}
          errors={errors}
        />

        <FormSelect
          label="Employment Type"
          name="employmentType"
          options={[
            { label: 'Full Time Driver', value: 'Full-Time' },
            { label: 'Part Time Driver', value: 'Part-Time' },
          ]}
          register={register}
          errors={errors}
        />

        <FormInput
          label="Preferred Service Area / City"
          name="preferredServiceArea"
          placeholder="e.g. Downtown Metro"
          register={register}
          errors={errors}
        />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200/60">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-semibold text-xs py-2 px-3 rounded-lg hover:bg-slate-200/50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <button
          type="submit"
          className="inline-flex items-center gap-1.5 bg-[#FF5B26] hover:bg-[#E04815] active:bg-[#BC360B] text-white font-bold py-2.5 px-5 rounded-xl tracking-wider text-xs uppercase shadow-md shadow-orange-500/25 transition-all duration-200 active:scale-[0.99]"
        >
          <span>CONTINUE</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </form>
  );
}

// ====================================================
// Step 3: Vehicle Specifications
// ====================================================

function VehicleStep({ data, onNext, onPrev }: any) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: data,
    resolver: zodResolver(vehicleSchema),
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <FormSelect
          label="Vehicle Type"
          name="vehicleType"
          options={[
            { label: 'Sedan (Standard Taxi)', value: 'Sedan' },
            { label: 'SUV (Spacious)', value: 'SUV' },
            { label: 'Hatchback (Compact)', value: 'Hatchback' },
            { label: 'Van / Luxury', value: 'Van' },
          ]}
          register={register}
          errors={errors}
        />

        <FormSelect
          label="Fuel Type"
          name="fuelType"
          options={[
            { label: 'Petrol', value: 'Petrol' },
            { label: 'Diesel', value: 'Diesel' },
            { label: 'Electric (EV)', value: 'Electric' },
            { label: 'CNG / Hybrid', value: 'Hybrid' },
          ]}
          register={register}
          errors={errors}
        />

        <FormSelect
          label="Transmission"
          name="transmission"
          options={[
            { label: 'Automatic', value: 'Automatic' },
            { label: 'Manual', value: 'Manual' },
          ]}
          register={register}
          errors={errors}
        />

        <FormInput
          label="Vehicle Registration Number *"
          name="vehicleRegistrationNumber"
          placeholder="e.g. TX-992-B"
          register={register}
          errors={errors}
        />

        <FormInput
          label="Make (Brand)"
          name="make"
          placeholder="e.g. Toyota"
          register={register}
          errors={errors}
        />

        <FormInput
          label="Model & Year"
          name="modelAndYear"
          placeholder="e.g. Camry 2024"
          register={register}
          errors={errors}
        />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200/60">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-semibold text-xs py-2 px-3 rounded-lg hover:bg-slate-200/50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <button
          type="submit"
          className="inline-flex items-center gap-1.5 bg-[#FF5B26] hover:bg-[#E04815] active:bg-[#BC360B] text-white font-bold py-2.5 px-5 rounded-xl tracking-wider text-xs uppercase shadow-md shadow-orange-500/25 transition-all duration-200 active:scale-[0.99]"
        >
          <span>CONTINUE</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </form>
  );
}

// ====================================================
// Step 4: Documents & Terms
// ====================================================

function SummaryStep({
  files,
  onFileChange,
  onPrev,
  onSubmit,
  isSubmitting,
}: any) {
  const [agreed, setAgreed] = useState(false);
  const [docErrors, setDocErrors] = useState<string | null>(null);

  const docs: { key: keyof FilesState; label: string }[] = [
    {
      key: 'governmentId',
      label: 'Government Issued ID (National ID / Passport) *',
    },
    {
      key: 'licenseCopy',
      label: 'Commercial Driving License Copy *',
    },
    {
      key: 'vehicleRegistrationDoc',
      label: 'Vehicle Registration Document *',
    },
    {
      key: 'insuranceProof',
      label: 'Vehicle Insurance Certificate *',
    },
  ];

  const handleSelectedFile = (key: keyof FilesState, label: string, file: File | null) => {
    if (file) {
      const err = validateSingleFile(file, label.replace(' *', ''));
      if (err) {
        setDocErrors(err);
        onFileChange(key, null);
        return;
      }
    }
    setDocErrors(null);
    onFileChange(key, file);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Check missing files
    const missing = docs.filter((doc) => !files[doc.key]);
    if (missing.length > 0) {
      setDocErrors(
        `Please upload all required documents: ${missing
          .map((m) => m.label.replace(' *', ''))
          .join(', ')}`
      );
      return;
    }

    // 2. Validate file type and size for all files
    for (const doc of docs) {
      const file = files[doc.key];
      const err = validateSingleFile(file, doc.label.replace(' *', ''));
      if (err) {
        setDocErrors(err);
        return;
      }
    }

    // 3. Terms check
    if (!agreed) {
      setDocErrors('You must accept the Driver Terms & Conditions to submit your application.');
      return;
    }

    setDocErrors(null);
    onSubmit(true);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4 animate-fade-in">
      {/* Errors */}
      {docErrors && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2 animate-fade-in">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <span>{docErrors}</span>
        </div>
      )}

      {/* File Upload List */}
      <div className="space-y-2.5">
        {docs.map((doc) => {
          const currentFile = files[doc.key];

          return (
            <div
              key={doc.key}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 border border-slate-200/80 rounded-xl bg-white hover:border-orange-200 transition-colors duration-200 gap-2.5"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-[#FF5B26] shrink-0">
                  <FileText className="h-4 w-4" />
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800 leading-tight">
                    {doc.label}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {currentFile
                      ? `Selected: ${currentFile.name} (${(currentFile.size / (1024 * 1024)).toFixed(2)} MB)`
                      : 'PDF, JPG or PNG (Max 10MB)'}
                  </span>
                </div>
              </div>

              <label className="inline-flex items-center justify-center px-3.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-[11px] font-semibold text-slate-700 cursor-pointer hover:bg-orange-50 hover:text-[#FF5B26] hover:border-orange-200 transition-all duration-200 self-start sm:self-auto shadow-xs">
                <Upload className="h-3 w-3 mr-1.5 text-slate-400" />
                {currentFile ? 'Replace File' : 'Upload'}
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                  className="hidden"
                  onChange={(e) =>
                    handleSelectedFile(
                      doc.key,
                      doc.label,
                      e.target.files?.[0] || null
                    )
                  }
                />
              </label>
            </div>
          );
        })}
      </div>

      {/* Terms */}
      <div className="flex items-start gap-2.5 pt-2">
        <input
          type="checkbox"
          id="terms"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-4 w-4 text-[#FF5B26] border-slate-300 rounded focus:ring-orange-300 accent-[#FF5B26] cursor-pointer"
        />

        <label
          htmlFor="terms"
          className="text-xs text-slate-600 leading-relaxed cursor-pointer select-none"
        >
          I certify that all details and documents provided are genuine. I accept the{' '}
          <Link
            to="/terms"
            target="_blank"
            className="text-[#FF5B26] font-semibold hover:underline"
          >
            Driver Terms & Conditions
          </Link>{' '}
          and{' '}
          <Link
            to="/privacy-policy"
            target="_blank"
            className="text-[#FF5B26] font-semibold hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </label>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200/60">
        <button
          type="button"
          onClick={onPrev}
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-semibold text-xs py-2 px-3 rounded-lg hover:bg-slate-200/50 transition-colors disabled:opacity-50"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 bg-[#FF5B26] hover:bg-[#E04815] active:bg-[#BC360B] text-white font-bold py-2.5 px-6 rounded-xl tracking-wider text-xs uppercase shadow-md shadow-orange-500/25 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
        >
          {isSubmitting ? 'SUBMITTING...' : 'COMPLETE APPLICATION'}
        </button>
      </div>
    </form>
  );
}