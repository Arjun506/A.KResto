'use client';

import Link from 'next/link';
import { 
  Check, 
  MessageSquare, 
  Send, 
  Bot, 
  Gift, 
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

const checklist = [
  'Premium Themes',
  'Powerful Plugins',
  'Custom Apps',
  'Widgets & Extensions',
  'Everything You Need'
];

const apps = [
  { name: 'WhatsApp Connect', desc: 'Auto WhatsApp alerts.', icon: MessageSquare, rating: '★★★★★', color: 'text-emerald-500 bg-emerald-500/10' },
  { name: 'SMS Gateway', desc: 'Twilio SMS notifications.', icon: Send, rating: '★★★★★', color: 'text-blue-500 bg-blue-500/10' },
  { name: 'AI Assistant', desc: 'Predictive stock forecasts.', icon: Bot, rating: '★★★★★', color: 'text-violet-500 bg-violet-500/10' },
  { name: 'Loyalty Program', desc: 'Points and levels rewards.', icon: Gift, rating: '★★★★★', color: 'text-rose-500 bg-rose-500/10' }
];

export default function Marketplace() {
  return (
    <section className="bg-slate-950/20 border-y border-slate-900/50 py-20">
      <div className="max-w-6xl mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
        
        {/* Left info column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase text-indigo-400 bg-indigo-950/20 border border-indigo-900/50 px-2 py-0.5 rounded w-fit block">
              Extend & Scale
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Marketplace for Limitless Growth</h2>
            <p className="text-xs text-slate-450 leading-relaxed font-semibold">
              Extend your platform with premium themes, plugins, apps and extensions from our powerful marketplace.
            </p>
          </div>

          <div className="space-y-2.5 text-[11px] font-black text-slate-350">
            {checklist.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Check size={10} className="stroke-[3]" />
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <Link
            href="/dashboard/app-store"
            className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition active:scale-95 flex items-center gap-1.5 w-fit shadow-lg shadow-indigo-600/10"
          >
            <span>Explore Marketplace</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* Right Marketplace grid mock */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {apps.map((app, idx) => {
            const Icon = app.icon;
            return (
              <div 
                key={idx} 
                className="p-5 border border-slate-900 bg-[#090b11] rounded-2xl flex items-start gap-4 hover:border-slate-800 transition duration-300"
              >
                <div className={`p-2.5 rounded-xl border border-slate-850 shrink-0 ${app.color}`}>
                  <Icon size={16} />
                </div>
                <div className="min-w-0 space-y-1">
                  <h4 className="text-xs font-black text-white leading-none">{app.name}</h4>
                  <p className="text-[10px] text-slate-450 leading-none">{app.desc}</p>
                  <span className="text-[9px] text-yellow-500 block leading-none pt-0.5">{app.rating}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

