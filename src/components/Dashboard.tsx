import React, { useState, useMemo, useCallback } from 'react';
import { useCarbon } from '../hooks/useCarbon';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { ScoreRing } from './shared/ScoreRing';
import { CategoryBar } from './shared/CategoryBar';
import { TrendChart } from './shared/TrendChart';
import { useCarbonInsight } from '../hooks/useCarbonInsight';
import { ActivityCategory } from '../types';
import { Sparkles, PlusCircle, Target, RefreshCw, AlertCircle, Trash2 } from 'lucide-react';
import { deleteEntry, setTarget, setTab, clearData } from '../context/actions';

export const Dashboard: React.FC = (): React.ReactElement => {
  const {
    transportCO2,
    foodCO2,
    electricityCO2,
    shoppingCO2,
    totalCO2,
    carbonScore,
    isOverTarget,
    percentageOfTarget,
    monthlyTarget
  } = useCarbon();

  const { entries } = useAppState();
  const dispatch = useAppDispatch();

  const [editingTarget, setEditingTarget] = useState<boolean>(false);
  const [tempTarget, setTempTarget] = useState<string>(String(monthlyTarget));

  // Memoize categories array to prevent recreation on every render
  const categories: { name: ActivityCategory; amount: number }[] = useMemo(
    () => [
      { name: 'transport', amount: transportCO2 },
      { name: 'food', amount: foodCO2 },
      { name: 'electricity', amount: electricityCO2 },
      { name: 'shopping', amount: shoppingCO2 }
    ],
    [transportCO2, foodCO2, electricityCO2, shoppingCO2]
  );

  // Memoize highest category calculation
  const highestCategoryData = useMemo(() => {
    const highestCategoryObj = categories.reduce((prev, current) => {
      return (current.amount > prev.amount) ? current : prev;
    }, categories[0]);

    return {
      name: highestCategoryObj.amount > 0 ? highestCategoryObj.name : 'transport',
      co2: highestCategoryObj.amount,
      percentage: totalCO2 > 0 ? (highestCategoryObj.amount / totalCO2) * 100 : 0
    };
  }, [categories, totalCO2]);

  const { insight, loadingInsight } = useCarbonInsight(
    totalCO2,
    highestCategoryData.name,
    highestCategoryData.percentage,
    highestCategoryData.co2
  );

  // Wrapped callbacks with useCallback
  const handleSaveTarget = useCallback((): void => {
    const val = parseFloat(tempTarget);
    const isValidRange = !isNaN(val) && val >= 50 && val <= 5000;
    
    if (!isValidRange) {
      alert('Please enter a target between 50 and 5000 kg CO₂.');
      return;
    }
    
    dispatch(setTarget(val));
    setEditingTarget(false);
  }, [tempTarget, dispatch]);

  const handleClear = useCallback((): void => {
    const confirmed = confirm('Are you sure you want to reset all logged data? This cannot be undone.');
    if (!confirmed) return;
    dispatch(clearData());
  }, [dispatch]);

  const handleNavigateToTracker = useCallback((): void => {
    dispatch(setTab('tracker'));
  }, [dispatch]);

  const handleCancelEditTarget = useCallback((): void => {
    setTempTarget(String(monthlyTarget));
    setEditingTarget(false);
  }, [monthlyTarget]);

  const handleEditTarget = useCallback((): void => {
    setEditingTarget(true);
  }, []);

  const handleDeleteEntry = useCallback((entryId: string): void => {
    dispatch(deleteEntry(entryId));
  }, [dispatch]);

  const budgetRemaining = useMemo(
    (): number => Math.max(0, Math.round(monthlyTarget - totalCO2)),
    [monthlyTarget, totalCO2]
  );

  const budgetTextColor = useMemo(
    (): string => isOverTarget ? 'text-rose-400 font-semibold' : 'text-emerald-400 font-semibold',
    [isOverTarget]
  );

  const progressPercentageColor = useMemo(
    (): string => isOverTarget ? 'text-rose-500' : 'text-emerald-400',
    [isOverTarget]
  );

  const progressBarColor = useMemo(
    (): string => isOverTarget ? 'bg-rose-500' : 'bg-emerald-500',
    [isOverTarget]
  );

  const progressBarWidth = useMemo(
    (): string => `${Math.min(100, percentageOfTarget)}%`,
    [percentageOfTarget]
  );

  // Helper function with explicit return type
  const formatEntryDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-darkbg-800/20 border border-darkbg-700/30 rounded-2xl backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-bold text-gray-100 font-sans tracking-tight">Eco Dashboard</h2>
          <p className="text-gray-400 text-sm mt-1">Real-time breakdown of your ecological footprint.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleNavigateToTracker}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-darkbg-950 font-bold rounded-xl shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-all duration-200 text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Log Activity
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2.5 bg-darkbg-800 hover:bg-darkbg-750 border border-darkbg-700/60 text-rose-400 hover:text-rose-300 font-semibold rounded-xl transition-all duration-200 text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Reset Data
          </button>
        </div>
      </div>

      {/* Target Editor & Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-darkbg-800/40 border border-darkbg-700/50 rounded-2xl shadow-glass flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Monthly Limit</span>
            <Target className="w-5 h-5 text-emerald-400" />
          </div>
          {editingTarget ? (
            <div className="space-y-3">
              <input
                type="number"
                value={tempTarget}
                onChange={(e) => setTempTarget(e.target.value)}
                className="w-full px-3 py-2 bg-darkbg-900 border border-darkbg-700 rounded-lg text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Limit in kg CO₂"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveTarget}
                  className="px-3 py-1.5 bg-emerald-500 text-darkbg-950 font-bold text-xs rounded-md hover:bg-emerald-600 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEditTarget}
                  className="px-3 py-1.5 bg-darkbg-700 text-gray-300 text-xs rounded-md hover:bg-darkbg-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-3xl font-extrabold text-gray-100">{monthlyTarget} <span className="text-sm font-normal text-gray-400">kg CO₂</span></div>
              <button
                onClick={handleEditTarget}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline mt-2"
              >
                Change Limit Target
              </button>
            </div>
          )}
        </div>

        <div className="p-5 bg-darkbg-800/40 border border-darkbg-700/50 rounded-2xl shadow-glass">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-3">Total Monthly Footprint</span>
          <div className="text-3xl font-extrabold text-gray-100">
            {Math.round(totalCO2)} <span className="text-sm font-normal text-gray-400">kg CO₂</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Average budget remaining: <span className={budgetTextColor}>{budgetRemaining} kg</span>
          </p>
        </div>

        {/* Target Usage Card */}
        <div className="p-5 bg-darkbg-800/40 border border-darkbg-700/50 rounded-2xl shadow-glass flex flex-col justify-between">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Target Usage</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold ${progressPercentageColor}`}>
              {percentageOfTarget}%
            </span>
            <span className="text-xs text-gray-500">allocated</span>
          </div>
          <div className="w-full h-1.5 bg-darkbg-900 rounded-full mt-3 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${progressBarColor}`}
              style={{ width: progressBarWidth }}
            />
          </div>
        </div>
      </div>

      {/* AI Insight Bar */}
      <div className="p-5 bg-gradient-to-r from-emerald-950/40 to-carbon-900/10 border border-emerald-500/20 rounded-2xl shadow-glass flex items-start gap-4">
        <div className="p-2.5 bg-emerald-400/10 text-emerald-400 rounded-xl mt-0.5">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
            AI Carbon Advisor
            {loadingInsight && <RefreshCw className="w-3 h-3 animate-spin text-emerald-400/70" />}
          </span>
          <p className="text-sm text-gray-300 leading-relaxed">
            {insight}
          </p>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Score Ring & Category Breakdown */}
        <div className="lg:col-span-4 space-y-6">
          <ScoreRing score={carbonScore.total} />
          
          <div className="space-y-4">
            <h3 className="text-gray-300 text-sm font-semibold tracking-wide uppercase px-1">Breakdown By Category</h3>
            <CategoryBar category="transport" amount={transportCO2} />
            <CategoryBar category="food" amount={foodCO2} />
            <CategoryBar category="electricity" amount={electricityCO2} />
            <CategoryBar category="shopping" amount={shoppingCO2} />
          </div>
        </div>

        {/* Right column: Trend chart & Logs list */}
        <div className="lg:col-span-8 space-y-6">
          <TrendChart 
            transport={transportCO2} 
            food={foodCO2} 
            electricity={electricityCO2} 
            shopping={shoppingCO2} 
          />

          {/* Activity Log List */}
          <div className="bg-darkbg-800/40 border border-darkbg-700/50 rounded-2xl p-5 shadow-glass">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-300 text-sm font-semibold tracking-wide">Recent Activity Log</h3>
              <span className="text-xs text-gray-400">{entries.length} entries total</span>
            </div>
            
            {entries.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-darkbg-750 rounded-xl bg-darkbg-850/10">
                <AlertCircle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No activities logged yet.</p>
                <button
                  onClick={() => dispatch(setTab('tracker'))}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline mt-2"
                >
                  Start logging your travel, diet, and utilities
                </button>
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {entries.slice(0, 15).map(entry => (
                  <div 
                    key={entry.id}
                    className="flex items-center justify-between p-3 bg-darkbg-900/40 border border-darkbg-700/30 rounded-xl hover:bg-darkbg-850/50 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-200 capitalize">{entry.category}</span>
                        <span className="text-xxs px-1.5 py-0.5 rounded bg-darkbg-700 text-gray-400 capitalize">{entry.subcategory || 'General'}</span>
                      </div>
                      <span className="text-xxs text-gray-500 mt-1 block">
                        {formatEntryDate(entry.timestamp)} — {entry.quantity} {entry.unit}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-rose-400">{Math.round(entry.kgCO2)} kg CO₂</span>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="p-1 text-gray-500 hover:text-rose-400 transition-colors"
                        title="Delete log"
                        aria-label="Delete activity entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
