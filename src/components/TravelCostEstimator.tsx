import React, { useState } from 'react';
import {
  Calculator,
  Car,
  Bed,
  Utensils,
  Train,
  UserCheck,
  Sparkles,
  Info,
  CheckCircle,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';
import { calculateTripBudget, BudgetInput } from '../lib/costCalculator';
import { db } from '../lib/db';

export const TravelCostEstimator: React.FC = () => {
  const [days, setDays] = useState<number>(2);
  const [groupSize, setGroupSize] = useState<number>(3);
  const [transportType, setTransportType] = useState<BudgetInput['transportType']>('cng');
  const [accommodationTier, setAccommodationTier] = useState<BudgetInput['accommodationTier']>('budget');
  const [foodTier, setFoodTier] = useState<BudgetInput['foodTier']>('popular_restaurants');
  const [includeGuide, setIncludeGuide] = useState<boolean>(false);
  const [transitFromDhaka, setTransitFromDhaka] = useState<boolean>(true);

  const budget = calculateTripBudget({
    days,
    groupSize,
    transportType,
    accommodationTier,
    foodTier,
    includeGuide,
    transitFromDhaka,
  });

  const standardRoutes = db.getStandardRouteRates();

  return (
    <div className="space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
          <Calculator className="w-3.5 h-3.5" />
          <span>Interactive Cost Estimator</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-stone-900">
          Plan Your Sreemangal Travel Budget
        </h2>
        <p className="text-stone-600 text-sm mt-2">
          Calculate transparent, realistic trip expenses based on local market benchmarks. Avoid overpaying station touts and plan meals, transport, and stays accurately.
        </p>
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          {/* Days & Group Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                Trip Duration
              </label>
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-stone-100 rounded-xl">
                {[1, 2, 3, 4].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDays(d)}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${
                      days === d
                        ? 'bg-[#123524] text-white shadow-sm'
                        : 'text-stone-700 hover:text-stone-900'
                    }`}
                  >
                    {d} {d === 1 ? 'Day' : 'Days'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                Group Size ({groupSize} Pax)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={groupSize}
                  onChange={(e) => setGroupSize(parseInt(e.target.value) || 1)}
                  className="flex-1 accent-[#123524] h-2 bg-stone-200 rounded-lg cursor-pointer"
                />
                <span className="w-12 text-center font-bold text-sm bg-stone-100 py-1.5 rounded-lg border border-stone-200">
                  {groupSize}
                </span>
              </div>
            </div>
          </div>

          {/* Transport Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2 flex items-center gap-1.5">
              <Car className="w-4 h-4 text-emerald-800" />
              <span>Local Transport Vehicle</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'cng', label: 'CNG 3-Wheeler', note: 'Max 4 pax · ৳1,500/day' },
                { id: 'chander_gari', label: '4x4 Chander Gari', note: 'Max 10 pax · ৳3,800/day' },
                { id: 'microbus', label: 'AC Microbus', note: 'Max 11 pax · ৳5,500/day' },
                { id: 'bicycle', label: 'Bicycle Rental', note: 'Eco pedal · ৳400/day/pax' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTransportType(t.id as typeof transportType)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    transportType === t.id
                      ? 'border-[#123524] bg-[#123524]/5 ring-1 ring-[#123524]'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <span className="font-bold text-xs text-stone-900 block">{t.label}</span>
                  <span className="text-[10px] text-stone-500 mt-1 block">{t.note}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Accommodation Style */}
          {days > 1 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2 flex items-center gap-1.5">
                <Bed className="w-4 h-4 text-emerald-800" />
                <span>Stay / Hotel Style ({days - 1} night{days > 2 ? 's' : ''})</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    id: 'budget',
                    title: 'Clean Budget Hotel',
                    price: 'Approx ৳1,200/room/night',
                    desc: 'Clean AC/non-AC rooms near Station Road (Hotel Tea Town, Sandhya)',
                  },
                  {
                    id: 'comfort',
                    title: 'Eco-Resort Cottage',
                    price: 'Approx ৳3,500/room/night',
                    desc: 'Peaceful tea-garden cottages (Shanti Bari, Tea Resort)',
                  },
                  {
                    id: 'luxury',
                    title: 'Luxury 5-Star Resort',
                    price: 'Approx ৳11,000/room/night',
                    desc: 'Grand Sultan or Novem Eco Resort with pool & golf',
                  },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setAccommodationTier(tier.id as typeof accommodationTier)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      accommodationTier === tier.id
                        ? 'border-[#123524] bg-[#123524]/5 ring-1 ring-[#123524]'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <span className="font-bold text-xs text-stone-900 block">{tier.title}</span>
                    <span className="text-[11px] font-semibold text-emerald-800 mt-0.5 block">
                      {tier.price}
                    </span>
                    <span className="text-[10px] text-stone-500 mt-1 block line-clamp-2">
                      {tier.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dining / Food Style */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2 flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-emerald-800" />
              <span>Dining & Food Preference</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                {
                  id: 'street_local',
                  title: 'Budget Local Eateries',
                  cost: '৳300 / person / day',
                  desc: 'Bazaar diners, paratha breakfast, tea stalls',
                },
                {
                  id: 'popular_restaurants',
                  title: 'Popular Restaurants',
                  cost: '৳600 / person / day',
                  desc: 'Panshi freshwater fish bhortas, Kutum Bari Shatkora beef, 7-layer tea',
                },
                {
                  id: 'resort_dining',
                  title: 'Resort Dining',
                  cost: '৳1,400 / person / day',
                  desc: 'Multi-course resort buffets & executive meals',
                },
              ].map((food) => (
                <button
                  key={food.id}
                  type="button"
                  onClick={() => setFoodTier(food.id as typeof foodTier)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    foodTier === food.id
                      ? 'border-[#123524] bg-[#123524]/5 ring-1 ring-[#123524]'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <span className="font-bold text-xs text-stone-900 block">{food.title}</span>
                  <span className="text-[11px] font-semibold text-emerald-800 block mt-0.5">
                    {food.cost}
                  </span>
                  <span className="text-[10px] text-stone-500 block mt-1 line-clamp-2">
                    {food.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Toggles: Guide & Train */}
          <div className="pt-2 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer">
              <input
                type="checkbox"
                checked={transitFromDhaka}
                onChange={(e) => setTransitFromDhaka(e.target.checked)}
                className="rounded border-stone-300 text-[#123524] focus:ring-[#123524] w-4 h-4"
              />
              <div className="text-xs">
                <span className="font-bold text-stone-900 block flex items-center gap-1">
                  <Train className="w-3.5 h-3.5 text-stone-500" />
                  <span>Include Train Fare from Dhaka</span>
                </span>
                <span className="text-stone-500 text-[11px]">
                  Shovon Chair roundtrip (~৳550 / person)
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer">
              <input
                type="checkbox"
                checked={includeGuide}
                onChange={(e) => setIncludeGuide(e.target.checked)}
                className="rounded border-stone-300 text-[#123524] focus:ring-[#123524] w-4 h-4"
              />
              <div className="text-xs">
                <span className="font-bold text-stone-900 block flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-stone-500" />
                  <span>Certified Naturalist Guide</span>
                </span>
                <span className="text-stone-500 text-[11px]">
                  For Lawachara Gibbon trail (~৳1,500/day)
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Results Card Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#123524] text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                Estimated Trip Budget
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">
                  ৳ {budget.totalBDT.toLocaleString()}
                </span>
                <span className="text-sm text-stone-300">BDT total</span>
              </div>

              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300">
                <span>Approx ৳ {budget.perPersonBDT.toLocaleString()} per person</span>
                <span className="text-emerald-500">·</span>
                <span>{groupSize} Pax, {days} Day{days > 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Itemized Breakdown */}
            <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
              <span className="font-bold uppercase tracking-wider text-stone-400 block text-[10px]">
                Itemized Cost Breakdown
              </span>
              {budget.items.map((item, idx) => (
                <div key={idx} className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-semibold text-white block">{item.category}</span>
                    <span className="text-stone-300 text-[11px] block">{item.description}</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-300 shrink-0">
                    ৳ {item.costBDT.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[11px] text-stone-400 leading-relaxed border-t border-white/10">
              * Note: Estimates reflect verified seasonal benchmarks. Pay drivers and restaurants directly in BDT. Sreemangal Explorer does not charge middleman fees.
            </div>
          </div>

          {/* Local Saving Tips */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 space-y-3 text-xs text-amber-950">
            <h3 className="font-bold text-sm text-amber-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Local Money-Saving & Practical Advice</span>
            </h3>
            <ul className="space-y-2 text-stone-700">
              {budget.localSavingTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Verified Route Fare Benchmarks (Tourists Fare Shield) */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
            Tourist Fare Shield
          </span>
          <h3 className="text-xl font-bold text-stone-900 mt-1">
            Standard Local Route Fares (Sreemangal Syndicate Benchmarks)
          </h3>
          <p className="text-xs text-stone-600 mt-1">
            Keep this reference on your phone so local drivers and station touts cannot overcharge you.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Standard Route</th>
                <th className="p-3.5">Distance</th>
                <th className="p-3.5">CNG Fare Range</th>
                <th className="p-3.5">Chander Gari Fare</th>
                <th className="p-3.5">Tips & Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {standardRoutes.map((route, i) => (
                <tr key={i} className="hover:bg-stone-50/70">
                  <td className="p-3.5 font-bold text-stone-900">{route.route}</td>
                  <td className="p-3.5 font-medium whitespace-nowrap text-stone-600">
                    {route.distanceKm}
                  </td>
                  <td className="p-3.5 whitespace-nowrap font-semibold text-emerald-800">
                    {route.cngFareRange}
                  </td>
                  <td className="p-3.5 whitespace-nowrap font-semibold text-[#123524]">
                    {route.chanderGariFareRange}
                  </td>
                  <td className="p-3.5 text-stone-500 text-[11px] max-w-xs">{route.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
