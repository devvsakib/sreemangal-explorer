import React, { useState, useEffect } from 'react';
import {
  Compass,
  MapPin,
  Car,
  Utensils,
  Bed,
  Train,
  Calendar,
  ShieldCheck,
  Search,
  ArrowRight,
  Clock,
  Ticket,
  Calculator,
  Sparkles,
  Phone,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  Star,
} from 'lucide-react';
import {
  db,
  Place,
  Vehicle,
  Guide,
  TripIdea,
  SiteSettings,
} from './lib/db';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { TravelCostEstimator } from './components/TravelCostEstimator';
import { SreemangalMap } from './components/SreemangalMap';
import { RestaurantGuide } from './components/RestaurantGuide';
import { AccommodationGuide } from './components/AccommodationGuide';
import { TransitGuide } from './components/TransitGuide';
import { PlaceDetailModal } from './components/PlaceDetailModal';
import { VehicleDetailModal } from './components/VehicleDetailModal';
import { GuideDetailModal } from './components/GuideDetailModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [settings, setSettings] = useState<SiteSettings>(db.getSettings());
  const [places, setPlaces] = useState<Place[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [trips, setTrips] = useState<TripIdea[]>([]);

  // Modals (Data & Info only)
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);

  // Filters
  const [placeCategoryFilter, setPlaceCategoryFilter] = useState<string>('all');
  const [placeSearch, setPlaceSearch] = useState<string>('');

  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<string>('all');
  const [vehicleSearch, setVehicleSearch] = useState<string>('');

  useEffect(() => {
    setPlaces(db.getPlaces(true));
    setVehicles(db.getVehicles(true));
    setGuides(db.getGuides(true));
    setTrips(db.getTrips());
    setSettings(db.getSettings());
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f5] text-[#18201b] font-sans">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="flex-1">
        {/* ========================================================= */}
        {/* TAB 1: HOMEPAGE (/)                                       */}
        {/* ========================================================= */}
        {currentTab === 'home' && (
          <div className="space-y-16 pb-16">
            {/* Hero Section */}
            <section className="relative bg-[#123524] text-white overflow-hidden py-16 sm:py-24">
              <div
                className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1600&q=80')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#123524] via-[#123524]/90 to-transparent pointer-events-none" />

              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold backdrop-blur-sm border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Complete Tourist Resource · 100% Free & Transparent Data</span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                    Explore Sreemangal.{' '}
                    <span className="text-emerald-400 block font-serif italic font-normal">
                      Your way.
                    </span>
                  </h1>

                  <p className="text-stone-300 text-base sm:text-lg leading-relaxed font-normal max-w-2xl">
                    Everything you need to explore Bangladesh&apos;s Tea Capital without getting overcharged. Complete travel cost breakdowns, train schedules, famous restaurant guides, and verified destination entry fees.
                  </p>

                  {/* Primary Data CTAs */}
                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      onClick={() => setCurrentTab('calculator')}
                      className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <Calculator className="w-4 h-4" />
                      <span>Cost Calculator</span>
                    </button>

                    <button
                      onClick={() => setCurrentTab('map')}
                      className="px-6 py-3.5 bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 border border-emerald-500/30"
                    >
                      <MapPin className="w-4 h-4 text-emerald-300" />
                      <span>Interactive Google Map</span>
                    </button>

                    <button
                      onClick={() => setCurrentTab('places')}
                      className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition-colors border border-white/20 flex items-center justify-center gap-2"
                    >
                      <Compass className="w-4 h-4 text-emerald-300" />
                      <span>Destinations</span>
                    </button>

                    <button
                      onClick={() => setCurrentTab('food')}
                      className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition-colors border border-white/20 flex items-center justify-center gap-2"
                    >
                      <Utensils className="w-4 h-4 text-emerald-300" />
                      <span>Food & 7-Layer Tea</span>
                    </button>
                  </div>

                  {/* Transparency note */}
                  <div className="pt-2 flex items-center gap-2 text-xs text-stone-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Pure traveler data · No booking commission or middleman markups</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Tourist Fare Shield Quick Callout */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-md border border-emerald-800 flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="space-y-1.5 max-w-2xl">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-400">
                    Tourist Fare Shield · Don&apos;t Get Overcharged
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold">
                    Official Transport Benchmark Rates at a Glance
                  </h3>
                  <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                    Sreemangal Station touts frequently quote ৳2,500+ to newcomers. Know the real rates:
                    Standard full-day CNG is <strong>৳1,400 - ৳1,600</strong>; 4x4 Chander Gari is <strong>৳3,500 - ৳4,000</strong>.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setCurrentTab('calculator')}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-[#123524] font-extrabold rounded-xl text-xs transition-colors shadow-sm"
                  >
                    Calculate Your Exact Budget
                  </button>
                  <button
                    onClick={() => setCurrentTab('transport')}
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-colors border border-white/20"
                  >
                    View All Route Rates
                  </button>
                </div>
              </div>
            </section>

            {/* Popular Destinations Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                    Attraction Directory
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                    Sreemangal & Moulvibazar Attractions
                  </h2>
                  <p className="text-stone-600 text-sm mt-1">
                    Verified visiting hours, gate fees, and access caveats. Click any place for full details.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentTab('places')}
                  className="text-xs font-bold text-[#123524] hover:underline flex items-center gap-1 shrink-0"
                >
                  <span>View All 6 Destinations</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {places.slice(0, 6).map((place) => (
                  <div
                    key={place.id}
                    onClick={() => setSelectedPlace(place)}
                    className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="relative h-52 bg-stone-900 overflow-hidden">
                      <img
                        src={place.coverImage}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold">
                          {place.category}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-amber-300 text-[11px] font-bold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{place.rating}</span>
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <h3 className="font-bold text-lg leading-tight">{place.name}</h3>
                        <p className="text-xs text-stone-300 font-serif">{place.bengaliName}</p>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {place.shortDescription}
                      </p>

                      <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-[11px] text-stone-600 space-y-1">
                        <div>
                          <strong>Hours:</strong> {place.openingHours}
                        </div>
                        <div>
                          <strong>Entry:</strong> {place.entryFeeInformation}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                        <span className="text-stone-500 font-medium">{place.area}</span>
                        <div className="flex items-center gap-2">
                          <a
                            href={place.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-stone-500 hover:text-emerald-800 font-bold flex items-center gap-0.5 hover:underline"
                          >
                            <MapPin className="w-3 h-3 text-emerald-600" />
                            <span>Map</span>
                          </a>
                          <span className="text-[#123524] font-bold flex items-center gap-0.5 group-hover:text-emerald-700">
                            <span>Details</span>
                            <span>→</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Food & Dining Preview Section */}
            <section className="bg-stone-100/70 py-14 border-y border-stone-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                      Culinary Heritage
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                      Famous Food & Iconic 7-Layer Tea
                    </h2>
                    <p className="text-stone-600 text-sm mt-1">
                      Where to eat freshwater fish bhortas, fragrant Shatkora beef, and Romesh Ram Gour&apos;s layered tea invention.
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentTab('food')}
                    className="text-xs font-bold text-[#123524] hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>View All Food Spots</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {db.getRestaurants().slice(0, 3).map((r) => (
                    <div
                      key={r.id}
                      onClick={() => setCurrentTab('food')}
                      className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                            {r.category.split(',')[0]}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-stone-100 text-stone-700">
                            ~৳{r.avgCostPerPerson}/pax
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-stone-900">{r.name}</h3>
                        <p className="text-xs text-stone-500 font-serif mb-3">{r.bengaliName}</p>
                        <div className="space-y-1 text-xs text-stone-700">
                          {r.mustTryDishes.slice(0, 2).map((dish, i) => (
                            <div key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-700 font-bold">✓</span>
                              <span className="line-clamp-1">{dish}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
                        <span>{r.area}</span>
                        <span className="text-[#123524] font-bold">Menu & Hours →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Travel Practicalities & Survival Guide */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                  Tourist Survival Manual
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                  Essential Sreemangal Travel Advice
                </h2>
                <p className="text-stone-600 text-sm mt-2">
                  Practical insider knowledge for weather, trail safety, ATMs, and local customs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
                  <h3 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>Best Time to Visit</span>
                  </h3>
                  <p className="text-stone-600 leading-relaxed">
                    <strong>November to February</strong> is peak winter: cool morning fog, migratory birds at Baikka Beel, comfortable cycling.
                    <strong>June to September</strong> brings lush emerald monsoons, active tea plucking, and roaring waterfalls (Hum Hum).
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
                  <h3 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span>Leech & Jungle Safety</span>
                  </h3>
                  <p className="text-stone-600 leading-relaxed">
                    During rainy months, forest leeches (জোক) thrive in Lawachara and Hum Hum. Carry tobacco powder or concentrated salt in a pouch. Wear high socks over trousers.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
                  <h3 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                    <Ticket className="w-4 h-4 text-emerald-700" />
                    <span>Cash & ATMs</span>
                  </h3>
                  <p className="text-stone-600 leading-relaxed">
                    Dutch-Bangla Bank (DBBL), BRAC Bank, and Islami Bank ATMs are located on Station Road and College Road in Sreemangal town. Rural tea estates, gate counters, and fruit stalls only accept cash (BDT).
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
                  <h3 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-emerald-700" />
                    <span>Tribal Village Etiquette</span>
                  </h3>
                  <p className="text-stone-600 leading-relaxed">
                    When visiting Manipuri or Khasia hamlets, ask permission before photographing family weavers in their personal courtyards. Buying handloom textiles directly supports local women artisans.
                  </p>
                </div>
              </div>
            </section>
            {/* Interactive Google Map Teaser Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-[#123524] to-[#1a4933] rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl">
                <div className="relative z-10 max-w-2xl space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold backdrop-blur-sm border border-white/10">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Real Google Maps Integration</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Explore Sreemangal on Interactive Google Maps
                  </h2>
                  <p className="text-stone-200 text-sm leading-relaxed">
                    Pinpoint all 17 verified attractions, remote rainforest trails, 20+ fish bhorta eateries, tea gardens, resorts, and train platforms with authentic Google Maps ratings, reviews, and one-tap GPS directions.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      onClick={() => setCurrentTab('map')}
                      className="px-5 py-3 bg-white text-[#123524] font-bold rounded-xl text-xs hover:bg-stone-100 transition-colors shadow-md flex items-center gap-2"
                    >
                      <MapPin className="w-4 h-4 text-emerald-700" />
                      <span>Launch Full Interactive Map</span>
                    </button>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Sreemangal+Moulvibazar+Bangladesh"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-colors border border-white/20 flex items-center gap-2"
                    >
                      <span>Open Sreemangal on Google Maps App</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 opacity-25 pointer-events-none">
                  <Compass className="w-72 h-72 text-emerald-300" />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: COST CALCULATOR (/calculator)                      */}
        {/* ========================================================= */}
        {currentTab === 'calculator' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <TravelCostEstimator />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2.5: INTERACTIVE GOOGLE MAP (/map)                    */}
        {/* ========================================================= */}
        {currentTab === 'map' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <SreemangalMap />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: PLACES DIRECTORY (/places)                        */}
        {/* ========================================================= */}
        {currentTab === 'places' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                Destination Directory
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-stone-900 mt-1">
                Explore Places in Sreemangal & Moulvibazar
              </h1>
              <p className="text-stone-600 text-sm mt-2 max-w-2xl">
                Every place has verified visiting hours, actual entry fee information, and recommended transport options from town.
              </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200">
              <div className="flex items-center gap-2 overflow-x-auto">
                {['all', 'National Park', 'Wetland', 'Tea Estate', 'Waterfall', 'Cultural'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setPlaceCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      placeCategoryFilter === cat
                        ? 'bg-[#123524] text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {cat === 'all' ? 'All Places' : cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={placeSearch}
                  onChange={(e) => setPlaceSearch(e.target.value)}
                  placeholder="Search destinations..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#123524] bg-stone-50"
                />
              </div>
            </div>

            {/* Places Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {places
                .filter((p) => {
                  const matchCat =
                    placeCategoryFilter === 'all' ||
                    p.category.toLowerCase().includes(placeCategoryFilter.toLowerCase());
                  const matchSearch =
                    p.name.toLowerCase().includes(placeSearch.toLowerCase()) ||
                    p.area.toLowerCase().includes(placeSearch.toLowerCase()) ||
                    p.shortDescription.toLowerCase().includes(placeSearch.toLowerCase());
                  return matchCat && matchSearch;
                })
                .map((place) => (
                  <div
                    key={place.id}
                    onClick={() => setSelectedPlace(place)}
                    className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="relative h-56 bg-stone-900">
                      <img
                        src={place.coverImage}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold">
                          {place.category}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-amber-300 text-[11px] font-bold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{place.rating}</span>
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <h3 className="font-bold text-xl leading-tight">{place.name}</h3>
                        <p className="text-xs text-stone-200 font-serif">{place.bengaliName}</p>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                        {place.shortDescription}
                      </p>

                      <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-[11px] text-stone-600 space-y-1">
                        <div>
                          <strong>Hours:</strong> {place.openingHours}
                        </div>
                        <div>
                          <strong>Entry:</strong> {place.entryFeeInformation}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                        <span className="text-stone-500 font-medium">{place.area}</span>
                        <div className="flex items-center gap-2">
                          <a
                            href={place.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-stone-500 hover:text-emerald-800 font-bold flex items-center gap-0.5 hover:underline"
                            title="Open in Google Maps"
                          >
                            <MapPin className="w-3 h-3 text-emerald-600" />
                            <span>Map</span>
                          </a>
                          <span className="text-[#123524] font-bold flex items-center gap-0.5 group-hover:text-emerald-700">
                            <span>Details</span>
                            <span>→</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: FOOD & RESTAURANTS (/food)                        */}
        {/* ========================================================= */}
        {currentTab === 'food' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <RestaurantGuide />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: RESORTS & HOTELS (/stays)                         */}
        {/* ========================================================= */}
        {currentTab === 'stays' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <AccommodationGuide />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: TRAIN & BUS TRANSIT (/transit)                    */}
        {/* ========================================================= */}
        {currentTab === 'transit' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <TransitGuide />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: TRANSPORT BENCHMARKS (/transport)                 */}
        {/* ========================================================= */}
        {currentTab === 'transport' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                Local Fleet Rates
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-stone-900 mt-1">
                Vehicle Rentals & Benchmark Fares
              </h1>
              <p className="text-stone-600 text-sm mt-2 max-w-2xl">
                Compare capacities and verified syndicate rates so you know exactly what to pay at the station stand.
              </p>
            </div>

            {/* Filter bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200">
              <div className="flex items-center gap-2 overflow-x-auto">
                {[
                  { id: 'all', label: 'All Vehicles' },
                  { id: 'cng', label: 'CNG 3-Wheeler' },
                  { id: 'chander_gari', label: '4x4 Chander Gari' },
                  { id: 'microbus', label: 'AC Microbus' },
                  { id: 'car', label: 'Sedan Car' },
                  { id: 'bicycle', label: 'Bicycles' },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setVehicleTypeFilter(type.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      vehicleTypeFilter === type.id
                        ? 'bg-[#123524] text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={vehicleSearch}
                  onChange={(e) => setVehicleSearch(e.target.value)}
                  placeholder="Search vehicle name..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#123524] bg-stone-50"
                />
              </div>
            </div>

            {/* Vehicle Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles
                .filter((v) => {
                  const matchType =
                    vehicleTypeFilter === 'all' || v.vehicleType === vehicleTypeFilter;
                  const matchSearch =
                    v.name.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
                    v.providerName.toLowerCase().includes(vehicleSearch.toLowerCase());
                  return matchType && matchSearch;
                })
                .map((vehicle) => (
                  <div
                    key={vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle)}
                    className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-52 bg-stone-900">
                        <img
                          src={vehicle.coverImage}
                          alt={vehicle.name}
                          className="w-full h-full object-cover opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold capitalize">
                            {vehicle.vehicleType.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-4 right-4 text-white">
                          <h3 className="font-bold text-lg leading-tight">{vehicle.name}</h3>
                          <p className="text-xs text-stone-300">
                            {vehicle.providerName}
                          </p>
                        </div>
                      </div>

                      <div className="p-5 space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-3 rounded-xl border border-stone-200">
                          <div>
                            <span className="text-stone-500 block">Capacity</span>
                            <span className="font-bold text-stone-900">
                              Up to {vehicle.passengerCapacity} Pax
                            </span>
                          </div>
                          <div>
                            <span className="text-stone-500 block">Driver</span>
                            <span className="font-bold text-stone-900">
                              {vehicle.driverIncluded ? 'Driver Included' : 'Self-Pedal'}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-stone-600 line-clamp-2">
                          <strong>Luggage:</strong> {vehicle.luggageDetails}
                        </p>

                        <div className="pt-2">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-bold text-[#123524]">
                              ৳ {vehicle.indicativePrice.toLocaleString()}
                            </span>
                            <span className="text-xs text-stone-500 font-medium">
                              {vehicle.currency} · Benchmark
                            </span>
                          </div>
                          <span className="text-[11px] text-stone-500 block mt-0.5">
                            {vehicle.pricingBasis}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="text-stone-500">Stand: Sreemangal Station</span>
                      <span className="text-[#123524] font-bold">View Inclusions & Rates →</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 8: TRIP PLANS (/trips)                               */}
        {/* ========================================================= */}
        {currentTab === 'trips' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                Curated Routes
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-stone-900 mt-1">
                Suggested One-Day & Two-Day Trips
              </h1>
              <p className="text-stone-600 text-sm mt-2 max-w-2xl">
                Carefully scheduled to match morning wildlife activity, quiet temple hours, and breathtaking lake sunsets.
              </p>
            </div>

            <div className="space-y-8">
              {trips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm"
                >
                  <div className="p-6 sm:p-8 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                          {trip.duration} Route
                        </span>
                        <h2 className="text-2xl font-bold text-stone-900 mt-2">{trip.title}</h2>
                        <p className="text-sm text-stone-600 mt-1">{trip.tagline}</p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-xs text-stone-400 block font-medium">Estimated Budget</span>
                        <span className="text-lg font-bold text-[#123524]">{trip.estimatedCostRange}</span>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
                        Key Experience Highlights
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
                        {trip.highlights.map((h: string, i: number) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-emerald-700 font-bold">✓</span>
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Timeline stops */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                        Trip Timeline & Schedule
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {trip.stops.map((stop: any) => (
                          <div
                            key={stop.order}
                            className="p-4 rounded-xl border border-stone-200 flex items-start gap-3 bg-white"
                          >
                            <span className="w-6 h-6 rounded-full bg-[#123524] text-white flex items-center justify-center text-xs font-bold shrink-0">
                              {stop.order}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-stone-900 text-sm">
                                  {stop.destinationName}
                                </h4>
                                <span className="text-xs text-stone-400">({stop.duration})</span>
                              </div>
                              <p className="text-xs text-stone-600 mt-1 leading-normal">
                                {stop.activity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Transport Advice */}
                    <div className="pt-4 border-t border-stone-100 text-xs text-stone-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <p>
                        <strong>Recommended Transport:</strong> {trip.recommendedTransport}
                      </p>
                      <p>
                        <strong>Logistics:</strong> {trip.travelLogistics}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 9: ABOUT & EMERGENCY DIRECTORY (/about)              */}
        {/* ========================================================= */}
        {currentTab === 'about' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                Local Tourism Hub
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-stone-900 mt-1">
                About Sreemangal Explorer
              </h1>
              <p className="text-stone-600 text-base mt-3 leading-relaxed">
                Sreemangal Explorer is an independent, non-commercial tourist information portal. We provide transparent, verified market data covering transportation benchmarks, train timetables, hotel rates, and regional food spots.
              </p>
            </div>

            {/* Emergency & Official Local Contacts */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                <Phone className="w-5 h-5 text-emerald-800" />
                <span>Important Sreemangal Emergency & Official Contacts</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <strong className="text-stone-900 block text-sm">Sreemangal Police Station (Thana)</strong>
                  <span className="text-stone-600 block">Duty Officer Desk: 01713-374438 / 08626-71233</span>
                  <span className="text-[11px] text-stone-500">Located on Moulvibazar Road, Sreemangal</span>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <strong className="text-stone-900 block text-sm">Tourist Police Sylhet Zone</strong>
                  <span className="text-stone-600 block">Hotline: 01320-199999</span>
                  <span className="text-[11px] text-stone-500">Dedicated tourist security and assistance</span>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <strong className="text-stone-900 block text-sm">Sreemangal Upazila Health Complex</strong>
                  <span className="text-stone-600 block">Emergency Ward: 01730-324838</span>
                  <span className="text-[11px] text-stone-500">24/7 emergency medical care & anti-venom/first aid</span>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <strong className="text-stone-900 block text-sm">Sreemangal Railway Station Master</strong>
                  <span className="text-stone-600 block">Counter: 01711-692222</span>
                  <span className="text-[11px] text-stone-500">Train schedules & platform inquiries</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 10: POLICIES & TRANSPARENCY (/policies)              */}
        {/* ========================================================= */}
        {currentTab === 'policies' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                Transparency & Notice
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-stone-900 mt-1">
                Platform Notice & Data Transparency
              </h1>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2">
                <h3 className="font-bold text-stone-900 text-base">Pure Data & Informational Resource</h3>
                <p>
                  Sreemangal Explorer is currently operating purely as a free tourist information and cost-benchmark guide. We have disabled booking request forms and middleman actions to focus 100% on equipping visitors with reliable data.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2">
                <h3 className="font-bold text-stone-900 text-base">Direct Local Payment</h3>
                <p>
                  All transport fares, hotel rates, and restaurant meals are paid directly by you in Bangladesh Taka (BDT) to local operators and establishments. Never prepay strangers online without verified credentials.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer setCurrentTab={setCurrentTab} />

      {/* Detail Modals (Pure Data & Maps) */}
      <PlaceDetailModal place={selectedPlace} onClose={() => setSelectedPlace(null)} />
      <VehicleDetailModal vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />
      <GuideDetailModal guide={selectedGuide} onClose={() => setSelectedGuide(null)} />
    </div>
  );
}
