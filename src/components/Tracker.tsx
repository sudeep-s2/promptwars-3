import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { TRACKER_STEPS } from '../constants/options';
import { useTrackerForm } from '../hooks/useTrackerForm';
import {
  ElectricityStep,
  FoodStep,
  ReviewStep,
  ShoppingStep,
  TransportStep
} from './tracker/TrackerSteps';

export const Tracker: React.FC = () => {
  const form = useTrackerForm();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center p-4">
        <h2 className="text-2xl font-bold text-gray-100 font-sans tracking-tight">Log Carbon Activities</h2>
        <p className="text-gray-400 text-sm mt-1">Record your lifestyle statistics to calculate monthly footprint.</p>
      </div>

      <div className="relative flex justify-between items-center px-4 max-w-lg mx-auto">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-darkbg-800 -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: `${((form.step - 1) / (TRACKER_STEPS.length - 1)) * 100}%` }}
        />

        {TRACKER_STEPS.map(stepOption => {
          const StepIcon = stepOption.icon;
          const isActive = form.step >= stepOption.id;
          const isCurrent = form.step === stepOption.id;

          return (
            <div key={stepOption.id} className="relative z-10 flex flex-col items-center">
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
                {stepOption.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="bg-darkbg-800/40 border border-darkbg-700/50 rounded-3xl p-6 md:p-8 shadow-glass backdrop-blur-md relative min-h-[350px] flex flex-col justify-between">
        {form.step === 1 && <TransportStep {...form} />}
        {form.step === 2 && <FoodStep {...form} />}
        {form.step === 3 && <ElectricityStep {...form} />}
        {form.step === 4 && <ShoppingStep {...form} />}
        {form.step === 5 && <ReviewStep {...form} />}

        <div className="flex justify-between items-center mt-8 pt-4 border-t border-darkbg-700/35">
          {form.step > 1 ? (
            <button
              onClick={form.handleBack}
              className="flex items-center gap-2 px-4 py-2 bg-darkbg-850 hover:bg-darkbg-750 border border-darkbg-700 text-gray-300 font-semibold rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {form.step < 5 ? (
            <button
              onClick={form.handleNext}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-darkbg-950 font-bold rounded-xl shadow-[0_4px_15px_rgba(16,185,129,0.25)] transition-all ml-auto"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={form.handleSave}
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

