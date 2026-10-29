import React from 'react';
import { X, MapPin, Clock, Ticket, Car, Compass, ExternalLink, ShieldCheck, Star, Navigation } from 'lucide-react';
import { Place } from '../lib/db';

interface PlaceDetailModalProps {
  place: Place | null;
  onClose: () => void;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({ place, onClose }) => {
  if (!place) return null;

  const googleMapsUrl = place.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Cover Header */}
        <div className="relative h-64 sm:h-72 w-full bg-stone-900 shrink-0">
          <img
            src={place.coverImage}
            alt={place.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title & Google Maps Rating on cover */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-300 mb-1">
              <span>{place.category}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Destination
              </span>
              {place.rating && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/50 text-amber-300 font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{place.rating}</span>
                    <span className="text-white/80 font-normal">
                      ({place.reviewCount?.toLocaleString()} Google reviews)
                    </span>
                  </span>
                </>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {place.name}
            </h2>
            <p className="text-sm text-stone-200 font-serif">
              {place.bengaliName} · {place.area}
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-stone-700">
          {/* Description */}
          <div>
            <h3 className="text-xs uppercase font-bold tracking-wider text-stone-500 mb-2">
              About This Destination
            </h3>
            <p className="leading-relaxed text-stone-800 text-base">
              {place.description}
            </p>
          </div>

          {/* Practical Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-stone-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>Visiting Hours & Best Timings</span>
              </span>
              <p className="text-stone-600">{place.openingHours}</p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-stone-900 flex items-center gap-1.5">
                <Ticket className="w-4 h-4 text-emerald-700" />
                <span>Verified Entry & Forest Fees</span>
              </span>
              <p className="text-stone-600">{place.entryFeeInformation}</p>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <span className="font-bold text-stone-900 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-700" />
                <span>Visiting Advice & Best Experience</span>
              </span>
              <p className="text-stone-600 leading-relaxed">{place.visitingInformation}</p>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <span className="font-bold text-stone-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>Access Notes & Road Condition</span>
              </span>
              <p className="text-stone-600 leading-relaxed">{place.accessNotes}</p>
            </div>
          </div>

          {/* Recommended Transport */}
          <div>
            <h3 className="text-xs uppercase font-bold tracking-wider text-stone-500 mb-2.5 flex items-center gap-1.5">
              <Car className="w-4 h-4 text-emerald-700" />
              <span>Recommended Transport to this Place</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {place.bestTransport.map((transport, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-800 text-xs font-semibold"
                >
                  {transport}
                </span>
              ))}
            </div>
          </div>

          {/* Map Link */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-stone-500" />
              <span className="text-stone-600">
                Coordinates: {place.latitude.toFixed(4)}° N, {place.longitude.toFixed(4)}° E
              </span>
            </div>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#123524] font-bold hover:underline flex items-center gap-1"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#123524] hover:bg-[#1a4933] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
