'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

export function useRoleBasedRedirect() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    // Redirect based on role
    const dashboardMap: Record<string, string> = {
      RESTAURANT_OWNER: '/dashboard',
      OWNER: '/dashboard',
      CASHIER: '/dashboard/billing',
      CHEF: '/dashboard/kitchen',
      WAITER: '/dashboard/waiter',
      SUPER_ADMIN: '/super-admin',
    };

    const targetDashboard = dashboardMap[user.role] || '/dashboard';
    const currentPath = window.location.pathname;

    // Only redirect if not already on a dashboard page
    if (currentPath === '/dashboard' || currentPath === '/') {
      if (currentPath !== targetDashboard) {
        router.replace(targetDashboard);
      }
    }
  }, [user, isLoading, router]);

  return { user, isLoading };
}

export function getRoleDashboard(role: string): string {
  const map: Record<string, string> = {
    RESTAURANT_OWNER: '/dashboard',
    OWNER: '/dashboard',
    CASHIER: '/dashboard/billing',
    CHEF: '/dashboard/kitchen',
    WAITER: '/dashboard/waiter',
    SUPER_ADMIN: '/super-admin',
  };
  return map[role] || '/dashboard';
}

