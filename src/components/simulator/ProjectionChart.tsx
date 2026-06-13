import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps
} from 'recharts';
import type { ProjectionPoint } from '../../utils/simulationEngine';

interface ProjectionChartProps {
  chartData: ProjectionPoint[];
}

function isProjectionPoint(value: unknown): value is ProjectionPoint {
  if (typeof value !== 'object' || value === null) return false;
  return 'month' in value && 'Current' in value && 'Improved' in value;
}

const ProjectionTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
  if (active && payload && payload.length >= 2) {
    const point = payload[0].payload;
    if (!isProjectionPoint(point)) return null;

    const currentValue = Number(payload[0].value ?? 0);
    const improvedValue = Number(payload[1].value ?? 0);

    return (
      <div className="bg-darkbg-950/95 border border-darkbg-700/60 p-4 rounded-xl shadow-glass backdrop-blur-md">
        <p className="text-gray-300 font-semibold text-xs mb-2">{point.month}</p>
        <div className="flex flex-col gap-1.5 text-xxs">
          <span className="text-rose-400">
            Current Path: <strong className="text-gray-150 text-xs font-bold">{currentValue.toLocaleString()}</strong> kg CO₂
          </span>
          <span className="text-emerald-400">
            Improved Path: <strong className="text-gray-150 text-xs font-bold">{improvedValue.toLocaleString()}</strong> kg CO₂
          </span>
          <div className="border-t border-darkbg-700/50 mt-1.5 pt-1.5 text-emerald-300 font-semibold">
            Saved: {Math.round(currentValue - improvedValue).toLocaleString()} kg CO₂
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const ProjectionChart: React.FC<ProjectionChartProps> = ({ chartData }) => (
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
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
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
          <XAxis dataKey="month" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke="#9ca3af" fontSize={9} tickLine={false} axisLine={false} />
          <Tooltip content={<ProjectionTooltip />} />
          <Area type="monotone" dataKey="Current" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorCurrent)" />
          <Area type="monotone" dataKey="Improved" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorImproved)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);
