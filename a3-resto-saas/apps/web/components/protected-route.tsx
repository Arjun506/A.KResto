'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/auth-context';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { token, isLoading } = useAuth();

  useEffect(() => {
    // Avoid redirect until client has initialized auth state.
    if (isLoading) return;

    if (!token) {
      router.replace('/login');
    }
  }, [token, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // If token is missing, redirect will happen; return null to avoid flashes.
  if (!token) return null;

  return children;
}
