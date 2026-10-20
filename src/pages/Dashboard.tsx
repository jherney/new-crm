import { store, useStore } from '../store';
import { STAGE_WON, STAGE_LOST } from '../types';
import { isClosedStage } from '../lib/pipeline-stages';
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { format } from 'date-fns';
import { formatCompactCurrency } from '../lib/currency-format';
import { buildRevenueForecast } from '../lib/revenue-forecast';
import { periodTrend } from '../lib/period-trend';

export default function Dashboard() {
  const allContacts = useStore(() => store.getContacts());
  const allCompanies = useStore(() => store.getCompanies());
  const allDeals = useStore(() => store.getDeals());
  const allActivities = useStore(() => store.getActivities());
  const allEvents = useStore(() => store.getEvents());

  const totalValue = allDeals.reduce((s, d) => s + (d.value || 0), 0);
  const wonValue = allDeals.filter(d => d.stage === STAGE_WON).reduce((s, d) => s + (d.value || 0), 0);
  const weightedValue = allDeals.reduce((s, d) => s + (d.value || 0) * (d.probability || 0) / 100, 0);
  const openDeals = allDeals.filter(d => !isClosedStage(d.stage));
  const upcomingActivities = allActivities.filter(a => !a.completed && a.due_date).sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime()).slice(0, 5);

  const allPipelines = useStore(() => store.getPipelines());
  const hasMultiplePipelines = allPipelines.length > 1;
  const stageRows = allPipelines.flatMap(pipeline => pipeline.stages.map(stage => ({
    pipeline,
    stage,
    label: hasMultiplePipelines ? `${pipeline.name}: ${stage.label}` : stage.label,
    deals: allDeals.filter(d => d.pipeline_id === pipeline.id && d.stage === stage.key),
  })));

  const pipelineData = stageRows.filter(r => !r.stage.is_won && !r.stage.is_lost).map(r => ({
    name: r.label,
    value: r.deals.reduce((s, d) => s + (d.value || 0), 0),
    count: r.deals.length,
    color: r.stage.color,
  }));

  const stageDistribution = stageRows.map(r => ({
    name: r.label,
    value: r.deals.length,
    color: r.stage.color,
  })).filter(s => s.value > 0);

  const contactStatusData = ['lead', 'prospect', 'customer', 'partner', 'vendor'].map(status => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: allContacts.filter(c => c.status === status).length,
  })).filter(s => s.value > 0);

  const statusColors = ['#7c7cff', '#5a8dee', '#2ecc71', '#f2a93b', '#e96d6d'];
  const closedDeals = allDeals.filter(d => [STAGE_WON, STAGE_LOST].includes(d.stage));
  const winRate = closedDeals.length > 0 ? Math.round((allDeals.filter(d => d.stage === STAGE_WON).length / closedDeals.length) * 100) : 0;

  const forecastData = buildRevenueForecast(allDeals);

  const pipelineValueTrend = periodTrend(allDeals, d => d.created_at, d => d.value || 0);
  const wonRevenueTrend = periodTrend(allDeals.filter(d => d.stage === STAGE_WON), d => d.closed_at, d => d.value || 0);
  const contactsTrend = periodTrend(allContacts, c => c.created_at, () => 1);
  const openDealsTrend = periodTrend(openDeals, d => d.created_at, () => 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of your CRM performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<DollarSign className="w-5 h-5" />} label="Pipeline Value" value={formatCompactCurrency(totalValue)} sub={`Weighted: ${formatCompactCurrency(weightedValue)}`} color="blue" trend={pipelineValueTrend} />
        <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Won Revenue" value={formatCompactCurrency(wonValue)} sub={`${allDeals.filter(d => d.stage === STAGE_WON).length} deals closed`} color="green" trend={wonRevenueTrend} />
        <StatCard icon={<Users className="w-5 h-5" />} label="Contacts" value={allContacts.length.toString()} sub={`${allCompanies.length} companies`} color="purple" trend={contactsTrend} />
        <StatCard icon={<Target className="w-5 h-5" />} label="Open Deals" value={openDeals.length.toString()} sub="Active pipeline" color="orange" trend={openDealsTrend} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pipeline by Stage</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={pipelineData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" interval={0} angle={-35} textAnchor="end" height={80} />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={formatCompactCurrency} />
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
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Deal Distribution</h2>
          <ul className="sr-only">
            {stageDistribution.map(s => <li key={s.name}>{s.name}: {s.value} deals</li>)}
          </ul>
          <div className="flex items-center justify-center" aria-hidden="true">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart accessibilityLayer={false}>
                <Pie rootTabIndex={-1} data={stageDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
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

{/* Revenue Forecast */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Forecast</h2>
        {forecastData.length === 0 ? (
          <p className="text-sm text-gray-500">No open deals with close dates to forecast</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="expectedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5a8dee" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#5a8dee" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="weightedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2ecc71" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#2ecc71" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={formatCompactCurrency} />
              <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
              <Area type="monotone" dataKey="expected" name="Expected" stroke="#5a8dee" fill="url(#expectedGrad)" />
              <Area type="monotone" dataKey="weighted" name="Weighted" stroke="#2ecc71" fill="url(#weightedGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Activities</h2>
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
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h2>
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

function StatCard({ icon, label, value, sub, color, trend }: { icon: React.ReactNode; label: string; value: string; sub: string; color: string; trend: number | null }) {
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
        {trend !== null && (
          <div
            className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}
            title="Change vs the previous 30 days"
          >
            <span aria-hidden="true">{trend >= 0 ? '↑' : '↓'}</span>
            {Math.abs(trend)}%
            <span className="sr-only">{trend >= 0 ? 'up' : 'down'} vs the previous 30 days</span>
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{sub}</p>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{label}</p>
    </div>
  );
}
