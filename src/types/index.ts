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
