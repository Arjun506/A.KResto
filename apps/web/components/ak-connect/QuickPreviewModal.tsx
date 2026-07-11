"use client";

import { X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { BusinessDiscoveryCard } from '@/src/types/customer-connect.types';

export default function QuickPreviewModal({
  business,
  open,
  onClose,
}: {
  business: BusinessDiscoveryCard | null;
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open || !business) return null;


  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute inset-x-0 top-6 mx-auto w-[min(720px,92vw)]">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-[1px] shadow-[0_30px_140px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
          <div className="rounded-3xl bg-[#0b1220]/70 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-white/70">
                  Quick preview
                </p>
                <h2 className="mt-1 text-2xl font-black text-white">{business.name}</h2>
                <p className="mt-2 text-sm font-semibold text-white/70">
                  {business.category || 'Premium discovery'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-2xl border border-white/10 bg-white/5 p-2 text-white/80 transition hover:bg-white/10"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_240px]">
              <div className="relative overflow-hidden rounded-2xl border border-white/10">
                <div
                  className="h-56 w-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${business.coverImageUrl || '/images/cover-fallback.png'})`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-black uppercase text-white/60">Rating</p>
                <p className="mt-1 text-3xl font-black text-white">
                  {business.rating.toFixed(1)}
                </p>
                <p className="mt-1 text-xs font-semibold text-white/60">
                  {business.reviewsCount.toLocaleString()} reviews
                </p>

                <div className="mt-4 space-y-2 text-sm font-semibold">
                  <div className="flex items-center justify-between text-white/80">
                    <span>Distance</span>
                    <span className="text-white">{typeof business.distanceKm === 'number' ? `${business.distanceKm.toFixed(1)} km` : '—'}</span>
                  </div>
                  <div className="flex items-center justify-between text-white/80">
                    <span>ETA</span>
                    <span className="text-white">{business.deliveryTimeMinutes ? `${business.deliveryTimeMinutes} min` : '—'}</span>
                  </div>
                  <div className="flex items-center justify-between text-white/80">
                    <span>Status</span>
                    <span className="text-white">{business.isOpen ? 'Open' : 'Closed'}</span>
                  </div>
                </div>

                {business.offers?.length ? (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs font-black uppercase text-white/60">Offers</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {business.offers[0].title}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-white/60">
                      {business.offers[0].description || 'Limited time'}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={onClose}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-white/90 transition hover:bg-white/10"
              >
                Back
              </button>
              <a
                href={`/online-ordering?restaurant=${business.slug}`}
                onClick={onClose}
                className="rounded-2xl bg-[#00ffcc] px-4 py-3 text-sm font-black text-[#06120f] transition hover:brightness-110"
              >
                Explore
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

