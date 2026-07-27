'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  HeartPulse,
  Bell,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

// Mock weekly sales chart data
const chartData = [
  { day: 'Mon', revenue: 4200 },
  { day: 'Tue', revenue: 5800 },
  { day: 'Wed', revenue: 5100 },
  { day: 'Thu', revenue: 7600 },
  { day: 'Fri', revenue: 8900 },
  { day: 'Sat', revenue: 11200 },
  { day: 'Sun', revenue: 9500 },
];

const mockNotifications = [
  { id: 1, text: 'Order #4582 marked ready (Kitchen)', time: 'Just now', type: 'success' },
  { id: 2, text: 'Table 4 requested billing receipt', time: '1m ago', type: 'info' },
  { id: 3, text: 'Main Branch sales exceeded $8k daily', time: '3m ago', type: 'zap' },
  { id: 4, text: 'Staff: Waiter Sarah checked in', time: '5m ago', type: 'user' },
  { id: 5, text: 'Stock Alert: Mint Leaf quantity low', time: '8m ago', type: 'warning' },
];

const liveEventTemplates = [
  'Order #4583 created for Table 12',
  'Waiter Marcus checked in for Evening shift',
  'Table 7 checked out - $142.50 paid',
  'POS Register Session closed by Admin',
  'Kitchen: Order #4580 cooked in 8m',
  'New reservation received: John D. (4 pax)',
  'Stock updated: Beef Ribs +50kg',
];

export default function AuthDashboardPreview() {
  const [liveEvents, setLiveEvents] = useState(mockNotifications);
  const [revenue, setRevenue] = useState(12845.5);
  const [orders, setOrders] = useState(148);
  const [customers, setCustomers] = useState(382);
  const [health, setHealth] = useState(99.4);

  // Simulate real-time updates for that Vercel/Stripe premium feeling
  useEffect(() => {
    const timer = setInterval(() => {
      // Add dynamic randomness
      setRevenue((prev) => prev + parseFloat((Math.random() * 25).toFixed(2)));
      if (Math.random() > 0.7) {
        setOrders((prev) => prev + 1);
        setCustomers((prev) => prev + Math.floor(Math.random() * 3) + 1);
      }

      // Add dynamic new notification
      if (Math.random() > 0.8) {
        const text = liveEventTemplates[Math.floor(Math.random() * liveEventTemplates.length)];
        const newEvent = {
          id: Date.now(),
          text,
          time: 'Just now',
          type: Math.random() > 0.7 ? 'zap' : 'info',
        };
        setLiveEvents((prev) => [newEvent, ...prev.slice(0, 4)]);
      }
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-between text-slate-900 dark:text-white relative p-8">
      {/* Gloss reflection glare */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none rounded-3xl" />

      {/* Brand Header */}
      <div className="flex items-center gap-3 relative z-10">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-650 shadow-lg shadow-blue-500/20 text-white">
          <Zap size={18} className="animate-pulse" />
        </span>
        <div>
          <span className="block text-base font-extrabold tracking-tight">AK Business OS</span>
          <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Next‑Gen SaaS Console
          </span>
        </div>
      </div>

      {/* Middle Interactive Section */}
      <div className="my-8 space-y-6 relative z-10 flex-1 flex flex-col justify-center">
        {/* Floating Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Revenue */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="p-5 rounded-2xl glass-premium border border-white/20 dark:border-white/5 shadow-xl bg-white/40 dark:bg-slate-900/20 backdrop-blur-xl relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-450">
                Live Revenue
              </span>
              <TrendingUp className="text-emerald-500" size={14} />
            </div>
            <div className="mt-2 text-2xl font-black tracking-tight">
              ${revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-1 mt-1">
              +14.2% <span className="text-slate-400 font-semibold">vs yesterday</span>
            </span>
          </motion.div>

          {/* Orders */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="p-5 rounded-2xl glass-premium border border-white/20 dark:border-white/5 shadow-xl bg-white/40 dark:bg-slate-900/20 backdrop-blur-xl"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-450">
                Active Orders
              </span>
              <ShoppingBag className="text-blue-500 dark:text-cyan-400" size={14} />
            </div>
            <div className="mt-2 text-2xl font-black tracking-tight">{orders}</div>
            <span className="text-[9px] font-bold text-blue-500 dark:text-cyan-400 flex items-center gap-1 mt-1">
              +8.5% <span className="text-slate-400 font-semibold">weekly avg</span>
            </span>
          </motion.div>

          {/* Customers */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="p-5 rounded-2xl glass-premium border border-white/20 dark:border-white/5 shadow-xl bg-white/40 dark:bg-slate-900/20 backdrop-blur-xl"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-450">
                Live Customers
              </span>
              <Users className="text-purple-500 dark:text-purple-400" size={14} />
            </div>
            <div className="mt-2 text-2xl font-black tracking-tight">{customers}</div>
            <span className="text-[9px] font-bold text-purple-500 dark:text-purple-400 flex items-center gap-1 mt-1">
              Active Session <span className="text-slate-400 font-semibold">tracked</span>
            </span>
          </motion.div>

          {/* Business Health */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="p-5 rounded-2xl glass-premium border border-white/20 dark:border-white/5 shadow-xl bg-white/40 dark:bg-slate-900/20 backdrop-blur-xl"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-450">
                Workspace Health
              </span>
              <HeartPulse className="text-emerald-500" size={14} />
            </div>
            <div className="mt-2 text-2xl font-black tracking-tight">{health}%</div>
            <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-1 mt-1">
              Stable <span className="text-slate-400 font-semibold">API responses</span>
            </span>
          </motion.div>
        </div>

        {/* Real-time Sales Trend Chart Card */}
        <div className="p-5 rounded-2xl glass-premium border border-white/20 dark:border-white/5 shadow-xl bg-white/40 dark:bg-slate-900/20 backdrop-blur-xl">
          <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-450 mb-3">
            Weekly Sales Trend
          </span>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  stroke="currentColor"
                  className="text-[9px] text-slate-400 dark:text-slate-500"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="currentColor"
                  className="text-[9px] text-slate-400 dark:text-slate-500"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderRadius: '12px',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="p-5 rounded-2xl glass-premium border border-white/20 dark:border-white/5 shadow-xl bg-white/40 dark:bg-slate-900/20 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-450 flex items-center gap-1.5">
              <Bell size={10} className="text-purple-500 animate-bounce" />
              Live Activity Stream
            </span>
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="space-y-2 h-[120px] overflow-hidden relative">
            <AnimatePresence initial={false}>
              {liveEvents.map((ev, idx) => (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="flex items-center justify-between text-[11px] font-semibold border-b border-slate-200/25 dark:border-slate-800/30 pb-2 last:border-0"
                >
                  <div className="flex items-center gap-2 truncate">
                    {ev.type === 'success' ? (
                      <CheckCircle className="text-emerald-500 shrink-0" size={12} />
                    ) : ev.type === 'warning' ? (
                      <AlertTriangle className="text-rose-500 shrink-0" size={12} />
                    ) : (
                      <Sparkles className="text-purple-500 shrink-0" size={12} />
                    )}
                    <span className="truncate text-slate-700 dark:text-slate-350">{ev.text}</span>
                  </div>
                  <span className="text-[9px] text-slate-450 shrink-0 font-medium ml-2">{ev.time}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer Branding Text */}
      <div className="text-[10px] text-slate-450 dark:text-slate-500 flex items-center justify-between font-black relative z-10 border-t border-slate-250/20 pt-4">
        <span>© 2026 AK Technologies</span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping" />
          <span>Cinematic Identity Engine v1.0</span>
        </span>
      </div>
    </div>
  );
}

