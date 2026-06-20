'use client';

import { useAuth } from '@/context/auth-context';
import OwnerDashboard from '@/components/dashboard/OwnerDashboard';
import CashierDashboard from '@/components/dashboard/CashierDashboard';
import WaiterDashboard from '@/components/dashboard/WaiterDashboard';
import ChefDashboard from '@/components/dashboard/ChefDashboard';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-500 font-bold">
        <Loader2 className="w-8 h-8 animate-spin text-[#5850ec]" />
        <span>Loading your workspace dashboard...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-rose-500 font-bold">
        Authentication Error. Please sign in again.
      </div>
    );
  }

  // Route layouts dynamically based on user role
  switch (user.role) {
    case 'OWNER':
    case 'SUPER_ADMIN':
      return <OwnerDashboard />;
    case 'CASHIER':
      return <CashierDashboard />;
    case 'WAITER':
      return <WaiterDashboard />;
    case 'CHEF':
      return <ChefDashboard />;
    default:
      return <OwnerDashboard />;
  }
}
