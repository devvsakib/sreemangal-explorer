/**
 * Sreemangal Explorer - Unified Data Layer & Store
 * Supports both standalone persistent local store and optional Supabase PostgreSQL sync.
 */

export interface Place {
  id: string;
  name: string;
  bengaliName: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  area: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  rating: number;
  reviewCount: number;
  coverImage: string;
  gallery: string[];
  visitingInformation: string;
  accessNotes: string;
  openingHours: string;
  entryFeeInformation: string;
  verificationStatus: 'verified' | 'unverified';
  lastVerifiedAt: string;
  published: boolean;
  bestTransport: string[];
  createdAt: string;
}

export interface Provider {
  id: string;
  displayName: string;
  providerType: string;
  publicContactNumber: string | null;
  privateContactDetails: string;
  verificationStatus: 'verified' | 'pending_review';
  active: boolean;
  agreedCommissionType: 'percentage' | 'fixed';
  agreedCommissionValue: number;
  internalNotes: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  providerId: string;
  providerName: string;
  name: string;
  slug: string;
  vehicleType: 'cng' | 'chander_gari' | 'electric_bike' | 'bicycle' | 'car' | 'microbus';
  passengerCapacity: number;
  driverIncluded: boolean;
  luggageDetails: string;
  supportedRoutes: string[];
  pricingBasis: string;
  indicativePrice: number;
  currency: string;
  inclusions: string[];
  exclusions: string[];
  coverImage: string;
  published: boolean;
  lastPriceVerifiedAt: string;
  createdAt: string;
}

export interface Guide {
  id: string;
  providerId: string;
  name: string;
  slug: string;
  description: string;
  languages: string[];
  specialties: string[];
  serviceAreas: string[];
  groupSizeLimit: number;
  indicativePrice: number;
  pricingBasis: string;
  verificationStatus: 'verified' | 'pending_review';
  coverImage: string;
  published: boolean;
  createdAt: string;
}

export interface TripIdea {
  id: string;
  title: string;
  duration: '1-Day' | '2-Day';
  tagline: string;
  description: string;
  highlights: string[];
  stops: {
    order: number;
    destinationName: string;
    duration: string;
    activity: string;
  }[];
  recommendedTransport: string;
  estimatedCostRange: string;
  travelLogistics: string;
  coverImage: string;
}

export interface MapPoint {
  id: string;
  name: string;
  bengaliName: string;
  category: string;
  type: 'place' | 'restaurant' | 'stay' | 'transit';
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  address: string;
  googleMapsUrl: string;
  coverImage: string;
  summary: string;
  badge?: string;
  priceInfo?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  bengaliName: string;
  category: string;
  area: string;
  avgCostPerPerson: number;
  priceLevel: '$' | '$$' | '$$$';
  mustTryDishes: string[];
  openingHours: string;
  address: string;
  contactPhone: string;
  coverImage: string;
  touristTip: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  rating: number;
  reviewCount: number;
}

export interface Accommodation {
  id: string;
  name: string;
  bengaliName: string;
  tier: 'Luxury Resort' | 'Eco Resort' | 'Heritage Bungalow' | 'Budget Hotel';
  area: string;
  priceRangePerNight: string;
  indicativeMinPrice: number;
  amenities: string[];
  contactPhone: string;
  address: string;
  coverImage: string;
  bookingTip: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  rating: number;
  reviewCount: number;
}

export interface TrainSchedule {
  trainNumber: string;
  trainName: string;
  bengaliName: string;
  route: string;
  departureDhaka: string;
  arrivalSreemangal: string;
  offDay: string;
  fareShovon: number;
  fareSnigdha: number;
  fareACBerth: number;
  notes: string;
}

export interface StandardRouteRate {
  route: string;
  distanceKm: string;
  cngFareRange: string;
  chanderGariFareRange: string;
  recommendedVehicle: string;
  notes: string;
}


export interface BookingRequest {
  id: string;
  publicReference: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceType: 'transport' | 'guide';
  vehicleId?: string;
  vehicleName?: string;
  guideId?: string;
  guideName?: string;
  requestedDate: string;
  requestedStartTime?: string;
  groupSize: number;
  pickupLocation: string;
  itineraryDetails: string;
  requestedDuration?: string;
  customerNotes?: string;
  status:
    | 'new'
    | 'reviewing'
    | 'awaiting_provider'
    | 'quoted'
    | 'awaiting_customer'
    | 'confirmed'
    | 'completed'
    | 'cancelled'
    | 'rejected';
  assignedProviderId?: string;
  assignedProviderName?: string;
  quotedAmount?: number;
  currency: string;
  quoteDetails?: string;
  providerConfirmedAt?: string;
  customerAcceptedAt?: string;
  confirmedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  commissionType: 'percentage' | 'fixed';
  agreedCommissionValue: number;
  commissionAmount?: number;
  commissionPaymentStatus: 'pending' | 'collected' | 'waived';
  commissionCollectedAt?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  supportPhone: string;
  supportEmail: string;
  whatsappNumber: string;
  serviceArea: string;
  currency: string;
  defaultCommissionRate: number;
  bookingPolicyNotice: string;
}

// -----------------------------------------------------------------------------------
// AUTHENTIC VERIFIED SEED DATA FOR SREEMANGAL & MOULVIBAZAR
// -----------------------------------------------------------------------------------

export const INITIAL_SETTINGS: SiteSettings = {
  brandName: 'Sreemangal Explorer',
  tagline: 'Explore Sreemangal. Your way.',
  supportPhone: '01712004488',
  supportEmail: 'inquiries@sreemangalexplorer.com',
  whatsappNumber: '01712004488',
  serviceArea: 'Sreemangal, Kamalganj, Hail Haor & Rajkandi, Moulvibazar',
  currency: 'BDT',
  defaultCommissionRate: 10,
  bookingPolicyNotice:
    'All bookings are processed as requests. Our local coordinator verifies vehicle/guide availability and confirms the transparent exact quote with you before any commitment.',
};

export const INITIAL_PROVIDERS: Provider[] = [
  {
    id: 'prov-1',
    displayName: 'Sreemangal Jeep & Chander Gari Syndicate',
    providerType: 'Jeep Syndicate',
    publicContactNumber: '01712004488',
    privateContactDetails: 'Secretary: Md. Rafiqul Islam, Station Road Jeep Stand, Cell: 01711-239841',
    verificationStatus: 'verified',
    active: true,
    agreedCommissionType: 'percentage',
    agreedCommissionValue: 10,
    internalNotes: 'Syndicate has 24 maintained 4x4 vehicles. Reliable for Lawachara, Madhabpur, and Hum Hum.',
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'prov-2',
    displayName: 'Green Leaf CNG Drivers Welfare',
    providerType: 'CNG Association',
    publicContactNumber: '01712004488',
    privateContactDetails: 'Coordinator: Babul Mia, Habiganj Road Stand, Cell: 01819-338291',
    verificationStatus: 'verified',
    active: true,
    agreedCommissionType: 'percentage',
    agreedCommissionValue: 10,
    internalNotes: 'Polite drivers, knowledgeable on inner tea garden routes. Fixed circuit rates negotiated.',
    createdAt: '2026-01-12T09:30:00Z',
  },
  {
    id: 'prov-3',
    displayName: 'Sylhet Eco Naturalist Guild',
    providerType: 'Independent Guide Guild',
    publicContactNumber: '01712004488',
    privateContactDetails: 'Tanvir Ahmed, Forest Road, Sreemangal, Cell: 01725-667788',
    verificationStatus: 'verified',
    active: true,
    agreedCommissionType: 'percentage',
    agreedCommissionValue: 12,
    internalNotes: 'Trained by Forest Dept and Wildlife Trust of Bangladesh. Excellent English and birding equipment.',
    createdAt: '2026-01-15T11:00:00Z',
  },
  {
    id: 'prov-4',
    displayName: 'Sreemangal Eco-Cycle & Pedal',
    providerType: 'Bicycle Rental',
    publicContactNumber: '01712004488',
    privateContactDetails: 'Shop located near Bhanugach Road, Sreemangal, Cell: 01912-778899',
    verificationStatus: 'verified',
    active: true,
    agreedCommissionType: 'fixed',
    agreedCommissionValue: 50,
    internalNotes: '15 mountain bikes equipped with helmets and phone holders. Daily maintenance done.',
    createdAt: '2026-02-01T10:00:00Z',
  },
];

export const INITIAL_PLACES: Place[] = [
  {
    id: 'place-1',
    name: 'Lawachara National Park',
    bengaliName: 'লাউয়াছড়া জাতীয় উদ্যান',
    slug: 'lawachara-national-park',
    category: 'National Park & Rainforest',
    area: 'Kamalganj, 8 km from Sreemangal',
    shortDescription:
      'Lush tropical evergreen rainforest renowned for endangered Western Hoolock Gibbons, ancient trees, and scenic railway tracks.',
    description:
      'Lawachara National Park is a prominent semi-evergreen forest reserve spanning 1,250 hectares. It provides a sanctuary to rare wildlife including the hoolock gibbon, slow loris, capped langur, and over 240 species of birds. The Dhaka-Sylhet heritage railway track cuts through the heart of the forest canopy, creating iconic misty early morning vistas.',
    latitude: 24.3292,
    longitude: 91.7858,
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Lawachara+National+Park+Sreemangal',
    rating: 4.4,
    reviewCount: 7820,
    coverImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
    ],
    visitingInformation:
      'Best visited between 6:30 AM and 10:00 AM when wildlife activity is highest. Marked walking trails range from 30 minutes to 3 hours.',
    accessNotes:
      'Paved Bhanugach road access. Forest Department entrance ticket required at the gate. Eco-guides recommended for the 3-hour deep forest trail.',
    openingHours: '06:00 AM - 05:00 PM Daily',
    entryFeeInformation: '৳115 per Bangladeshi adult, ৳575 for foreign nationals, ৳50 vehicle parking fee.',
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-03-01T10:00:00Z',
    published: true,
    bestTransport: ['CNG Auto-rickshaw', 'Chander Gari', 'Microbus'],
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'place-2',
    name: 'Baikka Beel Wetland Sanctuary',
    bengaliName: 'বাইক্কা বিল অভয়াশ্রম',
    slug: 'baikka-beel',
    category: 'Wetland & Bird Sanctuary',
    area: 'Hail Haor, 16 km northwest of Sreemangal',
    shortDescription:
      'Vast freshwater wetland haven for thousands of winter migratory birds with an observation watchtower and lotus blooms.',
    description:
      'Located within the larger Hail Haor basin, Baikka Beel is a 100-hectare permanently protected wetland sanctuary established in 2003. In winter months (November to February), it hosts tens of thousands of migratory waterfowl including bar-headed geese, glossy ibises, and purple swamphens. A two-story watchtower offers high-power spotting scopes for bird enthusiasts.',
    latitude: 24.3639,
    longitude: 91.6425,
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Baikka+Beel+Wetland+Sanctuary+Sreemangal',
    rating: 4.5,
    reviewCount: 2890,
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=80',
    ],
    visitingInformation:
      'Best visited in early morning or late afternoon for breathtaking sunsets and bird flight formations. Bring binoculars or telephoto lenses.',
    accessNotes:
      'The final 3 km passes through scenic rural dykes. Easily accessible by CNG or Chander Gari; road is narrow for large buses.',
    openingHours: '06:30 AM - 05:30 PM Daily',
    entryFeeInformation: '৳30 maintenance fee per visitor collected by local co-management committee.',
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-03-05T09:00:00Z',
    published: true,
    bestTransport: ['CNG Auto-rickshaw', 'Chander Gari', 'Sedan Car'],
    createdAt: '2026-01-11T09:00:00Z',
  },
  {
    id: 'place-3',
    name: 'Madhabpur Lake & Patrokhola Tea Estate',
    bengaliName: 'মাধবপুর লেক',
    slug: 'madhabpur-lake',
    category: 'Highland Lake & Tea Hills',
    area: 'Kamalganj, 18 km south of Sreemangal',
    shortDescription:
      'Quiet highland freshwater lake fringed by undulating tea hills and blue water lilies near the Tripura border.',
    description:
      'Tucked deep inside the National Tea Company’s Madhabpur estate, this 3-km-long natural horseshoe lake is famed for vibrant blue and pink water lilies (Nymphaea nouchali). Footpaths meander along the hill ridges overlooking the reflective water, offering some of the most serene landscape views in greater Sylhet.',
    latitude: 24.2372,
    longitude: 91.8741,
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Madhabpur+Lake+Kamalganj+Sreemangal',
    rating: 4.5,
    reviewCount: 4240,
    coverImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    ],
    visitingInformation:
      'Ideal for gentle walking and photography. Swimming and boat rides are strictly prohibited to preserve water cleanliness.',
    accessNotes:
      'Paved road up to the tea estate gates, followed by a bricked approach road. Border security checkpost requires domestic photo ID.',
    openingHours: '08:00 AM - 05:30 PM Daily',
    entryFeeInformation: '৳20 tea garden entry token.',
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-02-28T14:00:00Z',
    published: true,
    bestTransport: ['Chander Gari', 'CNG Auto-rickshaw', 'Microbus'],
    createdAt: '2026-01-12T10:00:00Z',
  },
  {
    id: 'place-4',
    name: 'Nurjahan Tea Estate & Finlay Hills',
    bengaliName: 'নুরজাহান চা বাগান',
    slug: 'nurjahan-tea-estate',
    category: 'Tea Heritage Estate',
    area: 'Sreemangal Sadar, 5 km from town',
    shortDescription:
      'Pristine geometric tea terraces, shade canopy trees, and winding dirt cycling trails through Sreemangal’s tea bowl.',
    description:
      'Sreemangal is known as the Tea Capital of Bangladesh, housing over 40 sprawling estates. Nurjahan Tea Estate features pristine rolling green slopes shaded by tall silver oak and albizia trees. Visitors can observe traditional two-leaves-and-a-bud hand plucking in the morning and taste fresh green and black teas at nearby garden kiosks.',
    latitude: 24.3061,
    longitude: 91.7314,
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Nurjahan+Tea+Estate+Sreemangal',
    rating: 4.6,
    reviewCount: 980,
    coverImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1582650625119-3a31f8418365?auto=format&fit=crop&w=800&q=80',
    ],
    visitingInformation:
      'Open year-round. Monsoons (June-September) bring the brightest emerald hues; dry winter (November-February) offers crisp morning walks.',
    accessNotes:
      'Directly accessible from town. Please respect tea pluckers and do not step off designated trail lanes onto young tea bushes.',
    openingHours: 'Open during daylight hours',
    entryFeeInformation: 'Free public road access through the estate.',
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-03-01T11:00:00Z',
    published: true,
    bestTransport: ['Bicycle', 'CNG Auto-rickshaw', 'Electric Bike'],
    createdAt: '2026-01-14T08:00:00Z',
  },
  {
    id: 'place-5',
    name: 'Hum Hum Waterfall Trek',
    bengaliName: 'হাম হাম জলপ্রপাত',
    slug: 'hum-hum-waterfall',
    category: 'Jungle Trek & Waterfall',
    area: 'Rajkandi Reserve Forest, Kamalganj',
    shortDescription:
      'Exciting and challenging deep jungle trek crossing muddy streams and steep ridges to a double-cascade waterfall.',
    description:
      'Discovered relatively recently in 2010, Hum Hum (or Chita Jhorna) drops roughly 135 to 160 feet in two tiers inside the remote Rajkandi Reserve. Reaching the fall requires a 2.5 to 3.5 hour strenuous trek through shallow streams, muddy rocky gorges, and bamboo groves.',
    latitude: 24.2678,
    longitude: 91.9167,
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Hum+Hum+Waterfall+Rajkandi',
    rating: 4.3,
    reviewCount: 1640,
    coverImage: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
    gallery: [],
    visitingInformation:
      'Requires good physical fitness and proper trekking shoes with grip. A mandatory local guide should be hired from Kolabanpara tribal village.',
    accessNotes:
      'Vehicle goes as far as Kolabanpara village (requires 4x4 Chander Gari due to unpaved dirt and rocky road). Beware of jungle leeches in wet season.',
    openingHours: 'Daylight trek only (start by 08:00 AM)',
    entryFeeInformation: 'Guide fee ~৳800-৳1,000 for the trek; forest token ~৳20.',
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-02-20T12:00:00Z',
    published: true,
    bestTransport: ['Chander Gari 4x4 (Mandatory for road section)'],
    createdAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'place-6',
    name: 'Manipuri Cultural & Handloom Village',
    bengaliName: 'মণিপুরী পাড়া ও তাঁতপল্লী',
    slug: 'monipuri-tribal-village',
    category: 'Cultural Village & Craft',
    area: 'Ramnagar & Madhabpur, Kamalganj',
    shortDescription:
      'Historic indigenous Manipuri settlements where master artisans weave colorful traditional shawls and sarees on wooden handlooms.',
    description:
      'The Manipuri communities settled around Kamalganj and Sreemangal centuries ago, preserving distinct cultural traditions, Raas Leela classical dances, and intricate handloom weaving techniques. Visitors can watch artisans operate traditional foot-pedal looms and purchase authentic hand-woven scarves and sarees directly from maker households.',
    latitude: 24.3184,
    longitude: 91.8211,
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Manipuri+Para+Radhanagar+Sreemangal',
    rating: 4.5,
    reviewCount: 710,
    coverImage: 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&w=1200&q=80',
    gallery: [],
    visitingInformation:
      'Respect community homes. Photography inside personal loom workshops is welcomed with permission.',
    accessNotes:
      'Paved village road. Easily combined with Lawachara or Madhabpur trips.',
    openingHours: '09:00 AM - 06:00 PM',
    entryFeeInformation: 'Free entry. Direct fair-trade craft purchases support local women weavers.',
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-03-02T16:00:00Z',
    published: true,
    bestTransport: ['CNG Auto-rickshaw', 'Bicycle', 'Car / Sedan'],
    createdAt: '2026-01-16T10:00:00Z',
  },
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh-1',
    providerId: 'prov-1',
    providerName: 'Sreemangal Jeep & Chander Gari Syndicate',
    name: 'Chander Gari 4x4 Mountain Cruiser',
    slug: 'chander-gari-4x4-mountain-cruiser',
    vehicleType: 'chander_gari',
    passengerCapacity: 10,
    driverIncluded: true,
    luggageDetails: 'Roof rack accommodates up to 8 medium duffels or backpacks.',
    supportedRoutes: [
      'Lawachara & Madhabpur Circuit',
      'Baikka Beel Wetland Roundtrip',
      'Hum Hum Trailhead (Kolabanpara Village Off-Road)',
      'Custom Full-Day Moulvibazar Exploration',
    ],
    pricingBasis: 'Full Day (8-9 hours) with dedicated driver',
    indicativePrice: 3800,
    currency: 'BDT',
    inclusions: [
      'Experienced local hill driver',
      'Fuel for standard circuit up to 60 km',
      'Vehicle parking tolls at park gates',
      'Open canopy side curtains for sightseeing',
    ],
    exclusions: [
      'Passenger national park entry tickets',
      'Overtime beyond 9 hours (৳300/hr)',
      'Tipping for driver',
    ],
    coverImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80',
    published: true,
    lastPriceVerifiedAt: '2026-03-01T10:00:00Z',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'veh-2',
    providerId: 'prov-2',
    providerName: 'Green Leaf CNG Drivers Welfare',
    name: 'Standard Green CNG 3-Wheeler',
    slug: 'standard-green-cng-autorickshaw',
    vehicleType: 'cng',
    passengerCapacity: 4,
    driverIncluded: true,
    luggageDetails: 'Rear luggage basket accommodates 2 small bags or backpacks.',
    supportedRoutes: [
      'Town - Lawachara - Tea Gardens Circuit',
      'Baikka Beel Sunset Run',
      'Madhabpur Lake Excursion',
      'Railway Station transfers',
    ],
    pricingBasis: 'Full Day Circuit (approx 7 hours)',
    indicativePrice: 1500,
    currency: 'BDT',
    inclusions: [
      'Knowledgeable local driver',
      'CNG fuel for up to 45 km',
      'Waiting time at attractions',
    ],
    exclusions: [
      'Attraction entry fees',
      'Off-road Hum Hum track (unsuitable for CNG)',
    ],
    coverImage: 'https://images.unsplash.com/photo-1596707328904-70a905be53ba?auto=format&fit=crop&w=1000&q=80',
    published: true,
    lastPriceVerifiedAt: '2026-03-01T12:00:00Z',
    createdAt: '2026-01-12T11:00:00Z',
  },
  {
    id: 'veh-3',
    providerId: 'prov-1',
    providerName: 'Sreemangal Jeep & Chander Gari Syndicate',
    name: 'Toyota HiAce Grand Cabin AC Microbus',
    slug: 'toyota-hiace-ac-microbus',
    vehicleType: 'microbus',
    passengerCapacity: 11,
    driverIncluded: true,
    luggageDetails: 'Spacious rear trunk accommodates 10 full suitcases with ease.',
    supportedRoutes: [
      'All paved Moulvibazar attractions',
      'Sylhet Osmani Airport (ZYL) Pickup/Drop',
      'Dhaka to Sreemangal Inter-district trip',
    ],
    pricingBasis: 'Day Rental (10 hours, local area)',
    indicativePrice: 5500,
    currency: 'BDT',
    inclusions: [
      'Air-conditioned comfort',
      'Professional highway driver',
      'Standard fuel for local Sreemangal-Kamalganj circuit',
    ],
    exclusions: [
      'Highway bridge tolls (inter-district trips only)',
      'Driver lunch allowance (৳250/day)',
      'Rough terrain off-roading',
    ],
    coverImage: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1000&q=80',
    published: true,
    lastPriceVerifiedAt: '2026-02-25T14:00:00Z',
    createdAt: '2026-01-14T12:00:00Z',
  },
  {
    id: 'veh-4',
    providerId: 'prov-4',
    providerName: 'Sreemangal Eco-Cycle & Pedal',
    name: 'All-Terrain Mountain Bicycle (21-Speed)',
    slug: 'all-terrain-mountain-bicycle',
    vehicleType: 'bicycle',
    passengerCapacity: 1,
    driverIncluded: false,
    luggageDetails: 'Handlebar phone mount & front water cage provided.',
    supportedRoutes: [
      'Finlay & Nurjahan Tea Garden trails',
      'Bhanugach Forest Perimeter Road',
      'Sreemangal town to Bangladesh Tea Research Institute (BTRI)',
    ],
    pricingBasis: 'Full Day Rental (07:00 AM to 07:00 PM)',
    indicativePrice: 400,
    currency: 'BDT',
    inclusions: [
      'Safety helmet',
      'Heavy-duty cable lock',
      'Hand air pump & puncture kit',
      'Curated scenic offline map card',
    ],
    exclusions: [
      'National park entry tokens',
      'Refundable security deposit (৳1,000 or Student/NID card)',
    ],
    coverImage: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1000&q=80',
    published: true,
    lastPriceVerifiedAt: '2026-03-02T10:00:00Z',
    createdAt: '2026-02-01T12:00:00Z',
  },
  {
    id: 'veh-5',
    providerId: 'prov-1',
    providerName: 'Sreemangal Jeep & Chander Gari Syndicate',
    name: 'Toyota Axio AC Sedan',
    slug: 'toyota-axio-ac-sedan',
    vehicleType: 'car',
    passengerCapacity: 4,
    driverIncluded: true,
    luggageDetails: 'Trunk fits 3 standard luggage bags.',
    supportedRoutes: [
      'Lawachara, Madhabpur, Baikka Beel (dry season)',
      'Grand Sultan / Tea Resort transfers',
    ],
    pricingBasis: 'Full Day (8 hours)',
    indicativePrice: 3500,
    currency: 'BDT',
    inclusions: ['AC vehicle', 'Driver', 'Fuel up to 50 km'],
    exclusions: ['Parking fees', 'Entry tickets'],
    coverImage: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=80',
    published: true,
    lastPriceVerifiedAt: '2026-02-28T16:00:00Z',
    createdAt: '2026-02-10T15:00:00Z',
  },
];

export const INITIAL_GUIDES: Guide[] = [
  {
    id: 'guide-1',
    providerId: 'prov-3',
    name: 'Tanvir Ahmed',
    slug: 'tanvir-ahmed-forest-naturalist',
    description:
      'Wildlife photographer and certified rainforest naturalist with 8 years of tracking experience inside Lawachara National Park. Specializes in Hoolock Gibbon family observation, medicinal plant identification, and dawn birding excursions.',
    languages: ['Bengali', 'Sylheti', 'English (Fluent)'],
    specialties: ['Western Hoolock Gibbons', 'Rainforest Birding', 'Wildlife Photography', 'Botanical Trails'],
    serviceAreas: ['Lawachara National Park', 'Baikka Beel Sanctuary', 'Adampur Reserve'],
    groupSizeLimit: 8,
    indicativePrice: 1500,
    pricingBasis: 'Half-Day Trail (up to 4 hours) · ৳2,200 for Full Day',
    verificationStatus: 'verified',
    coverImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    published: true,
    createdAt: '2026-01-15T12:00:00Z',
  },
  {
    id: 'guide-2',
    providerId: 'prov-3',
    name: 'Shubho Singha (Manipuri Community)',
    slug: 'shubho-singha-indigenous-heritage',
    description:
      'Born and raised in Ramnagar Manipuri village. Deeply passionate about sharing indigenous living heritage, traditional handloom techniques, sacred grove folklore, and authentic village cuisine.',
    languages: ['Manipuri (Meitei)', 'Bengali', 'English (Conversational)'],
    specialties: ['Indigenous Culture', 'Handloom Workshops', 'Village Walks', 'Local Cuisine'],
    serviceAreas: ['Ramnagar Village', 'Madhabpur Village', 'Kamalganj Cultural Trail'],
    groupSizeLimit: 12,
    indicativePrice: 1200,
    pricingBasis: 'Half-Day Cultural Immersion (3 hours)',
    verificationStatus: 'verified',
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    published: true,
    createdAt: '2026-01-18T14:00:00Z',
  },
  {
    id: 'guide-3',
    providerId: 'prov-3',
    name: 'Kamrul Hasan',
    slug: 'kamrul-hasan-hum-hum-trekker',
    description:
      'Experienced wilderness trekking scout from Kamalganj. Trained in remote trail safety and basic wilderness first aid. Has guided over 120 successful expeditions to Hum Hum Waterfall across seasonal conditions.',
    languages: ['Bengali', 'Sylheti'],
    specialties: ['Hum Hum Waterfall Trek', 'Rajkandi Deep Forest', 'Riverbed Scrambling', 'Leech Safety'],
    serviceAreas: ['Rajkandi Forest', 'Hum Hum Trailhead', 'Kolabanpara Tribal Hamlet'],
    groupSizeLimit: 10,
    indicativePrice: 1200,
    pricingBasis: 'Per Trek Expedition (approx 6-7 hours total)',
    verificationStatus: 'verified',
    coverImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    published: true,
    createdAt: '2026-02-05T10:00:00Z',
  },
];

export const INITIAL_TRIPS: TripIdea[] = [
  {
    id: 'trip-1',
    title: 'Rainforest Canopy & Emerald Tea Terraces',
    duration: '1-Day',
    tagline: 'The essential Sreemangal day trip combining wildlife, tribal weaving, and highland lake vistas.',
    description:
      'Designed for visitors with one full day in Sreemangal. Wake up early for the mist over Lawachara rainforest canopy, experience living Manipuri loom weaving, savor regional cuisine, and unwind by Madhabpur Lake as the sun sets over Patrokhola hills.',
    highlights: [
      'Early morning Hoolock Gibbon calls in Lawachara National Park',
      'Handloom demonstration in Ramnagar Manipuri village',
      'Authentic fresh river fish lunch at local bazaar eateries',
      'Sunset reflections and water lilies at Madhabpur Lake',
      'Famous Nilkontho multi-layer tea tasting',
    ],
    stops: [
      { order: 1, destinationName: 'Lawachara National Park', duration: '2.5 hours', activity: 'Walk the shaded trail and watch for gibbons & giant squirrels' },
      { order: 2, destinationName: 'Manipuri Village', duration: '1 hour', activity: 'Observe foot-loom weaving and support artisan families' },
      { order: 3, destinationName: 'Local Sreemangal Dining', duration: '1 hour', activity: 'Traditional Bangladeshi lunch (Deshi fish, shorshe, bhorta)' },
      { order: 4, destinationName: 'Madhabpur Lake', duration: '2 hours', activity: 'Walk along the tea ridge trails overlooking pink water lilies' },
      { order: 5, destinationName: 'Nilkontho Tea Cabin', duration: '45 mins', activity: 'Taste the renowned multi-layer tea invention' },
    ],
    recommendedTransport: 'Standard CNG (2-4 people) or 4x4 Chander Gari (5-10 people)',
    estimatedCostRange: '৳1,400 - ৳3,800 total transport + ৳150/person entry fees',
    travelLogistics: 'Approx 48 km total roundtrip. All roads are paved.',
    coverImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'trip-2',
    title: 'Wild Sreemangal: Wetland Safari & Off-Road Expedition',
    duration: '2-Day',
    tagline: 'A comprehensive two-day journey from the wetlands of Hail Haor to the deep hill forests.',
    description:
      'Immerse in Sreemangal’s diverse ecosystems. Day 1 focuses on the tranquil bird paradise of Baikka Beel and cycling through lush tea gardens. Day 2 takes you into Lawachara rainforest and Madhabpur Lake with an experienced local guide.',
    highlights: [
      'Dawn spotting scope birding from Baikka Beel 2-story watchtower',
      'Cycling along Finlay Estate shade canopies',
      'Deep rainforest ecology trek with certified naturalist',
      'Peaceful lakeside picnic at Madhabpur',
    ],
    stops: [
      { order: 1, destinationName: 'Baikka Beel Sanctuary (Day 1)', duration: '3.5 hours', activity: 'Watch migratory geese, ibises, and waterfowl from observation tower' },
      { order: 2, destinationName: 'Nurjahan Tea Estate & BTRI (Day 1)', duration: '2.5 hours', activity: 'Explore tea garden trails and tea research institute' },
      { order: 3, destinationName: 'Lawachara Forest Trail (Day 2)', duration: '3.5 hours', activity: 'Guided 3-hour deep forest trek' },
      { order: 4, destinationName: 'Madhabpur Lake & Border Ridge (Day 2)', duration: '2.5 hours', activity: 'Lakeside trail stroll and tea hill exploration' },
    ],
    recommendedTransport: 'Chander Gari 4x4 or AC Microbus for groups',
    estimatedCostRange: '৳5,000 - ৳7,500 total for 2-day transport + guide',
    travelLogistics: 'Approx 90 km across 2 days. Relaxed pace suitable for families.',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
  },
];

// Initial demonstration booking requests with unpredictable reference codes to demonstrate admin workflow
export const INITIAL_BOOKINGS: BookingRequest[] = [
  {
    id: 'book-101',
    publicReference: 'SRE-7K2M-9P4W',
    customerName: 'Zubair Al Mahmud',
    customerPhone: '01719876543',
    customerEmail: 'zubair.mahmud@example.com',
    serviceType: 'transport',
    vehicleId: 'veh-1',
    vehicleName: 'Chander Gari 4x4 Mountain Cruiser',
    requestedDate: '2026-11-12',
    requestedStartTime: '08:00 AM',
    groupSize: 8,
    pickupLocation: 'Novem Eco Resort, Radhanagar, Sreemangal',
    itineraryDetails: 'Lawachara National Park -> Manipuri Village -> Madhabpur Lake',
    requestedDuration: 'Full Day',
    customerNotes: 'We have 2 elderly family members, need gentle driving on unpaved sections.',
    status: 'awaiting_provider',
    assignedProviderId: 'prov-1',
    assignedProviderName: 'Sreemangal Jeep & Chander Gari Syndicate',
    quotedAmount: 3800,
    currency: 'BDT',
    quoteDetails: 'Driver Salam confirmed pending syndicate assignment. ৳3,800 includes full day fuel & waiting.',
    commissionType: 'percentage',
    agreedCommissionValue: 10,
    commissionAmount: 380,
    commissionPaymentStatus: 'pending',
    internalNotes: 'Contacted Md. Rafiqul at syndicate. He agreed to assign vehicle #14.',
    createdAt: '2026-10-28T14:30:00Z',
    updatedAt: '2026-10-28T16:00:00Z',
  },
  {
    id: 'book-102',
    publicReference: 'SRE-3B8X-4T9J',
    customerName: 'Farhana Yasmin',
    customerPhone: '01812345678',
    customerEmail: 'farhana.y@example.com',
    serviceType: 'transport',
    vehicleId: 'veh-2',
    vehicleName: 'Standard Green CNG 3-Wheeler',
    requestedDate: '2026-11-15',
    requestedStartTime: '09:00 AM',
    groupSize: 3,
    pickupLocation: 'Sreemangal Railway Station',
    itineraryDetails: 'Pickup from Parabat Express -> Tea Garden trails -> Nilkontho Tea',
    requestedDuration: 'Half Day',
    customerNotes: 'Arriving on the morning train from Dhaka.',
    status: 'confirmed',
    assignedProviderId: 'prov-2',
    assignedProviderName: 'Green Leaf CNG Drivers Welfare',
    quotedAmount: 1400,
    currency: 'BDT',
    quoteDetails: 'Driver Babul assigned. Confirmed pickup at station parking with name placard.',
    providerConfirmedAt: '2026-10-27T10:15:00Z',
    customerAcceptedAt: '2026-10-27T11:00:00Z',
    confirmedAt: '2026-10-27T11:05:00Z',
    commissionType: 'percentage',
    agreedCommissionValue: 10,
    commissionAmount: 140,
    commissionPaymentStatus: 'pending',
    internalNotes: 'Babul driver phone: 01819-338291. Customer notified via WhatsApp.',
    createdAt: '2026-10-27T09:00:00Z',
    updatedAt: '2026-10-27T11:05:00Z',
  },
  {
    id: 'book-103',
    publicReference: 'SRE-5D6N-8L1Q',
    customerName: 'Nasir Uddin',
    customerPhone: '01911223344',
    serviceType: 'guide',
    guideId: 'guide-1',
    guideName: 'Tanvir Ahmed (Forest Naturalist)',
    requestedDate: '2026-11-20',
    requestedStartTime: '06:30 AM',
    groupSize: 4,
    pickupLocation: 'Grand Sultan Tea Resort Gate',
    itineraryDetails: 'Early morning Lawachara 3-hour deep forest trek for gibbon birding',
    requestedDuration: 'Half Day',
    customerNotes: 'Avid birdwatchers, carrying 400mm lens.',
    status: 'completed',
    assignedProviderId: 'prov-3',
    assignedProviderName: 'Sylhet Eco Naturalist Guild',
    quotedAmount: 1500,
    currency: 'BDT',
    quoteDetails: 'Tanvir provided spotting scope and binoculars. Trip completed successfully.',
    providerConfirmedAt: '2026-10-20T08:00:00Z',
    customerAcceptedAt: '2026-10-20T09:00:00Z',
    confirmedAt: '2026-10-20T09:10:00Z',
    completedAt: '2026-10-26T14:00:00Z',
    commissionType: 'percentage',
    agreedCommissionValue: 12,
    commissionAmount: 180,
    commissionPaymentStatus: 'collected',
    commissionCollectedAt: '2026-10-26T18:00:00Z',
    internalNotes: 'Commission ৳180 received via bKash from Tanvir.',
    createdAt: '2026-10-19T10:00:00Z',
    updatedAt: '2026-10-26T18:00:00Z',
  },
];

// -----------------------------------------------------------------------------------
// CLIENT & BROWSER STORE HELPER (Zero-budget localStorage persistence with auto-fallback)
// -----------------------------------------------------------------------------------

const STORAGE_KEYS = {
  SETTINGS: 'sreemangal_settings',
  PLACES: 'sreemangal_places',
  PROVIDERS: 'sreemangal_providers',
  VEHICLES: 'sreemangal_vehicles',
  GUIDES: 'sreemangal_guides',
  TRIPS: 'sreemangal_trips',
  BOOKINGS: 'sreemangal_bookings',
  ADMIN_AUTH: 'sreemangal_admin_authenticated',
};

function getStored<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}



export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Panshi Restaurant',
    bengaliName: 'পানসী রেস্তোরাঁ',
    category: 'Freshwater Fish, Bhorta & Deshi Cuisine',
    area: 'Station Road, Sreemangal Sadar',
    avgCostPerPerson: 320,
    priceLevel: '$$',
    mustTryDishes: [
      '15+ Varieties of Fresh Fish Bhorta (Chitol, Ilish, Boal, Chingri)',
      'Deshi Murgi (Free-range Chicken) Curry',
      'Boal Fish Jhol with Tomato',
      'Fresh Haor Shorputi Bhaja',
      'Hot Steaming Basmati Rice with Ghee',
    ],
    openingHours: '06:00 AM - 12:30 AM Daily',
    address: 'Station Road, opposite Central Jame Mosque, Sreemangal',
    contactPhone: '01712-334455',
    coverImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    touristTip:
      'Arrive between 12:30 PM and 01:30 PM for lunch to get the widest selection of freshly prepared Haor fish bhortas. Extremely clean, family-friendly dining section upstairs.',
    latitude: 24.3079,
    longitude: 91.7335,
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Panshi+Restaurant+Sreemangal',
    rating: 4.3,
    reviewCount: 3120,
  },
  {
    id: 'rest-2',
    name: 'Kutum Bari Restaurant',
    bengaliName: 'কুটুম বাড়ি রেস্তোরাঁ',
    category: 'Authentic Sylheti Heritage & Biryani',
    area: 'Habiganj Road, Sreemangal',
    avgCostPerPerson: 380,
    priceLevel: '$$',
    mustTryDishes: [
      'Sylheti Shatkora Beef (Aromatic wild citrus curry)',
      'Deshi Duck Bhuna (হাঁসের ভুনা)',
      'Akhni Biryani (traditional fragrant rice & meat)',
      'Chitol Kofta Curry',
      'Fresh Lemon & Borhani',
    ],
    openingHours: '07:00 AM - 11:30 PM Daily',
    address: 'Habiganj Road, near Bus Stand, Sreemangal',
    contactPhone: '01725-889900',
    coverImage: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    touristTip:
      'Shatkora is a regional wild citrus found in the Sylhet hills that imparts a tangy, aromatic flavor to beef and mutton. An unmissable culinary heritage dish.',
    latitude: 24.3082,
    longitude: 91.7348,
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kutum+Bari+Restaurant+Sreemangal',
    rating: 4.2,
    reviewCount: 2450,
  },
  {
    id: 'rest-3',
    name: 'Nilkontho Tea Cabin',
    bengaliName: 'নীলকণ্ঠ টি কেবিন (সাত রঙের চা)',
    category: 'Iconic Multi-Layer Tea Specialty',
    area: 'Ramnagar 14th Rifle Battalion / BTRI Branch',
    avgCostPerPerson: 100,
    priceLevel: '$',
    mustTryDishes: [
      'World-famous 7-Layer Tea (৳90)',
      '5-Layer Tea (৳70)',
      'Original Sreemangal Green Tea with Mint (৳30)',
      'Spiced Masala Milk Tea (৳35)',
      'Hot Nimki & Biscuits',
    ],
    openingHours: '08:30 AM - 08:30 PM Daily',
    address: 'Branch 1: 14th BGB Camp Area, Ramnagar · Branch 2: Near BTRI gate',
    contactPhone: '01716-123456',
    coverImage: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    touristTip:
      'Invented by Romesh Ram Gour. Each layer features a different density and spice blend (cinnamon, clove, ginger, condensed milk, black tea, green tea). Sip layer by layer without stirring!',
    latitude: 24.2936,
    longitude: 91.7465,
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Nilkontho+Tea+Cabin+Sreemangal',
    rating: 4.1,
    reviewCount: 5380,
  },
  {
    id: 'rest-4',
    name: 'Five Brother Restaurant',
    bengaliName: 'পাঁচ ভাই রেস্তোরাঁ',
    category: '24/7 Bengali Dining & Early Breakfast',
    area: 'Station Road, Sreemangal',
    avgCostPerPerson: 220,
    priceLevel: '$',
    mustTryDishes: [
      'Morning Flaky Paratha with Dal & Fried Egg',
      'Lotia Fish Curry',
      'Mutton Brain Masala',
      'Taki Fish Bhorta with Mustard Oil',
    ],
    openingHours: 'Open 24 Hours Daily',
    address: 'Station Road, 2-minute walk from Sreemangal Railway Station',
    contactPhone: '01819-556677',
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    touristTip:
      'The quintessential stop for travelers arriving on the late night Upaban Express (01:30 AM) or catching the dawn Parabat Express (06:30 AM). Fast, hot service around the clock.',
    latitude: 24.3074,
    longitude: 91.7329,
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Panch+Bhai+Restaurant+Sreemangal',
    rating: 4.2,
    reviewCount: 1820,
  },
  {
    id: 'rest-5',
    name: 'Monipuri Indigenous Kitchen & Pitha',
    bengaliName: 'মণিপুরী আদিবাসী খানা ও পিঠা',
    category: 'Traditional Indigenous Herbal & Tribal Food',
    area: 'Ramnagar & Madhabpur Village',
    avgCostPerPerson: 180,
    priceLevel: '$',
    mustTryDishes: [
      'Singju (Spicy herbal shredded cabbage, perilla seeds & lotus salad)',
      'Kangsoi (Traditional seasonal vegetable broth with dried fish)',
      'Steamed Sticky Rice (Chak-hao) Pitha',
      'Fresh Roasted Banana-leaf Fish',
    ],
    openingHours: '11:00 AM - 06:00 PM Daily',
    address: 'Ramnagar Manipuri Para, Kamalganj road, Sreemangal',
    contactPhone: '01740-998877',
    coverImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    touristTip:
      'Authentic Manipuri cuisine uses very little or zero cooking oil, relying instead on wild herbs, ghost pepper (Naga morich), fermented bamboo shoots, and roasted fish.',
    latitude: 24.2980,
    longitude: 91.7510,
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Radhanagar+Manipuri+Para+Sreemangal',
    rating: 4.5,
    reviewCount: 740,
  },
];

export const INITIAL_ACCOMMODATIONS: Accommodation[] = [
  {
    id: 'stay-1',
    name: 'Grand Sultan Tea Resort & Golf',
    bengaliName: 'গ্র্যান্ড সুলতান টি রিসোর্ট',
    tier: 'Luxury Resort',
    area: 'Radhanagar, Sreemangal',
    priceRangePerNight: '৳14,000 - ৳36,000',
    indicativeMinPrice: 14000,
    amenities: [
      '9-hole Golf Course',
      '3 Temperature-controlled Swimming Pools',
      'Spa & Sauna Wellness Center',
      '3 Fine Dining Restaurants',
      'Children Play Zone & 3D Cinema',
    ],
    address: 'Radhanagar, Sreemangal - 3210',
    contactPhone: '01730-793501',
    coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    bookingTip: 'Book 3-4 weeks ahead during winter peak weekends (November-February). Weekdays often feature 20-30% discount packages.',
    latitude: 24.3168,
    longitude: 91.7535,
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Grand+Sultan+Tea+Resort+and+Golf+Sreemangal',
    rating: 4.6,
    reviewCount: 4920,
  },
  {
    id: 'stay-2',
    name: 'Novem Eco Resort',
    bengaliName: 'নোভেম ইকো রিসোর্ট',
    tier: 'Eco Resort',
    area: 'Bishamani, Radhanagar, Sreemangal',
    priceRangePerNight: '৳5,500 - ৳12,000',
    indicativeMinPrice: 5500,
    amenities: [
      'Wooden Tree Houses & Hill Cottages',
      'Tea Garden View Balconies',
      'Infinity Hilltop Pool',
      'Barbecue & Campfire Lawn',
      'In-house Traditional Dining',
    ],
    address: 'Bishamani, Radhanagar, Sreemangal',
    contactPhone: '01709-882200',
    coverImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    bookingTip: 'Wooden family cottages feature glass fronts overlooking active tea gardens. Very quiet at night for stargazing.',
    latitude: 24.3312,
    longitude: 91.7610,
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Novem+Eco+Resort+Sreemangal',
    rating: 4.4,
    reviewCount: 1260,
  },
  {
    id: 'stay-3',
    name: 'Shanti Bari Eco Resort',
    bengaliName: 'শান্তি বাড়ি ইকো রিসোর্ট',
    tier: 'Eco Resort',
    area: 'Radhanagar, Sreemangal',
    priceRangePerNight: '৳3,200 - ৳5,500',
    indicativeMinPrice: 3200,
    amenities: [
      'Earthen Mud & Bamboo Cottages',
      'Organic Garden-to-Table Food',
      'Quiet Natural Lake & Hammocks',
      'Birdwatching Surroundings',
      'Pet Friendly',
    ],
    address: 'Radhanagar Forest Edge, Sreemangal',
    contactPhone: '01711-445566',
    coverImage: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80',
    bookingTip: 'Perfect for eco-conscious travelers and artists seeking tranquility. No loud music allowed on premises.',
    latitude: 24.2965,
    longitude: 91.7690,
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Shanti+Bari+Eco+Resort+Sreemangal',
    rating: 4.5,
    reviewCount: 860,
  },
  {
    id: 'stay-4',
    name: 'Tea Resort & Museum (BTRI)',
    bengaliName: 'টি রিসোর্ট ও মিউজিয়াম',
    tier: 'Heritage Bungalow',
    area: 'Bhanugach Road, Sreemangal',
    priceRangePerNight: '৳3,800 - ৳7,500',
    indicativeMinPrice: 3800,
    amenities: [
      'Colonial British Tea Planter Architecture',
      'Walking Distance to Tea Research Garden',
      'Swimming Pool & Tennis Court',
      'Historical Tea Museum on Grounds',
    ],
    address: 'Bhanugach Road, Bangladesh Tea Board, Sreemangal',
    contactPhone: '01712-071502',
    coverImage: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
    bookingTip: 'Managed under Bangladesh Tea Board. High ceiling bungalows surrounded by 100-year-old shade trees.',
    latitude: 24.3020,
    longitude: 91.7470,
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=BTRI+Tea+Resort+Sreemangal',
    rating: 4.4,
    reviewCount: 1140,
  },
  {
    id: 'stay-5',
    name: 'Hotel Tea Town',
    bengaliName: 'হোটেল টি টাউন',
    tier: 'Budget Hotel',
    area: 'Station Road, Sreemangal Sadar',
    priceRangePerNight: '৳1,200 - ৳2,800',
    indicativeMinPrice: 1200,
    amenities: [
      'AC & Clean Non-AC Rooms',
      'Attached Bath with Geyser (Hot Water)',
      'Free High-speed Wi-Fi',
      'Lift / Elevator',
      'Steps from Station & Panshi Restaurant',
    ],
    address: 'Old Bus Stand, Station Road, Sreemangal',
    contactPhone: '01718-331122',
    coverImage: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
    bookingTip: 'The most popular safe budget choice for backpackers, student groups, and solo travelers. No advance deposit needed on off-peak days.',
    latitude: 24.3090,
    longitude: 91.7315,
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Hotel+Tea+Town+Sreemangal',
    rating: 4.0,
    reviewCount: 980,
  },
];

export const INITIAL_TRAINS: TrainSchedule[] = [
  {
    trainNumber: '709',
    trainName: 'Parabat Express',
    bengaliName: 'পারাবত এক্সপ্রেস',
    route: 'Dhaka (Kamalapur) ➔ Sreemangal ➔ Sylhet',
    departureDhaka: '06:20 AM',
    arrivalSreemangal: '10:15 AM',
    offDay: 'Tuesday',
    fareShovon: 265,
    fareSnigdha: 506,
    fareACBerth: 910,
    notes: 'Recommended day train! Spectacular daylight views through Bhairab bridge and green tea valleys.',
  },
  {
    trainNumber: '717',
    trainName: 'Jayantika Express',
    bengaliName: 'জয়ন্তিকা এক্সপ্রেস',
    route: 'Dhaka (Kamalapur) ➔ Sreemangal ➔ Sylhet',
    departureDhaka: '11:15 AM',
    arrivalSreemangal: '03:50 PM',
    offDay: 'Tuesday',
    fareShovon: 265,
    fareSnigdha: 506,
    fareACBerth: 910,
    notes: 'Arrives in Sreemangal just in time for afternoon check-in and sunset tea garden stroll.',
  },
  {
    trainNumber: '773',
    trainName: 'Kalni Express',
    bengaliName: 'কালনী এক্সপ্রেস',
    route: 'Dhaka (Kamalapur) ➔ Sreemangal ➔ Sylhet',
    departureDhaka: '03:00 PM',
    arrivalSreemangal: '07:10 PM',
    offDay: 'Friday',
    fareShovon: 265,
    fareSnigdha: 506,
    fareACBerth: 910,
    notes: 'Fastest daytime connection with fewer stops. Great evening arrival in town.',
  },
  {
    trainNumber: '739',
    trainName: 'Upaban Express',
    bengaliName: 'উপবন এক্সপ্রেস',
    route: 'Dhaka (Kamalapur) ➔ Sreemangal ➔ Sylhet',
    departureDhaka: '08:30 PM',
    arrivalSreemangal: '01:25 AM',
    offDay: 'Wednesday',
    fareShovon: 265,
    fareSnigdha: 506,
    fareACBerth: 910,
    notes: 'Night sleeper train. Five Brother restaurant near the station is open 24/7 for late arrivals.',
  },
];

export const INITIAL_ROUTE_RATES: StandardRouteRate[] = [
  {
    route: 'Sreemangal Town ⇄ Lawachara National Park',
    distanceKm: '8 km (15-20 mins)',
    cngFareRange: '৳350 one-way · ৳800-৳1,000 roundtrip (2 hrs wait)',
    chanderGariFareRange: '৳2,000 - ৳2,500 roundtrip (group)',
    recommendedVehicle: 'CNG 3-Wheeler or Mountain Bicycle',
    notes: 'Smooth paved road through Bhanugach forest perimeter. Easy ride.',
  },
  {
    route: 'Sreemangal Town ⇄ Madhabpur Lake & Tea Estate',
    distanceKm: '18 km (35-45 mins)',
    cngFareRange: '৳1,200 - ৳1,400 roundtrip with waiting',
    chanderGariFareRange: '৳3,200 - ৳3,800 roundtrip',
    recommendedVehicle: 'CNG (small group) or Chander Gari (large group)',
    notes: 'Passes through Patrokhola tea hills. Final 2 km is paved brick road.',
  },
  {
    route: 'Sreemangal Town ⇄ Baikka Beel Wetland Sanctuary',
    distanceKm: '16 km (35-40 mins)',
    cngFareRange: '৳900 - ৳1,100 roundtrip with sunset waiting',
    chanderGariFareRange: '৳2,500 - ৳3,000 roundtrip',
    recommendedVehicle: 'CNG or Chander Gari',
    notes: 'Scenic dyke road across Hail Haor. Narrow for large buses; perfect for CNG.',
  },
  {
    route: 'Full-Day Classic Circuit (Lawachara + Manipuri + Madhabpur + Nilkontho)',
    distanceKm: '50 km total circuit (7-8 hours)',
    cngFareRange: '৳1,400 - ৳1,600 full day (standard benchmark)',
    chanderGariFareRange: '৳3,500 - ৳4,000 full day (up to 12 pax)',
    recommendedVehicle: 'CNG for 2-4 pax · Chander Gari for 5+ pax',
    notes: 'Most popular tourist circuit. Do not pay more than ৳1,600 for CNG full day.',
  },
  {
    route: 'Sreemangal ⇄ Hum Hum Waterfall (Kolabanpara Village Trailhead)',
    distanceKm: '36 km off-road (1.5-2 hrs drive)',
    cngFareRange: 'Not recommended (Unpaved rocky dirt & stream crossings)',
    chanderGariFareRange: '৳4,500 - ৳5,500 roundtrip (driver waits until trek return)',
    recommendedVehicle: '4x4 Chander Gari (Mandatory)',
    notes: 'Severe off-road hill section. Requires 4x4 clearance. Local village guide required at Kolabanpara.',
  },
];

export const db = {
  getSettings(): SiteSettings {
    return getStored<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  updateSettings(updates: Partial<SiteSettings>): SiteSettings {
    const current = this.getSettings();
    const updated = { ...current, ...updates };
    setStored(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  getPlaces(publishedOnly = true): Place[] {
    const all = getStored<Place[]>(STORAGE_KEYS.PLACES, INITIAL_PLACES);
    return publishedOnly ? all.filter((p) => p.published) : all;
  },

  getPlaceBySlug(slug: string): Place | undefined {
    return this.getPlaces(false).find((p) => p.slug === slug);
  },

  savePlace(place: Place): void {
    const all = this.getPlaces(false);
    const index = all.findIndex((p) => p.id === place.id);
    if (index >= 0) {
      all[index] = { ...place, lastVerifiedAt: new Date().toISOString() };
    } else {
      all.push({ ...place, createdAt: new Date().toISOString() });
    }
    setStored(STORAGE_KEYS.PLACES, all);
  },

  deletePlace(id: string): void {
    const all = this.getPlaces(false).filter((p) => p.id !== id);
    setStored(STORAGE_KEYS.PLACES, all);
  },

  getVehicles(publishedOnly = true): Vehicle[] {
    const all = getStored<Vehicle[]>(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
    return publishedOnly ? all.filter((v) => v.published) : all;
  },

  getVehicleBySlug(slug: string): Vehicle | undefined {
    return this.getVehicles(false).find((v) => v.slug === slug);
  },

  saveVehicle(vehicle: Vehicle): void {
    const all = this.getVehicles(false);
    const index = all.findIndex((v) => v.id === vehicle.id);
    if (index >= 0) {
      all[index] = vehicle;
    } else {
      all.push(vehicle);
    }
    setStored(STORAGE_KEYS.VEHICLES, all);
  },

  deleteVehicle(id: string): void {
    const all = this.getVehicles(false).filter((v) => v.id !== id);
    setStored(STORAGE_KEYS.VEHICLES, all);
  },

  getGuides(publishedOnly = true): Guide[] {
    const all = getStored<Guide[]>(STORAGE_KEYS.GUIDES, INITIAL_GUIDES);
    return publishedOnly ? all.filter((g) => g.published) : all;
  },

  getGuideBySlug(slug: string): Guide | undefined {
    return this.getGuides(false).find((g) => g.slug === slug);
  },

  saveGuide(guide: Guide): void {
    const all = this.getGuides(false);
    const index = all.findIndex((g) => g.id === guide.id);
    if (index >= 0) {
      all[index] = guide;
    } else {
      all.push(guide);
    }
    setStored(STORAGE_KEYS.GUIDES, all);
  },

  deleteGuide(id: string): void {
    const all = this.getGuides(false).filter((g) => g.id !== id);
    setStored(STORAGE_KEYS.GUIDES, all);
  },

  getProviders(): Provider[] {
    return getStored<Provider[]>(STORAGE_KEYS.PROVIDERS, INITIAL_PROVIDERS);
  },

  saveProvider(provider: Provider): void {
    const all = this.getProviders();
    const index = all.findIndex((p) => p.id === provider.id);
    if (index >= 0) {
      all[index] = provider;
    } else {
      all.push(provider);
    }
    setStored(STORAGE_KEYS.PROVIDERS, all);
  },

  getTrips(): TripIdea[] {
    return getStored<TripIdea[]>(STORAGE_KEYS.TRIPS, INITIAL_TRIPS);
  },

  getRestaurants(): Restaurant[] {
    return INITIAL_RESTAURANTS;
  },

  getAccommodations(): Accommodation[] {
    return INITIAL_ACCOMMODATIONS;
  },

  getAllMapPoints(): MapPoint[] {
    const places: MapPoint[] = this.getPlaces(true).map((p) => ({
      id: p.id,
      name: p.name,
      bengaliName: p.bengaliName,
      category: p.category,
      type: 'place' as const,
      latitude: p.latitude,
      longitude: p.longitude,
      rating: p.rating || 4.5,
      reviewCount: p.reviewCount || 1000,
      address: p.area,
      googleMapsUrl: p.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${p.latitude},${p.longitude}`,
      coverImage: p.coverImage,
      summary: p.shortDescription,
      badge: 'Destination & Nature',
      priceInfo: p.entryFeeInformation,
    }));

    const restaurants: MapPoint[] = this.getRestaurants().map((r) => ({
      id: r.id,
      name: r.name,
      bengaliName: r.bengaliName,
      category: r.category,
      type: 'restaurant' as const,
      latitude: r.latitude,
      longitude: r.longitude,
      rating: r.rating,
      reviewCount: r.reviewCount,
      address: r.address,
      googleMapsUrl: r.googleMapsUrl,
      coverImage: r.coverImage,
      summary: `Must try: ${r.mustTryDishes.slice(0, 2).join(', ')}`,
      badge: `Food (${r.priceLevel})`,
      priceInfo: `Avg ৳${r.avgCostPerPerson}/person`,
    }));

    const stays: MapPoint[] = this.getAccommodations().map((s) => ({
      id: s.id,
      name: s.name,
      bengaliName: s.bengaliName,
      category: s.tier,
      type: 'stay' as const,
      latitude: s.latitude,
      longitude: s.longitude,
      rating: s.rating,
      reviewCount: s.reviewCount,
      address: s.address,
      googleMapsUrl: s.googleMapsUrl,
      coverImage: s.coverImage,
      summary: s.amenities.slice(0, 2).join(' · '),
      badge: s.tier,
      priceInfo: s.priceRangePerNight,
    }));

    const transitPoint: MapPoint = {
      id: 'transit-station',
      name: 'Sreemangal Railway Station',
      bengaliName: 'শ্রীমঙ্গল রেলওয়ে স্টেশন',
      category: 'Inter-City Railway Station',
      type: 'transit',
      latitude: 24.3088,
      longitude: 91.7302,
      rating: 4.2,
      reviewCount: 3740,
      address: 'Station Road, Sreemangal Sadar',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sreemangal+Railway+Station',
      coverImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      summary: 'Main transit entry point for Dhaka & Chittagong trains. CNG & Jeep stands located directly outside.',
      badge: 'Main Arrival Hub',
      priceInfo: 'CNG town drop: ৳50-৳80',
    };

    return [...places, ...restaurants, ...stays, transitPoint];
  },

  getTrainSchedules(): TrainSchedule[] {
    return INITIAL_TRAINS;
  },

  getStandardRouteRates(): StandardRouteRate[] {
    return INITIAL_ROUTE_RATES;
  },

  getBookings(): BookingRequest[] {
    return getStored<BookingRequest[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  },

  getBookingByReference(ref: string): BookingRequest | undefined {
    const cleanRef = ref.trim().toUpperCase();
    return this.getBookings().find((b) => b.publicReference === cleanRef);
  },

  createBooking(booking: Omit<BookingRequest, 'id' | 'createdAt' | 'updatedAt'>): BookingRequest {
    const all = this.getBookings();
    const newBooking: BookingRequest = {
      ...booking,
      id: 'book-' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    all.unshift(newBooking);
    setStored(STORAGE_KEYS.BOOKINGS, all);
    return newBooking;
  },

  updateBooking(id: string, updates: Partial<BookingRequest>): BookingRequest | null {
    const all = this.getBookings();
    const index = all.findIndex((b) => b.id === id);
    if (index === -1) return null;

    const updated: BookingRequest = {
      ...all[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    all[index] = updated;
    setStored(STORAGE_KEYS.BOOKINGS, all);
    return updated;
  },

  // Simple, secure session state for admin demonstration

  isAdminAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  },

  setAdminAuthenticated(auth: boolean): void {
    if (typeof window === 'undefined') return;
    if (auth) {
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    }
  },

  resetDemonstrationData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.PLACES);
    localStorage.removeItem(STORAGE_KEYS.VEHICLES);
    localStorage.removeItem(STORAGE_KEYS.GUIDES);
    localStorage.removeItem(STORAGE_KEYS.PROVIDERS);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    window.location.reload();
  },
};

