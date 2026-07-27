'use client';

import { useRoleBasedRedirect } from '@/hooks/use-role-based-redirect';
import UniversalBusinessDashboard from '@/components/dashboard/UniversalBusinessDashboard';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading } = useRoleBasedRedirect();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-500 font-bold">
        <Loader2 className="w-8 h-8 animate-spin text-[#5850ec]" />
        <span>Loading your workspace dashboard...</span>
      </div>
    );
  }

  if (!user) {
    return null; // Will trigger router replace internally
  }

  return <UniversalBusinessDashboard />;
}

