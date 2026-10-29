import React, { useState, useMemo, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Utensils,
  Bed,
  Train,
  Star,
  ExternalLink,
  Navigation,
  Compass,
  Search,
  X,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { db, MapPoint } from '../lib/db';

interface MapControllerProps {
  selectedPoint: MapPoint | null;
}

const MapController: React.FC<MapControllerProps> = ({ selectedPoint }) => {
  const map = useMap();

  React.useEffect(() => {
    if (map && selectedPoint) {
      map.panTo({ lat: selectedPoint.latitude, lng: selectedPoint.longitude });
      map.setZoom(14);
    }
  }, [map, selectedPoint]);

  return null;
};

export const SreemangalMap: React.FC = () => {
  const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || '';
  const allPoints = useMemo(() => db.getAllMapPoints(), []);

  const [activeFilter, setActiveFilter] = useState<'all' | 'place' | 'restaurant' | 'stay' | 'transit'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);

  const filteredPoints = useMemo(() => {
    return allPoints.filter((point) => {
      const matchesType = activeFilter === 'all' || point.type === activeFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        point.name.toLowerCase().includes(q) ||
        point.bengaliName.toLowerCase().includes(q) ||
        point.category.toLowerCase().includes(q) ||
        point.address.toLowerCase().includes(q);

      return matchesType && matchesSearch;
    });
  }, [allPoints, activeFilter, searchQuery]);

  const handleSelectPoint = useCallback((point: MapPoint) => {
    setSelectedPoint(point);
  }, []);

  const getMarkerColor = (type: MapPoint['type']) => {
    switch (type) {
      case 'place':
        return 'bg-emerald-600 border-white text-white shadow-emerald-900/30';
      case 'restaurant':
        return 'bg-amber-600 border-white text-white shadow-amber-900/30';
      case 'stay':
        return 'bg-indigo-600 border-white text-white shadow-indigo-900/30';
      case 'transit':
        return 'bg-blue-600 border-white text-white shadow-blue-900/30';
    }
  };

  const getMarkerIcon = (type: MapPoint['type']) => {
    switch (type) {
      case 'place':
        return <Compass className="w-3.5 h-3.5" />;
      case 'restaurant':
        return <Utensils className="w-3.5 h-3.5" />;
      case 'stay':
        return <Bed className="w-3.5 h-3.5" />;
      case 'transit':
        return <Train className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Interactive Google Map · Real Verified Coordinates</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-stone-900">
            Sreemangal Map Directory & Real Google Maps Links
          </h2>
          <p className="text-stone-600 text-sm mt-1 max-w-2xl">
            Explore verified attractions, tea estates, famous restaurants, resorts, and the railway station. Click any marker for real Google Maps reviews and direct GPS navigation links.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search map (e.g. Lawachara, Panshi)..."
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

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeFilter === 'all'
              ? 'bg-[#123524] text-white shadow-sm'
              : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Spots ({allPoints.length})</span>
        </button>

        <button
          onClick={() => setActiveFilter('place')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeFilter === 'place'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-emerald-600" />
          <span>Destinations & Nature (6)</span>
        </button>

        <button
          onClick={() => setActiveFilter('restaurant')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeFilter === 'restaurant'
              ? 'bg-amber-700 text-white shadow-sm'
              : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
          }`}
        >
          <Utensils className="w-3.5 h-3.5 text-amber-600" />
          <span>Food & Famous Tea (5)</span>
        </button>

        <button
          onClick={() => setActiveFilter('stay')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeFilter === 'stay'
              ? 'bg-indigo-700 text-white shadow-sm'
              : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
          }`}
        >
          <Bed className="w-3.5 h-3.5 text-indigo-600" />
          <span>Resorts & Stays (5)</span>
        </button>

        <button
          onClick={() => setActiveFilter('transit')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeFilter === 'transit'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
          }`}
        >
          <Train className="w-3.5 h-3.5 text-blue-600" />
          <span>Railway Station (1)</span>
        </button>
      </div>

      {/* Main Map + Side Directory Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Google Map Viewport */}
        <div className="lg:col-span-2 bg-stone-100 rounded-3xl overflow-hidden border border-stone-200 shadow-md relative h-[520px] sm:h-[600px]">
          {apiKey ? (
            <APIProvider apiKey={apiKey} libraries={['marker']}>
              <Map
                mapId="DEMO_MAP_ID"
                defaultZoom={12}
                defaultCenter={{ lat: 24.3065, lng: 91.7296 }}
                gestureHandling="greedy"
                disableDefaultUI={false}
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                className="w-full h-full"
              >
                <MapController selectedPoint={selectedPoint} />

                {filteredPoints.map((point) => (
                  <AdvancedMarker
                    key={point.id}
                    position={{ lat: point.latitude, lng: point.longitude }}
                    onClick={() => handleSelectPoint(point)}
                    title={point.name}
                  >
                    <div
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full border-2 shadow-lg cursor-pointer transition-transform hover:scale-110 active:scale-95 ${getMarkerColor(
                        point.type
                      )} ${selectedPoint?.id === point.id ? 'ring-4 ring-emerald-400 scale-110' : ''}`}
                    >
                      {getMarkerIcon(point.type)}
                      <span className="text-[11px] font-bold max-w-[120px] truncate hidden sm:inline">
                        {point.name.split(' ')[0]}
                      </span>
                      <span className="text-[10px] font-semibold opacity-90">
                        ★{point.rating}
                      </span>
                    </div>
                  </AdvancedMarker>
                ))}

                {selectedPoint && (
                  <InfoWindow
                    position={{ lat: selectedPoint.latitude, lng: selectedPoint.longitude }}
                    onCloseClick={() => setSelectedPoint(null)}
                    pixelOffset={[0, -35]}
                  >
                    <div className="max-w-[280px] p-1 text-stone-900 font-sans space-y-2">
                      <div className="relative h-28 rounded-lg overflow-hidden bg-stone-100">
                        <img
                          src={selectedPoint.coverImage}
                          alt={selectedPoint.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white">
                          {selectedPoint.badge || selectedPoint.category}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-sm leading-tight text-stone-900">
                          {selectedPoint.name}
                        </h4>
                        <p className="text-[11px] text-stone-500 font-serif">
                          {selectedPoint.bengaliName}
                        </p>
                      </div>

                      {/* Real Google Maps Rating */}
                      <div className="flex items-center gap-1.5 text-xs text-amber-700 font-semibold">
                        <div className="flex items-center gap-0.5 text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{selectedPoint.rating}</span>
                        </div>
                        <span className="text-stone-500 text-[11px]">
                          ({selectedPoint.reviewCount.toLocaleString()} Google reviews)
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {selectedPoint.summary}
                      </p>

                      <div className="pt-1 flex items-center gap-1.5">
                        <a
                          href={selectedPoint.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-2.5 py-1.5 bg-[#123524] hover:bg-[#1a4933] text-white rounded-lg text-[11px] font-bold text-center flex items-center justify-center gap-1 transition-colors"
                        >
                          <span>Open in Google Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPoint.latitude},${selectedPoint.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors border border-stone-200"
                          title="Get Directions"
                        >
                          <Navigation className="w-3 h-3 text-emerald-700" />
                          <span>Route</span>
                        </a>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-stone-500 bg-stone-50">
              <MapPin className="w-12 h-12 text-stone-400 mb-2" />
              <p className="font-bold text-stone-800 text-base">Google Maps Provisioning Active</p>
              <p className="text-xs text-stone-600 max-w-sm mt-1">
                Please verify your Google Maps key in settings or select any location from the directory list on the right for direct Google Maps links.
              </p>
            </div>
          )}

          {/* Map floating counter badge */}
          <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-200 shadow-sm text-xs font-semibold text-stone-800 flex items-center gap-2 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Showing {filteredPoints.length} verified locations</span>
          </div>
        </div>

        {/* Side Directory of Spots */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col max-h-[600px]">
          <div className="p-4 border-b border-stone-100 bg-stone-50/70 flex items-center justify-between">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-800" />
              <span>Location Directory</span>
            </h3>
            <span className="text-xs text-stone-500 font-medium">
              {filteredPoints.length} spots
            </span>
          </div>

          <div className="divide-y divide-stone-100 overflow-y-auto p-2 space-y-1">
            {filteredPoints.map((point) => {
              const isSelected = selectedPoint?.id === point.id;
              return (
                <div
                  key={point.id}
                  onClick={() => handleSelectPoint(point)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-50/80 border border-emerald-300 shadow-sm'
                      : 'hover:bg-stone-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={point.coverImage}
                      alt={point.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${
                          point.type === 'place'
                            ? 'bg-emerald-500'
                            : point.type === 'restaurant'
                            ? 'bg-amber-500'
                            : point.type === 'stay'
                            ? 'bg-indigo-500'
                            : 'bg-blue-500'
                        }`} />
                        <h4 className="font-bold text-xs text-stone-900 truncate">
                          {point.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-stone-500 font-serif truncate">
                        {point.bengaliName} · {point.address}
                      </p>

                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>{point.rating}</span>
                          <span className="text-stone-400 font-normal">
                            ({point.reviewCount})
                          </span>
                        </div>

                        <a
                          href={point.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="ml-auto text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-0.5 hover:underline"
                        >
                          <span>Google Map</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
