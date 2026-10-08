import { useState } from 'react';
import { useStore, store } from '../store';
import { Event } from '../types';
import { Plus, Search, X, Calendar, MapPin, Users, Edit, Trash2 } from 'lucide-react';
import { format, isFuture } from 'date-fns';

export default function EventsPage() {
  const events = useStore(() => store.getEvents());
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const filtered = events.filter(e => {
    const matchSearch = !search || `${e.title} ${e.description} ${e.location}`.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || e.type === typeFilter;
    return matchSearch && matchType;
  }).sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

  const typeColors: Record<string, string> = {
    webinar: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    conference: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    meetup: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    workshop: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    other: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  };

  const upcomingCount = events.filter(e => isFuture(new Date(e.start_date))).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Events</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{events.length} events · {upcomingCount} upcoming</p>
        </div>
        <button onClick={() => { setEditingEvent(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> New Event
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm outline-none">
          <option value="">All types</option>
          <option value="webinar">Webinar</option>
          <option value="conference">Conference</option>
          <option value="meetup">Meetup</option>
          <option value="workshop">Workshop</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(event => {
          const isUpcoming = isFuture(new Date(event.start_date));
          return (
            <div key={event.id} className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow ${!isUpcoming ? 'opacity-70' : ''}`}>
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${typeColors[event.type]}`}>{event.type}</span>
                  <h3 className="font-semibold text-gray-900 dark:text-white mt-2">{event.title}</h3>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditingEvent(event); setShowForm(true); }} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => { if (confirm('Delete?')) store.deleteEvent(event.id); }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {event.description && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{event.description}</p>}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(event.start_date), 'MMM d, yyyy · h:mm a')}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{event.rsvps} RSVPs</span>
                </div>
              </div>
              {!isUpcoming && (
                <div className="mt-3">
                  <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">Past event</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <div className="p-8 text-center text-gray-500 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">No events found</div>
      )}

      {showForm && (
        <EventForm
          event={editingEvent}
          onClose={() => setShowForm(false)}
          onSave={(data) => {
            if (editingEvent) store.updateEvent(editingEvent.id, data);
            else store.addEvent(data as any);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

function EventForm({ event, onClose, onSave }: { event: Event | null; onClose: () => void; onSave: (data: any) => void }) {
  const [form, setForm] = useState({
    title: event?.title || '',
    description: event?.description || '',
    start_date: event?.start_date ? event.start_date.slice(0, 16) : '',
    end_date: event?.end_date ? event.end_date.slice(0, 16) : '',
    location: event?.location || '',
    type: event?.type || 'other' as Event['type'],
    rsvps: event?.rsvps?.toString() || '0',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      start_date: form.start_date ? new Date(form.start_date).toISOString() : '',
      end_date: form.end_date ? new Date(form.end_date).toISOString() : '',
      rsvps: parseInt(form.rsvps) || 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{event ? 'Edit Event' : 'New Event'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
            <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Event['type'] })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option value="webinar">Webinar</option>
                <option value="conference">Conference</option>
                <option value="meetup">Meetup</option>
                <option value="workshop">Workshop</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">RSVPs</label>
              <input type="number" value={form.rsvps} onChange={e => setForm({ ...form, rsvps: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date *</label>
              <input required type="datetime-local" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
              <input type="datetime-local" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
            <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. San Francisco, CA or Virtual" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 font-medium">{event ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
