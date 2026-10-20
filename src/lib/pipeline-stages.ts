import { DEAL_STAGES, DEFAULT_PIPELINE_ID, STAGE_LOST, STAGE_WON } from '../types';
import type { DealStage, DealStageMeta, Pipeline } from '../types';

const WON_STAGE = DEAL_STAGES.find(s => s.key === STAGE_WON)!;
const LOST_STAGE = DEAL_STAGES.find(s => s.key === STAGE_LOST)!;
const STAGE_PALETTE = ['#7c7cff', '#5a8dee', '#f2a93b', '#e96d6d', '#9b59b6', '#1abc9c', '#e67e22'];

export function slugifyStageKey(label: string): string {
  return label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

/** Builds a pipeline's stage list from open-stage labels, appending the fixed Won/Lost stages. */
export function buildPipelineStages(openLabels: string[]): DealStageMeta[] {
  const seen = new Set<string>([STAGE_WON, STAGE_LOST]);
  const open: DealStageMeta[] = [];
  for (const label of openLabels.map(l => l.trim()).filter(Boolean)) {
    const key = slugifyStageKey(label);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    open.push({ key, label, probability: 0, color: STAGE_PALETTE[open.length % STAGE_PALETTE.length], is_won: false, is_lost: false });
  }
  // Spread probabilities evenly between 10% and 90% so custom stages get sensible defaults.
  const step = open.length > 1 ? 80 / (open.length - 1) : 0;
  const withProbability = open.map((s, i) => ({ ...s, probability: Math.round(open.length > 1 ? 10 + step * i : 10) }));
  return [...withProbability, WON_STAGE, LOST_STAGE];
}

export function defaultPipeline(now: string): Pipeline {
  return { id: DEFAULT_PIPELINE_ID, name: 'Sales', stages: DEAL_STAGES, created_at: now, updated_at: now };
}

export function stageMeta(stage: DealStage, pipeline?: Pipeline): DealStageMeta {
  const stages = pipeline?.stages ?? DEAL_STAGES;
  return stages.find(s => s.key === stage) || stages[0];
}

export function isClosedStage(stage: DealStage): boolean {
  return stage === STAGE_WON || stage === STAGE_LOST;
}
