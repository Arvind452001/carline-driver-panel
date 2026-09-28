import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  X,
  Loader2,
  UserPlus,
  Edit3,
  Building2,
  User,
  Mail,
  Phone,
  FileText,
  Car,
  MapPin,
  Upload,
} from 'lucide-react';
import { CompanyDriver, CreateDriverPayload } from '@/types/driverManager';
import { MOCK_COMPANIES } from '@/constants/companies';

interface DriverFormModalProps {
  isOpen: boolean;
  driver?: CompanyDriver | null;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDriverPayload) => void;
}

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  zipCode: string;
  emergencyContactName: string;
  emergencyPhone: string;
  licenseNumber: string;
  licenseClass: string;
  expiryDate: string;
  vehicleAssignment: string;
  defaultAvailability: string;
  dispatchPriority: string;
  companyId: string;
  status: string;
}

export function DriverFormModal({
  isOpen,
  driver,
  isLoading = false,
  onClose,
  onSubmit,
}: DriverFormModalProps) {
  const isEditMode = Boolean(driver);

  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [insuranceFile, setInsuranceFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      streetAddress: '',
      city: '',
      zipCode: '',
      emergencyContactName: '',
      emergencyPhone: '',
      licenseNumber: '',
      licenseClass: 'LMV',
      expiryDate: '2030-01-01',
      vehicleAssignment: '',
      defaultAvailability: 'Available',
      dispatchPriority: 'Normal',
      companyId: MOCK_COMPANIES[0]?.value || 'abc-logistics',
      status: 'ACTIVE',
    },
  });

  useEffect(() => {
    if (isOpen) {
      setLicenseFile(null);
      setInsuranceFile(null);
      if (driver) {
        let fName = driver.firstName || '';
        let lName = driver.lastName || '';
        if (!fName && driver.fullName) {
          const parts = driver.fullName.split(' ');
          fName = parts[0] || '';
          lName = parts.slice(1).join(' ') || '';
        }

        reset({
          firstName: fName,
          lastName: lName,
          email: driver.email || '',
          phoneNumber: driver.phoneNumber || driver.phone || '',
          streetAddress: driver.streetAddress || '',
          city: driver.city || '',
          zipCode: driver.zipCode || '',
          emergencyContactName: driver.emergencyContactName || '',
          emergencyPhone: driver.emergencyPhone || '',
          licenseNumber: driver.licenseNumber || '',
          licenseClass: driver.licenseClass || 'LMV',
          expiryDate: driver.expiryDate || '2030-01-01',
          vehicleAssignment: driver.vehicleAssignment || driver.vehicleNumber || '',
          defaultAvailability: driver.defaultAvailability || 'Available',
          dispatchPriority: driver.dispatchPriority || 'Normal',
          companyId: driver.companyId || MOCK_COMPANIES[0]?.value || '',
          status: String(driver.status || 'ACTIVE').toUpperCase(),
        });
      } else {
        reset({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          streetAddress: '',
          city: '',
          zipCode: '',
          emergencyContactName: '',
          emergencyPhone: '',
          licenseNumber: '',
          licenseClass: 'LMV',
          expiryDate: '2030-01-01',
          vehicleAssignment: '',
          defaultAvailability: 'Available',
          dispatchPriority: 'Normal',
          companyId: MOCK_COMPANIES[0]?.value || '',
          status: 'ACTIVE',
        });
      }
    }
  }, [isOpen, driver, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = (data: FormValues) => {
    onSubmit({
      ...data,
      licenseCopy: licenseFile,
      insuranceProof: insuranceFile,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 space-y-6 my-8 transform transition-all max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-orange-50 text-primary-500">
              {isEditMode ? <Edit3 className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {isEditMode ? 'Edit Driver' : 'Add New Driver'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditMode
                  ? 'Update driver parameters based on API Swagger schema.'
                  : 'Fill in driver details according to company driver specifications.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 text-xs">
          {/* Company & Status Row */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-primary-500" />
                Company <span className="text-red-500">*</span>
              </label>
              <select
                {...register('companyId', { required: 'Company is required' })}
                className="input-field text-xs font-medium py-2"
              >
                {MOCK_COMPANIES.map((company) => (
                  <option key={company.value} value={company.value}>
                    {company.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                {...register('status')}
                className="input-field text-xs font-semibold py-2 uppercase"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="ON_RIDE">ON_RIDE</option>
                <option value="OFF_DUTY">OFF_DUTY</option>
              </select>
            </div>
          </div>

          {/* Personal Info Section */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-1.5 text-xs">
              <User className="w-3.5 h-3.5 text-primary-500" />
              Personal Information
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-600 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rajesh"
                  {...register('firstName', { required: 'First name is required' })}
                  className="input-field text-xs py-2"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-[11px] mt-0.5">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kumar"
                  {...register('lastName', { required: 'Last name is required' })}
                  className="input-field text-xs py-2"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-[11px] mt-0.5">{errors.lastName.message}</p>
                )}
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" /> Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. rajesh@company.com"
                  {...register('email', { required: 'Email is required' })}
                  className="input-field text-xs py-2"
                />
                {errors.email && (
                  <p className="text-red-500 text-[11px] mt-0.5">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" /> Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. +91 98765 43210"
                  {...register('phoneNumber', { required: 'Phone is required' })}
                  className="input-field text-xs py-2"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-[11px] mt-0.5">{errors.phoneNumber.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-1.5 text-xs">
              <MapPin className="w-3.5 h-3.5 text-primary-500" />
              Address Details
            </h3>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="md:col-span-3">
                <label className="block font-medium text-slate-600 mb-1">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="123 Main Street"
                  {...register('streetAddress', { required: 'Street address required' })}
                  className="input-field text-xs py-2"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Bangalore"
                  {...register('city', { required: 'City required' })}
                  className="input-field text-xs py-2"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">
                  Zip Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="560001"
                  {...register('zipCode', { required: 'Zip code required' })}
                  className="input-field text-xs py-2"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">
                  Emergency Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="+91 98765 43211"
                  {...register('emergencyPhone', { required: 'Emergency phone required' })}
                  className="input-field text-xs py-2"
                />
              </div>
            </div>
          </div>

          {/* License & Vehicle Section */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-1.5 text-xs">
              <FileText className="w-3.5 h-3.5 text-primary-500" />
              License & Vehicle Assignment
            </h3>
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-slate-600 mb-1">
                  License Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="DL-1420110012345"
                  {...register('licenseNumber', { required: 'License number required' })}
                  className="input-field text-xs font-mono py-2"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">License Class</label>
                <input
                  type="text"
                  placeholder="LMV / HMV"
                  {...register('licenseClass')}
                  className="input-field text-xs py-2"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">
                  Expiry Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register('expiryDate', { required: 'Expiry date required' })}
                  className="input-field text-xs py-2"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-medium text-slate-600 mb-1 flex items-center gap-1">
                  <Car className="w-3 h-3 text-slate-400" /> Vehicle Assignment
                </label>
                <input
                  type="text"
                  placeholder="KA-01-AB-1234 (Toyota Camry)"
                  {...register('vehicleAssignment')}
                  className="input-field text-xs py-2"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">Dispatch Priority</label>
                <select {...register('dispatchPriority')} className="input-field text-xs py-2">
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Document Uploads */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5 text-xs">
              <Upload className="w-3.5 h-3.5 text-primary-500" />
              Document Uploads (Optional)
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-3 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <label className="block font-medium text-slate-600 mb-1">License Copy</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setLicenseFile(e.target.files?.[0] || null)}
                  className="block w-full text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-primary-600 hover:file:bg-orange-100"
                />
              </div>

              <div className="p-3 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <label className="block font-medium text-slate-600 mb-1">Insurance Proof</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setInsuranceFile(e.target.files?.[0] || null)}
                  className="block w-full text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-primary-600 hover:file:bg-orange-100"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 sticky bottom-0 bg-white py-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors text-xs disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center gap-2 text-xs py-2 px-5 shadow-md hover:shadow-lg transition-all"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isEditMode ? 'Save Changes' : 'Create Driver'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
