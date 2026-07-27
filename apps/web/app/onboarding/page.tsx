'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import AuthLayout from '@/components/auth/AuthLayout';
import Link from 'next/link';
import { registerBusiness } from '@/services/business.service';
import { useAuth } from '@/context/auth-context';
import {
  Store,
  Briefcase,
  Layers,
  Sparkles,
  Shield,
  Calendar,
  Terminal,
  Globe,
  Loader2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Zap,
} from 'lucide-react';

const onboardingSchema = z.object({
  ownerName: z.string().min(2, 'Name must be at least 2 characters'),
  ownerEmail: z.string().email('Please enter a valid email address'),
  ownerPassword: z.string().min(6, 'Password must be at least 6 characters'),
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  industry: z.string().default('RESTAURANT'),
  currency: z.string().default('USD'),
  timezone: z.string().default('UTC'),
  language: z.string().default('en'),
  selectedPlan: z.string().default('TRIAL'),
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

const mockIndustries = [
  { id: 'RESTAURANT', label: 'Restaurant', icon: Store, color: 'from-orange-500 to-amber-500' },
  { id: 'RETAIL', label: 'Retail', icon: Briefcase, color: 'from-emerald-500 to-teal-500' },
  { id: 'HOTEL', label: 'Hotel', icon: Layers, color: 'from-indigo-500 to-blue-500' },
  { id: 'SALON', label: 'Salon', icon: Sparkles, color: 'from-violet-500 to-purple-500' },
  { id: 'HEALTHCARE', label: 'Healthcare', icon: Shield, color: 'from-rose-500 to-pink-500' },
  { id: 'WAREHOUSE', label: 'Warehouse', icon: Calendar, color: 'from-cyan-500 to-blue-500' },
  { id: 'MANUFACTURING', label: 'Manufacturing', icon: Terminal, color: 'from-amber-500 to-orange-500' },
  { id: 'CORPORATE', label: 'Corporate', icon: Globe, color: 'from-blue-500 to-cyan-500' },
];

const mockPlans = [
  { id: 'TRIAL', label: '14-Day Free Trial', price: '$0', desc: 'No credit card required' },
  { id: 'STARTER', label: 'Starter Pack', price: '$29/mo', desc: 'Single location POS' },
  { id: 'PROFESSIONAL', label: 'Professional Plan', price: '$79/mo', desc: 'Multi-branch & analytics' },
  { id: 'ENTERPRISE', label: 'Enterprise Suite', price: 'Custom', desc: 'Custom database clusters' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [orchestrationLogs, setOrchestrationLogs] = useState<string[]>([]);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    mode: 'onChange',
    defaultValues: {
      industry: 'RESTAURANT',
      currency: 'USD',
      timezone: 'UTC',
      language: 'en',
      selectedPlan: 'TRIAL',
    },
  });

  const selectedIndustry = watch('industry');
  const selectedPlan = watch('selectedPlan');

  // simulated provisioning pipeline logs
  const logsList = [
    '🛠️ Initializing provisioning request transaction...',
    '💾 Reserving unique corporate subdomain slug...',
    '⚙️ Provisioning isolated database sandbox... DONE',
    '🧬 Running prisma schema migrations & seeds... DONE',
    '🔑 Creating roles & default permissions... DONE',
    '🛰️ Seeding Main Branch settings & tables... DONE',
    '🤖 Loading AI workspace memory nodes... DONE',
    '🎉 Workspace successfully orchestrated! Launching Dashboard...'
  ];

  const handleNextStep = () => {
    setErrorMsg(null);
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setErrorMsg(null);
    setStep((prev) => prev - 1);
  };

  const startOrchestration = (token: string) => {
    setOrchestrationLogs([]);
    setCurrentLogIndex(0);
    
    let logIndex = 0;
    const interval = setInterval(() => {
      if (logIndex < logsList.length) {
        setOrchestrationLogs((prev) => [...prev, logsList[logIndex]]);
        logIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          login(token);
          router.push('/dashboard');
        }, 1200);
      }
    }, 450);
  };

  const onSubmit = async (values: OnboardingValues) => {
    setErrorMsg(null);
    setLoading(true);
    setStep(5); // Go to provisioning screen

    try {
      // Create tenant workspace & user owner on NestJS backend
      const data = await registerBusiness({
        businessName: values.businessName,
        industry: values.industry,
        ownerName: values.ownerName,
        ownerEmail: values.ownerEmail,
        ownerPassword: values.ownerPassword,
        currency: values.currency,
        timezone: values.timezone,
        language: values.language,
        selectedPlan: values.selectedPlan,
      });

      startOrchestration(data.access_token);
    } catch (err: any) {
      setErrorMsg(err.message || 'Workspace provisioning failed. Please verify owner credentials and try again.');
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Progress Bar */}
        {step < 5 && (
          <div className="w-full bg-slate-200/50 dark:bg-white/5 h-1 rounded-full overflow-hidden mb-4">
            <div
              className="bg-blue-600 dark:bg-cyan-400 h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        )}

        {/* Custom Error Banner */}
        {errorMsg && (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs font-bold text-rose-600 dark:text-rose-400">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* STEP 1: Owner Profile */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-black text-slate-950 dark:text-white leading-tight">Admin Profile</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-bold">
                  Create your administrator credentials to manage the workspace.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-slate-800 dark:text-slate-350 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Arjun Kumar"
                    {...register('ownerName')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-slate-900/30 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-blue-500 dark:focus:border-cyan-400 transition"
                  />
                  {errors.ownerName && (
                    <span className="text-[10px] font-bold text-rose-500 mt-1 block">
                      {errors.ownerName.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-slate-800 dark:text-slate-350 mb-1">
                    Login Email
                  </label>
                  <input
                    type="email"
                    placeholder="owner@akresto.com"
                    {...register('ownerEmail')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-slate-900/30 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-blue-500 dark:focus:border-cyan-400 transition"
                  />
                  {errors.ownerEmail && (
                    <span className="text-[10px] font-bold text-rose-500 mt-1 block">
                      {errors.ownerEmail.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-slate-800 dark:text-slate-350 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...register('ownerPassword')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-slate-900/30 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-blue-500 dark:focus:border-cyan-400 transition"
                  />
                  {errors.ownerPassword && (
                    <span className="text-[10px] font-bold text-rose-500 mt-1 block">
                      {errors.ownerPassword.message}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                disabled={!!(errors.ownerName || errors.ownerEmail || errors.ownerPassword || !watch('ownerName') || !watch('ownerEmail'))}
                className="w-full py-2.5 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-650 text-white text-xs font-black uppercase tracking-[0.14em] shadow-lg shadow-blue-500/20 disabled:opacity-50 transition flex items-center justify-center gap-1.5"
              >
                Continue Setup
                <ArrowRight size={12} />
              </button>
            </div>
          )}

          {/* STEP 2: Business details */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-black text-slate-955 dark:text-white leading-tight">Workspace Info</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-bold">
                  Define your brand settings and localization defaults.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-slate-800 dark:text-slate-355 mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    placeholder="AK Hospitality Group"
                    {...register('businessName')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-slate-900/30 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-blue-500 dark:focus:border-cyan-400 transition"
                  />
                  {errors.businessName && (
                    <span className="text-[10px] font-bold text-rose-500 mt-1 block">
                      {errors.businessName.message}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-slate-800 dark:text-slate-355 mb-1">
                      Currency
                    </label>
                    <select
                      {...register('currency')}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200/50 dark:border-white/5 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-blue-500 dark:focus:border-cyan-400"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-slate-800 dark:text-slate-355 mb-1">
                      Timezone
                    </label>
                    <select
                      {...register('timezone')}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200/50 dark:border-white/5 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-blue-500 dark:focus:border-cyan-400"
                    >
                      <option value="UTC">UTC</option>
                      <option value="Asia/Kolkata">Asia/Kolkata</option>
                      <option value="America/New_York">EST/New York</option>
                      <option value="Europe/London">GMT/London</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="w-full py-2.5 rounded-xl border border-slate-200/50 dark:border-white/5 text-slate-700 dark:text-slate-300 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft size={12} />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!!(errors.businessName || !watch('businessName'))}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-650 text-white text-xs font-black uppercase tracking-[0.14em] shadow-lg shadow-blue-500/20 disabled:opacity-50 transition flex items-center justify-center gap-1.5"
                >
                  Next
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Industry selection */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-black text-slate-950 dark:text-white leading-tight">Industry Pack</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-bold">
                  Select your vertical. Seeding maps schemas and POS layouts.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                {mockIndustries.map((ind) => {
                  const IconComp = ind.icon;
                  const isSelected = selectedIndustry === ind.id;
                  return (
                    <button
                      key={ind.id}
                      type="button"
                      onClick={() => setValue('industry', ind.id, { shouldValidate: true })}
                      className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all duration-300 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:border-cyan-500 dark:bg-cyan-500/15 dark:text-cyan-400 font-extrabold shadow-sm'
                          : 'border-slate-200/50 bg-white/20 dark:border-white/5 dark:bg-slate-900/10 text-slate-650 dark:text-slate-350 hover:bg-slate-100/50'
                      }`}
                    >
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 dark:bg-slate-800 ${isSelected ? 'text-blue-600 dark:text-cyan-400' : ''}`}>
                        <IconComp size={14} />
                      </span>
                      <span className="text-[11px] truncate">{ind.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="w-full py-2.5 rounded-xl border border-slate-200/50 dark:border-white/5 text-slate-700 dark:text-slate-300 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft size={12} />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-650 text-white text-xs font-black uppercase tracking-[0.14em] shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-1.5"
                >
                  Next
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Plan Tier */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-black text-slate-950 dark:text-white leading-tight">License Tier</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-bold">
                  Choose your initial catalog tier. Customize billing later.
                </p>
              </div>

              <div className="space-y-2">
                {mockPlans.map((plan) => {
                  const isSelected = selectedPlan === plan.id;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setValue('selectedPlan', plan.id)}
                      className={`w-full p-3.5 rounded-2xl border text-left flex justify-between items-center transition duration-300 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:border-cyan-500 dark:bg-cyan-500/15 dark:text-cyan-400 font-extrabold shadow-sm'
                          : 'border-slate-200/50 bg-white/20 dark:border-white/5 dark:bg-slate-900/10 text-slate-650 dark:text-slate-350 hover:bg-slate-100/50'
                      }`}
                    >
                      <div>
                        <span className="block text-xs font-black">{plan.label}</span>
                        <span className="block text-[9px] text-slate-500 dark:text-slate-400 mt-0.5">{plan.desc}</span>
                      </div>
                      <span className="text-sm font-black text-slate-900 dark:text-white">{plan.price}</span>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="w-full py-2.5 rounded-xl border border-slate-200/50 dark:border-white/5 text-slate-700 dark:text-slate-300 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft size={12} />
                  Back
                </button>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-650 text-white text-xs font-black uppercase tracking-[0.14em] shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-1.5"
                >
                  Orchestrate Workspace
                  <Zap size={11} className="animate-bounce" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Provisioning / Orchestration screen */}
          {step === 5 && (
            <div className="space-y-4 py-3">
              <div className="text-center">
                <Loader2 className="animate-spin mx-auto text-blue-600 dark:text-cyan-400 mb-4" size={36} />
                <h2 className="text-2xl font-black text-slate-950 dark:text-white leading-tight">Orchestrating Sandbox</h2>
                <p className="text-xs text-slate-550 dark:text-slate-400 mt-1 font-semibold leading-normal">
                  AK Pipeline Engine is deploying your tenant database and mounting system roles.
                </p>
              </div>

              {/* Log Tickers */}
              <div className="rounded-2xl border border-slate-200/50 dark:border-white/5 bg-slate-950 p-5 font-mono text-[9px] text-slate-300 leading-normal space-y-1.5 max-h-[160px] overflow-y-auto">
                {orchestrationLogs.map((log, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-blue-500">{'>'}</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </AuthLayout>
  );
}
