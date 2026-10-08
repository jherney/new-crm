import { useState } from 'react';
import { useStore, store } from '../store';
import { EmailTemplate } from '../types';
import { Plus, Search, X, Mail, Copy, Eye, Edit, Trash2 } from 'lucide-react';

export default function TemplatesPage() {
  const templates = useStore(() => store.getTemplates());
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const categories = [...new Set(templates.map(t => t.category).filter(Boolean))];

  const filtered = templates.filter(t => {
    const matchSearch = !search || `${t.name} ${t.subject}`.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !categoryFilter || t.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const handleCopy = (template: EmailTemplate) => {
    const text = `Subject: ${template.subject}\n\n${template.body}`;
    navigator.clipboard.writeText(text);
    setCopied(template.id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Email Templates</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{templates.length} templates</p>
        </div>
        <button onClick={() => { setEditingTemplate(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> New Template
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search templates..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm outline-none">
          <option value="">All categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(template => (
          <div key={template.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{template.name}</h3>
                  <span className="text-xs text-gray-500 capitalize">{template.category}</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setPreviewTemplate(template)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors" title="Preview">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => handleCopy(template)} className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors" title="Copy">
                  <Copy className="w-4 h-4" />
                </button>
                <button onClick={() => { setEditingTemplate(template); setShowForm(true); }} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors" title="Edit">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => { if (confirm('Delete?')) store.deleteTemplate(template.id); }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject: {template.subject}</p>
              <p className="text-sm text-gray-500 mt-1 line-clamp-3 whitespace-pre-wrap">{template.body}</p>
            </div>
            {copied === template.id && (
              <div className="mt-2 text-xs text-green-600 font-medium">✓ Copied to clipboard!</div>
            )}
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="p-8 text-center text-gray-500 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">No templates found</div>
      )}

      {showForm && (
        <TemplateForm
          template={editingTemplate}
          onClose={() => setShowForm(false)}
          onSave={(data) => {
            if (editingTemplate) store.updateTemplate(editingTemplate.id, data);
            else store.addTemplate(data as any);
            setShowForm(false);
          }}
        />
      )}

      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Preview: {previewTemplate.name}</h2>
              <button onClick={() => setPreviewTemplate(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Subject</label>
                <p className="text-gray-900 dark:text-white mt-1">{previewTemplate.subject}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Body</label>
                <pre className="text-sm text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-wrap font-sans bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">{previewTemplate.body}</pre>
              </div>
            </div>
            <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
              <button onClick={() => { handleCopy(previewTemplate); }} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 font-medium flex items-center gap-2">
                <Copy className="w-4 h-4" /> Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TemplateForm({ template, onClose, onSave }: { template: EmailTemplate | null; onClose: () => void; onSave: (data: any) => void }) {
  const [form, setForm] = useState({
    name: template?.name || '',
    subject: template?.subject || '',
    body: template?.body || '',
    category: template?.category || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{template ? 'Edit Template' : 'New Template'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Template Name *</label>
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. outreach, follow-up" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject *</label>
            <input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Use {{first_name}}, {{company}} for variables" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Body *</label>
            <textarea required value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} rows={8} placeholder="Use {{first_name}}, {{company}} for variables" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 font-medium">{template ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
