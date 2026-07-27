'use client';

import { useEffect, useState } from 'react';
import { Eye, AlignLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import type { DashboardLanguageCode } from '@/components/layout/dashboard-language';
import { getBusinessSettings } from '@/services/business.service';
import CommandCenterModal from '@/components/command-center/CommandCenterModal';
import ProductTour from '@/components/workspace/ProductTour';
import HelpCenterDock from '@/components/workspace/HelpCenterDock';
import AIDock from '@/components/workspace/AIDock';
import NotificationDrawer from '@/components/workspace/NotificationDrawer';

const SIDEBAR_KEY = 'dashboard-sidebar-open';
const LANGUAGE_KEY = 'dashboard-language';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHeaderOpen, setIsHeaderOpen] = useState(true);
  const [language, setLanguage] = useState<DashboardLanguageCode>('en');
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false);

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

    const loadTheme = async () => {
      try {
        const settings = await getBusinessSettings();
        if (settings && settings.settings && settings.settings.theme) {
          const theme = settings.settings.theme.preset || 'glass-violet';
          document.documentElement.setAttribute('data-theme', theme);
        }
      } catch (err) {
        console.warn('Failed to load dynamic layout theme:', err);
      }
    };
    void loadTheme();

    // Listen for Ctrl+K global keyboard shortcut
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key?.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandCenterOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Listen for custom events to trigger docks
    const handleOpenCommandCenter = () => setIsCommandCenterOpen(true);
    window.addEventListener('open-command-center', handleOpenCommandCenter);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-center', handleOpenCommandCenter);
    };
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
        <CommandCenterModal
          isOpen={isCommandCenterOpen}
          onClose={() => setIsCommandCenterOpen(false)}
        />
        <ProductTour />
        <HelpCenterDock />
        <AIDock />
        <NotificationDrawer />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-background text-slate-900 dark:text-slate-100 font-sans transition-colors duration-500">
      
      {/* Dynamic sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="hidden lg:flex flex-col h-full overflow-hidden flex-shrink-0 border-r border-[#E7ECF5] dark:border-border"
          >
            <Sidebar
              language={language}
              onClose={() => {
                setIsSidebarOpen(false);
                localStorage.setItem(SIDEBAR_KEY, 'false');
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs" onClick={toggleSidebar} />
          <div className="relative z-10 w-60 h-full overflow-hidden">
            <Sidebar
              language={language}
              onClose={toggleSidebar}
            />
          </div>
        </div>
      )}

      {/* Main Content Layout Frame */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          language={language}
          onLanguageChange={changeLanguage}
          onToggleSidebar={toggleSidebar}
          onHideHeader={() => setIsHeaderOpen(false)}
          className={isHeaderOpen ? 'h-16 flex-shrink-0' : 'hidden'}
        />
        {!isHeaderOpen && (
          <div className="absolute top-3.5 right-6 z-50">
            <button
              onClick={() => setIsHeaderOpen(true)}
              className="px-3 py-1.5 bg-white/95 border border-slate-200/60 shadow-sm rounded-xl text-slate-600 hover:text-slate-900 transition flex items-center gap-1.5 text-xs font-bold"
              title="Show Header"
            >
              <Eye size={14} />
              <span>Show Top Navbar</span>
            </button>
          </div>
        )}
        
        {/* Child page body content */}
        <main className="flex-1 overflow-y-auto p-6 relative">
          {children}
        </main>
      </div>

      {/* CommandCenter modal dialog search */}
      <CommandCenterModal
        isOpen={isCommandCenterOpen}
        onClose={() => setIsCommandCenterOpen(false)}
      />

      {/* Overlay dock tools */}
      <ProductTour />
      <HelpCenterDock />
      <AIDock />
      <NotificationDrawer />

    </div>
  );
}

