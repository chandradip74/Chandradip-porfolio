import { useTheme } from 'next-themes';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  FolderOpen, Briefcase, Cpu, Trophy, MessageSquare, ImageIcon,
  TrendingUp, ArrowUpRight, ArrowDownRight, Clock, Plus,
} from 'lucide-react';

const monthlyData = [
  { month: 'Jan', uploads: 12, projects: 3, messages: 8 },
  { month: 'Feb', uploads: 19, projects: 5, messages: 12 },
  { month: 'Mar', uploads: 8, projects: 2, messages: 6 },
  { month: 'Apr', uploads: 25, projects: 7, messages: 18 },
  { month: 'May', uploads: 17, projects: 4, messages: 9 },
  { month: 'Jun', uploads: 30, projects: 8, messages: 22 },
  { month: 'Jul', uploads: 22, projects: 6, messages: 15 },
  { month: 'Aug', uploads: 35, projects: 9, messages: 28 },
  { month: 'Sep', uploads: 28, projects: 7, messages: 20 },
  { month: 'Oct', uploads: 42, projects: 10, messages: 31 },
  { month: 'Nov', uploads: 38, projects: 8, messages: 26 },
  { month: 'Dec', uploads: 50, projects: 12, messages: 35 },
];

const techDistribution = [
  { name: 'React', value: 35, color: '#61dafb' },
  { name: 'TypeScript', value: 25, color: '#3178c6' },
  { name: 'Node.js', value: 20, color: '#68a063' },
  { name: 'Python', value: 12, color: '#3776ab' },
  { name: 'Others', value: 8, color: '#6b7280' },
];

const recentActivity = [
  { id: 1, type: 'upload', title: 'AWS Certification uploaded', time: '2 minutes ago', icon: Trophy, color: 'text-yellow-500 bg-yellow-500/10' },
  { id: 2, type: 'project', title: 'Portfolio v3 project updated', time: '1 hour ago', icon: FolderOpen, color: 'text-blue-500 bg-blue-500/10' },
  { id: 3, type: 'message', title: 'New message from Sarah Connor', time: '3 hours ago', icon: MessageSquare, color: 'text-green-500 bg-green-500/10' },
  { id: 4, type: 'upload', title: 'CV_2024.pdf uploaded', time: '5 hours ago', icon: ImageIcon, color: 'text-purple-500 bg-purple-500/10' },
  { id: 5, type: 'project', title: 'E-Commerce App published', time: '1 day ago', icon: FolderOpen, color: 'text-blue-500 bg-blue-500/10' },
  { id: 6, type: 'upload', title: 'Profile photo updated', time: '2 days ago', icon: ImageIcon, color: 'text-teal-500 bg-teal-500/10' },
];

const stats = [
  { label: 'Total Projects', value: 12, change: +3, icon: FolderOpen, color: 'text-blue-500 bg-blue-500/10' },
  { label: 'Services', value: 6, change: +1, icon: Briefcase, color: 'text-purple-500 bg-purple-500/10' },
  { label: 'Technologies', value: 15, change: +2, icon: Cpu, color: 'text-green-500 bg-green-500/10' },
  { label: 'Achievements', value: 8, change: +1, icon: Trophy, color: 'text-yellow-500 bg-yellow-500/10' },
  { label: 'Messages', value: 24, change: -3, icon: MessageSquare, color: 'text-red-500 bg-red-500/10' },
  { label: 'Media Files', value: 47, change: +8, icon: ImageIcon, color: 'text-teal-500 bg-teal-500/10' },
];

export function DashboardPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const textColor = isDark ? '#9ca3af' : '#6b7280';

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Welcome back, Alex. Here's what's happening today.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Quick Add
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <div className={`flex items-center gap-0.5 text-xs font-medium ${stat.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(stat.change)}
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Upload activity chart */}
        <div className="xl:col-span-2 bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-foreground font-medium">Upload & Project Activity</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Monthly overview for 2024</p>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-500 rounded-lg text-xs font-medium">
              <TrendingUp className="w-3 h-3" /> +18%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="uploadsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="projectsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1c1c1c' : '#fff',
                  border: `1px solid ${isDark ? '#333' : '#e5e7eb'}`,
                  borderRadius: '10px',
                  color: isDark ? '#f9fafb' : '#111',
                  fontSize: 12,
                }}
              />
              <Area type="monotone" dataKey="uploads" stroke="#3b82f6" strokeWidth={2} fill="url(#uploadsGrad)" name="Uploads" />
              <Area type="monotone" dataKey="projects" stroke="#a855f7" strokeWidth={2} fill="url(#projectsGrad)" name="Projects" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Tech distribution */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="mb-4">
            <h3 className="text-foreground font-medium">Tech Distribution</h3>
            <p className="text-sm text-muted-foreground mt-0.5">By project usage</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={techDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
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
          <div className="space-y-1.5 mt-2">
            {techDistribution.map((t) => (
              <div key={t.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
                  <span className="text-xs text-muted-foreground">{t.name}</span>
                </div>
                <span className="text-xs font-medium text-foreground">{t.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Monthly messages bar chart */}
        <div className="xl:col-span-2 bg-card border border-border rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-foreground font-medium">Monthly Messages</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Incoming contact messages per month</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1c1c1c' : '#fff',
                  border: `1px solid ${isDark ? '#333' : '#e5e7eb'}`,
                  borderRadius: '10px',
                  color: isDark ? '#f9fafb' : '#111',
                  fontSize: 12,
                }}
              />
              <Bar dataKey="messages" fill="#10b981" radius={[4, 4, 0, 0]} name="Messages" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent activity */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground font-medium">Recent Activity</h3>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${item.color}`}>
                  <item.icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground leading-snug">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
