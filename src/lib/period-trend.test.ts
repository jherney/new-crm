import { describe, it, expect } from 'vitest';
import { periodTrend } from './period-trend';

const NOW = new Date('2026-10-20T12:00:00Z').getTime();

interface Sale { date: string | null; amount: number }
const trendOf = (sales: Sale[]) => periodTrend(sales, s => s.date, s => s.amount, NOW);

describe('periodTrend', () => {
  it('reports growth against the previous 30 days', () => {
    expect(trendOf([
      { date: '2026-10-10', amount: 150 },
      { date: '2026-09-10', amount: 100 },
    ])).toBe(50);
  });

  it('reports a decline as a negative percentage', () => {
    expect(trendOf([
      { date: '2026-10-10', amount: 50 },
      { date: '2026-09-10', amount: 100 },
    ])).toBe(-50);
  });

  it('returns null when nothing happened in the previous window', () => {
    expect(trendOf([{ date: '2026-10-10', amount: 100 }])).toBeNull();
  });

  it('returns null when there are no records', () => {
    expect(trendOf([])).toBeNull();
  });

  it('ignores records older than 60 days, undated records and future dates', () => {
    expect(trendOf([
      { date: '2026-10-10', amount: 200 },
      { date: '2026-09-10', amount: 100 },
      { date: '2026-06-01', amount: 9_999 },
      { date: null, amount: 9_999 },
      { date: '2026-12-01', amount: 9_999 },
    ])).toBe(100);
  });
});
