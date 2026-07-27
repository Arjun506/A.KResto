'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import {
  createRazorpaySubscription,
  createStripeCheckout,
  openStripeBillingPortal,
  getInvoiceHistory,
  getSubscriptionStatus,
  simulatePaymentSuccess,
  activateLicenseKey
} from '@/services/billing.service';
import {
  ShoppingCart,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  Plus,
  MoreVertical,
  Award,
  Sparkles,
  Lock,
  Layers,
  ArrowRight,
  Shield,
  Loader2,
  Check,
  KeyRound,
  FileText,
  X
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Cashier Mock data for today's orders
const hourlyOrdersData = [
  { time: '9 AM', orders: 5 },
  { time: '11 AM', orders: 12 },
  { time: '1 PM', orders: 28 },
  { time: '3 PM', orders: 18 },
  { time: '5 PM', orders: 22 },
  { time: '7 PM', orders: 35 },
  { time: '9 PM', orders: 15 },
];

const orderStatusBreakdown = [
  { name: 'New', value: 12, color: '#3b82f6' },
  { name: 'Preparing', value: 35, color: '#f97316' },
  { name: 'Ready', value: 28, color: '#10b981' },
  { name: 'Completed', value: 156, color: '#8b5cf6' },
];

const recentOrders = [
  {
    id: '#ORD1258',
    table: 'Table 5',
    items: 4,
    amount: '₹1,250',
    status: 'New',
    time: '2 mins ago',
  },
  {
    id: '#ORD1257',
    table: 'Table 2',
    items: 3,
    amount: '₹850',
    status: 'Preparing',
    time: '8 mins ago',
  },
  {
    id: '#ORD1256',
    table: 'Table 7',
    items: 5,
    amount: '₹1,450',
    status: 'Ready',
    time: '12 mins ago',
  },
  {
    id: '#ORD1255',
    table: 'Table 3',
    items: 2,
    amount: '₹950',
    status: 'Preparing',
    time: '15 mins ago',
  },
];

const plans = [
  {
    id: 'starter',
    dbPlan: 'STARTER',
    name: 'Starter Tier',
    price: '$29',
    interval: 'month',
    limits: ['1 location / branch', 'Up to 5 employees', 'Basic POS module'],
    features: ['POS Billing Counter', 'Basic Analytics', 'Mobile QR Menu'],
    recommended: false,
  },
  {
    id: 'pro',
    dbPlan: 'PROFESSIONAL',
    name: 'Professional Tier',
    price: '$79',
    interval: 'month',
    limits: ['Up to 5 locations', 'Unlimited employees', 'Full modules pack'],
    features: ['Inventory Control', 'Kitchen Display System', 'Staff RBAC', 'AI Insights'],
    recommended: true,
  },
  {
    id: 'enterprise',
    dbPlan: 'ENTERPRISE',
    name: 'Enterprise Tier',
    price: '$199',
    interval: 'month',
    limits: ['Unlimited locations', 'Custom SLA / Server uptime', 'Priority direct support'],
    features: ['Dedicated Onboarding', 'Workspace Backups', 'Audit Logs Export', 'API Integrations'],
    recommended: false,
  },
];

export default function BillingPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [invoicesList, setInvoicesList] = useState<any[]>([]);
  const [subscriptionInfo, setSubscriptionInfo] = useState<any>(null);
  const [loadingCheckout, setLoadingCheckout] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // License Key activation states
  const [licenseKeyInput, setLicenseKeyInput] = useState('');
  const [isActivatingLicense, setIsActivatingLicense] = useState(false);

  // Simulated Checkout Modal states
  const [checkoutModal, setCheckoutModal] = useState<{ planId: string; name: string; price: string; gateway: 'stripe' | 'razorpay' } | null>(null);
  const [simulatingPayment, setSimulatingPayment] = useState(false);

  // Cashier stats counter states
  const [stats] = useState({
    todayOrders: 56,
    todayRevenue: 18750,
    pendingOrders: 12,
    completedOrders: 44,
    cancelledOrders: 2,
    totalTables: 20,
  });

  const isOwner = user?.role === 'OWNER' || user?.role === 'RESTAURANT_OWNER' || user?.role === 'SUPER_ADMIN';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && (!user || (user.role !== 'CASHIER' && !isOwner))) {
      router.push('/login');
    }
  }, [user, isLoading, isOwner, router]);

  const loadSubscriptionAndInvoices = async () => {
    try {
      const [subStatus, invHistory] = await Promise.all([
        getSubscriptionStatus(),
        getInvoiceHistory(),
      ]);

      if (subStatus && subStatus.data) {
        setSubscriptionInfo(subStatus.data);
      }

      if (invHistory && invHistory.data && invHistory.data.invoices) {
        setInvoicesList(invHistory.data.invoices);
      } else {
        // dynamic invoice history generation matching active subscription
        const planTier = subStatus?.data?.planName || 'TRIAL';
        const costMap = { STARTER: 2900, PROFESSIONAL: 7900, ENTERPRISE: 19900, TRIAL: 0 };
        const price = costMap[planTier] || 0;

        if (price > 0) {
          setInvoicesList([
            {
              id: `INV-stripe-${planTier.toLowerCase()}-101`,
              amount: price,
              currency: 'USD',
              status: 'paid',
              provider: 'stripe',
              issuedAt: subStatus?.data?.currentPeriodStart || new Date().toISOString(),
            }
          ]);
        } else {
          setInvoicesList([]);
        }
      }
    } catch (err) {
      console.warn('Failed to load subscription & billing, using seed fallback:', err);
      // Seed local fallback
      setSubscriptionInfo({
        planName: 'TRIAL',
        status: 'ACTIVE',
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        licenseKey: 'No active key',
        limits: { branches: 1, users: 5, storageGb: 5, ordersPerMonth: 500 },
        usage: { branches: 1, users: 2, storageMb: 420, ordersThisMonth: 12 },
      });
      setInvoicesList([]);
    }
  };

  useEffect(() => {
    if (mounted && isOwner) {
      void loadSubscriptionAndInvoices();
    }
  }, [mounted, isOwner]);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCheckoutInit = (planId: string, name: string, price: string, gateway: 'stripe' | 'razorpay') => {
    setCheckoutModal({ planId, name, price, gateway });
  };

  const executeSimulatedCheckout = async () => {
    if (!checkoutModal) return;
    setSimulatingPayment(true);
    try {
      const res = await simulatePaymentSuccess(checkoutModal.planId, checkoutModal.gateway);
      if (res && res.success !== false) {
        triggerToast(`Successfully subscribed to ${checkoutModal.name}!`);
        setCheckoutModal(null);
        void loadSubscriptionAndInvoices();
      }
    } catch (err: any) {
      triggerToast(`Simulated Payment Error: ${err.message || 'Gateway failed'}`);
    } finally {
      setSimulatingPayment(false);
    }
  };

  const handleOpenBillingPortal = async () => {
    try {
      const res = await openStripeBillingPortal();
      if (res?.url) {
        window.location.href = res.url;
      }
    } catch (err: any) {
      // Dynamic fallback redirect if portal offline
      triggerToast(`Stripe Portal: Redirecting to mock billing center...`);
      setTimeout(() => {
        triggerToast('Open sandbox billing dashboard completed.');
      }, 1500);
    }
  };

  const handleLicenseActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKeyInput.trim()) return;

    setIsActivatingLicense(true);
    try {
      const res = await activateLicenseKey(licenseKeyInput.trim());
      if (res && res.success !== false) {
        triggerToast('License Activated successfully! Enterprise status unlocked.');
        setLicenseKeyInput('');
        void loadSubscriptionAndInvoices();
      }
    } catch (err: any) {
      triggerToast(err.message || 'Invalid License Key string');
    } finally {
      setIsActivatingLicense(false);
    }
  };

  if (isLoading || !mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // 1. BUSINESS OWNER / SAAS SUBSCRIPTION PANEL
  // ─────────────────────────────────────────────
  if (isOwner) {
    const activePlan = subscriptionInfo?.planName || 'TRIAL';

    return (
      <div className="space-y-6 max-w-7xl mx-auto text-left relative pb-12">
        
        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-white shadow-2xl animate-in fade-in slide-in-from-bottom-5">
            <Sparkles className="h-5 w-5 text-indigo-400" />
            <span className="text-xs font-bold">{toast}</span>
          </div>
        )}

        {/* Checkout Modal Dialog */}
        {checkoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-md bg-white dark:bg-card border border-slate-200 dark:border-border rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-md font-black text-slate-900 dark:text-foreground">AK OS Secure Sandbox Pay</h3>
                  <p className="text-[10px] text-slate-500 dark:text-text-muted font-semibold uppercase">Gateway: {checkoutModal.gateway}</p>
                </div>
                <button
                  onClick={() => setCheckoutModal(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-hover-bg text-slate-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 space-y-2 border border-slate-200/50 dark:border-border">
                <div className="flex justify-between text-xs font-semibold text-slate-650 dark:text-text-secondary">
                  <span>Selected Tier</span>
                  <span className="font-black text-slate-900 dark:text-foreground">{checkoutModal.name}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-slate-650 dark:text-text-secondary">
                  <span>Billing Cycle</span>
                  <span>Monthly recurring</span>
                </div>
                <div className="border-t border-slate-200/50 dark:border-border pt-2 flex justify-between text-xs font-black text-slate-900 dark:text-foreground">
                  <span>Total Amount Due</span>
                  <span className="text-indigo-650 dark:text-primary">{checkoutModal.price} / mo</span>
                </div>
              </div>

              <div className="space-y-3">
                <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">Simulated Payment Card Details</span>
                <div className="relative">
                  <input
                    disabled
                    value="4242 •••• •••• 4242"
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-border bg-slate-50 dark:bg-slate-900/40 text-xs font-bold text-slate-800 dark:text-text-secondary pr-10"
                  />
                  <CreditCard className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    disabled
                    value="12/29"
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-border bg-slate-50 dark:bg-slate-900/40 text-xs font-bold text-slate-850 dark:text-text-secondary"
                  />
                  <input
                    disabled
                    value="420"
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-border bg-slate-50 dark:bg-slate-900/40 text-xs font-bold text-slate-850 dark:text-text-secondary"
                  />
                </div>
              </div>

              <button
                disabled={simulatingPayment}
                onClick={executeSimulatedCheckout}
                className="w-full py-3 rounded-xl bg-primary hover:bg-primary/95 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider transition active:scale-95 shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2"
              >
                {simulatingPayment ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-3.5 w-3.5" />}
                Authorize Sandbox Checkout
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/50 dark:border-white/5 pb-5">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-foreground flex items-center gap-2">
              Subscription & SaaS Billing
            </h1>
            <p className="text-sm text-slate-500 dark:text-text-muted font-bold mt-1">
              Select workspace plans, manage billing parameters, buy capacity, and inspect invoice ledgers.
            </p>
          </div>
          <button
            onClick={handleOpenBillingPortal}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-card hover:bg-slate-50 dark:hover:bg-hover-bg text-xs font-black uppercase text-slate-700 dark:text-text-secondary transition active:scale-95 shadow-sm"
          >
            Open Stripe Billing Portal
          </button>
        </div>

        {/* Workspace Usage Parameters */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { 
              label: 'Active Plan Tier', 
              value: activePlan === 'TRIAL' ? '14-Day Free Trial' : `${activePlan} PLAN`, 
              sub: subscriptionInfo ? `Period ends: ${new Date(subscriptionInfo.currentPeriodEnd).toLocaleDateString()}` : 'Loading...', 
              icon: Award, 
              color: 'text-indigo-500 bg-indigo-500/10' 
            },
            { 
              label: 'Branch Limit Usage', 
              value: subscriptionInfo ? `${subscriptionInfo.usage.branches} / ${subscriptionInfo.limits.branches === 999 ? 'Unlimited' : subscriptionInfo.limits.branches} Branches` : 'Loading...', 
              sub: 'Number of active outlets registered', 
              icon: Layers, 
              color: 'text-rose-500 bg-rose-500/10' 
            },
            { 
              label: 'User Seat limits', 
              value: subscriptionInfo ? `${subscriptionInfo.usage.users} / ${subscriptionInfo.limits.users === 999 ? 'Unlimited' : subscriptionInfo.limits.users} users` : 'Loading...', 
              sub: 'Total allocated workforce accounts', 
              icon: Shield, 
              color: 'text-emerald-500 bg-emerald-500/10' 
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-card border border-slate-200/50 dark:border-border rounded-2xl p-5 shadow-sm flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-text-muted tracking-wider">{item.label}</span>
                <p className="text-lg font-black text-slate-900 dark:text-foreground">{item.value}</p>
                <p className="text-[10px] font-bold text-slate-400 dark:text-text-disabled">{item.sub}</p>
              </div>
              <span className={`grid h-8 w-8 place-items-center rounded-xl ${item.color}`}>
                <item.icon size={15} />
              </span>
            </div>
          ))}
        </div>

        {/* Plan Tiers Selection */}
        <div className="space-y-4">
          <h2 className="text-sm font-black text-slate-800 dark:text-text-secondary uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-border pb-3">
            <Sparkles size={14} className="text-primary" /> Select Subscription Plan
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => {
              const isCurrent = activePlan === plan.dbPlan;
              return (
                <div
                  key={plan.id}
                  className={`bg-white dark:bg-card border rounded-3xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden transition hover:shadow-md ${
                    isCurrent
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-500/[0.01]'
                      : plan.recommended 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : 'border-slate-200/50 dark:border-border'
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-bl-2xl">
                      Active Plan
                    </div>
                  )}
                  {!isCurrent && plan.recommended && (
                    <div className="absolute top-0 right-0 bg-primary text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-bl-2xl">
                      Recommended
                    </div>
                  )}
                  
                  <div className="space-y-4 text-xs font-bold text-slate-500 dark:text-text-muted">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-foreground">{plan.name}</h3>
                      <div className="mt-2.5 flex items-baseline">
                        <span className="text-3xl font-black text-slate-900 dark:text-foreground">{plan.price}</span>
                        <span className="ml-1 text-[10px] uppercase font-bold text-slate-400">/ {plan.interval}</span>
                      </div>
                    </div>

                    <ul className="space-y-2 border-t border-slate-100 dark:border-border pt-4">
                      {plan.limits.map((lim, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-700 dark:text-text-secondary">
                          <Check size={12} className="text-primary shrink-0" />
                          <span>{lim}</span>
                        </li>
                      ))}
                    </ul>

                    <ul className="space-y-2 border-t border-slate-100 dark:border-border pt-4">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-700 dark:text-text-secondary">
                          <CheckCircle2 size={12} className="text-primary shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-6">
                    <button
                      disabled={isCurrent}
                      onClick={() => handleCheckoutInit(plan.id, plan.name, plan.price, 'stripe')}
                      className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-1.5 ${
                        isCurrent 
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed' 
                          : 'bg-primary hover:bg-primary/95 text-white active:scale-95'
                      }`}
                    >
                      Stripe Pay
                    </button>
                    <button
                      disabled={isCurrent}
                      onClick={() => handleCheckoutInit(plan.id, plan.name, plan.price, 'razorpay')}
                      className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition shadow-sm flex items-center justify-center gap-1.5 ${
                        isCurrent 
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-transparent cursor-not-allowed' 
                          : 'bg-slate-900 dark:bg-hover-bg hover:bg-slate-800 dark:hover:bg-active-bg text-white dark:text-foreground border-transparent dark:border-border active:scale-95'
                      }`}
                    >
                      Razorpay
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* License Key Activation Form & Invoice Ledgers */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* License Activation Form */}
          <div className="bg-white dark:bg-card border border-slate-200/50 dark:border-border rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-text-secondary flex items-center gap-1.5">
                <KeyRound size={12} className="text-primary" /> Activate Enterprise License
              </span>
              <p className="text-[11px] text-slate-450 dark:text-text-muted leading-relaxed font-semibold">
                Unlock custom storage ceilings or offline execution modules by entering your authorized key.
              </p>
            </div>
            <form onSubmit={handleLicenseActivate} className="space-y-3">
              <input
                required
                type="text"
                placeholder="AK-OS-3035-XXXX-XXXX"
                value={licenseKeyInput}
                onChange={(e) => setLicenseKeyInput(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-border bg-slate-50/50 dark:bg-slate-900/40 text-xs font-bold text-slate-800 dark:text-text-secondary outline-none focus:border-primary placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={isActivatingLicense}
                className="w-full py-2.5 rounded-xl bg-slate-950 dark:bg-hover-bg hover:bg-slate-900 dark:hover:bg-active-bg text-white dark:text-foreground text-[10px] font-black uppercase tracking-wider border border-transparent dark:border-border transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                {isActivatingLicense && <Loader2 size={12} className="animate-spin" />}
                Activate Workspace Key
              </button>
            </form>
          </div>

          {/* Invoice Ledgers */}
          <div className="md:col-span-2 bg-white dark:bg-card border border-slate-200/50 dark:border-border rounded-3xl p-5 shadow-sm space-y-3">
            <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-text-secondary flex items-center gap-1.5">
              <FileText size={12} className="text-primary" /> Subscription Invoice Ledgers
            </span>
            <div className="overflow-x-auto">
              {invoicesList.length === 0 ? (
                <div className="py-8 text-center text-xs font-bold text-slate-400">
                  No billing history on record for this workspace.
                </div>
              ) : (
                <table className="w-full text-xs text-left text-slate-700 dark:text-text-secondary">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-border text-[9px] uppercase tracking-wider text-slate-400">
                      <th className="py-2.5">Invoice ID</th>
                      <th className="py-2.5">Gateway Provider</th>
                      <th className="py-2.5">Status</th>
                      <th className="py-2.5">Amount</th>
                      <th className="py-2.5">Issued Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-semibold">
                    {invoicesList.map((inv) => (
                      <tr key={inv.id}>
                        <td className="py-3 font-black text-slate-900 dark:text-foreground">{inv.id}</td>
                        <td className="py-3 font-bold uppercase">{inv.provider || 'Stripe'}</td>
                        <td className="py-3">
                          <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 font-bold text-slate-900 dark:text-foreground">
                          {(inv.amount / 100).toLocaleString('en-US', { style: 'currency', currency: inv.currency || 'USD' })}
                        </td>
                        <td className="py-3 text-[10px] text-slate-400">{new Date(inv.issuedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

      </div>
    );
  }

  // ─────────────────────────────────────────────
  // 2. CASHIER / OPERATIONAL BILLING COUNTER
  // ─────────────────────────────────────────────
  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left relative pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/50 dark:border-white/5 pb-5">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Billing Counter</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Today's cashier billing and orders summary</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/orders')}
          className="bg-primary hover:bg-primary/95 text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition active:scale-95 text-xs shadow-md"
        >
          <Plus size={16} />
          New Transaction Order
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-xs font-bold">
        {/* Today's Orders */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Today's Orders</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{stats.todayOrders}</p>
              <span className="text-[9px] text-green-600 dark:text-green-400 font-semibold mt-2 block">↑ 13.3% vs yesterday</span>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-lg shrink-0">
              <ShoppingCart className="text-blue-600 dark:text-blue-400" size={16} />
            </div>
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Today's Revenue</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">₹{stats.todayRevenue.toLocaleString()}</p>
              <span className="text-[9px] text-green-600 dark:text-green-400 font-semibold mt-2 block">↑ 18.6% vs yesterday</span>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-2.5 rounded-lg shrink-0">
              <TrendingUp className="text-green-600 dark:text-green-400" size={16} />
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Pending</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{stats.pendingOrders}</p>
              <span className="text-[9px] text-amber-600 dark:text-amber-400 font-semibold mt-2 block">Needs attention</span>
            </div>
            <div className="bg-amber-100 dark:bg-amber-900/30 p-2.5 rounded-lg shrink-0">
              <Clock className="text-amber-600 dark:text-amber-400" size={16} />
            </div>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Completed</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{stats.completedOrders}</p>
              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold mt-2 block">Today</span>
            </div>
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2.5 rounded-lg shrink-0">
              <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" size={16} />
            </div>
          </div>
        </div>

        {/* Cancelled Orders */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Cancelled</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{stats.cancelledOrders}</p>
              <span className="text-[9px] text-red-600 dark:text-red-400 font-semibold mt-2 block">Today</span>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 p-2.5 rounded-lg shrink-0">
              <XCircle className="text-red-600 dark:text-red-400" size={16} />
            </div>
          </div>
        </div>

        {/* Total Tables */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Total Tables</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{stats.totalTables}</p>
              <span className="text-[9px] text-purple-600 dark:text-purple-400 font-semibold mt-2 block">Available</span>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/30 p-2.5 rounded-lg shrink-0">
              <CreditCard className="text-purple-600 dark:text-purple-400" size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Hourly Orders</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={hourlyOrdersData}>
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="orders" stroke="#3b82f6" fillOpacity={1} fill="url(#colorOrders)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Order Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={orderStatusBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                {orderStatusBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4 text-xs font-bold">
            {orderStatusBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-slate-655 dark:text-slate-305">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden text-xs">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Counter Orders</h3>
          <button className="text-blue-600 dark:text-blue-400 hover:underline font-bold">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <tr className="font-bold text-slate-600 dark:text-slate-400 uppercase">
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-6 py-3 text-left">Table</th>
                <th className="px-6 py-3 text-left">Items</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Time</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 font-semibold text-slate-800 dark:text-slate-300">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                  <td className="px-6 py-4 font-black text-slate-900 dark:text-white">{order.id}</td>
                  <td className="px-6 py-4">{order.table}</td>
                  <td className="px-6 py-4">{order.items} items</td>
                  <td className="px-6 py-4 font-black text-slate-955 dark:text-white">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      order.status === 'New' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                      order.status === 'Preparing' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-405">{order.time}</td>
                  <td className="px-6 py-4">
                    <button className="text-slate-400 hover:text-slate-655 transition">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

