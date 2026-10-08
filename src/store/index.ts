import type { Contact, Company, Deal, Activity, EmailTemplate, Event } from '../types';
import { v4 as uuid } from 'uuid';

const STORAGE_KEY = 'crm_data';

interface StoreData {
  contacts: Contact[];
  companies: Company[];
  deals: Deal[];
  activities: Activity[];
  templates: EmailTemplate[];
  events: Event[];
}

function loadData(): StoreData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return seedData();
}

function saveData(data: StoreData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function seedData(): StoreData {
  const now = new Date().toISOString();
  const companies: Company[] = [
    { id: uuid(), name: 'Acme Corp', industry: 'Technology', website: 'https://acme.com', email: 'info@acme.com', phone: '+1-555-0101', address: '123 Tech Blvd, San Francisco, CA', status: 'customer', tags: ['enterprise', 'saas'], notes: 'Key enterprise client', created_at: now, updated_at: now },
    { id: uuid(), name: 'Globex Inc', industry: 'Manufacturing', website: 'https://globex.com', email: 'sales@globex.com', phone: '+1-555-0102', address: '456 Industrial Ave, Chicago, IL', status: 'prospect', tags: ['manufacturing'], notes: 'Interested in automation', created_at: now, updated_at: now },
    { id: uuid(), name: 'Initech', industry: 'Finance', website: 'https://initech.com', email: 'hello@initech.com', phone: '+1-555-0103', address: '789 Finance St, New York, NY', status: 'partner', tags: ['finance', 'partner'], notes: 'Strategic partner', created_at: now, updated_at: now },
    { id: uuid(), name: 'Umbrella Corp', industry: 'Healthcare', website: 'https://umbrella.com', email: 'contact@umbrella.com', phone: '+1-555-0104', address: '321 Health Way, Boston, MA', status: 'prospect', tags: ['healthcare'], notes: 'Evaluating our platform', created_at: now, updated_at: now },
    { id: uuid(), name: 'Stark Industries', industry: 'Defense', website: 'https://stark.com', email: 'tony@stark.com', phone: '+1-555-0105', address: '10880 Malibu Point, CA', status: 'customer', tags: ['enterprise', 'defense'], notes: 'High-value account', created_at: now, updated_at: now },
  ];

  const contacts: Contact[] = [
    { id: uuid(), first_name: 'John', last_name: 'Smith', email: 'john@acme.com', phone: '+1-555-1001', title: 'VP of Engineering', status: 'customer', tags: ['decision-maker'], notes: 'Primary contact for Acme', company_id: companies[0].id, created_at: now, updated_at: now },
    { id: uuid(), first_name: 'Sarah', last_name: 'Johnson', email: 'sarah@globex.com', phone: '+1-555-1002', title: 'Procurement Manager', status: 'prospect', tags: ['influencer'], notes: 'Evaluating solutions', company_id: companies[1].id, created_at: now, updated_at: now },
    { id: uuid(), first_name: 'Mike', last_name: 'Chen', email: 'mike@initech.com', phone: '+1-555-1003', title: 'CTO', status: 'partner', tags: ['executive', 'technical'], notes: 'Technical champion', company_id: companies[2].id, created_at: now, updated_at: now },
    { id: uuid(), first_name: 'Emily', last_name: 'Davis', email: 'emily@umbrella.com', phone: '+1-555-1004', title: 'Director of Operations', status: 'lead', tags: ['decision-maker'], notes: 'New lead from conference', company_id: companies[3].id, created_at: now, updated_at: now },
    { id: uuid(), first_name: 'Tony', last_name: 'Stark', email: 'tony@stark.com', phone: '+1-555-1005', title: 'CEO', status: 'customer', tags: ['executive', 'vip'], notes: 'Key decision maker', company_id: companies[4].id, created_at: now, updated_at: now },
    { id: uuid(), first_name: 'Lisa', last_name: 'Wong', email: 'lisa@acme.com', phone: '+1-555-1006', title: 'Product Manager', status: 'customer', tags: ['influencer'], notes: 'Product team lead', company_id: companies[0].id, created_at: now, updated_at: now },
    { id: uuid(), first_name: 'David', last_name: 'Park', email: 'david@stark.com', phone: '+1-555-1007', title: 'Engineering Lead', status: 'customer', tags: ['technical'], notes: 'Technical evaluator', company_id: companies[4].id, created_at: now, updated_at: now },
  ];

  const deals: Deal[] = [
    { id: uuid(), name: 'Acme Enterprise License', value: 150000, currency: 'USD', stage: 'negotiation', probability: 75, expected_close_date: '2026-12-15', closed_at: null, source: 'referral', description: 'Annual enterprise license renewal', tags: ['enterprise', 'renewal'], owner: 'Sales Team', contact_id: contacts[0].id, company_id: companies[0].id, created_at: now, updated_at: now },
    { id: uuid(), name: 'Globex Automation Suite', value: 75000, currency: 'USD', stage: 'proposal', probability: 50, expected_close_date: '2026-11-30', closed_at: null, source: 'inbound', description: 'Manufacturing automation package', tags: ['automation'], owner: 'Sales Team', contact_id: contacts[1].id, company_id: companies[1].id, created_at: now, updated_at: now },
    { id: uuid(), name: 'Initech Integration', value: 200000, currency: 'USD', stage: 'closed_won', probability: 100, expected_close_date: '2026-10-01', closed_at: '2026-10-01', source: 'partner', description: 'Full platform integration', tags: ['integration', 'partner'], owner: 'Sales Team', contact_id: contacts[2].id, company_id: companies[2].id, created_at: now, updated_at: now },
    { id: uuid(), name: 'Umbrella Pilot Program', value: 45000, currency: 'USD', stage: 'qualified', probability: 25, expected_close_date: '2027-01-15', closed_at: null, source: 'conference', description: 'Healthcare pilot deployment', tags: ['pilot', 'healthcare'], owner: 'Sales Team', contact_id: contacts[3].id, company_id: companies[3].id, created_at: now, updated_at: now },
    { id: uuid(), name: 'Stark R&D Platform', value: 500000, currency: 'USD', stage: 'prospect', probability: 10, expected_close_date: '2027-03-01', closed_at: null, source: 'outbound', description: 'Custom R&D platform development', tags: ['custom', 'enterprise'], owner: 'Sales Team', contact_id: contacts[4].id, company_id: companies[4].id, created_at: now, updated_at: now },
    { id: uuid(), name: 'Acme Add-on Module', value: 30000, currency: 'USD', stage: 'closed_won', probability: 100, expected_close_date: '2026-09-15', closed_at: '2026-09-15', source: 'upsell', description: 'Additional analytics module', tags: ['upsell'], owner: 'Sales Team', contact_id: contacts[5].id, company_id: companies[0].id, created_at: now, updated_at: now },
  ];

  const activities: Activity[] = [
    { id: uuid(), type: 'call', subject: 'Follow up on proposal', body: 'Discussed pricing and timeline', due_date: '2026-10-20T14:00:00', completed: true, completed_at: now, outcome: 'connected', owner: 'Sales Team', deal_id: deals[0].id, contact_id: contacts[0].id, company_id: companies[0].id, created_at: now, updated_at: now },
    { id: uuid(), type: 'email', subject: 'Send contract draft', body: 'Sent initial contract for review', due_date: '2026-10-22T10:00:00', completed: false, completed_at: null, outcome: '', owner: 'Sales Team', deal_id: deals[0].id, contact_id: contacts[0].id, company_id: companies[0].id, created_at: now, updated_at: now },
    { id: uuid(), type: 'meeting', subject: 'Demo session with Globex', body: 'Product demo for procurement team', due_date: '2026-10-25T15:00:00', completed: false, completed_at: null, outcome: '', owner: 'Sales Team', deal_id: deals[1].id, contact_id: contacts[1].id, company_id: companies[1].id, created_at: now, updated_at: now },
    { id: uuid(), type: 'task', subject: 'Prepare Umbrella proposal', body: 'Create custom proposal for healthcare pilot', due_date: '2026-10-28T09:00:00', completed: false, completed_at: null, outcome: '', owner: 'Sales Team', deal_id: deals[3].id, contact_id: contacts[3].id, company_id: companies[3].id, created_at: now, updated_at: now },
    { id: uuid(), type: 'note', subject: 'Stark requirements update', body: 'They need custom API integrations and dedicated support', due_date: null, completed: false, completed_at: null, outcome: '', owner: 'Sales Team', deal_id: deals[4].id, contact_id: contacts[4].id, company_id: companies[4].id, created_at: now, updated_at: now },
    { id: uuid(), type: 'call', subject: 'Check in with Initech', body: 'Post-integration support call', due_date: '2026-10-18T11:00:00', completed: true, completed_at: now, outcome: 'completed', owner: 'Sales Team', deal_id: deals[2].id, contact_id: contacts[2].id, company_id: companies[2].id, created_at: now, updated_at: now },
  ];

  const templates: EmailTemplate[] = [
    { id: uuid(), name: 'Initial Outreach', subject: 'Introduction to {{company}}', body: 'Hi {{first_name}},\n\nI wanted to reach out regarding {{company}}. We help companies like yours streamline operations and boost efficiency.\n\nWould you be open to a quick 15-minute call this week?\n\nBest regards', category: 'outreach', created_at: now, updated_at: now },
    { id: uuid(), name: 'Follow Up After Meeting', subject: 'Great speaking with you!', body: 'Hi {{first_name}},\n\nThank you for taking the time to meet today. As discussed, here are the key points:\n\n- {{key_points}}\n\nI\'ll follow up with a detailed proposal by end of week.\n\nBest regards', category: 'follow-up', created_at: now, updated_at: now },
    { id: uuid(), name: 'Proposal Delivery', subject: 'Your Custom Proposal is Ready', body: 'Hi {{first_name}},\n\nI\'m excited to share your customized proposal for {{company}}. Please find the details attached.\n\nKey highlights:\n- Tailored to your specific needs\n- Competitive pricing\n- Fast implementation timeline\n\nLet me know if you have any questions.\n\nBest regards', category: 'proposal', created_at: now, updated_at: now },
  ];

  const events: Event[] = [
    { id: uuid(), title: 'Q4 Sales Kickoff', description: 'Annual sales team kickoff event', start_date: '2026-11-01T09:00:00', end_date: '2026-11-01T17:00:00', location: 'San Francisco, CA', type: 'conference', rsvps: 45, created_at: now, updated_at: now },
    { id: uuid(), title: 'Product Webinar: New Features', description: 'Showcase of latest platform features', start_date: '2026-10-28T14:00:00', end_date: '2026-10-28T15:30:00', location: 'Virtual', type: 'webinar', rsvps: 120, created_at: now, updated_at: now },
    { id: uuid(), title: 'Customer Success Workshop', description: 'Best practices for customer onboarding', start_date: '2026-11-15T10:00:00', end_date: '2026-11-15T16:00:00', location: 'New York, NY', type: 'workshop', rsvps: 30, created_at: now, updated_at: now },
  ];

  const data: StoreData = { contacts, companies, deals, activities, templates, events };
  saveData(data);
  return data;
}

let data = loadData();
let listeners: Array<() => void> = [];

function notify() {
  saveData(data);
  listeners.forEach(l => l());
}

export const store = {
  subscribe(listener: () => void) {
    listeners.push(listener);
    return () => { listeners = listeners.filter(l => l !== listener); };
  },

  // Contacts
  getContacts: () => data.contacts,
  getContact: (id: string) => data.contacts.find(c => c.id === id),
  addContact: (c: Omit<Contact, 'id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString();
    const contact: Contact = { ...c, id: uuid(), created_at: now, updated_at: now };
    data.contacts = [contact, ...data.contacts];
    notify();
    return contact;
  },
  updateContact: (id: string, updates: Partial<Contact>) => {
    data.contacts = data.contacts.map(c => c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c);
    notify();
  },
  deleteContact: (id: string) => {
    data.contacts = data.contacts.filter(c => c.id !== id);
    notify();
  },

  // Companies
  getCompanies: () => data.companies,
  getCompany: (id: string) => data.companies.find(c => c.id === id),
  addCompany: (c: Omit<Company, 'id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString();
    const company: Company = { ...c, id: uuid(), created_at: now, updated_at: now };
    data.companies = [company, ...data.companies];
    notify();
    return company;
  },
  updateCompany: (id: string, updates: Partial<Company>) => {
    data.companies = data.companies.map(c => c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c);
    notify();
  },
  deleteCompany: (id: string) => {
    data.companies = data.companies.filter(c => c.id !== id);
    notify();
  },

  // Deals
  getDeals: () => data.deals,
  getDeal: (id: string) => data.deals.find(d => d.id === id),
  addDeal: (d: Omit<Deal, 'id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString();
    const deal: Deal = { ...d, id: uuid(), created_at: now, updated_at: now };
    data.deals = [deal, ...data.deals];
    notify();
    return deal;
  },
  updateDeal: (id: string, updates: Partial<Deal>) => {
    data.deals = data.deals.map(d => d.id === id ? { ...d, ...updates, updated_at: new Date().toISOString() } : d);
    notify();
  },
  deleteDeal: (id: string) => {
    data.deals = data.deals.filter(d => d.id !== id);
    notify();
  },
  moveDeal: (id: string, stage: Deal['stage']) => {
    const stages = ['prospect', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'] as const;
    const stageMeta = { prospect: 10, qualified: 25, proposal: 50, negotiation: 75, closed_won: 100, closed_lost: 0 };
    data.deals = data.deals.map(d => {
      if (d.id !== id) return d;
      const isTerminal = stage === 'closed_won' || stage === 'closed_lost';
      return {
        ...d,
        stage,
        probability: stageMeta[stage],
        closed_at: isTerminal && !d.closed_at ? new Date().toISOString().split('T')[0] : d.closed_at,
        updated_at: new Date().toISOString(),
      };
    });
    notify();
  },

  // Activities
  getActivities: () => data.activities,
  getActivity: (id: string) => data.activities.find(a => a.id === id),
  addActivity: (a: Omit<Activity, 'id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString();
    const activity: Activity = { ...a, id: uuid(), created_at: now, updated_at: now };
    data.activities = [activity, ...data.activities];
    notify();
    return activity;
  },
  updateActivity: (id: string, updates: Partial<Activity>) => {
    data.activities = data.activities.map(a => a.id === id ? { ...a, ...updates, updated_at: new Date().toISOString() } : a);
    notify();
  },
  deleteActivity: (id: string) => {
    data.activities = data.activities.filter(a => a.id !== id);
    notify();
  },
  completeActivity: (id: string) => {
    data.activities = data.activities.map(a => a.id === id ? { ...a, completed: true, completed_at: new Date().toISOString(), updated_at: new Date().toISOString() } : a);
    notify();
  },

  // Templates
  getTemplates: () => data.templates,
  addTemplate: (t: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString();
    const template: EmailTemplate = { ...t, id: uuid(), created_at: now, updated_at: now };
    data.templates = [template, ...data.templates];
    notify();
    return template;
  },
  updateTemplate: (id: string, updates: Partial<EmailTemplate>) => {
    data.templates = data.templates.map(t => t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t);
    notify();
  },
  deleteTemplate: (id: string) => {
    data.templates = data.templates.filter(t => t.id !== id);
    notify();
  },

  // Events
  getEvents: () => data.events,
  addEvent: (e: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString();
    const event: Event = { ...e, id: uuid(), created_at: now, updated_at: now };
    data.events = [event, ...data.events];
    notify();
    return event;
  },
  updateEvent: (id: string, updates: Partial<Event>) => {
    data.events = data.events.map(e => e.id === id ? { ...e, ...updates, updated_at: new Date().toISOString() } : e);
    notify();
  },
  deleteEvent: (id: string) => {
    data.events = data.events.filter(e => e.id !== id);
    notify();
  },

  // Reset
  resetData: () => {
    localStorage.removeItem(STORAGE_KEY);
    data = seedData();
    notify();
  },
};

// React hook
import { useState, useEffect } from 'react';

export function useStore<T>(selector: () => T): T {
  const [value, setValue] = useState<T>(() => selector());
  
  useEffect(() => {
    const updateValue = () => setValue(selector());
    
    // Subscribe to store changes
    const unsubscribe = store.subscribe(updateValue);
    
    // Update immediately in case data changed between render and effect
    updateValue();
    
    return unsubscribe;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  return value;
}
