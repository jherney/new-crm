import { describe, it, expect } from 'vitest';
import { buildRevenueForecast } from './revenue-forecast';
import type { Deal } from '../types';

function makeDeal(overrides: Partial<Deal>): Deal {
  return {
    id: 'deal-1', pipeline_id: 'default', name: 'Test deal', value: 1000, currency: 'USD',
    stage: 'proposal', probability: 50, expected_close_date: '2026-11-15', closed_at: null,
    source: '', description: '', tags: [], owner: '', contact_id: null, company_id: null,
    created_at: '2026-10-01T00:00:00Z', updated_at: '2026-10-01T00:00:00Z',
    ...overrides,
  };
}

describe('buildRevenueForecast', () => {
  it('sums expected and probability-weighted value per close month', () => {
    const forecast = buildRevenueForecast([
      makeDeal({ id: 'a', value: 1000, probability: 50, expected_close_date: '2026-11-02' }),
      makeDeal({ id: 'b', value: 3000, probability: 10, expected_close_date: '2026-11-28' }),
    ]);
    expect(forecast).toEqual([{ month: 'Nov 2026', expected: 4000, weighted: 800 }]);
  });

  it('orders months chronologically across a year boundary', () => {
    const forecast = buildRevenueForecast([
      makeDeal({ id: 'a', expected_close_date: '2027-01-10' }),
      makeDeal({ id: 'b', expected_close_date: '2026-12-10' }),
    ]);
    expect(forecast.map(m => m.month)).toEqual(['Dec 2026', 'Jan 2027']);
  });

  it('excludes closed deals and deals without a close date', () => {
    const forecast = buildRevenueForecast([
      makeDeal({ id: 'won', stage: 'closed_won' }),
      makeDeal({ id: 'lost', stage: 'closed_lost' }),
      makeDeal({ id: 'undated', expected_close_date: null }),
    ]);
    expect(forecast).toEqual([]);
  });

  it('labels a deal closing on the 1st with that month, whatever the local timezone', () => {
    const forecast = buildRevenueForecast([makeDeal({ expected_close_date: '2026-11-01' })]);
    expect(forecast[0].month).toBe('Nov 2026');
  });
});
