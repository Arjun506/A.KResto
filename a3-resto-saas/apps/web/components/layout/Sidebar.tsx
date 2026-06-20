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
  AlertTriangle,
  Award
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import type { DashboardLanguageCode } from '@/components/layout/dashboard-language';
import { getDashboardCopy } from '@/components/layout/dashboard-language';

type SidebarMenuItem = 
  | { type: 'header'; name: string }
  | { type: 'link'; name: string; href: string; icon: any; badge?: number; action?: () => void };

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
  const [restaurantPlan, setRestaurantPlan] = useState('Professional');

  const role = user?.role || 'OWNER';

  useEffect(() => {
    const savedName = localStorage.getItem('restaurantName');
    if (savedName) {
      setRestaurantName(savedName);
    }
    const savedPlan = localStorage.getItem('restaurantPlan') || 'Professional';
    setRestaurantPlan(savedPlan);

    const handleStorageChange = () => {
      const updatedName = localStorage.getItem('restaurantName');
      if (updatedName) {
        setRestaurantName(updatedName);
      }
      const updatedPlan = localStorage.getItem('restaurantPlan') || 'Professional';
      setRestaurantPlan(updatedPlan);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogoutClick = () => {
    logout();
    router.push('/login');
  };

  // Build dynamic menus based on user role
  const menuItems: SidebarMenuItem[] = (() => {
    switch (role) {
      case 'WAITER':
        return [
          { type: 'link', name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
          { type: 'header', name: 'Services' },
          { type: 'link', name: 'My Tables', href: '/dashboard/waiter', icon: Layers, badge: 6 },
          { type: 'link', name: 'Orders to Serve', href: '/dashboard/waiter', icon: ShoppingCart, badge: 5 },
          { type: 'link', name: 'Table Requests', href: '/dashboard/waiter', icon: Bell, badge: 3 },
          { type: 'link', name: 'Call Chef / Counter', href: '/dashboard/waiter', icon: ChefHat },
          { type: 'link', name: 'Service History', href: '/dashboard/orders', icon: ClipboardList },
          { type: 'header', name: 'Operations' },
          { type: 'link', name: 'Dine In', href: '/dashboard/qr-tables', icon: Layers },
          { type: 'link', name: 'Takeaway', href: '/dashboard/pos', icon: UtensilsCrossed },
          { type: 'link', name: 'Delivery', href: '/dashboard/pos', icon: ShoppingCart },
          { type: 'header', name: 'Other' },
          { type: 'link', name: 'Tips / Earnings', href: '/dashboard/waiter', icon: TrendingUp },
          { type: 'link', name: 'Notifications', href: '/dashboard/notifications', icon: Bell, badge: 4 },
          { type: 'link', name: 'Feedback', href: '/dashboard/waiter', icon: Star },
          { type: 'link', name: 'Settings', href: '/dashboard/pos', icon: Settings },
          { type: 'link', name: 'Log Out', href: '#logout', icon: LogOut, action: handleLogoutClick }
        ];
      case 'CASHIER':
        return [
          { type: 'link', name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
          { type: 'link', name: 'New Order (F1)', href: '/dashboard/pos', icon: Plus },
          { type: 'link', name: 'Orders (F2)', href: '/dashboard/orders', icon: ShoppingCart },
          { type: 'link', name: 'Dine In', href: '/dashboard/qr-tables', icon: Layers },
          { type: 'link', name: 'Takeaway', href: '/dashboard/pos', icon: UtensilsCrossed },
          { type: 'link', name: 'Delivery', href: '/dashboard/pos', icon: ShoppingCart },
          { type: 'link', name: 'Reservations', href: '/dashboard/reservations', icon: Calendar },
          { type: 'link', name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
          { type: 'link', name: 'Order History', href: '/dashboard/orders', icon: ClipboardList },
          { type: 'link', name: 'Refunds', href: '/dashboard/payments', icon: TrendingUp },
          { type: 'header', name: 'Manage' },
          { type: 'link', name: 'Menu', href: '/dashboard/menu', icon: UtensilsCrossed },
          { type: 'link', name: 'Customers', href: '/dashboard/staff', icon: Users },
          { type: 'link', name: 'Offers & Coupons', href: '/dashboard/menu', icon: Gift },
          { type: 'header', name: 'Others' },
          { type: 'link', name: 'Reports', href: '/dashboard/analytics', icon: BarChart3 },
          { type: 'link', name: 'Kitchen Display', href: '/dashboard/kitchen', icon: ChefHat },
          { type: 'link', name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
          { type: 'header', name: 'Settings' },
          { type: 'link', name: 'Settings', href: '/dashboard/pos', icon: Settings },
          { type: 'link', name: 'Printers', href: '/dashboard/pos', icon: ClipboardList }
        ];
      case 'CHEF':
        return [
          { type: 'link', name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
          { type: 'header', name: 'Orders' },
          { type: 'link', name: 'New Orders', href: '/dashboard/kitchen', icon: Bell, badge: 8 },
          { type: 'link', name: 'Preparing', href: '/dashboard/kitchen', icon: Clock, badge: 15 },
          { type: 'link', name: 'Ready to Serve', href: '/dashboard/kitchen', icon: ChefHat, badge: 11 },
          { type: 'link', name: 'Completed', href: '/dashboard/orders', icon: CheckCircle },
          { type: 'link', name: 'Cancelled', href: '/dashboard/orders', icon: X },
          { type: 'header', name: 'Kitchen' },
          { type: 'link', name: 'Preparation Time', href: '/dashboard/kitchen', icon: Clock },
          { type: 'link', name: 'Kitchen Display', href: '/dashboard/kitchen', icon: LayoutDashboard },
          { type: 'link', name: 'Recipe & Items', href: '/dashboard/menu', icon: UtensilsCrossed },
          { type: 'link', name: 'Stock & Inventory', href: '/dashboard/inventory', icon: Package },
          { type: 'link', name: 'Low Stock Alert', href: '/dashboard/inventory', icon: AlertTriangle, badge: 6 },
          { type: 'header', name: 'Manage' },
          { type: 'link', name: 'Reports', href: '/dashboard/analytics', icon: BarChart3 },
          { type: 'link', name: 'Staff Management', href: '/dashboard/staff', icon: UserCheck },
          { type: 'link', name: 'Kitchen Settings', href: '/dashboard/pos', icon: Settings }
        ];
      case 'OWNER':
      case 'SUPER_ADMIN':
      default:
        return [
          { type: 'link', name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
          { type: 'link', name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
          { type: 'link', name: 'Menu Management', href: '/dashboard/menu', icon: UtensilsCrossed },
          { type: 'link', name: 'Table Management', href: '/dashboard/qr-tables', icon: Layers },
          { type: 'link', name: 'QR Code', href: '/dashboard/qr-tables', icon: QrCode },
          { type: 'link', name: 'Customers', href: '/dashboard/staff', icon: Users },
          { type: 'link', name: 'Reservations', href: '/dashboard/reservations', icon: Calendar },
          { type: 'link', name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
          { type: 'link', name: 'Offers & Coupons', href: '/dashboard/menu', icon: Gift },
          { type: 'link', name: 'Inventory / Stock', href: '/dashboard/inventory', icon: Package },
          { type: 'link', name: 'Purchase Management', href: '/dashboard/inventory', icon: ClipboardList },
          { type: 'link', name: 'Expenses', href: '/dashboard/pos', icon: TrendingUp },
          { type: 'link', name: 'Staff Management', href: '/dashboard/staff', icon: UserCheck },
          { type: 'link', name: 'Attendance', href: '/dashboard/pos', icon: CheckCircle },
          { type: 'link', name: 'Reports & Analytics', href: '/dashboard/analytics', icon: BarChart3 },
          { type: 'link', name: 'Feedback & Reviews', href: '/dashboard/waiter', icon: Star },
          { type: 'link', name: 'Loyalty & Rewards', href: '/dashboard/pos', icon: Award },
          { type: 'link', name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
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
      default: return 'Restaurant Admin';
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

  // Updated menu mapping matching user's sidebar request
  const sidebarGroups = (() => {
    if (role === 'OWNER' || role === 'SUPER_ADMIN') {
      return [
        {
          label: '',
          items: [
            { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
          ]
        },
        {
          label: 'Orders',
          items: [
            { name: 'All Orders', href: '/dashboard/orders', icon: ShoppingCart, badge: 12 },
            { name: 'Kitchen Order Tickets', href: '/dashboard/kitchen', icon: ChefHat },
          ]
        },
        {
          label: 'Management',
          items: [
            { name: 'Menu Management', href: '/dashboard/menu', icon: UtensilsCrossed },
            { name: 'Table Management', href: '/dashboard/qr-tables', icon: Layers },
            { name: 'QR Code', href: '/dashboard/qr-tables', icon: QrCode },
            { name: 'Customers & Loyalty', href: '/dashboard/customers', icon: Users },
            { name: 'Reservations', href: '/dashboard/reservations', icon: Calendar },
            { name: 'Payments & Billing', href: '/dashboard/payments', icon: CreditCard },
          ]
        },
        {
          label: 'Operations',
          items: [
            { name: 'Inventory / Stock', href: '/dashboard/inventory', icon: Package, badge: 3 },
            { name: 'Staff Management', href: '/dashboard/staff', icon: UserCheck },
          ]
        },
        {
          label: 'Analytics',
          items: [
            { name: 'Reports & Analytics', href: '/dashboard/analytics', icon: BarChart3 },
          ]
        },
        {
          label: 'More',
          items: [
            { name: 'Notifications', href: '/dashboard/notifications', icon: Bell, badge: 8 },
            { name: 'Subscription', href: '/dashboard/billing', icon: Crown },
          ]
        }
      ];
    }

    // Fallback simple list for other roles mapped to groups
    return [
      {
        label: 'Navigation',
        items: menuItems.filter(item => item.type === 'link').map(item => ({
          name: item.name,
          href: item.href,
          icon: item.icon,
          badge: item.badge,
          action: item.action
        }))
      }
    ];
  })();

  return (
    <aside className="w-60 bg-[#1E1B4B] text-slate-200 min-h-screen p-4 flex flex-col justify-between border-r border-[#2D2A5E] flex-shrink-0 select-none">
      <div className="flex flex-col">
        {/* LOGO */}
        <div className="flex items-center justify-between gap-3 mb-6 px-1 py-2 border-b border-white/8">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center text-lg flex-shrink-0 shadow-md">
              🍛
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-black tracking-tight leading-none text-white truncate">{restaurantName}</h1>
              <span className="text-[9px] text-[#818CF8] font-bold uppercase tracking-wider mt-1 block">{subtext}</span>
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
        <nav className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 scrollbar-none">
          {sidebarGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {group.label && (
                <div className="px-2 pt-2 pb-1 text-[9px] font-black uppercase tracking-wider text-white/30">
                  {group.label}
                </div>
              )}
              {group.items.map((item: any, index: number) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                if (item.action) {
                  return (
                    <button
                      key={index}
                      onClick={item.action}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold text-white/60 hover:text-white hover:bg-white/8 transition-all duration-150 text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={14} className="text-white/50" />
                        <span>{item.name}</span>
                      </div>
                    </button>
                  );
                }

                return (
                  <Link
                    key={index}
                    href={item.href}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150
                    ${
                      isActive
                        ? 'bg-[#4F46E5] text-white shadow-md shadow-[#4F46E5]/20'
                        : 'text-white/60 hover:text-white hover:bg-white/8'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={14} className={isActive ? 'text-white' : 'text-white/50'} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-red-500/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* PLAN & PROFILE */}
      <div className="mt-4 space-y-4">
        {/* CURRENT PLAN */}
        {(role === 'OWNER' || role === 'SUPER_ADMIN') && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 relative overflow-hidden">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Crown size={14} />
              </div>
              <div>
                <h3 className="font-bold text-[10px] text-white capitalize">{restaurantPlan} Plan</h3>
                <p className="text-[8px] text-white/40 font-bold">Expires: 30 Dec 2024</p>
              </div>
            </div>
            <button className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-[9px] py-1.5 rounded-lg font-bold transition-all active:scale-95">
              Manage Plan
            </button>
          </div>
        )}

        {/* PROFILE CARD */}
        <div className="border-t border-white/10 pt-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-rose-400 to-indigo-500 flex items-center justify-center text-white text-xs font-black relative flex-shrink-0">
              {profileInfo.name.split(' ').map(n => n[0]).join('')}
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border border-[#1E1B4B] rounded-full" />
            </div>
            <div className="min-w-0 text-left">
              <p className="text-xs font-bold text-white truncate leading-none">{profileInfo.name}</p>
              <span className="text-[9px] text-white/40 font-semibold mt-1 block leading-none">{profileInfo.role}</span>
            </div>
          </div>
          
          <button
            onClick={handleLogoutClick}
            className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition"
            title="Log Out"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
}

