'use client';

import { Sparkles, MessageSquare, Send, Bot, LineChart } from 'lucide-react';

export default function AISection() {
  return (
    <section className="max-w-6xl mx-auto w-full px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
      
      {/* Left Chat Screen Simulator */}
      <div className="lg:col-span-6 border border-slate-900 bg-slate-950/20 rounded-3xl p-5 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-center gap-2 pb-3 border-b border-slate-900 mb-4 z-10 relative">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Bot size={14} />
          </div>
          <div>
            <span className="text-[10px] font-black text-white block">AK AI Assistant</span>
            <span className="text-[8px] text-slate-500 block">Active predictive analysis</span>
          </div>
        </div>

        {/* Message streams */}
        <div className="space-y-3 min-h-[160px] text-[10px] leading-relaxed">
          <div className="p-3 bg-slate-900/60 rounded-2xl max-w-[85%] text-slate-300">
            Hi! I analysed last month's purchase records. Sunday evening garlic bread order rates typically spike by <span className="text-indigo-400 font-bold">24%</span>. Should I suggest auto-ordering 15 extra crates?
          </div>
          <div className="p-3 bg-indigo-650 text-white rounded-2xl max-w-[85%] ml-auto text-right">
            Yes, auto-approve stock restocks for next Sunday.
          </div>
          <div className="p-3 bg-slate-900/60 rounded-2xl max-w-[85%] text-slate-350 flex gap-2">
            <LineChart size={12} className="text-emerald-500 mt-0.5 shrink-0" />
            <span>Approved. Updated inventory restock rules. Expected margin increase: +4.2%.</span>
          </div>
        </div>

        {/* Text Input mock */}
        <div className="mt-4 pt-3 border-t border-slate-900 flex gap-2 items-center">
          <div className="flex-1 px-3 py-1.5 border border-slate-900 rounded-xl bg-slate-950 text-[10px] text-slate-500">
            Ask AI for suggestions...
          </div>
          <button className="p-2 bg-indigo-600 rounded-xl text-white">
            <Send size={11} />
          </button>
        </div>
      </div>

      {/* Right text blocks */}
      <div className="lg:col-span-6 space-y-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-indigo-400 bg-indigo-950/20 border border-indigo-900/50 px-2 py-0.5 rounded text-[9px] font-black uppercase">
            <Sparkles size={10} />
            <span>AI Platform (Architectural Placeholder)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Predictive Analytics & Forecasting</h2>
          <p className="text-xs text-slate-400 leading-relaxed font-semibold">
            AK Business OS includes placeholder hooks to integrate machine learning workflows. Predict sales volumes, trigger auto-restocks, and segment slippages dynamically.
          </p>
        </div>
      </div>

    </section>
  );
}
