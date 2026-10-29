/**
 * Travel Cost Estimator & Budget Engine for Sreemangal, Bangladesh
 * Calculates realistic, transparent trip budgets based on verified local market rates.
 */

export interface BudgetInput {
  days: number; // 1, 2, 3, or 4
  groupSize: number; // 1 to 20
  accommodationTier: 'none' | 'budget' | 'comfort' | 'luxury';
  transportType: 'cng' | 'chander_gari' | 'microbus' | 'bicycle' | 'none';
  foodTier: 'street_local' | 'popular_restaurants' | 'resort_dining';
  includeGuide: boolean;
  transitFromDhaka: boolean;
}

export interface BudgetBreakdown {
  totalBDT: number;
  perPersonBDT: number;
  items: {
    category: string;
    description: string;
    costBDT: number;
  }[];
  localSavingTips: string[];
}

export function calculateTripBudget(input: BudgetInput): BudgetBreakdown {
  const days = Math.max(1, Math.min(input.days || 1, 7));
  const pax = Math.max(1, Math.min(input.groupSize || 1, 30));
  const nights = Math.max(0, days - 1);

  const items: { category: string; description: string; costBDT: number }[] = [];
  const tips: string[] = [];

  // 1. Inter-City Transit (Dhaka / Sylhet train Shovon Chair / Snigdha approx)
  if (input.transitFromDhaka) {
    // Train Shovon Chair is approx 265 BDT each way per person; roundtrip 530 BDT
    const roundtripTrainPerPerson = 550;
    const transitCost = roundtripTrainPerPerson * pax;
    items.push({
      category: 'Inter-City Transit',
      description: `Dhaka ⇄ Sreemangal train roundtrip (Shovon Chair @ ৳550 × ${pax} pax)`,
      costBDT: transitCost,
    });
    tips.push('Book Parabat Express or Kalni Express 10 days in advance via the Bangladesh Railway e-ticket portal.');
  }

  // 2. Local Vehicle & Transport in Sreemangal
  let dailyTransportCost = 0;
  let transportLabel = '';
  switch (input.transportType) {
    case 'cng':
      // 1 CNG holds up to 4 pax, approx 1,500 BDT/day
      const cngCount = Math.ceil(pax / 4);
      dailyTransportCost = cngCount * 1500;
      transportLabel = `${cngCount} × Green CNG 3-Wheeler (Max 4 pax each @ ৳1,500/day)`;
      break;
    case 'chander_gari':
      // 1 Chander Gari holds up to 10-12 pax, approx 3,800 BDT/day
      const jeepCount = Math.ceil(pax / 10);
      dailyTransportCost = jeepCount * 3800;
      transportLabel = `${jeepCount} × 4x4 Chander Gari Mountain Rover (@ ৳3,800/day)`;
      break;
    case 'microbus':
      // AC HiAce microbus approx 5,500 BDT/day
      const busCount = Math.ceil(pax / 11);
      dailyTransportCost = busCount * 5500;
      transportLabel = `${busCount} × Toyota HiAce AC Microbus (@ ৳5,500/day)`;
      break;
    case 'bicycle':
      dailyTransportCost = pax * 400;
      transportLabel = `Mountain Bicycle rental (@ ৳400/day × ${pax} pax)`;
      tips.push('Cycle early morning (06:30 AM) through Finlay tea gardens when roads are cool and mist-covered.');
      break;
    case 'none':
    default:
      dailyTransportCost = 0;
      transportLabel = 'Walking / Personal arrangement';
      break;
  }

  const totalTransport = dailyTransportCost * days;
  if (totalTransport > 0) {
    items.push({
      category: 'Local Transport',
      description: `${transportLabel} for ${days} day(s)`,
      costBDT: totalTransport,
    });
    if (input.transportType === 'cng' || input.transportType === 'chander_gari') {
      tips.push('Negotiate standard circuit prices directly with drivers at Habiganj Road or Station Stand using our benchmark rates.');
    }
  }

  // 3. Accommodation / Night Stay
  if (nights > 0 && input.accommodationTier !== 'none') {
    let pricePerRoomNight = 1200;
    let roomType = 'Budget Hotel';

    if (input.accommodationTier === 'budget') {
      pricePerRoomNight = 1200; // standard clean non-AC hotel near Station Road
      roomType = 'Clean Budget Hotel (e.g. Hotel Tea Town, Sandhya)';
    } else if (input.accommodationTier === 'comfort') {
      pricePerRoomNight = 3500; // comfortable cottage / eco-resort (Shanti Bari, Tea Resort)
      roomType = 'Comfort Eco-Resort / AC Cottage (e.g. Shanti Bari, Green Leaf)';
    } else if (input.accommodationTier === 'luxury') {
      pricePerRoomNight = 11000; // luxury resort (Grand Sultan, Novem Eco Resort)
      roomType = 'Luxury Heritage Resort (e.g. Grand Sultan, Novem Eco)';
    }

    // Assume 2 adults per room
    const roomsNeeded = Math.ceil(pax / 2);
    const totalStay = roomsNeeded * pricePerRoomNight * nights;
    items.push({
      category: 'Accommodation',
      description: `${roomsNeeded} room(s) × ${nights} night(s) in ${roomType}`,
      costBDT: totalStay,
    });
  }

  // 4. Food & Dining
  let dailyFoodPerPerson = 350;
  let foodDesc = 'Local eateries (Panshi, Kutum Bari, local bhorta & fish)';

  if (input.foodTier === 'street_local') {
    dailyFoodPerPerson = 300;
    foodDesc = 'Budget bazaar diners (Paratha breakfast, fish bhorta lunch, cha stalls)';
  } else if (input.foodTier === 'popular_restaurants') {
    dailyFoodPerPerson = 600;
    foodDesc = 'Popular spots (Panshi fish feast, Kutum Bari duck curry, 7-layer tea)';
    tips.push('Try the 15+ fresh freshwater fish bhortas at Panshi or Kutum Bari on Station Road.');
  } else if (input.foodTier === 'resort_dining') {
    dailyFoodPerPerson = 1400;
    foodDesc = 'Full-board resort restaurants & multi-course dinners';
  }

  const totalFood = dailyFoodPerPerson * pax * days;
  items.push({
    category: 'Food & Tea',
    description: `${foodDesc} (@ ৳${dailyFoodPerPerson}/day × ${pax} pax × ${days} days)`,
    costBDT: totalFood,
  });

  // 5. Entry & Forest Fees
  // Approx: Lawachara ~৳115, Baikka Beel ~৳30, Madhabpur ~৳20 = ~৳165 per person for main sites
  const entryFeePerPerson = Math.min(250, 80 * days);
  const totalEntry = entryFeePerPerson * pax;
  items.push({
    category: 'Entry & Forest Fees',
    description: `National park & sanctuary government gate fees (~৳${entryFeePerPerson} per person total)`,
    costBDT: totalEntry,
  });

  // 6. Naturalist Guide (Optional)
  if (input.includeGuide) {
    const guidePerDay = 1500;
    const totalGuide = guidePerDay * days;
    items.push({
      category: 'Certified Guide',
      description: `Forest Department trained naturalist guide (@ ৳1,500/day × ${days} days)`,
      costBDT: totalGuide,
    });
    tips.push('A licensed guide is strongly recommended for the 3-hour deep trail in Lawachara to spot Western Hoolock Gibbons.');
  }

  // Sum total
  const totalBDT = items.reduce((sum, item) => sum + item.costBDT, 0);
  const perPersonBDT = Math.round(totalBDT / pax);

  tips.push('Carry sufficient cash: many rural tea garden stalls and entry gates do not accept cards or mobile payments.');

  return {
    totalBDT,
    perPersonBDT,
    items,
    localSavingTips: Array.from(new Set(tips)),
  };
}
