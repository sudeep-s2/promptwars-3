import {
  Car,
  Utensils,
  Zap,
  ShoppingBag,
  CheckCircle,
  type LucideIcon
} from 'lucide-react';
import type { ActivityCategory, DietType, ShoppingSubcategory, TransportMode } from '../types';

export const TRANSPORT_MODES = ['car', 'bus', 'train', 'flight', 'walk-bike'] as const satisfies readonly TransportMode[];
export const DIET_OPTIONS = ['high-meat', 'mixed', 'vegetarian', 'vegan'] as const satisfies readonly DietType[];
export const SHOPPING_SUBCATEGORIES = ['clothing', 'electronics'] as const satisfies readonly ShoppingSubcategory[];

export const ACTIVITY_CATEGORIES = ['transport', 'food', 'electricity', 'shopping'] as const satisfies readonly ActivityCategory[];

export interface TrackerStepOption {
  id: number;
  label: string;
  icon: LucideIcon;
}

export const TRACKER_STEPS: readonly TrackerStepOption[] = [
  { id: 1, label: 'Transport', icon: Car },
  { id: 2, label: 'Food', icon: Utensils },
  { id: 3, label: 'Electricity', icon: Zap },
  { id: 4, label: 'Shopping', icon: ShoppingBag },
  { id: 5, label: 'Review', icon: CheckCircle }
] as const;

