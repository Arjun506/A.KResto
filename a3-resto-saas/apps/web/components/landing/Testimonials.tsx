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

        <div className="scroll-reveal mx-auto mt-20 max-w-5xl text-center" data-reveal-delay="1">
          <h2 className="text-3xl font-black tracking-tight text-[color:var(--landing-text)] sm:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mt-3 text-sm font-semibold leading-6 landing-muted">
            Business owners choose AK Business OS to reduce chaos, protect margins, and create better customer experiences.
          </p>

          <div className="mt-10 flex items-center gap-3 sm:gap-6">
            <button
              type="button"
              onClick={prevSlide}
              className="theme-toggle-button shrink-0"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="min-h-[244px] flex-1 overflow-hidden rounded-[1.35rem] landing-card-strong p-6 sm:p-8">
              <div key={currentIndex} className="scroll-reveal is-visible">
                <div className="flex justify-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={16} className="fill-current" />
                  ))}
                </div>
                <p className="mx-auto mt-6 max-w-2xl text-base font-semibold leading-8 text-[color:var(--landing-text)]">
                  "{activeReview.quote}"
                </p>
                <div className="mt-6">
                  <span className="block text-sm font-black text-[color:var(--landing-text)]">{activeReview.author}</span>
                  <span className="mt-1 block text-[10px] font-black uppercase tracking-[0.16em] landing-soft-text">{activeReview.role}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={nextSlide}
              className="theme-toggle-button shrink-0"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {reviews.map((review, index) => (
              <button
                key={review.author}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? 'w-8 bg-blue-600' : 'w-2 bg-slate-300 hover:bg-slate-400 dark:bg-slate-700'
                }`}
                aria-label={`Show testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
