'use client';

import { useState } from 'react';

import {
  createRazorpaySubscription,
  createStripeCheckout,
} from '@/services/billing.service';
import type { BillingPlan, Invoice } from '@/src/types/billing.types';

const plans: BillingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'Rs. 999',
    interval: 'month',
    limits: ['1 outlet', '500 orders/month', 'Basic analytics'],
    features: ['POS Billing', 'QR Ordering', 'Menu Management'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'Rs. 2999',
    interval: 'month',
    limits: ['3 outlets', '5000 orders/month', 'AI insights'],
    features: ['Inventory', 'Kitchen Display', 'Staff Roles', 'Reservations'],
    recommended: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    interval: 'contract',
    limits: ['Unlimited outlets', 'Custom usage', 'Priority support'],
    features: ['SLA', 'Advanced RBAC', 'Dedicated onboarding', 'CI/CD support'],
  },
];

const invoices: Invoice[] = [
  {
    id: 'INV-1001',
    provider: 'razorpay',
    amount: 'Rs. 2999',
    status: 'paid',
    issuedAt: '2026-05-01',
  },
  {
    id: 'INV-1002',
    provider: 'stripe',
    amount: 'Rs. 2999',
    status: 'open',
    issuedAt: '2026-06-01',
  },
];

export default function BillingPage() {
  const [provider, setProvider] = useState<'razorpay' | 'stripe'>('razorpay');
  const [trialEnabled, setTrialEnabled] = useState(true);

  const startCheckout = async (planId: BillingPlan['id']) => {
    try {
      const result =
        provider === 'razorpay'
          ? await createRazorpaySubscription(planId)
          : await createStripeCheckout(planId);

      const url = 'checkoutUrl' in result ? result.checkoutUrl : undefined;
      if (url) window.location.assign(url);
    } catch (error) {
      console.error(error);
      alert('Billing backend is not ready for checkout yet.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold">SaaS Billing</h1>
          <p className="mt-2 text-gray-500">
            Plans, trials, usage limits, Razorpay, Stripe, and invoices.
          </p>
        </div>
        <div className="flex rounded-2xl bg-white p-1 shadow">
          {(['razorpay', 'stripe'] as const).map((item) => (
            <button
              key={item}
              onClick={() => setProvider(item)}
              className={`rounded-xl px-5 py-3 font-semibold capitalize ${
                provider === item ? 'bg-black text-white' : 'text-gray-600'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.id}
            className={`rounded-2xl bg-white p-6 shadow ${
              plan.recommended ? 'ring-2 ring-black' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-bold">{plan.name}</h2>
                <p className="mt-2 text-gray-500">{plan.interval}</p>
              </div>
              {plan.recommended && (
                <span className="rounded-full bg-black px-3 py-1 text-sm font-semibold text-white">
                  Popular
                </span>
              )}
            </div>

            <p className="mt-8 text-5xl font-bold">{plan.price}</p>

            <div className="mt-8 space-y-3">
              {plan.features.map((feature) => (
                <p key={feature} className="rounded-xl bg-gray-100 px-4 py-3">
                  {feature}
                </p>
              ))}
            </div>

            <div className="mt-5 border-t pt-5">
              {plan.limits.map((limit) => (
                <p key={limit} className="text-sm text-gray-500">
                  {limit}
                </p>
              ))}
            </div>

            <button
              onClick={() => void startCheckout(plan.id)}
              className="mt-6 w-full rounded-xl bg-black py-3 font-semibold text-white"
            >
              Start {provider === 'razorpay' ? 'Razorpay' : 'Stripe'} Checkout
            </button>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-2xl font-bold">Feature Restrictions</h2>
          <label className="mt-5 flex items-center justify-between rounded-xl bg-gray-100 px-4 py-3">
            <span>14 day trial</span>
            <input
              type="checkbox"
              checked={trialEnabled}
              onChange={(event) => setTrialEnabled(event.target.checked)}
            />
          </label>
          <div className="mt-5 space-y-3 text-sm text-gray-600">
            <p>Starter locks AI insights and advanced inventory.</p>
            <p>Pro unlocks realtime kitchen, waiter sync, and reservations.</p>
            <p>Enterprise removes limits and enables platform support.</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-2xl font-bold">Invoice History</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-3">Invoice</th>
                  <th>Provider</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b">
                    <td className="py-4 font-medium">{invoice.id}</td>
                    <td className="capitalize">{invoice.provider}</td>
                    <td>{invoice.amount}</td>
                    <td>{invoice.status}</td>
                    <td>{invoice.issuedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
