'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useTheme } from 'next-themes';
import {
  ArrowLeft,
  Bell,
  MessageSquare,
  Globe,
  ChevronDown,
  AlignLeft,
  Settings,
  LogOut,
  EyeOff,
  Search,
  Sparkles,
  HelpCircle,
  Sun,
  Moon,
  Building,
  Plus
} from 'lucide-react';
import {
  dashboardLanguages,
  getDashboardCopy,
  type DashboardLanguageCode,
} from '@/components/layout/dashboard-language';

export default function Navbar({
  isSidebarOpen,
  language,
  onLanguageChange,
  onToggleSidebar,
  onHideHeader,
  className,
}: {
  isSidebarOpen: boolean;
  language: DashboardLanguageCode;
  onLanguageChange: (language: DashboardLanguageCode) => void;
  onToggleSidebar: () => void;
  onHideHeader?: () => void;
  className?: string;
}) {
  const { token, logout } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const copy = getDashboardCopy(language);

  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userEmail, setUserEmail] = useState('owner@akresto.com');
  const [userRole, setUserRole] = useState('Owner');
  const [restaurantName, setRestaurantName] = useState('Spice Corner');

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New order #ORD1265 placed for Table 5', time: '2 mins ago' },
    { id: 2, title: 'Stock Alert: Tomato is running low', time: '10 mins ago' },
    { id: 3, title: 'Table 7 requested billing counter service', time: '15 mins ago' }
  ]);

  useEffect(() => {
    const savedName = localStorage.getItem('restaurantName');
    if (savedName) setRestaurantName(savedName);

    if (token) {
      try {
        const base64Url = token.split('.')[1];
        if (base64Url) {
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            window.atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          const payload = JSON.parse(jsonPayload);
          if (payload) {
            if (payload.email) setUserEmail(payload.email);
            if (payload.role) {
              const roleName = payload.role.replace('RESTAURANT_', '').toLowerCase();
              setUserRole(roleName.charAt(0).toUpperCase() + roleName.slice(1));
            }
          }
        }
      } catch (e) {
        console.error('Failed to decode token:', e);
      }
    }
  }, [token]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleSelectWorkspace = (name: string) => {
    setRestaurantName(name);
    localStorage.setItem('restaurantName', name);
    setShowWorkspaceMenu(false);
    // Reload page slightly to sync sidebar state
    window.dispatchEvent(new Event('storage'));
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className={`h-16 border-b border-slate-200/50 dark:border-white/5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md flex items-center justify-between px-6 select-none flex-shrink-0 relative z-30 ${className || ''}`}>
      
      {/* LEFT: Toggle, Back, and Workspace Switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 transition active:scale-95"
          title="Go back"
        >
          <ArrowLeft size={16} />
        </button>
        <button
          onClick={onToggleSidebar}
          className={`p-2 rounded-xl transition active:scale-95 ${
            isSidebarOpen
              ? 'text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800'
              : 'bg-blue-600/10 text-blue-600 dark:bg-cyan-500/15 dark:text-cyan-400'
          }`}
          title={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        >
          <AlignLeft size={16} />
        </button>
        {onHideHeader && (
          <button
            onClick={onHideHeader}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 transition active:scale-95"
            title="Hide Header"
          >
            <EyeOff size={16} />
          </button>
        )}

        <div className="h-6 w-[1px] bg-slate-200 dark:bg-white/10 hidden sm:block mx-1" />

        {/* WORKSPACE SWITCHER DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            className="flex items-center gap-2 px-3 py-1.5 border border-slate-200/65 dark:border-white/5 rounded-xl bg-white/20 dark:bg-slate-900/20 hover:bg-slate-50 dark:hover:bg-slate-950/20 cursor-pointer transition text-xs font-black text-slate-850 dark:text-slate-200"
          >
            <Building size={13} className="text-blue-500 dark:text-cyan-400" />
            <span className="truncate max-w-[120px]">{restaurantName}</span>
            <ChevronDown size={12} className="text-slate-400" />
          </button>

          {showWorkspaceMenu && (
            <div className="absolute left-0 top-11 w-64 bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/5 rounded-2xl shadow-xl z-50 py-2.5">
              <div className="px-4 pb-2 border-b border-slate-200/50 dark:border-white/5 mb-1.5">
                <span className="text-[9px] font-black text-slate-450 uppercase tracking-widest">Active Workspace</span>
              </div>
              <div className="space-y-0.5">
                {[
                  'A.K Resto Indiranagar',
                  'AK Retail Koramangala',
                  'AK Salon & Spa HSR'
                ].map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handleSelectWorkspace(name)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-xs font-black transition ${
                      restaurantName === name
                        ? 'bg-blue-600/10 text-blue-600 dark:bg-cyan-500/15 dark:text-cyan-400'
                        : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900/40'
                    }`}
                  >
                    <span>{name}</span>
                    {restaurantName === name && <Check size={11} />}
                  </button>
                ))}
              </div>
              <div className="border-t border-slate-200/50 dark:border-white/5 mt-2.5 pt-2 px-1">
                <button
                  onClick={() => { setShowWorkspaceMenu(false); router.push('/onboarding'); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-black text-blue-600 dark:text-cyan-400 hover:bg-blue-650/5 dark:hover:bg-cyan-550/5 transition"
                >
                  <Plus size={13} />
                  Create Workspace
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CENTER: Search Trigger */}
      <div className="hidden md:block flex-1 max-w-[320px] mx-4">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-command-center'))}
          className="w-full flex items-center justify-between px-4 py-2 border border-slate-200/65 dark:border-white/5 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-950/30 transition text-xs font-semibold cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search size={13} />
            <span>Search Workspace...</span>
          </div>
          <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/5 text-[9px] font-mono text-slate-400">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* RIGHT: Notifications, Theme Switcher, and Profile */}
      <div className="flex items-center gap-4.5">
        
        {/* Language dropdown */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 border border-slate-200/65 dark:border-white/5 rounded-xl bg-white/10 hover:bg-slate-50 dark:hover:bg-slate-900/10 cursor-pointer transition text-xs font-bold text-slate-800 dark:text-slate-350"
          >
            <Globe size={13} className="text-slate-400" />
            <span>{dashboardLanguages.find((item) => item.code === language)?.nativeName || 'English'}</span>
            <ChevronDown size={11} className="text-slate-400" />
          </button>

          {showLanguageMenu && (
            <div className="absolute right-0 top-11 w-48 bg-white dark:bg-[#11131c] border border-slate-200 dark:border-white/5 rounded-2xl shadow-xl z-50 py-2">
              {dashboardLanguages.map((item) => (
                <button
                  key={item.code}
                  onClick={() => {
                    onLanguageChange(item.code);
                    setShowLanguageMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-xs font-black transition ${
                    language === item.code
                      ? 'bg-blue-600/10 text-blue-600 dark:bg-cyan-500/15 dark:text-cyan-400'
                      : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900/40'
                  }`}
                >
                  <span>{item.nativeName}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Widgets */}
        <div className="flex items-center gap-2">
          
          {/* Help Center */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-help-center'))}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 transition cursor-pointer"
            title="Help Support"
          >
            <HelpCircle size={17} />
          </button>

          {/* AI Dock */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-ai-dock'))}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-blue-605 dark:text-cyan-400 transition cursor-pointer"
            title="AI Co-pilot"
          >
            <Sparkles size={17} className="animate-pulse" />
          </button>

          {/* Notification bell */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-notification-drawer'))}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 transition relative cursor-pointer"
            title="Notifications"
          >
            <Bell size={17} />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[7px] font-black border border-white dark:border-slate-900">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 transition cursor-pointer"
            title="Toggle theme mode"
          >
            <Sun size={17} className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon size={17} className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-cyan-400" />
          </button>

        </div>

        <div className="h-6 w-[1px] bg-slate-200 dark:bg-white/10" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition select-none cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-650 flex items-center justify-center text-white text-xs font-black uppercase">
              {userEmail.slice(0, 2)}
            </div>
            <ChevronDown size={11} className="text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-11 w-52 bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/5 rounded-2xl shadow-xl z-50 py-2">
              <div className="px-4 py-2 border-b border-slate-200/50 dark:border-white/5 mb-1 text-left flex flex-col">
                <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Logged in:</span>
                <span className="text-xs font-black text-slate-950 dark:text-white truncate mt-0.5">{userEmail}</span>
              </div>
              <button
                onClick={() => { setShowProfileMenu(false); router.push('/dashboard/restaurant-operations'); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-left text-xs font-black text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/40"
              >
                <Settings size={13} className="text-slate-450" />
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-left text-xs font-black text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
              >
                <LogOut size={13} className="text-rose-500" />
                Sign Out
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}
