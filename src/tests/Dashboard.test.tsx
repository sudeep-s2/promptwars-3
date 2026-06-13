import React from 'react';
import { render, screen } from '@testing-library/react';
import { AppProvider } from '../context/AppContext';
import { Dashboard } from '../components/Dashboard';
import { describe, it, expect, vi, beforeEach } from 'vitest';

interface MockChartProps {
  children?: React.ReactNode;
}

// Mock Recharts to avoid jsdom layout engine issues
vi.mock('recharts', async () => {
  return {
    ResponsiveContainer: ({ children }: MockChartProps) => <div className="mock-responsive-container">{children}</div>,
    BarChart: ({ children }: MockChartProps) => <div data-testid="bar-chart">{children}</div>,
    Bar: () => <div />,
    XAxis: () => <div />,
    YAxis: () => <div />,
    CartesianGrid: () => <div />,
    Tooltip: () => <div />,
    Legend: () => <div />,
    AreaChart: ({ children }: MockChartProps) => <div data-testid="area-chart">{children}</div>,
    Area: () => <div />,
  };
});

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders Dashboard without crashing (empty state)', () => {
    render(
      <AppProvider>
        <Dashboard />
      </AppProvider>
    );

    // Verify title and standard sections exist
    expect(screen.getByText('Eco Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Total Monthly Footprint')).toBeInTheDocument();
    expect(screen.getByText('Target Usage')).toBeInTheDocument();
    expect(screen.getByText('Carbon Score')).toBeInTheDocument();
    
    // Verify welcome message is visible when empty
    expect(screen.getByText(/Log your activities in the Tracker tab/)).toBeInTheDocument();
  });
});
