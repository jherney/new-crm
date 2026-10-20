import { Activity, Event, Deal, Pipeline, stageMeta } from '../types';
import { useStore, store } from '../store';
import { format, isValid } from 'date-fns';
import { Phone, Mail, Calendar, CheckSquare, StickyNote, Briefcase, Users } from 'lucide-react';

type TimelineItemKind = 'activity' | 'event' | 'deal';

interface TimelineItem {
  id: string;
  date: string;
  kind: TimelineItemKind;
  label: string;
  title: string;
  detail: string;
  isCompleted: boolean;
  dotColor: string;
  icon: React.ReactNode;
}

const ACTIVITY_COLORS: Record<Activity['type'], string> = {
  call: '#22c55e',
  email: '#3b82f6',
  meeting: '#a855f7',
  task: '#f97316',
  note: '#9ca3af',
};

const EVENT_COLOR = '#ec4899';

const ACTIVITY_ICONS: Record<Activity['type'], React.ReactNode> = {
  call: <Phone className="w-3.5 h-3.5" />,
  email: <Mail className="w-3.5 h-3.5" />,
  meeting: <Calendar className="w-3.5 h-3.5" />,
  task: <CheckSquare className="w-3.5 h-3.5" />,
  note: <StickyNote className="w-3.5 h-3.5" />,
};

function toTimestamp(date: string): number {
  const time = new Date(date).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function formatItemDate(date: string): string {
  const parsed = new Date(date);
  return isValid(parsed) ? format(parsed, 'MMM d, yyyy') : 'No date';
}

function buildTimelineItems(activities: Activity[], events: Event[], deals: Deal[], pipelines: Pipeline[]): TimelineItem[] {
  const pipelineById = new Map(pipelines.map(p => [p.id, p]));

  const activityItems = activities.map((a): TimelineItem => ({
    id: a.id,
    date: a.due_date || a.created_at,
    kind: 'activity',
    label: a.type,
    title: a.subject,
    detail: a.body || a.outcome,
    isCompleted: a.completed,
    dotColor: ACTIVITY_COLORS[a.type],
    icon: ACTIVITY_ICONS[a.type],
  }));

  const eventItems = events.map((e): TimelineItem => ({
    id: e.id,
    date: e.start_date,
    kind: 'event',
    label: 'event',
    title: e.title,
    detail: e.location || e.description,
    isCompleted: false,
    dotColor: EVENT_COLOR,
    icon: <Users className="w-3.5 h-3.5 text-gray-500" />,
  }));

  const dealItems = deals.map((d): TimelineItem => {
    const stage = stageMeta(d.stage, pipelineById.get(d.pipeline_id));
    return {
      id: d.id,
      date: d.expected_close_date || d.created_at,
      kind: 'deal',
      label: 'deal',
      title: d.name,
      detail: `$${d.value.toLocaleString()} · ${stage.label}`,
      isCompleted: false,
      dotColor: stage.color,
      icon: <Briefcase className="w-3.5 h-3.5 text-gray-500" />,
    };
  });

  return [...activityItems, ...eventItems, ...dealItems].sort((a, b) => toTimestamp(b.date) - toTimestamp(a.date));
}

interface ActivityTimelineProps {
  activities: Activity[];
  deals: Deal[];
  events?: Event[];
}

export default function ActivityTimeline({ activities, deals, events = [] }: ActivityTimelineProps) {
  const pipelines = useStore(() => store.getPipelines());
  const items = buildTimelineItems(activities, events, deals, pipelines);

  if (items.length === 0) {
    return <p className="text-sm text-gray-600 dark:text-gray-400">No activity yet</p>;
  }

  return (
    <div className="relative">
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
      <ol className="space-y-4">
        {items.map(item => (
          <li key={`${item.kind}-${item.id}`} className="relative flex gap-3 pl-6">
            <span
              className="absolute left-0 top-1 w-[15px] h-[15px] rounded-full border-2 border-white dark:border-gray-900"
              style={{ backgroundColor: item.dotColor }}
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-gray-500">
                {item.icon}
                <p className={`text-sm font-medium truncate ${item.isCompleted ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>{item.title}</p>
              </div>
              {item.detail && <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">{item.detail}</p>}
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 capitalize">{item.label} · {formatItemDate(item.date)}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
