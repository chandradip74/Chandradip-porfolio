import { useState } from 'react';
import { Sun, Moon, Monitor, Save, LogOut, Shield, Database, Cloud, Bell, Key, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export function SettingsPage() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState(user?.username || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [messageAlerts, setMessageAlerts] = useState(true);
  const [cloudinaryKey, setCloudinaryKey] = useState('YOUR_CLOUDINARY_API_KEY');
  const [cloudinarySecret, setCloudinarySecret] = useState('••••••••••••••••••••••••');
  const [mongoUri, setMongoUri] = useState('mongodb+srv://user:••••••••@cluster.mongodb.net/portfolio');

  const handleSaveAccount = async () => {
    if (!username.trim()) { toast.error('Username is required'); return; }
    try {
      await api.put('/auth/profile', { username });
      user && logout(); // Force re-login if username changes? Or use AuthContext updateUser
      toast.success('Account settings saved! Please log in again.');
      navigate('/login');
    } catch (e: any) {
      toast.error(e.message || 'Failed to update account');
    }
  };

  const handleSavePassword = async () => {
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return; }
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    try {
      await api.put('/auth/profile', { password: newPassword });
      toast.success('Password updated successfully! Please log in again.');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      logout();
      navigate('/login');
    } catch (e: any) {
      toast.error(e.message || 'Failed to update password');
    }
  };

  const handleLogout = () => { logout(); toast.success('Logged out'); navigate('/login'); };

  const Section = ({ title, description, children }: { title: string; description: string; children: React.ReactNode }) => (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-foreground font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-primary' : 'bg-muted'}`}
      style={{ height: '22px' }}
    >
      <div className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} style={{ width: '18px', height: '18px' }} />
    </button>
  );

  const StatusBadge = ({ ok }: { ok: boolean }) => (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${ok ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
      {ok ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
      {ok ? 'Connected' : 'Disconnected'}
    </div>
  );

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account and application settings</p>
      </div>

      {/* Theme */}
      <Section title="Appearance" description="Customize the look and feel of your dashboard">
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: 'light', label: 'Light', icon: Sun },
            { key: 'dark', label: 'Dark', icon: Moon },
            { key: 'system', label: 'System', icon: Monitor },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setTheme(opt.key)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                theme === opt.key
                  ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/50'
              }`}
            >
              <opt.icon className="w-5 h-5 text-foreground" />
              <span className="text-sm font-medium text-foreground">{opt.label}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* Account */}
      <Section title="Account Information" description="Update your personal details">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground" />
            </div>
          </div>
          <button onClick={handleSaveAccount} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </Section>

      {/* Password */}
      <Section title="Change Password" description="Update your account password">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground" />
            </div>
          </div>
          <button onClick={handleSavePassword} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <Shield className="w-4 h-4" /> Update Password
          </button>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" description="Configure your notification preferences">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Email Notifications</p>
              <p className="text-xs text-muted-foreground mt-0.5">Receive email updates for new messages and activity</p>
            </div>
            <Toggle checked={emailNotifications} onChange={setEmailNotifications} />
          </div>
          <div className="border-t border-border" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Message Alerts</p>
              <p className="text-xs text-muted-foreground mt-0.5">Get notified when you receive new contact messages</p>
            </div>
            <Toggle checked={messageAlerts} onChange={setMessageAlerts} />
          </div>
        </div>
      </Section>

      {/* API Configuration */}
      <Section title="API Configuration" description="Configure your external service integrations">
        <div className="space-y-5">
          {/* Cloudinary */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Cloudinary (Media Storage)</p>
              </div>
              <StatusBadge ok={true} />
            </div>
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">API Key</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input type="text" value={cloudinaryKey} onChange={(e) => setCloudinaryKey(e.target.value)} className="w-full pl-8 pr-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground font-mono" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">API Secret</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input type="password" value={cloudinarySecret} onChange={(e) => setCloudinarySecret(e.target.value)} className="w-full pl-8 pr-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground" />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border" />

          {/* MongoDB */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">MongoDB (Database)</p>
              </div>
              <StatusBadge ok={true} />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Connection URI</label>
              <input type="text" value={mongoUri} onChange={(e) => setMongoUri(e.target.value)} className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground font-mono" />
            </div>
          </div>

          <button onClick={() => toast.success('API settings saved!')} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <Save className="w-4 h-4" /> Save API Settings
          </button>
        </div>
      </Section>

      {/* Danger zone */}
      <div className="bg-card border border-destructive/30 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-destructive/30">
          <h3 className="text-foreground font-medium">Danger Zone</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Actions here are irreversible</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Sign Out</p>
              <p className="text-xs text-muted-foreground mt-0.5">Sign out of your admin account</p>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-accent transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
          <div className="border-t border-border" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-500">Clear All Data</p>
              <p className="text-xs text-muted-foreground mt-0.5">Permanently delete all portfolio data. This cannot be undone.</p>
            </div>
            <button
              onClick={() => toast.error('This action is disabled in demo mode')}
              className="flex items-center gap-2 px-4 py-2 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive hover:bg-destructive/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Clear Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
