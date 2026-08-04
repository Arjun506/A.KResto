'use client';

import Link from 'next/link';
import { HelpCircle, Mail, Phone, ArrowLeft, MessageSquare, ShieldCheck, FileText } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-slate-800/80 border border-slate-700/60 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="flex items-center space-x-3 text-blue-400">
          <HelpCircle size={32} />
          <h1 className="text-2xl font-bold tracking-tight text-white">AK Business OS Support Center</h1>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed">
          Need assistance with your account, login, tenant workspace, or industry pack setup?
          Our platform engineers and support team are available 24/7.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-slate-900/60 border border-slate-700/40 rounded-2xl flex items-start space-x-3">
            <Mail className="text-blue-400 mt-1 shrink-0" size={20} />
            <div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Email Support</h3>
              <p className="text-xs text-slate-400 mt-1">support@akresto.com</p>
            </div>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-700/40 rounded-2xl flex items-start space-x-3">
            <Phone className="text-indigo-400 mt-1 shrink-0" size={20} />
            <div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Direct Hotline</h3>
              <p className="text-xs text-slate-400 mt-1">+1 (800) 555-AKOS</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between">
          <Link
            href="/login"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Return to Login</span>
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
