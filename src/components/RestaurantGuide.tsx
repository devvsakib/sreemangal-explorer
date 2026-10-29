import React, { useState } from 'react';
import { Utensils, MapPin, Clock, Phone, Sparkles, Check, Coffee, Search, X, Star, ExternalLink } from 'lucide-react';
import { db, Restaurant } from '../lib/db';

export const RestaurantGuide: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const restaurants = db.getRestaurants();

  const categories = [
    { id: 'all', label: 'All Food & Tea' },
    { id: 'fish', label: 'Freshwater Fish & Bhorta' },
    { id: 'sylheti', label: 'Sylheti Heritage & Shatkora' },
    { id: 'tea', label: '7-Layer Tea & Stalls' },
    { id: 'indigenous', label: 'Manipuri Tribal Cuisine' },
    { id: 'breakfast', label: '24/7 & Breakfast' },
  ];

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesCat =
      selectedCategory === 'all' ||
      (selectedCategory === 'fish' && r.category.includes('Fish')) ||
      (selectedCategory === 'sylheti' && r.category.includes('Sylheti')) ||
      (selectedCategory === 'tea' && r.category.includes('Tea')) ||
      (selectedCategory === 'indigenous' && r.category.includes('Indigenous')) ||
      (selectedCategory === 'breakfast' && r.category.includes('Breakfast'));

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.bengaliName.toLowerCase().includes(q) ||
      r.mustTryDishes.some((d) => d.toLowerCase().includes(q)) ||
      r.address.toLowerCase().includes(q) ||
      r.touristTip.toLowerCase().includes(q);

    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Utensils className="w-3.5 h-3.5" />
            <span>Local Food & Dining Guide</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-stone-900">
            Where to Eat in Sreemangal: Famous Food & Legendary Tea
          </h2>
          <p className="text-stone-600 text-sm mt-2 max-w-2xl">
            From legendary 20+ freshwater fish bhortas at Panshi to authentic Sylheti wild-citrus Shatkora beef and the iconic Seven-Layer Tea.
          </p>
        </div>

        {/* Real-time search */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish (e.g. Bhorta, Shatkora)..."
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

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-[#123524] text-white shadow-sm'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Restaurant Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredRestaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              {/* Header Image */}
              <div className="relative h-56 bg-stone-900">
                <img
                  src={restaurant.coverImage}
                  alt={restaurant.name}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold">
                    {restaurant.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[11px] font-bold">
                    {restaurant.priceLevel} ({restaurant.avgCostPerPerson} BDT / avg)
                  </span>
                </div>

                <div className="absolute bottom-3 left-5 right-5 text-white">
                  <h3 className="font-bold text-2xl leading-tight">{restaurant.name}</h3>
                  <p className="text-xs text-stone-300 font-serif">{restaurant.bengaliName}</p>
                </div>
              </div>

              {/* Details Body */}
              <div className="p-6 space-y-4">
                {/* Must Try Dishes */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 block mb-2">
                    Must-Try Signature Dishes
                  </span>
                  <div className="grid grid-cols-1 gap-1.5 text-xs text-stone-800">
                    {restaurant.mustTryDishes.map((dish, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-medium">{dish}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Practical info */}
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-2 text-xs text-stone-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-amber-700 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{restaurant.rating}</span>
                      <span className="text-stone-400 font-normal">
                        ({restaurant.reviewCount.toLocaleString()} Google reviews)
                      </span>
                    </div>

                    <a
                      href={restaurant.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#123524] font-bold hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>Google Map</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span><strong>Hours:</strong> {restaurant.openingHours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{restaurant.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <a href={`tel:${restaurant.contactPhone}`} className="text-emerald-800 font-semibold hover:underline">
                      {restaurant.contactPhone}
                    </a>
                  </div>
                </div>

                {/* Insider tip */}
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Local Tip:</strong> {restaurant.touristTip}
                  </p>
                </div>

                {/* Direct Google Maps Action Button */}
                <div className="pt-2">
                  <a
                    href={restaurant.googleMapsUrl}
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
