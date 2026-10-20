const MILLION = 1_000_000;
const THOUSAND = 1_000;

/** Compact USD for stat cards and chart axes: $1.2M, $450K, $800. */
export function formatCompactCurrency(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= MILLION) return `$${(amount / MILLION).toFixed(1)}M`;
  if (abs >= THOUSAND) return `$${(amount / THOUSAND).toFixed(0)}K`;
  return `$${Math.round(amount)}`;
}
