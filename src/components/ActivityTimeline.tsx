import { Activity, Event, Deal, stageMeta } from '../types';
import { store } from '../store';
import { format } from 'date-fns';
import { Phone, Mail, Calendar, CheckSquare, StickyNote, Briefcase, Users } from 'lucide-react';

type TimelineItem = {
  id: string;
  date: string;
  kind: 'activity' | 'event' | 'deal';
  type: string;
  title: string;
  detail: string;
  completed?: boolean;
  color: string;
};

const activityColor: Record<string, string> = {
  call: 'bg-green-500',
  email: 'bg-blue-500',
  meeting: 'bg-purple-500',
  task: 'bg-orange-500',
  note: 'bg-gray-400',
};

const activityIcon: Record<string, React.ReactNode> = {
  call: <Phone className="w-3.5 h-3.5" />,
  email: <Mail className="w-3.5 h-3.5" />,
  meeting: <Calendar className="w-3.5 h-3.5" />,
  task: <CheckSquare className="w-3.5 h-3.5" />,
  note: <StickyNote className="w-3.5 h-3.5" />,
};

interface ActivityTimelineProps {
  activities: Activity[];
  deals: Deal[];
  events?: Event[];
}

export default function ActivityTimeline({ activities, deals, events = [] }: ActivityTimelineProps) {
  const items: TimelineItem[] = [
    ...activities.map(a => ({
      id: a.id,
      date: a.due_date || a.created_at,
      kind: 'activity' as const,
      type: a.type,
      title: a.subject,
      detail: a.body || a.outcome,
      completed: a.completed,
      color: activityColor[a.type] || 'bg-gray-400',
    })),
    ...events.map(e => ({
      id: e.id,
      date: e.start_date,
      kind: 'event' as const,
      type: e.type,
      title: e.title,
      detail: e.location || e.description,
      color: 'bg-pink-500',
    })),
    ...deals.map(d => ({
      id: d.id,
      date: d.expected_close_date || d.created_at,
      kind: 'deal' as const,
      type: d.stage,
      title: d.name,
      detail: `$${d.value.toLocaleString()} · ${stageMeta(d.stage, store.getPipeline(d.pipeline_id)).label}`,
      color: stageMeta(d.stage, store.getPipeline(d.pipeline_id)).color,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (items.length === 0) {
    return <p className="text-sm text-gray-500">No activity yet</p>;
  }

  return (
    <div className="relative">
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-700" />
      <div className="space-y-4">
        {items.map(item => (
          <div key={`${item.kind}-${item.id}`} className="relative flex gap-3 pl-6">
            <span className={`absolute left-0 top-1 w-[15px] h-[15px] rounded-full border-2 border-white dark:border-gray-900 ${item.color}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {item.kind === 'activity' && activityIcon[item.type]}
                {item.kind === 'event' && <Users className="w-3.5 h-3.5 text-gray-400" />}
                {item.kind === 'deal' && <Briefcase className="w-3.5 h-3.5 text-gray-400" />}
                <p className={`text-sm font-medium truncate ${item.completed ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>{item.title}</p>
              </div>
              {item.detail && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.detail}</p>}
              <p className="text-xs text-gray-400 mt-0.5 capitalize">{item.kind === 'activity' ? item.type : item.kind} · {format(new Date(item.date), 'MMM d, yyyy')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
