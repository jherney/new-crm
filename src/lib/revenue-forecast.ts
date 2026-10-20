import type { Deal } from '../types';
import { isClosedStage } from '../types';
import { format } from 'date-fns';

export interface ForecastMonth {
  month: string;
  expected: number;
  weighted: number;
}

/** Open deals with a close date, bucketed by close month (oldest first). */
export function buildRevenueForecast(deals: Deal[]): ForecastMonth[] {
  const byMonthKey = new Map<string, ForecastMonth>();

  for (const deal of deals) {
    if (isClosedStage(deal.stage) || !deal.expected_close_date) continue;
    const monthKey = deal.expected_close_date.slice(0, 7);
    const bucket = byMonthKey.get(monthKey) ?? { month: format(new Date(deal.expected_close_date), 'MMM yyyy'), expected: 0, weighted: 0 };
    bucket.expected += deal.value;
    bucket.weighted += (deal.value * (deal.probability || 0)) / 100;
    byMonthKey.set(monthKey, bucket);
  }

  return [...byMonthKey.keys()].sort().map(key => byMonthKey.get(key)!);
}
