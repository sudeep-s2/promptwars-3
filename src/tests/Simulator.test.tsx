import React from 'react';
import { render, screen } from '@testing-library/react';
import { AppProvider } from '../context/AppContext';
import { Simulator } from '../components/Simulator';
import { describe, it, expect, vi } from 'vitest';

interface MockChartProps {
  children?: React.ReactNode;
}

// Mock Recharts to avoid layout issues in testing
vi.mock('recharts', async () => {
  return {
    ResponsiveContainer: ({ children }: MockChartProps) => <div className="mock-responsive-container">{children}</div>,
    AreaChart: ({ children }: MockChartProps) => <div data-testid="area-chart">{children}</div>,
    Area: () => <div />,
    XAxis: () => <div />,
    YAxis: () => <div />,
    CartesianGrid: () => <div />,
    Tooltip: () => <div />,
    Legend: () => <div />,
  };
});

describe('Simulator Component', () => {
  it('renders Simulator and slides', () => {
    render(
      <AppProvider>
        <Simulator />
      </AppProvider>
    );

    // Verify main headings are present
    expect(screen.getByText('Future Simulator')).toBeInTheDocument();
    expect(screen.getByText('Adjust Lifestyle Levers')).toBeInTheDocument();
    expect(screen.getByText('12-Month Cumulative Projection')).toBeInTheDocument();
    
    // Verify sliders exist
    expect(screen.getByText('Transport Mode & Km')).toBeInTheDocument();
    expect(screen.getByText('Diet Profile')).toBeInTheDocument();
    expect(screen.getByText('Monthly Electricity')).toBeInTheDocument();
    expect(screen.getByText('Monthly Purchases')).toBeInTheDocument();
  });
});
