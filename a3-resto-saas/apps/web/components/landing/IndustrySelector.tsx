'use client';

import { useLandingState } from '@/context/landing-state';
import {
  Bed,
  Building2,
  GraduationCap,
  HeartPulse,
  Package,
  Plus,
  Scissors,
  Settings,
  ShoppingBag,
  Sparkles,
  Store
} from 'lucide-react';

const industryCards = [
  { id: 'RESTAURANT', label: 'Restaurant', icon: Store, accent: 'from-orange-500 to-rose-500', text: 'text-orange-500' },
  { id: 'RETAIL', label: 'Retail', icon: ShoppingBag, accent: 'from-emerald-500 to-teal-400', text: 'text-emerald-500' },
  { id: 'HOTEL', label: 'Hotel', icon: Bed, accent: 'from-violet-500 to-indigo-500', text: 'text-violet-500' },
  { id: 'SALON', label: 'Salon', icon: Scissors, accent: 'from-pink-500 to-rose-500', text: 'text-pink-500' },
  { id: 'HEALTHCARE', label: 'Healthcare', icon: HeartPulse, accent: 'from-cyan-500 to-blue-500', text: 'text-cyan-500' },
  { id: 'WAREHOUSE', label: 'Warehouse', icon: Package, accent: 'from-blue-600 to-indigo-500', text: 'text-blue-500' },
  { id: 'MANUFACTURING', label: 'Manufacturing', icon: Settings, accent: 'from-indigo-500 to-blue-600', text: 'text-indigo-500' },
  { id: 'EDUCATION', label: 'Education', icon: GraduationCap, accent: 'from-green-500 to-emerald-400', text: 'text-green-500' },
  { id: 'CORPORATE', label: 'Corporate', icon: Building2, accent: 'from-purple-500 to-violet-500', text: 'text-purple-500' },
  { id: 'SERVICES', label: 'Services', icon: Sparkles, accent: 'from-fuchsia-500 to-pink-500', text: 'text-fuchsia-500' }
];

export default function IndustrySelector() {
  const { selectedIndustry, setSelectedIndustry } = useLandingState();

  return (
    <section id="industries" className="landing-section">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="scroll-reveal mx-auto max-w-2xl text-center">
          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">
            Business setup
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-[color:var(--landing-text)] sm:text-4xl">
            What type of business do you run?
          </h2>
          <p className="mt-3 text-sm font-semibold leading-6 landing-muted">
            Pick an industry and your workspace starts with the right modules, dashboards, customer flows, and reports.
          </p>
        </div>

        <div className="scroll-reveal mt-12 grid grid-cols-2 gap-4 sm:grid-cols-5 lg:grid-cols-10" data-reveal-delay="1">
          {industryCards.map((industry) => {
            const Icon = industry.icon;
            const active = selectedIndustry === industry.id;

            return (
              <button
                key={industry.id}
                type="button"
                onClick={() => setSelectedIndustry(industry.id)}
                className={`group relative flex min-h-[128px] flex-col items-center justify-between rounded-2xl p-4 text-center transition duration-300 ${
                  active ? 'landing-card-strong -translate-y-1' : 'landing-card hover:-translate-y-1'
                }`}
                aria-pressed={active}
              >
                <span
                  className={`grid h-14 w-14 place-items-center rounded-2xl border transition duration-300 ${
                    active
                      ? `border-white/30 bg-gradient-to-br ${industry.accent} text-white shadow-lg`
                      : `border-[color:var(--landing-border)] bg-white/50 ${industry.text} dark:bg-slate-950/40`
                  }`}
                >
                  <Icon size={22} strokeWidth={2.4} />
                </span>
                <span className="mt-3 block w-full truncate text-[11px] font-black text-[color:var(--landing-text)]">
                  {industry.label}
                </span>
                <span
                  className={`mt-2 grid h-5 w-5 place-items-center rounded-full text-white transition ${
                    active ? 'bg-blue-600' : 'bg-slate-300 text-slate-600 group-hover:bg-blue-500 group-hover:text-white dark:bg-slate-800'
                  }`}
                >
                  <Plus size={11} className={active ? 'rotate-45' : ''} />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
