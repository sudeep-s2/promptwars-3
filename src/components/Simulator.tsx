import React, { useState } from 'react';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { updateLevers } from '../context/actions';
import { useCarbon } from '../hooks/useCarbon';
import { SimulatorState, TransportMode, DietType } from '../types';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { PersonaCard } from './shared/PersonaCard';
import { calculateCarbonScore, COEFFICIENTS } from '../utils/carbonMath';
import { Car, Utensils, Zap, ShoppingBag, Leaf, HelpCircle } from 'lucide-react';

export const Simulator: React.FC = () => {
  const { simulatorLevers } = useAppState();
  const dispatch = useAppDispatch();
  const { totalCO2, carbonScore } = useCarbon();

  // We determine what the user's current baseline state is.
  // If they have no entries logged, we assume a standard moderate-high baseline.
  const hasLogged = totalCO2 > 0;
  
  // Current monthly footprint in kg
  const currentMonthlyCO2 = hasLogged ? totalCO2 : 540; // 540 kg is the baseline total
  const currentScoreTotal = hasLogged ? carbonScore.total : 45; // default moderate score

  // Slider inputs, initialized from context
  const [weeklyKm, setWeeklyKm] = useState<number>(simulatorLevers.weeklyKm);
  const [transportMode, setTransportMode] = useState<TransportMode>(simulatorLevers.transportMode);
  const [diet, setDiet] = useState<DietType>(simulatorLevers.diet);
  const [monthlyKwh, setMonthlyKwh] = useState<number>(simulatorLevers.monthlyKwh);
  const [clothingItems, setClothingItems] = useState<number>(simulatorLevers.monthlyClothingItems);
  const [electronicsItems, setElectronicsItems] = useState<number>(simulatorLevers.monthlyElectronicsItems);

  // Financial Cost Model
  const transitCostPerKm = { car: 0.15, bus: 0.05, train: 0.07, flight: 0.25, 'walk-bike': 0 } as const;
  const foodCostPerDay = { 'high-meat': 15.0, mixed: 12.90, vegetarian: 11.50, vegan: 10.80 } as const;
  const electricityCostPerKwh = 0.15; // USD
  const clothingCostPerItem = 45.0; // USD
  const electronicsCostPerItem = 180.0; // USD

  // Calculate current baseline costs based on baseline lifestyle assumptions
  const baselineLevers: SimulatorState = {
    transportMode: 'car',
    weeklyKm: 150,
    diet: 'high-meat',
    monthlyKwh: 300,
    monthlyClothingItems: 3,
    monthlyElectronicsItems: 0.5
  };

  const getLifestyleCost = (state: SimulatorState) => {
    const transport = state.weeklyKm * 4.33 * transitCostPerKm[state.transportMode];
    const food = 30 * foodCostPerDay[state.diet];
    const electricity = state.monthlyKwh * electricityCostPerKwh;
    const shopping = (state.monthlyClothingItems * clothingCostPerItem) + (state.monthlyElectronicsItems * electronicsCostPerItem);
    return transport + food + electricity + shopping;
  };

  const getLifestyleCO2 = (state: SimulatorState) => {
    const transport = state.weeklyKm * 4.33 * COEFFICIENTS.transport[state.transportMode];
    const food = 30 * COEFFICIENTS.food[state.diet];
    const electricity = state.monthlyKwh * COEFFICIENTS.electricity.grid;
    const shopping = (state.monthlyClothingItems * COEFFICIENTS.shopping.clothing) + (state.monthlyElectronicsItems * COEFFICIENTS.shopping.electronics);
    return { transport, food, electricity, shopping, total: transport + food + electricity + shopping };
  };

  // Compute values for Simulator Path
  const currentLevers = hasLogged ? simulatorLevers : baselineLevers;
  const currentCost = getLifestyleCost(currentLevers);

  // Improved Path values (computed from sliders)
  const improvedLevers: SimulatorState = {
    transportMode,
    weeklyKm,
    diet,
    monthlyKwh,
    monthlyClothingItems: clothingItems,
    monthlyElectronicsItems: electronicsItems
  };

  const improvedCost = getLifestyleCost(improvedLevers);
  const improvedCO2Breakdown = getLifestyleCO2(improvedLevers);
  const improvedMonthlyCO2 = improvedCO2Breakdown.total;

  const currentCO2Breakdown = getLifestyleCO2(currentLevers);

  // Calculate projected Carbon Score
  const projectedScore = calculateCarbonScore(
    improvedCO2Breakdown.transport,
    improvedCO2Breakdown.food,
    improvedCO2Breakdown.electricity,
    improvedCO2Breakdown.shopping
  );

  // Savings
  const savedCO2Monthly = Math.max(0, currentMonthlyCO2 - improvedMonthlyCO2);
  const savedUSDMonthly = Math.max(0, currentCost - improvedCost);

  // Dispatch live slider updates to Context state
  const handleSliderChange = (updates: Partial<SimulatorState>) => {
    dispatch(updateLevers(updates));
  };

  // Generate 12-month timeline chart data
  const chartData = [
    { month: 'Month 0', Current: 0, Improved: 0 },
    { 
      month: 'Month 3', 
      Current: Math.round(currentMonthlyCO2 * 3), 
      Improved: Math.round(improvedMonthlyCO2 * 3) 
    },
    { 
      month: 'Month 6', 
      Current: Math.round(currentMonthlyCO2 * 6), 
      Improved: Math.round(improvedMonthlyCO2 * 6) 
    },
    { 
      month: 'Month 9', 
      Current: Math.round(currentMonthlyCO2 * 9), 
      Improved: Math.round(improvedMonthlyCO2 * 9) 
    },
    { 
      month: 'Month 12', 
      Current: Math.round(currentMonthlyCO2 * 12), 
      Improved: Math.round(improvedMonthlyCO2 * 12) 
    }
  ];

  // Determine top change for persona card
  let topChange = '';
  const changes = [
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
      desc: `Reduced shopping purchases` 
    }
  ];

  const highestSavingChange = changes.reduce((prev, current) => {
    return (current.saving > prev.saving) ? current : prev;
  }, changes[0]);

  if (highestSavingChange.saving > 5) {
    topChange = highestSavingChange.desc;
  }

  const CustomChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-darkbg-950/95 border border-darkbg-700/60 p-4 rounded-xl shadow-glass backdrop-blur-md">
          <p className="text-gray-300 font-semibold text-xs mb-2">{payload[0].payload.month}</p>
          <div className="flex flex-col gap-1.5 text-xxs">
            <span className="text-rose-400">
              Current Path: <strong className="text-gray-150 text-xs font-bold">{payload[0].value.toLocaleString()}</strong> kg CO₂
            </span>
            <span className="text-emerald-400">
              Improved Path: <strong className="text-gray-150 text-xs font-bold">{payload[1].value.toLocaleString()}</strong> kg CO₂
            </span>
            <div className="border-t border-darkbg-700/50 mt-1.5 pt-1.5 text-emerald-300 font-semibold">
              Saved: {Math.round(payload[0].value - payload[1].value).toLocaleString()} kg CO₂
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-darkbg-800/20 border border-darkbg-700/30 rounded-2xl backdrop-blur-md">
        <h2 className="text-2xl font-bold text-gray-100 font-sans tracking-tight">Future Simulator</h2>
        <p className="text-gray-400 text-sm mt-1">Adjust lifestyle sliders to project carbon savings and financial returns over 12 months.</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Sliders */}
        <div className="lg:col-span-6 space-y-6 bg-darkbg-800/40 border border-darkbg-700/50 rounded-2xl p-6 shadow-glass">
          <h3 className="text-gray-300 font-semibold text-sm tracking-wide mb-4">Adjust Lifestyle Levers</h3>

          {/* Lever 1: Transport */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
                <Car className="w-4 h-4 text-cyan-400" />
                Transport Mode & Km
              </span>
              <span className="text-xs text-cyan-400 font-bold">{weeklyKm} km/week</span>
            </div>
            
            <div className="grid grid-cols-5 gap-1.5 mb-2">
              {(['car', 'bus', 'train', 'flight', 'walk-bike'] as TransportMode[]).map(mode => (
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
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setWeeklyKm(val);
                handleSliderChange({ weeklyKm: val });
              }}
              className="w-full accent-cyan-500 bg-darkbg-900 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <hr className="border-darkbg-700/40" />

          {/* Lever 2: Diet */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
                <Utensils className="w-4 h-4 text-amber-400" />
                Diet Profile
              </span>
              <span className="text-xs text-amber-400 font-bold capitalize">{diet.replace('-', ' ')}</span>
            </div>
            
            <div className="grid grid-cols-4 gap-1.5">
              {(['high-meat', 'mixed', 'vegetarian', 'vegan'] as DietType[]).map(d => (
                <button
                  key={d}
                  onClick={() => {
                    setDiet(d);
                    handleSliderChange({ diet: d });
                  }}
                  className={`py-2 text-center border rounded-lg text-xxs font-bold capitalize transition-all ${
                    diet === d
                      ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                      : 'border-darkbg-700/60 bg-darkbg-900/30 text-gray-400'
                  }`}
                >
                  {d.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-darkbg-700/40" />

          {/* Lever 3: Electricity */}
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
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setMonthlyKwh(val);
                handleSliderChange({ monthlyKwh: val });
              }}
              className="w-full accent-yellow-500 bg-darkbg-900 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <hr className="border-darkbg-700/40" />

          {/* Lever 4: Shopping */}
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
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setClothingItems(val);
                    handleSliderChange({ monthlyClothingItems: val });
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
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setElectronicsItems(val);
                    handleSliderChange({ monthlyElectronicsItems: val });
                  }}
                  className="w-full accent-fuchsia-500 bg-darkbg-900 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Chart & Persona Card */}
        <div className="lg:col-span-6 space-y-6">
          {/* Timeline chart */}
          <div className="bg-darkbg-800/40 border border-darkbg-700/50 rounded-2xl p-5 shadow-glass h-80 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-300 text-sm font-semibold tracking-wide">12-Month Cumulative Projection</h3>
              <div className="flex items-center gap-4 text-xxs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/85" />
                  Current Path
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Improved Path
                </span>
              </div>
            </div>

            <div className="flex-1 min-h-0 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorImproved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#9ca3af" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#9ca3af" 
                    fontSize={9}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="Current" 
                    stroke="#f43f5e" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorCurrent)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Improved" 
                    stroke="#10b981" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorImproved)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Persona Card */}
          <PersonaCard
            currentScore={currentScoreTotal}
            projectedScore={projectedScore.total}
            savedCO2Monthly={savedCO2Monthly}
            savedUSDMonthly={savedUSDMonthly}
            topChange={topChange}
          />
        </div>

      </div>
    </div>
  );
};
