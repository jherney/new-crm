import { useState } from 'react';
import { X } from 'lucide-react';
import { useEscapeKey } from '../hooks/use-escape-key';

interface PipelineFormProps {
  onClose: () => void;
  onSave: (name: string, stageLabels: string[]) => boolean;
}

export default function PipelineForm({ onClose, onSave }: PipelineFormProps) {
  useEscapeKey(onClose);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [stages, setStages] = useState('Lead\nContacted\nProposal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isSaved = onSave(name.trim(), stages.split('\n'));
    if (!isSaved) setError('Add at least one stage name other than Closed Won or Closed Lost.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="pipeline-form-title">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 id="pipeline-form-title" className="text-lg font-semibold text-gray-900 dark:text-white">New Pipeline</h2>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="pipeline-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pipeline Name *</label>
            <input id="pipeline-name" required autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Partnerships" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="pipeline-stages" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stages (one per line) *</label>
            <textarea id="pipeline-stages" required rows={5} value={stages} onChange={e => { setStages(e.target.value); setError(''); }} aria-invalid={error !== ''} aria-describedby="pipeline-stages-help pipeline-stages-error" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            <p id="pipeline-stages-help" className="text-xs text-gray-600 dark:text-gray-400 mt-1">Closed Won and Closed Lost are added automatically.</p>
            <p id="pipeline-stages-error" role="alert" className="text-xs text-red-700 dark:text-red-400 mt-1">{error}</p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 font-medium">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}
