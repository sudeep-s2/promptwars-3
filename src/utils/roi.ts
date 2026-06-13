import { Recommendation, ActivityEntry, DietType } from '../types';
import { COEFFICIENTS, LIFESTYLE_COSTS } from '../constants/carbonConstants';

// ROI model parameters — savings-per-unit multipliers used in recommendation calculations
const CAR_TO_TRAIN_SAVING_PER_KM = 0.08;  // $/km fuel + maintenance saved vs train
const CAR_TO_BUS_SAVING_PER_KM  = 0.06;  // $/km fuel + maintenance saved vs bus
const ELECTRICITY_SAVING_PER_KWH = 0.12; // $/kWh grid savings (utility rate delta)

/**
 * Computes the impact score for a recommendation.
 * Formula:
 * impactScore = (monthlyCarbonSavingKg × 1.5) + (monthlyFinancialSavingUSD × 0.5) - (difficultyPenalty × 10)
 */
export function calculateImpactScore(
  carbonSaving: number,
  financialSaving: number,
  difficultyPenalty: number
): number {
  return (carbonSaving * 1.5) + (financialSaving * 0.5) - (difficultyPenalty * 10);
}

/**
 * Generates tailored recommendations based on logged activities (or baselines as fallback).
 */
export function generateRecommendations(entries: ActivityEntry[]): Recommendation[] {
  // Aggregate monthly averages from entries or fall back to baselines
  // We look at entries in the last 30 days, or just aggregate all entries and project to monthly
  
  // Group emissions by category
  let transportCO2 = 0;
  let carKm = 0;
  let currentDiet: DietType = 'mixed';
  let electricityKwh = 0;

  // Simple aggregation: sum all values in entries. If empty, we use baseline equivalents.
  if (entries.length > 0) {
    entries.forEach(entry => {
      if (entry.category === 'transport') {
        transportCO2 += entry.kgCO2;
        if (entry.subcategory === 'car') {
          carKm += entry.quantity;
        }
      } else if (entry.category === 'food') {
        currentDiet = entry.subcategory;
      } else if (entry.category === 'electricity') {
        electricityKwh += entry.quantity;
      }
    });

    // If total entries cover a span, we should project to 30 days. For simplicity of dashboard/ROI,
    // if logs exist, we treat them as representative of a month's behavior (or scale it).
    // Let's ensure non-zero values for categories with no logs by defaulting to a small portion of baseline
    if (carKm === 0 && transportCO2 === 0) carKm = 400; // default 400km if no transport logs
    if (electricityKwh === 0) electricityKwh = 150; // default 150kWh if no electricity logs
  } else {
    // Fallback values representing a high-carbon average user to make simulator/recommendations interesting
    carKm = 600; // km per month
    currentDiet = 'high-meat';
    electricityKwh = 300; // kWh per month
  }

  const recs: Recommendation[] = [];

  // 1. Car to Train Commute
  if (carKm > 0) {
    const shiftKm = carKm * 0.3; // Shift 30% of driving
    const carbonSaving = shiftKm * (COEFFICIENTS.transport.car - COEFFICIENTS.transport.train);
    const financialSaving = shiftKm * CAR_TO_TRAIN_SAVING_PER_KM;
    const difficulty = 4;
    recs.push({
      id: 'car-to-train',
      title: 'Shift Commutes to Train',
      description: `Replace 30% of your car travel (${Math.round(shiftKm)} km/month) with train commutes.`,
      monthlyCarbonSavingKg: Math.round(carbonSaving * 10) / 10,
      monthlyFinancialSavingUSD: Math.round(financialSaving),
      difficultyPenalty: difficulty,
      impactScore: Math.round(calculateImpactScore(carbonSaving, financialSaving, difficulty)),
      explanation: `Calculated as: ${Math.round(shiftKm)} km shifted × (${COEFFICIENTS.transport.car} kgCO₂/km car - ${COEFFICIENTS.transport.train} kgCO₂/km train) = ${Math.round(carbonSaving)} kg CO₂ saved. Financial savings based on fuel and maintenance savings of $0.08/km.`
    });
  }

  // 2. Car to Bus Commute
  if (carKm > 0) {
    const shiftKm = carKm * 0.2; // Shift 20% of driving
    const carbonSaving = shiftKm * (COEFFICIENTS.transport.car - COEFFICIENTS.transport.bus);
    const financialSaving = shiftKm * CAR_TO_BUS_SAVING_PER_KM;
    const difficulty = 3;
    recs.push({
      id: 'car-to-bus',
      title: 'Take the Bus for Short Trips',
      description: `Swap 20% of your driving (${Math.round(shiftKm)} km/month) for bus transit.`,
      monthlyCarbonSavingKg: Math.round(carbonSaving * 10) / 10,
      monthlyFinancialSavingUSD: Math.round(financialSaving),
      difficultyPenalty: difficulty,
      impactScore: Math.round(calculateImpactScore(carbonSaving, financialSaving, difficulty)),
      explanation: `Calculated as: ${Math.round(shiftKm)} km shifted × (${COEFFICIENTS.transport.car} kgCO₂/km car - ${COEFFICIENTS.transport.bus} kgCO₂/km bus) = ${Math.round(carbonSaving)} kg CO₂ saved. Fuel savings estimated at $0.06/km.`
    });
  }

  // 3. High Meat/Mixed to Vegan Diet
  if (currentDiet === 'high-meat' || currentDiet === 'mixed') {
    const baselineDaily = COEFFICIENTS.food[currentDiet];
    const targetDaily = COEFFICIENTS.food['vegan'];
    const carbonSaving = (baselineDaily - targetDaily) * 30; // 30 days
    const financialSaving = (currentDiet === 'high-meat' ? 2.10 : 1.40) * 30; // $2.10 or $1.40 saved/day
    const difficulty = 7;
    recs.push({
      id: 'diet-vegan',
      title: 'Adopt a Plant-Based (Vegan) Diet',
      description: 'Switch from meat-heavy options to a fully plant-based diet.',
      monthlyCarbonSavingKg: Math.round(carbonSaving * 10) / 10,
      monthlyFinancialSavingUSD: Math.round(financialSaving),
      difficultyPenalty: difficulty,
      impactScore: Math.round(calculateImpactScore(carbonSaving, financialSaving, difficulty)),
      explanation: `Calculated as: 30 days × (${baselineDaily} kgCO₂/day current diet - ${targetDaily} kgCO₂/day vegan diet) = ${Math.round(carbonSaving)} kg CO₂ saved. Financial savings based on average grocery spend reduction of $2.10/day.`
    });
  }

  // 4. High Meat/Mixed to Vegetarian Diet
  if (currentDiet === 'high-meat' || currentDiet === 'mixed') {
    const baselineDaily = COEFFICIENTS.food[currentDiet];
    const targetDaily = COEFFICIENTS.food['vegetarian'];
    const carbonSaving = (baselineDaily - targetDaily) * 30;
    const financialSaving = (currentDiet === 'high-meat' ? 1.40 : 0.70) * 30; // $1.40 or $0.70 saved/day
    const difficulty = 4;
    recs.push({
      id: 'diet-vegetarian',
      title: 'Switch to a Vegetarian Diet',
      description: 'Eliminate meat while keeping dairy and eggs in your meals.',
      monthlyCarbonSavingKg: Math.round(carbonSaving * 10) / 10,
      monthlyFinancialSavingUSD: Math.round(financialSaving),
      difficultyPenalty: difficulty,
      impactScore: Math.round(calculateImpactScore(carbonSaving, financialSaving, difficulty)),
      explanation: `Calculated as: 30 days × (${baselineDaily} kgCO₂/day current diet - ${targetDaily} kgCO₂/day vegetarian diet) = ${Math.round(carbonSaving)} kg CO₂ saved. Financial savings estimated at $1.40/day.`
    });
  }

  // 5. Electricity Reduction (10%)
  if (electricityKwh > 0) {
    const savedKwh = electricityKwh * 0.1;
    const carbonSaving = savedKwh * COEFFICIENTS.electricity.grid;
    const financialSaving = savedKwh * ELECTRICITY_SAVING_PER_KWH;
    const difficulty = 2;
    recs.push({
      id: 'electricity-reduction',
      title: 'Optimize Home Thermostat & Lights',
      description: `Reduce home electricity usage by 10% (saving ${Math.round(savedKwh)} kWh/month).`,
      monthlyCarbonSavingKg: Math.round(carbonSaving * 10) / 10,
      monthlyFinancialSavingUSD: Math.round(financialSaving),
      difficultyPenalty: difficulty,
      impactScore: Math.round(calculateImpactScore(carbonSaving, financialSaving, difficulty)),
      explanation: `Calculated as: ${Math.round(savedKwh)} kWh saved × ${COEFFICIENTS.electricity.grid} kgCO₂/kWh = ${Math.round(carbonSaving)} kg CO₂ saved. Financial savings based on average utility rate of $0.12 per kWh.`
    });
  }

  // 6. Clothing shopping reduction (1 less item)
  const clothesToSave = 1; // Always recommend saving at least 1 item per month
  const clothCarbonSaving = clothesToSave * COEFFICIENTS.shopping.clothing;
  const clothFinancialSaving = clothesToSave * LIFESTYLE_COSTS.clothingPerItem;
  const clothDifficulty = 2;
  recs.push({
    id: 'shopping-clothing',
    title: 'Buy One Less Clothing Item',
    description: 'Avoid fast fashion and buy one less new apparel item this month.',
    monthlyCarbonSavingKg: Math.round(clothCarbonSaving * 10) / 10,
    monthlyFinancialSavingUSD: Math.round(clothFinancialSaving),
    difficultyPenalty: clothDifficulty,
    impactScore: Math.round(calculateImpactScore(clothCarbonSaving, clothFinancialSaving, clothDifficulty)),
    explanation: `Calculated as: ${clothesToSave} item × ${COEFFICIENTS.shopping.clothing} kgCO₂/clothing item = ${Math.round(clothCarbonSaving)} kg CO₂ saved. Financial savings estimated at standard apparel cost of $45.`
  });

  // 7. Electronics lifespan extension (1 less device per year, spread monthly)
  const elecCarbonSaving = COEFFICIENTS.shopping.electronics / 12;
  const elecFinancialSaving = LIFESTYLE_COSTS.electronicsPerItem / 12;
  const elecDifficulty = 3;
  recs.push({
    id: 'shopping-electronics',
    title: 'Extend Smart Devices Lifespan',
    description: 'Keep your smartphone or laptop for an extra year to buy 1 less device per year.',
    monthlyCarbonSavingKg: Math.round(elecCarbonSaving * 10) / 10,
    monthlyFinancialSavingUSD: Math.round(elecFinancialSaving),
    difficultyPenalty: elecDifficulty,
    impactScore: Math.round(calculateImpactScore(elecCarbonSaving, elecFinancialSaving, elecDifficulty)),
    explanation: `Calculated as: (1 device × ${COEFFICIENTS.shopping.electronics} kgCO₂ / 12 months) = ${Math.round(elecCarbonSaving * 10) / 10} kg CO₂ saved per month. Financial savings based on deferring a $180 device purchase by 1 year.`
  });

  // Sort by impact score descending
  return recs.sort((a, b) => b.impactScore - a.impactScore);
}
