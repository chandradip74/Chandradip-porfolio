import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Zap, ArrowLeft, Lock, Eye, EyeOff, User, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../lib/api';

type Step = 'verify' | 'reset' | 'done';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('verify');

  // Step 1: Verify
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  // Step 2: Reset
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // We store the token after verification to use for the reset
  const [tempToken, setTempToken] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) { toast.error('Username is required'); return; }
    if (!currentPassword.trim()) { toast.error('Current password is required'); return; }
    setVerifyLoading(true);
    try {
      // Login to verify identity and get a token
      const data = await api.post('/auth/login', { username, password: currentPassword });
      setTempToken(data.token);
      toast.success('Identity verified! Now set your new password.');
      setStep('reset');
    } catch (e: any) {
      toast.error(e.message || 'Incorrect username or password');
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) { toast.error('New password is required'); return; }
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return; }
    if (currentPassword === newPassword) { toast.error('New password must be different from current password'); return; }

    setResetLoading(true);
    try {
      // Temporarily store token so api interceptor picks it up
      const prevToken = localStorage.getItem('adminToken');
      localStorage.setItem('adminToken', tempToken);

      await api.put('/auth/change-password', { currentPassword, newPassword });

      // Restore or remove token — force fresh login
      if (prevToken) localStorage.removeItem('adminToken');

      setStep('done');
    } catch (e: any) {
      toast.error(e.message || 'Failed to reset password');
    } finally {
      setResetLoading(false);
    }
  };

  const passwordStrength = (pwd: string) => {
    if (!pwd) return null;
    if (pwd.length < 6) return { label: 'Too short', color: 'bg-red-500', width: '25%' };
    if (pwd.length < 8) return { label: 'Weak', color: 'bg-orange-500', width: '50%' };
    if (!/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) return { label: 'Fair', color: 'bg-yellow-500', width: '75%' };
    return { label: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const strength = passwordStrength(newPassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-foreground text-xl font-semibold">AdminPanel</span>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-border">
            <div className="flex items-center gap-3 mb-1">
              {step !== 'done' && (
                <button
                  onClick={() => step === 'reset' ? setStep('verify') : navigate('/login')}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent transition-colors text-muted-foreground"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <h1 className="text-foreground text-xl font-bold">
                {step === 'verify' && 'Verify Identity'}
                {step === 'reset' && 'Set New Password'}
                {step === 'done' && 'Password Updated!'}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground ml-11">
              {step === 'verify' && 'Enter your current credentials to verify you are the admin.'}
              {step === 'reset' && 'Choose a strong new password for your account.'}
              {step === 'done' && 'Your password has been changed successfully.'}
            </p>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mt-4 ml-11">
              {['verify', 'reset', 'done'].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    step === s ? 'bg-primary text-primary-foreground' :
                    ['verify', 'reset', 'done'].indexOf(step) > i ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {['verify', 'reset', 'done'].indexOf(step) > i ? '✓' : i + 1}
                  </div>
                  {i < 2 && <div className={`h-px w-8 transition-all ${['verify', 'reset', 'done'].indexOf(step) > i ? 'bg-green-500' : 'bg-border'}`} />}
                </div>
              ))}
            </div>
          </div>

          <div className="p-8">
            {/* Step 1: Verify */}
            {step === 'verify' && (
              <form onSubmit={handleVerify} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Your admin username"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                    />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={verifyLoading}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {verifyLoading ? (
                    <><div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> Verifying...</>
                  ) : 'Verify & Continue'}
                </button>
                <button type="button" onClick={() => navigate('/login')} className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors text-center">
                  Back to Login
                </button>
              </form>
            )}

            {/* Step 2: Reset */}
            {step === 'reset' && (
              <form onSubmit={handleReset} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                    />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Strength bar */}
                  {strength && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${strength.color}`} style={{ width: strength.width }} />
                      </div>
                      <p className={`text-xs mt-1 font-medium ${
                        strength.label === 'Strong' ? 'text-green-500' :
                        strength.label === 'Fair' ? 'text-yellow-500' :
                        strength.label === 'Weak' ? 'text-orange-500' : 'text-red-500'
                      }`}>{strength.label}</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-10 py-2.5 text-sm bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground ${
                        confirmPassword && confirmPassword !== newPassword ? 'border-destructive' : 'border-border'
                      }`}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword && confirmPassword !== newPassword && (
                    <p className="text-xs text-destructive mt-1">Passwords do not match</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {resetLoading ? (
                    <><div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> Updating...</>
                  ) : (
                    <><Lock className="w-4 h-4" /> Update Password</>
                  )}
                </button>
              </form>
            )}

            {/* Step 3: Done */}
            {step === 'done' && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <p className="text-foreground font-medium mb-1">Password Changed!</p>
                  <p className="text-sm text-muted-foreground">Your password has been updated. Please log in with your new password.</p>
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-all"
                >
                  Go to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
