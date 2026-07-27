'use client';

import {
  Building,
  Package,
  Settings,
  ShoppingCart,
  Sparkles,
  Store
} from 'lucide-react';

const steps = [
  { id: 1, label: 'Create Workspace', desc: 'Set up your private business workspace.', icon: Building, color: 'text-blue-600 bg-blue-500/10 border-blue-500/20' },
  { id: 2, label: 'Choose Industry', desc: 'Start with the right operating template.', icon: Store, color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' },
  { id: 3, label: 'Configure Business', desc: 'Add branches, users, roles, and settings.', icon: Settings, color: 'text-cyan-600 bg-cyan-500/10 border-cyan-500/20' },
  { id: 4, label: 'Add Products', desc: 'Import menus, SKUs, services, or catalogs.', icon: Package, color: 'text-amber-600 bg-amber-500/10 border-amber-500/20' },
  { id: 5, label: 'Start Selling', desc: 'Accept orders, payments, and bookings.', icon: ShoppingCart, color: 'text-pink-600 bg-pink-500/10 border-pink-500/20' },
  { id: 6, label: 'Grow with AI', desc: 'Use forecasts and automation to move faster.', icon: Sparkles, color: 'text-violet-600 bg-violet-500/10 border-violet-500/20' }
];

export default function BusinessJourney() {
  return (
    <section id="journey" className="landing-section">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="scroll-reveal mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-black tracking-tight text-[color:var(--landing-text)] sm:text-4xl">
            Your Business Journey Simplified
          </h2>
          <p className="mt-3 text-sm font-semibold leading-6 landing-muted">
            From first workspace to full AI-powered operations, the rollout stays clear and practical.
          </p>
        </div>

        <div className="scroll-reveal mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-6" data-reveal-delay="1">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="group relative text-center">
                {index < steps.length - 1 && (
                  <div className="absolute left-[58%] top-8 hidden h-px w-[84%] bg-gradient-to-r from-blue-500/40 via-cyan-500/25 to-transparent lg:block" />
                )}

                <div className="relative z-10 mx-auto grid h-16 w-16 place-items-center rounded-3xl border bg-white shadow-lg shadow-blue-500/10 transition duration-300 group-hover:-translate-y-1 dark:bg-slate-950">
                  <span className={`grid h-12 w-12 place-items-center rounded-2xl border ${step.color}`}>
                    <Icon size={20} />
                  </span>
                </div>

                <div className="mt-5">
                  <h3 className="text-xs font-black text-[color:var(--landing-text)]">
                    {step.id}. {step.label}
                  </h3>
                  <p className="mx-auto mt-2 max-w-[150px] text-[11px] font-semibold leading-5 landing-muted">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

