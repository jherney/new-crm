import { useState } from 'react';
import { useStore, store } from '../store';
import { Company } from '../types';
import { Plus, Search, Globe, Phone, Edit, Trash2, X, MapPin } from 'lucide-react';

export default function CompaniesPage() {
  const companies = useStore(() => store.getCompanies());
  const contacts = useStore(() => store.getContacts());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const filtered = companies.filter(c => {
    const matchSearch = !search || `${c.name} ${c.industry}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getContactCount = (id: string) => contacts.filter(c => c.company_id === id).length;

  const statusColors: Record<string, string> = {
    prospect: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    customer: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    partner: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    vendor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    competitor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Companies</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{companies.length} total companies</p>
        </div>
        <button onClick={() => { setEditingCompany(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Company
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search companies..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm outline-none">
          <option value="">All statuses</option>
          <option value="prospect">Prospect</option>
          <option value="customer">Customer</option>
          <option value="partner">Partner</option>
          <option value="vendor">Vendor</option>
          <option value="competitor">Competitor</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(company => (
          <div key={company.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{company.name}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{company.industry}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColors[company.status]}`}>{company.status}</span>
            </div>
            <div className="mt-4 space-y-2">
              {company.website && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Globe className="w-3.5 h-3.5" />
                  <span className="truncate">{company.website}</span>
                </div>
              )}
              {company.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{company.phone}</span>
                </div>
              )}
              {company.address && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate">{company.address}</span>
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <span className="text-xs text-gray-500">{getContactCount(company.id)} contacts</span>
              <div className="flex gap-1">
                <button onClick={() => { setEditingCompany(company); setShowForm(true); }} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => { if (confirm('Delete this company?')) store.deleteCompany(company.id); }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <div className="p-8 text-center text-gray-500 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">No companies found</div>}

      {showForm && (
        <CompanyForm
          company={editingCompany}
          onClose={() => setShowForm(false)}
          onSave={(data) => {
            if (editingCompany) store.updateCompany(editingCompany.id, data);
            else store.addCompany(data as any);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

function CompanyForm({ company, onClose, onSave }: { company: Company | null; onClose: () => void; onSave: (data: any) => void }) {
  const [form, setForm] = useState({
    name: company?.name || '',
    industry: company?.industry || '',
    website: company?.website || '',
    email: company?.email || '',
    phone: company?.phone || '',
    address: company?.address || '',
    status: company?.status || 'prospect' as const,
    tags: company?.tags?.join(', ') || '',
    notes: company?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [] });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{company ? 'Edit Company' : 'New Company'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Industry</label>
              <input value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option value="prospect">Prospect</option>
                <option value="customer">Customer</option>
                <option value="partner">Partner</option>
                <option value="vendor">Vendor</option>
                <option value="competitor">Competitor</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website</label>
              <input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
            <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma-separated)</label>
            <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 font-medium">{company ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
