import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  Users,
  MapPin,
  Car,
  UserCheck,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Copy,
  Check,
} from 'lucide-react';
import { db, Vehicle, Guide } from '../lib/db';
import {
  validateBookingRequest,
  generateBookingReference,
  generateWhatsAppLink,
} from '../lib/bookingLogic';

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  preselected?: {
    type: 'transport' | 'guide';
    id?: string;
    name?: string;
  };
  onSuccessCreated?: (reference: string) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  isOpen,
  onClose,
  preselected,
  onSuccessCreated,
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  // Form State
  const [serviceType, setServiceType] = useState<'transport' | 'guide'>(
    preselected?.type || 'transport'
  );
  const [vehicleId, setVehicleId] = useState(preselected?.type === 'transport' ? preselected.id || '' : '');
  const [guideId, setGuideId] = useState(preselected?.type === 'guide' ? preselected.id || '' : '');
  const [requestedDate, setRequestedDate] = useState('');
  const [requestedStartTime, setRequestedStartTime] = useState('08:30 AM');
  const [groupSize, setGroupSize] = useState<number>(2);
  const [pickupLocation, setPickupLocation] = useState('');
  const [itineraryDetails, setItineraryDetails] = useState('');
  const [requestedDuration, setRequestedDuration] = useState('Full Day (8-9 hours)');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [consentAcknowledged, setConsentAcknowledged] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Submitted success reference
  const [createdRef, setCreatedRef] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setVehicles(db.getVehicles(true));
      setGuides(db.getGuides(true));
      setCreatedRef(null);
      setErrors({});

      if (preselected) {
        setServiceType(preselected.type);
        if (preselected.type === 'transport' && preselected.id) {
          setVehicleId(preselected.id);
        } else if (preselected.type === 'guide' && preselected.id) {
          setGuideId(preselected.id);
        }
      }

      // Default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setRequestedDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [isOpen, preselected]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // 1. Validate fields with business rules
    const validation = validateBookingRequest({
      customerName,
      customerPhone,
      requestedDate,
      groupSize,
      pickupLocation,
      serviceType,
    });

    if (!consentAcknowledged) {
      validation.errors.consent = 'You must acknowledge the terms to submit a request.';
      validation.valid = false;
    }

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setSubmitting(true);

    try {
      // 2. Generate unpredictable public reference
      const publicReference = generateBookingReference();

      // Find selected vehicle or guide info
      const selectedVehicle = vehicles.find((v) => v.id === vehicleId);
      const selectedGuide = guides.find((g) => g.id === guideId);

      const assignedProviderId =
        serviceType === 'transport'
          ? selectedVehicle?.providerId
          : selectedGuide?.providerId;
      const assignedProviderName =
        serviceType === 'transport'
          ? selectedVehicle?.providerName
          : 'Sylhet Eco Naturalist Guild';

      // 3. Save to database
      const newBooking = db.createBooking({
        publicReference,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        serviceType,
        vehicleId: serviceType === 'transport' ? vehicleId || undefined : undefined,
        vehicleName: serviceType === 'transport' ? selectedVehicle?.name : undefined,
        guideId: serviceType === 'guide' ? guideId || undefined : undefined,
        guideName: serviceType === 'guide' ? selectedGuide?.name : undefined,
        requestedDate,
        requestedStartTime,
        groupSize,
        pickupLocation: pickupLocation.trim(),
        itineraryDetails: itineraryDetails.trim() || 'Standard Sreemangal Circuit',
        requestedDuration,
        customerNotes: customerNotes.trim() || undefined,
        status: 'new',
        assignedProviderId,
        assignedProviderName,
        quotedAmount:
          serviceType === 'transport'
            ? selectedVehicle?.indicativePrice
            : selectedGuide?.indicativePrice,
        currency: 'BDT',
        quoteDetails: 'Pending provider availability confirmation.',
        commissionType: 'percentage',
        agreedCommissionValue: 10,
        commissionPaymentStatus: 'pending',
      });

      setCreatedRef(publicReference);
      if (onSuccessCreated) {
        onSuccessCreated(publicReference);
      }
    } catch (err) {
      console.error(err);
      setErrors({ form: 'An unexpected error occurred while saving your request. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const copyRefToClipboard = () => {
    if (createdRef) {
      navigator.clipboard.writeText(createdRef);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const settings = db.getSettings();
  const whatsappUrl = createdRef
    ? generateWhatsAppLink(settings.whatsappNumber, {
        reference: createdRef,
        itemTitle:
          serviceType === 'transport'
            ? vehicles.find((v) => v.id === vehicleId)?.name || 'Transport'
            : guides.find((g) => g.id === guideId)?.name || 'Guide',
        date: requestedDate,
        groupSize,
        pickup: pickupLocation,
      })
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#123524] text-white px-6 py-5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight">Request a Booking</h3>
            <p className="text-xs text-stone-300 mt-0.5">
              Zero-obligation inquiry · Local coordinator verifies availability before payment
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {createdRef ? (
            /* Success State */
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-700">
                <CheckCircle className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-[#18201b]">Request Submitted Successfully!</h4>
                <p className="text-stone-600 text-sm mt-1 max-w-md mx-auto">
                  Our local Sreemangal coordinator is checking vehicle and driver availability for your requested date.
                </p>
              </div>

              {/* Reference Card */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 max-w-md mx-auto">
                <div className="text-xs uppercase tracking-wider text-stone-500 font-semibold mb-1">
                  Your Booking Reference
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-xl font-bold text-[#123524] tracking-wider">
                    {createdRef}
                  </span>
                  <button
                    onClick={copyRefToClipboard}
                    className="p-1.5 rounded hover:bg-stone-200 text-stone-600 transition-colors"
                    title="Copy reference"
                  >
                    {copiedRef ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-stone-500 mt-1.5">
                  Save this reference code to track your quote in the Track Booking tab.
                </p>
              </div>

              {/* Next Steps Card */}
              <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 text-left max-w-md mx-auto text-xs text-amber-900 space-y-1.5">
                <p className="font-semibold text-amber-950">Next Steps & Coordination:</p>
                <p>1. We verify driver schedules with the syndicate.</p>
                <p>2. You will receive an SMS or WhatsApp quote confirmation.</p>
                <p>3. Once you accept the transparent price, the booking becomes confirmed.</p>
              </div>

              {/* WhatsApp CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Speed up via WhatsApp</span>
                </a>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-medium text-sm transition-colors"
                >
                  Close & Continue Browsing
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {errors.form && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.form}</span>
                </div>
              )}

              {/* Service Type Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                  1. What service do you need?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setServiceType('transport');
                      setGuideId('');
                    }}
                    className={`py-3 px-4 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                      serviceType === 'transport'
                        ? 'border-[#123524] bg-[#123524]/5 text-[#123524] ring-1 ring-[#123524]'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <Car className="w-4 h-4 text-emerald-700" />
                    <span>Vehicle / Transport</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setServiceType('guide');
                      setVehicleId('');
                    }}
                    className={`py-3 px-4 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                      serviceType === 'guide'
                        ? 'border-[#123524] bg-[#123524]/5 text-[#123524] ring-1 ring-[#123524]'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 text-emerald-700" />
                    <span>Local Guide</span>
                  </button>
                </div>
              </div>

              {/* Specific Vehicle or Guide dropdown */}
              {serviceType === 'transport' ? (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Select Vehicle (or any suitable)
                  </label>
                  <select
                    value={vehicleId}
                    onChange={(e) => setVehicleId(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123524]"
                  >
                    <option value="">Any suitable vehicle (Coordinator will suggest)</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} (Max {v.passengerCapacity} pax · Indicative ৳{v.indicativePrice})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Select Guide (or any verified naturalist)
                  </label>
                  <select
                    value={guideId}
                    onChange={(e) => setGuideId(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123524]"
                  >
                    <option value="">Any verified naturalist or cultural guide</option>
                    {guides.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name} · {g.specialties.join(', ')}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Trip Schedule & Group Size */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-500" />
                    <span>Trip Date *</span>
                  </label>
                  <input
                    type="date"
                    value={requestedDate}
                    onChange={(e) => setRequestedDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123524]"
                  />
                  {errors.requestedDate && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.requestedDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-500" />
                    <span>Start Time</span>
                  </label>
                  <input
                    type="text"
                    value={requestedStartTime}
                    onChange={(e) => setRequestedStartTime(e.target.value)}
                    placeholder="e.g. 08:30 AM"
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123524]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-stone-500" />
                    <span>Passengers / Pax *</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={groupSize}
                    onChange={(e) => setGroupSize(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123524]"
                  />
                  {errors.groupSize && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.groupSize}</p>
                  )}
                </div>
              </div>

              {/* Pickup & Itinerary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-500" />
                    <span>Pickup Location *</span>
                  </label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="e.g. Grand Sultan Gate, or Sreemangal Station"
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123524]"
                  />
                  {errors.pickupLocation && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.pickupLocation}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Duration
                  </label>
                  <select
                    value={requestedDuration}
                    onChange={(e) => setRequestedDuration(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123524]"
                  >
                    <option value="Full Day (8-9 hours)">Full Day (8-9 hours)</option>
                    <option value="Half Day (4 hours)">Half Day (4 hours)</option>
                    <option value="Multi-day (2 Days)">Multi-day (2 Days)</option>
                    <option value="Point-to-point transfer">Point-to-point transfer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Intended Places / Route
                </label>
                <input
                  type="text"
                  value={itineraryDetails}
                  onChange={(e) => setItineraryDetails(e.target.value)}
                  placeholder="e.g. Lawachara, Manipuri Village, Madhabpur Lake"
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123524]"
                />
              </div>

              {/* Customer Contact */}
              <div className="border-t border-stone-200 pt-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-3">
                  2. Your Contact Information
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Tanvir Chowdhury"
                      className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123524]"
                    />
                    {errors.customerName && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.customerName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Phone Number (BD Mobile) *
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 01712345678"
                      className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123524]"
                    />
                    {errors.customerPhone && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.customerPhone}</p>
                    )}
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. tanvir@example.com"
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123524]"
                  />
                </div>

                <div className="mt-3">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Special Requests or Notes
                  </label>
                  <textarea
                    rows={2}
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="e.g. We have children; need roof luggage rack; prefer early morning 6am start..."
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123524]"
                  ></textarea>
                </div>
              </div>

              {/* Consent & Honest Terms Acknowledgement */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentAcknowledged}
                    onChange={(e) => setConsentAcknowledged(e.target.checked)}
                    className="mt-0.5 rounded border-stone-300 text-[#123524] focus:ring-[#123524]"
                  />
                  <span className="text-xs text-stone-600 leading-normal">
                    I understand this is a booking request, not an instant reservation. A local coordinator will contact me by phone/WhatsApp to confirm provider availability and exact quoted fare before any commitment.
                  </span>
                </label>
                {errors.consent && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.consent}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#123524] hover:bg-[#1a4933] text-white text-sm font-semibold rounded-xl shadow-sm transition-all focus:ring-2 focus:ring-[#123524] disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Send Booking Request'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
