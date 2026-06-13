export type ActivityCategory = 'transport' | 'food' | 'electricity' | 'shopping';

export type TabId = 'dashboard' | 'tracker' | 'simulator' | 'recs' | 'methodology';

export type TransportMode = 'car' | 'bus' | 'train' | 'flight' | 'walk-bike';

export type DietType = 'high-meat' | 'mixed' | 'vegetarian' | 'vegan';

export type ShoppingSubcategory = 'clothing' | 'electronics';

export type ActivityUnit = 'km' | 'days' | 'kWh' | 'items';

interface BaseActivityEntry {
  id: string;
  timestamp: number;
  quantity: number;
  kgCO2: number;
}

export interface TransportActivityEntry extends BaseActivityEntry {
  category: 'transport';
  subcategory: TransportMode;
  unit: 'km';
}

export interface FoodActivityEntry extends BaseActivityEntry {
  category: 'food';
  subcategory: DietType;
  unit: 'days';
}

export interface ElectricityActivityEntry extends BaseActivityEntry {
  category: 'electricity';
  subcategory: 'grid';
  unit: 'kWh';
}

export interface ShoppingActivityEntry extends BaseActivityEntry {
  category: 'shopping';
  subcategory: ShoppingSubcategory;
  unit: 'items';
}

export type ActivityEntry =
  | TransportActivityEntry
  | FoodActivityEntry
  | ElectricityActivityEntry
  | ShoppingActivityEntry;

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
