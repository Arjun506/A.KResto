import Sidebar from '@/components/layout/Sidebar';

import Navbar from '@/components/layout/Navbar';

import ProtectedRoute from '@/components/protected-route';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-x-hidden">
          <Navbar />
          <main className="p-6 space-y-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}