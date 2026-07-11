"use client";

import { useMemo } from 'react';
import HeroSearch from './HeroSearch';
import QuickPreviewModal from './QuickPreviewModal';
import BusinessCard from './BusinessCard';
import type { BusinessDiscoveryCard } from '@/src/types/customer-connect.types';

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-white/60">{subtitle || 'Discover'}</p>
          <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">{title}</h2>
        </div>
        <div className="hidden text-sm font-semibold text-white/50 sm:block">Curated for you</div>
      </div>
      <div className="mt-4">
        {children}
      </div>
    </section>
  );
}

export default function CustomerShell({
  query,
  setQuery,
  onSearch,
  loading,
  suggestions,
  recentlyViewed,
  featured,
  trending,
  popular,
  onQuickPreview,
  quickPreview,
}: {
  query: string;
  setQuery: (v: string) => void;
  onSearch: () => void;
  loading?: boolean;
  suggestions?: string[];
  recentlyViewed: BusinessDiscoveryCard[];
  featured: BusinessDiscoveryCard[];
  trending: BusinessDiscoveryCard[];
  popular: BusinessDiscoveryCard[];
  onQuickPreview: (b: BusinessDiscoveryCard) => void;
  quickPreview: BusinessDiscoveryCard | null;
}) {
  const demoCategories = useMemo(() => ['Fine Dining', 'Modern Indian', 'Healthy Bowls', 'Bakery & Coffee', 'Street Classics'], []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#7c3aed]/20 blur-3xl" />
        <div className="absolute top-20 -left-24 h-[380px] w-[380px] rounded-full bg-[#00ffcc]/20 blur-3xl" />
        <div className="absolute top-60 -right-28 h-[420px] w-[420px] rounded-full bg-[#2563eb]/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(0,255,204,0.18),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(124,58,237,0.16),transparent_42%),radial-gradient(circle_at_50%_80%,rgba(37,99,235,0.14),transparent_45%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-8">
        <header className="flex flex-col items-center justify-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-widest text-white/70 backdrop-blur-2xl">
            <span className="h-2 w-2 rounded-full bg-[#00ffcc] shadow-[0_0_22px_rgba(0,255,204,0.6)]" />
            AK Connect • Business Discovery
          </p>

          <h1 className="mt-5 text-center text-4xl font-black leading-tight text-white sm:text-6xl">
            Smart Search & Premium Discovery
          </h1>
          <p className="mt-4 max-w-2xl text-center text-sm font-semibold text-white/60 sm:text-base">
            Nearby, trending, popular — curated with glass-crystal clarity.
          </p>

          <HeroSearch
            value={query}
            onChange={setQuery}
            onSearch={onSearch}
            loading={loading}
            suggestions={suggestions}
          />
        </header>

        {/* Categories */}
        <Section title="Categories" subtitle="Explore" >
          <div className="flex gap-2 overflow-x-auto pb-2">
            {demoCategories.map((c) => (
              <div
                key={c}
                className="shrink-0 rounded-3xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-white/80 backdrop-blur-2xl"
              >
                {c}
              </div>
            ))}
          </div>
        </Section>

        <Section title="Featured Businesses" subtitle="Luxury picks">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((b) => (
              <BusinessCard key={b.id} business={b} onQuickPreview={onQuickPreview} />
            ))}
          </div>
        </Section>

        <Section title="Trending" subtitle="Rising now">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trending.map((b) => (
              <BusinessCard key={b.id} business={b} onQuickPreview={onQuickPreview} />
            ))}
          </div>
        </Section>

        <Section title="Popular" subtitle="Top rated">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((b) => (
              <BusinessCard key={b.id} business={b} onQuickPreview={onQuickPreview} />
            ))}
          </div>
        </Section>

        <Section title="Recently Viewed" subtitle="For you">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentlyViewed.map((b) => (
              <BusinessCard key={b.id} business={b} onQuickPreview={onQuickPreview} />
            ))}
          </div>
        </Section>

        <footer className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-white/60">AK Connect</p>
              <p className="mt-1 text-sm font-semibold text-white/80">Premium discovery for every business.</p>
            </div>
            <div className="flex gap-3">
              {['Home', 'Explore', 'Deals', 'Favorites'].map((x) => (
                <div key={x} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-black text-white/70">
                  {x}
                </div>
              ))}
            </div>
          </div>
        </footer>
      </div>

      <QuickPreviewModal
        business={quickPreview}
        open={Boolean(quickPreview)}
        onClose={() => onQuickPreview((null as unknown) as any)}
      />
    </main>
  );
}

