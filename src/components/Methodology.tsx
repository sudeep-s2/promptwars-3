import React from 'react';
import { COEFFICIENTS, BASELINES } from '../utils/carbonMath';
import { Info, ShieldCheck, Database, BookOpen } from 'lucide-react';

export const Methodology: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-darkbg-800/20 border border-darkbg-700/30 rounded-2xl backdrop-blur-md">
        <h2 className="text-2xl font-bold text-gray-100 font-sans tracking-tight">Calculation Methodology</h2>
        <p className="text-gray-400 text-sm mt-1 font-sans">
          Total transparency regarding carbon coefficient inputs, mathematical formulas, and baseline assumptions.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Equations & Core Formula */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-darkbg-800/40 border border-darkbg-700/50 rounded-2xl p-6 shadow-glass space-y-4">
            <h3 className="text-gray-200 font-bold text-sm tracking-wide uppercase flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Carbon Score Equation
            </h3>
            
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              The Carbon Score is normalized from 0 to 100, where 100 represents a zero-carbon lifestyle, and a score below 50 represents high environmental impact. The score is computed using the weighted normalized footprint index:
            </p>

            <div className="bg-darkbg-950 p-4 rounded-xl border border-darkbg-700/50 text-center select-all">
              <code className="text-emerald-400 font-mono text-xs md:text-sm">
                Score = 100 - ( (T_score * 0.35) + (F_score * 0.25) + (E_score * 0.20) + (S_score * 0.20) )
              </code>
            </div>

            <div className="text-xs text-gray-400 space-y-2 font-sans">
              <p>Where each category index (e.g. <code className="text-emerald-300 font-mono text-xxs bg-darkbg-900 px-1 py-0.5 rounded">T_score</code>) is calculated relative to global standard averages:</p>
              <ul className="list-disc list-inside pl-2 space-y-1 text-gray-400 font-sans">
                <li><strong className="text-gray-300">T_score:</strong> (Transport CO₂ / {BASELINES.transport} kg) × 100</li>
                <li><strong className="text-gray-300">F_score:</strong> (Food CO₂ / {BASELINES.food} kg) × 100</li>
                <li><strong className="text-gray-300">E_score:</strong> (Electricity CO₂ / {BASELINES.electricity} kg) × 100</li>
                <li><strong className="text-gray-300">S_score:</strong> (Shopping CO₂ / {BASELINES.shopping} kg) × 100</li>
              </ul>
              <p className="text-xxs text-gray-500 italic pt-1">
                * Note: Individual category ratios are capped at 250% before weighting to prevent extreme outliers in a single category from distorting the entire score.
              </p>
            </div>
          </div>

          {/* Sources Callout */}
          <div className="bg-darkbg-800/40 border border-darkbg-700/50 rounded-2xl p-6 shadow-glass space-y-4">
            <h3 className="text-gray-200 font-bold text-sm tracking-wide uppercase flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              Source Material Citation
            </h3>
            
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Coefficients represent standardized global greenhouse gas factors compiled from trusted authorities:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-darkbg-900/40 border border-darkbg-700/30 rounded-xl space-y-2">
                <span className="text-xs font-bold text-gray-200 block">EPA Greenhouse Gas Factors</span>
                <p className="text-xxs text-gray-400 leading-relaxed font-sans">
                  Transport vehicle mileages (car, passenger transit) and electric utility baselines are calibrated from US EPA and DEFRA (UK) national emissions standards.
                </p>
              </div>

              <div className="p-4 bg-darkbg-900/40 border border-darkbg-700/30 rounded-xl space-y-2">
                <span className="text-xs font-bold text-gray-200 block">IPCC / UN Food Reports</span>
                <p className="text-xxs text-gray-400 leading-relaxed font-sans">
                  Food emissions are sourced from UN FAO reports and Poore & Nemecek dietary lifecycle research on agricultural emissions per calorie/protein.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Coefficients Table */}
        <div className="lg:col-span-5 bg-darkbg-800/40 border border-darkbg-700/50 rounded-2xl p-6 shadow-glass flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-gray-200 font-bold text-sm tracking-wide uppercase flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              Coefficient Constants
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xxs font-sans">
                <thead>
                  <tr className="border-b border-darkbg-700 pb-2 text-gray-400 uppercase font-semibold">
                    <th className="py-2.5">Category</th>
                    <th className="py-2.5">Type</th>
                    <th className="py-2.5 text-right">CO₂ (kg)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-darkbg-750/30 text-gray-300">
                  {/* Transport */}
                  <tr>
                    <td className="py-2.5 font-bold text-cyan-400">Transport</td>
                    <td className="py-2.5">Car (per km)</td>
                    <td className="py-2.5 text-right font-semibold">{COEFFICIENTS.transport.car}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-cyan-400">Transport</td>
                    <td className="py-2.5">Bus (per km)</td>
                    <td className="py-2.5 text-right font-semibold">{COEFFICIENTS.transport.bus}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-cyan-400">Transport</td>
                    <td className="py-2.5">Train (per km)</td>
                    <td className="py-2.5 text-right font-semibold">{COEFFICIENTS.transport.train}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-cyan-400">Transport</td>
                    <td className="py-2.5">Flight (per km)</td>
                    <td className="py-2.5 text-right font-semibold">{COEFFICIENTS.transport.flight}</td>
                  </tr>
                  
                  {/* Food */}
                  <tr>
                    <td className="py-2.5 font-bold text-amber-400">Food</td>
                    <td className="py-2.5">High Meat (per day)</td>
                    <td className="py-2.5 text-right font-semibold">{COEFFICIENTS.food['high-meat']}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-amber-400">Food</td>
                    <td className="py-2.5">Mixed Diet (per day)</td>
                    <td className="py-2.5 text-right font-semibold">{COEFFICIENTS.food.mixed}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-amber-400">Food</td>
                    <td className="py-2.5">Vegetarian (per day)</td>
                    <td className="py-2.5 text-right font-semibold">{COEFFICIENTS.food.vegetarian}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-amber-400">Food</td>
                    <td className="py-2.5">Vegan (per day)</td>
                    <td className="py-2.5 text-right font-semibold">{COEFFICIENTS.food.vegan}</td>
                  </tr>

                  {/* Electricity */}
                  <tr>
                    <td className="py-2.5 font-bold text-yellow-400">Electricity</td>
                    <td className="py-2.5">Grid power (per kWh)</td>
                    <td className="py-2.5 text-right font-semibold">{COEFFICIENTS.electricity.grid}</td>
                  </tr>

                  {/* Shopping */}
                  <tr>
                    <td className="py-2.5 font-bold text-fuchsia-400">Shopping</td>
                    <td className="py-2.5">Clothing (per item)</td>
                    <td className="py-2.5 text-right font-semibold">{COEFFICIENTS.shopping.clothing}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-fuchsia-400">Shopping</td>
                    <td className="py-2.5">Electronics (per item)</td>
                    <td className="py-2.5 text-right font-semibold">{COEFFICIENTS.shopping.electronics}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl flex items-start gap-2.5 mt-4">
            <Info className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-gray-400 leading-relaxed font-sans">
              Methodology and database values are regularly reviewed to align with international UNFCCC standards. To request custom coefficients or corrections, please file an issue on the project repository.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
