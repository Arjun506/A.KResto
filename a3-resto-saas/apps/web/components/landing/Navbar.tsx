'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';
import ThemeToggle from '@/components/theme-toggle';

const navItems = [
  { label: 'Products', href: '#features-platform' },
  { label: 'Industries', href: '#industries' },
  { label: 'Features', href: '#features' },
  { label: 'Resources', href: '#faq' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Company', href: '#contact' }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 18);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header
      className={`landing-nav-bar fixed left-0 right-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled ? 'is-scrolled py-3' : 'py-5'
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="#hero" className="flex items-center gap-3" onClick={closeMobileMenu}>
          <span className="landing-logo-mark shrink-0">
            <span className="relative z-10 text-sm font-black tracking-tighter">AK</span>
          </span>
          <span className="leading-none">
            <span className="block text-sm font-black tracking-tight text-[color:var(--landing-text)] sm:text-base">
              AK Business OS
            </span>
            <span className="mt-1 hidden text-[9px] font-black uppercase tracking-[0.24em] landing-soft-text sm:block">
              One operating system
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[11px] font-black uppercase tracking-[0.12em] landing-muted transition-colors hover:text-[color:var(--landing-text)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Link href="/login" className="landing-secondary-button">
            Login
          </Link>
          <Link href="/onboarding" className="landing-primary-button">
            Start Free Trial
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="theme-toggle-button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mx-4 mt-3 rounded-2xl p-3 shadow-2xl landing-card-strong lg:hidden">
          <nav className="grid gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMobileMenu}
                className="rounded-xl px-4 py-3 text-sm font-extrabold landing-muted transition hover:bg-blue-500/10 hover:text-[color:var(--landing-text)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[color:var(--landing-border)] pt-3">
            <Link href="/login" onClick={closeMobileMenu} className="landing-secondary-button">
              Login
            </Link>
            <Link href="/onboarding" onClick={closeMobileMenu} className="landing-primary-button">
              Trial
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
