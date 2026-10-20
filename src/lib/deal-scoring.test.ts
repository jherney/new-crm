import { describe, it, expect } from 'vitest';
import { dealScore, scoreLabel } from './deal-scoring';
import type { Deal } from '../types';

const NOW = new Date('2026-10-20T00:00:00Z').getTime();

function makeDeal(overrides: Partial<Deal> = {}): Deal {
  return {
    id: 'deal-1', pipeline_id: 'default', name: 'Test deal', value: 0, currency: 'USD',
    stage: 'prospect', probability: 0, expected_close_date: null, closed_at: null,
    source: '', description: '', tags: [], owner: '', contact_id: null, company_id: null,
    created_at: '2026-10-01T00:00:00Z', updated_at: '2026-10-01T00:00:00Z',
    ...overrides,
  };
}

describe('dealScore', () => {
  it('scores an empty deal as zero', () => {
    expect(dealScore(makeDeal(), NOW)).toBe(0);
  });

  it('weights win probability at 40%', () => {
    expect(dealScore(makeDeal({ probability: 50 }), NOW)).toBe(20);
  });

  it('matches lead source case-insensitively', () => {
    const lower = dealScore(makeDeal({ source: 'referral' }), NOW);
    const mixed = dealScore(makeDeal({ source: '  Referral ' }), NOW);
    expect(mixed).toBe(lower);
    expect(lower).toBe(10);
  });

  it('matches tags case-insensitively', () => {
    expect(dealScore(makeDeal({ tags: ['VIP'] }), NOW)).toBe(10);
  });

  it('adds 10 points when the deal closes within 30 days', () => {
    expect(dealScore(makeDeal({ expected_close_date: '2026-11-05' }), NOW)).toBe(10);
  });

  it('adds 5 points when the deal closes in 31-90 days', () => {
    expect(dealScore(makeDeal({ expected_close_date: '2026-12-15' }), NOW)).toBe(5);
  });

  it('gives no close-date bonus to deals already past due', () => {
    expect(dealScore(makeDeal({ expected_close_date: '2026-10-01' }), NOW)).toBe(0);
  });

  it('caps deal size contribution at 20 points', () => {
    expect(dealScore(makeDeal({ value: 10_000_000_000 }), NOW)).toBe(20);
  });

  it('does not return NaN for a negative deal value', () => {
    expect(dealScore(makeDeal({ value: -500 }), NOW)).toBe(0);
  });

  it('never exceeds 100', () => {
    const stacked = makeDeal({ probability: 100, value: 1e9, tags: ['decision-maker', 'executive', 'vip'], source: 'referral', expected_close_date: '2026-10-25' });
    expect(dealScore(stacked, NOW)).toBe(100);
  });
});

describe('scoreLabel', () => {
  it.each([
    [80, 'Hot'],
    [79, 'Warm'],
    [50, 'Warm'],
    [49, 'Cold'],
  ])('labels a score of %i as %s', (score, label) => {
    expect(scoreLabel(score).label).toBe(label);
  });
});
