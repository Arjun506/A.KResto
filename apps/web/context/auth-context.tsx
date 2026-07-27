'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type UserRole =
  | 'SUPER_ADMIN'
  | 'RESTAURANT_OWNER'
  | 'OWNER'
  | 'MANAGER'
  | 'CASHIER'
  | 'WAITER'
  | 'CHEF'
  | 'CUSTOMER';

interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  tenantId?: string;
}

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  login: (token: string, rememberMe?: boolean) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'token';

// Helper to decode JWT token safely
function decodeToken(token: string): AuthUser | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    );

    // Map legacy roles like OWNER to RESTAURANT_OWNER if needed
    let role = (decoded.role || 'WAITER') as UserRole;
    if (role === 'OWNER') {
      role = 'RESTAURANT_OWNER';
    }

    return {
      id: decoded.sub || decoded.id || '',
      email: decoded.email || '',
      role,
      tenantId: decoded.tenantId,
    };
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state once on the client.
  useEffect(() => {
    // Check both local storage and session storage
    const nextToken =
      localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    
    queueMicrotask(() => {
      setToken(nextToken);
      if (nextToken) {
        const decodedUser = decodeToken(nextToken);
        setUser(decodedUser);
      }
      setIsLoading(false);
    });
  }, []);

  const login = useCallback((nextToken: string, rememberMe: boolean = false) => {
    if (rememberMe) {
      localStorage.setItem(TOKEN_KEY, nextToken);
      sessionStorage.removeItem(TOKEN_KEY);
    } else {
      sessionStorage.setItem(TOKEN_KEY, nextToken);
      localStorage.removeItem(TOKEN_KEY);
    }
    
    setToken(nextToken);
    const decodedUser = decodeToken(nextToken);
    setUser(decodedUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!user) return false;
    const role = user.role;
    
    // Super admins and owners override all checks
    if (['SUPER_ADMIN', 'RESTAURANT_OWNER', 'OWNER', 'MANAGER'].includes(role)) {
      return true;
    }
    
    // Define the client-side permission lookup table corresponding to business.constants.ts
    const rolePermissions: Record<string, string[]> = {
      CASHIER: ['pos:read', 'pos:write', 'payments:read', 'payments:write', 'orders:read', 'orders:write', 'tables:read'],
      WAITER: ['tables:read', 'orders:read', 'orders:write'],
      CHEF: ['kitchen:read', 'kitchen:write', 'inventory:read'],
    };
    
    const permissions = rolePermissions[role] || [];
    return permissions.includes(permission);
  }, [user]);

  const hasAnyRole = useCallback((roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isLoading,
      login,
      logout,
      hasPermission,
      hasAnyRole,
    }),
    [token, user, isLoading, login, logout, hasPermission, hasAnyRole],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

