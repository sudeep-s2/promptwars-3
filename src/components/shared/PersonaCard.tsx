import React from 'react';
import { Leaf, DollarSign, ArrowRight, Sparkles } from 'lucide-react';

interface PersonaCardProps {
  currentScore: number;
  projectedScore: number;
  savedCO2Monthly: number;
  savedUSDMonthly: number;
  topChange: string;
}

export const PersonaCard: React.FC<PersonaCardProps> = ({
  currentScore,
  projectedScore,
  savedCO2Monthly,
  savedUSDMonthly,
  topChange
}): React.ReactElement => {
  // 12-month projections
  const annualCO2Saved = Math.round(savedCO2Monthly * 12);
  const annualUSDSaved = Math.round(savedUSDMonthly * 12);

  // Equivalencies
  const flightsSaved = Math.max(0, Math.round((annualCO2Saved / 255) * 10) / 10); // 1 flight ~ 255 kg CO2
  const treesPlanted = Math.max(0, Math.round(annualCO2Saved / 20)); // 1 tree ~ 20 kg CO2 absorption per year

  const isSaving = annualCO2Saved > 0;
  const scoreDiff = projectedScore - currentScore;

  return (
    <div className="w-full bg-gradient-to-br from-carbon-950/60 to-darkbg-900/60 border border-carbon-500/20 rounded-2xl p-6 shadow-glass relative overflow-hidden backdrop-blur-md">
      {/* Decorative background glow */}
      <div className="absolute -right-10 -top-10 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h3 className="text-gray-200 text-sm font-semibold uppercase tracking-wider">Future You (12-Month Projection)</h3>
        </div>
        {isSaving && (
          <span className="px-2.5 py-0.5 text-xs font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full">
            Eco-Improver
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
        {/* Carbon Savings Column */}
        <div className="flex items-start gap-3 p-3 bg-darkbg-850/30 rounded-xl border border-darkbg-700/20">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xxs text-gray-400 uppercase tracking-widest font-semibold">CO₂ Prevented</span>
            <div className="text-2xl font-bold text-emerald-400 mt-0.5">
              {annualCO2Saved.toLocaleString()} <span className="text-sm font-normal text-gray-300">kg / year</span>
            </div>
            {isSaving && (
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                Equivalent to preventing <strong className="text-emerald-300 font-semibold">{flightsSaved}</strong> long-haul flights or growing <strong className="text-emerald-300 font-semibold">{treesPlanted}</strong> trees for a year.
              </p>
            )}
          </div>
        </div>

        {/* Financial Savings Column */}
        <div className="flex items-start gap-3 p-3 bg-darkbg-850/30 rounded-xl border border-darkbg-700/20">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 mt-0.5">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xxs text-gray-400 uppercase tracking-widest font-semibold">Cash Saved</span>
            <div className="text-2xl font-bold text-amber-400 mt-0.5">
              ${annualUSDSaved.toLocaleString()} <span className="text-sm font-normal text-gray-300">/ year</span>
            </div>
            {isSaving && (
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                Reinvested cash savings from reduced food waste, fuel purchases, and energy-efficient habits.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Score and Top Change Footer */}
      <div className="border-t border-darkbg-700/50 pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xxs text-gray-500 uppercase tracking-widest font-semibold">Top Lever Shift</span>
          <p className="text-sm text-gray-200 font-medium mt-0.5">
            {topChange || 'No changes selected in sliders yet. Move a slider to see your projected impact.'}
          </p>
        </div>
        <div className="flex items-center gap-3 bg-darkbg-900/50 px-4 py-2.5 rounded-xl border border-darkbg-700/40 self-start md:self-auto">
          <span className="text-xs text-gray-400 font-medium">Carbon Score:</span>
          <span className="font-semibold text-rose-400 text-sm">{currentScore}</span>
          <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
          <span className={`font-bold text-sm ${scoreDiff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {projectedScore}
          </span>
          {scoreDiff > 0 && (
            <span className="text-xs font-semibold text-emerald-400">
              (+{scoreDiff})
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
