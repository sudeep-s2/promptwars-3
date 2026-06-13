import { BASELINES, COEFFICIENTS, SCORE_CATEGORY_RATIO_CAP, SCORE_WEIGHTS } from '../constants/carbonConstants';
import { DIET_OPTIONS, TRANSPORT_MODES } from '../constants/options';
import { TransportMode, DietType, ActivityCategory, CarbonScore } from '../types';


export function isTransportMode(value: string): value is TransportMode {
  return TRANSPORT_MODES.some(mode => mode === value);
}

export function isDietType(value: string): value is DietType {
  return DIET_OPTIONS.some(diet => diet === value);
}

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
      return isTransportMode(subcategory) ? calculateTransportCO2(subcategory, quantity) : 0;
    case 'food':
      return isDietType(subcategory) ? calculateFoodCO2(subcategory, quantity) : 0;
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
  const normTransport = Math.min(SCORE_CATEGORY_RATIO_CAP, (monthlyTransportCO2 / BASELINES.transport) * 100);
  const normFood = Math.min(SCORE_CATEGORY_RATIO_CAP, (monthlyFoodCO2 / BASELINES.food) * 100);
  const normElectricity = Math.min(SCORE_CATEGORY_RATIO_CAP, (monthlyElectricityCO2 / BASELINES.electricity) * 100);
  const normShopping = Math.min(SCORE_CATEGORY_RATIO_CAP, (monthlyShoppingCO2 / BASELINES.shopping) * 100);

  const weightedSum = (
    (normTransport * SCORE_WEIGHTS.transport) +
    (normFood * SCORE_WEIGHTS.food) +
    (normElectricity * SCORE_WEIGHTS.electricity) +
    (normShopping * SCORE_WEIGHTS.shopping)
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
