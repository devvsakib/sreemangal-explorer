import React, { useState } from 'react';
import { Bed, MapPin, Phone, Check, Sparkles, Filter, Search, X, Star, ExternalLink } from 'lucide-react';
import { db, Accommodation } from '../lib/db';

export const AccommodationGuide: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const accommodations = db.getAccommodations();

  const tiers = [
    { id: 'all', label: 'All Stays' },
    { id: 'Luxury Resort', label: '5-Star Luxury' },
    { id: 'Eco Resort', label: 'Tea Garden Eco-Resorts' },
    { id: 'Heritage Bungalow', label: 'Colonial Heritage Bungalow' },
    { id: 'Budget Hotel', label: 'Budget Hotels (৳1,200 - ৳2,800)' },
  ];

  const filteredAccommodations = accommodations.filter((acc) => {
    const matchesTier = selectedTier === 'all' || acc.tier === selectedTier;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      acc.name.toLowerCase().includes(q) ||
      acc.address.toLowerCase().includes(q) ||
      acc.amenities.some((a) => a.toLowerCase().includes(q)) ||
      acc.bookingTip.toLowerCase().includes(q);

    return matchesTier && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Bed className="w-3.5 h-3.5" />
            <span>Resorts & Stays Guide</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-stone-900">
            Where to Stay in Sreemangal: Stays for Every Budget
          </h2>
          <p className="text-stone-600 text-sm mt-2 max-w-2xl">
            Verified direct contact numbers, price ranges in BDT, and honest amenities so you can book directly without third-party hotel commissions.
          </p>
        </div>

        {/* Real-time search */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resort, hotel, pool, wifi..."
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-stone-200 rounded-xl text-xs placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tier Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {tiers.map((tier) => (
          <button
            key={tier.id}
            onClick={() => setSelectedTier(tier.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedTier === tier.id
                ? 'bg-[#123524] text-white shadow-sm'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            {tier.label}
          </button>
        ))}
      </div>

      {/* Accommodation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAccommodations.map((stay) => (
          <div
            key={stay.id}
            className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 bg-stone-900">
                <img
                  src={stay.coverImage}
                  alt={stay.name}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold">
                    {stay.tier}
                  </span>
                </div>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="font-bold text-lg leading-tight">{stay.name}</h3>
                  <p className="text-xs text-stone-300 font-serif">{stay.bengaliName}</p>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Price block */}
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">
                    Price Range Per Night
                  </span>
                  <div className="text-base font-extrabold text-[#123524] mt-0.5">
                    {stay.priceRangePerNight} BDT
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1.5">
                    Key Amenities & Highlights
                  </span>
                  <div className="space-y-1 text-xs text-stone-700">
                    {stay.amenities.map((amenity, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact & Address */}
                <div className="text-xs text-stone-600 space-y-2 pt-2 border-t border-stone-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-amber-700 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{stay.rating}</span>
                      <span className="text-stone-400 font-normal">
                        ({stay.reviewCount.toLocaleString()} Google reviews)
                      </span>
                    </div>

                    <a
                      href={stay.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#123524] font-bold hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>Google Map</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{stay.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <a href={`tel:${stay.contactPhone}`} className="text-emerald-800 font-semibold hover:underline">
                      {stay.contactPhone} (Direct Front Desk)
                    </a>
                  </div>
                </div>

                {/* Insider Booking Tip */}
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-normal">
                    <strong>Tip:</strong> {stay.bookingTip}
                  </p>
                </div>

                {/* Direct Google Maps Action Button */}
                <div className="pt-2">
                  <a
                    href={stay.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>View Location on Google Maps</span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
