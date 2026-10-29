import React from 'react';
import {
  X,
  Users,
  ShieldCheck,
  Check,
  Ban,
  Car,
  Briefcase,
  Route,
  Phone,
} from 'lucide-react';
import { Vehicle } from '../lib/db';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({ vehicle, onClose }) => {
  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header Image */}
        <div className="relative h-60 w-full bg-stone-900 shrink-0">
          <img
            src={vehicle.coverImage}
            alt={vehicle.name}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 mb-1">
              <span className="capitalize">{vehicle.vehicleType.replace('_', ' ')}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Syndicate Standard
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">{vehicle.name}</h2>
            <p className="text-xs text-stone-200">
              Provider / Syndicate: {vehicle.providerName}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-stone-700">
          {/* Key Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
            <div>
              <span className="text-stone-500 block">Passenger Capacity</span>
              <span className="font-bold text-stone-900 text-sm flex items-center gap-1 mt-0.5">
                <Users className="w-3.5 h-3.5 text-emerald-700" />
                <span>Up to {vehicle.passengerCapacity} Persons</span>
              </span>
            </div>

            <div>
              <span className="text-stone-500 block">Driver Provision</span>
              <span className="font-bold text-stone-900 text-sm flex items-center gap-1 mt-0.5">
                <Car className="w-3.5 h-3.5 text-emerald-700" />
                <span>{vehicle.driverIncluded ? 'Local Driver Included' : 'Self-drive / Pedal'}</span>
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <span className="text-stone-500 block">Benchmark Rate</span>
              <span className="font-extrabold text-[#123524] text-base block mt-0.5">
                ৳ {vehicle.indicativePrice.toLocaleString()} {vehicle.currency}
              </span>
            </div>

            <div className="col-span-2 sm:col-span-3 pt-2 border-t border-stone-200">
              <span className="text-stone-500 flex items-center gap-1 mb-0.5 font-bold uppercase tracking-wider text-[10px]">
                <Briefcase className="w-3.5 h-3.5 text-stone-400" />
                <span>Luggage Capacity & Roof Carrier:</span>
              </span>
              <p className="text-stone-700 font-medium">{vehicle.luggageDetails}</p>
            </div>
          </div>

          {/* Pricing Basis & Transparency Notice */}
          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
            <span className="font-bold block uppercase tracking-wider text-[11px] text-emerald-800">
              Pricing Basis & Fair Rate Guide
            </span>
            <p className="font-semibold text-sm">{vehicle.pricingBasis}</p>
            <p className="text-emerald-900/80 leading-relaxed text-xs">
              This rate is based on standard fares negotiated with Sreemangal Jeep Syndicate and CNG Welfare associations. Always confirm the destination circuit with your driver before starting.
            </p>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                Included in Benchmark Rate
              </h4>
              <ul className="space-y-1.5 text-stone-600">
                {vehicle.inclusions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                Not Included (Pay Separately)
              </h4>
              <ul className="space-y-1.5 text-stone-600">
                {vehicle.exclusions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <Ban className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Supported Routes */}
          <div>
            <h4 className="font-bold text-stone-900 uppercase tracking-wider text-xs mb-2 flex items-center gap-1.5">
              <Route className="w-3.5 h-3.5 text-emerald-700" />
              <span>Common Verified Routes for this Vehicle</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {vehicle.supportedRoutes.map((route, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs font-medium"
                >
                  {route}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-stone-500">
            <span>Stand Location: Station Road / Habiganj Stand, Sreemangal</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#123524] hover:bg-[#1a4933] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            Close Vehicle Guide
          </button>
        </div>
      </div>
    </div>
  );
};
