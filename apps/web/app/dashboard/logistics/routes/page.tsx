'use client';

import { useState, useEffect } from 'react';
import { Calendar, Navigation, RefreshCw, Truck } from 'lucide-react';
import api from '@/services/api';

interface Route {
  id: string;
  routeName: string;
  driverName: string;
  stopsCount: number;
  status: string;
}

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/logistics/routes');
      if (res.data?.success) {
        setRoutes(res.data.data);
      } else {
        throw new Error();
      }
    } catch {
      // Local fallback mock data (isolated)
      setRoutes([
        { id: 'rt_1', routeName: 'Indiranagar-Domlur Hub Loop', driverName: 'Sunil Kumar', stopsCount: 8, status: 'ACTIVE' },
        { id: 'rt_2', routeName: 'Whitefield Corridor Run', driverName: 'Rahul Dev', stopsCount: 12, status: 'COMPLETED' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchRoutes();
  }, []);

  return (
    <div className="space-y-6 text-left p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Active Driver Routes</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Track vehicle route sequences, hub stops counts, and dispatch timings.</p>
        </div>
        <button
          onClick={fetchRoutes}
          className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50 active:scale-95 transition"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Sync Routes
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((idx) => (
            <div key={idx} className="h-16 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-950 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-450">
              <tr>
                <th className="px-6 py-4">Route Name</th>
                <th className="px-6 py-4">Driver Assigned</th>
                <th className="px-6 py-4">Stops Sequence Count</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {routes.map((rt) => (
                <tr key={rt.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/50 transition">
                  <td className="px-6 py-4 font-bold text-slate-950 dark:text-white flex items-center gap-2">
                    <Navigation size={14} className="text-blue-500 animate-pulse" />
                    {rt.routeName}
                  </td>
                  <td className="px-6 py-4">{rt.driverName}</td>
                  <td className="px-6 py-4">{rt.stopsCount} stops</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">
                      {rt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
