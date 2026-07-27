'use client';

import { useEffect, useRef } from 'react';
import type { ComponentType } from 'react';
import Link from 'next/link';
import { useLandingState } from '@/context/landing-state';
import {
  ArrowRight,
  Bell,
  Building2,
  Check,
  Coffee,
  GraduationCap,
  HeartPulse,
  Hotel,
  Key,
  Laptop,
  MapPin,
  Package,
  Scissors,
  Search,
  Settings,
  ShoppingCart,
  Sparkles,
  Store,
  User
} from 'lucide-react';

type IconType = ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;

type IndustryDashboard = {
  header: string;
  badge: string;
  kpis: Array<{ label: string; value: string; change: string; className: string }>;
  metricLabel: string;
  chartPath: string;
  mobileTitle: string;
  mobileCategory1: string;
  mobileCategory2: string;
  mobileIcon1: IconType;
  mobileIcon2: IconType;
};

const industryDashboardData: Record<string, IndustryDashboard> = {
  RESTAURANT: {
    header: 'Good morning, Arjun',
    badge: 'Restaurant active',
    kpis: [
      { label: 'Total Revenue', value: 'Rs 24.58L', change: '+12.5%', className: 'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-300' },
      { label: 'Dine-in Tables', value: '18 / 24', change: '+4.5%', className: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' },
      { label: 'Kitchen Orders', value: '14 open', change: '+18.3%', className: 'border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-300' }
    ],
    metricLabel: 'Dine-in traffic',
    chartPath: 'M0,25 Q15,10 30,18 T60,5 T90,20 T100,8',
    mobileTitle: 'Deli Burger',
    mobileCategory1: 'Beverages',
    mobileCategory2: 'Fast Food',
    mobileIcon1: Coffee,
    mobileIcon2: ShoppingCart
  },
  RETAIL: {
    header: 'Retail pulse is strong',
    badge: 'Retail storefront',
    kpis: [
      { label: 'Total Sales', value: 'Rs 18.54L', change: '+14.2%', className: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300' },
      { label: 'SKUs In Stock', value: '4,821', change: '+2.8%', className: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' },
      { label: 'Registers', value: '4 active', change: '+8.3%', className: 'border-pink-500/20 bg-pink-500/10 text-pink-600 dark:text-pink-300' }
    ],
    metricLabel: 'Register transactions',
    chartPath: 'M0,30 L20,10 L40,25 L60,12 L80,28 L100,5',
    mobileTitle: 'Retail Express',
    mobileCategory1: 'Fashion',
    mobileCategory2: 'Grocery',
    mobileIcon1: Store,
    mobileIcon2: ShoppingCart
  },
  HOTEL: {
    header: 'Hotel operations live',
    badge: 'Hotel operations',
    kpis: [
      { label: 'Room Revenue', value: 'Rs 41.23L', change: '+18.9%', className: 'border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-300' },
      { label: 'Occupancy', value: '88%', change: '+6.5%', className: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' },
      { label: 'Check-ins', value: '34 today', change: '+12.4%', className: 'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-300' }
    ],
    metricLabel: 'Room bookings',
    chartPath: 'M0,15 Q25,25 50,5 T100,18',
    mobileTitle: 'Imperial Suite',
    mobileCategory1: 'Room Service',
    mobileCategory2: 'Amenities',
    mobileIcon1: Coffee,
    mobileIcon2: Hotel
  },
  SALON: {
    header: 'Salon schedule filled',
    badge: 'Salon console',
    kpis: [
      { label: 'Bookings Value', value: 'Rs 6.42L', change: '+9.4%', className: 'border-pink-500/20 bg-pink-500/10 text-pink-600 dark:text-pink-300' },
      { label: 'Appointments', value: '42 today', change: '+11.2%', className: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300' },
      { label: 'Stylists', value: '6 live', change: '+5.5%', className: 'border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-300' }
    ],
    metricLabel: 'Chair turnovers',
    chartPath: 'M0,28 Q15,8 45,22 T85,14 T100,20',
    mobileTitle: 'Glamour Cut',
    mobileCategory1: 'Hair Styling',
    mobileCategory2: 'Facials',
    mobileIcon1: Scissors,
    mobileIcon2: Sparkles
  },
  HEALTHCARE: {
    header: 'Clinic queue under control',
    badge: 'Healthcare OS',
    kpis: [
      { label: 'Prescriptions', value: '380 filled', change: '+22.5%', className: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' },
      { label: 'Patient Queue', value: '6 waiting', change: '-12.0%', className: 'border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-300' },
      { label: 'Doctors', value: '5 active', change: '+15.3%', className: 'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-300' }
    ],
    metricLabel: 'Consultations',
    chartPath: 'M0,20 Q20,30 40,10 T80,25 T100,5',
    mobileTitle: 'General Clinic',
    mobileCategory1: 'Lab Reports',
    mobileCategory2: 'Vaccines',
    mobileIcon1: HeartPulse,
    mobileIcon2: Check
  },
  WAREHOUSE: {
    header: 'Warehouse dispatch moving',
    badge: 'Warehouse dispatch',
    kpis: [
      { label: 'Pallets Stored', value: '480', change: '+5.6%', className: 'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-300' },
      { label: 'Cargo Inbound', value: '12 loads', change: '+24.5%', className: 'border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-300' },
      { label: 'Dispatched', value: '8 logs', change: '+10.2%', className: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300' }
    ],
    metricLabel: 'Stock movement',
    chartPath: 'M0,10 L30,22 L60,8 L90,26 L100,12',
    mobileTitle: 'Cargo Box 14',
    mobileCategory1: 'Pallets',
    mobileCategory2: 'Logistics',
    mobileIcon1: Package,
    mobileIcon2: Laptop
  },
  MANUFACTURING: {
    header: 'Factory floor optimized',
    badge: 'Factory floor',
    kpis: [
      { label: 'Daily Output', value: '12,450', change: '+8.3%', className: 'border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-300' },
      { label: 'Machine OEE', value: '92.4%', change: '+1.5%', className: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' },
      { label: 'Lines Active', value: '4 / 5', change: '+0.0%', className: 'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-300' }
    ],
    metricLabel: 'Production efficiency',
    chartPath: 'M0,25 Q10,12 35,28 T70,5 T100,15',
    mobileTitle: 'Assembly Line',
    mobileCategory1: 'Engines',
    mobileCategory2: 'Crates',
    mobileIcon1: Settings,
    mobileIcon2: Package
  },
  EDUCATION: {
    header: 'Campus admin synced',
    badge: 'Education admin',
    kpis: [
      { label: 'Enrollments', value: '1,450', change: '+16.5%', className: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300' },
      { label: 'Active Classes', value: '32', change: '+2.5%', className: 'border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-300' },
      { label: 'Attendance', value: '94.2%', change: '+6.1%', className: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' }
    ],
    metricLabel: 'Attendance analytics',
    chartPath: 'M0,20 L30,5 L60,18 L90,10 L100,25',
    mobileTitle: 'Standard X-B',
    mobileCategory1: 'Classes',
    mobileCategory2: 'Exams',
    mobileIcon1: GraduationCap,
    mobileIcon2: User
  },
  CORPORATE: {
    header: 'Corporate suite aligned',
    badge: 'Corporate suite',
    kpis: [
      { label: 'Operating Cost', value: 'Rs 45.8L', change: '-4.8%', className: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' },
      { label: 'Employees', value: '124', change: '+5.6%', className: 'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-300' },
      { label: 'Project Tasks', value: '18 done', change: '+14.2%', className: 'border-pink-500/20 bg-pink-500/10 text-pink-600 dark:text-pink-300' }
    ],
    metricLabel: 'Milestones completed',
    chartPath: 'M0,30 Q20,10 50,22 T100,8',
    mobileTitle: 'HR Portal',
    mobileCategory1: 'Directory',
    mobileCategory2: 'Finance',
    mobileIcon1: Building2,
    mobileIcon2: Key
  },
  SERVICES: {
    header: 'Service delivery sharp',
    badge: 'Services dashboard',
    kpis: [
      { label: 'Billable Hours', value: '1,240', change: '+8.9%', className: 'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-300' },
      { label: 'CSAT Score', value: '4.9 / 5', change: '+0.4%', className: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' },
      { label: 'Consultants', value: '12 live', change: '+18.3%', className: 'border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-300' }
    ],
    metricLabel: 'Resolution times',
    chartPath: 'M0,15 L25,30 L55,5 L85,25 L100,10',
    mobileTitle: 'Consulting Stack',
    mobileCategory1: 'Tickets',
    mobileCategory2: 'Contracts',
    mobileIcon1: Sparkles,
    mobileIcon2: Laptop
  }
};

export default function Hero() {
  const { selectedIndustry } = useLandingState();

  const currentData = industryDashboardData[selectedIndustry] ?? industryDashboardData.RESTAURANT;
  const MobileIcon1 = currentData.mobileIcon1;
  const MobileIcon2 = currentData.mobileIcon2;

  return (
    <section id="hero" className="relative isolate flex min-h-screen w-full items-center overflow-hidden px-4 pb-12 pt-24 sm:pt-32 lg:px-8">
      {/* Background decorations matching the lightning wave in mockup */}
      <div className="hero-video-layer opacity-60 dark:opacity-90" aria-hidden="true" />
      <div className="hero-background-glow" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-8">
        
        {/* Left Column: Heading, tags, CTAs */}
        <div className="scroll-reveal lg:col-span-5 flex flex-col justify-center pt-4">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">
            <Sparkles size={11} className="animate-pulse" />
            All-in-one business operating system
          </div>

          <h1 className="mt-6 w-full text-4xl font-black leading-[1.08] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
            One Platform.
            <span className="block bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 dark:from-blue-400 dark:via-cyan-300 dark:to-violet-400 bg-clip-text text-transparent mt-1">
              Unlimited Businesses.
            </span>
          </h1>

          <p className="mt-5 w-full text-sm sm:text-base font-extrabold leading-7 text-slate-900 dark:text-slate-200">
            Run your Restaurant, Retail Store, Hotel, Salon, Healthcare, Warehouse, Manufacturing and every future business from one intelligent platform.
          </p>

          {/* Feature Bullets with checklist icons */}
          <div className="mt-6 flex flex-wrap gap-4">
            {['One Login', 'One Dashboard', 'Unlimited Possibilities'].map((tag) => (
              <span key={tag} className="inline-flex items-center gap-2 rounded-xl border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 px-3.5 py-2 text-[11px] font-black text-slate-950 dark:text-white backdrop-blur-md shadow-sm">
                <span className="grid h-4.5 w-4.5 place-items-center rounded-full bg-blue-500/10 text-blue-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                  <Check size={10} strokeWidth={3} />
                </span>
                {tag}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
            <Link href="/onboarding" className="landing-primary-button shadow-lg text-center justify-center">
              Start Free Trial
              <ArrowRight size={14} />
            </Link>
            <Link href="#pricing" className="landing-secondary-button border-slate-250 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 text-center justify-center">
              Book Live Demo
            </Link>
          </div>

          {/* User Avatars and metrics with high visibility text */}
          <div className="mt-8 flex items-center gap-3 border-t border-slate-200/60 dark:border-white/5 pt-6">
            <div className="flex -space-x-2">
              {[
                ['A', 'from-blue-600 to-cyan-400'],
                ['S', 'from-violet-600 to-fuchsia-500'],
                ['R', 'from-emerald-500 to-teal-400'],
                ['M', 'from-amber-500 to-orange-500']
              ].map(([letter, gradient]) => (
                <span key={letter} className={`grid h-8 w-8 place-items-center rounded-full border-2 border-white dark:border-slate-950 bg-gradient-to-br ${gradient} text-[10px] font-black text-white`}>
                  {letter}
                </span>
              ))}
            </div>
            <p className="text-[11px] font-extrabold text-slate-900 dark:text-slate-200">
              <span className="text-slate-950 dark:text-white font-black">10,000+ businesses</span> growing with AK Business OS
            </p>
          </div>
        </div>

        {/* Right Column: Angled 3D Console mockup & phone overlay */}
        <div className="scroll-reveal lg:col-span-7 relative w-full flex justify-center lg:justify-end mockup-3d-perspective" data-reveal-delay="1">
          <div className="relative w-full max-w-[580px] lg:max-w-[620px] transition-all">
            
            {/* Main Console Container with 3D Y-Rotation */}
            <div className="glass-premium rounded-[1.5rem] p-2 sm:p-2.5 border border-slate-250/50 dark:border-white/5 shadow-2xl overflow-hidden neon-glow-blue mockup-3d-console">
              
              {/* Console Mock Header Bar */}
              <div className="flex h-9 items-center justify-between rounded-t-xl border-b border-slate-200/50 dark:border-white/5 px-4 bg-slate-100/30 dark:bg-slate-950/20">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-450 dark:bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-450 dark:bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-450 dark:bg-emerald-400" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-500 dark:text-slate-450">AK Business OS</span>
                <div className="w-10" />
              </div>

              {/* Console Body Grid */}
              <div className="grid min-h-[360px] grid-cols-12 gap-3.5 rounded-b-xl bg-white/40 dark:bg-slate-950/40 p-4 text-left sm:p-5">
                
                {/* Left Side Console navigation */}
                <aside className="col-span-3 hidden border-r border-slate-200/50 dark:border-white/5 pr-3 sm:block">
                  <div className="mb-4 flex items-center gap-2 rounded-xl bg-blue-500/10 px-3 py-2 text-[10px] font-black text-blue-600 dark:text-cyan-400">
                    <Laptop size={12} />
                    Console
                  </div>
                  <div className="space-y-3.5 text-[10px] font-black text-slate-800 dark:text-slate-200">
                    {[
                      ['Restaurant', Store],
                      ['Hotel Pack', Hotel],
                      ['Salon OS', Scissors],
                      ['AI Engine', Sparkles]
                    ].map(([label, Icon]) => {
                      const RowIcon = Icon as typeof Store;
                      return (
                        <div key={label as string} className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-cyan-400 cursor-pointer transition">
                          <RowIcon size={12} />
                          <span>{label as string}</span>
                        </div>
                      );
                    })}
                  </div>
                </aside>

                {/* Dashboard Main Content Area */}
                <div className="col-span-12 space-y-4 sm:col-span-9">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200/50 dark:border-white/5 pb-3">
                    <div>
                      <h3 className="text-sm font-black text-slate-950 dark:text-white">Good Morning, Arjun! 👋</h3>
                      <p className="mt-1 text-[10px] font-extrabold text-slate-800 dark:text-slate-300">Here is what is happening across your business today.</p>
                    </div>
                    <span className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[9px] font-black uppercase text-cyan-700 dark:text-cyan-300">
                      {currentData.badge}
                    </span>
                  </div>

                  {/* Dynamic Industry KPI cards */}
                  <div className="grid grid-cols-3 gap-2.5">
                    {currentData.kpis.map((kpi) => (
                      <div key={kpi.label} className={`rounded-xl border p-2.5 transition duration-300 ${kpi.className}`}>
                        <span className="block text-[8px] font-black uppercase opacity-75">{kpi.label}</span>
                        <span className="mt-0.5 block text-xs sm:text-sm font-black text-slate-950 dark:text-white">{kpi.value}</span>
                        <span className="mt-0.5 block text-[8px] font-extrabold">{kpi.change} this month</span>
                      </div>
                    ))}
                  </div>

                  {/* Revenue Overview chart box */}
                  <div className="rounded-2xl border border-slate-200/50 dark:border-white/5 bg-white/70 dark:bg-slate-900/60 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-800 dark:text-slate-200">{currentData.metricLabel}</span>
                      <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-[8px] font-black uppercase text-emerald-650 dark:text-emerald-350">Live</span>
                    </div>
                    <svg className="mt-4 h-24 w-full" viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true">
                      <defs>
                        <linearGradient id="hero-chart-fill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563EB" stopOpacity="0.22" />
                          <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d={`${currentData.chartPath} L100,32 L0,32 Z`} fill="url(#hero-chart-fill)" />
                      <path d={currentData.chartPath} fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

              </div>
            </div>

            {/* Floating Order Notification Card (Matches the mockup order card) */}
            <div className="absolute -bottom-6 left-0 hidden w-[210px] rounded-2xl p-3 shadow-2xl glass-premium border border-slate-250/50 dark:border-white/5 sm:block transition-all hover:scale-105 duration-300 z-20">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-600 text-white shadow-md">
                  <Check size={16} strokeWidth={3} />
                </span>
                <div>
                  <span className="block text-[10px] font-black text-slate-950 dark:text-white">New Order Received</span>
                  <span className="mt-0.5 block text-[9px] font-extrabold text-slate-850 dark:text-slate-300">Order #1257 - 2 mins ago</span>
                  <span className="mt-1 block text-[11px] font-black text-blue-600 dark:text-cyan-300">Rs 1,250</span>
                </div>
              </div>
            </div>

            {/* Floating Phone Mockup displaying client app in 3D projection */}
            <div className="absolute -bottom-8 right-2 hidden w-[184px] rounded-[2.2rem] border border-slate-200/50 dark:border-slate-850 bg-slate-100 dark:bg-slate-950 p-1.5 shadow-2xl sm:block transition-all duration-300 mockup-3d-phone z-20">
              <div className="relative min-h-[265px] overflow-hidden rounded-[1.85rem] bg-slate-900 dark:bg-slate-950 px-3.5 pb-4 pt-7 text-left border border-slate-250 dark:border-white/5">
                <div className="absolute left-1/2 top-2.5 h-3 w-12 -translate-x-1/2 rounded-full bg-slate-900 dark:bg-black" />
                <div className="flex items-center justify-between text-[7px] font-black text-white/80">
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={8} className="text-rose-400" />
                    Bengaluru
                  </span>
                  <Bell size={9} className="text-slate-400" />
                </div>
                <div className="mt-3 flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/5 px-2 py-1.2 text-[7px] font-semibold text-slate-400">
                  <Search size={8} />
                  Search services
                </div>
                <div className="mt-3 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 p-2 text-white shadow-md">
                  <span className="block text-[7px] font-black uppercase opacity-80">{currentData.mobileTitle}</span>
                  <span className="mt-1 block text-[10px] font-black">50% OFF TODAY</span>
                  <span className="mt-0.5 block text-[6px] font-semibold opacity-85">Live customer app offer</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[
                    [currentData.mobileCategory1, MobileIcon1, 'text-blue-300 bg-blue-500/10'],
                    [currentData.mobileCategory2, MobileIcon2, 'text-rose-300 bg-rose-500/10']
                  ].map(([label, Icon, className]) => {
                    const CardIcon = Icon as typeof Coffee;
                    return (
                      <div key={label as string} className="rounded-xl border border-white/5 bg-white/5 p-2 text-center">
                        <span className={`mx-auto grid h-7 w-7 place-items-center rounded-full ${className as string}`}>
                          <CardIcon size={12} />
                        </span>
                        <span className="mt-1.5 block truncate text-[7px] font-black text-white">{label as string}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>



      </div>
    </section>
  );
}

