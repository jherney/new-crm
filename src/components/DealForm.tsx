import { useState } from 'react';
import { X } from 'lucide-react';
import { Company, Contact, Deal, DealStage, Pipeline, stageMeta } from '../types';
import { useEscapeKey } from '../hooks/use-escape-key';

export type DealFormValues = Omit<Deal, 'id' | 'created_at' | 'updated_at' | 'closed_at'>;

interface DealFormProps {
  deal: Deal | null;
  pipelines: Pipeline[];
  defaultPipelineId: string;
  contacts: Contact[];
  companies: Company[];
  onClose: () => void;
  onSave: (values: DealFormValues) => void;
}

export default function DealForm({ deal, pipelines, defaultPipelineId, contacts, companies, onClose, onSave }: DealFormProps) {
  useEscapeKey(onClose);

  const [form, setForm] = useState({
    name: deal?.name || '',
    pipeline_id: deal?.pipeline_id || defaultPipelineId,
    value: deal?.value?.toString() || '0',
    currency: deal?.currency || 'USD',
    stage: deal?.stage || 'prospect' as DealStage,
    probability: deal?.probability?.toString() || '10',
    expected_close_date: deal?.expected_close_date || '',
    source: deal?.source || '',
    description: deal?.description || '',
    tags: deal?.tags?.join(', ') || '',
    owner: deal?.owner || '',
    contact_id: deal?.contact_id || '',
    company_id: deal?.company_id || '',
  });

  const formPipeline = pipelines.find(p => p.id === form.pipeline_id) ?? pipelines[0];

  const handlePipelineChange = (pipelineId: string) => {
    const next = pipelines.find(p => p.id === pipelineId) ?? pipelines[0];
    const stage = next.stages[0];
    setForm({ ...form, pipeline_id: next.id, stage: stage.key, probability: stage.probability.toString() });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stageMetaObj = stageMeta(form.stage, formPipeline);
    onSave({
      ...form,
      value: parseFloat(form.value) || 0,
      probability: parseInt(form.probability) || stageMetaObj.probability,
      expected_close_date: form.expected_close_date || null,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      contact_id: form.contact_id || null,
      company_id: form.company_id || null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{deal ? 'Edit Deal' : 'New Deal'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deal Name *</label>
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="deal-pipeline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pipeline</label>
            <select id="deal-pipeline" value={form.pipeline_id} onChange={e => handlePipelineChange(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500">
              {pipelines.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Value ($)</label>
              <input type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stage</label>
              <select value={form.stage} onChange={e => { const s = e.target.value as DealStage; const m = stageMeta(s, formPipeline); setForm({ ...form, stage: s, probability: m.probability.toString() }); }} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500">
                {formPipeline.stages.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Probability %</label>
              <input type="number" min="0" max="100" value={form.probability} onChange={e => setForm({ ...form, probability: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expected Close</label>
              <input type="date" value={form.expected_close_date} onChange={e => setForm({ ...form, expected_close_date: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source</label>
              <input value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} placeholder="e.g. referral, inbound" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact</label>
              <select value={form.contact_id} onChange={e => setForm({ ...form, contact_id: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">None</option>
                {contacts.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
              <select value={form.company_id} onChange={e => setForm({ ...form, company_id: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">None</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Owner</label>
            <input value={form.owner} onChange={e => setForm({ ...form, owner: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma-separated)</label>
            <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 font-medium">{deal ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
