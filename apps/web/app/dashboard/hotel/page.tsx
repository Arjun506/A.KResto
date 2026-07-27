'use client';

import { useState, useEffect } from 'react';
import { Layers, Calendar, Home, RefreshCw, Key, ShieldAlert } from 'lucide-react';
import api from '@/services/api';

interface Room {
  id: string;
  roomNumber: string;
  type: string;
  status: 'VACANT' | 'OCCUPIED' | 'DIRTY' | 'MAINTENANCE';
  floor: number;
}

export default function HotelDashboardPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/hotel/rooms');
      if (res.data?.success) {
        setRooms(res.data.data);
      } else {
        throw new Error('API reported failure state');
      }
    } catch (err: any) {
      setError('Could not fetch active room statuses. Utilizing offline fallback dataset.');
      // Local production-fallback: Explicitly marked as fallback demo data
      setRooms([
        { id: '101', roomNumber: '101', type: 'Deluxe Suite', status: 'OCCUPIED', floor: 1 },
        { id: '102', roomNumber: '102', type: 'Double Standard', status: 'VACANT', floor: 1 },
        { id: '103', roomNumber: '103', type: 'Single Deluxe', status: 'DIRTY', floor: 1 },
        { id: '201', roomNumber: '201', type: 'Presidential Suite', status: 'MAINTENANCE', floor: 2 },
        { id: '202', roomNumber: '202', type: 'Deluxe Suite', status: 'VACANT', floor: 2 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchRooms();
  }, []);

  const getStatusColor = (status: Room['status']) => {
    switch (status) {
      case 'VACANT': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'OCCUPIED': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'DIRTY': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'MAINTENANCE': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
    }
  };

  return (
    <div className="space-y-6 text-left p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Hotel Operational Console</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Real-time room occupancy states, reservations, and guest check-ins.</p>
        </div>
        <button
          onClick={fetchRooms}
          className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50 active:scale-95 transition"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Sync Registry
        </button>
      </div>

      {error && (
        <div className="flex gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-600 dark:text-amber-400">
          <ShieldAlert size={16} className="shrink-0" />
          <div>{error}</div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((idx) => (
            <div key={idx} className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Home size={18} />
            Room Occupancy Grid
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="p-4 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex flex-col justify-between h-32 transition hover:shadow-md"
              >
                <div className="flex justify-between items-start">
                  <span className="text-lg font-black text-slate-900 dark:text-white">#{room.roomNumber}</span>
                  <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider border rounded-full ${getStatusColor(room.status)}`}>
                    {room.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{room.type}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Floor {room.floor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
