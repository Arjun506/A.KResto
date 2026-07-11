'use client';

import { useEffect, useState } from 'react';
import { X, Search, HelpCircle, BookOpen, Key, PhoneCall, Sparkles } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
  category: 'General' | 'POS' | 'Inventory' | 'Setup';
}

const FAQS: FaqItem[] = [
  {
    q: 'How do I generate QR Codes for dine-in tables?',
    a: 'Go to Table Management, configure table seating layouts, click generate QR, and select table rows to export as a print-ready PDF.',
    category: 'Setup'
  },
  {
    q: 'Can I sync multiple thermal printers to the POS?',
    a: 'Yes, navigate to POS Settings, configure printer IP/USB interfaces, and assign printer routing tags (e.g. KOT, Receipt, Invoice).',
    category: 'POS'
  },
  {
    q: 'How are low stock warnings configured?',
    a: 'Set item inventory thresholds in the Inventory / Stock tab. The platform triggers real-time alerts when supply counts fall below minimum set levels.',
    category: 'Inventory'
  },
  {
    q: 'What is the Launch Center completion criteria?',
    a: 'The Launch Checklist tracks 13 onboarding milestones. Ensure you complete basic details, configure a payment option, and perform at least one test sale.',
    category: 'General'
  }
];

const KEYBOARD_SHORTCUTS = [
  { key: 'Ctrl + K', desc: 'Open Command Palette' },
  { key: 'ArrowDown / Up', desc: 'Navigate search lists' },
  { key: 'Enter', desc: 'Execute highlighted action' },
  { key: 'Escape', desc: 'Close dialogs / Modals' },
  { key: 'F1', desc: 'Launch billing sales screen' },
  { key: 'F2', desc: 'Open orders directory list' }
];

export default function HelpCenterDock() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'faqs' | 'shortcuts' | 'support'>('faqs');

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-help-center', handleOpen);
    return () => window.removeEventListener('open-help-center', handleOpen);
  }, []);

  if (!isOpen) return null;

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.q.toLowerCase().includes(query.toLowerCase()) ||
      faq.a.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-y-0 right-0 z-[9990] w-full max-w-md bg-white dark:bg-[#11131c] border-l border-slate-200/50 dark:border-slate-800/40 shadow-2xl overflow-hidden flex flex-col glass animate-cc-panel-in select-none">
      
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-850/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 dark:text-slate-100">
              Workspace Help Center
            </h2>
            <p className="text-[10px] text-slate-400 font-bold">AK Business OS guides</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 transition"
        >
          <X size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex px-4 border-b border-slate-100 dark:border-slate-850/40 text-xs font-bold text-slate-500">
        {[
          { id: 'faqs', label: 'FAQs & Articles', icon: BookOpen },
          { id: 'shortcuts', label: 'Shortcuts', icon: Key },
          { id: 'support', label: 'Support & Tour', icon: PhoneCall }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition capitalize cursor-pointer ${
                isActive
                  ? 'border-indigo-500 text-indigo-650 dark:text-indigo-400 font-extrabold'
                  : 'border-transparent hover:text-slate-700'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{ scrollbarWidth: 'thin' }}>
        
        {activeTab === 'faqs' && (
          <div className="space-y-4">
            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search troubleshooting guides..."
                className="flex-1 bg-transparent border-0 outline-none text-xs text-slate-700 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-0 p-0"
              />
            </div>

            {/* FAQ List */}
            <div className="space-y-3">
              {filteredFaqs.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">
                  No support articles match your search query.
                </p>
              ) : (
                filteredFaqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50/50 dark:bg-slate-800/10 border border-slate-100 dark:border-slate-800/20 rounded-xl space-y-1.5 text-left"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">
                        {faq.q}
                      </h4>
                      <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400">
                        {faq.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      {faq.a}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'shortcuts' && (
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-350">
              Workspace Keyboard Shortcuts
            </h4>
            <div className="border border-slate-200/50 dark:border-slate-800/40 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-850/40">
              {KEYBOARD_SHORTCUTS.map((shortcut) => (
                <div key={shortcut.key} className="flex items-center justify-between p-3 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">{shortcut.desc}</span>
                  <kbd className="px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono font-bold text-slate-650 dark:text-slate-300">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="space-y-4 text-left">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-5 rounded-2xl space-y-3">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <h4 className="text-xs font-black uppercase tracking-wider text-indigo-150">Interactive Walkthrough</h4>
              </div>
              <p className="text-[11px] text-indigo-100 leading-normal">
                Want to restart the platform setup guide? Re-launch the product tour to highlight all core sections.
              </p>
              <button
                onClick={() => {
                  setIsOpen(false);
                  window.dispatchEvent(new Event('start-product-tour'));
                }}
                className="px-3.5 py-2 bg-white text-indigo-700 hover:bg-slate-50 text-[10px] font-black rounded-lg transition active:scale-95 shadow-sm cursor-pointer"
              >
                Launch Walkthrough Tour
              </button>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-850/20 border border-slate-200 dark:border-slate-850/30 rounded-2xl space-y-2">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Contact Enterprise Support
              </h4>
              <p className="text-[11px] text-slate-450 leading-normal">
                Facing setup difficulties? Reach out to our technical account managers at `support@akbusinessos.com` for manual provisioning assistance.
              </p>
            </div>
          </div>
        )}

      </div>
      
      {/* Footer */}
      <div className="px-5 py-3.5 bg-slate-50 dark:bg-[#151722]/50 border-t border-slate-100 dark:border-slate-850/20 flex items-center justify-between text-[10px] font-bold text-slate-400">
        <span>AK Business OS Help Desk</span>
        <span>Version 2.0</span>
      </div>

    </div>
  );
}
