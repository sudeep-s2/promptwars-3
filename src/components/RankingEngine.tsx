import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { generateRecommendations } from '../utils/roi';
import { 
  Award, 
  DollarSign, 
  Leaf, 
  ChevronDown, 
  ChevronUp, 
  Activity, 
  HelpCircle 
} from 'lucide-react';

export const RankingEngine: React.FC = () => {
  const { entries } = useAppState();
  
  // Generate recommendations based on active user logs
  const recommendations = generateRecommendations(entries);

  // Toggle state for explanations (keys are recommendation IDs)
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const getDifficultyColor = (diff: number) => {
    if (diff <= 3) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (diff <= 6) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-darkbg-800/20 border border-darkbg-700/30 rounded-2xl backdrop-blur-md">
        <h2 className="text-2xl font-bold text-gray-100 font-sans tracking-tight">Reduction Priorities</h2>
        <p className="text-gray-400 text-sm mt-1">
          Ranked recommendations to reduce your carbon footprint, ordered by environmental and financial impact.
        </p>
      </div>

      {/* Formula Info Callout */}
      <div className="p-4 bg-darkbg-850/30 border border-darkbg-700/40 rounded-2xl flex items-start gap-3.5 backdrop-blur-sm">
        <HelpCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-gray-400 leading-relaxed">
          <strong className="text-gray-250 font-bold block mb-1">How Priorities are Ranked:</strong>
          Impact Score is calculated using: <code className="text-emerald-300 font-mono text-xxs font-semibold bg-darkbg-900 px-1 py-0.5 rounded">Impact = (CO₂ Savings × 1.5) + (Cash Savings × 0.5) - (Difficulty × 10)</code>.
          High-impact activities with low friction rise to the top.
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="text-center py-12 bg-darkbg-800/40 border border-darkbg-700/50 rounded-2xl">
            <Award className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No actions found. Log some carbon usage first to see recommendations!</p>
          </div>
        ) : (
          recommendations.map((rec, index) => {
            const isExpanded = expandedId === rec.id;
            const diffClass = getDifficultyColor(rec.difficultyPenalty);

            return (
              <div 
                key={rec.id}
                className={`bg-darkbg-800/40 border border-darkbg-700/50 rounded-2xl overflow-hidden transition-all duration-300 ${
                  isExpanded ? 'ring-1 ring-emerald-500/30 bg-darkbg-800/60 shadow-glass' : 'hover:bg-darkbg-800/50'
                }`}
              >
                {/* Main Card Header */}
                <div 
                  onClick={() => toggleExpand(rec.id)}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    {/* Rank Badge */}
                    <div className="w-8 h-8 rounded-lg bg-darkbg-900 border border-darkbg-700/60 flex items-center justify-center font-extrabold text-sm text-emerald-400 flex-shrink-0 mt-0.5">
                      #{index + 1}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-100 flex items-center gap-2">
                        {rec.title}
                      </h3>
                      <p className="text-gray-400 text-xs mt-1 leading-relaxed">{rec.description}</p>
                    </div>
                  </div>

                  {/* Badges/Details on Right */}
                  <div className="flex flex-wrap items-center gap-3.5 mt-2 md:mt-0">
                    <span className={`px-2.5 py-1 text-xxs font-bold uppercase tracking-wider rounded-full border ${diffClass}`}>
                      Diff: {rec.difficultyPenalty}/10
                    </span>
                    <span className="px-2.5 py-1 text-xxs font-bold bg-darkbg-900 border border-darkbg-700 text-emerald-400 rounded-full flex items-center gap-1">
                      <Leaf className="w-3.5 h-3.5" />
                      -{rec.monthlyCarbonSavingKg} kg CO₂
                    </span>
                    <span className="px-2.5 py-1 text-xxs font-bold bg-darkbg-900 border border-darkbg-700 text-amber-400 rounded-full flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      +${rec.monthlyFinancialSavingUSD}
                    </span>
                    <div className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors ml-1">
                      <span className="text-xxs font-semibold uppercase tracking-wider text-gray-500">Why #{index + 1}?</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Collapsible details section */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1.5 border-t border-darkbg-700/30 bg-darkbg-900/30 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                      <div className="md:col-span-8 space-y-3">
                        <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-emerald-400" />
                          Calculation Methodology & Formula
                        </h4>
                        <p className="text-xs text-gray-400 leading-relaxed font-sans">
                          {rec.explanation}
                        </p>
                      </div>

                      <div className="md:col-span-4 p-4 bg-darkbg-850/50 rounded-xl border border-darkbg-700/40 text-center">
                        <span className="text-xxs text-gray-400 uppercase tracking-wider font-semibold">Priority Score</span>
                        <div className="text-3xl font-extrabold text-emerald-400 mt-1">
                          {rec.impactScore}
                        </div>
                        <p className="text-xxs text-gray-500 mt-1.5">Normalized score based on weighted emissions, financial yield, and complexity penalty.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
