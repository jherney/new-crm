import type { Deal } from '../types';

const MAX_SCORE = 100;
const MAX_VALUE_POINTS = 20;
const PROBABILITY_WEIGHT = 0.4;
const MS_PER_DAY = 86_400_000;
const HOT_THRESHOLD = 80;
const WARM_THRESHOLD = 50;

const TAG_WEIGHTS: Record<string, number> = {
  'decision-maker': 15,
  executive: 12,
  vip: 10,
  enterprise: 8,
  renewal: 6,
  upsell: 6,
  integration: 4,
  pilot: 3,
};

const SOURCE_WEIGHTS: Record<string, number> = {
  referral: 10,
  partner: 8,
  inbound: 6,
  upsell: 6,
  conference: 4,
  outbound: 2,
};

function closeDateBonus(expectedCloseDate: string | null, now: number): number {
  if (!expectedCloseDate) return 0;
  const days = (new Date(expectedCloseDate).getTime() - now) / MS_PER_DAY;
  if (days >= 0 && days <= 30) return 10;
  if (days > 30 && days <= 90) return 5;
  return 0;
}

/** Score 0-100 from win probability, deal size, tags, lead source and close-date proximity. */
export function dealScore(deal: Deal, now: number = Date.now()): number {
  const valuePoints = Math.min(MAX_VALUE_POINTS, Math.log10(Math.max(0, deal.value) + 1) * 3);
  // Tags and sources are free text in the deal form, so match case-insensitively.
  const tagPoints = deal.tags.reduce((sum, tag) => sum + (TAG_WEIGHTS[tag.trim().toLowerCase()] ?? 0), 0);
  const sourcePoints = SOURCE_WEIGHTS[deal.source.trim().toLowerCase()] ?? 0;

  const total = deal.probability * PROBABILITY_WEIGHT + valuePoints + tagPoints + sourcePoints + closeDateBonus(deal.expected_close_date, now);
  return Math.max(0, Math.min(MAX_SCORE, Math.round(total)));
}

export function scoreLabel(score: number): { label: string; color: string } {
  if (score >= HOT_THRESHOLD) return { label: 'Hot', color: '#e96d6d' };
  if (score >= WARM_THRESHOLD) return { label: 'Warm', color: '#f2a93b' };
  return { label: 'Cold', color: '#95a5a6' };
}
