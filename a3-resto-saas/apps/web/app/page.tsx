'use client';

import Link from 'next/link';
import { 
  Shield, 
  Store, 
  QrCode, 
  TrendingUp, 
  Activity, 
  ArrowRight, 
  Server, 
  Database,
  Users,
  UtensilsCrossed,
  Sparkles
} from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex flex-col justify-between">
      {/* Decorative background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-rose-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-[120px] pointer-events-none" />

      {/* HEADER */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <UtensilsCrossed className="text-white" size={20} />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-rose-500 to-orange-400 bg-clip-text text-transparent">
              RESTOBILL
            </span>
            <span className="text-[10px] block font-bold text-zinc-500 tracking-widest uppercase">
              RESTAURANT OS
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            v2.1 Stable
          </span>
          <Link
            href="/login"
            className="text-xs font-extrabold hover:text-white text-zinc-400 bg-slate-900/80 hover:bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 transition"
          >
            Staff Login
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto w-full px-6 py-12 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/60 border border-slate-800/80 text-xs text-zinc-400 shadow-inner">
            <Sparkles size={14} className="text-orange-400" />
            <span>Premium Restaurant SaaS Monorepo</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            The Ultimate Operating System for <span className="bg-gradient-to-r from-rose-500 via-orange-400 to-amber-300 bg-clip-text text-transparent">Modern Gastronomy</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto font-medium leading-relaxed">
            Welcome to RestoBill. Our unified workspace separates master platform operations from local restaurant management and customer table ordering.
          </p>
        </div>

        {/* PORTALS GRID */}
        <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto w-full">
          
          {/* PORTAL 1: SUPER ADMIN */}
          <div className="group rounded-3xl bg-slate-900/40 border border-slate-850 p-8 flex flex-col justify-between hover:bg-slate-900/60 hover:border-rose-500/30 hover:shadow-2xl hover:shadow-rose-500/5 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-colors pointer-events-none" />
            
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Shield size={24} />
              </div>
              
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">
                  Interface 1: SaaS Control
                </span>
                <h2 className="text-2xl font-black tracking-tight text-white group-hover:text-rose-400 transition-colors">
                  Super Admin Hub
                </h2>
                <p className="text-zinc-400 text-xs leading-relaxed font-medium">
                  Designed for platform owners. Control restaurant tenant accounts, configure pricing tiers, manage features permissions, and track platform-wide MRR telemetry.
                </p>
              </div>

              <ul className="space-y-2.5 text-[11px] text-zinc-500 font-semibold border-t border-slate-900/80 pt-4 group-hover:border-slate-800 transition-colors">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Multi-Tenant Status Manager
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> SaaS Subscription Pricing
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Telemetry & Server Logs
                </li>
              </ul>
            </div>

            <Link
              href="/super-admin"
              className="mt-8 w-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition active:scale-[0.98] shadow-lg shadow-rose-500/10"
            >
              Launch Platform Hub
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* PORTAL 2: RESTAURANT OPERATIONS */}
          <div className="group rounded-3xl bg-slate-900/40 border border-slate-850 p-8 flex flex-col justify-between hover:bg-slate-900/60 hover:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-colors pointer-events-none" />
            
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <Store size={24} />
              </div>
              
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">
                  Interface 2: Restaurant ERP
                </span>
                <h2 className="text-2xl font-black tracking-tight text-white group-hover:text-orange-400 transition-colors">
                  Operations Center
                </h2>
                <p className="text-zinc-400 text-xs leading-relaxed font-medium">
                  Designed for restaurant staff. Realtime POS billing counter, menu theme design customizer, preparation timers on Kitchen Display (KDS), waiter requests logs, and payroll registers.
                </p>
              </div>

              <ul className="space-y-2.5 text-[11px] text-zinc-500 font-semibold border-t border-slate-900/80 pt-4 group-hover:border-slate-800 transition-colors">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> POS Counter & Order Editor
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Live Kitchen KDS & Waiter Call Desk
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Stock Approvals & Attendance Wages
                </li>
              </ul>
            </div>

            <Link
              href="/dashboard"
              className="mt-8 w-full bg-white hover:bg-zinc-100 text-black font-bold text-xs py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition active:scale-[0.98] shadow-lg shadow-white/5"
            >
              Open Operations ERP
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* PORTAL 3: CUSTOMER EXPERIENCE */}
          <div className="group rounded-3xl bg-slate-900/40 border border-slate-850 p-8 flex flex-col justify-between hover:bg-slate-900/60 hover:border-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors pointer-events-none" />
            
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <QrCode size={24} />
              </div>
              
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                  Guest Flow Simulator
                </span>
                <h2 className="text-2xl font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  Customer QR Menu
                </h2>
                <p className="text-zinc-400 text-xs leading-relaxed font-medium">
                  Designed for diners. Simulates table QR scans. Customers can browse customized menus, apply coupon codes, request waiter service, track prep status, and leave ratings.
                </p>
              </div>

              <ul className="space-y-2.5 text-[11px] text-zinc-500 font-semibold border-t border-slate-900/80 pt-4 group-hover:border-slate-800 transition-colors">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Dine-In, Pre-Order, & Delivery Toggles
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Table Clean & Water Waiter Buttons
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Post-Checkout Loyalty & Reviews
                </li>
              </ul>
            </div>

            <Link
              href="/qr-order?restaurant=spicy-hub&table=table-2"
              className="mt-8 w-full bg-slate-900 border border-slate-800 hover:bg-slate-855 hover:border-slate-700 text-zinc-200 font-bold text-xs py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition active:scale-[0.98]"
            >
              Simulate Table QR
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </section>

      {/* FOOTER METRICS */}
      <footer className="bg-slate-950 border-t border-slate-900/50 py-8 px-6 text-zinc-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center justify-center gap-8 font-semibold">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-zinc-600" />
              <span>Active Restaurants: <strong className="text-zinc-400">247</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-zinc-600" />
              <span>Daily Active Orders: <strong className="text-zinc-400">12,840</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Server size={16} className="text-zinc-600" />
              <span>Gateway Ping: <strong className="text-zinc-400">18ms</strong></span>
            </div>
          </div>
          <div className="text-zinc-600 font-medium">
            © {new Date().getFullYear()} RestoBill Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
