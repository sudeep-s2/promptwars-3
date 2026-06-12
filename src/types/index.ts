export type ActivityCategory = 'transport' | 'food' | 'electricity' | 'shopping';

export type TransportMode = 'car' | 'bus' | 'train' | 'flight' | 'walk-bike';

export type DietType = 'high-meat' | 'mixed' | 'vegetarian' | 'vegan';

export interface ActivityEntry {
  id: string;
  timestamp: number;
  category: ActivityCategory;
  subcategory: string;
  quantity: number;
  unit: string;
  kgCO2: number;
}

export interface UserFootprint {
  entries: ActivityEntry[];
  monthlyTarget: number; // kg CO2
}

export interface SimulatorState {
  transportMode: TransportMode;
  weeklyKm: number;
  diet: DietType;
  monthlyKwh: number;
  monthlyClothingItems: number;
  monthlyElectronicsItems: number;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  monthlyCarbonSavingKg: number;
  monthlyFinancialSavingUSD: number;
  difficultyPenalty: number;  // 1–10
  impactScore: number;        // computed
  explanation: string;        // "Why #1" explanation
}

export interface CarbonScore {
  total: number;        // 0–100 (lower footprint = higher/better score)
  transportPct: number;
  foodPct: number;
  electricityPct: number;
  shoppingPct: number;
}

export interface StorageState {
  entries: ActivityEntry[];
  monthlyTarget: number;
  simulatorLevers: SimulatorState;
}
