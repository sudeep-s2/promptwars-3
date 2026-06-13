import React from 'react';
import { Car, HelpCircle, Utensils } from 'lucide-react';
import { DIET_OPTIONS, TRANSPORT_MODES } from '../../constants/options';
import type { TrackerFormState } from '../../hooks/useTrackerForm';
import { COEFFICIENTS } from '../../utils/carbonMath';

type TrackerStepProps = Pick<
  TrackerFormState,
  | 'transportMode'
  | 'distance'
  | 'diet'
  | 'days'
  | 'electricity'
  | 'clothingCount'
  | 'electronicsCount'
  | 'errors'
  | 'transportCO2'
  | 'foodCO2'
  | 'electricityCO2'
  | 'shoppingCO2'
  | 'totalCO2'
  | 'setTransportMode'
  | 'setDistance'
  | 'setDiet'
  | 'setDays'
  | 'setElectricity'
  | 'setClothingCount'
  | 'setElectronicsCount'
>;

export const TransportStep: React.FC<TrackerStepProps> = ({
  transportMode,
  distance,
  errors,
  setTransportMode,
  setDistance
}) => (
  <div className="space-y-6 animate-fadeIn">
    <div>
      <h3 className="text-lg font-bold text-gray-200">Step 1: Transport Habits</h3>
      <p className="text-gray-400 text-xs mt-1">Select your primary mode of travel and estimated weekly distance.</p>
    </div>

    <div className="space-y-4">
      <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Select Mode</label>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {TRANSPORT_MODES.map(mode => (
          <button
            key={mode}
            type="button"
            onClick={() => setTransportMode(mode)}
            className={`py-3 px-2 flex flex-col items-center gap-2 border rounded-xl capitalize transition-all duration-200 ${
              transportMode === mode
                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                : 'border-darkbg-700/60 bg-darkbg-900/30 text-gray-400 hover:bg-darkbg-850/50'
            }`}
          >
            <Car className="w-5 h-5 opacity-80" />
            <span className="text-xxs font-bold">{mode.replace('-', ' ')}</span>
          </button>
        ))}
      </div>

      {transportMode !== 'walk-bike' && (
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-baseline">
            <label htmlFor="distance-input" className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Weekly Distance (km)
            </label>
            <span className="text-xxs text-gray-500">Coeff: {COEFFICIENTS.transport[transportMode]} kgCO₂/km</span>
          </div>
          <input
            id="distance-input"
            type="number"
            value={distance}
            onChange={(event) => setDistance(event.target.value)}
            className={`w-full px-4 py-3 bg-darkbg-900 border ${errors.distance ? 'border-rose-500' : 'border-darkbg-700'} rounded-xl text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
            placeholder="Enter distance in kilometers"
          />
          {errors.distance && (
            <p className="text-xs text-rose-400 font-medium">{errors.distance}</p>
          )}
        </div>
      )}
    </div>
  </div>
);

export const FoodStep: React.FC<TrackerStepProps> = ({
  diet,
  days,
  errors,
  setDiet,
  setDays
}) => (
  <div className="space-y-6 animate-fadeIn">
    <div>
      <h3 className="text-lg font-bold text-gray-200">Step 2: Food & Diet Profile</h3>
      <p className="text-gray-400 text-xs mt-1">Specify your daily dietary pattern and the number of days to log.</p>
    </div>

    <div className="space-y-4">
      <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Choose Diet Type</label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {DIET_OPTIONS.map(option => (
          <button
            key={option}
            type="button"
            onClick={() => setDiet(option)}
            className={`py-3.5 px-2 flex flex-col items-center gap-2 border rounded-xl capitalize transition-all duration-200 ${
              diet === option
                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                : 'border-darkbg-700/60 bg-darkbg-900/30 text-gray-400 hover:bg-darkbg-850/50'
            }`}
          >
            <Utensils className="w-5 h-5 opacity-80" />
            <span className="text-xxs font-bold">{option.replace('-', ' ')}</span>
          </button>
        ))}
      </div>

      <div className="space-y-2 pt-2">
        <div className="flex justify-between items-baseline">
          <label htmlFor="days-input" className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Days to Track
          </label>
          <span className="text-xxs text-gray-500">Coeff: {COEFFICIENTS.food[diet]} kgCO₂/day</span>
        </div>
        <input
          id="days-input"
          type="number"
          value={days}
          onChange={(event) => setDays(event.target.value)}
          className={`w-full px-4 py-3 bg-darkbg-900 border ${errors.days ? 'border-rose-500' : 'border-darkbg-700'} rounded-xl text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
          placeholder="Number of days (e.g. 30)"
        />
        {errors.days && (
          <p className="text-xs text-rose-400 font-medium">{errors.days}</p>
        )}
      </div>
    </div>
  </div>
);

export const ElectricityStep: React.FC<TrackerStepProps> = ({
  electricity,
  errors,
  setElectricity
}) => (
  <div className="space-y-6 animate-fadeIn">
    <div>
      <h3 className="text-lg font-bold text-gray-200">Step 3: Electricity consumption</h3>
      <p className="text-gray-400 text-xs mt-1">Input your estimated household monthly electricity consumption.</p>
    </div>

    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <label htmlFor="electricity-input" className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Monthly Grid Electricity (kWh)
          </label>
          <span className="text-xxs text-gray-500">Coeff: {COEFFICIENTS.electricity.grid} kgCO₂/kWh</span>
        </div>
        <input
          id="electricity-input"
          type="number"
          value={electricity}
          onChange={(event) => setElectricity(event.target.value)}
          className={`w-full px-4 py-3 bg-darkbg-900 border ${errors.electricity ? 'border-rose-500' : 'border-darkbg-700'} rounded-xl text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
          placeholder="Total kWh"
        />
        {errors.electricity && (
          <p className="text-xs text-rose-400 font-medium">{errors.electricity}</p>
        )}
      </div>

      <div className="p-4 bg-darkbg-850/30 border border-darkbg-700/40 rounded-xl flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-emerald-400/80 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-gray-400 leading-relaxed">
          Tip: A typical modern home uses between 200 and 500 kWh per month depending on AC usage and household size.
        </p>
      </div>
    </div>
  </div>
);

export const ShoppingStep: React.FC<TrackerStepProps> = ({
  clothingCount,
  electronicsCount,
  errors,
  setClothingCount,
  setElectronicsCount
}) => (
  <div className="space-y-6 animate-fadeIn">
    <div>
      <h3 className="text-lg font-bold text-gray-200">Step 4: Clothing & Electronics Purchases</h3>
      <p className="text-gray-400 text-xs mt-1">Estimate items bought during this logging cycle.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <label htmlFor="clothing-input" className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Clothing Items
          </label>
          <span className="text-xxs text-gray-500">{COEFFICIENTS.shopping.clothing} kgCO₂/item</span>
        </div>
        <input
          id="clothing-input"
          type="number"
          value={clothingCount}
          onChange={(event) => setClothingCount(event.target.value)}
          className={`w-full px-4 py-3 bg-darkbg-900 border ${errors.clothing ? 'border-rose-500' : 'border-darkbg-700'} rounded-xl text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
          placeholder="Items bought"
        />
        {errors.clothing && (
          <p className="text-xs text-rose-400 font-medium">{errors.clothing}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <label htmlFor="electronics-input" className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Electronics / Gadgets
          </label>
          <span className="text-xxs text-gray-500">{COEFFICIENTS.shopping.electronics} kgCO₂/item</span>
        </div>
        <input
          id="electronics-input"
          type="number"
          value={electronicsCount}
          onChange={(event) => setElectronicsCount(event.target.value)}
          className={`w-full px-4 py-3 bg-darkbg-900 border ${errors.electronics ? 'border-rose-500' : 'border-darkbg-700'} rounded-xl text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
          placeholder="Devices bought"
        />
        {errors.electronics && (
          <p className="text-xs text-rose-400 font-medium">{errors.electronics}</p>
        )}
      </div>
    </div>
  </div>
);

export const ReviewStep: React.FC<TrackerStepProps> = ({
  transportMode,
  distance,
  diet,
  days,
  electricity,
  clothingCount,
  electronicsCount,
  transportCO2,
  foodCO2,
  electricityCO2,
  shoppingCO2,
  totalCO2
}) => (
  <div className="space-y-6 animate-fadeIn">
    <div>
      <h3 className="text-lg font-bold text-gray-200">Step 5: Review & Log Results</h3>
      <p className="text-gray-400 text-xs mt-1">Review the calculated carbon impact breakdown before storing it.</p>
    </div>

    <div className="space-y-3 bg-darkbg-900/60 p-5 rounded-2xl border border-darkbg-700/50">
      <div className="flex justify-between text-xs border-b border-darkbg-750 pb-2">
        <span className="text-gray-400 font-semibold uppercase">Category</span>
        <span className="text-gray-400 font-semibold uppercase">Emissions (kg CO₂)</span>
      </div>

      <div className="flex justify-between text-sm py-1">
        <span className="text-gray-300">Transport ({transportMode !== 'walk-bike' ? `${distance} km` : 'Walk/Bike'})</span>
        <span className="font-bold text-cyan-400">{Math.round(transportCO2)} kg</span>
      </div>

      <div className="flex justify-between text-sm py-1">
        <span className="text-gray-300">Food ({diet.replace('-', ' ')} diet - {days} days)</span>
        <span className="font-bold text-amber-400">{Math.round(foodCO2)} kg</span>
      </div>

      <div className="flex justify-between text-sm py-1">
        <span className="text-gray-300">Electricity ({electricity} kWh)</span>
        <span className="font-bold text-yellow-400">{Math.round(electricityCO2)} kg</span>
      </div>

      <div className="flex justify-between text-sm py-1">
        <span className="text-gray-300">Shopping ({clothingCount} clothes, {electronicsCount} devices)</span>
        <span className="font-bold text-fuchsia-400">{Math.round(shoppingCO2)} kg</span>
      </div>

      <div className="flex justify-between text-base font-extrabold border-t border-darkbg-700/70 pt-3 text-gray-100">
        <span>Total Output Impact</span>
        <span className="text-rose-400">{Math.round(totalCO2)} kg CO₂</span>
      </div>
    </div>
  </div>
);

