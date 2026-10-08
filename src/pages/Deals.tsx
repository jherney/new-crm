import { useState } from 'react';
import { useStore, store } from '../store';
import { Deal, DEAL_STAGES, DealStage, stageMeta } from '../types';
import { Plus, Search, LayoutGrid, List, X, GripVertical } from 'lucide-react';

export default function DealsPage() {
  const deals = useStore(() => store.getDeals());
  const contacts = useStore(() => store.getContacts());
  const companies = useStore(() => store.getCompanies());
  const [view, setView] = useState<'pipeline' | 'list'>('pipeline');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [dragOverStage, setDragOverStage] = useState<DealStage | null>(null);

  const filtered = deals.filter(d => {
    return !search || `${d.name} ${d.owner}`.toLowerCase().includes(search.toLowerCase());
  });

  const getContactName = (id: string | null) => {
    if (!id) return null;
    const c = contacts.find(c => c.id === id);
    return c ? `${c.first_name} ${c.last_name}` : null;
  };

  const getCompanyName = (id: string | null) => {
    if (!id) return null;
    return companies.find(c => c.id === id)?.name || null;
  };

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('dealId', dealId);
  };

  const handleDragOver = (e: React.DragEvent, stage: DealStage) => {
    e.preventDefault();
    setDragOverStage(stage);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (e: React.DragEvent, stage: DealStage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('dealId');
    if (dealId) {
      store.moveDeal(dealId, stage);
    }
    setDragOverStage(null);
  };

  const pipelineStages = DEAL_STAGES.filter(s => !s.is_won && !s.is_lost);
  const totalPipelineValue = filtered.filter(d => !['closed_won', 'closed_lost'].includes(d.stage)).reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Deals</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Pipeline: ${totalPipelineValue.toLocaleString()} · {deals.length} total</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
            <button onClick={() => setView('pipeline')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'pipeline' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}>
              <LayoutGrid className="w-4 h-4" /> Pipeline
            </button>
            <button onClick={() => setView('list')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'list' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}>
              <List className="w-4 h-4" /> List
            </button>
          </div>
          <button onClick={() => { setEditingDeal(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            <Plus className="w-4 h-4" /> Add Deal
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search deals..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      {view === 'pipeline' ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {pipelineStages.map(stage => {
            const stageDeals = filtered.filter(d => d.stage === stage.key);
            const stageValue = stageDeals.reduce((s, d) => s + d.value, 0);
            return (
              <div
                key={stage.key}
                className={`flex-shrink-0 w-72 rounded-xl border transition-colors ${dragOverStage === stage.key ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50'}`}
                onDragOver={(e) => handleDragOver(e, stage.key)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, stage.key)}
              >
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} />
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{stage.label}</h3>
                      <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-full">{stageDeals.length}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">${stageValue.toLocaleString()}</p>
                </div>
                <div className="p-2 space-y-2 max-h-[calc(100vh-350px)] overflow-y-auto">
                  {stageDeals.map(deal => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal.id)}
                      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{deal.name}</p>
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1">${deal.value.toLocaleString()}</p>
                          {getCompanyName(deal.company_id) && (
                            <p className="text-xs text-gray-500 mt-1 truncate">{getCompanyName(deal.company_id)}</p>
                          )}
                          {getContactName(deal.contact_id) && (
                            <p className="text-xs text-gray-400 truncate">{getContactName(deal.contact_id)}</p>
                          )}
                        </div>
                      </div>
                      {deal.expected_close_date && (
                        <p className="text-xs text-gray-400 mt-2">Close: {deal.expected_close_date}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Deal</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Value</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Stage</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Company</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Close Date</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.map(deal => {
                  const meta = stageMeta(deal.stage);
                  return (
                    <tr key={deal.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{deal.name}</p>
                        <p className="text-xs text-gray-500">{deal.owner}</p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">${deal.value.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: meta.color + '20', color: meta.color }}>{meta.label}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{getCompanyName(deal.company_id) || '—'}</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{deal.expected_close_date || '—'}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setEditingDeal(deal); setShowForm(true); }} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button onClick={() => { if (confirm('Delete this deal?')) store.deleteDeal(deal.id); }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="p-8 text-center text-gray-500">No deals found</div>}
        </div>
      )}

      {showForm && (
        <DealForm
          deal={editingDeal}
          contacts={contacts}
          companies={companies}
          onClose={() => setShowForm(false)}
          onSave={(data) => {
            if (editingDeal) store.updateDeal(editingDeal.id, data);
            else store.addDeal(data as any);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

function DealForm({ deal, contacts, companies, onClose, onSave }: { deal: Deal | null; contacts: any[]; companies: any[]; onClose: () => void; onSave: (data: any) => void }) {
  const [form, setForm] = useState({
    name: deal?.name || '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stageMetaObj = stageMeta(form.stage as DealStage);
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
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Value ($)</label>
              <input type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stage</label>
              <select value={form.stage} onChange={e => { const s = e.target.value as DealStage; const m = stageMeta(s); setForm({ ...form, stage: s, probability: m.probability.toString() }); }} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500">
                {DEAL_STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
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
