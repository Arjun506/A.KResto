'use client';

import { useEffect, useState, useRef } from 'react';
import { X, Send, Sparkles, MessageSquare, Loader2, RefreshCw } from 'lucide-react';

interface ChatMessage {
  id: number;
  sender: 'ai' | 'user';
  text: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    sender: 'ai',
    text: 'Hello! I am your AK Workspace Assistant. I can help you compile sales statistics, write product catalog descriptions, adjust printer configurations, and optimize store settings.'
  }
];

const SUGGESTED_PROMPTS = [
  'Generate sales summary draft',
  'Help configure receipt thermal printer',
  'Optimize stock inventory warnings',
  'Draft description for Margherita Pizza'
];

export default function AIDock() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-ai-dock', handleOpen);
    return () => window.removeEventListener('open-ai-dock', handleOpen);
  }, []);

  // Auto scroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: textToSend
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Mock AI response delay
    setTimeout(() => {
      let aiText = '';
      const query = textToSend.toLowerCase();

      if (query.includes('sales')) {
        aiText = 'Based on today\'s transaction logs: Revenue is ₹2.45L across 1,245 orders, showing an upward trend of 22.7% compared to last Sunday. Cash billing accounts for 68% of settlements.';
      } else if (query.includes('printer') || query.includes('receipt')) {
        aiText = 'To configure receipt printers, go to Settings -> Printers. Click "Scan Devices", pair the thermal printing unit, and verify that the "Print KOT on checkout" option is turned on.';
      } else if (query.includes('pizza') || query.includes('margherita')) {
        aiText = 'Here is a premium product catalog draft: "Margherita Pizza - Classic Italian stone-baked sourdough thin crust pizza topped with San Marzano tomato marinara sauce, fresh buffalo mozzarella, and aromatic basil leaves. Freshly prepared."';
      } else {
        aiText = 'I\'ve captured your request. AK Business OS AI capabilities will be fully wired to active model services in the upcoming Release 2. I can assist with general settings and drafts for now.';
      }

      const aiMsg: ChatMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiText
      };
      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
    }, 1200);
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
    setInput('');
    setLoading(false);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-[9990] w-full max-w-md bg-[#090b11] border-l border-slate-800/80 shadow-2xl overflow-hidden flex flex-col text-slate-100 select-none animate-cc-panel-in">
      
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-800/60 flex items-center justify-between bg-[#11131c]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-wide">
              Workspace AI Assistant
            </h2>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Release 2 Preview</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleReset}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-300 transition"
            title="Reset Conversation"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-300 transition"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 space-y-4"
        style={{ scrollbarWidth: 'thin' }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 max-w-[85%] ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div
              className={`p-1.5 rounded-lg shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/30'
                  : 'bg-slate-850/50 text-slate-400 border border-slate-800'
              }`}
            >
              {msg.sender === 'user' ? <MessageSquare size={13} /> : <Sparkles size={13} />}
            </div>
            <div
              className={`p-3.5 rounded-2xl text-xs leading-relaxed text-left ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800/80 rounded-tl-none text-slate-250'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-slate-500 text-xs pl-4">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Assistant is writing...</span>
          </div>
        )}
      </div>

      {/* Suggested Prompts Grid */}
      {messages.length === 1 && (
        <div className="px-5 py-3 border-t border-slate-850 bg-[#090b11]/50 space-y-2">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 text-left">
            Suggested Actions
          </p>
          <div className="grid grid-cols-2 gap-2">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-[10px] text-slate-450 hover:text-slate-200 transition text-left cursor-pointer truncate"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input Bar */}
      <div className="p-4 border-t border-slate-800/60 bg-[#11131c]">
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Ask AI workspace assistant..."
            className="flex-1 bg-transparent border-0 outline-none text-xs text-white placeholder-slate-500 focus:ring-0 p-0"
          />
          <button
            onClick={() => handleSend(input)}
            className="p-1 text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
          >
            <Send size={14} />
          </button>
        </div>
      </div>

    </div>
  );
}

