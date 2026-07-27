'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useAuth } from './auth-context';
import api from '../services/api';

interface EntitlementContextValue {
  activePacks: string[];
  entitlements: Record<string, any>;
  isLoading: boolean;
  hasEntitlement: (key: string) => boolean;
  hasPack: (packName: string) => boolean;
  refreshEntitlements: () => Promise<void>;
}

const EntitlementContext = createContext<EntitlementContextValue | undefined>(undefined);

export function EntitlementProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [activePacks, setActivePacks] = useState<string[]>([]);
  const [entitlements, setEntitlements] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  const refreshEntitlements = async () => {
    if (!user) {
      setActivePacks([]);
      setEntitlements({});
      setIsLoading(false);
      return;
    }

    try {
      // 1. Fetch active industry packs from platform engine
      const packsRes = await api.get('/platform-packs/active');
      if (packsRes.data?.success) {
        setActivePacks(packsRes.data.data.map((p: any) => p.name.toUpperCase()));
      } else {
        // Fallback based on onboarding industry mapping
        setActivePacks([user.tenantId ? 'RESTAURANT' : '']);
      }

      // 2. Fetch current SaaS commerce entitlements
      const entitlementsRes = await api.get('/saas/entitlements');
      if (entitlementsRes.data?.success) {
        setEntitlements(entitlementsRes.data.data);
      }
    } catch (err) {
      console.warn('Failed to load active packages or entitlements, fallback to tenant profile context');
      // Set baseline default pack context
      setActivePacks(['RESTAURANT']);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refreshEntitlements();
  }, [user]);

  const hasEntitlement = (key: string): boolean => {
    if (!entitlements || Object.keys(entitlements).length === 0) return true; // Default fallback for dev ease
    return !!entitlements[key];
  };

  const hasPack = (packName: string): boolean => {
    return activePacks.includes(packName.toUpperCase());
  };

  const value = useMemo<EntitlementContextValue>(() => ({
    activePacks,
    entitlements,
    isLoading,
    hasEntitlement,
    hasPack,
    refreshEntitlements,
  }), [activePacks, entitlements, isLoading]);

  return (
    <EntitlementContext.Provider value={value}>
      {children}
    </EntitlementContext.Provider>
  );
}

export function useEntitlement() {
  const context = useContext(EntitlementContext);
  if (!context) {
    throw new Error('useEntitlement must be used within an EntitlementProvider');
  }
  return context;
}
