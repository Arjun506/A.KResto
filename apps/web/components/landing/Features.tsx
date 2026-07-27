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

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          
          {/* Card 1: AK Connect */}
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={resetTilt}
            className="scroll-reveal glass-premium border border-slate-200/50 dark:border-white/5 rounded-[1.5rem] p-6 transition-transform duration-305 hover:shadow-xl flex flex-col justify-between gap-6"
            data-reveal-delay="1"
          >
            <div className="flex flex-col justify-between h-full gap-5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">Customer app</span>
                <h3 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">AK Connect</h3>
                <p className="mt-2.5 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">
                  Give customers ordering, booking, loyalty, delivery tracking, offers, and payments from a branded mobile experience.
                </p>
                <div className="mt-5 space-y-2.5">
                  {['Search Nearby Businesses', 'Easy Ordering & Booking', 'Live Order Tracking', 'Secure Payments', 'Loyalty & Rewards'].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-xs font-extrabold text-slate-800 dark:text-slate-200">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-blue-500/10 text-blue-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                        <Check size={11} strokeWidth={3} />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* 3D Smartphone visual mockup */}
              <div className="relative mx-auto my-3 w-full max-w-[210px] flex items-center justify-center container-3d">
                <div className="card-3d relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-slate-200/60 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 p-1.5 backdrop-blur-md">
                  <Image 
                    src="/images/customer_app_3d.png" 
                    alt="Customer App 3D Mockup" 
                    width={190} 
                    height={250} 
                    className="rounded-xl object-contain hover:scale-105 transition duration-500" 
                  />
                </div>
              </div>

              <Link href="/onboarding" className="landing-primary-button w-full shadow-md text-center justify-center">
                Explore AK Connect
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Card 2: Marketplace */}
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={resetTilt}
            className="scroll-reveal glass-premium border border-slate-200/50 dark:border-white/5 rounded-[1.5rem] p-6 transition-transform duration-305 hover:shadow-xl flex flex-col justify-between gap-6"
            data-reveal-delay="2"
          >
            <div className="flex flex-col justify-between h-full gap-5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">Marketplace</span>
                <h3 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">Extend & Grow</h3>
                <p className="mt-2.5 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">
                  Add premium themes, messaging, automation, accounting, loyalty, and custom apps without slowing the core platform.
                </p>
                <div className="mt-5 space-y-2.5">
                  {['Premium Themes', 'Powerful Plugins', 'Custom Apps', 'Widgets & Extensions', 'Everything You Need'].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-xs font-extrabold text-slate-800 dark:text-slate-200">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-violet-550/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-350">
                        <Check size={11} strokeWidth={3} />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* 3D Marketplace visual mockup */}
              <div className="relative mx-auto my-3 w-full max-w-[210px] flex items-center justify-center container-3d">
                <div className="card-3d relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-slate-200/60 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 p-1.5 backdrop-blur-md">
                  <Image 
                    src="/images/marketplace_3d.png" 
                    alt="Marketplace 3D Mockup" 
                    width={190} 
                    height={250} 
                    className="rounded-xl object-contain hover:scale-105 transition duration-500" 
                  />
                </div>
              </div>

              <Link href="#pricing" className="landing-primary-button w-full shadow-md text-center justify-center bg-gradient-to-r from-violet-600 to-indigo-600">
                Explore Marketplace
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Card 3: AI Assistant */}
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={resetTilt}
            className="scroll-reveal glass-premium border border-slate-200/50 dark:border-white/5 rounded-[1.5rem] p-6 transition-transform duration-305 hover:shadow-xl flex flex-col justify-between gap-6"
            data-reveal-delay="3"
          >
            <div className="flex flex-col justify-between h-full gap-5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">AI assistant</span>
                <h3 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">Your Smart Partner</h3>
                <p className="mt-2.5 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">
                  Ask plain questions, forecast demand, draft restock actions, and turn customer data into campaigns.
                </p>
                <div className="mt-5 space-y-2.5">
                  {['Business Insights', 'Sales Forecasting', 'Inventory Suggestions', 'Smart Automation', 'Natural AI Chat'].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-xs font-extrabold text-slate-800 dark:text-slate-200">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-cyan-500/10 text-cyan-650 dark:bg-cyan-550/20 dark:text-cyan-350">
                        <Check size={11} strokeWidth={3} />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* 3D AI Robot visual mockup */}
              <div className="relative mx-auto my-3 w-full max-w-[210px] flex items-center justify-center container-3d">
                <div className="card-3d relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-slate-200/60 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 p-1.5 backdrop-blur-md">
                  <Image 
                    src="/images/ai_assistant_robot.png" 
                    alt="AI Assistant 3D Robot" 
                    width={190} 
                    height={250} 
                    className="rounded-xl object-contain hover:scale-105 transition duration-500" 
                  />
                </div>
              </div>

              <Link href="/onboarding" className="landing-primary-button w-full shadow-md text-center justify-center bg-gradient-to-r from-cyan-600 to-blue-600">
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

