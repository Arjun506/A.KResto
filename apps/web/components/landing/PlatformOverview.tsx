'use client';

import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  HeartHandshake,
  LayoutDashboard,
  ShieldCheck,
  TrendingUp,
  Zap
} from 'lucide-react';
import Link from 'next/link';

const operatingPoints = [
  'One Platform',
  'One Login',
  'One Dashboard',
  'One Database',
  'One Team',
  'Unlimited Businesses'
];

const outcomes = [
  {
    title: 'Save Time',
    desc: 'Automate repetitive operations and reduce manual handoffs.',
    icon: Clock3,
    color: 'text-blue-600 bg-blue-500/10 border-blue-500/20'
  },
  {
    title: 'Increase Profit',
    desc: 'Track margins, demand, and cash movement with real-time insight.',
    icon: TrendingUp,
    color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20'
  },
  {
    title: 'Delight Customers',
    desc: 'Deliver faster ordering, booking, loyalty, and support experiences.',
    icon: HeartHandshake,
    color: 'text-amber-600 bg-amber-500/10 border-amber-500/20'
  },
  {
    title: 'Scale Effortlessly',
    desc: 'Add branches, users, modules, and channels without platform chaos.',
    icon: Zap,
    color: 'text-rose-600 bg-rose-500/10 border-rose-500/20'
  }
];

export default function PlatformOverview() {
  return (
    <section id="features" className="landing-section">
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-12">
        <div className="scroll-reveal lg:col-span-3">
          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">
            Why AK Business OS?
          </span>
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-[color:var(--landing-text)] sm:text-4xl">
            One Platform to Run Everything
          </h2>
          <p className="mt-4 text-sm font-semibold leading-7 landing-muted">
            Replace fragmented tools with a shared operating layer for sales, inventory, customers, finance, staff, and AI automation.
          </p>

          <div className="mt-7 space-y-3">
            {operatingPoints.map((point) => (
              <div key={point} className="flex items-center gap-3 text-sm font-extrabold text-[color:var(--landing-text)]">
                <CheckCircle2 size={16} className="text-emerald-500" />
                {point}
              </div>
            ))}
          </div>

          <Link href="/onboarding" className="landing-primary-button mt-8">
            Create Workspace
            <ArrowUpRight size={15} />
          </Link>
        </div>

        <div className="scroll-reveal lg:col-span-6" data-reveal-delay="1">
          <div className="relative mx-auto max-w-3xl">
            <div className="landing-card-strong rounded-[1.65rem] p-3">
              <div className="rounded-[1.35rem] border border-[color:var(--landing-border)] bg-white/70 p-4 dark:bg-slate-950/50">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="landing-logo-mark h-8 w-8 rounded-xl">
                      <span className="relative z-10 text-[10px] font-black">AK</span>
                    </span>
                    <span className="text-xs font-black text-[color:var(--landing-text)]">Operations Console</span>
                  </div>
                  <div className="hidden flex-1 items-center gap-2 rounded-xl border border-[color:var(--landing-border)] bg-white/70 px-3 py-2 text-[10px] font-bold landing-soft-text dark:bg-slate-900/60 sm:flex">
                    <LayoutDashboard size={12} />
                    Search anything across your business
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-12">
                  <div className="sm:col-span-4">
                    <div className="space-y-2 rounded-2xl border border-[color:var(--landing-border)] bg-blue-600 p-4 text-white">
                      <span className="text-[10px] font-black uppercase opacity-80">Total Revenue</span>
                      <span className="block text-2xl font-black">Rs 24.58L</span>
                      <span className="text-[10px] font-extrabold text-cyan-100">+12.5% from last month</span>
                    </div>
                    <div className="mt-3 space-y-2">
                      {['Orders', 'Customers', 'Products', 'Finance'].map((item, index) => (
                        <div key={item} className="flex items-center justify-between rounded-xl border border-[color:var(--landing-border)] bg-white/60 px-3 py-2 text-[10px] font-extrabold landing-muted dark:bg-slate-900/50">
                          <span>{item}</span>
                          <span className={index === 0 ? 'text-blue-500' : 'landing-soft-text'}>{index === 0 ? 'Live' : 'Synced'}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="sm:col-span-8">
                    <div className="rounded-2xl border border-[color:var(--landing-border)] bg-white/70 p-4 dark:bg-slate-900/60">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[color:var(--landing-text)]">Revenue Overview</span>
                        <span className="rounded-lg bg-cyan-500/10 px-2 py-1 text-[9px] font-black text-cyan-600 dark:text-cyan-300">AI forecast</span>
                      </div>
                      <svg className="mt-5 h-40 w-full" viewBox="0 0 320 140" fill="none" aria-hidden="true">
                        <path d="M10 120H310" stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
                        <path d="M10 88H310" stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
                        <path d="M10 56H310" stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
                        <path d="M10 112C38 84 56 100 78 70C105 34 130 72 152 58C178 42 190 28 216 60C242 92 257 38 282 50C296 56 304 42 310 34" stroke="#2563EB" strokeWidth="5" strokeLinecap="round" />
                        <path d="M10 112C38 84 56 100 78 70C105 34 130 72 152 58C178 42 190 28 216 60C242 92 257 38 282 50C296 56 304 42 310 34V132H10V112Z" fill="url(#overview-fill)" />
                        <defs>
                          <linearGradient id="overview-fill" x1="160" y1="30" x2="160" y2="132" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#2563EB" stopOpacity="0.22" />
                            <stop offset="1" stopColor="#2563EB" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    ['Secure', ShieldCheck],
                    ['Realtime', Zap],
                    ['Unified', LayoutDashboard]
                  ].map(([label, Icon]) => {
                    const CardIcon = Icon as typeof ShieldCheck;
                    return (
                      <div key={label as string} className="rounded-xl border border-[color:var(--landing-border)] bg-white/60 p-3 text-center dark:bg-slate-900/50">
                        <CardIcon size={16} className="mx-auto text-blue-500" />
                        <span className="mt-2 block text-[10px] font-black text-[color:var(--landing-text)]">{label as string}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-reveal space-y-5 lg:col-span-3" data-reveal-delay="2">
          {outcomes.map((outcome) => {
            const Icon = outcome.icon;
            return (
              <div key={outcome.title} className="landing-card rounded-2xl p-5">
                <div className="flex gap-4">
                  <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl border ${outcome.color}`}>
                    <Icon size={20} />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-[color:var(--landing-text)]">{outcome.title}</h3>
                    <p className="mt-1 text-xs font-semibold leading-5 landing-muted">{outcome.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
