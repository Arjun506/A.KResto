'use client';

import { useState, useEffect } from 'react';
import {
  ChefHat,
  ShoppingCart,
  Users,
  Calendar as CalendarIcon,
  CreditCard,
  AlertTriangle,
  Play,
  CheckCircle,
  Clock,
  Sparkles,
  Search,
  Plus,
  Compass,
  ArrowRight,
  UserCheck,
  TrendingUp,
  MapPin,
  RefreshCw,
  Layers
} from 'lucide-react';
import { getBusinessSettings } from '@/services/business.service';
import { getOrders, updateOrderStatus } from '@/services/order.service';

interface OrderItem {
  id: string;
  table: string;
  items: string;
  total: number;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED';
  time: string;
}

interface TableItem {
  id: string;
  name: string;
  seats: number;
  status: 'FREE' | 'OCCUPIED' | 'RESERVED';
  bill?: number;
}

const INITIAL_ORDERS: OrderItem[] = [
  { id: 'ORD-8921', table: 'Table 4', items: '2x Margherita Pizza, 1x Coke', total: 840, status: 'PENDING', time: '5 mins ago' },
  { id: 'ORD-8920', table: 'Table 12', items: '1x Garlic Bread, 1x Veg Pasta', total: 560, status: 'PREPARING', time: '12 mins ago' },
  { id: 'ORD-8919', table: 'Table 8', items: '1x Choco Lava Cake, 1x Cappuccino', total: 320, status: 'READY', time: '18 mins ago' }
];

const INITIAL_TABLES: TableItem[] = [
  { id: 't1', name: 'Table 1', seats: 2, status: 'FREE' },
  { id: 't2', name: 'Table 2', seats: 4, status: 'OCCUPIED', bill: 1250 },
  { id: 't3', name: 'Table 3', seats: 4, status: 'RESERVED' },
  { id: 't4', name: 'Table 4', seats: 6, status: 'OCCUPIED', bill: 840 },
  { id: 't5', name: 'Table 5', seats: 2, status: 'FREE' },
  { id: 't6', name: 'Table 6', seats: 8, status: 'OCCUPIED', bill: 2450 }
];

const INITIAL_RESERVATIONS = [
  { guest: 'Sarah Jenkins', guests: 4, time: '7:30 PM', table: 'Table 3', phone: '+91 98765-43210' },
  { guest: 'Rahul Malhotra', guests: 2, time: '8:00 PM', table: 'Table 5', phone: '+91 99887-76655' }
];

export default function RestaurantOperationsCenter() {
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [tables, setTables] = useState<TableItem[]>(INITIAL_TABLES);
  const [reservations, setReservations] = useState(INITIAL_RESERVATIONS);
  const [activityLog, setActivityLog] = useState<string[]>([
    'Server started KDS monitor sync.',
    'Table 4 placed new order ORD-8921.',
    'Waiter Rohan checked in for shift.'
  ]);

  const [restaurantName, setRestaurantName] = useState('AKresto');
  const [loadingOrders, setLoadingOrders] = useState(false);

  const fetchLiveOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await getOrders();
      // Map API orders if available
      if (res && res.length > 0) {
        const mapped: OrderItem[] = res.map((o: any) => {
          const itemsStr = o.items
            ? o.items.map((i: any) => `${i.quantity}x ${i.name || 'Item'}`).join(', ')
            : 'Order details';
          return {
            id: o.id,
            table: o.tableId || 'Counter',
            items: itemsStr,
            total: parseFloat(o.totalAmount) || o.total || 0,
            status: o.status as any,
            time: new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        });
        setOrders(mapped);
      }
    } catch {
      // Graceful fallback to initial mock orders if backend list is empty or fails
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    void (async () => {
      try {
        const settings = await getBusinessSettings();
        if (settings) setRestaurantName(settings.name);
      } catch {}
    })();
    void fetchLiveOrders();
  }, []);

  const handleNextStatus = async (orderId: string) => {
    const ord = orders.find(x => x.id === orderId);
    if (!ord) return;

    let nextStatus: OrderItem['status'] = ord.status;
    if (ord.status === 'PENDING') nextStatus = 'PREPARING';
    else if (ord.status === 'PREPARING') nextStatus = 'READY';
    else if (ord.status === 'READY') nextStatus = 'COMPLETED';

    try {
      // Call backend API update
      await updateOrderStatus(orderId, nextStatus);
    } catch {
      // Local state fallback if API mock fails
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );

    setActivityLog((logs) => [
      `Order ${orderId} status advanced to ${nextStatus}.`,
      ...logs
    ]);
  };

  const handleToggleTable = (tableId: string) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t;
        const nextStatus = t.status === 'FREE' ? 'OCCUPIED' : t.status === 'OCCUPIED' ? 'RESERVED' : 'FREE';
        const bill = nextStatus === 'OCCUPIED' ? 450 : undefined;

        setActivityLog((logs) => [
          `${t.name} state changed to ${nextStatus}.`,
          ...logs
        ]);

        return { ...t, status: nextStatus, bill };
      })
    );
  };

  const handleQuickAddOrder = () => {
    const id = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrd: OrderItem = {
      id,
      table: 'Table 1',
      items: '1x Margherita Pizza, 1x Lemonade',
      total: 450,
      status: 'PENDING',
      time: 'Just now'
    };
    setOrders((prev) => [newOrd, ...prev]);
    setActivityLog((logs) => [`Created quick order ${id} for Table 1.`, ...logs]);
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto select-none">
      
      {/* Header Panel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-605">
              <ChefHat className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-black uppercase text-indigo-650 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
              Live Restaurant Operations Centre
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-850 dark:text-slate-100 tracking-tight flex items-center gap-3">
            {restaurantName} Ops Center
            <button
              onClick={fetchLiveOrders}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-650 transition active:scale-95 cursor-pointer"
              title="Refresh queue"
            >
              <RefreshCw size={13} className={loadingOrders ? 'animate-spin' : ''} />
            </button>
          </h1>
          <p className="text-xs text-slate-450">
            Real-time restaurant kitchen tickets, dine-in table check statuses, reservations, and staff shifts.
          </p>
        </div>

        {/* Quick Summary Badges */}
        <div className="flex items-center gap-2.5">
          <div className="p-3 bg-white dark:bg-[#11131c] border border-slate-205/65 dark:border-slate-800/40 rounded-2xl text-center shadow-xs">
            <p className="text-[9px] font-black text-slate-400 uppercase">Sales Today</p>
            <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 mt-0.5">₹28,450</h4>
          </div>
          <div className="p-3 bg-white dark:bg-[#11131c] border border-slate-205/65 dark:border-slate-800/40 rounded-2xl text-center shadow-xs">
            <p className="text-[9px] font-black text-slate-400 uppercase">Covers Settle</p>
            <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 mt-0.5">48 checks</h4>
          </div>
        </div>
      </div>

      {/* Main Grid layout */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        
        {/* Left 2 Columns: Live Orders & Table Seating */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Live Orders Tracker */}
          <section className="bg-white dark:bg-[#11131c] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-850/20 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4.5 h-4.5 text-indigo-500" />
                <h2 className="text-sm font-black text-slate-800 dark:text-slate-100">Live Orders Queue</h2>
              </div>
              <span className="text-[10px] font-black uppercase text-indigo-650 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                {orders.filter(x => x.status !== 'COMPLETED').length} Active
              </span>
            </div>

            <div className="space-y-3">
              {orders.filter(x => x.status !== 'COMPLETED').length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No pending orders in queue.</p>
              ) : (
                orders
                  .filter((x) => x.status !== 'COMPLETED')
                  .map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 border border-slate-100 dark:border-slate-850/30 rounded-2xl flex items-center justify-between gap-4 hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition"
                    >
                      <div className="space-y-1 text-left min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-800 dark:text-slate-100">{ord.id}</span>
                          <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
                            {ord.table}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{ord.items}</p>
                        <span className="text-[9px] text-slate-400 font-bold block">{ord.time}</span>
                      </div>

                      {/* Controls Status */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[10px] font-extrabold text-slate-800 dark:text-slate-350">
                          ₹{ord.total}
                        </span>
                        <button
                          onClick={() => handleNextStatus(ord.id)}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition active:scale-95 cursor-pointer ${
                            ord.status === 'PENDING'
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                              : ord.status === 'PREPARING'
                              ? 'bg-amber-50 hover:bg-amber-100 text-amber-600'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                          }`}
                        >
                          {ord.status === 'PENDING'
                            ? 'Start prep'
                            : ord.status === 'PREPARING'
                            ? 'Ready'
                            : 'Complete'}
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </section>

          {/* Table Seating Map */}
          <section className="bg-white dark:bg-[#11131c] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-850/20 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4.5 h-4.5 text-indigo-500" />
                <h2 className="text-sm font-black text-slate-800 dark:text-slate-100">Dine-in Seating Layout</h2>
              </div>
              <p className="text-[10px] text-slate-400 font-bold">Click table to toggle status</p>
            </div>

            {/* Seating Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {tables.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleToggleTable(t.id)}
                  className={`p-4 border rounded-2xl text-left transition relative active:scale-97 cursor-pointer ${
                    t.status === 'FREE'
                      ? 'bg-white hover:bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                      : t.status === 'OCCUPIED'
                      ? 'bg-emerald-50/15 border-emerald-150/40 text-emerald-705 dark:bg-emerald-950/10'
                      : 'bg-indigo-50/10 border-indigo-150/30 text-indigo-650 dark:bg-indigo-950/5'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-black text-slate-800 dark:text-slate-100">{t.name}</span>
                    <span className="text-[8px] font-bold text-slate-400">{t.seats} seats</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`text-[9px] font-black uppercase ${
                      t.status === 'FREE'
                        ? 'text-slate-400'
                        : t.status === 'OCCUPIED'
                        ? 'text-emerald-500'
                        : 'text-indigo-400'
                    }`}>
                      {t.status}
                    </span>
                    {t.bill && (
                      <span className="text-[10px] font-black text-slate-700 dark:text-slate-300">
                        ₹{t.bill}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>

        </div>

        {/* Right 1 Column: Staff, Reservations & Activity logs */}
        <div className="space-y-6">
          
          {/* Quick Actions widget */}
          <section className="bg-white dark:bg-[#11131c] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-5 shadow-xs text-left">
            <h3 className="text-xs font-black text-slate-450 uppercase mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleQuickAddOrder}
                className="p-3 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-650 dark:bg-slate-850/40 dark:hover:bg-indigo-950/20 border border-slate-100 dark:border-slate-800/30 rounded-2xl flex flex-col items-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <Plus size={14} className="text-slate-450" />
                <span className="text-[10px] font-bold">Quick Order</span>
              </button>
              <a
                href="/dashboard/reservations"
                className="p-3 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-650 dark:bg-slate-850/40 dark:hover:bg-indigo-950/20 border border-slate-100 dark:border-slate-800/30 rounded-2xl flex flex-col items-center gap-1.5 transition active:scale-95"
              >
                <CalendarIcon size={14} className="text-slate-450" />
                <span className="text-[10px] font-bold">Book Table</span>
              </a>
            </div>
          </section>

          {/* Reservations logs */}
          <section className="bg-white dark:bg-[#11131c] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-5 shadow-xs">
            <h3 className="text-xs font-black text-slate-450 uppercase mb-3">Today's Reservations</h3>
            <div className="space-y-2.5">
              {reservations.map((res, idx) => (
                <div key={idx} className="p-3 bg-slate-50/50 dark:bg-slate-850/15 border border-slate-100 dark:border-slate-800/30 rounded-2xl text-left space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-750 dark:text-slate-200">{res.guest}</span>
                    <span className="text-[8px] font-black uppercase text-indigo-650 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded">
                      {res.time}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-450">{res.table} • {res.guests} guests • {res.phone}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Online Staff */}
          <section className="bg-white dark:bg-[#11131c] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-5 shadow-xs">
            <h3 className="text-xs font-black text-slate-450 uppercase mb-3">Active On-Shift Staff</h3>
            <div className="space-y-2">
              {[
                { name: 'Rohan Sharma', role: 'Wait Staff', status: 'Active (Floor)' },
                { name: 'Chef Ramesh', role: 'Kitchen Head', status: 'Cooking' },
                { name: 'Neha V.', role: 'Cashier', status: 'Counter POS' }
              ].map((staff, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 border border-slate-50 dark:border-slate-850/30 rounded-xl text-left">
                  <div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-350">{staff.name}</span>
                    <span className="text-[9px] text-slate-400 block">{staff.role}</span>
                  </div>
                  <span className="text-[8px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                    {staff.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* AI Insights & Notifications */}
          <section className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-5 rounded-3xl space-y-2.5 text-left shadow-md">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4.5 h-4.5 text-indigo-200" />
              <h3 className="text-[10px] font-black uppercase tracking-wider text-indigo-150">AI Kitchen Insights</h3>
            </div>
            <p className="text-[11px] text-indigo-100 leading-relaxed">
              "Customer orders for Margherita Pizza peak around 8:30 PM. Advise Chef Ramesh to pre-roll sourdough pizza crusts at 7:45 PM to reduce checkout times."
            </p>
          </section>

          {/* Daily Timeline audit logs */}
          <section className="bg-white dark:bg-[#11131c] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-5 shadow-xs">
            <h3 className="text-xs font-black text-slate-450 uppercase mb-3">Daily Operations Timeline</h3>
            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
              {activityLog.map((log, idx) => (
                <div key={idx} className="flex gap-2 text-[10px] text-left">
                  <span className="text-slate-300">•</span>
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">{log}</p>
                    <span className="text-[8px] text-slate-400">Just now</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

      </div>

    </div>
  );
}
