import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore, store } from '../store';
import { ArrowLeft, Globe, Phone, MapPin, Mail, Edit, Trash2, Tag, Users, FileText } from 'lucide-react';
import { format } from 'date-fns';

export default function CompanyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const company = useStore(() => store.getCompany(id || ''));
  const contacts = useStore(() => store.getContacts().filter(c => c.company_id === id));
  const deals = useStore(() => store.getDeals().filter(d => d.company_id === id));

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Company not found</p>
        <Link to="/companies" className="text-blue-600 hover:underline">← Back to Companies</Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm('Delete this company?')) {
      store.deleteCompany(company.id);
      navigate('/companies');
    }
  };

  const statusColors: Record<string, string> = {
    prospect: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    customer: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    partner: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    vendor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    competitor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/companies" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Companies
        </Link>
        <div className="flex gap-2">
          <button onClick={handleDelete} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800 text-red-600 text-sm hover:bg-red-50 dark:hover:bg-red-900/20">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      {/* Company Card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{company.name}</h1>
              <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColors[company.status]}`}>{company.status}</span>
            </div>
            {company.industry && <p className="text-gray-500 dark:text-gray-400 mt-1">{company.industry}</p>}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {company.website && (
            <div className="flex items-center gap-3 text-sm">
              <Globe className="w-4 h-4 text-gray-400" />
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{company.website}</a>
            </div>
          )}
          {company.email && (
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <a href={`mailto:${company.email}`} className="text-blue-600 hover:underline">{company.email}</a>
            </div>
          )}
          {company.phone && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <a href={`tel:${company.phone}`} className="text-gray-700 dark:text-gray-300">{company.phone}</a>
            </div>
          )}
          {company.address && (
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">{company.address}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500">Created {format(new Date(company.created_at), 'MMM d, yyyy')}</span>
          </div>
        </div>

        {company.tags && company.tags.length > 0 && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-gray-400" />
            {company.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">{tag}</span>
            ))}
          </div>
        )}

        {company.notes && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs font-medium text-gray-500 uppercase mb-2">Notes</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{company.notes}</p>
          </div>
        )}
      </div>

      {/* Contacts */}
      {contacts.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" /> Contacts ({contacts.length})
          </h2>
          <div className="space-y-2">
            {contacts.map(contact => (
              <Link key={contact.id} to={`/contacts/${contact.id}`} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {contact.first_name[0]}{contact.last_name?.[0] || ''}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{contact.first_name} {contact.last_name}</p>
                    <p className="text-xs text-gray-500">{contact.title || contact.email}</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 capitalize">{contact.status}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Deals */}
      {deals.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Deals ({deals.length})</h2>
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
    </div>
  );
}
