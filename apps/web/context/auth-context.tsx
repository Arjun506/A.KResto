'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type UserRole = 'OWNER' | 'CASHIER' | 'CHEF' | 'WAITER' | 'SUPER_ADMIN';

interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  restaurantId?: string;
}

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'token';

// Helper to decode JWT token
function decodeToken(token: string): AuthUser | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    );

    return {
      id: decoded.sub || decoded.id || '',
      email: decoded.email || '',
      role: (decoded.role || 'WAITER') as UserRole,
      restaurantId: decoded.restaurantId,
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
    const nextToken = localStorage.getItem(TOKEN_KEY);
    // Avoid the cascading-renders lint rule by deferring state updates.
    queueMicrotask(() => {
      setToken(nextToken);
      if (nextToken) {
        const decodedUser = decodeToken(nextToken);
        setUser(decodedUser);
      }
      setIsLoading(false);
    });
  }, []);










  const login = useCallback((nextToken: string) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    setToken(nextToken);
    const decodedUser = decodeToken(nextToken);
    setUser(decodedUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isLoading,
      login,
      logout,
    }),
    [token, user, isLoading, login, logout],
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



