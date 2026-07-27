'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle,
  Circle,
  AlertTriangle,
  ArrowRight,
  Shield,
  Activity,
  Check,
  Plus,
  HelpCircle,
  ExternalLink,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { getLaunchStatus, LaunchStatusResponse, ChecklistItem } from '@/services/launch-center.service';
import { updateBusinessSettings } from '@/services/business.service';
import { useAuth } from '@/context/auth-context';
import DashboardShell from '@/components/layout/DashboardShell';

export default function LaunchCenterPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [status, setStatus] = useState<LaunchStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const isOwnerOrAdmin = user?.role === 'OWNER' || user?.role === 'SUPER_ADMIN';

  const loadStatus = async () => {
    try {
      const res = await getLaunchStatus();
      setStatus(res);
    } catch (err) {
      console.error('Failed to load launch status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      if (!isOwnerOrAdmin) {
        // Redirection if user does not have permission
        router.push('/dashboard');
        return;
      }
      void loadStatus();
    }
  }, [user, authLoading, isOwnerOrAdmin]);

  const handleMockToggle = async (key: string, currentValue: boolean) => {
    if (!status) return;
    setUpdating(key);
    try {
      const settingsKey = 
        key === 'payment_configured' ? 'paymentConfigured' :
        key === 'website_published' ? 'websitePublished' :
        key === 'ak_connect_enabled' ? 'akConnectEnabled' : null;

      if (settingsKey) {
        // Fetch current settings first or update them
        await updateBusinessSettings({
          settings: {
            ...status.checklist.reduce((acc, item) => {
              // Extract values for dynamic config flags from current state
              if (item.key === 'payment_configured') acc.paymentConfigured = item.completed;
              if (item.key === 'website_published') acc.websitePublished = item.completed;
              if (item.key === 'ak_connect_enabled') acc.akConnectEnabled = item.completed;
              return acc;
            }, {} as Record<string, boolean>),
            [settingsKey]: !currentValue,
          }
        });
        await loadStatus();
      } else {
        alert(`Step "${key}" is checked dynamically against real database structures (e.g. create a branch or product to complete it).`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update status config');
    } finally {
      setUpdating(null);
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardShell>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-500 font-bold">
          <Loader2 className="w-8 h-8 animate-spin text-[#4F46E5]" />
          <span>Analyzing business setup checklist...</span>
        </div>
      </DashboardShell>
    );
  }

  if (!status) {
    return (
      <DashboardShell>
        <div className="min-h-[60vh] flex items-center justify-center text-rose-500 font-bold">
          Error loading Launch Center status. Please try again.
        </div>
      </DashboardShell>
    );
  }

  // Get status qualitative tag
  const getHealthStatus = (score: number) => {
    if (score >= 90) return { label: 'Fully Operational', color: 'text-emerald-700 bg-emerald-50 border-emerald-100' };
    if (score >= 70) return { label: 'Ready for Launch', color: 'text-indigo-700 bg-indigo-50 border-indigo-100' };
    return { label: 'Setup in Progress', color: 'text-amber-700 bg-amber-50 border-amber-100' };
  };

  const healthInfo = getHealthStatus(status.healthScore);

  return (
    <DashboardShell>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Block */}
        <div className="bg-white dark:bg-[#11131c] rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800/40 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative overflow-hidden">
          <div className="space-y-1 z-10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-indigo-50 dark:bg-indigo-950 px-2 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 ring-1 ring-inset ring-indigo-700/10">
                Business Launch Center
              </span>
              <span className="text-xs text-slate-400 font-medium">Sprint 1 Milestone</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-2">
              Launch Guide & Checklist <Sparkles className="h-5 w-5 text-indigo-500" />
            </h1>
            <p className="text-sm text-slate-500">
              Guidance for onboarding your new workspace and configuring operations.
            </p>
          </div>

          {/* Progress Circular/Radial indicator */}
          <div className="flex items-center gap-4 shrink-0 z-10">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  className="stroke-slate-100 dark:stroke-slate-800 fill-none"
                  strokeWidth="6"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  className="stroke-indigo-500 fill-none transition-all duration-500"
                  strokeWidth="6"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - status.percentage / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-sm font-black text-slate-900 dark:text-slate-100">
                {status.percentage}%
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Launch progress</p>
              <p className="text-lg font-black text-slate-800 dark:text-slate-200 mt-0.5">
                {status.completedCount} / {status.totalCount} Done
              </p>
            </div>
          </div>

          <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Multi-Column Layout */}
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* LEFT/CENTER: Checklist steps (col-span-2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-350">
                Setup Checklist ({status.totalCount} steps)
              </h2>
              {status.percentage === 100 && (
                <span className="flex items-center gap-1 text-xs font-extrabold text-emerald-600">
                  <Check className="w-3.5 h-3.5" /> All steps completed!
                </span>
              )}
            </div>

            <div className="bg-white dark:bg-[#11131c] rounded-3xl border border-slate-200/60 dark:border-slate-800/40 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/40">
              {status.checklist.map((item, idx) => {
                const isMockable = ['payment_configured', 'website_published', 'ak_connect_enabled'].includes(item.key);
                
                return (
                  <div
                    key={item.key}
                    className={`p-4 flex items-start gap-4 transition hover:bg-slate-50/30 dark:hover:bg-slate-800/5 ${
                      item.completed ? 'bg-slate-50/10' : ''
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {item.completed ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 dark:text-slate-700" />
                      )}
                    </div>

                    <div className="flex-1 space-y-1 text-left min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400">{idx + 1}</span>
                        <h3 className={`text-xs font-bold leading-none ${item.completed ? 'text-slate-500 line-through font-medium' : 'text-slate-800 dark:text-slate-200'}`}>
                          {item.label}
                        </h3>
                      </div>
                      <p className="text-[11px] text-slate-450 dark:text-slate-500 leading-normal">
                        {item.description}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {isMockable && (
                        <button
                          onClick={() => handleMockToggle(item.key, item.completed)}
                          disabled={updating === item.key}
                          className="px-2 py-1 text-[10px] font-black rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition active:scale-95 flex items-center gap-1 cursor-pointer"
                        >
                          {updating === item.key ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <span>{item.completed ? 'Undo Setup' : 'Quick Enable'}</span>
                          )}
                        </button>
                      )}

                      {!item.completed ? (
                        <a
                          href={item.href}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-lg transition active:scale-95 flex items-center gap-1"
                        >
                          <span>{item.actionText}</span>
                          <ArrowRight size={10} />
                        </a>
                      ) : (
                        <span className="px-3 py-1.5 text-slate-400 text-[10px] font-black bg-slate-100/50 dark:bg-slate-800/20 rounded-lg">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Business health and stats */}
          <div className="space-y-6">
            
            {/* Business Health Card */}
            <div className="space-y-3">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-350">
                Business Health
              </h2>
              <div className="bg-white dark:bg-[#11131c] p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/40 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-bold text-slate-500">Health Index</span>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${healthInfo.color}`}>
                    {healthInfo.label}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900 dark:text-slate-105">
                    {status.healthScore}
                  </span>
                  <span className="text-xs font-bold text-slate-400">/ 100</span>
                </div>

                <p className="text-[11px] text-slate-400 leading-normal">
                  Your business health is derived dynamically from complete setup items, operational branches, menus catalog, and active POS transactions.
                </p>
              </div>
            </div>

            {/* Next Recommended Step */}
            {status.nextRecommendedStep && (
              <div className="space-y-3">
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-350">
                  Recommended Action
                </h2>
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-3xl shadow-sm space-y-4 text-left">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-indigo-200" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-150">Next suggested setup</span>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-sm font-black">
                      {status.nextRecommendedStep.label}
                    </h3>
                    <p className="text-[11px] text-indigo-100 leading-normal">
                      {status.nextRecommendedStep.description}
                    </p>
                  </div>

                  <a
                    href={status.nextRecommendedStep.href}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white text-indigo-700 text-xs font-black rounded-xl hover:bg-slate-50 transition active:scale-95 shadow-sm"
                  >
                    <span>{status.nextRecommendedStep.actionText}</span>
                    <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            )}

            {/* Missing Configuration Alerts */}
            {status.missingConfig.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-350">
                  Missing Configuration
                </h2>
                <div className="bg-white dark:bg-[#11131c] p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/40 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-amber-500">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-extrabold">{status.missingConfig.length} config gaps identified</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {status.missingConfig.map((item) => (
                      <span
                        key={item}
                        className="text-[9px] font-bold px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-450 border border-amber-100/30 dark:border-amber-900/30"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </DashboardShell>
  );
}

