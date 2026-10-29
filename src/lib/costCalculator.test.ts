import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTripBudget } from './costCalculator';

test('calculateTripBudget calculates 1-day budget for solo traveler on CNG', () => {
  const budget = calculateTripBudget({
    days: 1,
    groupSize: 1,
    accommodationTier: 'none',
    transportType: 'cng',
    foodTier: 'popular_restaurants',
    includeGuide: false,
    transitFromDhaka: false,
  });

  assert.ok(budget.totalBDT > 0);
  assert.equal(budget.totalBDT, budget.perPersonBDT);
  // Local transport 1500 + Food 600 + Entry 80 = 2180 BDT
  assert.equal(budget.totalBDT, 2180);
});

test('calculateTripBudget splits vehicle cost correctly across group of 4', () => {
  const budget = calculateTripBudget({
    days: 2,
    groupSize: 4,
    accommodationTier: 'budget', // 2 rooms * 1 night * 1200 = 2400
    transportType: 'cng', // 1 CNG * 2 days * 1500 = 3000
    foodTier: 'street_local', // 300 * 4 pax * 2 days = 2400
    includeGuide: false,
    transitFromDhaka: false,
  });

  // Total: 3000 (CNG) + 2400 (Stay) + 2400 (Food) + 640 (Entry) = 8440 BDT
  assert.equal(budget.totalBDT, 8440);
  assert.equal(budget.perPersonBDT, 2110);
});

test('calculateTripBudget adds guide cost when requested', () => {
  const withoutGuide = calculateTripBudget({
    days: 1,
    groupSize: 2,
    accommodationTier: 'none',
    transportType: 'cng',
    foodTier: 'popular_restaurants',
    includeGuide: false,
    transitFromDhaka: false,
  });

  const withGuide = calculateTripBudget({
    days: 1,
    groupSize: 2,
    accommodationTier: 'none',
    transportType: 'cng',
    foodTier: 'popular_restaurants',
    includeGuide: true,
    transitFromDhaka: false,
  });

  assert.equal(withGuide.totalBDT - withoutGuide.totalBDT, 1500);
});
