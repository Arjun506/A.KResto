import type { Metadata } from 'next';

import './globals.css';

import { ThemeProvider } from '@/components/providers/theme-provider';

import { AuthProvider } from '@/context/auth-context';
import { NotificationProvider } from '@/context/notification-context';

export const metadata: Metadata = {
  title: 'A.K Resto',
  description:
    'Smart Restaurant Solutions ERP Platform',
  manifest: '/manifest.webmanifest',
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
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </AuthProvider>

        </ThemeProvider>

      </body>

    </html>
  );
}
