import React, { useState } from 'react';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { updateLevers } from '../context/actions';
import { useCarbon } from '../hooks/useCarbon';
import type { DietType, SimulatorState, TransportMode } from '../types';
import { PersonaCard } from './shared/PersonaCard';
import { calculateCarbonScore } from '../utils/carbonMath';
import {
  BASELINE_LEVERS,
  buildProjectionData,
  buildSimulatorChanges,
  getLifestyleCO2,
  getLifestyleCost,
  getTopChange
} from '../utils/simulationEngine';
import { LeverControls } from './simulator/LeverControls';
import { ProjectionChart } from './simulator/ProjectionChart';

export const Simulator: React.FC = () => {
  const { simulatorLevers } = useAppState();
  const dispatch = useAppDispatch();
  const { totalCO2, carbonScore } = useCarbon();

  const hasLogged = totalCO2 > 0;
  const currentMonthlyCO2 = hasLogged ? totalCO2 : 540;
  const currentScoreTotal = hasLogged ? carbonScore.total : 45;

  const [weeklyKm, setWeeklyKm] = useState<number>(simulatorLevers.weeklyKm);
  const [transportMode, setTransportMode] = useState<TransportMode>(simulatorLevers.transportMode);
  const [diet, setDiet] = useState<DietType>(simulatorLevers.diet);
  const [monthlyKwh, setMonthlyKwh] = useState<number>(simulatorLevers.monthlyKwh);
  const [clothingItems, setClothingItems] = useState<number>(simulatorLevers.monthlyClothingItems);
  const [electronicsItems, setElectronicsItems] = useState<number>(simulatorLevers.monthlyElectronicsItems);

  const currentLevers = hasLogged ? simulatorLevers : BASELINE_LEVERS;
  const currentCost = getLifestyleCost(currentLevers);

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

  const projectedScore = calculateCarbonScore(
    improvedCO2Breakdown.transport,
    improvedCO2Breakdown.food,
    improvedCO2Breakdown.electricity,
    improvedCO2Breakdown.shopping
  );

  const savedCO2Monthly = Math.max(0, currentMonthlyCO2 - improvedMonthlyCO2);
  const savedUSDMonthly = Math.max(0, currentCost - improvedCost);

  const handleSliderChange = (updates: Partial<SimulatorState>) => {
    dispatch(updateLevers(updates));
  };

  const chartData = buildProjectionData(currentMonthlyCO2, improvedMonthlyCO2);
  const changes = buildSimulatorChanges(currentCO2Breakdown, improvedCO2Breakdown, transportMode, diet, monthlyKwh);
  const topChange = getTopChange(changes);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-darkbg-800/20 border border-darkbg-700/30 rounded-2xl backdrop-blur-md">
        <h2 className="text-2xl font-bold text-gray-100 font-sans tracking-tight">Future Simulator</h2>
        <p className="text-gray-400 text-sm mt-1">Adjust lifestyle sliders to project carbon savings and financial returns over 12 months.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <LeverControls
          weeklyKm={weeklyKm}
          transportMode={transportMode}
          diet={diet}
          monthlyKwh={monthlyKwh}
          clothingItems={clothingItems}
          electronicsItems={electronicsItems}
          setWeeklyKm={setWeeklyKm}
          setTransportMode={setTransportMode}
          setDiet={setDiet}
          setMonthlyKwh={setMonthlyKwh}
          setClothingItems={setClothingItems}
          setElectronicsItems={setElectronicsItems}
          handleSliderChange={handleSliderChange}
        />

        <div className="lg:col-span-6 space-y-6">
          <ProjectionChart chartData={chartData} />
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

