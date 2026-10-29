import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Inbox,
  Clock,
  CheckCircle2,
  XCircle,
  Car,
  MapPin,
  Users,
  Settings as SettingsIcon,
  LogOut,
  Edit3,
  Plus,
  Eye,
  Check,
  X,
  AlertTriangle,
  RotateCcw,
  Percent,
} from 'lucide-react';
import {
  db,
  BookingRequest,
  Place,
  Vehicle,
  Guide,
  Provider,
  SiteSettings,
} from '../lib/db';
import {
  canTransitionStatus,
  calculateCommission,
  BookingStatus,
} from '../lib/bookingLogic';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'bookings' | 'places' | 'transport' | 'guides' | 'providers' | 'settings'
  >('overview');

  // State
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(db.getSettings());

  // Filter state for bookings
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);

  // Edit states for modals
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const reloadData = () => {
    setBookings(db.getBookings());
    setPlaces(db.getPlaces(false));
    setVehicles(db.getVehicles(false));
    setGuides(db.getGuides(false));
    setProviders(db.getProviders());
    setSettings(db.getSettings());
  };

  useEffect(() => {
    reloadData();
  }, []);

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // Metrics Calculation
  const newCount = bookings.filter((b) => b.status === 'new' || b.status === 'reviewing').length;
  const awaitingProviderCount = bookings.filter((b) => b.status === 'awaiting_provider').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled' || b.status === 'rejected').length;

  // Completed Gross Booking Value
  const grossCompletedValue = bookings
    .filter((b) => b.status === 'completed' && b.quotedAmount)
    .reduce((sum, b) => sum + (b.quotedAmount || 0), 0);

  // Commission Earned (agreed on completed trips)
  const commissionEarned = bookings
    .filter((b) => b.status === 'completed' && b.commissionAmount)
    .reduce((sum, b) => sum + (b.commissionAmount || 0), 0);

  // Commission Collected
  const commissionCollected = bookings
    .filter((b) => b.commissionPaymentStatus === 'collected' && b.commissionAmount)
    .reduce((sum, b) => sum + (b.commissionAmount || 0), 0);

  // Status update handler for booking modal
  const handleUpdateBookingStatus = (
    bookingId: string,
    nextStatus: BookingStatus,
    extraUpdates: Partial<BookingRequest> = {}
  ) => {
    const current = bookings.find((b) => b.id === bookingId);
    if (!current) return;

    // Check transition rules
    const providerConfirmed = extraUpdates.providerConfirmedAt !== undefined
      ? !!extraUpdates.providerConfirmedAt
      : !!current.providerConfirmedAt;
    const customerAccepted = extraUpdates.customerAcceptedAt !== undefined
      ? !!extraUpdates.customerAcceptedAt
      : !!current.customerAcceptedAt;
    const hasQuotedAmount = (extraUpdates.quotedAmount || current.quotedAmount || 0) > 0;

    const check = canTransitionStatus(current.status, nextStatus, {
      providerConfirmed,
      customerAccepted,
      hasQuotedAmount,
    });

    if (!check.allowed) {
      alert(`Status transition disallowed: ${check.reason}`);
      return;
    }

    // Auto-calculate commission if entering completed or quoted
    let commissionAmount = current.commissionAmount;
    const quote = extraUpdates.quotedAmount !== undefined ? extraUpdates.quotedAmount : current.quotedAmount;
    if (quote && quote > 0) {
      commissionAmount = calculateCommission(
        quote,
        current.commissionType,
        current.agreedCommissionValue
      );
    }

    const updated = db.updateBooking(bookingId, {
      status: nextStatus,
      ...extraUpdates,
      commissionAmount,
    });

    if (updated) {
      setSelectedBooking(updated);
      reloadData();
      showFeedback(`Booking ${updated.publicReference} updated to ${nextStatus}.`);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (bookingStatusFilter === 'all') return true;
    return b.status === bookingStatusFilter;
  });

  return (
    <div className="min-h-screen bg-stone-100 pb-16">
      {/* Top Header */}
      <div className="bg-[#123524] text-white px-4 sm:px-8 py-4 border-b border-[#1a4933]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight">Admin & Operations Desk</h1>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-emerald-900 text-emerald-200 border border-emerald-700">
                  Authorized Session
                </span>
              </div>
              <p className="text-xs text-stone-300">
                Sreemangal Explorer · Local Marketplace Coordination
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (confirm('Reset demonstration data to authentic defaults?')) {
                  db.resetDemonstrationData();
                }
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-300 hover:text-white bg-white/10 hover:bg-white/15 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-200 hover:text-white bg-red-950/40 hover:bg-red-900/60 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="bg-white border-b border-stone-200 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-2">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'bookings', label: `Inquiries (${newCount + awaitingProviderCount})`, icon: Inbox },
            { id: 'places', label: 'Destinations', icon: MapPin },
            { id: 'transport', label: 'Transport Listings', icon: Car },
            { id: 'guides', label: 'Local Guides', icon: Users },
            { id: 'providers', label: 'Providers / Syndicates', icon: ShieldCheck },
            { id: 'settings', label: 'Settings', icon: SettingsIcon },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                  active
                    ? 'bg-[#123524] text-white shadow-sm'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notification Toast */}
      {feedbackMsg && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-4">
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        </div>
      )}

      {/* Tab Panels */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* ======================= OVERVIEW TAB ======================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
                  New / Reviewing
                </span>
                <span className="text-3xl font-bold text-amber-700 block mt-2">{newCount}</span>
                <span className="text-[11px] text-stone-400 mt-1 block">Awaiting admin triage</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
                  Checking Provider
                </span>
                <span className="text-3xl font-bold text-blue-700 block mt-2">
                  {awaitingProviderCount}
                </span>
                <span className="text-[11px] text-stone-400 mt-1 block">Checking syndicate availability</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
                  Confirmed Trips
                </span>
                <span className="text-3xl font-bold text-emerald-700 block mt-2">{confirmedCount}</span>
                <span className="text-[11px] text-stone-400 mt-1 block">Upcoming confirmed</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
                  Completed
                </span>
                <span className="text-3xl font-bold text-stone-800 block mt-2">{completedCount}</span>
                <span className="text-[11px] text-stone-400 mt-1 block">Successfully executed</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm col-span-2 lg:col-span-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
                  Cancelled / Declined
                </span>
                <span className="text-3xl font-bold text-red-600 block mt-2">{cancelledCount}</span>
                <span className="text-[11px] text-stone-400 mt-1 block">Weather or unavailable</span>
              </div>
            </div>

            {/* Financial Transparency Overview */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    Financial Performance & Commission Accounting
                  </h3>
                  <p className="text-xs text-stone-500">
                    Transparent separation between completed trip value, agreed commission earned, and collected commission.
                  </p>
                </div>
                <div className="px-3 py-1 bg-stone-100 rounded-lg text-xs font-semibold text-stone-700">
                  Currency: {settings.currency} (৳)
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-xs font-medium text-stone-500 block">
                    Gross Completed Booking Value
                  </span>
                  <div className="text-2xl font-bold text-[#18201b] mt-1">
                    ৳ {grossCompletedValue.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1.5 leading-normal">
                    Total fare paid directly by travelers to local drivers and guides for completed trips.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                  <span className="text-xs font-medium text-amber-800 block">
                    Agreed Commission Earned
                  </span>
                  <div className="text-2xl font-bold text-amber-900 mt-1">
                    ৳ {commissionEarned.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-amber-800/80 mt-1.5 leading-normal">
                    Total referral commission accrued from completed provider bookings (typically 10-12%).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <span className="text-xs font-medium text-emerald-800 block">
                    Actual Commission Collected
                  </span>
                  <div className="text-2xl font-bold text-emerald-900 mt-1">
                    ৳ {commissionCollected.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-emerald-800/80 mt-1.5 leading-normal">
                    Cash or bKash referral payments received and verified from providers.
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Booking Requests */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-stone-900">Recent Booking Requests</h3>
                  <p className="text-xs text-stone-500">Live feed of incoming travel inquiries</p>
                </div>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs font-semibold text-[#123524] hover:underline"
                >
                  View All Inquiries →
                </button>
              </div>

              <div className="divide-y divide-stone-100">
                {bookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking.id}
                    onClick={() => setSelectedBooking(booking)}
                    className="p-4 hover:bg-stone-50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-stone-900">
                          {booking.publicReference}
                        </span>
                        <span className="text-stone-400">·</span>
                        <span className="font-semibold text-stone-800">{booking.customerName}</span>
                        <span className="text-stone-400">·</span>
                        <span className="text-stone-500">{booking.customerPhone}</span>
                      </div>
                      <div className="text-stone-500 mt-1">
                        Trip Date: <strong className="text-stone-700">{booking.requestedDate}</strong> ·{' '}
                        {booking.vehicleName || booking.guideName || 'Custom Route'} · {booking.groupSize} Pax
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-stone-900">
                        {booking.quotedAmount ? `৳ ${booking.quotedAmount.toLocaleString()}` : 'Not quoted'}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${
                          booking.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : booking.status === 'completed'
                            ? 'bg-stone-100 text-stone-800'
                            : booking.status === 'awaiting_provider'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {booking.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================= BOOKINGS TAB ======================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200">
              <div className="flex items-center gap-2 overflow-x-auto">
                {[
                  { id: 'all', label: 'All Inquiries' },
                  { id: 'new', label: 'New' },
                  { id: 'awaiting_provider', label: 'Awaiting Provider' },
                  { id: 'quoted', label: 'Quoted' },
                  { id: 'confirmed', label: 'Confirmed' },
                  { id: 'completed', label: 'Completed' },
                  { id: 'cancelled', label: 'Cancelled' },
                ].map((status) => (
                  <button
                    key={status.id}
                    onClick={() => setBookingStatusFilter(status.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      bookingStatusFilter === status.id
                        ? 'bg-[#123524] text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>

              <div className="text-xs text-stone-500 font-medium">
                Showing {filteredBookings.length} of {bookings.length} requests
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Reference</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Service / Route</th>
                      <th className="p-4">Trip Date</th>
                      <th className="p-4">Pax</th>
                      <th className="p-4">Quote</th>
                      <th className="p-4">Commission</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="p-4 font-mono font-bold text-stone-900">
                          {b.publicReference}
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-stone-900">{b.customerName}</div>
                          <div className="text-stone-500 text-[11px]">{b.customerPhone}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-stone-800">
                            {b.vehicleName || b.guideName || 'Custom Route'}
                          </div>
                          <div className="text-stone-400 text-[11px] truncate max-w-xs">
                            {b.pickupLocation}
                          </div>
                        </td>
                        <td className="p-4 whitespace-nowrap font-medium text-stone-800">
                          {b.requestedDate}
                        </td>
                        <td className="p-4 font-semibold text-stone-800">{b.groupSize}</td>
                        <td className="p-4 whitespace-nowrap font-bold text-stone-900">
                          {b.quotedAmount ? `৳ ${b.quotedAmount.toLocaleString()}` : '—'}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          {b.commissionAmount ? (
                            <div>
                              <span className="font-semibold text-amber-900">
                                ৳ {b.commissionAmount}
                              </span>
                              <span
                                className={`ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  b.commissionPaymentStatus === 'collected'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-stone-100 text-stone-600'
                                }`}
                              >
                                {b.commissionPaymentStatus}
                              </span>
                            </div>
                          ) : (
                            <span className="text-stone-400">—</span>
                          )}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${
                              b.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : b.status === 'completed'
                                ? 'bg-stone-100 text-stone-800'
                                : b.status === 'awaiting_provider'
                                ? 'bg-blue-100 text-blue-800'
                                : b.status === 'quoted'
                                ? 'bg-purple-100 text-purple-800'
                                : b.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {b.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedBooking(b)}
                            className="px-3 py-1.5 bg-[#123524] hover:bg-[#1a4933] text-white rounded-lg text-xs font-semibold transition-colors"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================= PLACES TAB ======================= */}
        {activeTab === 'places' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">Manage Destinations</h3>
                <p className="text-xs text-stone-500">
                  Sreemangal and Moulvibazar tourist attractions with verified admission & access notes
                </p>
              </div>
              <button
                onClick={() => {
                  const newPlace: Place = {
                    id: 'place-' + Date.now(),
                    name: 'New Sreemangal Destination',
                    bengaliName: 'নতুন স্থান',
                    slug: 'new-destination-' + Date.now(),
                    category: 'Tea Estate',
                    area: 'Sreemangal Sadar',
                    shortDescription: 'Short summary of the destination',
                    description: 'Full description and history of this destination.',
                    latitude: 24.3065,
                    longitude: 91.7314,
                    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=24.3065,91.7314',
                    rating: 4.5,
                    reviewCount: 150,
                    coverImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
                    gallery: [],
                    visitingInformation: 'Open during daylight hours.',
                    accessNotes: 'Paved road access.',
                    openingHours: '08:00 AM - 05:00 PM',
                    entryFeeInformation: 'Free entry.',
                    verificationStatus: 'verified',
                    lastVerifiedAt: new Date().toISOString(),
                    published: true,
                    bestTransport: ['CNG Auto-rickshaw', 'Chander Gari'],
                    createdAt: new Date().toISOString(),
                  };
                  db.savePlace(newPlace);
                  reloadData();
                  setEditingPlace(newPlace);
                }}
                className="px-4 py-2 bg-[#123524] hover:bg-[#1a4933] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Destination</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((place) => (
                <div
                  key={place.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm flex flex-col"
                >
                  <div className="relative h-44 bg-stone-900">
                    <img
                      src={place.coverImage}
                      alt={place.name}
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          place.published ? 'bg-emerald-600 text-white' : 'bg-stone-600 text-stone-200'
                        }`}
                      >
                        {place.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-3 text-white text-xs font-medium">
                      {place.category} · {place.area}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-stone-900 text-base">{place.name}</h4>
                      <p className="text-stone-500 text-xs mt-1 line-clamp-2">
                        {place.shortDescription}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between">
                      <button
                        onClick={() => {
                          const updated = { ...place, published: !place.published };
                          db.savePlace(updated);
                          reloadData();
                        }}
                        className="text-xs text-stone-600 hover:text-stone-900 font-medium"
                      >
                        {place.published ? 'Unpublish' : 'Publish'}
                      </button>

                      <button
                        onClick={() => setEditingPlace(place)}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= TRANSPORT TAB ======================= */}
        {activeTab === 'transport' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">Vehicle & Transport Listings</h3>
                <p className="text-xs text-stone-500">
                  CNG, Chander Gari, Sedans, and Microbuses with syndicate rates
                </p>
              </div>
              <button
                onClick={() => {
                  const newVeh: Vehicle = {
                    id: 'veh-' + Date.now(),
                    providerId: 'prov-1',
                    providerName: 'Sreemangal Jeep & Chander Gari Syndicate',
                    name: 'New Syndicate Listing',
                    slug: 'new-vehicle-' + Date.now(),
                    vehicleType: 'chander_gari',
                    passengerCapacity: 8,
                    driverIncluded: true,
                    luggageDetails: 'Standard roof carrier.',
                    supportedRoutes: ['Lawachara Circuit', 'Madhabpur Lake'],
                    pricingBasis: 'Full Day (8 hrs)',
                    indicativePrice: 3200,
                    currency: 'BDT',
                    inclusions: ['Driver', 'Fuel for circuit'],
                    exclusions: ['Entry tickets'],
                    coverImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80',
                    published: true,
                    lastPriceVerifiedAt: new Date().toISOString(),
                    createdAt: new Date().toISOString(),
                  };
                  db.saveVehicle(newVeh);
                  reloadData();
                  setEditingVehicle(newVeh);
                }}
                className="px-4 py-2 bg-[#123524] hover:bg-[#1a4933] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Vehicle</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((veh) => (
                <div
                  key={veh.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm flex flex-col"
                >
                  <div className="relative h-44 bg-stone-900">
                    <img
                      src={veh.coverImage}
                      alt={veh.name}
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          veh.published ? 'bg-emerald-600 text-white' : 'bg-stone-600 text-stone-200'
                        }`}
                      >
                        {veh.published ? 'Active' : 'Unpublished'}
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-3 text-white text-xs font-semibold capitalize">
                      {veh.vehicleType.replace('_', ' ')} · Max {veh.passengerCapacity} Pax
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-stone-900 text-base">{veh.name}</h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Provider: {veh.providerName}
                      </p>
                      <div className="mt-3 flex items-baseline gap-1.5">
                        <span className="text-lg font-bold text-[#123524]">
                          ৳ {veh.indicativePrice.toLocaleString()} {veh.currency}
                        </span>
                        <span className="text-[11px] text-stone-500 font-medium">
                          ({veh.pricingBasis})
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between">
                      <button
                        onClick={() => {
                          const updated = { ...veh, published: !veh.published };
                          db.saveVehicle(updated);
                          reloadData();
                        }}
                        className="text-xs text-stone-600 hover:text-stone-900 font-medium"
                      >
                        {veh.published ? 'Unpublish' : 'Publish'}
                      </button>

                      <button
                        onClick={() => setEditingVehicle(veh)}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Vehicle</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= GUIDES TAB ======================= */}
        {activeTab === 'guides' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">Local Guides Directory</h3>
                <p className="text-xs text-stone-500">
                  Certified forest naturalists and cultural guides in Moulvibazar
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {guides.map((guide) => (
                <div
                  key={guide.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={guide.coverImage}
                      alt={guide.name}
                      className="w-14 h-14 rounded-xl object-cover border"
                    />
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">{guide.name}</h4>
                      <p className="text-[11px] text-emerald-800 font-medium">
                        {guide.verificationStatus === 'verified' ? '✓ Verified Naturalist' : 'Pending'}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {guide.languages.join(', ')}
                      </p>
                    </div>
                  </div>

                  <p className="text-stone-600 text-xs line-clamp-3 leading-relaxed">
                    {guide.description}
                  </p>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-[#123524]">
                      ৳ {guide.indicativePrice} / trail
                    </span>
                    <button
                      onClick={() => {
                        const updated = { ...guide, published: !guide.published };
                        db.saveGuide(updated);
                        reloadData();
                      }}
                      className="text-stone-600 hover:text-stone-900 font-semibold"
                    >
                      {guide.published ? 'Published' : 'Hidden'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= PROVIDERS TAB ======================= */}
        {activeTab === 'providers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">Partner Providers & Syndicates</h3>
                <p className="text-xs text-stone-500">
                  Confidential provider agreements, commission structures, and private dispatch contacts
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="divide-y divide-stone-100">
                {providers.map((p) => (
                  <div key={p.id} className="p-6 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-stone-900 text-base">{p.displayName}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-700">
                            {p.providerType}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Public Phone: {p.publicContactNumber || 'Not published'}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[11px] text-stone-400 uppercase font-semibold block">
                            Agreed Commission
                          </span>
                          <span className="text-sm font-bold text-emerald-800">
                            {p.agreedCommissionType === 'percentage'
                              ? `${p.agreedCommissionValue}% per completed trip`
                              : `৳ ${p.agreedCommissionValue} fixed`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Protected Private Notes */}
                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 space-y-1">
                      <span className="font-bold uppercase tracking-wider text-[10px] text-amber-800 block">
                        Confidential Internal Dispatch Notes
                      </span>
                      <p className="font-medium">{p.privateContactDetails}</p>
                      <p className="text-amber-900/80">{p.internalNotes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================= SETTINGS TAB ======================= */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-stone-900">Platform Configuration</h3>
              <p className="text-xs text-stone-500">
                Brand settings, coordinator contact numbers, and default commission rules
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  value={settings.brandName}
                  onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Support Helpline Phone</label>
                  <input
                    type="text"
                    value={settings.supportPhone}
                    onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">WhatsApp Coordination Number</label>
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Service Area</label>
                <input
                  type="text"
                  value={settings.serviceArea}
                  onChange={(e) => setSettings({ ...settings, serviceArea: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Default Commission Rate (%)</label>
                <input
                  type="number"
                  value={settings.defaultCommissionRate}
                  onChange={(e) =>
                    setSettings({ ...settings, defaultCommissionRate: parseFloat(e.target.value) || 10 })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end">
                <button
                  onClick={() => {
                    db.updateSettings(settings);
                    showFeedback('Settings saved successfully.');
                  }}
                  className="px-5 py-2.5 bg-[#123524] text-white rounded-xl font-semibold hover:bg-[#1a4933] transition-colors"
                >
                  Save Platform Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* BOOKING MANAGEMENT MODAL (ASSIGN, QUOTE, STATE TRANSITIONS) */}
      {/* ============================================================ */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
            <div className="bg-[#123524] text-white p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xl font-bold tracking-wider">
                    {selectedBooking.publicReference}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-white/20 text-emerald-200">
                    {selectedBooking.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-stone-300 mt-0.5">
                  Requested on {new Date(selectedBooking.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 rounded-lg text-stone-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-700">
              {/* Customer info */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-stone-400 block font-medium">Customer Name</span>
                  <span className="font-bold text-stone-900 text-sm">{selectedBooking.customerName}</span>
                </div>
                <div>
                  <span className="text-stone-400 block font-medium">Customer Phone</span>
                  <a
                    href={`tel:${selectedBooking.customerPhone}`}
                    className="font-bold text-emerald-800 text-sm hover:underline"
                  >
                    {selectedBooking.customerPhone}
                  </a>
                </div>
                <div>
                  <span className="text-stone-400 block font-medium">Trip Date & Time</span>
                  <span className="font-semibold text-stone-800">
                    {selectedBooking.requestedDate} ({selectedBooking.requestedStartTime || 'Morning'})
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block font-medium">Group Size</span>
                  <span className="font-semibold text-stone-800">{selectedBooking.groupSize} Persons</span>
                </div>
                <div className="col-span-2">
                  <span className="text-stone-400 block font-medium">Pickup Location</span>
                  <span className="font-semibold text-stone-800">{selectedBooking.pickupLocation}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-stone-400 block font-medium">Intended Route / Details</span>
                  <span className="font-semibold text-stone-800">{selectedBooking.itineraryDetails}</span>
                </div>
                {selectedBooking.customerNotes && (
                  <div className="col-span-2 bg-white p-2.5 rounded-lg border text-stone-600">
                    <strong>Customer Notes:</strong> {selectedBooking.customerNotes}
                  </div>
                )}
              </div>

              {/* Provider Assignment & Quote Input */}
              <div className="border border-stone-200 p-4 rounded-xl space-y-3 bg-white">
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                  Provider Assignment & Quoting
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">
                      Assign Provider
                    </label>
                    <select
                      value={selectedBooking.assignedProviderId || ''}
                      onChange={(e) => {
                        const prov = providers.find((p) => p.id === e.target.value);
                        if (prov) {
                          const updated = db.updateBooking(selectedBooking.id, {
                            assignedProviderId: prov.id,
                            assignedProviderName: prov.displayName,
                            commissionType: prov.agreedCommissionType,
                            agreedCommissionValue: prov.agreedCommissionValue,
                          });
                          if (updated) setSelectedBooking(updated);
                          reloadData();
                        }
                      }}
                      className="w-full p-2 border rounded-lg bg-white"
                    >
                      <option value="">-- Choose Provider / Syndicate --</option>
                      {providers.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.displayName} ({p.agreedCommissionValue}% com)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">
                      Agreed Quote Amount (BDT ৳)
                    </label>
                    <input
                      type="number"
                      value={selectedBooking.quotedAmount || ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        const com = calculateCommission(
                          val,
                          selectedBooking.commissionType,
                          selectedBooking.agreedCommissionValue
                        );
                        const updated = db.updateBooking(selectedBooking.id, {
                          quotedAmount: val,
                          commissionAmount: com,
                        });
                        if (updated) setSelectedBooking(updated);
                        reloadData();
                      }}
                      placeholder="e.g. 3500"
                      className="w-full p-2 border rounded-lg font-bold text-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Quote Inclusions & Terms</label>
                  <input
                    type="text"
                    value={selectedBooking.quoteDetails || ''}
                    onChange={(e) => {
                      const updated = db.updateBooking(selectedBooking.id, {
                        quoteDetails: e.target.value,
                      });
                      if (updated) setSelectedBooking(updated);
                    }}
                    placeholder="e.g. Includes fuel up to 50 km, vehicle waiting, driver lunch."
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              {/* Confirmations Checklist */}
              <div className="border border-stone-200 p-4 rounded-xl space-y-3 bg-stone-50">
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                  Availability & Acceptance Verification
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!selectedBooking.providerConfirmedAt}
                      onChange={(e) => {
                        const updated = db.updateBooking(selectedBooking.id, {
                          providerConfirmedAt: e.target.checked ? new Date().toISOString() : undefined,
                        });
                        if (updated) setSelectedBooking(updated);
                        reloadData();
                      }}
                      className="rounded text-emerald-800"
                    />
                    <span className="font-medium text-stone-800">
                      Provider / Syndicate has confirmed vehicle/guide availability
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!selectedBooking.customerAcceptedAt}
                      onChange={(e) => {
                        const updated = db.updateBooking(selectedBooking.id, {
                          customerAcceptedAt: e.target.checked ? new Date().toISOString() : undefined,
                        });
                        if (updated) setSelectedBooking(updated);
                        reloadData();
                      }}
                      className="rounded text-emerald-800"
                    />
                    <span className="font-medium text-stone-800">
                      Customer has agreed to quoted amount (৳ {selectedBooking.quotedAmount || 0})
                    </span>
                  </label>
                </div>

                {/* Commission Summary */}
                {selectedBooking.quotedAmount && selectedBooking.commissionAmount ? (
                  <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-stone-500">Agreed Platform Commission:</span>{' '}
                      <strong className="text-amber-900">
                        ৳ {selectedBooking.commissionAmount} ({selectedBooking.agreedCommissionValue}%)
                      </strong>
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 font-medium">
                        <span>Payment:</span>
                        <select
                          value={selectedBooking.commissionPaymentStatus}
                          onChange={(e) => {
                            const status = e.target.value as 'pending' | 'collected' | 'waived';
                            const updated = db.updateBooking(selectedBooking.id, {
                              commissionPaymentStatus: status,
                              commissionCollectedAt: status === 'collected' ? new Date().toISOString() : undefined,
                            });
                            if (updated) setSelectedBooking(updated);
                            reloadData();
                          }}
                          className="p-1 border rounded bg-white text-xs font-semibold"
                        >
                          <option value="pending">Pending</option>
                          <option value="collected">Collected (bKash/Cash)</option>
                          <option value="waived">Waived</option>
                        </select>
                      </label>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Status State Transitions */}
              <div className="border border-stone-200 p-4 rounded-xl space-y-2 bg-white">
                <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">
                  Workflow Action & State Transitions
                </span>

                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedBooking.status === 'new' && (
                    <button
                      onClick={() => handleUpdateBookingStatus(selectedBooking.id, 'reviewing')}
                      className="px-3 py-1.5 bg-stone-800 text-white rounded-lg font-semibold"
                    >
                      Mark Reviewing
                    </button>
                  )}

                  {(selectedBooking.status === 'new' || selectedBooking.status === 'reviewing') && (
                    <button
                      onClick={() => handleUpdateBookingStatus(selectedBooking.id, 'awaiting_provider')}
                      className="px-3 py-1.5 bg-blue-700 text-white rounded-lg font-semibold"
                    >
                      Call Provider (Awaiting Provider)
                    </button>
                  )}

                  {selectedBooking.status === 'awaiting_provider' && (
                    <button
                      onClick={() => handleUpdateBookingStatus(selectedBooking.id, 'quoted')}
                      className="px-3 py-1.5 bg-purple-700 text-white rounded-lg font-semibold"
                    >
                      Send Quote to Customer (Quoted)
                    </button>
                  )}

                  {selectedBooking.status === 'quoted' && (
                    <button
                      onClick={() => handleUpdateBookingStatus(selectedBooking.id, 'awaiting_customer')}
                      className="px-3 py-1.5 bg-indigo-700 text-white rounded-lg font-semibold"
                    >
                      Mark Customer Awaiting
                    </button>
                  )}

                  {(selectedBooking.status === 'awaiting_customer' || selectedBooking.status === 'quoted') && (
                    <button
                      onClick={() =>
                        handleUpdateBookingStatus(selectedBooking.id, 'confirmed', {
                          confirmedAt: new Date().toISOString(),
                        })
                      }
                      className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg font-semibold"
                    >
                      Confirm Booking
                    </button>
                  )}

                  {selectedBooking.status === 'confirmed' && (
                    <button
                      onClick={() =>
                        handleUpdateBookingStatus(selectedBooking.id, 'completed', {
                          completedAt: new Date().toISOString(),
                        })
                      }
                      className="px-3 py-1.5 bg-stone-900 text-white rounded-lg font-semibold"
                    >
                      Mark Trip Completed
                    </button>
                  )}

                  {selectedBooking.status !== 'completed' && selectedBooking.status !== 'cancelled' && (
                    <button
                      onClick={() => {
                        const reason = prompt('Reason for cancellation (e.g. weather, customer cancelled):');
                        if (reason !== null) {
                          handleUpdateBookingStatus(selectedBooking.id, 'cancelled', {
                            cancelledAt: new Date().toISOString(),
                            cancellationReason: reason,
                          });
                        }
                      }}
                      className="px-3 py-1.5 bg-red-100 text-red-800 hover:bg-red-200 rounded-lg font-semibold"
                    >
                      Cancel Request
                    </button>
                  )}
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  Protected Internal Operations Notes
                </label>
                <textarea
                  rows={2}
                  value={selectedBooking.internalNotes || ''}
                  onChange={(e) => {
                    const updated = db.updateBooking(selectedBooking.id, {
                      internalNotes: e.target.value,
                    });
                    if (updated) setSelectedBooking(updated);
                  }}
                  placeholder="e.g. Spoke with Driver Salam. Assigned vehicle #12. Commission promised via bKash."
                  className="w-full p-2 border rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-stone-800 text-white rounded-lg text-xs font-semibold"
              >
                Close Manager
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Place Modal */}
      {editingPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-2xl p-6 shadow-2xl border space-y-4">
            <h3 className="text-base font-bold text-stone-900">Edit Destination</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Name</label>
                <input
                  type="text"
                  value={editingPlace.name}
                  onChange={(e) => setEditingPlace({ ...editingPlace, name: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Short Description</label>
                <input
                  type="text"
                  value={editingPlace.shortDescription}
                  onChange={(e) => setEditingPlace({ ...editingPlace, shortDescription: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Opening Hours</label>
                <input
                  type="text"
                  value={editingPlace.openingHours}
                  onChange={(e) => setEditingPlace({ ...editingPlace, openingHours: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Entry Fee Information</label>
                <input
                  type="text"
                  value={editingPlace.entryFeeInformation}
                  onChange={(e) => setEditingPlace({ ...editingPlace, entryFeeInformation: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => setEditingPlace(null)}
                className="px-3 py-1.5 text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  db.savePlace(editingPlace);
                  reloadData();
                  setEditingPlace(null);
                  showFeedback('Destination saved.');
                }}
                className="px-4 py-2 bg-[#123524] text-white rounded-lg font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Vehicle Modal */}
      {editingVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-2xl p-6 shadow-2xl border space-y-4">
            <h3 className="text-base font-bold text-stone-900">Edit Vehicle Listing</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Vehicle Name</label>
                <input
                  type="text"
                  value={editingVehicle.name}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, name: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Capacity (Pax)</label>
                  <input
                    type="number"
                    value={editingVehicle.passengerCapacity}
                    onChange={(e) =>
                      setEditingVehicle({
                        ...editingVehicle,
                        passengerCapacity: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Indicative Price (BDT)</label>
                  <input
                    type="number"
                    value={editingVehicle.indicativePrice}
                    onChange={(e) =>
                      setEditingVehicle({
                        ...editingVehicle,
                        indicativePrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full p-2 border rounded-lg font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Pricing Basis</label>
                <input
                  type="text"
                  value={editingVehicle.pricingBasis}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, pricingBasis: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => setEditingVehicle(null)}
                className="px-3 py-1.5 text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  db.saveVehicle(editingVehicle);
                  reloadData();
                  setEditingVehicle(null);
                  showFeedback('Vehicle listing updated.');
                }}
                className="px-4 py-2 bg-[#123524] text-white rounded-lg font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
