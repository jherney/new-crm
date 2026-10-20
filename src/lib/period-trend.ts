const MS_PER_DAY = 86_400_000;
export const TREND_WINDOW_DAYS = 30;

/**
 * Percent change of a summed amount between the last 30 days and the 30 days before.
 * Returns null when the earlier window is empty, because a change from zero has no meaningful percentage.
 */
export function periodTrend<T>(
  records: T[],
  getDate: (record: T) => string | null,
  getAmount: (record: T) => number,
  now: number = Date.now(),
): number | null {
  const windowMs = TREND_WINDOW_DAYS * MS_PER_DAY;
  let current = 0;
  let previous = 0;

  for (const record of records) {
    const date = getDate(record);
    if (!date) continue;
    const age = now - new Date(date).getTime();
    if (Number.isNaN(age) || age < 0) continue;
    if (age < windowMs) current += getAmount(record);
    else if (age < 2 * windowMs) previous += getAmount(record);
  }

  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}
