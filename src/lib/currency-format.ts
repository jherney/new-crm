const MILLION = 1_000_000;
const THOUSAND = 1_000;

/** Compact USD for stat cards and chart axes: $1.2M, $450K, $800. */
export function formatCompactCurrency(amount: number): string {
  const sign = amount < 0 ? '-' : '';
  const abs = Math.abs(amount);
  // Round to thousands first so 999,600 becomes $1.0M rather than "$1000K".
  if (Math.round(abs / THOUSAND) >= THOUSAND) return `${sign}$${(abs / MILLION).toFixed(1)}M`;
  if (abs >= THOUSAND) return `${sign}$${Math.round(abs / THOUSAND)}K`;
  return `${sign}$${Math.round(abs)}`;
}
