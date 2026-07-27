'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RestaurantLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login?portal=restaurant');
  }, [router]);

  return (
    <main className="min-h-screen grid place-items-center bg-slate-950 text-white text-sm font-bold">
      Opening restaurant login...
    </main>
  );
}

