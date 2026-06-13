import React from 'react';
import { Car, ShoppingBag, Utensils, Zap } from 'lucide-react';
import { DIET_OPTIONS, TRANSPORT_MODES } from '../../constants/options';
import type { DietType, SimulatorState, TransportMode } from '../../types';

interface LeverControlsProps {
  weeklyKm: number;
  transportMode: TransportMode;
  diet: DietType;
  monthlyKwh: number;
  clothingItems: number;
  electronicsItems: number;
  setWeeklyKm: (value: number) => void;
  setTransportMode: (value: TransportMode) => void;
  setDiet: (value: DietType) => void;
  setMonthlyKwh: (value: number) => void;
  setClothingItems: (value: number) => void;
  setElectronicsItems: (value: number) => void;
  handleSliderChange: (updates: Partial<SimulatorState>) => void;
}

export const LeverControls: React.FC<LeverControlsProps> = ({
  weeklyKm,
  transportMode,
  diet,
  monthlyKwh,
  clothingItems,
  electronicsItems,
  setWeeklyKm,
  setTransportMode,
  setDiet,
  setMonthlyKwh,
  setClothingItems,
  setElectronicsItems,
  handleSliderChange
}): React.ReactElement => (
  <div className="lg:col-span-6 space-y-6 bg-darkbg-800/40 border border-darkbg-700/50 rounded-2xl p-6 shadow-glass">
    <h3 className="text-gray-300 font-semibold text-sm tracking-wide mb-4">Adjust Lifestyle Levers</h3>

    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
          <Car className="w-4 h-4 text-cyan-400" />
          Transport Mode & Km
        </span>
        <span className="text-xs text-cyan-400 font-bold">{weeklyKm} km/week</span>
      </div>

      <div className="grid grid-cols-5 gap-1.5 mb-2">
        {TRANSPORT_MODES.map(mode => (
          <button
            key={mode}
            onClick={() => {
              setTransportMode(mode);
              handleSliderChange({ transportMode: mode });
            }}
            className={`py-1 text-center border rounded-lg text-xxs font-bold capitalize transition-all ${
              transportMode === mode
                ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400'
                : 'border-darkbg-700/60 bg-darkbg-900/30 text-gray-400'
            }`}
          >
            {mode.replace('-', ' ')}
          </button>
        ))}
      </div>

      <input
        type="range"
        min="0"
        max="1000"
        value={weeklyKm}
        onChange={(event) => {
          const value = parseInt(event.target.value);
          setWeeklyKm(value);
          handleSliderChange({ weeklyKm: value });
        }}
        className="w-full accent-cyan-500 bg-darkbg-900 h-1.5 rounded-lg appearance-none cursor-pointer"
      />
    </div>

    <hr className="border-darkbg-700/40" />

    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
          <Utensils className="w-4 h-4 text-amber-400" />
          Diet Profile
        </span>
        <span className="text-xs text-amber-400 font-bold capitalize">{diet.replace('-', ' ')}</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {DIET_OPTIONS.map(option => (
          <button
            key={option}
            onClick={() => {
              setDiet(option);
              handleSliderChange({ diet: option });
            }}
            className={`py-2 text-center border rounded-lg text-xxs font-bold capitalize transition-all ${
              diet === option
                ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                : 'border-darkbg-700/60 bg-darkbg-900/30 text-gray-400'
            }`}
          >
            {option.replace('-', ' ')}
          </button>
        ))}
      </div>
    </div>

    <hr className="border-darkbg-700/40" />

    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          Monthly Electricity
        </span>
        <span className="text-xs text-yellow-400 font-bold">{monthlyKwh} kWh</span>
      </div>

      <input
        type="range"
        min="0"
        max="1000"
        value={monthlyKwh}
        onChange={(event) => {
          const value = parseInt(event.target.value);
          setMonthlyKwh(value);
          handleSliderChange({ monthlyKwh: value });
        }}
        className="w-full accent-yellow-500 bg-darkbg-900 h-1.5 rounded-lg appearance-none cursor-pointer"
      />
    </div>

    <hr className="border-darkbg-700/40" />

    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ShoppingBag className="w-4 h-4 text-fuchsia-400" />
        <span className="text-xs font-bold text-gray-200 uppercase tracking-wider">Monthly Purchases</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xxs text-gray-400 font-semibold">
            <span>Clothing items</span>
            <span>{clothingItems} / month</span>
          </div>
          <input
            type="range"
            min="0"
            max="15"
            value={clothingItems}
            onChange={(event) => {
              const value = parseInt(event.target.value);
              setClothingItems(value);
              handleSliderChange({ monthlyClothingItems: value });
            }}
            className="w-full accent-fuchsia-500 bg-darkbg-900 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xxs text-gray-400 font-semibold">
            <span>Electronics</span>
            <span>{electronicsItems} / month</span>
          </div>
          <input
            type="range"
            min="0"
            max="5"
            step="1"
            value={electronicsItems}
            onChange={(event) => {
              const value = parseInt(event.target.value);
              setElectronicsItems(value);
              handleSliderChange({ monthlyElectronicsItems: value });
            }}
            className="w-full accent-fuchsia-500 bg-darkbg-900 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  </div>
);

