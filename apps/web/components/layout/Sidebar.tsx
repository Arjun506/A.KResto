'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  UtensilsCrossed,
  Layers,
  QrCode,
  Users,
  Calendar,
  CreditCard,
  Gift,
  Package,
  ClipboardList,
  TrendingUp,
  UserCheck,
  CheckCircle,
  BarChart3,
  Star,
  Bell,
  Settings,
  Crown,
  X,
  LogOut,
  ChefHat,
  Clock,
  Plus,
  DollarSign,
  AlertTriangle,
  Award,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import type { DashboardLanguageCode } from '@/components/layout/dashboard-language';
import { getDashboardCopy } from '@/components/layout/dashboard-language';
import { getBusinessSettings } from '@/services/business.service';

type SidebarMenuItem = 
  | { type: 'header'; name: string }
  | { type: 'link'; name: string; href: string; icon: any; badge?: number; action?: () => void; feature?: string };

export default function Sidebar({
  language,
  onClose,
}: {
  language: DashboardLanguageCode;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const copy = getDashboardCopy(language);

  const [restaurantName, setRestaurantName] = useState('Spice Corner');
  const [restaurantPlan, setRestaurantPlan] = useState('Standard Trial');
  const [enabledFeatures, setEnabledFeatures] = useState<string[]>(['pos', 'inventory', 'staff', 'ai', 'crm']);
  const [favorites, setFavorites] = useState<{ name: string; href: string; icon: any }[]>([]);

  const role = user?.role || 'OWNER';

  const loadSettings = async () => {
    // Branch name load
    const savedName = localStorage.getItem('restaurantName');
    if (savedName) setRestaurantName(savedName);

    try {
      const settings = await getBusinessSettings();
      if (settings) {
        if (settings.name) setRestaurantName(settings.name);
        if (settings.industry) setRestaurantPlan(settings.industry);
        if (settings.tenant_features) {
          const activeFeatures = settings.tenant_features
            .filter((f: any) => f.isEnabled)
            .map((f: any) => f.featureKey);
          setEnabledFeatures(activeFeatures);
        }
      }
    } catch (err) {
      console.warn('Failed to load settings in sidebar, utilizing local cache fallback:', err);
    }
  };

  useEffect(() => {
    void loadSettings();

    // Listen for storage events to update workspace name in sync
    const handleStorage = () => {
      const savedName = localStorage.getItem('restaurantName');
      if (savedName) setRestaurantName(savedName);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('bwe-favorites');
    if (savedFavorites) {
      try {
        const favUrls = JSON.parse(savedFavorites) as string[];
        const matched: { name: string; href: string; icon: any }[] = [];
        
        const searchPool = [
          { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
          { name: 'Launch Center', href: '/dashboard/launch-center', icon: Award },
          { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
          { name: 'Menu Management', href: '/dashboard/menu', icon: UtensilsCrossed },
          { name: 'Table Management', href: '/dashboard/qr-tables', icon: Layers },
          { name: 'QR Code', href: '/dashboard/qr-tables', icon: QrCode },
          { name: 'Customers', href: '/dashboard/staff', icon: Users },
          { name: 'Reservations', href: '/dashboard/reservations', icon: Calendar },
          { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
          { name: 'Inventory / Stock', href: '/dashboard/inventory', icon: Package },
          { name: 'Reports & Analytics', href: '/dashboard/analytics', icon: BarChart3 },
          { name: 'Growth Platform', href: '/dashboard/growth', icon: TrendingUp },
          { name: 'Finance Center', href: '/dashboard/finance', icon: DollarSign },
          { name: 'Staff Management', href: '/dashboard/staff', icon: UserCheck },
          { name: 'Ops Center', href: '/dashboard/restaurant-operations', icon: ChefHat },
          { name: 'App Store', href: '/dashboard/app-store', icon: ShoppingBag },
          { name: 'Settings', href: '/dashboard/pos', icon: Settings },
          { name: 'Subscription', href: '/dashboard/billing', icon: CreditCard }
        ];

        favUrls.forEach(url => {
          const match = searchPool.find(item => item.href === url);
          if (match) {
            matched.push(match);
          }
        });
        setFavorites(matched);
      } catch (e) {
        console.error(e);
      }
    } else {
      setFavorites([]);
    }
  }, [pathname]);

  const handleLogoutClick = () => {
    logout();
    router.push('/login');
  };

  // Build dynamic menu items lists based on active user role and active modular feature keys
  const menuItems: SidebarMenuItem[] = (() => {
    switch (role) {
      case 'WAITER':
        return [
          { type: 'link', name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
          { type: 'header', name: 'Services' },
          { type: 'link', name: 'My Tables', href: '/dashboard/waiter', icon: Layers, badge: 6, feature: 'pos' },
          { type: 'link', name: 'Orders to Serve', href: '/dashboard/waiter', icon: ShoppingCart, badge: 5, feature: 'pos' },
          { type: 'link', name: 'Table Requests', href: '/dashboard/waiter', icon: Bell, badge: 3, feature: 'pos' },
          { type: 'link', name: 'Call Chef / Counter', href: '/dashboard/waiter', icon: ChefHat, feature: 'pos' },
          { type: 'link', name: 'Service History', href: '/dashboard/orders', icon: ClipboardList, feature: 'pos' },
          { type: 'header', name: 'Operations' },
          { type: 'link', name: 'Dine In', href: '/dashboard/qr-tables', icon: Layers, feature: 'pos' },
          { type: 'link', name: 'Takeaway', href: '/dashboard/pos', icon: UtensilsCrossed, feature: 'pos' },
          { type: 'link', name: 'Delivery', href: '/dashboard/pos', icon: ShoppingCart, feature: 'pos' },
          { type: 'header', name: 'Other' },
          { type: 'link', name: 'Tips / Earnings', href: '/dashboard/waiter', icon: TrendingUp },
          { type: 'link', name: 'Notifications', href: '/dashboard/notifications', icon: Bell, badge: 4 },
          { type: 'link', name: 'Settings', href: '/dashboard/pos', icon: Settings },
          { type: 'link', name: 'Log Out', href: '#logout', icon: LogOut, action: handleLogoutClick }
        ];
      case 'CASHIER':
        return [
          { type: 'link', name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
          { type: 'link', name: 'Shop / Mall POS', href: '/dashboard/shop', icon: Layers, feature: 'pos' },
          { type: 'link', name: 'New Order (F1)', href: '/dashboard/pos', icon: Plus, feature: 'pos' },
          { type: 'link', name: 'Orders (F2)', href: '/dashboard/orders', icon: ShoppingCart, feature: 'pos' },
          { type: 'link', name: 'Dine In', href: '/dashboard/qr-tables', icon: Layers, feature: 'pos' },
          { type: 'link', name: 'Takeaway', href: '/dashboard/pos', icon: UtensilsCrossed, feature: 'pos' },
          { type: 'link', name: 'Delivery', href: '/dashboard/pos', icon: ShoppingCart, feature: 'pos' },
          { type: 'link', name: 'Reservations', href: '/dashboard/reservations', icon: Calendar, feature: 'crm' },
          { type: 'link', name: 'Payments', href: '/dashboard/payments', icon: CreditCard, feature: 'pos' },
          { type: 'link', name: 'Order History', href: '/dashboard/orders', icon: ClipboardList, feature: 'pos' },
          { type: 'header', name: 'Manage' },
          { type: 'link', name: 'Menu', href: '/dashboard/menu', icon: UtensilsCrossed, feature: 'pos' },
          { type: 'link', name: 'Customers', href: '/dashboard/staff', icon: Users, feature: 'crm' },
          { type: 'header', name: 'Others' },
          { type: 'link', name: 'Reports', href: '/dashboard/analytics', icon: BarChart3, feature: 'analytics' },
          { type: 'link', name: 'Kitchen Display', href: '/dashboard/kitchen', icon: ChefHat, feature: 'pos' },
          { type: 'link', name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
          { type: 'header', name: 'Settings' },
          { type: 'link', name: 'Settings', href: '/dashboard/pos', icon: Settings }
        ];
      case 'CHEF':
        return [
          { type: 'link', name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
          { type: 'header', name: 'Orders' },
          { type: 'link', name: 'New Orders', href: '/dashboard/kitchen', icon: Bell, badge: 8, feature: 'pos' },
          { type: 'link', name: 'Preparing', href: '/dashboard/kitchen', icon: Clock, badge: 15, feature: 'pos' },
          { type: 'link', name: 'Ready to Serve', href: '/dashboard/kitchen', icon: ChefHat, badge: 11, feature: 'pos' },
          { type: 'link', name: 'Completed', href: '/dashboard/orders', icon: CheckCircle, feature: 'pos' },
          { type: 'header', name: 'Kitchen' },
          { type: 'link', name: 'Kitchen Display', href: '/dashboard/kitchen', icon: LayoutDashboard, feature: 'pos' },
          { type: 'link', name: 'Recipe & Items', href: '/dashboard/menu', icon: UtensilsCrossed, feature: 'pos' },
          { type: 'link', name: 'Stock & Inventory', href: '/dashboard/inventory', icon: Package, feature: 'inventory' },
          { type: 'link', name: 'Low Stock Alert', href: '/dashboard/inventory', icon: AlertTriangle, badge: 6, feature: 'inventory' },
          { type: 'header', name: 'Manage' },
          { type: 'link', name: 'Reports', href: '/dashboard/analytics', icon: BarChart3, feature: 'analytics' },
          { type: 'link', name: 'Staff Management', href: '/dashboard/staff', icon: UserCheck, feature: 'staff' },
          { type: 'link', name: 'Kitchen Settings', href: '/dashboard/pos', icon: Settings }
        ];
      case 'OWNER':
      case 'SUPER_ADMIN':
      default:
        return [
          { type: 'link', name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
          { type: 'link', name: 'Launch Center', href: '/dashboard/launch-center', icon: Award },
          { type: 'link', name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart, feature: 'pos' },
          { type: 'link', name: 'Menu Management', href: '/dashboard/menu', icon: UtensilsCrossed, feature: 'pos' },
          { type: 'link', name: 'Table Management', href: '/dashboard/qr-tables', icon: Layers, feature: 'pos' },
          { type: 'link', name: 'Customers', href: '/dashboard/staff', icon: Users, feature: 'crm' },
          { type: 'link', name: 'Reservations', href: '/dashboard/reservations', icon: Calendar, feature: 'crm' },
          { type: 'link', name: 'Payments & Refunds', href: '/dashboard/payments', icon: CreditCard, feature: 'pos' },
          { type: 'link', name: 'Finance Center', href: '/dashboard/finance', icon: DollarSign, feature: 'pos' },
          { type: 'link', name: 'Inventory / Stock', href: '/dashboard/inventory', icon: Package, feature: 'inventory' },
          { type: 'link', name: 'Expenses', href: '/dashboard/pos', icon: TrendingUp, feature: 'pos' },
          { type: 'link', name: 'Staff Management', href: '/dashboard/staff', icon: UserCheck, feature: 'staff' },
          { type: 'link', name: 'Reports & Analytics', href: '/dashboard/analytics', icon: BarChart3, feature: 'ai' },
          { type: 'link', name: 'App Store', href: '/dashboard/app-store', icon: ShoppingBag },
          { type: 'link', name: 'Settings', href: '/dashboard/pos', icon: Settings },
          { type: 'link', name: 'Subscription', href: '/dashboard/billing', icon: CreditCard }
        ];
    }
  })();

  const subtext = (() => {
    switch (role) {
      case 'WAITER': return 'Waiter Panel';
      case 'CASHIER': return 'Billing Counter';
      case 'CHEF': return 'Kitchen Dashboard';
      case 'OWNER':
      case 'SUPER_ADMIN':
      default: return 'Business Owner';
    }
  })();

  const profileInfo = (() => {
    switch (role) {
      case 'WAITER': return { name: 'Ravi Verma', role: 'Waiter', email: 'waiter@akresto.com' };
      case 'CASHIER': return { name: 'Amit Kumar', role: 'Cashier', email: 'billing@akresto.com' };
      case 'CHEF': return { name: 'Chef Raj', role: 'Head Chef', email: 'chef@akresto.com' };
      case 'OWNER':
      case 'SUPER_ADMIN':
      default: return { name: 'Rohit Sharma', role: 'Owner', email: user?.email || 'owner@akresto.com' };
    }
  })();

  // Filter dynamic list based on enabled branch features list
  const filteredMenuItems = menuItems.filter(item => {
    if (item.type !== 'link' || !item.feature) return true;
    return enabledFeatures.includes(item.feature);
  });

  return (
    <aside className="w-60 border-r border-slate-200/50 dark:border-white/5 bg-slate-900/90 dark:bg-slate-950/70 text-slate-200 min-h-screen p-4 flex flex-col justify-between flex-shrink-0 select-none backdrop-blur-lg">
      <div className="flex flex-col">
        
        {/* LOGO & BRAND */}
        <div className="flex items-center justify-between gap-3 mb-6 px-1 py-2 border-b border-white/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-650 flex items-center justify-center text-white text-md flex-shrink-0 shadow-md">
              🏢
            </div>
            <div className="min-w-0 text-left">
              <h1 className="text-sm font-black tracking-tight leading-none text-white truncate">{restaurantName}</h1>
              <span className="text-[9px] text-blue-400 font-bold uppercase tracking-wider mt-1 block">{subtext}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition active:scale-95 lg:hidden"
            title="Hide sidebar"
          >
            <X size={14} />
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="space-y-1 max-h-[64vh] overflow-y-auto pr-1 scrollbar-none text-left">
          {favorites.length > 0 && (
            <div className="space-y-1 mb-4">
              <div className="px-2.5 pt-2 pb-1 text-[8px] font-black uppercase tracking-widest text-slate-500">
                Favorites
              </div>
              {favorites.map((item, idx) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={idx}
                    href={item.href}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={14} className={isActive ? 'text-blue-400' : 'text-slate-500'} />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="space-y-1">
            {favorites.length > 0 && (
              <div className="px-2.5 pt-2 pb-1 text-[8px] font-black uppercase tracking-widest text-slate-500">
                Core Console
              </div>
            )}
            {filteredMenuItems.map((item, index) => {
              if (item.type === 'header') {
                return (
                  <div key={index} className="px-2.5 pt-3.5 pb-1 text-[8px] font-black uppercase tracking-widest text-slate-500">
                    {item.name}
                  </div>
                );
              }

              const Icon = item.icon;
              const isActive = pathname === item.href;

              if (item.action) {
                return (
                  <button
                    key={index}
                    onClick={item.action}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition border border-transparent text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={14} className="text-slate-500" />
                      <span>{item.name}</span>
                    </div>
                  </button>
                );
              }

              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition duration-150 border ${
                    isActive
                      ? 'bg-blue-600/10 border-blue-500/30 text-blue-400 shadow-sm'
                      : 'border-transparent text-slate-405 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={14} className={isActive ? 'text-blue-400' : 'text-slate-500'} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

      </div>

      {/* PLAN & FOOTER */}
      <div className="mt-4 space-y-4">
        
        {/* LICENSE LEVEL CARD */}
        {(role === 'OWNER' || role === 'SUPER_ADMIN') && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-left">
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-yellow-500/15 text-yellow-500">
                <Crown size={14} />
              </span>
              <div>
                <h3 className="font-black text-[10px] text-white uppercase tracking-wider">{restaurantPlan}</h3>
                <p className="text-[8px] text-slate-500 font-bold mt-0.5">Sandbox Active</p>
              </div>
            </div>
            <button 
              onClick={() => router.push('/dashboard/billing')}
              className="w-full py-1.5 rounded-lg bg-blue-600 text-white text-[9px] font-black uppercase tracking-wider hover:opacity-95 transition"
            >
              Upgrade Plan
            </button>
          </div>
        )}

        {/* PROFILE CARD */}
        <div className="border-t border-white/10 pt-3 flex items-center justify-between text-left">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-400 to-indigo-500 flex items-center justify-center text-white text-[10px] font-black relative flex-shrink-0">
              {profileInfo.name.split(' ').map(n => n[0]).join('')}
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border border-slate-900 rounded-full animate-pulse" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-white truncate leading-none">{profileInfo.name}</p>
              <span className="text-[9px] text-slate-500 font-semibold mt-1 block leading-none">{profileInfo.role}</span>
            </div>
          </div>
          
          <button
            onClick={handleLogoutClick}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-white/5 transition"
            title="Log Out"
          >
            <LogOut size={13} />
          </button>
        </div>

      </div>

    </aside>
  );
}
