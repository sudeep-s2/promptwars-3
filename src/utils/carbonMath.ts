import { TransportMode, DietType, ActivityCategory, CarbonScore } from '../types';

// Deterministic coefficients (kg CO2 per unit)
export const COEFFICIENTS = {
  transport: {
    car: 0.192,       // kg CO2 per km
    bus: 0.089,       // kg CO2 per km
    train: 0.041,      // kg CO2 per km
    flight: 0.255,     // kg CO2 per km
    'walk-bike': 0.000 // kg CO2 per km
  },
  food: {
    'high-meat': 7.2,  // kg CO2 per day
    mixed: 5.6,        // kg CO2 per day
    vegetarian: 3.8,   // kg CO2 per day
    vegan: 2.9         // kg CO2 per day
  },
  electricity: {
    grid: 0.385        // kg CO2 per kWh
  },
  shopping: {
    clothing: 15.0,    // kg CO2 per item
    electronics: 80.0  // kg CO2 per item
  }
} as const;

// Global average footprints (kg CO2 per month) for single adult
export const BASELINES = {
  transport: 150,      // e.g., ~800km in average mixed transport
  food: 170,           // e.g., ~30 days of mixed diet
  electricity: 120,    // e.g., ~310 kWh of grid electricity
  shopping: 60         // e.g., 2 clothing items + 0.375 electronics items
} as const;

/**
 * Calculates emissions for a transport entry.
 */
export function calculateTransportCO2(mode: TransportMode, distanceKm: number): number {
  if (distanceKm < 0 || isNaN(distanceKm) || !isFinite(distanceKm)) return 0;
  return distanceKm * COEFFICIENTS.transport[mode];
}

/**
 * Calculates emissions for a food entry (quantity is number of days).
 */
export function calculateFoodCO2(diet: DietType, days: number): number {
  if (days < 0 || isNaN(days) || !isFinite(days)) return 0;
  return days * COEFFICIENTS.food[diet];
}

/**
 * Calculates emissions for electricity.
 */
export function calculateElectricityCO2(kwh: number): number {
  if (kwh < 0 || isNaN(kwh) || !isFinite(kwh)) return 0;
  return kwh * COEFFICIENTS.electricity.grid;
}

/**
 * Calculates emissions for shopping.
 */
export function calculateShoppingCO2(clothingItems: number, electronicsItems: number): number {
  const clothing = (clothingItems < 0 || isNaN(clothingItems) || !isFinite(clothingItems)) ? 0 : clothingItems;
  const electronics = (electronicsItems < 0 || isNaN(electronicsItems) || !isFinite(electronicsItems)) ? 0 : electronicsItems;
  return (clothing * COEFFICIENTS.shopping.clothing) + (electronics * COEFFICIENTS.shopping.electronics);
}

/**
 * Generic calculator helper for a log entry.
 */
export function calculateEntryCO2(
  category: ActivityCategory,
  subcategory: string,
  quantity: number,
  additionalQuantity: number = 0
): number {
  switch (category) {
    case 'transport':
      return calculateTransportCO2(subcategory as TransportMode, quantity);
    case 'food':
      return calculateFoodCO2(subcategory as DietType, quantity);
    case 'electricity':
      return calculateElectricityCO2(quantity);
    case 'shopping':
      return calculateShoppingCO2(quantity, additionalQuantity);
    default:
      return 0;
  }
}

/**
 * Calculates the overall Carbon Score (0 - 100, where higher is better / lower footprint).
 * Formula:
 * Score = 100 - ( (T_score * 0.35) + (F_score * 0.25) + (E_score * 0.20) + (S_score * 0.20) )
 * where category scores are: (MonthlyCategoryCO2 / Baseline) * 100
 */
export function calculateCarbonScore(
  monthlyTransportCO2: number,
  monthlyFoodCO2: number,
  monthlyElectricityCO2: number,
  monthlyShoppingCO2: number
): CarbonScore {
  // Normalize against baselines (cap individual category ratios to prevent extreme values from distorting everything)
  const normTransport = Math.min(250, (monthlyTransportCO2 / BASELINES.transport) * 100);
  const normFood = Math.min(250, (monthlyFoodCO2 / BASELINES.food) * 100);
  const normElectricity = Math.min(250, (monthlyElectricityCO2 / BASELINES.electricity) * 100);
  const normShopping = Math.min(250, (monthlyShoppingCO2 / BASELINES.shopping) * 100);

  const weightedSum = (
    (normTransport * 0.35) +
    (normFood * 0.25) +
    (normElectricity * 0.20) +
    (normShopping * 0.20)
  );

  // Score is 100 - weighted footprint index. Capped between 0 and 100.
  const scoreTotal = Math.max(0, Math.min(100, Math.round(100 - weightedSum)));

  const totalCO2 = monthlyTransportCO2 + monthlyFoodCO2 + monthlyElectricityCO2 + monthlyShoppingCO2;
  
  if (totalCO2 === 0) {
    return {
      total: 100,
      transportPct: 0,
      foodPct: 0,
      electricityPct: 0,
      shoppingPct: 0
    };
  }

  return {
    total: scoreTotal,
    transportPct: Math.round((monthlyTransportCO2 / totalCO2) * 100),
    foodPct: Math.round((monthlyFoodCO2 / totalCO2) * 100),
    electricityPct: Math.round((monthlyElectricityCO2 / totalCO2) * 100),
    shoppingPct: Math.round((monthlyShoppingCO2 / totalCO2) * 100)
  };
}
