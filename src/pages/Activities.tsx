import { useState } from 'react';
import { useStore, store } from '../store';
import { Activity, ActivityType } from '../types';
import { Plus, Search, X, Phone, Mail, Calendar, CheckSquare, StickyNote, Check } from 'lucide-react';
import { format, isPast, isToday, isTomorrow } from 'date-fns';

export default function ActivitiesPage() {
  const activities = useStore(() => store.getActivities());
  const contacts = useStore(() => store.getContacts());
  const deals = useStore(() => store.getDeals());
  const companies = useStore(() => store.getCompanies());
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const filtered = activities.filter(a => {
    const matchSearch = !search || `${a.subject} ${a.body}`.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || a.type === typeFilter;
    const matchCompleted = showCompleted || !a.completed;
    return matchSearch && matchType && matchCompleted;
  }).sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (a.due_date && b.due_date) return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const getContactName = (id: string | null) => {
    if (!id) return null;
    const c = contacts.find(c => c.id === id);
    return c ? `${c.first_name} ${c.last_name}` : null;
  };

  const getDealName = (id: string | null) => {
    if (!id) return null;
    return deals.find(d => d.id === id)?.name || null;
  };

  const getCompanyName = (id: string | null) => {
    if (!id) return null;
    return companies.find(c => c.id === id)?.name || null;
  };

  const typeIcons: Record<ActivityType, React.ReactNode> = {
    call: <Phone className="w-4 h-4" />,
    email: <Mail className="w-4 h-4" />,
    meeting: <Calendar className="w-4 h-4" />,
    task: <CheckSquare className="w-4 h-4" />,
    note: <StickyNote className="w-4 h-4" />,
  };

  const typeColors: Record<ActivityType, string> = {
    call: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    email: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    meeting: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    task: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    note: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  };

  const getDueLabel = (dueDate: string | null) => {
    if (!dueDate) return null;
    const d = new Date(dueDate);
    if (isToday(d)) return 'Today';
    if (isTomorrow(d)) return 'Tomorrow';
    if (isPast(d)) return 'Overdue';
    return format(d, 'MMM d');
  };

  const pending = filtered.filter(a => !a.completed).length;
  const overdue = filtered.filter(a => !a.completed && a.due_date && isPast(new Date(a.due_date))).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activities</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{pending} pending · {overdue} overdue</p>
        </div>
        <button onClick={() => { setEditingActivity(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Activity
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search activities..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm outline-none">
          <option value="">All types</option>
          <option value="call">Calls</option>
          <option value="email">Emails</option>
          <option value="meeting">Meetings</option>
          <option value="task">Tasks</option>
          <option value="note">Notes</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <input type="checkbox" checked={showCompleted} onChange={e => setShowCompleted(e.target.checked)} className="rounded border-gray-300" />
          Show completed
        </label>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {filtered.map(activity => {
          const dueLabel = getDueLabel(activity.due_date);
          const isOverdue = activity.due_date && !activity.completed && isPast(new Date(activity.due_date));
          return (
            <div key={activity.id} className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 transition-all ${activity.completed ? 'opacity-60' : ''} ${isOverdue ? 'border-red-200 dark:border-red-800' : ''}`}>
              <div className="flex items-start gap-3">
                <button
                  onClick={() => store.completeActivity(activity.id)}
                  className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${activity.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'}`}
                >
                  {activity.completed && <Check className="w-3 h-3" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[activity.type]}`}>
                      {typeIcons[activity.type]}
                      {activity.type}
                    </span>
                    {dueLabel && (
                      <span className={`text-xs font-medium ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>{dueLabel}</span>
                    )}
                  </div>
                  <h4 className={`text-sm font-medium mt-1 ${activity.completed ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>{activity.subject}</h4>
                  {activity.body && <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{activity.body}</p>}
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {getContactName(activity.contact_id) && (
                      <span className="text-xs text-gray-400">👤 {getContactName(activity.contact_id)}</span>
                    )}
                    {getDealName(activity.deal_id) && (
                      <span className="text-xs text-gray-400">💰 {getDealName(activity.deal_id)}</span>
                    )}
                    {getCompanyName(activity.company_id) && (
                      <span className="text-xs text-gray-400">🏢 {getCompanyName(activity.company_id)}</span>
                    )}
                    {activity.due_date && (
                      <span className="text-xs text-gray-400">📅 {format(new Date(activity.due_date), 'MMM d, h:mm a')}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => { setEditingActivity(activity); setShowForm(true); }} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => { if (confirm('Delete?')) store.deleteActivity(activity.id); }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="p-8 text-center text-gray-500 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">No activities found</div>
        )}
      </div>

      {showForm && (
        <ActivityForm
          activity={editingActivity}
          contacts={contacts}
          deals={deals}
          companies={companies}
          onClose={() => setShowForm(false)}
          onSave={(data) => {
            if (editingActivity) store.updateActivity(editingActivity.id, data);
            else store.addActivity(data as any);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

function ActivityForm({ activity, contacts, deals, companies, onClose, onSave }: { activity: Activity | null; contacts: any[]; deals: any[]; companies: any[]; onClose: () => void; onSave: (data: any) => void }) {
  const [form, setForm] = useState({
    type: activity?.type || 'task' as ActivityType,
    subject: activity?.subject || '',
    body: activity?.body || '',
    due_date: activity?.due_date ? activity.due_date.slice(0, 16) : '',
    completed: activity?.completed || false,
    outcome: activity?.outcome || '',
    owner: activity?.owner || '',
    deal_id: activity?.deal_id || '',
    contact_id: activity?.contact_id || '',
    company_id: activity?.company_id || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      due_date: form.due_date ? new Date(form.due_date).toISOString() : null,
      deal_id: form.deal_id || null,
      contact_id: form.contact_id || null,
      company_id: form.company_id || null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{activity ? 'Edit Activity' : 'New Activity'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as ActivityType })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option value="call">Call</option>
                <option value="email">Email</option>
                <option value="meeting">Meeting</option>
                <option value="task">Task</option>
                <option value="note">Note</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
              <input type="datetime-local" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject *</label>
            <input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Body</label>
            <textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact</label>
              <select value={form.contact_id} onChange={e => setForm({ ...form, contact_id: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">None</option>
                {contacts.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deal</label>
              <select value={form.deal_id} onChange={e => setForm({ ...form, deal_id: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">None</option>
                {deals.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
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
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 font-medium">{activity ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
