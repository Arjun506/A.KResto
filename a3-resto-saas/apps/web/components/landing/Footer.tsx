'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, MessageCircle, PlayCircle, Share2, Users } from 'lucide-react';

const footerColumns = [
  {
    title: 'Products',
    links: [
      { label: 'Business OS', href: '#features' },
      { label: 'AK Connect', href: '#features-platform' },
      { label: 'Marketplace', href: '#features-platform' },
      { label: 'AI Platform', href: '#features-platform' }
    ]
  },
  {
    title: 'Industries',
    links: [
      { label: 'Restaurant', href: '#industries' },
      { label: 'Retail', href: '#industries' },
      { label: 'Hotel', href: '#industries' },
      { label: 'Healthcare', href: '#industries' }
    ]
  },
  {
    title: 'Resources',
    links: [
      { label: 'Pricing', href: '#pricing' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Support Center', href: '#contact' },
      { label: 'Book Demo', href: '#pricing' }
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#hero' },
      { label: 'Careers', href: '#contact' },
      { label: 'Partners', href: '#customers' },
      { label: 'Contact Us', href: '#contact' }
    ]
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#contact' },
      { label: 'Terms of Service', href: '#contact' },
      { label: 'Refund Policy', href: '#contact' },
      { label: 'Security', href: '#features' }
    ]
  }
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail('');
  };

  return (
    <footer id="contact" className="relative border-t border-[color:var(--landing-border)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Link href="#hero" className="flex items-center gap-3">
              <span className="landing-logo-mark">
                <span className="relative z-10 text-sm font-black tracking-tighter">AK</span>
              </span>
              <span>
                <span className="block text-sm font-black text-[color:var(--landing-text)]">AK Business OS</span>
                <span className="mt-1 block text-[10px] font-black uppercase tracking-[0.2em] landing-soft-text">Every business. One OS.</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm font-semibold leading-7 landing-muted">
              A modern operating system for restaurants, retail, hotels, salons, healthcare, warehouses, and growing multi-branch teams.
            </p>

            <div className="mt-5 flex gap-3">
              {[
                ['Community', Users],
                ['Updates', Share2],
                ['Chat', MessageCircle],
                ['Videos', PlayCircle]
              ].map(([label, Icon]) => {
                const SocialIcon = Icon as typeof Users;
                return (
                  <Link key={label as string} href="#contact" className="theme-toggle-button h-9 w-9" aria-label={label as string}>
                    <SocialIcon size={15} />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-6 lg:grid-cols-5">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="text-[10px] font-black uppercase tracking-[0.18em] landing-soft-text">{column.title}</h3>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-xs font-bold landing-muted transition hover:text-[color:var(--landing-text)]">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-2xl p-5 landing-card">
              <h3 className="text-sm font-black text-[color:var(--landing-text)]">Subscribe to our newsletter</h3>
              <p className="mt-2 text-xs font-semibold leading-5 landing-muted">
                Get product updates, business playbooks, and launch offers.
              </p>
              <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
                <input
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setSubmitted(false);
                  }}
                  type="email"
                  placeholder="Enter your email"
                  className="min-w-0 flex-1 rounded-xl border border-[color:var(--landing-border)] bg-white/70 px-3 py-2 text-xs font-semibold text-[color:var(--landing-text)] outline-none placeholder:text-slate-400 focus:border-blue-500 dark:bg-slate-950/45"
                />
                <button type="submit" className="landing-primary-button min-h-0 px-3" aria-label="Subscribe">
                  <ArrowRight size={15} />
                </button>
              </form>
              {submitted && (
                <p className="mt-3 text-[11px] font-bold text-emerald-600 dark:text-emerald-300">
                  Thanks. You are on the list.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-[color:var(--landing-border)] pt-6 text-[11px] font-bold landing-soft-text sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} AK Technologies. All rights reserved.</span>
          <span>Made for businesses worldwide.</span>
        </div>
      </div>
    </footer>
  );
}
