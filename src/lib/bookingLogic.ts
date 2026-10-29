/**
 * Core business rules and validation logic for Sreemangal Explorer
 */

export type BookingStatus =
  | 'new'
  | 'reviewing'
  | 'awaiting_provider'
  | 'quoted'
  | 'awaiting_customer'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export type CommissionType = 'percentage' | 'fixed';

export interface BookingValidationInput {
  customerName: string;
  customerPhone: string;
  requestedDate: string;
  groupSize: number;
  pickupLocation: string;
  serviceType: 'transport' | 'guide';
}

/**
 * Generate a cryptographically unguessable, human-readable booking reference
 * Format: SRE-XXXX-XXXX (e.g. SRE-9K2M-7B3P)
 */
export function generateBookingReference(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Removed ambiguous 0, 1, I, O
  let part1 = '';
  let part2 = '';
  for (let i = 0; i < 4; i++) {
    part1 += chars.charAt(Math.floor(Math.random() * chars.length));
    part2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SRE-${part1}-${part2}`;
}

export function isValidBookingReference(ref: string): boolean {
  return /^SRE-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}$/.test(ref);
}

/**
 * Validate Bangladesh phone numbers
 * Accepts: 01712345678, +8801712345678, 8801712345678, with optional spaces or dashes
 */
export function isValidBDPhone(phone: string): boolean {
  if (!phone) return false;
  const clean = phone.replace(/[\s-]/g, '');
  // Format: 01[3-9]xxxxxxxx (11 digits) or +8801[3-9]xxxxxxxx (14 chars) or 8801[3-9]xxxxxxxx (13 chars)
  const regex = /^(?:\+?880|0)1[3-9]\d{8}$/;
  return regex.test(clean);
}

/**
 * Format Bangladesh phone number to normalized international format for WhatsApp wa.me links
 * e.g. "01712345678" -> "8801712345678"
 */
export function normalizePhoneForWhatsApp(phone: string): string {
  const clean = phone.replace(/[\s+()-]/g, '');
  if (clean.startsWith('880')) {
    return clean;
  }
  if (clean.startsWith('0')) {
    return '88' + clean;
  }
  return clean;
}

/**
 * Validate customer booking request form data
 */
export function validateBookingRequest(input: Partial<BookingValidationInput>): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!input.customerName || input.customerName.trim().length < 2) {
    errors.customerName = 'Please enter your full name (at least 2 characters).';
  }

  if (!input.customerPhone || !isValidBDPhone(input.customerPhone)) {
    errors.customerPhone = 'Please provide a valid Bangladeshi phone number (e.g., 017XXXXXXXX).';
  }

  if (!input.requestedDate) {
    errors.requestedDate = 'Please select a date for your trip.';
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateObj = new Date(input.requestedDate);
    if (isNaN(dateObj.getTime())) {
      errors.requestedDate = 'Invalid date format.';
    } else if (dateObj < today) {
      errors.requestedDate = 'Trip date cannot be in the past.';
    }
  }

  if (!input.groupSize || input.groupSize < 1 || input.groupSize > 50) {
    errors.groupSize = 'Group size must be between 1 and 50 passengers.';
  }

  if (!input.pickupLocation || input.pickupLocation.trim().length < 3) {
    errors.pickupLocation = 'Please specify a pickup location in or near Sreemangal.';
  }

  if (!input.serviceType || (input.serviceType !== 'transport' && input.serviceType !== 'guide')) {
    errors.serviceType = 'Please select a service type.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Allowed booking state transitions
 */
export const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  new: ['reviewing', 'cancelled', 'rejected'],
  reviewing: ['awaiting_provider', 'cancelled', 'rejected'],
  awaiting_provider: ['quoted', 'reviewing', 'cancelled', 'rejected'],
  quoted: ['awaiting_customer', 'reviewing', 'cancelled'],
  awaiting_customer: ['confirmed', 'reviewing', 'cancelled', 'rejected'],
  confirmed: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
  rejected: [],
};

export function canTransitionStatus(
  currentStatus: BookingStatus,
  nextStatus: BookingStatus,
  conditions?: {
    providerConfirmed?: boolean;
    customerAccepted?: boolean;
    hasQuotedAmount?: boolean;
  }
): { allowed: boolean; reason?: string } {
  if (currentStatus === nextStatus) {
    return { allowed: true };
  }

  const allowedNext = ALLOWED_TRANSITIONS[currentStatus] || [];
  if (!allowedNext.includes(nextStatus)) {
    return {
      allowed: false,
      reason: `Cannot transition status from '${currentStatus}' to '${nextStatus}'.`,
    };
  }

  // Strict acceptance criteria #10: A booking cannot become confirmed without provider confirmation and customer acceptance
  if (nextStatus === 'confirmed') {
    if (!conditions?.providerConfirmed) {
      return {
        allowed: false,
        reason: 'Provider must confirm vehicle/guide availability before confirming booking.',
      };
    }
    if (!conditions?.customerAccepted) {
      return {
        allowed: false,
        reason: 'Customer must accept the quoted rate before confirming booking.',
      };
    }
  }

  if (nextStatus === 'quoted' && conditions && !conditions.hasQuotedAmount) {
    return {
      allowed: false,
      reason: 'Quote amount is required before moving to quoted state.',
    };
  }

  return { allowed: true };
}

/**
 * Calculate agreed commission
 */
export function calculateCommission(
  quoteAmount: number,
  commissionType: CommissionType = 'percentage',
  commissionValue: number = 10
): number {
  if (quoteAmount <= 0) return 0;
  if (commissionValue <= 0) return 0;

  if (commissionType === 'percentage') {
    // Round to nearest integer BDT
    return Math.round((quoteAmount * commissionValue) / 100);
  } else {
    // Fixed amount
    return Math.min(Math.round(commissionValue), quoteAmount);
  }
}

/**
 * Generate a WhatsApp inquiry click link
 */
export function generateWhatsAppLink(
  supportPhone: string,
  params: {
    reference?: string;
    itemTitle?: string;
    date?: string;
    groupSize?: number;
    pickup?: string;
  }
): string {
  const normalizedPhone = normalizePhoneForWhatsApp(supportPhone);
  if (!normalizedPhone) return '';

  let message = `Hello Sreemangal Explorer! I would like to inquire about a booking.`;
  if (params.reference) {
    message += `\nReference: ${params.reference}`;
  }
  if (params.itemTitle) {
    message += `\nService/Vehicle: ${params.itemTitle}`;
  }
  if (params.date) {
    message += `\nDate: ${params.date}`;
  }
  if (params.groupSize) {
    message += `\nGroup Size: ${params.groupSize} person(s)`;
  }
  if (params.pickup) {
    message += `\nPickup: ${params.pickup}`;
  }

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}
