'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import Link from 'next/link';
import { Store, Briefcase, Sparkles, Plus, Loader2, LogOut, CheckCircle } from 'lucide-react';

const mockWorkspaces = [
  { id: 'ws-1', name: 'A.K Resto Indiranagar', location: 'Bengaluru, KA', industry: 'Restaurant', lastVisited: '10 mins ago', active: true, icon: Store, color: 'from-orange-500 to-amber-500' },
  { id: 'ws-2', name: 'AK Retail Koramangala', location: 'Bengaluru, KA', industry: 'Retail', lastVisited: '2 hours ago', active: true, icon: Briefcase, color: 'from-emerald-500 to-teal-500' },
  { id: 'ws-3', name: 'AK Salon & Spa HSR', location: 'Bengaluru, KA', industry: 'Salon', lastVisited: '1 day ago', active: true, icon: Sparkles, color: 'from-violet-500 to-purple-500' }
];

export default function WorkspacesPage() {
  const router = useRouter();

  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSelectWorkspace = (id: string, name: string) => {
    setConnectingId(id);
    // Simulate pipeline loading to dashboard console
    setTimeout(() => {
      setConnectingId(null);
      setToastMessage(`Connected to workspace: ${name}`);
      setTimeout(() => {
        router.push('/dashboard');
      }, 800);
    }, 1200);
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-slate-200/35 dark:border-white/5 pb-4 mb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white leading-tight">Select Workspace</h2>
            <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
              Select a tenant workspace environment to launch your console.
            </p>
          </div>
          <Link href="/login" className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200/50 dark:border-white/5 bg-white/20 text-slate-650 hover:bg-slate-100/50 dark:bg-slate-900/10 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition" aria-label="Sign out">
            <LogOut size={14} />
          </Link>
        </div>

        {/* Workspaces List Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {mockWorkspaces.map((ws) => {
            const WsIcon = ws.icon;
            const isConnecting = connectingId === ws.id;
            return (
              <button
                key={ws.id}
                type="button"
                onClick={() => handleSelectWorkspace(ws.id, ws.name)}
                disabled={connectingId !== null}
                className={`group p-4 rounded-2xl border text-left flex flex-col justify-between h-[135px] transition-all duration-300 relative overflow-hidden ${
                  isConnecting
                    ? 'bg-blue-600/10 border-blue-500/40 dark:bg-cyan-500/15 dark:border-cyan-500/40 shadow-lg'
                    : 'border-slate-200/50 bg-white/30 hover:bg-slate-100/50 hover:border-slate-300 dark:border-white/5 dark:bg-slate-900/20 dark:hover:bg-slate-900/40 dark:hover:border-white/10 hover:-translate-y-1'
                }`}
              >
                {/* Floating Glow Indicator */}
                <div className={`absolute inset-0 bg-gradient-to-br ${ws.color} opacity-0 group-hover:opacity-[0.04] transition duration-300`} />

                <div className="flex items-start justify-between w-full relative z-10">
                  <span className={`grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br ${ws.color} text-white shadow-md`}>
                    <WsIcon size={14} />
                  </span>
                  {ws.lastVisited && (
                    <span className="text-[8px] font-black uppercase tracking-wider bg-slate-200/60 dark:bg-white/10 px-2 py-0.5 rounded text-slate-650 dark:text-slate-350">
                      {ws.lastVisited}
                    </span>
                  )}
                </div>

                <div className="relative z-10 w-full mt-4">
                  <span className="block text-xs font-black text-slate-950 dark:text-white truncate">{ws.name}</span>
                  <span className="mt-0.5 block text-[9px] font-bold text-slate-500 dark:text-slate-400">{ws.location} · {ws.industry}</span>
                </div>

                {/* Spinner Overlay */}
                {isConnecting && (
                  <div className="absolute inset-0 bg-white/40 dark:bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin text-blue-600 dark:text-cyan-400" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-cyan-400">Launching Console</span>
                  </div>
                )}
              </button>
            );
          })}

          {/* Create Workspace Button Card */}
          <Link
            href="/onboarding"
            className="group p-4 rounded-2xl border border-dashed border-slate-300 hover:border-blue-500 bg-white/15 dark:border-white/10 dark:hover:border-cyan-500 hover:bg-white/30 dark:hover:bg-slate-900/10 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 flex flex-col justify-center items-center h-[135px] text-center transition-all duration-300 hover:-translate-y-1 shadow-sm"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-200/50 group-hover:bg-blue-500/10 dark:bg-white/5 dark:group-hover:bg-cyan-500/10 mb-3 transition">
              <Plus size={16} />
            </span>
            <span className="block text-xs font-black uppercase tracking-wider">Create Workspace</span>
            <span className="mt-0.5 block text-[8px] font-bold text-slate-450 dark:text-slate-500">Deploy another database sandbox</span>
          </Link>
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

