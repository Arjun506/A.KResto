'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { usePathname } from 'next/navigation';

import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import type { DashboardLanguageCode } from '@/components/layout/dashboard-language';

const SIDEBAR_KEY = 'dashboard-sidebar-open';
const LANGUAGE_KEY = 'dashboard-language';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHeaderOpen, setIsHeaderOpen] = useState(true);
  const [language, setLanguage] = useState<DashboardLanguageCode>('en');

  const isKdsOrWaiter = pathname?.startsWith('/dashboard/kitchen') || pathname?.startsWith('/dashboard/waiter');


  useEffect(() => {
    const savedSidebar = localStorage.getItem(SIDEBAR_KEY);
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY) as DashboardLanguageCode | null;

    if (savedSidebar) {
      setIsSidebarOpen(savedSidebar === 'true');
    }
    if (savedLanguage) {
      setLanguage(savedLanguage);
      document.documentElement.lang = savedLanguage;
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((current) => {
      const next = !current;
      localStorage.setItem(SIDEBAR_KEY, String(next));
      return next;
    });
  };

  const changeLanguage = (nextLanguage: DashboardLanguageCode) => {
    setLanguage(nextLanguage);
    localStorage.setItem(LANGUAGE_KEY, nextLanguage);
    document.documentElement.lang = nextLanguage;
  };

  if (isKdsOrWaiter) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans overflow-x-hidden">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {isSidebarOpen && (
        <Sidebar
          language={language}
          onClose={() => {
            setIsSidebarOpen(false);
            localStorage.setItem(SIDEBAR_KEY, 'false');
          }}
        />
      )}
      <div className="flex-1 flex flex-col overflow-x-hidden relative">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          language={language}
          onLanguageChange={changeLanguage}
          onToggleSidebar={toggleSidebar}
          onHideHeader={() => setIsHeaderOpen(false)}
          className={isHeaderOpen ? '' : 'hidden'}
        />
        {!isHeaderOpen && (
          <div className="absolute top-2 right-6 z-50">
            <button
              onClick={() => setIsHeaderOpen(true)}
              className="p-2 bg-white/95 border border-slate-200 shadow-sm rounded-xl text-slate-500 hover:text-slate-800 transition active:scale-95 flex items-center gap-1.5 text-xs font-bold"
              title="Show Header"
            >
              <Eye size={16} />
              <span>Show Header</span>
            </button>
          </div>
        )}
        <main className="p-6 space-y-6">{children}</main>
      </div>
    </div>
  );
}
