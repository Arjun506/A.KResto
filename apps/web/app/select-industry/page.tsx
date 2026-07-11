'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthBackground from '@/components/auth/AuthBackground';
import Link from 'next/link';
import {
  Store,
  Briefcase,
  Layers,
  Shield,
  Sparkles,
  Calendar,
  Terminal,
  Globe,
  Loader2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Zap
} from 'lucide-react';

const mockIndustries = [
  { id: 'RESTAURANT', label: 'Restaurant', desc: 'Activates dine-in tables, reservation managers, KOTs, menus, and POS logs.', icon: Store, color: 'from-orange-500 to-amber-500', glowColor: 'rgba(249, 115, 22, 0.15)', iconColor: 'text-orange-500 bg-orange-500/10 dark:bg-orange-500/15' },
  { id: 'RETAIL', label: 'Retail', desc: 'Activates barcode inventory lists, price tags, and supplier orders.', icon: Briefcase, color: 'from-emerald-500 to-teal-500', glowColor: 'rgba(16, 185, 129, 0.15)', iconColor: 'text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/15' },
  { id: 'HOTEL', label: 'Hotel', desc: 'Activates room bookings, reservations, check-in, and guest metrics.', icon: Layers, color: 'from-indigo-500 to-blue-500', glowColor: 'rgba(99, 102, 241, 0.15)', iconColor: 'text-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/15' },
  { id: 'SALON', label: 'Salon', desc: 'Activates stylist shifts, customer booking calendars, and CRM.', icon: Sparkles, color: 'from-violet-500 to-purple-500', glowColor: 'rgba(139, 92, 246, 0.15)', iconColor: 'text-violet-500 bg-violet-500/10 dark:bg-violet-500/15' },
  { id: 'HEALTHCARE', label: 'Healthcare', desc: 'Activates operational registers, patient scheduling, and charts.', icon: Shield, color: 'from-rose-500 to-pink-500', glowColor: 'rgba(244, 63, 94, 0.15)', iconColor: 'text-rose-500 bg-rose-500/10 dark:bg-rose-500/15' },
  { id: 'WAREHOUSE', label: 'Warehouse', desc: 'Activates stock dispatches, physical barcodes, and stocks logs.', icon: Calendar, color: 'from-cyan-500 to-blue-500', glowColor: 'rgba(6, 182, 212, 0.15)', iconColor: 'text-cyan-500 bg-cyan-500/10 dark:bg-cyan-500/15' },
  { id: 'MANUFACTURING', label: 'Manufacturing', desc: 'Activates production lines, procurements, and inventory links.', icon: Terminal, color: 'from-amber-500 to-orange-500', glowColor: 'rgba(245, 158, 11, 0.15)', iconColor: 'text-amber-500 bg-amber-500/10 dark:bg-amber-500/15' },
  { id: 'CORPORATE', label: 'Corporate', desc: 'Activates central office analytics, logs, and customer CRM.', icon: Globe, color: 'from-blue-500 to-cyan-500', glowColor: 'rgba(59, 130, 246, 0.15)', iconColor: 'text-blue-500 bg-blue-500/10 dark:bg-blue-500/15' }
];

export default function SelectIndustryPage() {
  const router = useRouter();

  const [selectedId, setSelectedId] = useState('RESTAURANT');
  const [activating, setActivating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleActivatePack = () => {
    const selectedObj = mockIndustries.find(m => m.id === selectedId);
    if (!selectedObj) return;

    setActivating(true);
    // Simulate vertical activation seedings
    setTimeout(() => {
      setActivating(false);
      triggerToast(`Activated industry: ${selectedObj.label}`);
      setTimeout(() => {
        router.push('/dashboard');
      }, 800);
    }, 1200);
  };

  const activeIndustryInfo = mockIndustries.find(m => m.id === selectedId) || mockIndustries[0];

  return (
    <main className="min-h-screen relative w-full overflow-hidden flex items-center justify-center p-6 sm:p-12">
      {/* 3D Aurora Mesh Backdrop */}
      <AuthBackground />

      {/* Glass Card Container */}
      <div className="relative z-10 w-full max-w-[800px] glass-premium rounded-3xl p-8 sm:p-10 border border-slate-200/50 dark:border-white/5 shadow-2xl text-left backdrop-blur-xl flex flex-col justify-between min-h-[580px]">
        
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/30 dark:border-white/5 pb-5 mb-6 gap-3">
          <div>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white leading-tight">Activate Business Module</h2>
            <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
              Customize POS billing templates and data structures by selecting your primary industry vertical.
            </p>
          </div>
          <Link href="/workspaces" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-white/5 bg-white/20 text-xs font-bold text-slate-650 hover:bg-slate-100/50 dark:bg-slate-900/10 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition shrink-0 w-fit">
            <ArrowLeft size={12} />
            Workspaces
          </Link>
        </div>

        {/* 8 Columns Industry Grid */}
        <div className="grid gap-3.5 sm:grid-cols-2 md:grid-cols-4 flex-1 mb-8">
          {mockIndustries.map((ind) => {
            const IndIcon = ind.icon;
            const isSelected = selectedId === ind.id;
            return (
              <button
                key={ind.id}
                type="button"
                onClick={() => setSelectedId(ind.id)}
                className={`group p-4.5 rounded-2xl border text-left flex flex-col justify-between h-[150px] transition-all duration-300 relative overflow-hidden ${
                  isSelected
                    ? 'bg-blue-600/10 border-blue-500/40 dark:bg-cyan-500/15 dark:border-cyan-500/40 shadow-lg'
                    : 'border-slate-200/50 bg-white/30 hover:bg-slate-100/50 hover:border-slate-350 dark:border-white/5 dark:bg-slate-900/20 dark:hover:bg-slate-900/40 dark:hover:border-white/10 hover:-translate-y-1'
                }`}
                style={{
                  boxShadow: isSelected ? `0 10px 25px -5px ${ind.glowColor}` : undefined
                }}
              >
                {/* Active Indicator Icon */}
                {isSelected && (
                  <span className="absolute top-3.5 right-3.5 text-blue-600 dark:text-cyan-400">
                    <CheckCircle size={14} className="fill-current text-white dark:text-slate-900" />
                  </span>
                )}

                <span className={`grid h-8 w-8 place-items-center rounded-xl ${ind.iconColor} shadow-sm group-hover:scale-105 transition duration-300`}>
                  <IndIcon size={14} />
                </span>

                <div className="mt-4">
                  <span className="block text-xs font-black text-slate-950 dark:text-white">{ind.label}</span>
                  <span className="mt-1 block text-[9px] font-bold leading-3.5 text-slate-500 dark:text-slate-400 line-clamp-3">
                    {ind.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Activation Banner */}
        <div className="border-t border-slate-200/30 dark:border-white/5 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600/10 text-blue-600 dark:bg-cyan-500/15 dark:text-cyan-400">
              <Zap size={16} />
            </span>
            <div>
              <span className="block text-xs font-black text-slate-950 dark:text-white">
                Selected: {activeIndustryInfo.label} Pack
              </span>
              <span className="block text-[9px] font-bold text-slate-500 dark:text-slate-400">
                Loads specialized business schemas and custom widgets.
              </span>
            </div>
          </div>

          <button
            onClick={handleActivatePack}
            disabled={activating}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-650 text-white text-xs font-black uppercase tracking-[0.14em] shadow-lg shadow-blue-500/20 hover:opacity-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {activating ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Activating...
              </>
            ) : (
              <>
                Activate Industry Pack
                <ArrowRight size={13} />
              </>
            )}
          </button>
        </div>

      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-xs font-black text-white shadow-2xl border border-white/10 slide-up">
          <CheckCircle size={13} className="text-emerald-400" />
          {toastMessage}
        </div>
      )}
    </main>
  );
}
