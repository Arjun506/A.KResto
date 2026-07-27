import { useState, useEffect } from 'react';
import { UserSession } from '@business-os/types';

export function useAuth() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check local session tokens
    setLoading(false);
  }, []);

  return { session, loading };
}
