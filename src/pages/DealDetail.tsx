import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore, store } from '../store';
import { ArrowLeft, DollarSign, Calendar, User, Building2, Tag, FileText, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { stageMeta } from '../types';

export default function DealDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deal = useStore(() => store.getDeal(id || ''));
  const contact = useStore(() => deal?.contact_id ? store.getContact(deal.contact_id) : null);
  const company = useStore(() => deal?.company_id ? store.getCompany(deal.company_id) : null);
  const activities = useStore(() => store.getActivities().filter(a => a.deal_id === id));

  if (!deal) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Deal not found</p>
        <Link to="/deals" className="text-blue-600 hover:underline">← Back to Deals</Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm('Delete this deal?')) {
      store.deleteDeal(deal.id);
      navigate('/deals');
    }
  };

  const stage = stageMeta(deal.stage);
  const weightedValue = deal.value * (deal.probability / 100);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/deals" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Deals
        </Link>
        <div className="flex gap-2">
          <button onClick={handleDelete} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800 text-red-600 text-sm hover:bg-red-50 dark:hover:bg-red-900/20">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      {/* Deal Card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{deal.name}</h1>
              <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: stage.color + '20', color: stage.color }}>
                {stage.label}
              </span>
            </div>
            {deal.description && <p className="text-gray-500 dark:text-gray-400 mt-2">{deal.description}</p>}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <DollarSign className="w-3 h-3" /> Deal Value
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">${deal.value.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <TrendingUp className="w-3 h-3" /> Weighted
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">${weightedValue.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <span className="text-xs">%</span> Probability
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{deal.probability}%</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Calendar className="w-3 h-3" /> Close Date
            </div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {deal.expected_close_date ? format(new Date(deal.expected_close_date), 'MMM d, yyyy') : '—'}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {deal.owner && (
            <div className="flex items-center gap-3 text-sm">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">{deal.owner}</span>
            </div>
          )}
          {deal.source && (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-400">📥</span>
              <span className="text-gray-700 dark:text-gray-300 capitalize">{deal.source}</span>
            </div>
          )}
          {contact && (
            <div className="flex items-center gap-3 text-sm">
              <User className="w-4 h-4 text-gray-400" />
              <Link to={`/contacts/${contact.id}`} className="text-blue-600 hover:underline">
                {contact.first_name} {contact.last_name}
              </Link>
            </div>
          )}
          {company && (
            <div className="flex items-center gap-3 text-sm">
              <Building2 className="w-4 h-4 text-gray-400" />
              <Link to={`/companies/${company.id}`} className="text-blue-600 hover:underline">{company.name}</Link>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500">Created {format(new Date(deal.created_at), 'MMM d, yyyy')}</span>
          </div>
        </div>

        {deal.tags && deal.tags.length > 0 && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-gray-400" />
            {deal.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Activities */}
      {activities.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activities ({activities.length})</h2>
          <div className="space-y-2">
            {activities.slice(0, 10).map(activity => (
              <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className={`w-2 h-2 rounded-full ${activity.type === 'call' ? 'bg-green-500' : activity.type === 'email' ? 'bg-blue-500' : activity.type === 'meeting' ? 'bg-purple-500' : 'bg-orange-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${activity.completed ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>{activity.subject}</p>
                  <p className="text-xs text-gray-500 capitalize">{activity.type}{activity.due_date ? ` · ${format(new Date(activity.due_date), 'MMM d')}` : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
