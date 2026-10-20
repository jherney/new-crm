export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  title: string;
  status: 'lead' | 'prospect' | 'customer' | 'partner' | 'vendor';
  tags: string[];
  notes: string;
  company_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  status: 'prospect' | 'customer' | 'partner' | 'vendor' | 'competitor';
  tags: string[];
  notes: string;
  created_at: string;
  updated_at: string;
}

// Open stage keys are per-pipeline; only the two terminal keys are fixed across pipelines.
export type DealStage = string;

export const STAGE_WON = 'closed_won';
export const STAGE_LOST = 'closed_lost';
export const DEFAULT_PIPELINE_ID = 'default';

export interface Deal {
  id: string;
  name: string;
  value: number;
  currency: string;
  pipeline_id: string;
  stage: DealStage;
  probability: number;
  expected_close_date: string | null;
  closed_at: string | null;
  source: string;
  description: string;
  tags: string[];
  owner: string;
  contact_id: string | null;
  company_id: string | null;
  created_at: string;
  updated_at: string;
}

export type ActivityType = 'call' | 'email' | 'meeting' | 'task' | 'note';

export interface Activity {
  id: string;
  type: ActivityType;
  subject: string;
  body: string;
  due_date: string | null;
  completed: boolean;
  completed_at: string | null;
  outcome: string;
  owner: string;
  deal_id: string | null;
  contact_id: string | null;
  company_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  type: 'webinar' | 'conference' | 'meetup' | 'workshop' | 'other';
  rsvps: number;
  created_at: string;
  updated_at: string;
}

export interface DealStageMeta {
  key: DealStage;
  label: string;
  probability: number;
  color: string;
  is_won: boolean;
  is_lost: boolean;
}

export const DEAL_STAGES: DealStageMeta[] = [
  { key: 'prospect', label: 'Prospect', probability: 10, color: '#7c7cff', is_won: false, is_lost: false },
  { key: 'qualified', label: 'Qualified', probability: 25, color: '#5a8dee', is_won: false, is_lost: false },
  { key: 'proposal', label: 'Proposal', probability: 50, color: '#f2a93b', is_won: false, is_lost: false },
  { key: 'negotiation', label: 'Negotiation', probability: 75, color: '#e96d6d', is_won: false, is_lost: false },
  { key: 'closed_won', label: 'Closed Won', probability: 100, color: '#2ecc71', is_won: true, is_lost: false },
  { key: 'closed_lost', label: 'Closed Lost', probability: 0, color: '#95a5a6', is_won: false, is_lost: true },
];

export interface Pipeline {
  id: string;
  name: string;
  stages: DealStageMeta[];
  created_at: string;
  updated_at: string;
}

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
