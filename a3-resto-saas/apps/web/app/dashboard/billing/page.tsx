'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import {
  ShoppingCart,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  Plus,
  MoreVertical,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data for today's orders
const hourlyOrdersData = [
  { time: '9 AM', orders: 5 },
  { time: '11 AM', orders: 12 },
  { time: '1 PM', orders: 28 },
  { time: '3 PM', orders: 18 },
  { time: '5 PM', orders: 22 },
  { time: '7 PM', orders: 35 },
  { time: '9 PM', orders: 15 },
];

const orderStatusBreakdown = [
  { name: 'New', value: 12, color: '#3b82f6' },
  { name: 'Preparing', value: 35, color: '#f97316' },
  { name: 'Ready', value: 28, color: '#10b981' },
  { name: 'Completed', value: 156, color: '#8b5cf6' },
];

const recentOrders = [
  {
    id: '#ORD1258',
    table: 'Table 5',
    items: 4,
    amount: '₹1,250',
    status: 'New',
    time: '2 mins ago',
  },
  {
    id: '#ORD1257',
    table: 'Table 2',
    items: 3,
    amount: '₹850',
    status: 'Preparing',
    time: '8 mins ago',
  },
  {
    id: '#ORD1256',
    table: 'Table 7',
    items: 5,
    amount: '₹1,450',
    status: 'Ready',
    time: '12 mins ago',
  },
  {
    id: '#ORD1255',
    table: 'Table 3',
    items: 2,
    amount: '₹950',
    status: 'Preparing',
    time: '15 mins ago',
  },
];

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'Rs. 999',
    interval: 'month',
    limits: ['1 outlet', '500 orders/month', 'Basic analytics'],
    features: ['POS Billing', 'QR Ordering', 'Menu Management'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'Rs. 2999',
    interval: 'month',
    limits: ['3 outlets', '5000 orders/month', 'AI insights'],
    features: ['Inventory', 'Kitchen Display', 'Staff Roles', 'Reservations'],
    recommended: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    interval: 'contract',
    limits: ['Unlimited outlets', 'Custom usage', 'Priority support'],
    features: ['SLA', 'Advanced RBAC', 'Dedicated onboarding', 'CI/CD support'],
  },
];

const invoices = [
  {
    id: 'INV-1001',
    provider: 'razorpay',
    amount: 'Rs. 2999',
    status: 'paid',
    issuedAt: '2026-05-01',
  },
];
export default function BillingCounterDashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    todayOrders: 56,
    todayRevenue: 18750,
    pendingOrders: 12,
    completedOrders: 44,
    cancelledOrders: 2,
    totalTables: 20,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && (!user || (user.role !== 'CASHIER' && user.role !== 'OWNER'))) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Billing Counter</h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">Today's billing and order summary</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition">
            <Plus size={20} />
            New Order
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {/* Today's Orders */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Today's Orders</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{stats.todayOrders}</p>
                <span className="text-xs text-green-600 dark:text-green-400 font-semibold mt-2 block">↑ 13.3% vs yesterday</span>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                <ShoppingCart className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
            </div>
          </div>

          {/* Today's Revenue */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Today's Revenue</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">₹{stats.todayRevenue.toLocaleString()}</p>
                <span className="text-xs text-green-600 dark:text-green-400 font-semibold mt-2 block">↑ 18.6% vs yesterday</span>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                <TrendingUp className="text-green-600 dark:text-green-400" size={20} />
              </div>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Pending</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{stats.pendingOrders}</p>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-2 block">Needs attention</span>
              </div>
              <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg">
                <Clock className="text-amber-600 dark:text-amber-400" size={20} />
              </div>
            </div>
          </div>

          {/* Completed Orders */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Completed</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{stats.completedOrders}</p>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-2 block">Today</span>
              </div>
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg">
                <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" size={20} />
              </div>
            </div>
          </div>

          {/* Cancelled Orders */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Cancelled</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{stats.cancelledOrders}</p>
                <span className="text-xs text-red-600 dark:text-red-400 font-semibold mt-2 block">Today</span>
              </div>
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                <XCircle className="text-red-600 dark:text-red-400" size={20} />
              </div>
            </div>
          </div>

          {/* Total Tables */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Total Tables</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{stats.totalTables}</p>
                <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-2 block">Available</span>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                <CreditCard className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Hourly Orders</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={hourlyOrdersData}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="orders" stroke="#3b82f6" fillOpacity={1} fill="url(#colorOrders)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Order Status */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Order Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={orderStatusBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                  {orderStatusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {orderStatusBreakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Orders</h3>
            <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-semibold">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Table</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{order.id}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{order.table}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{order.items} items</td>
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{order.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'New' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                        order.status === 'Preparing' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">{order.time}</td>
                    <td className="px-6 py-4">
                      <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
