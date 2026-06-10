'use client';

import { Bell, MessageSquare, Globe, ChevronDown, AlignLeft } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 select-none flex-shrink-0">
      
      {/* LEFT MENU ICON */}
      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-500 transition active:scale-95">
          <AlignLeft size={18} />
        </button>
      </div>

      {/* RIGHT CONTROLS */}
      <div className="flex items-center gap-6">
        
        {/* LANGUAGE SELECTOR */}
        <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition text-xs font-bold text-slate-700">
          <Globe size={14} className="text-slate-400" />
          <span>English</span>
          <ChevronDown size={12} className="text-slate-400" />
        </div>

        {/* NOTIFICATIONS */}
        <div className="flex items-center gap-3">
          
          {/* BELL */}
          <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-500 transition active:scale-95 relative">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[8px] font-black leading-none border border-white">
              8
            </span>
          </button>

          {/* CHAT */}
          <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-500 transition active:scale-95 relative">
            <MessageSquare size={18} />
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[8px] font-black leading-none border border-white">
              3
            </span>
          </button>

        </div>

        {/* VENDOR PROFILE */}
        <div className="h-8 w-[1px] bg-slate-100" />

        <div className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50/50 p-1 rounded-xl transition">
          <div className="w-9 h-9 rounded-full bg-slate-150 border border-slate-200 overflow-hidden relative">
            {/* Simulation of profile pic */}
            <div className="w-full h-full bg-gradient-to-tr from-rose-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold font-sans">
              RS
            </div>
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-black text-slate-800 leading-none">Rohit Sharma</p>
            <p className="text-[9px] text-zinc-400 font-bold mt-1 leading-none">Owner</p>
          </div>
          <ChevronDown size={12} className="text-slate-400 group-hover:translate-y-0.5 transition-transform" />
        </div>

      </div>

    </header>
  );
}