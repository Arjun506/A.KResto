'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { ArrowLeft, Bell, MessageSquare, Globe, ChevronDown, AlignLeft, X, Settings, LogOut, EyeOff } from 'lucide-react';
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
  const router = useRouter();
  const copy = getDashboardCopy(language);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [userEmail, setUserEmail] = useState('owner@restobill.com');
  const [userRole, setUserRole] = useState('Owner');
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [isPreBookingEnabled, setIsPreBookingEnabled] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New order #ORD1265 placed for Table 5', time: '2 mins ago' },
    { id: 2, title: 'Stock Alert: Tomato is running low', time: '10 mins ago' },
    { id: 3, title: 'Table 7 requested billing counter service', time: '15 mins ago' },
    { id: 4, title: 'Payment received for order #ORD1254', time: '20 mins ago' },
  ]);

  useEffect(() => {
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
            if (payload.restaurantId) {
              setRestaurantId(payload.restaurantId);
            }
          }
        }
      } catch (e) {
        console.error('Failed to decode token:', e);
      }
    }
  }, [token]);

  useEffect(() => {
    if (!restaurantId) return;
    try {
      const storedFeatures = localStorage.getItem('tenant_custom_features');
      if (storedFeatures) {
        const parsed = JSON.parse(storedFeatures);
        const features = parsed[restaurantId];
        if (features) {
          setIsPreBookingEnabled(features.preTableBooking === true);
          return;
        }
      }
      const plan = localStorage.getItem('restaurantPlan') || 'Starter';
      setIsPreBookingEnabled(plan !== 'Starter');
    } catch (e) {
      console.error(e);
      setIsPreBookingEnabled(false);
    }
  }, [restaurantId]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className={`h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 select-none flex-shrink-0 relative ${className || ''}`}>
      
      {/* LEFT MENU ICON */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-slate-50 rounded-xl text-slate-500 transition active:scale-95"
          title="Go back"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={onToggleSidebar}
          className={`p-2 rounded-xl transition active:scale-95 ${
            isSidebarOpen
              ? 'text-slate-300 hover:bg-slate-50 hover:text-slate-500'
              : 'bg-[#4F46E5]/15 text-[#4F46E5] hover:bg-[#4F46E5]/25'
          }`}
          title={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        >
          <AlignLeft size={18} />
        </button>
        {onHideHeader && (
          <button
            onClick={onHideHeader}
            className="p-2 hover:bg-slate-50 rounded-xl text-slate-500 transition active:scale-95"
            title="Hide Header"
          >
            <EyeOff size={18} />
          </button>
        )}
      </div>

      {/* PRE-BOOKINGS FEATURE HEADER OPTION */}
      <div className="flex items-center gap-2">
        {isPreBookingEnabled ? (
          <button
            onClick={() => router.push('/dashboard/reservations')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-black rounded-xl border border-emerald-100 hover:bg-emerald-100 transition active:scale-95 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Pre-Bookings Active</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-500 text-xs font-black rounded-xl border border-slate-200">
            <span>🔒 Pre-Bookings Locked</span>
            <button
              onClick={() => router.push('/dashboard/billing')}
              className="text-[10px] text-indigo-650 hover:text-[#5850ec] ml-1.5 underline cursor-pointer font-bold"
            >
              Upgrade
            </button>
          </div>
        )}
      </div>

      {/* RIGHT CONTROLS */}
      <div className="flex items-center gap-6">
        
        {/* LANGUAGE SELECTOR */}
        <div className="relative">
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition text-xs font-bold text-slate-700"
          >
            <Globe size={14} className="text-slate-400" />
            <span>{dashboardLanguages.find((item) => item.code === language)?.nativeName || 'English'}</span>
            <ChevronDown size={12} className="text-slate-400" />
          </button>

          {showLanguageMenu && (
            <div className="absolute right-0 top-11 w-72 max-h-96 overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2">
              <div className="px-4 pb-2 border-b border-slate-100">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-black">{copy.language}</p>
              </div>
              <div className="grid grid-cols-1 py-1">
                {dashboardLanguages.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      onLanguageChange(item.code);
                      setShowLanguageMenu(false);
                    }}
                    className={`flex items-center justify-between px-4 py-2.5 text-left text-xs font-black transition ${
                      language === item.code
                        ? 'bg-[#BFDEF3]/50 text-[#1e3a8a]'
                        : 'text-slate-650 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{item.nativeName}</span>
                    <span className="text-[10px] text-slate-400">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* NOTIFICATIONS & CHAT */}
        <div className="flex items-center gap-3">
          
          {/* BELL */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-slate-50 rounded-xl text-slate-500 transition active:scale-95 relative"
            >
              <Bell size={18} />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[8px] font-black leading-none border border-white">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-3 overflow-hidden">
                <div className="px-4 pb-2 border-b border-slate-100 flex justify-between items-center">
                  <span className="font-black text-sm text-slate-900">{copy.notifications}</span>
                  <button
                    onClick={() => setNotifications([])}
                    className="text-[11px] font-black text-[#8b5cf6] hover:text-purple-700"
                  >
                    {copy.clearAll}
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-xs font-bold text-slate-400">
                      {copy.noAlerts}
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="px-4 py-3 hover:bg-slate-50 transition text-left flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <p className="text-xs font-black text-slate-800 leading-normal">{n.title}</p>
                          <span className="text-[10px] text-slate-400 font-bold mt-1 block">{n.time}</span>
                        </div>
                        <button
                          onClick={() => setNotifications(notifications.filter(x => x.id !== n.id))}
                          className="text-slate-400 hover:text-slate-600 self-start p-1"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* CHAT */}
          <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-500 transition active:scale-95 relative">
            <MessageSquare size={18} />
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[8px] font-black leading-none border border-white">
              3
            </span>
          </button>

        </div>

        {/* VENDOR PROFILE */}
        <div className="h-8 w-[1px] bg-slate-100" />

        <div className="relative">
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50/50 p-1 rounded-xl transition select-none"
          >
            <div className="w-9 h-9 rounded-full bg-slate-150 border border-slate-200 overflow-hidden relative">
              <div className="w-full h-full bg-gradient-to-tr from-rose-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold font-sans">
                {userEmail.substring(0, 2).toUpperCase()}
              </div>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-black text-slate-800 leading-none">{userEmail.split('@')[0]}</p>
              <p className="text-[9px] text-zinc-400 font-bold mt-1 leading-none">{userRole}</p>
            </div>
            <ChevronDown size={12} className="text-slate-400 group-hover:translate-y-0.5 transition-transform" />
          </div>

          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2.5 overflow-hidden text-sm font-black text-slate-700">
              <div className="px-4 py-2 border-b border-slate-100 flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{copy.loggedInId}</span>
                <span className="text-xs text-slate-900 truncate font-black mt-0.5">{userEmail}</span>
              </div>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  router.push('/dashboard/pos'); // Settings route
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 transition text-left mt-1"
              >
                <Settings size={14} className="text-slate-400" />
                <span>{copy.systemSettings}</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-rose-50 text-rose-600 transition text-left"
              >
                <LogOut size={14} className="text-rose-500" />
                <span>{copy.signOut}</span>
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}
