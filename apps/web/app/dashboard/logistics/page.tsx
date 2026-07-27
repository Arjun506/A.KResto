'use client';

import { useState, useEffect } from 'react';
import { Calendar, ClipboardList, Navigation, RefreshCw, Truck } from 'lucide-react';
import api from '@/services/api';

interface Shipment {
  id: string;
  trackingNumber: string;
  recipientName: string;
  origin: string;
  destination: string;
  status: string;
}

export default function LogisticsDashboardPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/logistics/shipments');
      if (res.data?.success) {
        setShipments(res.data.data);
      } else {
        throw new Error();
      }
    } catch {
      // Local fallback mock data (isolated)
      setShipments([
        { id: 'shp_1', trackingNumber: 'TRK-9824', recipientName: 'Vikram Singh', origin: 'Mumbai Hub A', destination: 'Koramangala, BLR', status: 'IN_TRANSIT' },
        { id: 'shp_2', trackingNumber: 'TRK-2415', recipientName: 'Neha Sen', origin: 'Whitefield Hub B', destination: 'Indiranagar, BLR', status: 'DELIVERED' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchShipments();
  }, []);

  return (
    <div className="space-y-6 text-left p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Logistics Dispatch Board</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Dispatch tracking, shipment routing operations, and delivery runs status.</p>
        </div>
        <button
          onClick={fetchShipments}
          className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50 active:scale-95 transition"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Sync Shipments
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
                <th className="px-6 py-4">Tracking #</th>
                <th className="px-6 py-4">Recipient</th>
                <th className="px-6 py-4">Origin</th>
                <th className="px-6 py-4">Destination</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {shipments.map((shp) => (
                <tr key={shp.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/50 transition">
                  <td className="px-6 py-4 font-bold text-slate-950 dark:text-white flex items-center gap-2">
                    <Truck size={14} className="text-blue-500" />
                    {shp.trackingNumber}
                  </td>
                  <td className="px-6 py-4">{shp.recipientName}</td>
                  <td className="px-6 py-4">{shp.origin}</td>
                  <td className="px-6 py-4">{shp.destination}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">
                      {shp.status}
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
