import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import {
  FolderOpen, Briefcase, Cpu, Trophy, MessageSquare, GitBranch,
  TrendingUp, ArrowUpRight, Clock, Loader2,
} from 'lucide-react';
import { api } from '../lib/api';

interface Stats {
  projects: number;
  services: number;
  technologies: number;
  achievements: number;
  messages: number;
  journeys: number;
}

const techDistribution = [
  { name: 'React', value: 35, color: '#61dafb' },
  { name: 'TypeScript', value: 25, color: '#3178c6' },
  { name: 'Node.js', value: 20, color: '#68a063' },
  { name: 'Python', value: 12, color: '#3776ab' },
  { name: 'Others', value: 8, color: '#6b7280' },
];

export function DashboardPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const textColor = isDark ? '#9ca3af' : '#6b7280';

  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    api.get('/stats')
      .then(setStats)
      .catch(() => {})
      .finally(() => setStatsLoading(false));

    Promise.all([
      api.get('/contact'),
      api.get('/projects'),
    ])
      .then(([msgs, projs]) => {
        setRecentMessages(msgs.slice(0, 3));
        setRecentProjects(projs.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setActivityLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Projects', value: stats.projects, icon: FolderOpen, color: 'text-blue-500 bg-blue-500/10' },
    { label: 'Services', value: stats.services, icon: Briefcase, color: 'text-purple-500 bg-purple-500/10' },
    { label: 'Technologies', value: stats.technologies, icon: Cpu, color: 'text-green-500 bg-green-500/10' },
    { label: 'Achievements', value: stats.achievements, icon: Trophy, color: 'text-yellow-500 bg-yellow-500/10' },
    { label: 'Messages', value: stats.messages, icon: MessageSquare, color: 'text-red-500 bg-red-500/10' },
    { label: 'Journey Steps', value: stats.journeys, icon: GitBranch, color: 'text-teal-500 bg-teal-500/10' },
  ] : [];

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Welcome back! Here's an overview of your portfolio.</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg text-xs font-medium">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Backend Connected
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statsLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 animate-pulse">
              <div className="w-9 h-9 rounded-lg bg-muted mb-3" />
              <div className="h-6 bg-muted rounded mb-1" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </div>
          ))
        ) : (
          statCards.map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-0.5 text-xs font-medium text-green-500">
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Pie Chart */}
        <div className="xl:col-span-1 bg-card border border-border rounded-xl p-6">
          <div className="mb-4">
            <h3 className="text-foreground font-medium">Portfolio Breakdown</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Items by category</p>
          </div>
          {statsLoading || !stats ? (
            <div className="flex items-center justify-center h-40"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Projects', value: stats.projects, color: '#3b82f6' },
                      { name: 'Services', value: stats.services, color: '#a855f7' },
                      { name: 'Technologies', value: stats.technologies, color: '#22c55e' },
                      { name: 'Achievements', value: stats.achievements, color: '#eab308' },
                      { name: 'Messages', value: stats.messages, color: '#ef4444' },
                    ]}
                    cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}
                  >
                    {[
                      { name: 'Projects', value: stats.projects, color: '#3b82f6' },
                      { name: 'Services', value: stats.services, color: '#a855f7' },
                      { name: 'Technologies', value: stats.technologies, color: '#22c55e' },
                      { name: 'Achievements', value: stats.achievements, color: '#eab308' },
                      { name: 'Messages', value: stats.messages, color: '#ef4444' },
                    ].map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1c1c1c' : '#fff',
                      border: `1px solid ${isDark ? '#333' : '#e5e7eb'}`,
                      borderRadius: '10px',
                      fontSize: 12,
                      color: isDark ? '#f9fafb' : '#111',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {[
                  { name: 'Projects', value: stats.projects, color: '#3b82f6' },
                  { name: 'Services', value: stats.services, color: '#a855f7' },
                  { name: 'Technologies', value: stats.technologies, color: '#22c55e' },
                  { name: 'Achievements', value: stats.achievements, color: '#eab308' },
                  { name: 'Messages', value: stats.messages, color: '#ef4444' },
                ].map((t) => (
                  <div key={t.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
                      <span className="text-xs text-muted-foreground">{t.name}</span>
                    </div>
                    <span className="text-xs font-medium text-foreground">{t.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Tech Distribution */}
        <div className="xl:col-span-2 bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-foreground font-medium">Tech Distribution</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Skills breakdown by usage</p>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-500 rounded-lg text-xs font-medium">
              <TrendingUp className="w-3 h-3" /> Growing
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={techDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={3}>
                {techDistribution.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1c1c1c' : '#fff',
                  border: `1px solid ${isDark ? '#333' : '#e5e7eb'}`,
                  borderRadius: '10px',
                  fontSize: 12,
                  color: isDark ? '#f9fafb' : '#111',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
            {techDistribution.map((t) => (
              <div key={t.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
                <span className="text-xs text-muted-foreground">{t.name} <span className="font-medium text-foreground">{t.value}%</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Recent Messages */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground font-medium">Recent Messages</h3>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </div>
          {activityLoading ? (
            <div className="flex items-center justify-center h-24"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
          ) : recentMessages.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No messages yet</p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div key={msg._id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-white font-medium">{msg.firstName[0]}{msg.lastName[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">{msg.firstName} {msg.lastName}</p>
                    <p className="text-xs text-muted-foreground truncate">{msg.description}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{formatDate(msg.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Projects */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground font-medium">Recent Projects</h3>
            <FolderOpen className="w-4 h-4 text-muted-foreground" />
          </div>
          {activityLoading ? (
            <div className="flex items-center justify-center h-24"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
          ) : recentProjects.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No projects yet</p>
          ) : (
            <div className="space-y-3">
              {recentProjects.map((proj) => (
                <div key={proj._id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {proj.image ? (
                      <img src={proj.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <FolderOpen className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">{proj.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{proj.description}</p>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {proj.technologies.slice(0, 3).map((t: string) => (
                        <span key={t} className="px-1.5 py-0.5 bg-accent text-accent-foreground rounded text-xs">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
