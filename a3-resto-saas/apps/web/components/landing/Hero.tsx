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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const { selectedIndustry } = useLandingState();

  const currentData = industryDashboardData[selectedIndustry] ?? industryDashboardData.RESTAURANT;
  const MobileIcon1 = currentData.mobileIcon1;
  const MobileIcon2 = currentData.mobileIcon2;

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animationFrameId = 0;
    let width = 0;
    let height = 0;
    let phase = 0;

    const setSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    setSize();
    window.addEventListener('resize', setSize);

    const nodes = Array.from({ length: 34 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.8 + 1
    }));

    let bolts: Array<{ path: Array<{ x: number; y: number }>; opacity: number; width: number }> = [];

    const createLightning = () => {
      const startX = Math.random() * width;
      const path = [{ x: startX, y: -10 }];
      let curX = startX;
      const steps = 10 + Math.floor(Math.random() * 8);

      for (let index = 0; index < steps; index += 1) {
        curX += (Math.random() - 0.5) * 60;
        path.push({ x: curX, y: (height / steps) * index });
      }

      bolts.push({ path, opacity: 0.62, width: 1 + Math.random() * 1.4 });
    };

    const render = () => {
      const dark = document.documentElement.classList.contains('dark');
      ctx.clearRect(0, 0, width, height);

      ctx.lineWidth = 1;
      const rows = 14;
      const cols = 20;
      const gridStartY = height * 0.48;
      const gridHeight = height * 0.55;
      ctx.strokeStyle = dark ? 'rgba(96, 165, 250, 0.08)' : 'rgba(37, 99, 235, 0.09)';

      for (let row = 0; row <= rows; row += 1) {
        const progress = row / rows;
        const y = gridStartY + progress * gridHeight;
        ctx.beginPath();
        for (let col = 0; col <= cols; col += 1) {
          const x = (col / cols) * width;
          const wave = Math.sin(progress * 4 + (x / width) * 4 + phase) * 10 * progress;
          if (col === 0) ctx.moveTo(x, y + wave);
          else ctx.lineTo(x, y + wave);
        }
        ctx.stroke();
      }

      nodes.forEach((node, index) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        const dxMouse = mouseRef.current.x - node.x;
        const dyMouse = mouseRef.current.y - node.y;
        const mouseDistance = Math.hypot(dxMouse, dyMouse);
        if (mouseDistance < 170) {
          node.x += dxMouse * 0.0018;
          node.y += dyMouse * 0.0018;
        }

        ctx.fillStyle = dark ? 'rgba(6, 182, 212, 0.28)' : 'rgba(37, 99, 235, 0.24)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let otherIndex = index + 1; otherIndex < nodes.length; otherIndex += 1) {
          const other = nodes[otherIndex];
          const distance = Math.hypot(other.x - node.x, other.y - node.y);

          if (distance < 125) {
            const alpha = (1 - distance / 125) * (dark ? 0.11 : 0.09);
            ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      });

      if (dark && Math.random() < 0.006) createLightning();

      ctx.shadowBlur = 12;
      bolts.forEach((bolt) => {
        ctx.strokeStyle = `rgba(6, 182, 212, ${bolt.opacity})`;
        ctx.shadowColor = 'rgba(6, 182, 212, 0.45)';
        ctx.lineWidth = bolt.width;
        ctx.beginPath();
        bolt.path.forEach((point, index) => {
          if (index === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
        bolt.opacity -= 0.035;
      });
      ctx.shadowBlur = 0;
      bolts = bolts.filter((bolt) => bolt.opacity > 0);

      phase += 0.008;
      if (!reduceMotion) animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setSize);
    };
  }, []);

  return (
    <section id="hero" className="relative isolate flex min-h-screen w-full items-center overflow-hidden px-0 pb-12 pt-20 sm:pt-28 lg:px-0">
      <div className="hero-video-layer" aria-hidden="true" />
      <div className="hero-background-glow" aria-hidden="true" />
      <canvas ref={canvasRef} className="absolute inset-0 z-0 h-full w-full" aria-hidden="true" />

      <div className="relative z-10 w-full grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-0">
        <div className="scroll-reveal lg:col-span-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">
            <Sparkles size={12} />
            All-in-one business operating system
          </div>

          <h1 className="mt-6 w-full text-4xl font-black leading-[1.03] tracking-tight text-[color:var(--landing-text)] sm:text-6xl lg:text-7xl">
            One Platform.
            <span className="block bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-600 bg-clip-text text-transparent">
              Unlimited Businesses.
            </span>
          </h1>
          <div className="mt-5 overflow-hidden text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500 sm:text-2xl typewriter-text">
            Power every restaurant, retail store, hotel, salon, healthcare and warehouse with one cinematic command center.
          </div>

          <p className="mt-6 w-full text-sm font-semibold leading-7 landing-muted sm:text-base">
            Run your restaurant, retail store, hotel, salon, healthcare, warehouse, manufacturing, and future ventures from one intelligent command center.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {['One login', 'One dashboard', 'Unlimited modules'].map((tag) => (
              <span key={tag} className="landing-card inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-[11px] font-extrabold text-[color:var(--landing-text)]">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/onboarding" className="landing-primary-button">
              Start Free Trial
              <ArrowRight size={15} />
            </Link>
            <Link href="#pricing" className="landing-secondary-button">
              Book Live Demo
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-3 border-t border-[color:var(--landing-border)] pt-6">
            <div className="flex -space-x-2">
              {[
                ['A', 'from-blue-600 to-cyan-400'],
                ['S', 'from-violet-600 to-fuchsia-500'],
                ['R', 'from-emerald-500 to-teal-400'],
                ['M', 'from-amber-500 to-orange-500']
              ].map(([letter, gradient]) => (
                <span key={letter} className={`grid h-8 w-8 place-items-center rounded-full border-2 border-[color:var(--landing-bg)] bg-gradient-to-br ${gradient} text-[10px] font-black text-white`}>
                  {letter}
                </span>
              ))}
            </div>
            <p className="text-[11px] font-bold landing-muted">
              <span className="text-[color:var(--landing-text)]">10,000+ businesses</span> growing with AK Business OS
            </p>
          </div>
        </div>

        <div className="scroll-reveal relative lg:col-span-6" data-reveal-delay="1">
          <div className="relative w-full">
            <div className="landing-card-strong overflow-hidden rounded-[1.35rem] p-2">
              <div className="flex h-9 items-center justify-between rounded-t-2xl border-b border-[color:var(--landing-border)] px-4">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.22em] landing-soft-text">AK Business OS</span>
                <div className="w-10" />
              </div>

              <div className="grid min-h-[360px] grid-cols-12 gap-4 rounded-b-2xl bg-white/60 p-4 text-left dark:bg-slate-950/50 sm:p-5">
                <aside className="col-span-3 hidden border-r border-[color:var(--landing-border)] pr-3 sm:block">
                  <div className="mb-5 flex items-center gap-2 rounded-xl bg-blue-600/10 px-3 py-2 text-[10px] font-black text-blue-600 dark:text-blue-300">
                    <Laptop size={13} />
                    Console
                  </div>
                  <div className="space-y-3 text-[10px] font-bold landing-soft-text">
                    {[
                      ['Restaurant', Store],
                      ['Hotel Pack', Hotel],
                      ['Salon OS', Scissors],
                      ['AI Engine', Sparkles]
                    ].map(([label, Icon]) => {
                      const RowIcon = Icon as IconType;
                      return (
                        <div key={label as string} className="flex items-center gap-2">
                          <RowIcon size={12} />
                          <span>{label as string}</span>
                        </div>
                      );
                    })}
                  </div>
                </aside>

                <div className="col-span-12 space-y-4 sm:col-span-9">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[color:var(--landing-border)] pb-3">
                    <div>
                      <h3 className="text-sm font-black text-[color:var(--landing-text)]">{currentData.header}</h3>
                      <p className="mt-1 text-[10px] font-semibold landing-soft-text">Here is what is happening across your business today.</p>
                    </div>
                    <span className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[9px] font-black uppercase text-cyan-600 dark:text-cyan-300">
                      {currentData.badge}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    {currentData.kpis.map((kpi) => (
                      <div key={kpi.label} className={`rounded-xl border p-3 ${kpi.className}`}>
                        <span className="block text-[8px] font-black uppercase opacity-75">{kpi.label}</span>
                        <span className="mt-1 block text-xs font-black text-[color:var(--landing-text)]">{kpi.value}</span>
                        <span className="mt-1 block text-[8px] font-extrabold">{kpi.change} this month</span>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-[color:var(--landing-border)] bg-white/70 p-4 dark:bg-slate-900/60">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-[0.12em] landing-muted">{currentData.metricLabel}</span>
                      <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-[8px] font-black uppercase text-emerald-600 dark:text-emerald-300">Live</span>
                    </div>
                    <svg className="mt-4 h-24 w-full" viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true">
                      <defs>
                        <linearGradient id="hero-chart-fill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563EB" stopOpacity="0.28" />
                          <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d={`${currentData.chartPath} L100,32 L0,32 Z`} fill="url(#hero-chart-fill)" />
                      <path d={currentData.chartPath} fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    {['Orders synced', 'Stock protected', 'Profit visible'].map((item) => (
                      <div key={item} className="rounded-xl border border-[color:var(--landing-border)] bg-white/60 p-3 text-[10px] font-extrabold landing-muted dark:bg-slate-900/50">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 left-0 hidden w-[210px] rounded-2xl p-3 shadow-2xl landing-card-strong sm:block">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-600 text-white">
                  <Check size={16} strokeWidth={3} />
                </span>
                <div>
                  <span className="block text-[10px] font-black text-[color:var(--landing-text)]">New Order Received</span>
                  <span className="mt-0.5 block text-[9px] font-bold landing-soft-text">Order #1257 - 2 mins ago</span>
                  <span className="mt-1 block text-[11px] font-black text-cyan-600 dark:text-cyan-300">Rs 1,350</span>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-8 right-1 hidden w-[176px] rounded-[2rem] border border-[color:var(--landing-border)] bg-slate-950 p-1.5 shadow-2xl sm:block">
              <div className="relative min-h-[260px] overflow-hidden rounded-[1.55rem] bg-slate-950 px-3 pb-4 pt-7 text-left">
                <div className="absolute left-1/2 top-2 h-3 w-12 -translate-x-1/2 rounded-full bg-black" />
                <div className="flex items-center justify-between text-[7px] font-black text-white">
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={8} className="text-rose-400" />
                    Bengaluru
                  </span>
                  <Bell size={9} className="text-slate-400" />
                </div>
                <div className="mt-3 flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/5 px-2 py-1 text-[7px] font-semibold text-slate-400">
                  <Search size={8} />
                  Search services
                </div>
                <div className="mt-3 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 p-2 text-white">
                  <span className="block text-[7px] font-black uppercase opacity-80">{currentData.mobileTitle}</span>
                  <span className="mt-1 block text-[10px] font-black">50% OFF TODAY</span>
                  <span className="mt-1 block text-[6px] font-semibold opacity-85">Live customer app offer</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[
                    [currentData.mobileCategory1, MobileIcon1, 'text-blue-300 bg-blue-500/10'],
                    [currentData.mobileCategory2, MobileIcon2, 'text-rose-300 bg-rose-500/10']
                  ].map(([label, Icon, className]) => {
                    const CardIcon = Icon as IconType;
                    return (
                      <div key={label as string} className="rounded-xl border border-white/5 bg-white/5 p-2 text-center">
                        <span className={`mx-auto grid h-7 w-7 place-items-center rounded-full ${className as string}`}>
                          <CardIcon size={12} />
                        </span>
                        <span className="mt-1 block truncate text-[7px] font-black text-white">{label as string}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-reveal col-span-1 border-t border-[color:var(--landing-border)] pt-7 lg:col-span-12" data-reveal-delay="2">
          <div className="flex flex-col items-center justify-between gap-5 text-center lg:flex-row lg:text-left">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] landing-soft-text">Trusted by ambitious teams worldwide</span>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-black landing-muted">
              {["Domino's", 'zomato', 'SWIGGY', 'Coca-Cola', 'SAMSUNG', 'TATA', 'DMart'].map((brand) => (
                <span key={brand} className="transition hover:text-[color:var(--landing-text)]">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
