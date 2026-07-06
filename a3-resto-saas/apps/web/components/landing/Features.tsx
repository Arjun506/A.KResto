'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  Building2,
  Check,
  CreditCard,
  Gift,
  Headphones,
  MapPin,
  Package,
  Puzzle,
  Send,
  Sparkles,
  TrendingUp,
  Users
} from 'lucide-react';

type Message = {
  sender: 'user' | 'ai';
  text: string;
};

const moduleCards = [
  { title: 'Point of Sale', desc: 'Fast billing and sales management.', icon: CreditCard, color: 'text-violet-600 bg-violet-500/10 border-violet-500/20' },
  { title: 'Inventory', desc: 'Track stock, suppliers, and movement.', icon: Package, color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' },
  { title: 'Customer CRM', desc: 'Build loyalty and repeat purchase.', icon: Users, color: 'text-blue-600 bg-blue-500/10 border-blue-500/20' },
  { title: 'Finance', desc: 'Manage expenses and reports.', icon: Building2, color: 'text-cyan-600 bg-cyan-500/10 border-cyan-500/20' },
  { title: 'Support', desc: 'Track requests and service quality.', icon: Headphones, color: 'text-amber-600 bg-amber-500/10 border-amber-500/20' },
  { title: 'Analytics', desc: 'Real-time insights for decisions.', icon: TrendingUp, color: 'text-rose-600 bg-rose-500/10 border-rose-500/20' }
];

export default function Features() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Ask me to forecast sales, check stock, or find customers at risk. I will turn live business data into next steps.'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [installedApps, setInstalledApps] = useState<Record<string, boolean>>({
    'WhatsApp Connect': false,
    'SMS Gateway': true,
    'AI Stock Forecaster': false,
    'Loyalty Program': false
  });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = -(y - rect.height / 2) / 22;
    const rotateY = (x - rect.width / 2) / 22;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const resetTilt = (event: React.MouseEvent<HTMLDivElement>) => {
    event.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
  };

  const triggerAIResponse = (prompt: string) => {
    setIsTyping(true);
    const textLower = prompt.toLowerCase();
    let aiText = 'I found the pattern. Your next best move is to review the dashboard alert, assign an owner, and automate the follow-up.';

    if (textLower.includes('sales') || textLower.includes('forecast')) {
      aiText = 'Forecast ready: Friday evening demand is trending 14% higher. Prepare extra top-selling stock and schedule one more cashier.';
    } else if (textLower.includes('stock') || textLower.includes('inventory') || textLower.includes('restock')) {
      aiText = 'Stock check complete: three items are near safety level. A supplier purchase draft is ready for approval.';
    } else if (textLower.includes('customer') || textLower.includes('churn')) {
      aiText = 'Customer segment built: 182 inactive customers are ready for a win-back offer through WhatsApp and SMS.';
    }

    window.setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'ai', text: aiText }]);
      setIsTyping(false);
    }, 850);
  };

  const sendMessage = (event?: React.FormEvent, prompt?: string) => {
    event?.preventDefault();
    const text = (prompt ?? inputValue).trim();
    if (!text) return;

    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInputValue('');
    triggerAIResponse(text);
  };

  const toggleInstall = (appName: string) => {
    setInstalledApps((prev) => ({ ...prev, [appName]: !prev[appName] }));
  };

  return (
    <section id="features-platform" className="landing-section">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="scroll-reveal mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-black tracking-tight text-[color:var(--landing-text)] sm:text-4xl">
            Everything You Need. All in One Place.
          </h2>
          <p className="mt-3 text-sm font-semibold leading-6 landing-muted">
            Core operations, customer experiences, marketplace extensions, and AI automation work from the same source of truth.
          </p>
        </div>

        <div className="scroll-reveal mt-10 grid gap-4 md:grid-cols-3 lg:grid-cols-6" data-reveal-delay="1">
          {moduleCards.map((module) => {
            const Icon = module.icon;
            return (
              <div key={module.title} className="landing-card rounded-2xl p-4">
                <span className={`grid h-11 w-11 place-items-center rounded-2xl border ${module.color}`}>
                  <Icon size={18} />
                </span>
                <h3 className="mt-4 text-sm font-black text-[color:var(--landing-text)]">{module.title}</h3>
                <p className="mt-2 text-xs font-semibold leading-5 landing-muted">{module.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={resetTilt}
            className="scroll-reveal landing-card-strong rounded-[1.35rem] p-6 transition-transform duration-200"
            data-reveal-delay="1"
          >
            <div className="flex min-h-full flex-col justify-between gap-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">Customer app</span>
                <h3 className="mt-2 text-2xl font-black text-[color:var(--landing-text)]">AK Connect</h3>
                <p className="mt-3 text-sm font-semibold leading-6 landing-muted">
                  Give customers ordering, booking, loyalty, delivery tracking, offers, and payments from a branded mobile experience.
                </p>
                <div className="mt-5 space-y-3">
                  {['Search nearby businesses', 'Easy ordering and booking', 'Live order tracking', 'Secure payments'].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-xs font-extrabold text-[color:var(--landing-text)]">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-blue-500/10 text-blue-600">
                        <Check size={11} strokeWidth={3} />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[color:var(--landing-border)] bg-white/70 p-3 dark:bg-slate-950/50">
                <div className="mx-auto max-w-[178px] rounded-[1.7rem] bg-slate-950 p-2 text-white shadow-2xl">
                  <div className="min-h-[250px] rounded-[1.35rem] bg-slate-900 p-3">
                    <div className="flex items-center justify-between text-[8px] font-bold text-slate-300">
                      <span className="inline-flex items-center gap-1"><MapPin size={9} />Nearby</span>
                      <Gift size={10} />
                    </div>
                    <div className="mt-3 rounded-xl bg-white/5 p-2 text-[8px] text-slate-400">Search restaurants, salons, stores</div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {[
                        ['/images/chicken_burger.png', 'Burger'],
                        ['/images/cold_coffee.png', 'Coffee']
                      ].map(([src, label]) => (
                        <div key={label} className="rounded-xl bg-white/5 p-2">
                          <Image src={src} alt={label} width={58} height={58} className="h-14 w-full object-contain" />
                          <span className="mt-1 block truncate text-center text-[8px] font-black">{label}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 p-2 text-[9px] font-black">
                      50% OFF customer campaign
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/onboarding" className="landing-primary-button w-full">
                Explore AK Connect
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={resetTilt}
            className="scroll-reveal landing-card-strong rounded-[1.35rem] p-6 transition-transform duration-200"
            data-reveal-delay="2"
          >
            <div className="flex min-h-full flex-col justify-between gap-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">Marketplace</span>
                <h3 className="mt-2 text-2xl font-black text-[color:var(--landing-text)]">Extend & Grow</h3>
                <p className="mt-3 text-sm font-semibold leading-6 landing-muted">
                  Add premium themes, messaging, automation, accounting, loyalty, and custom apps without slowing the core platform.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  ['WhatsApp Connect', 'Automated customer notifications'],
                  ['SMS Gateway', 'Reliable OTP and campaign messages'],
                  ['AI Stock Forecaster', 'Predict demand before stockouts'],
                  ['Loyalty Program', 'Points, rewards, and repeat visits']
                ].map(([name, desc]) => (
                  <div key={name} className="flex items-center justify-between gap-3 rounded-2xl border border-[color:var(--landing-border)] bg-white/65 p-3 dark:bg-slate-950/45">
                    <div>
                      <span className="block text-xs font-black text-[color:var(--landing-text)]">{name}</span>
                      <span className="mt-0.5 block text-[10px] font-semibold landing-soft-text">{desc}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleInstall(name)}
                      className={`rounded-xl px-3 py-2 text-[9px] font-black uppercase transition ${
                        installedApps[name]
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
                          : 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                      }`}
                    >
                      {installedApps[name] ? 'Active' : 'Install'}
                    </button>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-[color:var(--landing-border)] bg-white/60 p-5 text-center dark:bg-slate-950/45">
                <span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-xl shadow-violet-600/20">
                  <Puzzle size={34} />
                </span>
                <p className="mt-4 text-xs font-bold landing-muted">Marketplace apps stay connected to your users, permissions, billing, and reports.</p>
              </div>

              <Link href="#pricing" className="landing-primary-button w-full">
                Explore Marketplace
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={resetTilt}
            className="scroll-reveal landing-card-strong rounded-[1.35rem] p-6 transition-transform duration-200"
            data-reveal-delay="3"
          >
            <div className="flex min-h-full flex-col justify-between gap-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">AI assistant</span>
                <h3 className="mt-2 text-2xl font-black text-[color:var(--landing-text)]">Your Smart Partner</h3>
                <p className="mt-3 text-sm font-semibold leading-6 landing-muted">
                  Ask plain questions, forecast demand, draft restock actions, and turn customer data into campaigns.
                </p>
              </div>

              <div className="rounded-2xl border border-[color:var(--landing-border)] bg-slate-950 p-3 text-white">
                <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-3">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-cyan-500/15 text-cyan-300">
                    <Bot size={16} />
                  </span>
                  <span className="text-xs font-black">AK AI</span>
                </div>
                <div className="h-56 space-y-2 overflow-y-auto pr-1 scrollbar-none">
                  {messages.map((message, index) => (
                    <div
                      key={`${message.sender}-${index}`}
                      className={`max-w-[88%] rounded-2xl px-3 py-2 text-[10px] font-semibold leading-5 ${
                        message.sender === 'ai' ? 'bg-white/[0.08] text-slate-200' : 'ml-auto bg-cyan-600 text-white'
                      }`}
                    >
                      {message.text}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex w-fit gap-1 rounded-2xl bg-white/[0.08] px-3 py-2">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-300" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-300 [animation-delay:0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-300 [animation-delay:0.3s]" />
                    </div>
                  )}
                </div>
                <form onSubmit={sendMessage} className="mt-3 flex gap-2 border-t border-white/10 pt-3">
                  <input
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    placeholder="Ask about sales or stock"
                    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
                  />
                  <button type="submit" className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-600 text-white transition hover:bg-cyan-500" aria-label="Send message">
                    <Send size={14} />
                  </button>
                </form>
              </div>

              <div className="flex flex-wrap gap-2">
                {['Forecast sales', 'Check stock', 'Customer churn'].map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(undefined, prompt)}
                    className="rounded-xl border border-[color:var(--landing-border)] bg-white/60 px-3 py-2 text-[10px] font-black landing-muted transition hover:text-[color:var(--landing-text)] dark:bg-slate-950/45"
                  >
                    <Sparkles size={11} className="mr-1 inline" />
                    {prompt}
                  </button>
                ))}
              </div>

              <Link href="/onboarding" className="landing-primary-button w-full">
                Ask AK AI
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
