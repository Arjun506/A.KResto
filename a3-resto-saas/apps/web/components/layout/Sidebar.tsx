'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Award,
  Bell,
  Settings,
  Crown
} from 'lucide-react';

const menu = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
  { name: 'Menu Management', href: '/dashboard/menu', icon: UtensilsCrossed },
  { name: 'Table Management', href: '/dashboard/qr-tables', icon: Layers },
  { name: 'QR Code', href: '/dashboard/qr-tables', icon: QrCode },
  { name: 'Customers', href: '/dashboard/staff', icon: Users },
  { name: 'Reservations', href: '/dashboard/reservations', icon: Calendar },
  { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
  { name: 'Offers & Coupons', href: '/dashboard/menu', icon: Gift },
  { name: 'Inventory / Stock', href: '/dashboard/inventory', icon: Package },
  { name: 'Purchase Management', href: '/dashboard/inventory', icon: ClipboardList },
  { name: 'Expenses', href: '/dashboard/pos', icon: TrendingUp },
  { name: 'Staff Management', href: '/dashboard/staff', icon: UserCheck },
  { name: 'Attendance', href: '/dashboard/pos', icon: CheckCircle },
  { name: 'Reports & Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Feedback & Reviews', href: '/dashboard/waiter', icon: Star },
  { name: 'Loyalty & Rewards', href: '/dashboard/pos', icon: Award },
  { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { name: 'Settings', href: '/dashboard/pos', icon: Settings },
  { name: 'Subscription', href: '/dashboard/billing', icon: CreditCard },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [restaurantName, setRestaurantName] = useState('A.K Resto');

  useEffect(() => {
    const saved = localStorage.getItem('restaurantName');
    if (saved) {
      setRestaurantName(saved);
    }

    const handleStorageChange = () => {
      const updated = localStorage.getItem('restaurantName');
      if (updated) {
        setRestaurantName(updated);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <aside className="w-64 bg-gradient-to-b from-[#E0B7F4]/20 via-[#BFDEF3]/25 to-[#B9E9E9]/25 text-slate-800 min-h-screen p-5 flex flex-col justify-between border-r border-[#E0B7F4]/20 flex-shrink-0 select-none">
      <div className="flex flex-col">
        {/* LOGO */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <img src="/ak-resto-logo.png" alt="A.K Resto Logo" className="w-9 h-9 object-contain rounded-xl shadow-sm" />
          <div>
            <h1 className="text-sm font-black tracking-tight leading-none text-slate-900">{restaurantName}</h1>
            <span className="text-[9px] text-[#8b5cf6] font-black uppercase tracking-wider mt-1 block">Admin Panel</span>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="space-y-1 max-h-[70vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-purple-200/50 scrollbar-track-transparent">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-black transition-all duration-150
                ${
                  isActive
                    ? 'bg-[#BFDEF3] text-[#1e3a8a] shadow-sm shadow-[#BFDEF3]/50'
                    : 'text-slate-650 hover:text-slate-900 hover:bg-purple-500/5'
                }`}
              >
                <Icon size={15} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* PLAN CARD */}
      <div className="mt-6 pt-4 border-t border-slate-200/60">
        <div className="bg-white/80 border border-[#BFDEF3] rounded-2xl p-4 relative overflow-hidden shadow-sm">
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-gradient-to-tr from-yellow-500/5 to-orange-500/5 rounded-full blur-xl" />
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Crown size={15} />
            </div>
            <div>
              <h3 className="font-extrabold text-[11px] text-slate-900">Professional Plan</h3>
              <p className="text-[8px] text-slate-500 font-extrabold mt-0.5">Valid till : 30 Dec 2026</p>
            </div>
          </div>
          <button className="w-full bg-[#B9E9E9] hover:bg-[#a5dbdb] text-[#0f766e] text-[9px] py-2.5 rounded-xl font-black border border-[#B9E9E9]/20 active:scale-95 transition-all">
            Manage Plan
          </button>
        </div>
      </div>
    </aside>
  );
}
