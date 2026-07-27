'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
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
    <AuthLayout>
      <div className="space-y-6">
        {/* Header bar */}
        <div className="flex flex-col border-b border-slate-200/30 dark:border-white/5 pb-4 mb-4 gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-955 dark:text-white leading-tight">Industry Pack</h2>
            <Link href="/workspaces" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200/50 dark:border-white/5 bg-white/20 text-[10px] font-bold text-slate-650 hover:bg-slate-100/50 dark:bg-slate-900/10 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white transition">
              <ArrowLeft size={10} />
              Workspaces
            </Link>
          </div>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Customize POS layouts by selecting your primary industry vertical.
          </p>
        </div>

        {/* 8 Columns Industry Grid */}
        <div className="grid gap-2.5 grid-cols-2 max-h-[300px] overflow-y-auto pr-1">
          {mockIndustries.map((ind) => {
            const IndIcon = ind.icon;
            const isSelected = selectedId === ind.id;
            return (
              <button
                key={ind.id}
                type="button"
                onClick={() => setSelectedId(ind.id)}
                className={`group p-3 rounded-xl border text-left flex flex-col justify-between h-[120px] transition-all duration-300 relative overflow-hidden ${
                  isSelected
                    ? 'bg-blue-600/10 border-blue-500/40 dark:bg-cyan-500/15 dark:border-cyan-500/40 shadow-md'
                    : 'border-slate-200/50 bg-white/30 hover:bg-slate-100/50 hover:border-slate-300 dark:border-white/5 dark:bg-slate-900/20 dark:hover:bg-slate-900/40 dark:hover:border-white/10'
                }`}
              >
                {/* Active Indicator Icon */}
                {isSelected && (
                  <span className="absolute top-2.5 right-2.5 text-blue-600 dark:text-cyan-400">
                    <CheckCircle size={12} className="fill-current text-white dark:text-slate-900" />
                  </span>
                )}

                <span className={`grid h-7 w-7 place-items-center rounded-lg ${ind.iconColor} shadow-sm group-hover:scale-105 transition`}>
                  <IndIcon size={12} />
                </span>

                <div className="mt-2">
                  <span className="block text-[11px] font-black text-slate-950 dark:text-white">{ind.label}</span>
                  <span className="mt-0.5 block text-[8px] font-bold leading-3 text-slate-500 dark:text-slate-450 line-clamp-2">
                    {ind.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Activation Banner */}
        <div className="border-t border-slate-200/35 dark:border-white/5 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600/10 text-blue-600 dark:bg-cyan-500/15 dark:text-cyan-400">
              <Zap size={14} />
            </span>
            <div>
              <span className="block text-[11px] font-black text-slate-950 dark:text-white">
                Selected: {activeIndustryInfo.label} Pack
              </span>
              <span className="block text-[8px] font-bold text-slate-500 dark:text-slate-450">
                Loads specialized business schemas.
              </span>
            </div>
          </div>

          <button
            onClick={handleActivatePack}
            disabled={activating}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-650 text-white text-xs font-black uppercase tracking-[0.12em] shadow-lg shadow-blue-500/20 hover:opacity-95 transition disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {activating ? (
              <>
                <Loader2 size={11} className="animate-spin" />
                Activating...
              </>
            ) : (
              <>
                Activate Pack
                <ArrowRight size={11} />
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
    </AuthLayout>
  );
}

