import { useAppState } from '../context/AppContext';
import { calculateCarbonScore } from '../utils/carbonMath';
import { CarbonScore } from '../types';

export interface ComputedCarbonData {
  transportCO2: number;
  foodCO2: number;
  electricityCO2: number;
  shoppingCO2: number;
  totalCO2: number;
  carbonScore: CarbonScore;
  isOverTarget: boolean;
  percentageOfTarget: number;
  monthlyTarget: number;
}

export function useCarbon(): ComputedCarbonData {
  const { entries, monthlyTarget } = useAppState();

  // Filter entries to the last 30 days (rolling month)
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const activeEntries = entries.filter(entry => entry.timestamp >= thirtyDaysAgo);

  // If no entries are logged, let's treat the entire list of entries as the representational state
  // to support users who enter data without worrying about timestamps, but fall back to rolling 30 days
  const sourceEntries = activeEntries.length > 0 ? activeEntries : entries;

  let transportCO2 = 0;
  let foodCO2 = 0;
  let electricityCO2 = 0;
  let shoppingCO2 = 0;

  sourceEntries.forEach(entry => {
    switch (entry.category) {
      case 'transport':
        transportCO2 += entry.kgCO2;
        break;
      case 'food':
        foodCO2 += entry.kgCO2;
        break;
      case 'electricity':
        electricityCO2 += entry.kgCO2;
        break;
      case 'shopping':
        shoppingCO2 += entry.kgCO2;
        break;
    }
  });

  const totalCO2 = transportCO2 + foodCO2 + electricityCO2 + shoppingCO2;
  const carbonScore = calculateCarbonScore(transportCO2, foodCO2, electricityCO2, shoppingCO2);
  
  const isOverTarget = totalCO2 > monthlyTarget;
  const percentageOfTarget = monthlyTarget > 0 ? Math.round((totalCO2 / monthlyTarget) * 100) : 0;

  return {
    transportCO2,
    foodCO2,
    electricityCO2,
    shoppingCO2,
    totalCO2,
    carbonScore,
    isOverTarget,
    percentageOfTarget,
    monthlyTarget
  };
}
