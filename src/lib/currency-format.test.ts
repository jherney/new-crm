import { describe, it, expect } from 'vitest';
import { formatCompactCurrency } from './currency-format';

describe('formatCompactCurrency', () => {
  it('shows amounts under a thousand in whole dollars', () => {
    expect(formatCompactCurrency(800)).toBe('$800');
  });

  it('shows thousands with a K suffix', () => {
    expect(formatCompactCurrency(450_000)).toBe('$450K');
  });

  it('shows millions with one decimal', () => {
    expect(formatCompactCurrency(1_234_567)).toBe('$1.2M');
  });

  it('rolls 999,600 up to millions instead of printing $1000K', () => {
    expect(formatCompactCurrency(999_600)).toBe('$1.0M');
  });

  it('keeps 999,499 in thousands', () => {
    expect(formatCompactCurrency(999_499)).toBe('$999K');
  });

  it('puts the minus sign before the dollar sign for negatives', () => {
    expect(formatCompactCurrency(-2_500)).toBe('-$3K');
  });
});
