import type { DietType, SimulatorState, TransportMode } from '../types';
import { COEFFICIENTS, DAYS_PER_MONTH, LIFESTYLE_COSTS, WEEKS_PER_MONTH } from '../constants/carbonConstants';

export interface LifestyleCO2Breakdown {
  transport: number;
  food: number;
  electricity: number;
  shopping: number;
  total: number;
}

export interface SimulatorChange {
  name: string;
  saving: number;
  desc: string;
}

export interface ProjectionPoint {
  month: string;
  Current: number;
  Improved: number;
}

export const BASELINE_LEVERS: SimulatorState = {
  transportMode: 'car',
  weeklyKm: 150,
  diet: 'high-meat',
  monthlyKwh: 300,
  monthlyClothingItems: 3,
  monthlyElectronicsItems: 0.5
};

export function getLifestyleCost(state: SimulatorState): number {
  const transport = state.weeklyKm * WEEKS_PER_MONTH * LIFESTYLE_COSTS.transportPerKm[state.transportMode];
  const food = DAYS_PER_MONTH * LIFESTYLE_COSTS.foodPerDay[state.diet];
  const electricity = state.monthlyKwh * LIFESTYLE_COSTS.electricityPerKwh;
  const shopping = (state.monthlyClothingItems * LIFESTYLE_COSTS.clothingPerItem) + (state.monthlyElectronicsItems * LIFESTYLE_COSTS.electronicsPerItem);
  return transport + food + electricity + shopping;
}

export function getLifestyleCO2(state: SimulatorState): LifestyleCO2Breakdown {
  const transport = state.weeklyKm * WEEKS_PER_MONTH * COEFFICIENTS.transport[state.transportMode];
  const food = DAYS_PER_MONTH * COEFFICIENTS.food[state.diet];
  const electricity = state.monthlyKwh * COEFFICIENTS.electricity.grid;
  const shopping = (state.monthlyClothingItems * COEFFICIENTS.shopping.clothing) + (state.monthlyElectronicsItems * COEFFICIENTS.shopping.electronics);
  return { transport, food, electricity, shopping, total: transport + food + electricity + shopping };
}

export function buildProjectionData(currentMonthlyCO2: number, improvedMonthlyCO2: number): ProjectionPoint[] {
  return [
    { month: 'Month 0', Current: 0, Improved: 0 },
    { month: 'Month 3', Current: Math.round(currentMonthlyCO2 * 3), Improved: Math.round(improvedMonthlyCO2 * 3) },
    { month: 'Month 6', Current: Math.round(currentMonthlyCO2 * 6), Improved: Math.round(improvedMonthlyCO2 * 6) },
    { month: 'Month 9', Current: Math.round(currentMonthlyCO2 * 9), Improved: Math.round(improvedMonthlyCO2 * 9) },
    { month: 'Month 12', Current: Math.round(currentMonthlyCO2 * 12), Improved: Math.round(improvedMonthlyCO2 * 12) }
  ];
}

export function buildSimulatorChanges(
  currentCO2Breakdown: LifestyleCO2Breakdown,
  improvedCO2Breakdown: LifestyleCO2Breakdown,
  transportMode: TransportMode,
  diet: DietType,
  monthlyKwh: number
): SimulatorChange[] {
  return [
    {
      name: 'transport',
      saving: Math.max(0, currentCO2Breakdown.transport - improvedCO2Breakdown.transport),
      desc: `Reduced travel / switched to ${transportMode}`
    },
    {
      name: 'food',
      saving: Math.max(0, currentCO2Breakdown.food - improvedCO2Breakdown.food),
      desc: `Adopted ${diet} diet`
    },
    {
      name: 'electricity',
      saving: Math.max(0, currentCO2Breakdown.electricity - improvedCO2Breakdown.electricity),
      desc: `Cut electricity usage to ${monthlyKwh} kWh`
    },
    {
      name: 'shopping',
      saving: Math.max(0, currentCO2Breakdown.shopping - improvedCO2Breakdown.shopping),
      desc: 'Reduced shopping purchases'
    }
  ];
}

export function getTopChange(changes: SimulatorChange[]): string {
  const highestSavingChange = changes.reduce((prev, current) => {
    return current.saving > prev.saving ? current : prev;
  }, changes[0]);

  return highestSavingChange.saving > 5 ? highestSavingChange.desc : '';
}

