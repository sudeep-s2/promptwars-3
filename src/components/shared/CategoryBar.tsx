import React, { useMemo } from 'react';
import { 
  Car, 
  Utensils, 
  Zap, 
  ShoppingBag, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react';
import { ActivityCategory } from '../../types';
import { BASELINES } from '../../constants/carbonConstants';

interface CategoryBarProps {
  category: ActivityCategory;
  amount: number;
}

const CATEGORY_META = {
  transport: {
    label: 'Transport',
    icon: Car,
    colorClass: 'bg-cyan-500',
    textClass: 'text-cyan-400',
    borderClass: 'border-cyan-500/20',
    bgClass: 'bg-cyan-500/10',
    baseline: BASELINES.transport,
    unit: 'km / flights'
  },
  food: {
    label: 'Food & Diet',
    icon: Utensils,
    colorClass: 'bg-amber-500',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-500/20',
    bgClass: 'bg-amber-500/10',
    baseline: BASELINES.food,
    unit: 'diet profile'
  },
  electricity: {
    label: 'Electricity',
    icon: Zap,
    colorClass: 'bg-yellow-500',
    textClass: 'text-yellow-400',
    borderClass: 'border-yellow-500/20',
    bgClass: 'bg-yellow-500/10',
    baseline: BASELINES.electricity,
    unit: 'kWh'
  },
  shopping: {
    label: 'Shopping',
    icon: ShoppingBag,
    colorClass: 'bg-fuchsia-500',
    textClass: 'text-fuchsia-400',
    borderClass: 'border-fuchsia-500/20',
    bgClass: 'bg-fuchsia-500/10',
    baseline: BASELINES.shopping,
    unit: 'items'
  }
};

export const CategoryBar: React.FC<CategoryBarProps> = ({ category, amount }): React.ReactElement => {
  const meta = CATEGORY_META[category];
  const Icon = meta.icon;
  
  // Memoize percentage calculations
  const percentageOfBaseline = useMemo(
    () => Math.round((amount / meta.baseline) * 100),
    [amount, meta.baseline]
  );

  const cappedWidth = useMemo(
    () => Math.min(100, percentageOfBaseline),
    [percentageOfBaseline]
  );

  const isOverBaseline = useMemo(
    () => amount > meta.baseline,
    [amount, meta.baseline]
  );

  const percentageColor = useMemo(
    (): string => isOverBaseline ? 'text-rose-400' : 'text-emerald-400',
    [isOverBaseline]
  );

  const barShadowClass = useMemo(
    (): string => isOverBaseline ? 'opacity-90 shadow-[0_0_8px_#f43f5e]' : '',
    [isOverBaseline]
  );

  return (
    <div className={`p-4 bg-darkbg-800/20 border ${meta.borderClass} rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-darkbg-800/40`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${meta.bgClass} ${meta.textClass}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-200">{meta.label}</h4>
            <p className="text-xxs text-gray-500 uppercase tracking-wider">Baseline: {meta.baseline} kg CO₂</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-base font-bold text-gray-100">{Math.round(amount)} <span className="text-xs font-normal text-gray-400">kg</span></span>
          <div className="flex items-center gap-1 justify-end mt-0.5">
            {isOverBaseline ? (
              <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span className={`text-xs font-medium ${percentageColor}`}>
              {percentageOfBaseline}% of average
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative w-full h-2.5 bg-darkbg-900 rounded-full overflow-hidden border border-darkbg-700/30">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${meta.colorClass} ${barShadowClass}`}
          style={{ width: `${cappedWidth}%` }}
        />
      </div>
    </div>
  );
};

