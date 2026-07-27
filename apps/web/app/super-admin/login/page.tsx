'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SuperAdminLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login?portal=super-admin');
  }, [router]);

  return (
    <main className="min-h-screen grid place-items-center bg-slate-950 text-white text-sm font-bold">
      Opening super admin login...
    </main>
  );
}

