import React from 'react';
import { X, ShieldCheck, Languages, Award, MapPin, Users, Phone } from 'lucide-react';
import { Guide, db } from '../lib/db';

interface GuideDetailModalProps {
  guide: Guide | null;
  onClose: () => void;
}

export const GuideDetailModal: React.FC<GuideDetailModalProps> = ({ guide, onClose }) => {
  if (!guide) return null;
  const settings = db.getSettings();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#123524] text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <img
              src={guide.coverImage}
              alt={guide.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-400/40 shadow-md"
            />
            <div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Certified Forest Naturalist</span>
              </div>
              <h2 className="text-xl font-bold">{guide.name}</h2>
              <p className="text-xs text-stone-300 mt-0.5">
                Sylhet Eco Tour Guild & Forest Department Trained
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-stone-700">
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-stone-500 mb-2">
              Background & Track Record
            </h4>
            <p className="leading-relaxed text-stone-800 text-sm">
              {guide.description}
            </p>
          </div>

          {/* Languages & Group Size */}
          <div className="grid grid-cols-2 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
            <div>
              <span className="text-stone-500 block mb-1 font-medium flex items-center gap-1">
                <Languages className="w-3.5 h-3.5 text-emerald-700" />
                <span>Languages Spoken</span>
              </span>
              <p className="font-bold text-stone-900">{guide.languages.join(', ')}</p>
            </div>

            <div>
              <span className="text-stone-500 block mb-1 font-medium flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-700" />
                <span>Max Group Size</span>
              </span>
              <p className="font-bold text-stone-900">Up to {guide.groupSizeLimit} Persons</p>
            </div>
          </div>

          {/* Specialties */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-stone-500 mb-2 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-700" />
              <span>Specialized Forest Knowledge</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {guide.specialties.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-900 text-xs font-semibold"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Service Areas */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-stone-500 mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>Service Areas</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {guide.serviceAreas.map((area, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs font-medium"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Pricing Basis */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
            <span className="text-stone-500 block">Standard Government / Guild Rate Benchmark:</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold text-[#123524]">
                ৳ {guide.indicativePrice.toLocaleString()} BDT
              </span>
              <span className="text-stone-500 font-medium">
                · {guide.pricingBasis}
              </span>
            </div>
            <p className="text-stone-500 text-[11px] mt-1.5">
              Tip: Certified guides are available directly at the Lawachara gate ticket counter or Baikka Beel observation center. Pay the guide directly in cash after your trail.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#123524] hover:bg-[#1a4933] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
