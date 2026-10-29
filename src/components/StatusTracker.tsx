import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Car,
  UserCheck,
  Calendar,
  MapPin,
  Users,
  AlertCircle,
  MessageCircle,
  Check,
  Phone,
} from 'lucide-react';
import { db, BookingRequest } from '../lib/db';
import { generateWhatsAppLink, normalizePhoneForWhatsApp } from '../lib/bookingLogic';

export const StatusTracker: React.FC = () => {
  const [refInput, setRefInput] = useState('');
  const [booking, setBooking] = useState<BookingRequest | null>(null);
  const [searched, setSearched] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActionSuccess(null);
    if (!refInput.trim()) return;

    const found = db.getBookingByReference(refInput);
    setBooking(found || null);
    setSearched(true);
  };

  const handleAcceptQuote = () => {
    if (!booking) return;
    const updated = db.updateBooking(booking.id, {
      status: 'awaiting_customer',
      customerAcceptedAt: new Date().toISOString(),
    });
    if (updated) {
      setBooking(updated);
      setActionSuccess('Thank you! You have accepted the quoted fare. The coordinator is finalizing the driver assignment.');
    }
  };

  const settings = db.getSettings();
  const whatsappUrl = booking
    ? generateWhatsAppLink(settings.whatsappNumber, {
        reference: booking.publicReference,
        itemTitle: booking.vehicleName || booking.guideName,
        date: booking.requestedDate,
      })
    : '';

  const getStatusBadge = (status: BookingRequest['status']) => {
    switch (status) {
      case 'new':
      case 'reviewing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Under Coordinator Review</span>
          </span>
        );
      case 'awaiting_provider':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Checking Driver Availability</span>
          </span>
        );
      case 'quoted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            <Check className="w-3.5 h-3.5" />
            <span>Quote Ready · Awaiting Acceptance</span>
          </span>
        );
      case 'awaiting_customer':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Accepted by You · Finalizing</span>
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Booking Confirmed</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-800 border border-stone-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Trip Completed</span>
          </span>
        );
      case 'cancelled':
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-800 border border-red-200">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Cancelled / Unavailable</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#18201b]">
          Track Your Booking Request
        </h1>
        <p className="text-stone-600 text-sm mt-2 max-w-md mx-auto">
          Enter your unique booking reference (e.g., <code className="font-mono text-emerald-800 font-semibold">SRE-7K2M-9P4W</code>) to check quotes, driver assignments, and live status.
        </p>
      </div>

      {/* Search Input Card */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-stone-200 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={refInput}
              onChange={(e) => setRefInput(e.target.value.toUpperCase())}
              placeholder="e.g. SRE-7K2M-9P4W"
              className="w-full pl-11 pr-4 py-3 text-base font-mono uppercase tracking-wider rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#123524] bg-stone-50"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-[#123524] hover:bg-[#1a4933] text-white font-semibold rounded-xl text-sm transition-colors shadow-sm"
          >
            Check Status
          </button>
        </form>

        {/* Demo Quick Toggles */}
        <div className="mt-3 text-xs text-stone-500 flex items-center gap-1.5 flex-wrap">
          <span>Try sample references:</span>
          <button
            type="button"
            onClick={() => setRefInput('SRE-7K2M-9P4W')}
            className="underline hover:text-[#123524]"
          >
            SRE-7K2M-9P4W (Reviewing)
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => setRefInput('SRE-3B8X-4T9J')}
            className="underline hover:text-[#123524]"
          >
            SRE-3B8X-4T9J (Confirmed)
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => setRefInput('SRE-5D6N-8L1Q')}
            className="underline hover:text-[#123524]"
          >
            SRE-5D6N-8L1Q (Completed)
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Results */}
      {searched && (
        <>
          {booking ? (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-50/60">
                <div>
                  <div className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
                    Booking Reference
                  </div>
                  <div className="font-mono text-2xl font-bold text-[#123524] mt-0.5">
                    {booking.publicReference}
                  </div>
                </div>
                <div>{getStatusBadge(booking.status)}</div>
              </div>

              {/* Booking Details */}
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-xs text-stone-500 block">Customer Name</span>
                    <span className="font-semibold text-stone-800">{booking.customerName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-stone-500 block">Contact Phone</span>
                    <span className="font-semibold text-stone-800">{booking.customerPhone}</span>
                  </div>
                  <div>
                    <span className="text-xs text-stone-500 block">Trip Date & Time</span>
                    <span className="font-semibold text-stone-800">
                      {booking.requestedDate} {booking.requestedStartTime ? `· ${booking.requestedStartTime}` : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-stone-500 block">Group Size</span>
                    <span className="font-semibold text-stone-800">{booking.groupSize} Passengers</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-xs text-stone-500 block">Pickup Location</span>
                    <span className="font-semibold text-stone-800">{booking.pickupLocation}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-xs text-stone-500 block">Requested Service / Route</span>
                    <span className="font-semibold text-stone-800">
                      {booking.vehicleName || booking.guideName || 'Standard Sreemangal Tour'} · {booking.itineraryDetails}
                    </span>
                  </div>
                </div>

                {/* Quote Box */}
                <div className="bg-stone-50 rounded-xl p-5 border border-stone-200">
                  <h4 className="text-xs uppercase tracking-wider text-stone-600 font-bold mb-2">
                    Pricing & Quote Status
                  </h4>
                  {booking.quotedAmount ? (
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-[#123524]">
                          ৳ {booking.quotedAmount.toLocaleString()}
                        </span>
                        <span className="text-xs text-stone-500 font-medium">
                          ({booking.currency}) · Indicative Full Day Quote
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                        {booking.quoteDetails || 'Includes dedicated local driver, vehicle fuel for designated circuit, and waiting.'}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-stone-500 italic">
                      The coordinator is currently obtaining the accurate quote directly from the driver syndicate. No prepayment required.
                    </p>
                  )}

                  {/* Customer Acceptance Button if Quoted */}
                  {booking.status === 'quoted' && (
                    <div className="mt-4 pt-4 border-t border-stone-200 flex flex-wrap items-center gap-3">
                      <button
                        onClick={handleAcceptQuote}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        Accept This Quote (৳ {booking.quotedAmount})
                      </button>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Discuss with Coordinator</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* Assigned Provider Info (If confirmed) */}
                {booking.assignedProviderName && (
                  <div className="p-4 rounded-xl border border-stone-200 bg-white text-xs space-y-1">
                    <span className="text-stone-500 font-semibold block uppercase tracking-wider text-[10px]">
                      Designated Provider / Syndicate
                    </span>
                    <span className="font-semibold text-stone-800 text-sm">
                      {booking.assignedProviderName}
                    </span>
                    <p className="text-stone-500">
                      Coordinated via Sreemangal Explorer Local Desk.
                    </p>
                  </div>
                )}

                {/* Direct Action */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-200 text-xs">
                  <span className="text-stone-500">
                    Need to change date or questions?
                  </span>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-semibold"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Local Coordinator</span>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-stone-400 mx-auto" />
              <h4 className="text-lg font-bold text-stone-800">No Booking Request Found</h4>
              <p className="text-stone-600 text-xs max-w-sm mx-auto">
                We could not find a request matching &quot;{refInput}&quot;. Please verify the reference from your confirmation screen or contact our local hotline.
              </p>
              <div className="pt-2">
                <a
                  href={`tel:${settings.supportPhone}`}
                  className="inline-flex items-center gap-1.5 text-xs text-[#123524] font-semibold underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {settings.supportPhone} for assistance</span>
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
