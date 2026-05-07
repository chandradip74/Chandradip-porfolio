import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router';
import { Zap, Eye, EyeOff, Lock, Mail, Code2, Globe, Server, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@portfolio.dev');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  if (isAuthenticated) return <Navigate to="/" replace />;

  const validate = () => {
    const e: { email?: string; password?: string } = {};
    if (!email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email address';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const success = login(email, password);
    setLoading(false);
    if (success) {
      toast.success('Welcome back, Alex!');
      navigate('/');
    } else {
      toast.error('Invalid credentials. Try admin@portfolio.dev / admin123');
    }
  };

  const features = [
    { icon: Code2, label: 'Project Management', desc: 'Manage all your portfolio projects' },
    { icon: Globe, label: 'Media Library', desc: 'Centralized media management' },
    { icon: Server, label: 'Content CMS', desc: 'Full portfolio content control' },
    { icon: Shield, label: 'Secure Admin', desc: 'Protected admin dashboard' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white/20 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white/10 translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 right-0 w-60 h-60 rounded-full bg-white/10" />
        </div>

        {/* Content */}
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-xl font-semibold">AdminPanel</span>
          </div>
        </div>

        <div className="relative space-y-8">
          <div>
            <h1 className="text-white text-4xl font-bold leading-tight mb-4">
              Your Portfolio<br />Command Center
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              Manage your portfolio projects, technologies, services, and media from one powerful dashboard.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {features.map((f) => (
              <div key={f.label} className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
                <f.icon className="w-5 h-5 text-white/80 mb-2" />
                <p className="text-white text-sm font-medium">{f.label}</p>
                <p className="text-white/60 text-xs mt-0.5">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <p className="text-white/40 text-sm">© 2024 AdminPanel. Portfolio CMS.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-foreground text-xl font-semibold">AdminPanel</span>
          </div>

          <div className="mb-8">
            <h2 className="text-foreground text-3xl font-bold mb-2">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to your admin dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: undefined })); }}
                  placeholder="admin@portfolio.dev"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground transition-all ${errors.email ? 'border-destructive' : 'border-border'}`}
                />
              </div>
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: undefined })); }}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 text-sm bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground transition-all ${errors.password ? 'border-destructive' : 'border-border'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-border accent-primary"
                />
                <span className="text-sm text-foreground">Remember me</span>
              </label>
              <button type="button" className="text-sm text-blue-500 hover:text-blue-600 transition-colors">
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-xl border border-border">
            <p className="text-xs text-muted-foreground font-medium mb-1">Demo credentials:</p>
            <p className="text-xs text-foreground font-mono">admin@portfolio.dev / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
