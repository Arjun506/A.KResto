'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Standard Trial',
    monthly: 'Rs 0',
    yearly: 'Rs 0',
    desc: 'A full sandbox workspace for testing core modules and team workflows.',
    features: ['14-day full feature access', 'Core POS and dashboard modules', 'Sample data and templates', 'No credit card required'],
    popular: false
  },
  {
    name: 'Premium Core',
    monthly: 'Rs 3,999',
    yearly: 'Rs 3,199',
    desc: 'The best starting tier for growing businesses that need multi-module operations.',
    features: ['Up to 5 branches', 'All app store modules', 'Unlimited orders', 'Advanced finance and CRM', 'SMS and WhatsApp alerts'],
    popular: true
  },
  {
    name: 'Enterprise OS',
    monthly: 'Custom',
    yearly: 'Custom',
    desc: 'Dedicated architecture, deep integrations, premium onboarding, and SLA support.',
    features: ['Unlimited branches', 'Dedicated success manager', 'Custom integrations', 'Priority roadmap access', '24/7 SLA support'],
    popular: false
  }
];

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section id="pricing" className="landing-section">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="scroll-reveal mx-auto max-w-2xl text-center">
          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">
            Pricing preview
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-[color:var(--landing-text)] sm:text-4xl">
            Flexible SaaS Licensing
          </h2>
          <p className="mt-3 text-sm font-semibold leading-6 landing-muted">
            Start lean, prove the workflow, then scale into the operating tier your business needs.
          </p>

          <div className="mt-7 inline-flex rounded-2xl border border-[color:var(--landing-border)] bg-white/70 p-1 shadow-sm dark:bg-slate-950/45">
            {(['monthly', 'yearly'] as const).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setBillingPeriod(period)}
                className={`relative rounded-xl px-5 py-2 text-[10px] font-black uppercase tracking-[0.12em] transition ${
                  billingPeriod === period ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'landing-muted hover:text-[color:var(--landing-text)]'
                }`}
              >
                {period === 'monthly' ? 'Monthly' : 'Yearly'}
                {period === 'yearly' && (
                  <span className="absolute -right-6 -top-3 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[7px] font-black normal-case text-emerald-600 dark:text-emerald-300">
                    Save 20%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => {
            const displayPrice = billingPeriod === 'monthly' ? plan.monthly : plan.yearly;
            const custom = displayPrice === 'Custom';
            return (
              <div
                key={plan.name}
                className={`scroll-reveal relative flex flex-col rounded-[1.35rem] p-6 ${
                  plan.popular ? 'landing-card-strong border-blue-500/30' : 'landing-card'
                }`}
                data-reveal-delay={String(Math.min(index + 1, 3))}
              >
                {plan.popular && (
                  <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-white">
                    <Sparkles size={10} />
                    Most Popular
                  </span>
                )}

                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] landing-soft-text">License tier</span>
                  <h3 className="mt-2 text-xl font-black text-[color:var(--landing-text)]">{plan.name}</h3>
                  <div className="mt-6 flex items-end gap-2">
                    <span key={displayPrice} className="counter-rise text-4xl font-black text-[color:var(--landing-text)]">
                      {displayPrice}
                    </span>
                    {!custom && <span className="pb-1 text-sm font-bold landing-soft-text">/mo</span>}
                  </div>
                  <p className="mt-4 text-sm font-semibold leading-6 landing-muted">{plan.desc}</p>
                  {billingPeriod === 'yearly' && plan.popular && (
                    <span className="mt-3 inline-flex rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-black text-emerald-600 dark:text-emerald-300">
                      Billed annually at Rs 38,388
                    </span>
                  )}
                </div>

                <div className="mt-7 space-y-3 border-t border-[color:var(--landing-border)] pt-6">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-sm font-bold text-[color:var(--landing-text)]">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-500/10 text-blue-600">
                        <Check size={11} strokeWidth={3} />
                      </span>
                      {feature}
                    </div>
                  ))}
                </div>

                <Link href="/onboarding" className={`${plan.popular ? 'landing-primary-button' : 'landing-secondary-button'} mt-8 w-full`}>
                  Get Started
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
