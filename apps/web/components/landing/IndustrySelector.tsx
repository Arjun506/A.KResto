'use client';

import { useLandingState } from '@/context/landing-state';
import {
  Bed,
  Building2,
  GraduationCap,
  HeartPulse,
  Package,
  Scissors,
  Settings,
  ShoppingBag,
  Sparkles,
  Store
} from 'lucide-react';

const industryCards = [
  { id: 'RESTAURANT', label: 'Restaurant', icon: Store, accent: 'from-orange-500 to-rose-500', shadow: 'rgba(249,115,22,0.4)', text: 'text-orange-500 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/30' },
  { id: 'RETAIL', label: 'Retail', icon: ShoppingBag, accent: 'from-emerald-500 to-teal-400', shadow: 'rgba(16,185,129,0.4)', text: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30' },
  { id: 'HOTEL', label: 'Hotel', icon: Bed, accent: 'from-violet-500 to-indigo-500', shadow: 'rgba(139,92,246,0.4)', text: 'text-violet-500 bg-violet-50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-900/30' },
  { id: 'SALON', label: 'Salon', icon: Scissors, accent: 'from-pink-500 to-rose-500', shadow: 'rgba(236,72,153,0.4)', text: 'text-pink-500 bg-pink-50 dark:bg-pink-950/20 border-pink-200 dark:border-pink-900/30' },
  { id: 'HEALTHCARE', label: 'Healthcare', icon: HeartPulse, accent: 'from-cyan-500 to-blue-500', shadow: 'rgba(6,182,212,0.4)', text: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/20 border-cyan-200 dark:border-cyan-900/30' },
  { id: 'WAREHOUSE', label: 'Warehouse', icon: Package, accent: 'from-blue-600 to-indigo-500', shadow: 'rgba(37,99,235,0.4)', text: 'text-blue-550 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/30' },
  { id: 'MANUFACTURING', label: 'Manufacturing', icon: Settings, accent: 'from-indigo-550 to-blue-600', shadow: 'rgba(79,70,229,0.4)', text: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/30' },
  { id: 'EDUCATION', label: 'Education', icon: GraduationCap, accent: 'from-green-500 to-emerald-400', shadow: 'rgba(34,197,94,0.4)', text: 'text-green-500 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/30' },
  { id: 'CORPORATE', label: 'Corporate', icon: Building2, accent: 'from-purple-500 to-violet-500', shadow: 'rgba(168,85,247,0.4)', text: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/30' },
  { id: 'SERVICES', label: 'Services', icon: Sparkles, accent: 'from-fuchsia-500 to-pink-500', shadow: 'rgba(217,70,239,0.4)', text: 'text-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-950/20 border-fuchsia-200 dark:border-fuchsia-900/30' }
];

export default function IndustrySelector() {
  const { selectedIndustry, setSelectedIndustry } = useLandingState();

  return (
    <section id="industries" className="landing-section py-16">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title Section */}
        <div className="scroll-reveal mx-auto max-w-2xl text-center">
          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">
            Business setup
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            What type of business do you run?
          </h2>
          <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
            Choose your industry and we'll set everything up for you.
          </p>
        </div>

        {/* Circular glowing grid list */}
        <div className="scroll-reveal mt-12 grid grid-cols-2 gap-4 sm:grid-cols-5 lg:grid-cols-10" data-reveal-delay="1">
          {industryCards.map((industry) => {
            const Icon = industry.icon;
            const active = selectedIndustry === industry.id;

            return (
              <button
                key={industry.id}
                type="button"
                onClick={() => setSelectedIndustry(industry.id)}
                className={`group relative flex flex-col items-center justify-between rounded-2xl p-4 text-center transition-all duration-300 ${
                  active 
                    ? 'glass-premium border-blue-500/40 dark:border-cyan-400/30 -translate-y-1.5 shadow-xl scale-[1.03]' 
                    : 'glass-premium border-slate-200/50 dark:border-white/5 hover:-translate-y-1 hover:shadow-md'
                }`}
                aria-pressed={active}
              >
                {/* Circular Icon background wrapper */}
                <span
                  className={`grid h-14 w-14 place-items-center rounded-full border transition-all duration-500 ${
                    active
                      ? `bg-gradient-to-br ${industry.accent} text-white border-transparent scale-110 shadow-lg`
                      : `border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${industry.text} hover:scale-105 shadow-inner`
                  }`}
                  style={active ? { boxShadow: `0 0 20px ${industry.shadow}` } : undefined}
                >
                  <Icon size={20} strokeWidth={active ? 2.6 : 2.0} className={active ? 'animate-pulse' : ''} />
                </span>

                {/* Card Label */}
                <span className="mt-3 block w-full truncate text-[11px] font-black tracking-tight text-slate-800 dark:text-slate-200">
                  {industry.label}
                </span>

                {/* Sub-dot to display select state */}
                <span
                  className={`mt-2.5 h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                    active 
                      ? 'bg-blue-600 dark:bg-cyan-400 scale-150' 
                      : 'bg-slate-350 dark:bg-slate-800 group-hover:bg-blue-500 dark:group-hover:bg-cyan-400'
                  }`}
                />
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
