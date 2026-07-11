'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Calendar as CalendarIcon,
  List,
  Users,
  Clock,
  Plus,
  Search,
  Filter,
  Check,
  X,
  Phone,
  UserPlus,
  Coffee,
  AlertCircle,
  MessageSquare,
  Sparkles,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

import {
  createReservation,
  getReservations,
  getTableAvailability,
  updateReservationStatus,
} from '@/services/reservation.service';
import type {
  Reservation,
  ReservationStatus,
  TableAvailability,
} from '@/src/types/reservation.types';

const statusFlow: ReservationStatus[] = [
  'PENDING',
  'CONFIRMED',
  'SEATED',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW',
];

interface WaitlistItem {
  id: string;
  customerName: string;
  customerPhone: string;
  guestCount: number;
  addedAt: string;
  notes?: string;
  status: 'waiting' | 'notified' | 'seated' | 'cancelled';
  vip?: boolean;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<TableAvailability[]>([]);
  const [activeView, setActiveView] = useState<'list' | 'calendar' | 'waitlist'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  
  // Waitlist local state
  const [waitlist, setWaitlist] = useState<WaitlistItem[]>([
    {
      id: 'w1',
      customerName: 'Marcus Aurelius',
      customerPhone: '+1 (555) 019-2831',
      guestCount: 4,
      addedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 mins ago
      status: 'waiting',
      notes: 'Prefers outdoor seating',
      vip: true,
    },
    {
      id: 'w2',
      customerName: 'Sarah Jenkins',
      customerPhone: '+1 (555) 012-9844',
      guestCount: 2,
      addedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 mins ago
      status: 'notified',
      notes: 'Celebrating birthday',
      vip: false,
    },
    {
      id: 'w3',
      customerName: 'David Kim',
      customerPhone: '+1 (555) 021-3948',
      guestCount: 6,
      addedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      status: 'waiting',
      notes: 'Needs high chair for kids',
      vip: false,
    }
  ]);

  const [waitlistForm, setWaitlistForm] = useState({
    customerName: '',
    customerPhone: '',
    guestCount: '2',
    notes: '',
    vip: false,
  });

  const [form, setForm] = useState({
    tableId: '',
    customerName: '',
    customerPhone: '',
    guestCount: '2',
    reservationAt: new Date().toISOString().slice(0, 16),
    notes: '',
    isVip: false,
  });
  
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const calendar = useMemo(() => {
    return reservations.reduce<Record<string, Reservation[]>>((groups, item) => {
      const day = new Date(item.reservationAt).toLocaleDateString();
      groups[day] = [...(groups[day] ?? []), item];
      return groups;
    }, {});
  }, [reservations]);

  const loadReservations = async () => {
    try {
      const nextReservations = await getReservations();
      setReservations(nextReservations);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailability = useCallback(async () => {
    try {
      const nextTables = await getTableAvailability(
        new Date(form.reservationAt).toISOString(),
      );
      setTables(nextTables);
      if (!form.tableId) {
        const firstAvailable = nextTables.find((table) => table.isAvailable);
        if (firstAvailable) {
          setForm((current) => ({ ...current, tableId: firstAvailable.id }));
        }
      }
    } catch (error) {
      console.error(error);
      setTables([]);
    }
  }, [form.reservationAt, form.tableId]);

  useEffect(() => {
    void (async () => {
      await loadReservations();
    })();
  }, []);

  useEffect(() => {
    void (async () => {
      await loadAvailability();
    })();
  }, [loadAvailability]);

  const submitReservation = async () => {
    if (!form.tableId || !form.customerName || !form.reservationAt) {
      triggerToast('Please fill out all required reservation fields.');
      return;
    }

    try {
      await createReservation({
        tableId: form.tableId,
        customerName: form.customerName,
        customerPhone: form.customerPhone || undefined,
        guestCount: Number(form.guestCount),
        reservationAt: new Date(form.reservationAt).toISOString(),
        notes: form.notes || undefined,
      });

      triggerToast(`Successfully booked table for ${form.customerName}!`);
      setForm((current) => ({
        ...current,
        customerName: '',
        customerPhone: '',
        notes: '',
        isVip: false,
      }));
      await loadReservations();
      await loadAvailability();
    } catch (error) {
      console.error(error);
      triggerToast('Failed to create reservation. Please try again.');
    }
  };

  const handleUpdateStatus = async (id: string, status: ReservationStatus) => {
    try {
      await updateReservationStatus(id, status);
      triggerToast(`Status updated to ${status}`);
      await loadReservations();
    } catch (error) {
      console.error(error);
      triggerToast('Failed to update status.');
    }
  };

  // Waitlist actions
  const addToWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistForm.customerName || !waitlistForm.customerPhone) {
      triggerToast('Please enter customer name and phone number.');
      return;
    }
    const newItem: WaitlistItem = {
      id: 'w_' + Math.random().toString(36).substr(2, 9),
      customerName: waitlistForm.customerName,
      customerPhone: waitlistForm.customerPhone,
      guestCount: Number(waitlistForm.guestCount),
      addedAt: new Date().toISOString(),
      status: 'waiting',
      notes: waitlistForm.notes,
      vip: waitlistForm.vip,
    };
    setWaitlist([newItem, ...waitlist]);
    setWaitlistForm({
      customerName: '',
      customerPhone: '',
      guestCount: '2',
      notes: '',
      vip: false,
    });
    triggerToast(`${newItem.customerName} added to waitlist!`);
  };

  const notifyWaitlist = (id: string, name: string) => {
    setWaitlist(prev =>
      prev.map(item => (item.id === id ? { ...item, status: 'notified' } : item))
    );
    triggerToast(`WhatsApp & SMS alert sent to ${name}!`);
  };

  const seatWaitlist = (id: string, name: string) => {
    // Open table selector logic or automatically find table
    const availableTable = tables.find(t => t.isAvailable);
    if (availableTable) {
      setWaitlist(prev =>
        prev.map(item => (item.id === id ? { ...item, status: 'seated' } : item))
      );
      triggerToast(`${name} seated at ${availableTable.name}!`);
      
      // Optionally create reservation entry too
      void createReservation({
        tableId: availableTable.id,
        customerName: name,
        guestCount: 2,
        reservationAt: new Date().toISOString(),
      }).then(() => {
        void loadReservations();
        void loadAvailability();
      });
    } else {
      triggerToast(`No tables currently available. Clear a table first.`);
    }
  };

  const cancelWaitlist = (id: string) => {
    setWaitlist(prev =>
      prev.map(item => (item.id === id ? { ...item, status: 'cancelled' } : item))
    );
    triggerToast('Waitlist entry cancelled.');
  };

  // Filtering reservations
  const filteredReservations = useMemo(() => {
    return reservations.filter((res) => {
      const matchesSearch =
        res.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (res.customerPhone && res.customerPhone.includes(searchQuery));
      
      const matchesStatus =
        statusFilter === 'ALL' || res.status === statusFilter;
        
      const resDate = new Date(res.reservationAt).toISOString().slice(0, 10);
      const matchesDate = !selectedDate || resDate === selectedDate;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [reservations, searchQuery, statusFilter, selectedDate]);

  // Compute metrics
  const metrics = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayReservations = reservations.filter(
      r => new Date(r.reservationAt).toISOString().slice(0, 10) === todayStr
    );
    const seatedCount = todayReservations.filter(r => r.status === 'SEATED').length;
    const activeWait = waitlist.filter(w => w.status === 'waiting' || w.status === 'notified').length;
    const availableTablesCount = tables.filter(t => t.isAvailable).length;

    return {
      totalToday: todayReservations.length,
      seated: seatedCount,
      waiting: activeWait,
      availableTables: availableTablesCount,
    };
  }, [reservations, waitlist, tables]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <span className="text-gray-500 font-medium">Loading reservations & floor plan...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-white shadow-2xl animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="h-5 w-5 text-indigo-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reservations & Floor Log</h1>
          <p className="text-sm text-slate-500">
            Real-time table layout scheduler, customer waitlists, and reservation timelines.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('list')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold shadow-sm transition-all duration-200 ${
              activeView === 'list'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <List className="h-3.5 w-3.5" />
            Bookings List
          </button>
          <button
            onClick={() => setActiveView('calendar')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold shadow-sm transition-all duration-200 ${
              activeView === 'calendar'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            Daily Planner
          </button>
          <button
            onClick={() => setActiveView('waitlist')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold shadow-sm transition-all duration-200 ${
              activeView === 'waitlist'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            Waitlist Queue ({metrics.waiting})
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bookings Today</span>
            <span className="rounded-full bg-indigo-50 p-1.5 text-indigo-600">
              <CalendarIcon className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{metrics.totalToday}</span>
            <span className="text-xs text-slate-400">reservations</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Seated Guests</span>
            <span className="rounded-full bg-emerald-50 p-1.5 text-emerald-600">
              <Coffee className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{metrics.seated}</span>
            <span className="text-xs text-slate-400">active tables</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Waitlist Queue</span>
            <span className="rounded-full bg-amber-50 p-1.5 text-amber-600">
              <UserPlus className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{metrics.waiting}</span>
            <span className="text-xs text-slate-400">parties</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Available Tables</span>
            <span className="rounded-full bg-sky-50 p-1.5 text-sky-600">
              <TrendingUp className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{metrics.availableTables}</span>
            <span className="text-xs text-slate-400">/ {tables.length} tables</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        
        {/* Left Form Panel */}
        <div className="space-y-6">
          
          {/* Reservation Booker */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <Coffee className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">New Reservation</h2>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Customer Name *</label>
                <input
                  value={form.customerName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, customerName: event.target.value }))
                  }
                  placeholder="Enter guest name"
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Mobile Phone</label>
                  <input
                    value={form.customerPhone}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, customerPhone: event.target.value }))
                    }
                    placeholder="Phone number"
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Guests Count</label>
                  <input
                    value={form.guestCount}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, guestCount: event.target.value }))
                    }
                    type="number"
                    min={1}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Date & Time *</label>
                <input
                  value={form.reservationAt}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, reservationAt: event.target.value }))
                  }
                  type="datetime-local"
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Table Selection</label>
                <select
                  value={form.tableId}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, tableId: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none bg-white"
                >
                  <option value="">Select table</option>
                  {tables.map((table) => (
                    <option
                      key={table.id}
                      value={table.id}
                      disabled={!table.isAvailable}
                    >
                      {table.name} (Cap: {table.capacity}) - {table.isAvailable ? 'Available' : 'Occupied'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Dining / Chef Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, notes: event.target.value }))
                  }
                  rows={2}
                  placeholder="e.g. Window preference, Nut allergy, Birthday anniversary..."
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="isVip"
                  checked={form.isVip}
                  onChange={(e) => setForm((c) => ({ ...c, isVip: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="isVip" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  Mark as VIP Client
                  <Sparkles className="h-3 w-3 text-amber-500 fill-amber-500" />
                </label>
              </div>

              <button
                onClick={submitReservation}
                className="mt-2 w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors duration-200"
              >
                Confirm Reservation Book
              </button>
            </div>
          </div>

          {/* Quick Waitlist Entry Form */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <UserPlus className="h-5 w-5 text-amber-600" />
              <h2 className="text-lg font-bold text-slate-900">Add to Waitlist</h2>
            </div>
            <form onSubmit={addToWaitlist} className="space-y-3">
              <input
                value={waitlistForm.customerName}
                onChange={(e) => setWaitlistForm(c => ({ ...c, customerName: e.target.value }))}
                placeholder="Walk-in Name"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={waitlistForm.customerPhone}
                  onChange={(e) => setWaitlistForm(c => ({ ...c, customerPhone: e.target.value }))}
                  placeholder="Phone No"
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
                <select
                  value={waitlistForm.guestCount}
                  onChange={(e) => setWaitlistForm(c => ({ ...c, guestCount: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none bg-white text-slate-700"
                >
                  <option value="1">1 Person</option>
                  <option value="2">2 People</option>
                  <option value="3">3 People</option>
                  <option value="4">4 People</option>
                  <option value="5">5 People</option>
                  <option value="6">6+ People</option>
                </select>
              </div>
              <input
                value={waitlistForm.notes}
                onChange={(e) => setWaitlistForm(c => ({ ...c, notes: e.target.value }))}
                placeholder="Notes (seat pref, arrival status)"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="waitlistVip"
                  checked={waitlistForm.vip}
                  onChange={(e) => setWaitlistForm(c => ({ ...c, vip: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="waitlistVip" className="text-xs font-semibold text-slate-700">
                  Mark Walk-in as VIP
                </label>
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 text-sm font-semibold transition-colors duration-200"
              >
                Add to Live Queue
              </button>
            </form>
          </div>

        </div>

        {/* Right Dashboard/Interactive Panel */}
        <div className="space-y-6">

          {/* Floor & Table Quick Status Indicator */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">Live Table Grid</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {tables.map((table) => {
                const isSelected = table.id === form.tableId;
                return (
                  <button
                    key={table.id}
                    onClick={() => {
                      if (table.isAvailable) {
                        setForm((current) => ({ ...current, tableId: table.id }));
                      } else {
                        triggerToast(`${table.name} is occupied. Clear order first.`);
                      }
                    }}
                    className={`relative rounded-xl border p-3.5 text-center transition-all duration-200 hover:-translate-y-0.5 ${
                      isSelected
                        ? 'border-indigo-600 ring-2 ring-indigo-600/20'
                        : 'border-slate-100'
                    } ${
                      table.isAvailable
                        ? 'bg-emerald-50/50 hover:bg-emerald-50 text-emerald-800'
                        : 'bg-slate-50 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span className="block font-bold text-sm">{table.name}</span>
                    <span className="text-[10px] opacity-75">Cap: {table.capacity}</span>
                    {table.isAvailable ? (
                      <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    ) : (
                      <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab View Contents */}
          {activeView === 'list' && (
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              {/* Filters header */}
              <div className="border-b border-slate-100 p-4 bg-slate-50/70 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    placeholder="Search guests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
                  />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 bg-white text-slate-700"
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 bg-white text-slate-700"
                  >
                    <option value="ALL">All Status</option>
                    {statusFlow.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reservations Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase bg-slate-50/30">
                      <th className="px-6 py-3">Customer details</th>
                      <th className="px-6 py-3">Assigned Table</th>
                      <th className="px-6 py-3">Time & Date</th>
                      <th className="px-6 py-3">Guests</th>
                      <th className="px-6 py-3 text-right">Workflow Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredReservations.map((reservation) => (
                      <tr key={reservation.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            {reservation.customerName}
                            {reservation.notes && (
                              <span className="inline-flex items-center rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700">
                                Notes
                              </span>
                            )}
                          </div>
                          {reservation.customerPhone && (
                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <Phone className="h-3 w-3" />
                              {reservation.customerPhone}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-800">
                            {tables.find((t) => t.id === reservation.tableId)?.name || 'Table Assigned'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                          {new Date(reservation.reservationAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-800">
                            <Users className="h-3.5 w-3.5 text-slate-400" />
                            {reservation.guestCount}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <select
                            value={reservation.status}
                            onChange={(event) =>
                              void handleUpdateStatus(
                                reservation.id,
                                event.target.value as ReservationStatus
                              )
                            }
                            className={`rounded-lg border text-xs px-2.5 py-1.5 font-semibold focus:outline-none ${
                              reservation.status === 'SEATED'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                : reservation.status === 'CONFIRMED'
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                : reservation.status === 'CANCELLED'
                                ? 'bg-rose-50 border-rose-200 text-rose-700'
                                : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            {statusFlow.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                    {filteredReservations.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center">
                          <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                            <AlertCircle className="h-8 w-8 text-slate-300" />
                            <p className="text-sm font-medium">No bookings found matching filters.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeView === 'calendar' && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-base font-bold text-slate-900">Chronological Hourly Slots</h3>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 bg-white text-slate-700 font-semibold"
                />
              </div>

              <div className="space-y-3">
                {/* Hours mapping mock scheduler layout */}
                {['11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'].map((hour) => {
                  // Find reservations in this hour range
                  const matchingRes = filteredReservations.filter((res) => {
                    const resHour = new Date(res.reservationAt).getHours();
                    const hourNum = parseInt(hour.split(':')[0]);
                    const isPm = hour.includes('PM');
                    const normalizedHour = isPm && hourNum !== 12 ? hourNum + 12 : (!isPm && hourNum === 12 ? 0 : hourNum);
                    return resHour === normalizedHour;
                  });

                  return (
                    <div key={hour} className="flex gap-4 items-start border-l-2 border-slate-100 pl-4 py-1.5">
                      <span className="text-xs font-bold text-slate-400 w-16">{hour}</span>
                      <div className="flex-1 flex gap-2 flex-wrap">
                        {matchingRes.length > 0 ? (
                          matchingRes.map((res) => (
                            <div
                              key={res.id}
                              className={`rounded-lg border px-3 py-2 text-xs font-semibold shadow-xs flex items-center justify-between gap-4 max-w-xs ${
                                res.status === 'SEATED'
                                  ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                                  : 'bg-indigo-50/50 border-indigo-100 text-indigo-900'
                              }`}
                            >
                              <div>
                                <p className="font-bold flex items-center gap-1">
                                  {res.customerName}
                                  {res.notes && <Sparkles className="h-3 w-3 text-amber-500 fill-amber-500" />}
                                </p>
                                <p className="text-[10px] text-slate-500 mt-0.5">
                                  {tables.find(t => t.id === res.tableId)?.name || 'Table Assigned'} • {res.guestCount} Pax
                                </p>
                              </div>
                              <select
                                value={res.status}
                                onChange={(e) => handleUpdateStatus(res.id, e.target.value as ReservationStatus)}
                                className="bg-transparent border-0 font-bold text-[10px] cursor-pointer text-indigo-700"
                              >
                                {statusFlow.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-slate-300 italic pt-0.5">No reservations scheduled</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeView === 'waitlist' && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-base font-bold text-slate-900">Waitlist Queue Board</h3>
                <span className="text-xs bg-amber-50 text-amber-800 font-bold px-2.5 py-1 rounded-full">
                  Average wait: 18 mins
                </span>
              </div>

              <div className="space-y-3">
                {waitlist.map((item, index) => {
                  const minutesWaiting = Math.round(
                    (Date.now() - new Date(item.addedAt).getTime()) / 60000
                  );

                  return (
                    <div
                      key={item.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all ${
                        item.status === 'seated'
                          ? 'bg-slate-50 border-slate-100 opacity-60'
                          : item.status === 'notified'
                          ? 'bg-indigo-50/30 border-indigo-100'
                          : 'bg-white border-slate-100'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400">#{index + 1}</span>
                          <span className="font-bold text-slate-900">{item.customerName}</span>
                          {item.vip && (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-800 uppercase flex items-center gap-0.5">
                              VIP <Sparkles className="h-2 w-2 fill-amber-600 text-amber-600" />
                            </span>
                          )}
                          <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${
                            item.status === 'notified'
                              ? 'bg-indigo-100 text-indigo-700'
                              : item.status === 'seated'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {item.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex gap-4 text-xs text-slate-500 mt-1">
                          <span>Guests: <strong className="text-slate-800">{item.guestCount}</strong></span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Waiting {minutesWaiting} mins</span>
                          <span>{item.notes}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.status === 'waiting' && (
                          <button
                            onClick={() => notifyWaitlist(item.id, item.customerName)}
                            className="rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1.5 flex items-center gap-1 transition-colors"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            Send Alert
                          </button>
                        )}
                        {item.status === 'notified' && (
                          <button
                            onClick={() => notifyWaitlist(item.id, item.customerName)}
                            className="rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1.5 flex items-center gap-1 transition-colors"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            Resend SMS
                          </button>
                        )}
                        {(item.status === 'waiting' || item.status === 'notified') && (
                          <>
                            <button
                              onClick={() => seatWaitlist(item.id, item.customerName)}
                              className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 transition-colors"
                            >
                              Seat Table
                            </button>
                            <button
                              onClick={() => cancelWaitlist(item.id)}
                              className="rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold p-1.5 border border-slate-200 transition-colors"
                              title="Cancel entry"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
                {waitlist.length === 0 && (
                  <div className="py-8 text-center text-slate-400">
                    <Users className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-medium">Waitlist is currently empty.</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
