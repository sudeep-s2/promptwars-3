import React, { useState } from 'react';
import { useAppDispatch } from '../context/AppContext';
import { addEntry, setTab } from '../context/actions';
import { ActivityEntry, TransportMode, DietType } from '../types';
import { 
  validateDistance, 
  validateDays, 
  validateElectricity, 
  validateClothingCount, 
  validateElectronicsCount 
} from '../utils/validation';
import { 
  calculateTransportCO2, 
  calculateFoodCO2, 
  calculateElectricityCO2, 
  calculateShoppingCO2, 
  COEFFICIENTS 
} from '../utils/carbonMath';
import { 
  Car, 
  Utensils, 
  Zap, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export const Tracker: React.FC = () => {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<number>(1);

  // Form states
  const [transportMode, setTransportMode] = useState<TransportMode>('car');
  const [distance, setDistance] = useState<string>('150');
  const [diet, setDiet] = useState<DietType>('mixed');
  const [days, setDays] = useState<string>('30');
  const [electricity, setElectricity] = useState<string>('250');
  const [clothingCount, setClothingCount] = useState<string>('2');
  const [electronicsCount, setElectronicsCount] = useState<string>('0');

  // Error states
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculations for preview
  const transportCO2 = calculateTransportCO2(transportMode, parseFloat(distance) || 0);
  const foodCO2 = calculateFoodCO2(diet, parseFloat(days) || 0);
  const electricityCO2 = calculateElectricityCO2(parseFloat(electricity) || 0);
  const clothingCO2 = calculateShoppingCO2(parseFloat(clothingCount) || 0, 0);
  const electronicsCO2 = calculateShoppingCO2(0, parseFloat(electronicsCount) || 0);
  const shoppingCO2 = clothingCO2 + electronicsCO2;
  const totalCO2 = transportCO2 + foodCO2 + electricityCO2 + shoppingCO2;

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      const val = parseFloat(distance);
      const res = validateDistance(val);
      if (!res.isValid) newErrors.distance = res.error || '';
    } else if (currentStep === 2) {
      const val = parseFloat(days);
      const res = validateDays(val);
      if (!res.isValid) newErrors.days = res.error || '';
    } else if (currentStep === 3) {
      const val = parseFloat(electricity);
      const res = validateElectricity(val);
      if (!res.isValid) newErrors.electricity = res.error || '';
    } else if (currentStep === 4) {
      const valCloth = parseFloat(clothingCount);
      const valElec = parseFloat(electronicsCount);
      const resCloth = validateClothingCount(valCloth);
      const resElec = validateElectronicsCount(valElec);
      
      if (!resCloth.isValid) newErrors.clothing = resCloth.error || '';
      if (!resElec.isValid) newErrors.electronics = resElec.error || '';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSave = () => {
    if (!validateStep(4)) {
      setStep(4);
      return;
    }

    const timestamp = Date.now();
    const id = () => Math.random().toString(36).substring(2, 9);

    // 1. Add Transport Entry if there is distance and transportMode
    const distNum = parseFloat(distance) || 0;
    if (distNum > 0) {
      const entry: ActivityEntry = {
        id: id(),
        timestamp,
        category: 'transport',
        subcategory: transportMode,
        quantity: distNum,
        unit: 'km',
        kgCO2: transportCO2
      };
      dispatch(addEntry(entry));
    }

    // 2. Add Food Entry
    const daysNum = parseFloat(days) || 0;
    if (daysNum > 0) {
      const entry: ActivityEntry = {
        id: id(),
        timestamp,
        category: 'food',
        subcategory: diet,
        quantity: daysNum,
        unit: 'days',
        kgCO2: foodCO2
      };
      dispatch(addEntry(entry));
    }

    // 3. Add Electricity Entry
    const kwhNum = parseFloat(electricity) || 0;
    if (kwhNum > 0) {
      const entry: ActivityEntry = {
        id: id(),
        timestamp,
        category: 'electricity',
        subcategory: 'grid',
        quantity: kwhNum,
        unit: 'kWh',
        kgCO2: electricityCO2
      };
      dispatch(addEntry(entry));
    }

    // 4. Add Shopping Entries
    const clothNum = parseFloat(clothingCount) || 0;
    if (clothNum > 0) {
      const entry: ActivityEntry = {
        id: id(),
        timestamp,
        category: 'shopping',
        subcategory: 'clothing',
        quantity: clothNum,
        unit: 'items',
        kgCO2: clothingCO2
      };
      dispatch(addEntry(entry));
    }

    const elecNum = parseFloat(electronicsCount) || 0;
    if (elecNum > 0) {
      const entry: ActivityEntry = {
        id: id(),
        timestamp,
        category: 'shopping',
        subcategory: 'electronics',
        quantity: elecNum,
        unit: 'items',
        kgCO2: electronicsCO2
      };
      dispatch(addEntry(entry));
    }

    dispatch(setTab('dashboard'));
  };

  const stepsList = [
    { id: 1, label: 'Transport', icon: Car },
    { id: 2, label: 'Food', icon: Utensils },
    { id: 3, label: 'Electricity', icon: Zap },
    { id: 4, label: 'Shopping', icon: ShoppingBag },
    { id: 5, label: 'Review', icon: CheckCircle }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page Title */}
      <div className="text-center p-4">
        <h2 className="text-2xl font-bold text-gray-100 font-sans tracking-tight">Log Carbon Activities</h2>
        <p className="text-gray-400 text-sm mt-1">Record your lifestyle statistics to calculate monthly footprint.</p>
      </div>

      {/* Progress Circles */}
      <div className="relative flex justify-between items-center px-4 max-w-lg mx-auto">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-darkbg-800 -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: `${((step - 1) / (stepsList.length - 1)) * 100}%` }}
        />

        {stepsList.map(s => {
          const StepIcon = s.icon;
          const isActive = step >= s.id;
          const isCurrent = step === s.id;

          return (
            <div key={s.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCurrent 
                    ? 'bg-darkbg-950 border-emerald-500 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]Scale' 
                    : isActive 
                      ? 'bg-emerald-500 border-emerald-500 text-darkbg-950 font-bold' 
                      : 'bg-darkbg-900 border-darkbg-700 text-gray-500'
                }`}
              >
                <StepIcon className="w-4 h-4" />
              </div>
              <span className={`text-xxs font-semibold tracking-wide mt-1.5 hidden md:block ${isCurrent ? 'text-emerald-400' : 'text-gray-500'}`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Form Card */}
      <div className="bg-darkbg-800/40 border border-darkbg-700/50 rounded-3xl p-6 md:p-8 shadow-glass backdrop-blur-md relative min-h-[350px] flex flex-col justify-between">
        
        {/* Step 1: Transport */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-bold text-gray-200">Step 1: Transport Habits</h3>
              <p className="text-gray-400 text-xs mt-1">Select your primary mode of travel and estimated weekly distance.</p>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Select Mode</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {(['car', 'bus', 'train', 'flight', 'walk-bike'] as TransportMode[]).map(mode => (
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
                    onChange={(e) => setDistance(e.target.value)}
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
        )}

        {/* Step 2: Food */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-bold text-gray-200">Step 2: Food & Diet Profile</h3>
              <p className="text-gray-400 text-xs mt-1">Specify your daily dietary pattern and the number of days to log.</p>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Choose Diet Type</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['high-meat', 'mixed', 'vegetarian', 'vegan'] as DietType[]).map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDiet(d)}
                    className={`py-3.5 px-2 flex flex-col items-center gap-2 border rounded-xl capitalize transition-all duration-200 ${
                      diet === d
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                        : 'border-darkbg-700/60 bg-darkbg-900/30 text-gray-400 hover:bg-darkbg-850/50'
                    }`}
                  >
                    <Utensils className="w-5 h-5 opacity-80" />
                    <span className="text-xxs font-bold">{d.replace('-', ' ')}</span>
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
                  onChange={(e) => setDays(e.target.value)}
                  className={`w-full px-4 py-3 bg-darkbg-900 border ${errors.days ? 'border-rose-500' : 'border-darkbg-700'} rounded-xl text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  placeholder="Number of days (e.g. 30)"
                />
                {errors.days && (
                  <p className="text-xs text-rose-400 font-medium">{errors.days}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Electricity */}
        {step === 3 && (
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
                  onChange={(e) => setElectricity(e.target.value)}
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
        )}

        {/* Step 4: Shopping */}
        {step === 4 && (
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
                  onChange={(e) => setClothingCount(e.target.value)}
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
                  onChange={(e) => setElectronicsCount(e.target.value)}
                  className={`w-full px-4 py-3 bg-darkbg-900 border ${errors.electronics ? 'border-rose-500' : 'border-darkbg-700'} rounded-xl text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  placeholder="Devices bought"
                />
                {errors.electronics && (
                  <p className="text-xs text-rose-400 font-medium">{errors.electronics}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review & Save */}
        {step === 5 && (
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
        )}

        {/* Buttons footer */}
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-darkbg-700/35">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 bg-darkbg-850 hover:bg-darkbg-750 border border-darkbg-700 text-gray-300 font-semibold rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-darkbg-950 font-bold rounded-xl shadow-[0_4px_15px_rgba(16,185,129,0.25)] transition-all ml-auto"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-darkbg-950 font-extrabold rounded-xl shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-all ml-auto"
            >
              Save to Log
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
