"use client";

import { Heart, Star } from 'lucide-react';
import type { BusinessDiscoveryCard } from '@/src/types/customer-connect.types';
import { useMemo, useState } from 'react';

export default function BusinessCard({
  business,
  onQuickPreview,
}: {
  business: BusinessDiscoveryCard;
  onQuickPreview: (business: BusinessDiscoveryCard) => void;
}) {
  const [favorite, setFavorite] = useState(false);

  const subtitle = useMemo(() => {
    const parts: string[] = [];
    if (business.category) parts.push(business.category);
    if (typeof business.distanceKm === 'number') parts.push(`${business.distanceKm.toFixed(1)} km`);
    return parts.join(' • ');
  }, [business.category, business.distanceKm]);

  return (
    <article
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-[1px] shadow-[0_18px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl transition hover:-translate-y-1"
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        el.style.setProperty('--rx', `${(y - 0.5) * -8}deg`);
        el.style.setProperty('--ry', `${(x - 0.5) * 10}deg`);
      }}
      style={{
        transform:
          'perspective(800px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))',
      }}
    >
      <button
        className="absolute inset-0"
        onClick={() => onQuickPreview(business)}
        aria-label={`Quick preview ${business.name}`}
      />

      <div className="relative h-40 overflow-hidden rounded-[22px]">
        <div
          className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
          style={{
            backgroundImage: `url(${business.coverImageUrl || '/images/cover-fallback.png'})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {business.offers?.length ? (
          <div className="absolute left-3 top-3 rounded-2xl bg-white/10 px-3 py-1 text-xs font-black text-white backdrop-blur">
            {business.offers[0]?.discountPercentage ? `${business.offers[0].discountPercentage}% OFF` : 'Special offer'}
          </div>
        ) : null}
      </div>

      <div className="relative p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-black text-white">{business.name}</h3>
            <p className="mt-1 truncate text-xs font-semibold text-white/70">{subtitle || 'Premium discovery'}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFavorite((v) => !v);
            }}
            className="rounded-2xl border border-white/10 bg-white/5 p-2 text-white/80 transition hover:bg-white/10"
            aria-label={favorite ? 'Unfavorite' : 'Favorite'}
          >
            <Heart className={favorite ? 'fill-[#00ffcc] text-[#00ffcc]' : 'text-white/80'} size={16} />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
            <Star className="h-4 w-4 fill-[#ffc857] text-[#ffc857]" />
            <span className="text-xs font-black text-white">{business.rating.toFixed(1)}</span>
          </div>
          <div className="text-right">
            <p className="text-xs font-black text-white">{business.deliveryTimeMinutes ? `${business.deliveryTimeMinutes} min` : 'Fast'}</p>
            <p className="text-[11px] font-semibold text-white/60">{business.isOpen ? 'Open now' : 'Closed'}</p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/5" />
      </div>
    </article>
  );
}


