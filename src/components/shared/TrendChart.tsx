import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps
} from 'recharts';
import { BASELINES } from '../../utils/carbonMath';

interface TrendChartProps {
  transport: number;
  food: number;
  electricity: number;
  shopping: number;
}

interface TrendDatum {
  name: string;
  You: number;
  Average: number;
}

function isTrendDatum(value: unknown): value is TrendDatum {
  if (typeof value !== 'object' || value === null) return false;
  return 'name' in value && 'You' in value && 'Average' in value;
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
  if (active && payload && payload.length >= 2) {
    const category = payload[0].payload;
    if (!isTrendDatum(category)) return null;

    const userValue = Number(payload[0].value ?? 0);
    const baselineValue = Number(payload[1].value ?? 0);

    return (
      <div className="bg-darkbg-950/95 border border-darkbg-700/60 p-3 rounded-lg shadow-glass backdrop-blur-md">
        <p className="text-gray-200 font-semibold text-xs mb-1.5">{category.name}</p>
        <div className="flex flex-col gap-1 text-xxs">
          <span className="text-emerald-400">
            You: <strong className="text-gray-100 text-sm font-semibold">{userValue}</strong> kg CO₂
          </span>
          <span className="text-cyan-400">
            Baseline: <strong className="text-gray-100 text-sm font-semibold">{baselineValue}</strong> kg CO₂
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export const TrendChart: React.FC<TrendChartProps> = ({
  transport,
  food,
  electricity,
  shopping
}) => {
  const data: TrendDatum[] = [
    {
      name: 'Transport',
      You: Math.round(transport),
      Average: BASELINES.transport
    },
    {
      name: 'Food',
      You: Math.round(food),
      Average: BASELINES.food
    },
    {
      name: 'Electricity',
      You: Math.round(electricity),
      Average: BASELINES.electricity
    },
    {
      name: 'Shopping',
      You: Math.round(shopping),
      Average: BASELINES.shopping
    }
  ];

  return (
    <div className="w-full h-80 bg-darkbg-800/40 border border-darkbg-700/50 rounded-2xl p-5 shadow-glass flex flex-col">
      <h3 className="text-gray-300 text-sm font-semibold mb-4 tracking-wide">Category Comparison (kg CO₂ / month)</h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#9ca3af"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11px', color: '#9ca3af', paddingBottom: '10px' }}
            />
            <Bar
              dataKey="You"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              name="Your Footprint"
            />
            <Bar
              dataKey="Average"
              fill="#1f2937"
              stroke="#4b5563"
              strokeWidth={1}
              radius={[4, 4, 0, 0]}
              name="Global Average"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
