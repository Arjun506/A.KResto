'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { User, Lock, Mail, Shield, Check, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  
  const [name, setName] = useState('Rohit Sharma');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 98765 43210');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (user) {
      setEmail(user.email);
    }
  }, [user]);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setTimeout(() => {
      setIsSavingProfile(false);
      triggerToast('Profile information successfully updated!');
    }, 1000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      triggerToast('Error: New passwords do not match.');
      return;
    }
    setIsSavingPassword(true);
    setTimeout(() => {
      setIsSavingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      triggerToast('Security password successfully updated!');
    }, 1000);
  };

  if (!mounted) {
    return <div className="space-y-6 max-w-4xl mx-auto py-12 text-slate-500">Loading profile settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-[#1C2C45] border border-slate-200 dark:border-border px-4 py-3 text-white dark:text-foreground shadow-2xl animate-in fade-in slide-in-from-bottom-5">
          <Check className="h-5 w-5 text-emerald-400" />
          <span className="text-xs font-bold">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-foreground flex items-center gap-2">
          User Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-text-muted font-bold mt-1">
          Manage your personal details, access privileges, security parameters, and preferences.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        {/* Left Column: Forms */}
        <div className="space-y-6">
          {/* PROFILE CARD */}
          <div className="bg-white dark:bg-card border border-slate-200/50 dark:border-border rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-800 dark:text-text-secondary uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-border pb-3">
              <User size={14} className="text-primary" /> Personal Information
            </h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs font-bold">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 dark:text-text-muted uppercase">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-border bg-slate-50 dark:bg-surface text-slate-800 dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 dark:text-text-muted uppercase">Mobile Contact</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-border bg-slate-50 dark:bg-surface text-slate-800 dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 dark:text-text-muted uppercase">Email Address</label>
                <div className="relative">
                  <Mail size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-border bg-slate-100 dark:bg-surface/50 text-slate-400 dark:text-text-disabled cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="bg-primary hover:bg-primary/95 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm"
                >
                  {isSavingProfile && <Loader2 size={12} className="animate-spin" />}
                  Save Details
                </button>
              </div>
            </form>
          </div>

          {/* SECURITY CARD */}
          <div className="bg-white dark:bg-card border border-slate-200/50 dark:border-border rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-800 dark:text-text-secondary uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-border pb-3">
              <Lock size={14} className="text-primary" /> Login Credentials
            </h2>
            <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs font-bold">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 dark:text-text-muted uppercase">Current Security Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-border bg-slate-50 dark:bg-surface text-slate-800 dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 dark:text-text-muted uppercase">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-border bg-slate-50 dark:bg-surface text-slate-800 dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 dark:text-text-muted uppercase">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-border bg-slate-50 dark:bg-surface text-slate-800 dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSavingPassword}
                  className="bg-primary hover:bg-primary/95 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm"
                >
                  {isSavingPassword && <Loader2 size={12} className="animate-spin" />}
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Roles & Info Preview */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-card border border-slate-200/50 dark:border-border rounded-3xl p-5 shadow-sm text-center space-y-4">
            <h3 className="text-sm font-black text-slate-800 dark:text-text-secondary uppercase tracking-wider text-left border-b border-slate-100 dark:border-border pb-2">
              System Roles
            </h3>
            
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#4F46E5] to-[#3B82F6] flex items-center justify-center text-white text-base font-black uppercase mx-auto">
              {email.slice(0, 2)}
            </div>

            <div>
              <p className="text-sm font-black text-slate-800 dark:text-foreground">{name}</p>
              <p className="text-[10px] text-slate-400 dark:text-text-muted font-bold mt-0.5">{email}</p>
            </div>

            <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-surface border border-slate-200/40 dark:border-border text-xs font-black text-slate-700 dark:text-text-secondary">
              <Shield size={13} className="text-primary" />
              <span>Role: {user?.role || 'OWNER'}</span>
            </div>

            <div className="text-[10px] text-slate-400 dark:text-text-muted text-left space-y-1 pt-2 border-t border-slate-100 dark:border-border">
              <p>User UID: <span className="font-mono">{user?.id || 'sys-owner-rohit'}</span></p>
              {user?.tenantId && (
                <p>Company ID: <span className="font-mono">{user.tenantId}</span></p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

