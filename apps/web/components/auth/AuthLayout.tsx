'use client';

import React from 'react';
import AuthBackground from './AuthBackground';
import AuthDashboardPreview from './AuthDashboardPreview';
import ThemeToggle from '@/components/theme-toggle';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen relative w-full overflow-hidden flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
      {/* 60fps Aurora Mesh background */}
      <AuthBackground />

      {/* Floating Header Actions (Theme Toggle) */}
      <div className="absolute top-6 right-6 z-30">
        <div className="p-1 rounded-xl bg-white/20 dark:bg-slate-900/40 border border-white/20 dark:border-white/5 backdrop-blur-md shadow-md">
          <ThemeToggle />
        </div>
      </div>

      {/* Split Layout Card Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-stretch">
        
        {/* LEFT COLUMN: Animated Dashboard (Columns: 5 of 12) */}
        <div className="hidden md:block md:col-span-5 lg:col-span-5 rounded-3xl glass-premium border border-white/30 dark:border-white/5 bg-white/10 dark:bg-[#0f172a]/30 backdrop-blur-xl shadow-2xl overflow-hidden min-h-[660px]">
          <AuthDashboardPreview />
        </div>

        {/* RIGHT COLUMN: Auth forms (Columns: 7 of 12) */}
        <div className="col-span-1 md:col-span-7 lg:col-span-7 flex items-center justify-center">
          <div className="w-full max-w-[480px] rounded-3xl glass-premium border border-slate-200/50 dark:border-white/5 bg-white/50 dark:bg-[#020617]/55 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 md:p-10 relative overflow-hidden transition-all duration-300">
            {/* Gloss glare overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
            
            {/* Form content */}
            <div className="relative z-10 w-full">
              {children}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

