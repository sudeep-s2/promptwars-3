import { useEffect, useState } from 'react';
import type { ActivityCategory } from '../types';
import { getCarbonInsights } from '../utils/insights';

interface CarbonInsightState {
  insight: string;
  loadingInsight: boolean;
}

export function useCarbonInsight(
  totalCO2: number,
  highestCategory: ActivityCategory,
  highestPct: number,
  highestCO2: number
): CarbonInsightState {
  const [insight, setInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    setLoadingInsight(true);

    if (totalCO2 === 0) {
      setInsight('Welcome! Log your activities in the Tracker tab to compute your Carbon Score and receive AI-driven reduction plans.');
      setLoadingInsight(false);
      return;
    }

    getCarbonInsights(highestCategory, highestPct, highestCO2)
      .then(result => {
        if (active) {
          setInsight(result);
          setLoadingInsight(false);
        }
      })
      .catch(() => {
        if (active) {
          setInsight('Tips: Switch commuting to public transit and reduce red meat consumption to instantly lower your score.');
          setLoadingInsight(false);
        }
      });

    return () => {
      active = false;
    };
  }, [totalCO2, highestCategory, highestPct, highestCO2]);

  return { insight, loadingInsight };
}
