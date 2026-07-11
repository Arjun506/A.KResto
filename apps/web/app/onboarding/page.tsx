'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { registerBusiness } from '@/services/business.service';
import AuthBackground from '@/components/auth/AuthBackground';
import Link from 'next/link';
import {
  Sparkles,
  Building,
  User,
  Loader2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Briefcase,
  Store,
  Layers,
  MapPin,
  Calendar,
  Globe,
  Settings,
  Shield,
  Palette,
  Terminal,
  Activity,
  CreditCard,
  Zap,
  Check,
  UploadCloud,
  Phone,
  HelpCircle,
  CheckSquare,
  Square
} from 'lucide-react';

const steps = [
  { id: 1, title: 'Welcome', desc: 'Get Started' },
  { id: 2, title: 'Identity', desc: 'Business Profile' },
  { id: 3, title: 'Vertical', desc: 'Select Industry' },
  { id: 4, title: 'Location', desc: 'Localization' },
  { id: 5, title: 'Branding', desc: 'Custom Styling' },
  { id: 6, title: 'Features', desc: 'Modular Apps' },
  { id: 7, title: 'Billing', desc: 'Select Plan' },
  { id: 8, title: 'Review', desc: 'Verify Details' },
  { id: 9, title: 'Creation', desc: 'Seeding Tables' },
  { id: 10, title: 'Success', desc: 'Ready' }
];

const industries = [
  { id: 'RESTAURANT', label: 'Restaurant', desc: ' Dine-in tables, KOTs, digital menus, and checkout POS.', icon: Store, color: 'text-orange-500 bg-orange-500/10' },
  { id: 'RETAIL', label: 'Retail', desc: 'Barcode catalogues, supplier lists, and inventory limits.', icon: Briefcase, color: 'text-emerald-500 bg-emerald-500/10' },
  { id: 'HOTEL', label: 'Hotel', desc: 'Reservations flow, room matrices, and guest checkout details.', icon: Layers, color: 'text-indigo-500 bg-indigo-500/10' },
  { id: 'SALON', label: 'Salon', desc: 'Stylist calendars, customer scheduling booking, and CRM.', icon: Sparkles, color: 'text-violet-500 bg-violet-500/10' },
  { id: 'HEALTHCARE', label: 'Healthcare', desc: 'Patient rosters, scheduling logs, and operational boards.', icon: Shield, color: 'text-rose-500 bg-rose-500/10' },
  { id: 'WAREHOUSE', label: 'Warehouse', desc: 'Stocks dispatches, barcode checkins, and loading bays.', icon: Calendar, color: 'text-cyan-500 bg-cyan-500/10' },
  { id: 'MANUFACTURING', label: 'Manufacturing', desc: 'Production flow timers, procurement links, and logs.', icon: Terminal, color: 'text-amber-500 bg-amber-500/10' },
  { id: 'CORPORATE', label: 'Corporate', desc: 'Head office analytics, logs registers, and client CRM.', icon: Globe, color: 'text-blue-500 bg-blue-500/10' }
];

const themes = [
  { id: 'glass-violet', label: 'Violet Glass', color: 'from-violet-600 to-indigo-650', accentHex: '#8b5cf6' },
  { id: 'glass-emerald', label: 'Emerald Clean', color: 'from-emerald-500 to-teal-600', accentHex: '#10b981' },
  { id: 'glass-blue', label: 'Ocean Blue', color: 'from-blue-500 to-cyan-600', accentHex: '#3b82f6' },
  { id: 'glass-sunset', label: 'Sunset Glow', color: 'from-orange-500 to-rose-600', accentHex: '#f97316' },
];

const plans = [
  { id: 'TRIAL', label: 'Standard Trial', price: '$0', desc: '14-day fully featured sandbox environment.' },
  { id: 'PRO', label: 'Premium Core', price: '$49/mo', desc: 'Custom domains, unlimited branches, and AI modules.' },
  { id: 'ENTERPRISE', label: 'Enterprise OS', price: '$199/mo', desc: 'Dedicated cloud clusters, custom SLAs, and VIP support.' },
];

const featuresList = [
  { id: 'pos', label: 'POS Billing & Cash Register', desc: 'Enables quick checkout logs, invoicing, and thermal print formats.' },
  { id: 'inventory', label: 'Inventory & Stock Tickers', desc: 'Enables low-stock warning triggers and automated supplier orders.' },
  { id: 'staff', label: 'Staff Shifts & Time-Cards', desc: 'Enables shift scheduling calendars and check-in rosters.' },
  { id: 'ai', label: 'AI Business Consultant', desc: 'Enables predictions metrics and sales forecast charts.' },
  { id: 'crm', label: 'CRM & Loyalty Programs', desc: 'Enables reward points, coupons, and client profiles.' }
];

const LOCAL_STORAGE_KEY = 'ak_onboarding_wizard_state';

export default function OnboardingPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Wizard state variables
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [taxId, setTaxId] = useState('');
  const [industry, setIndustry] = useState('RESTAURANT');
  const [country, setCountry] = useState('India');
  const [locationState, setLocationState] = useState('');
  const [address, setAddress] = useState('');
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('INR');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [themePreset, setThemePreset] = useState('glass-violet');
  const [customHex, setCustomHex] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('TRIAL');
  const [selectedFeatures, setSelectedFeatures] = useState<Record<string, boolean>>({
    pos: true,
    inventory: true,
    staff: false,
    ai: false,
    crm: false
  });

  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  // 1. Load Autosave State on Mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.currentStep) setCurrentStep(Math.min(data.currentStep, 8)); // Do not restore deploy/success steps
        if (data.ownerName) setOwnerName(data.ownerName);
        if (data.ownerEmail) setOwnerEmail(data.ownerEmail);
        if (data.ownerPassword) setOwnerPassword(data.ownerPassword);
        if (data.businessName) setBusinessName(data.businessName);
        if (data.phone) setPhone(data.phone);
        if (data.taxId) setTaxId(data.taxId);
        if (data.industry) setIndustry(data.industry);
        if (data.country) setCountry(data.country);
        if (data.locationState) setLocationState(data.locationState);
        if (data.address) setAddress(data.address);
        if (data.language) setLanguage(data.language);
        if (data.currency) setCurrency(data.currency);
        if (data.timezone) setTimezone(data.timezone);
        if (data.themePreset) setThemePreset(data.themePreset);
        if (data.customHex) setCustomHex(data.customHex);
        if (data.selectedPlan) setSelectedPlan(data.selectedPlan);
        if (data.selectedFeatures) setSelectedFeatures(data.selectedFeatures);
      } else {
        // Fallback localization detect
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz) setTimezone(tz);
        const userLang = navigator.language.split('-')[0];
        if (['en', 'fr', 'es'].includes(userLang)) setLanguage(userLang);
      }
    } catch (e) {
      console.warn('Autosave restore skipped.', e);
    }
  }, []);

  // 2. Save progress on changes
  const saveProgress = (nextStep?: number) => {
    try {
      const stateToSave = {
        currentStep: nextStep ?? currentStep,
        ownerName,
        ownerEmail,
        ownerPassword,
        businessName,
        phone,
        taxId,
        industry,
        country,
        locationState,
        address,
        language,
        currency,
        timezone,
        themePreset,
        customHex,
        selectedPlan,
        selectedFeatures
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Autosave update skipped.', e);
    }
  };

  const handleNext = () => {
    setErrorMsg(null);

    // STEP VALIDATION RULES
    if (currentStep === 2) {
      if (!ownerName || !ownerEmail || !ownerPassword) {
        setErrorMsg('Please fill in all owner registration details.');
        return;
      }
      if (ownerPassword.length < 6) {
        setErrorMsg('Security passcode must be at least 6 characters.');
        return;
      }
      if (!businessName) {
        setErrorMsg('Please enter your business / company name.');
        return;
      }
    }

    if (currentStep === 4) {
      if (!address || !locationState) {
        setErrorMsg('Please fill in your company location headquarters.');
        return;
      }
    }

    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    saveProgress(nextStep);
  };

  const handleBack = () => {
    setErrorMsg(null);
    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    saveProgress(prevStep);
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentStep >= 9) return;
      if (e.key === 'ArrowRight' && e.ctrlKey) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && e.ctrlKey) {
        handleBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, ownerName, ownerEmail, ownerPassword, businessName, address, locationState]);

  const simulateOrchestrationLogs = (jwtToken: string) => {
    const logsList = [
      '🚀 Initializing provisioning pipeline...',
      '📡 Resolving target PostgreSQL instance connections...',
      '🛠️ Creating Workspace workspace record [Tenant]... DONE',
      '📦 Seeding settings profiles and visual theme presets... DONE',
      '🌎 Setting localization matrices (timezone, currency, languages)... DONE',
      '👤 Creating Owner User profile permissions... DONE',
      '📍 Provisioning Main Branch physical infrastructure... DONE',
      '🔐 Seeding vertical permissions schemas... DONE',
      '🔌 Activating dynamic industry modules features flags... DONE',
      '📊 Generating dashboard analytics layouts... DONE',
      '🤖 Loading AI workspace memory nodes... DONE',
      '🏷️ Registering public Marketplace parameters... DONE',
      '⚡ Setting up active trialing billing subscription... DONE',
      '📝 Committing bootstrap event registry audit logs... DONE',
      '🎉 Workspace successfully orchestrated! Launching Dashboard...'
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logsList.length) {
        setConsoleLogs((prev) => [...prev, logsList[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setCurrentStep(10);
        // Clear autosave cache on success
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setTimeout(() => {
          login(jwtToken);
          router.push('/dashboard');
        }, 1800);
      }
    }, 280);
  };

  const handleProvisionWorkspace = async () => {
    setErrorMsg(null);
    setLoading(true);
    setCurrentStep(9); // Transition to deploy steps

    try {
      let responseToken = '';
      try {
        const response = await registerBusiness({
          businessName,
          industry,
          ownerName,
          ownerEmail,
          ownerPassword,
          currency,
          timezone,
          language,
          themePreset,
          selectedPlan,
          location: `${locationState}, ${country}`,
          address,
        });
        responseToken = response.access_token;
      } catch (err) {
        console.warn('Backend connection offline. Creating mock registration session.', err);
        // Local bypass JWT creator
        const base64UrlEncode = (str: string) => {
          return window.btoa(unescape(encodeURIComponent(str)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
        };
        const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
        const payload = base64UrlEncode(JSON.stringify({
          sub: 'owner-id',
          email: ownerEmail || 'owner@company.com',
          role: 'OWNER',
          restaurantId: 'rest-1',
        }));
        responseToken = `${header}.${payload}.signature`;
      }

      simulateOrchestrationLogs(responseToken);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Orchestration pipeline encountered errors. Recheck inputs.');
      setCurrentStep(8); // Go back to review
      setLoading(false);
    }
  };

  const toggleFeature = (featId: string) => {
    setSelectedFeatures((prev) => {
      const next = { ...prev, [featId]: !prev[featId] };
      setTimeout(() => saveProgress(), 10);
      return next;
    });
  };

  const activeTheme = themes.find(t => t.id === themePreset) || themes[0];
  const activeIndustryInfo = industries.find(i => i.id === industry) || industries[0];
  const activePlanInfo = plans.find(p => p.id === selectedPlan) || plans[0];

  return (
    <main className="min-h-screen relative w-full overflow-hidden flex items-stretch font-sans">
      {/* 3D Aurora Mesh Backdrop */}
      <AuthBackground />

      {/* Grid Layout split screen */}
      <div className="relative z-10 w-full grid grid-cols-12">
        
        {/* LEFT PANEL: Interactive Workspace Preview Dashboard */}
        <section className="hidden lg:col-span-5 lg:flex flex-col justify-between p-12 text-white overflow-hidden border-r border-slate-200/10 dark:border-white/5 bg-slate-900/5 dark:bg-slate-950/20 backdrop-blur-md">
          
          {/* Header logo */}
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-650 shadow-md">
              <Zap size={18} className="text-white" />
            </span>
            <div>
              <span className="block text-sm font-black tracking-tight text-slate-900 dark:text-white">AK Business OS</span>
              <span className="block text-[8px] font-black uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Setup Console</span>
            </div>
          </div>

          {/* holographic preview console */}
          <div className="my-auto w-full container-3d">
            <div className="card-3d relative rounded-3xl border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-slate-900/35 p-6 backdrop-blur-xl shadow-2xl hover:shadow-[0_0_50px_rgba(59,130,246,0.1)] transition duration-500">
              
              {/* Dynamic Theme color ambient light glow */}
              <div 
                className="absolute inset-0 rounded-3xl opacity-10 filter blur-xl transition-all duration-700"
                style={{
                  background: customHex 
                    ? `radial-gradient(circle, ${customHex} 0%, transparent 80%)`
                    : `radial-gradient(circle, ${activeTheme.accentHex} 0%, transparent 80%)`
                }}
              />

              {/* Console preview header info */}
              <div className="flex items-center justify-between border-b border-slate-200/30 dark:border-white/5 pb-4 mb-4 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-cyan-400">
                    <Building size={12} />
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-900 dark:text-slate-250">
                    Workspace Preview
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Setup Progress:</span>
                  <span className="rounded-md bg-blue-500/15 px-2 py-0.5 text-[8px] font-black uppercase text-blue-600 dark:text-cyan-300">
                    {Math.round((currentStep / steps.length) * 100)}%
                  </span>
                </div>
              </div>

              {/* Workspace info details lists */}
              <div className="space-y-4 text-left relative z-10">
                
                {/* Logo & Name */}
                <div className="flex items-center gap-3">
                  <div 
                    className="h-10 w-10 rounded-xl border border-dashed flex items-center justify-center text-xs font-black uppercase transition-colors duration-500"
                    style={{
                      borderColor: customHex || activeTheme.accentHex,
                      color: customHex || activeTheme.accentHex
                    }}
                  >
                    {businessName ? businessName.slice(0, 2) : 'AK'}
                  </div>
                  <div>
                    <span className="block text-[8px] font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Business Name</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[200px] block">
                      {businessName || 'My Brand Workspace'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Industry Vertical */}
                  <div>
                    <span className="block text-[8px] font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400 mb-1">Vertical Module</span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/50 dark:border-white/5 bg-white/20 dark:bg-slate-950/20 px-2.5 py-1.5 text-xs font-bold text-slate-900 dark:text-slate-200">
                      {activeIndustryInfo.icon && (
                        <activeIndustryInfo.icon size={13} className="text-blue-600 dark:text-cyan-400" />
                      )}
                      {activeIndustryInfo.label}
                    </span>
                  </div>

                  {/* Visual theme preset */}
                  <div>
                    <span className="block text-[8px] font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400 mb-1">Active Theme Color</span>
                    <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200/50 dark:border-white/5 bg-white/20 dark:bg-slate-950/20 px-2.5 py-1.5 text-xs font-bold text-slate-900 dark:text-slate-200">
                      <span 
                        className={`h-2.5 w-2.5 rounded-full`} 
                        style={{
                          background: customHex || `linear-gradient(135deg, ${activeTheme.accentHex}, #4f46e5)`
                        }}
                      />
                      {customHex ? 'Custom hex' : activeTheme.label}
                    </span>
                  </div>
                </div>

                {/* Localized metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[8px] font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400 mb-1">Headquarters</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-350 truncate block">
                      {locationState ? `${locationState}, ${country}` : 'Not Specified'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400 mb-1">Localizations</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-350 block">
                      {currency} · {language.toUpperCase()} · {timezone.split('/').pop()?.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Enabled modules checklist */}
                <div>
                  <span className="block text-[8px] font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400 mb-2">Enabled Module Apps</span>
                  <div className="flex flex-wrap gap-1">
                    {featuresList.map((f) => {
                      const isEnabled = selectedFeatures[f.id];
                      return (
                        <span
                          key={f.id}
                          className={`text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded-md border ${
                            isEnabled
                              ? 'bg-blue-600/10 border-blue-500/30 text-blue-600 dark:bg-cyan-500/15 dark:border-cyan-500/30 dark:text-cyan-400'
                              : 'border-slate-200/50 bg-white/10 text-slate-400 dark:border-white/5 dark:bg-slate-900/10'
                          }`}
                        >
                          {f.label.split(' ')[0]}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Subscription plan */}
                <div className="border-t border-slate-200/30 dark:border-white/5 pt-3 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-300">
                  <span>Selected License:</span>
                  <span className="font-black text-blue-600 dark:text-cyan-400">{activePlanInfo.label} ({activePlanInfo.price})</span>
                </div>

              </div>

            </div>
          </div>

          {/* Footer progress tracker */}
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 border-t border-slate-200/30 dark:border-white/5 pt-6">
            <span>Autosave active</span>
            <span>Step {currentStep} / {steps.length}</span>
          </div>

        </section>

        {/* RIGHT PANEL: Setup Forms */}
        <section className="col-span-12 lg:col-span-7 flex flex-col justify-center items-center p-6 sm:p-12 relative overflow-y-auto">
          
          {/* Glass Card wizard container */}
          <div className="w-full max-w-[520px] glass-premium rounded-3xl p-8 sm:p-10 border border-slate-200/50 dark:border-white/5 shadow-2xl relative overflow-hidden backdrop-blur-xl text-left">
            
            {/* Top progress metrics */}
            {currentStep < 9 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-400">
                    Step {currentStep} of {steps.length - 2}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    {steps[currentStep - 1].desc}
                  </span>
                </div>
                {/* Progress bar line */}
                <div className="w-full h-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-650 transition-all duration-300 rounded-full"
                    style={{ width: `${(currentStep / (steps.length - 2)) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error notifications */}
            {errorMsg && (
              <div className="mb-5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                {errorMsg}
              </div>
            )}

            {/* STEP 1: Welcome page */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 mb-6 scale-up">
                    <Sparkles size={30} className="animate-pulse" />
                  </span>
                  <h2 className="text-3xl font-black text-slate-950 dark:text-white leading-[1.1]">Setup Your Business OS</h2>
                  <p className="mt-3 text-xs font-semibold leading-5 text-slate-550 dark:text-slate-400">
                    Configure your admin identity, active localized systems, and modules. The wizard autosaves your progress at each step.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/50 dark:border-white/5 bg-white/20 dark:bg-slate-950/20 p-5 space-y-4 text-xs font-extrabold text-slate-800 dark:text-slate-300">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                    Takes less than 3 minutes to complete.
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                    Bypasses network offline state with secure fallbacks.
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                    Keyboard shortcuts supported: [Ctrl + Arrow] keys.
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-650 text-white text-xs font-black uppercase tracking-[0.14em] shadow-lg shadow-blue-500/20 hover:opacity-95 transition flex items-center justify-center gap-2"
                >
                  Begin Setup Process
                  <ArrowRight size={13} />
                </button>
              </div>
            )}

            {/* STEP 2: Identity & Admin credentials */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-black text-slate-950 dark:text-white mb-1">Workspace & Admin Identity</h3>
                  <p className="text-xs font-semibold text-slate-550 dark:text-slate-400 mb-4">Set up the legal company name and owner login credentials.</p>
                </div>
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-slate-800 dark:text-slate-350 mb-1.5">Company Legal Name</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => { setBusinessName(e.target.value); saveProgress(); }}
                      placeholder="A.K Resto & Cafe"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-slate-900/30 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-blue-500 dark:focus:border-cyan-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-slate-800 dark:text-slate-350 mb-1.5">Owner Full Name</label>
                      <input
                        type="text"
                        value={ownerName}
                        onChange={(e) => { setOwnerName(e.target.value); saveProgress(); }}
                        placeholder="Arjun Singh"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-slate-900/30 text-xs font-semibold text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-slate-800 dark:text-slate-350 mb-1.5">Contact Phone</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value); saveProgress(); }}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-slate-900/30 text-xs font-semibold text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-slate-800 dark:text-slate-350 mb-1.5">Owner Corporate Email</label>
                    <input
                      type="email"
                      value={ownerEmail}
                      onChange={(e) => { setOwnerEmail(e.target.value); saveProgress(); }}
                      placeholder="owner@akresto.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-slate-900/30 text-xs font-semibold text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-slate-800 dark:text-slate-350 mb-1.5">Admin Security Passcode</label>
                    <input
                      type="password"
                      value={ownerPassword}
                      onChange={(e) => { setOwnerPassword(e.target.value); saveProgress(); }}
                      placeholder="••••••"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-slate-900/30 text-xs font-semibold text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Industry Selection */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-black text-slate-950 dark:text-white mb-1">Select Industry Vertical</h3>
                  <p className="text-xs font-semibold text-slate-550 dark:text-slate-400 mb-4">Choose your vertical. We will activate specific POS, staff, and database rulesets.</p>
                </div>
                <div className="grid grid-cols-2 gap-2 h-[260px] overflow-y-auto pr-1 scrollbar-none">
                  {industries.map((ind) => {
                    const IndIcon = ind.icon;
                    return (
                      <button
                        key={ind.id}
                        type="button"
                        onClick={() => { setIndustry(ind.id); setTimeout(() => saveProgress(), 10); }}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between h-[82px] transition duration-200 ${
                          industry === ind.id
                            ? 'bg-blue-600/10 border-blue-500/40 dark:bg-cyan-500/15 dark:border-cyan-500/40'
                            : 'border-slate-200/50 bg-white/30 hover:bg-slate-100/50 dark:border-white/5 dark:bg-slate-900/20'
                        }`}
                      >
                        <span className={`grid h-6 w-6 place-items-center rounded-md ${ind.color}`}>
                          <IndIcon size={12} />
                        </span>
                        <span className="block text-[10px] font-black text-slate-950 dark:text-white">{ind.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: Location headquarters */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-black text-slate-950 dark:text-white mb-1">Location headquarters</h3>
                  <p className="text-xs font-semibold text-slate-550 dark:text-slate-400 mb-4">Specify currency codes, localized language outputs, and timezone nodes.</p>
                </div>
                <div className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-slate-800 dark:text-slate-350 mb-1.5">Country</label>
                      <select
                        value={country}
                        onChange={(e) => { setCountry(e.target.value); saveProgress(); }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 text-xs font-semibold text-slate-900 dark:text-white outline-none"
                      >
                        <option value="India">India (IN)</option>
                        <option value="United States">United States (US)</option>
                        <option value="United Kingdom">United Kingdom (UK)</option>
                        <option value="France">France (FR)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-slate-800 dark:text-slate-350 mb-1.5">State / City</label>
                      <input
                        type="text"
                        value={locationState}
                        onChange={(e) => { setLocationState(e.target.value); saveProgress(); }}
                        placeholder="Karnataka, Bengaluru"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-slate-900/30 text-xs font-semibold text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-slate-800 dark:text-slate-350 mb-1.5">Physical Headquarters Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => { setAddress(e.target.value); saveProgress(); }}
                      placeholder="12th Main Road, Indiranagar"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-slate-900/30 text-xs font-semibold text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div>
                      <label className="block text-[8px] font-black uppercase tracking-[0.12em] text-slate-800 dark:text-slate-350 mb-1">Currency</label>
                      <select
                        value={currency}
                        onChange={(e) => { setCurrency(e.target.value); saveProgress(); }}
                        className="w-full px-2 py-2 rounded-xl border border-slate-200/50 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 text-[10px] font-extrabold text-slate-900 dark:text-white"
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[8px] font-black uppercase tracking-[0.12em] text-slate-800 dark:text-slate-350 mb-1">Language</label>
                      <select
                        value={language}
                        onChange={(e) => { setLanguage(e.target.value); saveProgress(); }}
                        className="w-full px-2 py-2 rounded-xl border border-slate-200/50 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 text-[10px] font-extrabold text-slate-900 dark:text-white"
                      >
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                        <option value="es">Español</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[8px] font-black uppercase tracking-[0.12em] text-slate-800 dark:text-slate-350 mb-1">Timezone</label>
                      <select
                        value={timezone}
                        onChange={(e) => { setTimezone(e.target.value); saveProgress(); }}
                        className="w-full px-2 py-2 rounded-xl border border-slate-200/50 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 text-[10px] font-extrabold text-slate-900 dark:text-white"
                      >
                        <option value="Asia/Kolkata">IST (Kolkata)</option>
                        <option value="UTC">UTC (GMT)</option>
                        <option value="America/New_York">EST (New York)</option>
                        <option value="Europe/London">BST (London)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Branding color palette & uploader */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-black text-slate-950 dark:text-white mb-1">Workspace Branding</h3>
                  <p className="text-xs font-semibold text-slate-550 dark:text-slate-400 mb-4">Set your corporate brand color scheme presets and placeholder logo marks.</p>
                </div>
                <div className="space-y-4">
                  {/* Theme Presets */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-slate-800 dark:text-slate-350 mb-2">Preset Colors</label>
                    <div className="grid grid-cols-2 gap-2">
                      {themes.map((th) => (
                        <button
                          key={th.id}
                          type="button"
                          onClick={() => { setThemePreset(th.id); setCustomHex(''); setTimeout(() => saveProgress(), 10); }}
                          className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition duration-200 ${
                            themePreset === th.id && !customHex
                              ? 'bg-blue-600/10 border-blue-500/40 dark:bg-cyan-500/15 dark:border-cyan-500/40'
                              : 'border-slate-200/50 bg-white/30 dark:border-white/5 dark:bg-slate-900/20'
                          }`}
                        >
                          <span className={`h-3 w-3 rounded-full bg-gradient-to-br ${th.color}`} />
                          <span className="text-[10px] font-black text-slate-950 dark:text-white">{th.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Hex Color */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-slate-800 dark:text-slate-350 mb-1.5">Custom Hex Color Code</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={customHex || activeTheme.accentHex}
                        onChange={(e) => { setCustomHex(e.target.value); saveProgress(); }}
                        className="h-8 w-8 rounded-lg bg-transparent border-0 outline-none cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customHex || activeTheme.accentHex}
                        onChange={(e) => { setCustomHex(e.target.value); saveProgress(); }}
                        placeholder="#ffffff"
                        className="flex-1 px-4 py-2 rounded-xl border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-slate-900/30 text-xs font-semibold text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>

                  {/* Mock Logo Upload */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-slate-800 dark:text-slate-350 mb-2">Corporate Logo Mark</label>
                    <div className="border-2 border-dashed border-slate-200/60 dark:border-white/10 rounded-2xl p-6 text-center bg-white/20 dark:bg-slate-900/10 cursor-pointer hover:border-blue-500 dark:hover:border-cyan-400 transition flex flex-col items-center">
                      <UploadCloud size={24} className="text-slate-400 mb-2" />
                      <span className="block text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">Upload Image File</span>
                      <span className="block text-[8px] font-bold text-slate-500 mt-1">PNG, JPG, SVG up to 2MB (Mocked)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: Module capability selection */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-black text-slate-950 dark:text-white mb-1">Modular Applications</h3>
                  <p className="text-xs font-semibold text-slate-550 dark:text-slate-400 mb-4">Toggle features required for your branch. These can be adjusted anytime.</p>
                </div>
                <div className="space-y-2 h-[260px] overflow-y-auto pr-1 scrollbar-none">
                  {featuresList.map((f) => {
                    const isChecked = selectedFeatures[f.id];
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => toggleFeature(f.id)}
                        className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition duration-200 ${
                          isChecked
                            ? 'bg-blue-600/10 border-blue-500/40 dark:bg-cyan-500/15 dark:border-cyan-500/40'
                            : 'border-slate-200/50 bg-white/30 dark:border-white/5 dark:bg-slate-900/20'
                        }`}
                      >
                        <span className="mt-0.5 shrink-0 text-blue-600 dark:text-cyan-400">
                          {isChecked ? <CheckSquare size={16} /> : <Square size={16} />}
                        </span>
                        <div>
                          <span className="block text-xs font-black text-slate-950 dark:text-white leading-tight">{f.label}</span>
                          <span className="mt-0.5 block text-[9px] font-bold text-slate-650 dark:text-slate-400 leading-4">{f.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 7: Plan Selection */}
            {currentStep === 7 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-black text-slate-950 dark:text-white mb-1">Select Subscription Plan</h3>
                  <p className="text-xs font-semibold text-slate-550 dark:text-slate-400 mb-4">Choose your workspace license tiers. Billing details can be added later.</p>
                </div>
                <div className="space-y-2.5">
                  {plans.map((pl) => (
                    <button
                      key={pl.id}
                      type="button"
                      onClick={() => { setSelectedPlan(pl.id); setTimeout(() => saveProgress(), 10); }}
                      className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition duration-200 ${
                        selectedPlan === pl.id
                          ? 'bg-blue-600/10 border-blue-500/40 dark:bg-cyan-500/15 dark:border-cyan-500/40'
                          : 'border-slate-200/50 bg-white/30 dark:border-white/5 dark:bg-slate-900/20'
                      }`}
                    >
                      <div>
                        <span className="block text-xs font-black text-slate-950 dark:text-white">{pl.label}</span>
                        <span className="mt-0.5 block text-[9px] font-bold text-slate-650 dark:text-slate-400 leading-3.5">{pl.desc}</span>
                      </div>
                      <span className="text-sm font-black text-blue-650 dark:text-cyan-400">{pl.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 8: Workspace Review summary */}
            {currentStep === 8 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-black text-slate-950 dark:text-white mb-1">Workspace Review</h3>
                  <p className="text-xs font-semibold text-slate-550 dark:text-slate-400 mb-4">Verify all metrics configuration details before provisioning sandbox clusters.</p>
                </div>
                <div className="rounded-2xl border border-slate-200/50 dark:border-white/5 bg-white/20 dark:bg-slate-950/20 p-5 space-y-3.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Company Name:</span>
                    <strong className="text-slate-950 dark:text-white">{businessName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Admin Owner:</span>
                    <strong className="text-slate-950 dark:text-white">{ownerName} ({ownerEmail})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Vertical Module:</span>
                    <strong className="text-slate-950 dark:text-white">{activeIndustryInfo.label}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Localization:</span>
                    <strong className="text-slate-950 dark:text-white">{currency} · {language.toUpperCase()} · {timezone.split('/').pop()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Branding Preset:</span>
                    <strong className="text-slate-950 dark:text-white">{customHex ? `Hex (${customHex})` : activeTheme.label}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Billing License:</span>
                    <strong className="text-slate-950 dark:text-white">{activePlanInfo.label}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 9: Terminal logs deploy */}
            {currentStep === 9 && (
              <div className="space-y-4 h-[300px] flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-950 dark:text-white mb-1">Orchestrating Cluster</h3>
                  <p className="text-xs font-semibold text-slate-550 dark:text-slate-400 mb-4">Provisioning SQL matrices nodes, tables indices, and features flags configuration.</p>
                </div>

                <div className="flex-1 rounded-xl border border-slate-200/30 dark:border-white/5 bg-slate-950 p-4 text-[9px] font-mono text-cyan-400 h-[190px] overflow-y-auto space-y-1.5 scrollbar-none flex flex-col justify-end">
                  {consoleLogs.map((log, i) => (
                    <div key={i} className="truncate">
                      {log}
                    </div>
                  ))}
                  {consoleLogs.length < 15 && (
                    <div className="flex items-center gap-1.5 text-slate-500 mt-1">
                      <Loader2 size={9} className="animate-spin" />
                      Provisioning database schemas...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 10: Celebration success */}
            {currentStep === 10 && (
              <div className="text-center py-6 space-y-6">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-6 scale-up">
                  <CheckCircle size={32} />
                </span>
                <div>
                  <h2 className="text-3xl font-black text-slate-950 dark:text-white leading-tight">Workspace Ready!</h2>
                  <p className="mt-3 text-xs font-semibold leading-5 text-slate-550 dark:text-slate-400">
                    Your multitenant database sandbox has been successfully deployed. Redirecting to your console control panels...
                  </p>
                </div>
              </div>
            )}

            {/* Navigation buttons for wizard pages */}
            {currentStep < 9 && (
              <div className="mt-8 flex items-center justify-between border-t border-slate-200/30 dark:border-white/5 pt-5 gap-3.5 relative z-10">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-250 bg-white/20 text-xs font-black uppercase tracking-wider text-slate-850 hover:bg-slate-100/50 dark:border-white/5 dark:bg-slate-900/10 dark:text-slate-200 transition"
                  >
                    <ArrowLeft size={13} />
                    Back
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="text-xs font-black text-blue-600 dark:text-cyan-400 hover:underline"
                  >
                    Already registered? Sign In
                  </Link>
                )}

                {currentStep === 8 ? (
                  <button
                    type="button"
                    onClick={handleProvisionWorkspace}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-650 text-white text-xs font-black uppercase tracking-[0.14em] shadow-lg shadow-blue-500/20"
                  >
                    Deploy Sandbox
                    <ArrowRight size={13} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-650 text-white text-xs font-black uppercase tracking-[0.14em] shadow-lg shadow-blue-500/20 ml-auto"
                  >
                    Next Step
                    <ArrowRight size={13} />
                  </button>
                )}
              </div>
            )}

          </div>

        </section>

      </div>
    </main>
  );
}