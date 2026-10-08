import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore, store } from '../store';
import { ArrowLeft, Mail, Phone, Building2, Edit, Trash2, Tag, FileText, Briefcase } from 'lucide-react';
import { format } from 'date-fns';

export default function ContactDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const contact = useStore(() => store.getContact(id || ''));
  const company = useStore(() => contact?.company_id ? store.getCompany(contact.company_id) : null);
  const activities = useStore(() => store.getActivities().filter(a => a.contact_id === id));
  const deals = useStore(() => store.getDeals().filter(d => d.contact_id === id));

  if (!contact) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Contact not found</p>
        <Link to="/contacts" className="text-blue-600 hover:underline">← Back to Contacts</Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm('Delete this contact?')) {
      store.deleteContact(contact.id);
      navigate('/contacts');
    }
  };

  const statusColors: Record<string, string> = {
    lead: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    prospect: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    customer: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    partner: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    vendor: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/contacts" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Contacts
        </Link>
        <div className="flex gap-2">
          <button onClick={handleDelete} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800 text-red-600 text-sm hover:bg-red-50 dark:hover:bg-red-900/20">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      {/* Contact Card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {contact.first_name[0]}{contact.last_name?.[0] || ''}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{contact.first_name} {contact.last_name}</h1>
              <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColors[contact.status]}`}>{contact.status}</span>
            </div>
            {contact.title && <p className="text-gray-500 dark:text-gray-400 mt-1">{contact.title}</p>}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {contact.email && (
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">{contact.email}</a>
            </div>
          )}
          {contact.phone && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <a href={`tel:${contact.phone}`} className="text-gray-700 dark:text-gray-300">{contact.phone}</a>
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
            <span className="text-gray-500">Created {format(new Date(contact.created_at), 'MMM d, yyyy')}</span>
          </div>
        </div>

        {contact.tags && contact.tags.length > 0 && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-gray-400" />
            {contact.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">{tag}</span>
            ))}
          </div>
        )}

        {contact.notes && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs font-medium text-gray-500 uppercase mb-2">Notes</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{contact.notes}</p>
          </div>
        )}
      </div>

      {/* Related Deals */}
      {deals.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5" /> Related Deals ({deals.length})
          </h2>
          <div className="space-y-2">
            {deals.map(deal => (
              <Link key={deal.id} to={`/deals/${deal.id}`} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{deal.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{deal.stage.replace('_', ' ')}</p>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">${deal.value.toLocaleString()}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Related Activities */}
      {activities.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activities ({activities.length})</h2>
          <div className="space-y-2">
            {activities.slice(0, 5).map(activity => (
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
