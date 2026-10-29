import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateBookingReference,
  isValidBookingReference,
  isValidBDPhone,
  normalizePhoneForWhatsApp,
  validateBookingRequest,
  canTransitionStatus,
  calculateCommission,
  generateWhatsAppLink,
} from './bookingLogic';

test('generateBookingReference creates unpredictable uppercase references', () => {
  const ref1 = generateBookingReference();
  const ref2 = generateBookingReference();
  assert.notEqual(ref1, ref2);
  assert.equal(isValidBookingReference(ref1), true);
  assert.equal(isValidBookingReference(ref2), true);
  assert.equal(isValidBookingReference('INVALID-REF'), false);
  assert.equal(isValidBookingReference('SRE-0000-0000'), false); // 0 is excluded to avoid ambiguity
});

test('isValidBDPhone validates various Bangladeshi phone number formats', () => {
  assert.equal(isValidBDPhone('01712345678'), true);
  assert.equal(isValidBDPhone('+8801812345678'), true);
  assert.equal(isValidBDPhone('8801912345678'), true);
  assert.equal(isValidBDPhone('01300000000'), true);
  assert.equal(isValidBDPhone('01600000000'), true);
  assert.equal(isValidBDPhone('01500000000'), true);

  // Invalid numbers
  assert.equal(isValidBDPhone('12345'), false);
  assert.equal(isValidBDPhone('01212345678'), false); // 012 is not a valid BD operator prefix
  assert.equal(isValidBDPhone('abcdefghijk'), false);
});

test('normalizePhoneForWhatsApp normalizes to international 880 format', () => {
  assert.equal(normalizePhoneForWhatsApp('01712345678'), '8801712345678');
  assert.equal(normalizePhoneForWhatsApp('+8801712345678'), '8801712345678');
  assert.equal(normalizePhoneForWhatsApp('8801712345678'), '8801712345678');
});

test('validateBookingRequest enforces required fields and rejects invalid data', () => {
  const invalid = validateBookingRequest({
    customerName: '',
    customerPhone: 'bad-phone',
    requestedDate: '2020-01-01', // in past
    groupSize: 0,
    pickupLocation: '',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.customerName);
  assert.ok(invalid.errors.customerPhone);
  assert.ok(invalid.errors.requestedDate);
  assert.ok(invalid.errors.groupSize);
  assert.ok(invalid.errors.pickupLocation);

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 5);
  const dateStr = futureDate.toISOString().split('T')[0];

  const valid = validateBookingRequest({
    customerName: 'Tanvir Hossain',
    customerPhone: '01712345678',
    requestedDate: dateStr,
    groupSize: 4,
    pickupLocation: 'Sreemangal Railway Station',
    serviceType: 'transport',
  });
  assert.equal(valid.valid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('canTransitionStatus strictly checks provider confirmation & customer acceptance for confirmed state', () => {
  // From awaiting_customer to confirmed without provider approval
  const unapproved = canTransitionStatus('awaiting_customer', 'confirmed', {
    providerConfirmed: false,
    customerAccepted: true,
  });
  assert.equal(unapproved.allowed, false);

  // Without customer acceptance
  const unaccepted = canTransitionStatus('awaiting_customer', 'confirmed', {
    providerConfirmed: true,
    customerAccepted: false,
  });
  assert.equal(unaccepted.allowed, false);

  // Both approved
  const approved = canTransitionStatus('awaiting_customer', 'confirmed', {
    providerConfirmed: true,
    customerAccepted: true,
  });
  assert.equal(approved.allowed, true);

  // Illegal transition: new directly to completed
  const illegal = canTransitionStatus('new', 'completed');
  assert.equal(illegal.allowed, false);
});

test('calculateCommission calculates percentage and fixed commissions with proper rounding', () => {
  // 10% of 3500 BDT
  assert.equal(calculateCommission(3500, 'percentage', 10), 350);
  // 12.5% of 2500 BDT = 312.5 -> rounds to 313
  assert.equal(calculateCommission(2500, 'percentage', 12.5), 313);
  // Fixed 500 BDT
  assert.equal(calculateCommission(4000, 'fixed', 500), 500);
  // Zero quote
  assert.equal(calculateCommission(0, 'percentage', 10), 0);
});

test('generateWhatsAppLink creates properly encoded URL', () => {
  const link = generateWhatsAppLink('01711002233', {
    reference: 'SRE-ABC2-XYZ3',
    itemTitle: 'Chander Gari 4x4',
    date: '2026-11-15',
  });
  assert.ok(link.startsWith('https://wa.me/8801711002233?text='));
  assert.ok(link.includes('SRE-ABC2-XYZ3'));
  assert.ok(link.includes('Chander%20Gari%204x4'));
});
