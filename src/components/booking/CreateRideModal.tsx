import { useState } from 'react';
import { X, MapPin, DollarSign, User, Phone, Navigation, PlusCircle } from 'lucide-react';
import { createRideRequest } from '@/services/DriverBooking';
import { getErrorMessage } from '@/services/axiosClient';
import Swal from 'sweetalert2';

interface CreateRideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (createdRide?: any) => void;
}

export function CreateRideModal({ isOpen, onClose, onCreated }: CreateRideModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    passengerName: 'Aarav Sharma',
    passengerPhone: '+91 98765 43210',
    pickupAddress: 'MG Road Metro Station, Bangalore',
    pickupLat: 12.9756,
    pickupLng: 77.6066,
    dropAddress: 'Indiranagar 100ft Road, Bangalore',
    dropLat: 12.9784,
    dropLng: 77.6408,
    fare: 280,
    distance: 4.8,
    paymentMethod: 'CASH',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      passenger: {
        name: formData.passengerName,
        phone: formData.passengerPhone,
      },
      passengerName: formData.passengerName,
      phoneNumber: formData.passengerPhone,
      pickup: {
        address: formData.pickupAddress,
        latitude: Number(formData.pickupLat),
        longitude: Number(formData.pickupLng),
        lat: Number(formData.pickupLat),
        lng: Number(formData.pickupLng),
      },
      pickupAddress: formData.pickupAddress,
      drop: {
        address: formData.dropAddress,
        latitude: Number(formData.dropLat),
        longitude: Number(formData.dropLng),
        lat: Number(formData.dropLat),
        lng: Number(formData.dropLng),
      },
      dropAddress: formData.dropAddress,
      fare: Number(formData.fare),
      estimatedFare: Number(formData.fare),
      amount: Number(formData.fare),
      distance: Number(formData.distance),
      paymentMethod: formData.paymentMethod,
    };

    try {
      const res = await createRideRequest(payload);
      Swal.fire({
        icon: 'success',
        title: 'Ride Request Created!',
        text: 'A new ride request has been dispatched.',
        confirmButtonColor: '#FF5B26',
        timer: 2000,
        showConfirmButton: false,
      });
      onCreated(res);
      onClose();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Create Request',
        text: getErrorMessage(err),
        confirmButtonColor: '#FF5B26',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-[#FF5B26]">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Create Ride Request</h3>
              <p className="text-xs text-gray-500">Simulate or dispatch a new passenger ride</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Passenger Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Passenger Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Passenger Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.passengerName}
                    onChange={(e) => setFormData({ ...formData, passengerName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF5B26]"
                    placeholder="Enter name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.passengerPhone}
                    onChange={(e) => setFormData({ ...formData, passengerPhone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF5B26]"
                    placeholder="+91 99999 99999"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pickup */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">Pickup Address</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.pickupAddress}
                onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF5B26]"
                placeholder="Pickup address"
              />
            </div>
          </div>

          {/* Drop */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">Drop Address</label>
            <div className="relative">
              <Navigation className="w-4 h-4 text-rose-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.dropAddress}
                onChange={(e) => setFormData({ ...formData, dropAddress: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF5B26]"
                placeholder="Drop address"
              />
            </div>
          </div>

          {/* Fare & Distance */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Estimated Fare (₹)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  required
                  min="20"
                  value={formData.fare}
                  onChange={(e) => setFormData({ ...formData, fare: Number(e.target.value) })}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF5B26]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Distance (km)</label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                required
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF5B26]"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Payment Method</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#FF5B26]"
            >
              <option value="CASH">Cash</option>
              <option value="UPI">UPI</option>
              <option value="ONLINE">Online / Card</option>
              <option value="WALLET">Wallet</option>
            </select>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-[#FF5B26] hover:bg-[#e04815] text-white text-xs font-semibold shadow-sm shadow-orange-500/30 flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              Dispatch Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
