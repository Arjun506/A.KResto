'use client';

import AuthLayout from '@/components/auth/AuthLayout';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Layers, BarChart } from 'lucide-react';

export default function SignupPage() {
  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Branding header */}
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-650 shadow-md">
            <Zap size={18} className="text-white" />
          </span>
          <div>
            <span className="block text-sm font-black tracking-tight text-slate-900 dark:text-white">AK Business OS</span>
            <span className="block text-[8px] font-black uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Workspace Hub</span>
          </div>
        </div>

        {/* Info Header */}
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.15]">
            Build Your Workspace.
          </h2>
          <p className="mt-3 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">
            Spin up a dedicated secure sandbox environment complete with custom billing, localized currency settings, and active industry modules.
          </p>
        </div>

        {/* Feature Checkmarks list */}
        <div className="space-y-4">
          {[
            [Layers, 'Dedicated Multitenancy Database Sandbox'],
            [BarChart, 'Real-time POS Sales & Inventory Tracking'],
            [Sparkles, 'Smart AI Business Advisor & Forecast Tickers'],
            [ShieldCheck, 'Secured Session Locks & Multi-role Management']
          ].map(([Icon, label], i) => {
            const FeatIcon = Icon as typeof Layers;
            return (
              <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-350">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-blue-500/10 text-blue-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                  <FeatIcon size={14} />
                </span>
                {label as string}
              </div>
            );
          })}
        </div>

        {/* Wizard Activation button */}
        <Link 
          href="/onboarding"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-650 text-white text-xs font-black uppercase tracking-[0.14em] shadow-lg shadow-blue-500/20 hover:opacity-95 transition flex items-center justify-center gap-2"
        >
          Start Setup Wizard
          <ArrowRight size={13} />
        </Link>

        {/* Return to Login */}
        <div className="text-center text-xs font-bold text-slate-555 dark:text-slate-450 border-t border-slate-200/35 dark:border-white/5 pt-5">
          Already registered?{' '}
          <Link href="/login" className="text-blue-600 dark:text-cyan-400 font-extrabold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

