'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTA() {
  return (
    <section className="relative overflow-hidden border-t border-[color:var(--landing-border)] px-4 py-20 sm:px-6 lg:px-8">
      <div className="hero-video-layer opacity-60" aria-hidden="true" />
      <div className="scroll-reveal relative z-10 mx-auto max-w-5xl rounded-[1.6rem] p-8 text-center landing-card-strong sm:p-12">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">
          <Sparkles size={12} />
          Launch your tenant workspace
        </div>
        <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-black leading-tight tracking-tight text-[color:var(--landing-text)] sm:text-5xl">
          Ready to Build the Future of Your Business?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm font-semibold leading-7 landing-muted">
          Start with a clean workspace, connect your team, and turn daily operations into measurable growth.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/onboarding" className="landing-primary-button">
            Start Free Trial
            <ArrowRight size={15} />
          </Link>
          <Link href="#pricing" className="landing-secondary-button">
            Book Live Demo
          </Link>
        </div>
      </div>
    </section>
  );
}

