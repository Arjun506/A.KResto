'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  ShoppingCart,
  Users,
  CreditCard,
  Layers,
  UtensilsCrossed,
  QrCode,
  Gift,
  Package,
  UserCheck,
  BarChart3,
  Star,
  Calendar,
  ChevronDown,
  Download,
  AlertTriangle,
  ArrowUpRight,
  TrendingDown,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid
} from 'recharts';

import { getRestaurant } from '@/services/restaurant.service';
import { getBusinessSettings } from '@/services/business.service';

// Mock charts data
const revenueData = [
  { day: '01 Jun', revenue: 28000 },
  { day: '03 Jun', revenue: 35000 },
  { day: '05 Jun', revenue: 26000 },
  { day: '07 Jun', revenue: 41000 },
  { day: '09 Jun', revenue: 32000 },
  { day: '11 Jun', revenue: 45000 },
  { day: '14 Jun', revenue: 54000 },
];

const orderStatusData = [
  { name: 'Pending', value: 12, percentage: '1.0%', color: '#F59E0B' }, // Amber
  { name: 'Confirmed', value: 245, percentage: '19.7%', color: '#4F46E5' }, // Indigo
  { name: 'Preparing', value: 458, percentage: '36.8%', color: '#F97316' }, // Orange
  { name: 'Ready', value: 320, percentage: '25.7%', color: '#06B6D4' }, // Cyan
  { name: 'Completed', value: 190, percentage: '15.3%', color: '#10B981' }, // Emerald
  { name: 'Cancelled', value: 20, percentage: '1.5%', color: '#EF4444' }, // Red
];

const salesOverviewData = [
  { date: '01 Jun', sales: 42000 },
  { date: '03 Jun', sales: 49000 },
  { date: '05 Jun', sales: 32000 },
  { date: '07 Jun', sales: 54000 },
  { date: '09 Jun', sales: 40000 },
  { date: '11 Jun', sales: 48000 },
  { date: '13 Jun', sales: 65000 },
];

const orderSourceData = [
  { name: 'Dine In', value: 65, color: '#4F46E5' },
  { name: 'QR Code', value: 20, color: '#06B6D4' },
  { name: 'Takeaway', value: 10, color: '#F97316' },
  { name: 'Delivery', value: 5, color: '#10B981' },
];

export default function OwnerDashboard() {
  const router = useRouter();
  const [restaurantName, setRestaurantName] = useState('Spice Corner');
  const [industry, setIndustry] = useState('RESTAURANT');

  const decodeJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const loadRest = async () => {
      try {
        const settings = await getBusinessSettings();
        if (settings) {
          setRestaurantName(settings.name);
          setIndustry(settings.industry || 'RESTAURANT');
          localStorage.setItem('restaurantName', settings.name);
          window.dispatchEvent(new Event('storage'));
        }
      } catch (err) {
        console.warn('Failed to load settings in dashboard, utilizing local cache fallback:', err);
      }
    };
    void loadRest();
  }, [router]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Title Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
              Live Operations Dashboard
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1 flex items-center gap-2">
            Welcome back, Rohit Sharma <Sparkles className="h-5 w-5 text-indigo-500" />
          </h1>
          <p className="text-sm text-slate-500">
            Real-time sales insights, restaurant status, and operations overview for <span className="font-semibold text-slate-800">{restaurantName}</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 cursor-pointer transition text-xs font-semibold text-slate-700 shadow-sm">
            <Calendar size={15} className="text-slate-500" />
            <span>01 Jun 2026 - 14 Jun 2026</span>
            <ChevronDown size={13} className="text-slate-400" />
          </div>

          <button
            onClick={() => {
              // Simulate export report
              alert('Daily Operations Report exported as PDF.');
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all shadow-sm"
          >
            <Download size={14} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <section className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        
        {/* Metric: Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Revenue</span>
            <span className="rounded-full bg-emerald-50 p-1 text-emerald-600">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mt-2">₹2.45L</h3>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">↑ 22.7% <span className="text-slate-400 font-medium">prev</span></span>
        </div>

        {/* Metric: Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Orders</span>
            <span className="rounded-full bg-indigo-50 p-1 text-indigo-600">
              <ShoppingCart className="h-3.5 w-3.5" />
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mt-2">1,245</h3>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">↑ 18.5% <span className="text-slate-400 font-medium">prev</span></span>
        </div>

        {/* Metric: Profit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Profit Margin</span>
            <span className="rounded-full bg-emerald-50 p-1 text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" />
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mt-2">₹95,400</h3>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">↑ 20.3% <span className="text-slate-400 font-medium">prev</span></span>
        </div>

        {/* Metric: Guests */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              {industry === 'RESTAURANT' ? 'Total Guests' : 'Total Customers'}
            </span>
            <span className="rounded-full bg-amber-50 p-1 text-amber-600">
              <Users className="h-3.5 w-3.5" />
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mt-2">856</h3>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">↑ 16.2% <span className="text-slate-400 font-medium">prev</span></span>
        </div>

        {/* Metric: Active Tables / Active Inventory */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              {industry === 'RESTAURANT' ? 'Tables Seated' : 'Active Stock'}
            </span>
            <span className="rounded-full bg-cyan-50 p-1 text-cyan-600">
              <Layers className="h-3.5 w-3.5" />
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mt-2">
            {industry === 'RESTAURANT' ? '8 / 20' : '142 Items'}
          </h3>
          <span className="text-[10px] text-slate-400 font-semibold mt-1 block">
            {industry === 'RESTAURANT' ? '12 Available slots' : 'Fully provisioned'}
          </span>
        </div>

        {/* Metric: Pending Orders / Low Stock alerts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              {industry === 'RESTAURANT' ? 'Pending KOT' : 'Low Stock alerts'}
            </span>
            <span className="rounded-full bg-rose-50 p-1 text-rose-600">
              <AlertTriangle className="h-3.5 w-3.5" />
            </span>
          </div>
          <h3 className="text-xl font-bold text-rose-600 mt-2">
            {industry === 'RESTAURANT' ? '12' : '4'}
          </h3>
          <span className="text-[10px] text-rose-600 font-semibold mt-1 block">
            {industry === 'RESTAURANT' ? '↓ 5.2% KOT load' : 'Requires review'}
          </span>
        </div>
      </section>

      {/* Middle Analytical Row */}
      <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr_1.1fr]">
        
        {/* Area Chart: Revenue Overview */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Sales Revenue Timeline</h2>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded">Daily tracking</span>
          </div>

          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Order Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <h2 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">KOT Order Status</h2>
          
          <div className="relative h-[120px] w-full flex items-center justify-center my-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={50}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-slate-900 leading-none">1,245</span>
              <span className="text-[8px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Tickets</span>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            {orderStatusData.slice(1, 5).map((item) => (
              <div key={item.name} className="flex items-center justify-between font-semibold text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-800">
                  <span>{item.value}</span>
                  <span className="text-slate-400 font-medium text-[10px]">({item.percentage})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* List: Recent Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Live KOT Feed</h2>
            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800" onClick={() => router.push('/dashboard/orders')}>
              View All
            </button>
          </div>

          <div className="space-y-3.5">
            {[
              { id: '#ORD1258', table: 'Table 5', total: '₹1,250', status: 'Completed', time: '2 mins ago', color: 'bg-emerald-50 text-emerald-700' },
              { id: '#ORD1267', table: 'Table 2', total: '₹850', status: 'Preparing', time: '15 mins ago', color: 'bg-orange-50 text-orange-700' },
              { id: '#ORD1256', table: 'Table 7', total: '₹1,450', status: 'Confirmed', time: '20 mins ago', color: 'bg-indigo-50 text-indigo-700' },
              { id: '#ORD1255', table: 'Table 3', total: '₹950', status: 'Completed', time: '30 mins ago', color: 'bg-emerald-50 text-emerald-700' },
            ].map((order) => (
              <div key={order.id} className="flex justify-between items-center text-xs font-semibold">
                <div>
                  <p className="text-slate-900 font-bold">{order.id}</p>
                  <p className="text-slate-400 text-[10px] mt-0.5">{order.time}</p>
                </div>
                <span className="text-slate-700 font-bold">{order.table}</span>
                <span className="text-slate-900 font-bold">{order.total}</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${order.color}`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Operations Quick Link Row */}
      <section className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
        {[
          { label: 'Add New Menu', icon: UtensilsCrossed, bg: 'bg-violet-50 text-violet-600', path: '/dashboard/menu' },
          { label: 'Manage Tables', icon: Layers, bg: 'bg-blue-50 text-blue-600', path: '/dashboard/qr-tables' },
          { label: 'Generate QR', icon: QrCode, bg: 'bg-cyan-50 text-cyan-600', path: '/dashboard/qr-tables' },
          { label: 'Manage Offers', icon: Gift, bg: 'bg-orange-50 text-orange-600', path: '/dashboard/menu' },
          { label: 'Inventory', icon: Package, bg: 'bg-rose-50 text-rose-600', path: '/dashboard/inventory' },
          { label: 'Staff Shift Scheduler', icon: UserCheck, bg: 'bg-emerald-50 text-emerald-600', path: '/dashboard/staff' },
          { label: 'SaaS Analytics', icon: BarChart3, bg: 'bg-indigo-50 text-indigo-600', path: '/dashboard/analytics' },
        ].map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.label}
              onClick={() => router.push(act.path)}
              className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 rounded-xl transition-all duration-200 active:scale-95 flex-shrink-0"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${act.bg}`}>
                <Icon size={15} />
              </div>
              <span className="text-xs font-bold text-slate-800">{act.label}</span>
            </button>
          );
        })}
      </section>

      {/* Bottom Row: Detail metrics tables */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Column 1: Top Items & Upcoming reservations */}
        <div className="space-y-6">
          
          {/* Top Selling Items */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="font-bold text-sm text-slate-800 uppercase tracking-wider">
                {industry === 'RESTAURANT' ? 'Top Selling Dishes' : 'Top Selling Products'}
              </h2>
              <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800" onClick={() => router.push(industry === 'RESTAURANT' ? '/dashboard/menu' : '/dashboard/inventory')}>
                View All
              </button>
            </div>
            
            <div className="space-y-3 text-xs">
              {[
                { name: industry === 'RESTAURANT' ? 'Paneer Butter Masala' : 'Wireless Bluetooth Headphones', count: 245, sales: '₹48,500' },
                { name: industry === 'RESTAURANT' ? 'Veg Biryani Special' : 'Ergonomic Office Chair', count: 210, sales: '₹37,800' },
                { name: industry === 'RESTAURANT' ? 'Margherita Pizza Regular' : 'USB-C Charging Hub 5-Port', count: 185, sales: '₹29,600' },
                { name: industry === 'RESTAURANT' ? 'Butter Garlic Naan' : 'Premium Leather Wallet', count: 162, sales: '₹24,300' },
              ].map((item) => (
                <div key={item.name} className="flex justify-between items-center font-semibold text-slate-600">
                  <span className="text-slate-850 line-clamp-1 font-bold">{item.name}</span>
                  <span className="text-slate-400 font-medium text-[10px]">{item.count} sales</span>
                  <span className="text-slate-900 font-extrabold">{item.sales}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Reservations */}
          {industry === 'RESTAURANT' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h2 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Booked Tables Today</h2>
                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800" onClick={() => router.push('/dashboard/reservations')}>
                  View All
                </button>
              </div>

              <div className="space-y-3 text-xs font-semibold">
                {[
                  { table: 'Table 4', name: 'Rahul Verma', time: 'Today, 7:30 PM', guests: '4 Pax', status: 'Confirmed', color: 'bg-emerald-50 text-emerald-700' },
                  { table: 'Table 7', name: 'Priya Singh', time: 'Today, 8:00 PM', guests: '2 Pax', status: 'Confirmed', color: 'bg-emerald-50 text-emerald-700' },
                  { table: 'Table 2', name: 'Karan Patel', time: 'Today, 8:30 PM', guests: '6 Pax', status: 'Pending', color: 'bg-amber-50 text-amber-700' },
                ].map((res, i) => (
                  <div key={i} className="flex justify-between items-center text-slate-700">
                    <div>
                      <p className="text-slate-900 font-bold">{res.table} ({res.guests})</p>
                      <p className="text-slate-400 text-[10px] mt-0.5">{res.time} • {res.name}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${res.color}`}>
                      {res.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Column 2: Sales Overview Bar & Low Stock items */}
        <div className="space-y-6">
          
          {/* Sales overview bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Daily Sales Bar</h2>
              <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800" onClick={() => router.push('/dashboard/analytics')}>
                View Details
              </button>
            </div>

            <div className="h-[148px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesOverviewData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Low stock table */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Low Stock Warnings</h2>
              <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800" onClick={() => router.push('/dashboard/inventory')}>
                View All
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {[
                { name: 'Red Tomatoes', value: '5 kg left', status: 'Critical', color: 'bg-rose-50 text-rose-700' },
                { name: 'Cheddar Cheese Blocks', value: '2 kg left', status: 'Critical', color: 'bg-rose-50 text-rose-700' },
                { name: 'Tandoori Atta Premium', value: '12 kg left', status: 'Low Warning', color: 'bg-amber-50 text-amber-700' },
                { name: 'Refined Sunflower Oil', value: '4 Liters left', status: 'Low Warning', color: 'bg-amber-50 text-amber-700' },
              ].map((item) => (
                <div key={item.name} className="flex justify-between items-center font-semibold text-slate-700">
                  <div>
                    <p className="text-slate-900 font-bold">{item.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.value}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${item.color}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Column 3: Order Source Pie & Customer Reviews Feed */}
        <div className="space-y-6">
          
          {/* Order Source Pie Chart */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <h2 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">Order Channel Distribution</h2>

            <div className="flex items-center gap-6 mt-3">
              <div className="h-[100px] w-[100px] relative flex items-center justify-center flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderSourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={45}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {orderSourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 text-xs flex-1">
                {orderSourceData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between font-semibold text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </div>
                    <span className="text-slate-950 font-bold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feedback & reviews list */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Recent Guest Feedback</h2>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              {[
                { name: 'Amit Kumar', rate: 5, comment: 'Paneer butter masala was absolutely outstanding! Best service.', time: '2 mins ago' },
                { name: 'Pooja Mehta', rate: 4, comment: 'Great ambience and food. Dine-in QR was slightly slow to load.', time: '15 mins ago' },
              ].map((feedback, i) => (
                <div key={i} className="border-b border-slate-50 last:border-0 pb-3 last:pb-0 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-900 font-bold">{feedback.name}</span>
                    <span className="text-slate-400 text-[9px]">{feedback.time}</span>
                  </div>
                  <div className="flex gap-0.5 text-amber-500">
                    {Array.from({ length: feedback.rate }).map((_, idx) => (
                      <Star key={idx} size={11} className="fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-slate-600 mt-1 leading-relaxed">{feedback.comment}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
