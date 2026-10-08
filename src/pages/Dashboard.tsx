import { store, useStore } from '../store';
import { DEAL_STAGES } from '../types';
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';

export default function Dashboard() {
  const allContacts = useStore(() => store.getContacts());
  const allCompanies = useStore(() => store.getCompanies());
  const allDeals = useStore(() => store.getDeals());
  const allActivities = useStore(() => store.getActivities());
  const allEvents = useStore(() => store.getEvents());

  const totalValue = allDeals.reduce((s, d) => s + (d.value || 0), 0);
  const wonValue = allDeals.filter(d => d.stage === 'closed_won').reduce((s, d) => s + (d.value || 0), 0);
  const weightedValue = allDeals.reduce((s, d) => s + (d.value || 0) * (d.probability || 0) / 100, 0);
  const openDeals = allDeals.filter(d => !['closed_won', 'closed_lost'].includes(d.stage));
  const upcomingActivities = allActivities.filter(a => !a.completed && a.due_date).sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime()).slice(0, 5);

  const pipelineData = DEAL_STAGES.filter(s => !s.is_won && !s.is_lost).map(stage => ({
    name: stage.label,
    value: allDeals.filter(d => d.stage === stage.key).reduce((s, d) => s + (d.value || 0), 0),
    count: allDeals.filter(d => d.stage === stage.key).length,
    color: stage.color,
  }));

  const stageDistribution = DEAL_STAGES.map(stage => ({
    name: stage.label,
    value: allDeals.filter(d => d.stage === stage.key).length,
    color: stage.color,
  })).filter(s => s.value > 0);

  const contactStatusData = ['lead', 'prospect', 'customer', 'partner', 'vendor'].map(status => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: allContacts.filter(c => c.status === status).length,
  })).filter(s => s.value > 0);

  const statusColors = ['#7c7cff', '#5a8dee', '#2ecc71', '#f2a93b', '#e96d6d'];
  const closedDeals = allDeals.filter(d => ['closed_won', 'closed_lost'].includes(d.stage));
  const winRate = closedDeals.length > 0 ? Math.round((allDeals.filter(d => d.stage === 'closed_won').length / closedDeals.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of your CRM performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<DollarSign className="w-5 h-5" />} label="Pipeline Value" value={`$${(totalValue / 1000).toFixed(0)}K`} sub={`Weighted: $${(weightedValue / 1000).toFixed(0)}K`} color="blue" trend={12} />
        <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Won Revenue" value={`$${(wonValue / 1000).toFixed(0)}K`} sub={`${allDeals.filter(d => d.stage === 'closed_won').length} deals closed`} color="green" trend={8} />
        <StatCard icon={<Users className="w-5 h-5" />} label="Contacts" value={allContacts.length.toString()} sub={`${allCompanies.length} companies`} color="purple" trend={5} />
        <StatCard icon={<Target className="w-5 h-5" />} label="Open Deals" value={openDeals.length.toString()} sub="Active pipeline" color="orange" trend={-2} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pipeline by Stage</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={pipelineData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {pipelineData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Deal Distribution</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={stageDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {stageDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Activities</h3>
          <div className="space-y-3">
            {upcomingActivities.length === 0 && <p className="text-gray-500 text-sm">No upcoming activities</p>}
            {upcomingActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className={`w-2 h-2 rounded-full ${activity.type === 'call' ? 'bg-green-500' : activity.type === 'email' ? 'bg-blue-500' : activity.type === 'meeting' ? 'bg-purple-500' : 'bg-orange-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{activity.subject}</p>
                  <p className="text-xs text-gray-500">{activity.due_date ? format(new Date(activity.due_date), 'MMM d, h:mm a') : ''}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 capitalize">{activity.type}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Win Rate</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{winRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Avg Deal Size</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">${allDeals.length > 0 ? Math.round(totalValue / allDeals.length).toLocaleString() : 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Activities Pending</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{allActivities.filter(a => !a.completed).length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Upcoming Events</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{allEvents.length}</span>
            </div>
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Contact Status</span>
              </div>
              <div className="mt-2 space-y-2">
                {contactStatusData.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColors[i] }} />
                    <span className="text-xs text-gray-600 dark:text-gray-400 flex-1">{s.name}</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, color, trend }: { icon: React.ReactNode; label: string; value: string; sub: string; color: string; trend: number }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg ${colorMap[color]}`}>{icon}</div>
        <div className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend >= 0 ? '↑' : '↓'}{Math.abs(trend)}%
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{sub}</p>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{label}</p>
    </div>
  );
}
