import type { Metadata } from 'next';

import './globals.css';

import { ThemeProvider } from '@/components/providers/theme-provider';

import { AuthProvider } from '@/context/auth-context';
import { EntitlementProvider } from '@/context/entitlement-context';
import { NotificationProvider } from '@/context/notification-context';
import { LandingStateProvider } from '@/context/landing-state';

export const metadata: Metadata = {
  title: 'AK Business OS | One Platform for Every Business',
  description:
    'Run restaurant, retail, hotel, salon, healthcare, warehouse, manufacturing, and service operations from one intelligent business operating system.',
  keywords: [
    'business operating system',
    'restaurant software',
    'retail POS',
    'hotel management software',
    'inventory management',
    'AI business dashboard',
    'SaaS business platform'
  ],
  manifest: '/manifest.json',
  openGraph: {
    title: 'AK Business OS',
    description:
      'One platform for every business: dashboard, POS, inventory, customer app, marketplace, analytics, and AI automation.',
    type: 'website'
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(reg) { console.log('SW registered:', reg.scope); },
                    function(err) { console.log('SW failed:', err); }
                  );
                });
              }
            `
          }}
        />
      </head>

      <body className="min-h-full flex flex-col bg-gray-100">

        <ThemeProvider>

          <AuthProvider>
            <EntitlementProvider>
              <NotificationProvider>
                <LandingStateProvider>
                  {children}
                </LandingStateProvider>
              </NotificationProvider>
            </EntitlementProvider>
          </AuthProvider>

        </ThemeProvider>

      </body>

    </html>
  );
}

