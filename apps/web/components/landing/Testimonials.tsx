'use client';

import { useState } from 'react';
import {
  Activity,
  Building,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Layers,
  ShieldCheck,
  Star,
  Users
} from 'lucide-react';

const stats = [
  { value: '100+', label: 'Business Modules', icon: Layers, color: 'text-blue-600 bg-blue-500/10 border-blue-500/20' },
  { value: '25+', label: 'Industries', icon: Building, color: 'text-violet-600 bg-violet-500/10 border-violet-500/20' },
  { value: '10,000+', label: 'Happy Businesses', icon: Users, color: 'text-cyan-600 bg-cyan-500/10 border-cyan-500/20' },
  { value: '99.99%', label: 'Uptime', icon: Activity, color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' },
  { value: '24/7', label: 'Customer Support', icon: Headphones, color: 'text-amber-600 bg-amber-500/10 border-amber-500/20' },
  { value: '100%', label: 'Secure & Trusted', icon: ShieldCheck, color: 'text-rose-600 bg-rose-500/10 border-rose-500/20' }
];

const reviews = [
  {
    quote: 'AK Business OS gave our restaurant one clear command center. Billing, inventory, online orders, and reporting finally work together.',
    author: 'Rohit Sharma',
    role: 'Restaurant Owner'
  },
  {
    quote: 'For retail, the inventory and customer tools changed our daily rhythm. We spend less time checking sheets and more time selling.',
    author: 'Neha Verma',
    role: 'Retail Store Owner'
  },
  {
    quote: 'From bookings to housekeeping and finance reports, our hotel team now works from the same live operating view.',
    author: 'Vikram Singh',
    role: 'Hotel Manager'
  },
  {
    quote: 'Appointments, staff scheduling, inventory, and customer reminders are much easier. The platform feels built for real operators.',
    author: 'Anita Patel',
    role: 'Salon Owner'
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeReview = reviews[currentIndex];

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="customers" className="landing-section">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="scroll-reveal grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="landing-card rounded-2xl p-5 text-center">
                <span className={`mx-auto grid h-11 w-11 place-items-center rounded-2xl border ${stat.color}`}>
                  <Icon size={18} />
                </span>
                <span className="counter-rise mt-4 block text-2xl font-black text-[color:var(--landing-text)]">{stat.value}</span>
                <span className="mt-1 block text-[10px] font-black uppercase tracking-[0.16em] landing-soft-text">{stat.label}</span>
              </div>
            );
          })}
        </div>

        <div className="scroll-reveal mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8" data-reveal-delay="1">
          <div className="text-center">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              What Our Customers Say
            </h2>
            <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Business owners choose AK Business OS to reduce chaos, protect margins, and create better customer experiences.
            </p>
          </div>

          {/* Grid Layout for Testimonials */}
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4 text-left">
            {reviews.map((review, idx) => (
              <div 
                key={review.author}
                className="glass-premium border border-slate-200/50 dark:border-white/5 p-6 rounded-2xl flex flex-col justify-between shadow-lg hover:-translate-y-1.5 transition-all duration-300 hover:shadow-xl"
              >
                <div>
                  {/* Star Ratings */}
                  <div className="flex gap-0.5 text-amber-450 dark:text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} className="fill-current" />
                    ))}
                  </div>
                  {/* Quote */}
                  <p className="mt-4 text-xs font-semibold leading-5 text-slate-600 dark:text-slate-350 italic">
                    "{review.quote}"
                  </p>
                </div>

                {/* Author Metadata */}
                <div className="mt-6 flex items-center gap-3 border-t border-slate-200/40 dark:border-white/5 pt-4">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-blue-600/10 text-blue-600 dark:bg-cyan-500/10 dark:text-cyan-400 text-[10px] font-black uppercase">
                    {review.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <span className="block text-xs font-black text-slate-950 dark:text-white">{review.author}</span>
                    <span className="mt-0.5 block text-[8px] font-black uppercase tracking-[0.12em] text-slate-400 dark:text-slate-450">{review.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
