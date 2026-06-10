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
  ClipboardList,
  UserCheck,
  CheckCircle,
  BarChart3,
  Star,
  Award,
  Bell,
  Settings,
  Calendar,
  ChevronDown,
  Download,
  AlertTriangle,
  Play
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
  Bar
} from 'recharts';

import { getRestaurant } from '@/services/restaurant.service';

// Mock charts data
const revenueData = [
  { day: '01 May', revenue: 25000 },
  { day: '05 May', revenue: 32000 },
  { day: '10 May', revenue: 22000 },
  { day: '15 May', revenue: 38000 },
  { day: '20 May', revenue: 30000 },
  { day: '25 May', revenue: 42000 },
  { day: '31 May', revenue: 50000 },
];

const orderStatusData = [
  { name: 'Pending', value: 12, percentage: '1.0%', color: '#fbbf24' },
  { name: 'Confirmed', value: 245, percentage: '19.7%', color: '#3b82f6' },
  { name: 'Preparing', value: 458, percentage: '36.8%', color: '#f97316' },
  { name: 'Ready', value: 320, percentage: '25.7%', color: '#06b6d4' },
  { name: 'Completed', value: 190, percentage: '15.3%', color: '#8b5cf6' },
  { name: 'Cancelled', value: 20, percentage: '1.5%', color: '#ef4444' },
];

const salesOverviewData = [
  { date: '01 May', sales: 40000 },
  { date: '03 May', sales: 48000 },
  { date: '05 May', sales: 30000 },
  { date: '07 May', sales: 52000 },
  { date: '09 May', sales: 38000 },
  { date: '11 May', sales: 45000 },
  { date: '13 May', sales: 62000 },
  { date: '15 May', sales: 31000 },
  { date: '17 May', sales: 50000 },
  { date: '19 May', sales: 58000 },
  { date: '21 May', sales: 42000 },
  { date: '23 May', sales: 39000 },
  { date: '25 May', sales: 55000 },
  { date: '27 May', sales: 49000 },
  { date: '29 May', sales: 65000 },
  { date: '31 May', sales: 72000 },
];

const orderSourceData = [
  { name: 'Dine In', value: 65, color: '#8b5cf6' },
  { name: 'QR Code Order', value: 20, color: '#38bdf8' },
  { name: 'Takeaway', value: 10, color: '#f97316' },
  { name: 'Home Delivery', value: 5, color: '#10b981' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [restaurantName, setRestaurantName] = useState('Spice Corner');

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
      const payload = decodeJwt(token);
      if (payload && payload.restaurantId) {
        try {
          const rest = await getRestaurant(payload.restaurantId);
          if (rest) {
            setRestaurantName(rest.name);
            localStorage.setItem('restaurantName', rest.name);
            // Dispatch a local storage event so other components (like Sidebar) update immediately
            window.dispatchEvent(new Event('storage'));
          }
        } catch (err) {
          console.error('Failed to load restaurant details:', err);
        }
      }
    };
    void loadRest();
  }, [router]);

  return (
    <div className="space-y-6 text-slate-900 bg-[#F6F8FD] p-1">
      
      {/* TITLE & TOP CONTROLS */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            Dashboard 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 font-bold">Welcome back to {restaurantName}, Rohit Sharma</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 cursor-pointer transition text-sm font-black text-slate-700 shadow-sm">
            <Calendar size={16} className="text-slate-500" />
            <span>01 May 2024 - 31 May 2024</span>
            <ChevronDown size={14} className="text-slate-500" />
          </div>

          <button className="bg-[#5850ec] hover:bg-[#4b45cc] text-white px-5 py-3 rounded-xl text-sm font-black flex items-center gap-2 active:scale-95 transition-all shadow-md shadow-indigo-600/10">
            <Download size={16} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* METRICS ROW (6 CARDS) */}
      <section className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {/* TOTAL ORDERS */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition duration-200">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 text-[#8b5cf6] flex items-center justify-center flex-shrink-0">
            <ShoppingCart size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-black uppercase tracking-wider">Total Orders</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">1,245</h3>
            <span className="text-xs text-emerald-600 font-black mt-1.5 block">↑ 18.5% <span className="text-slate-400 font-extrabold">prev</span></span>
          </div>
        </div>

        {/* TOTAL REVENUE */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition duration-200">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 font-black text-2xl">
            ₹
          </div>
          <div>
            <p className="text-xs text-slate-500 font-black uppercase tracking-wider">Total Revenue</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">₹2,45,800</h3>
            <span className="text-xs text-emerald-600 font-black mt-1.5 block">↑ 22.7% <span className="text-slate-400 font-extrabold">prev</span></span>
          </div>
        </div>

        {/* TOTAL PROFIT */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition duration-200">
          <div className="w-12 h-12 rounded-2xl bg-[#E0B7F4]/10 text-purple-700 flex items-center justify-center flex-shrink-0 font-black">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-black uppercase tracking-wider">Total Profit</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">₹95,400</h3>
            <span className="text-xs text-emerald-600 font-black mt-1.5 block">↑ 20.3% <span className="text-slate-400 font-extrabold">prev</span></span>
          </div>
        </div>

        {/* TOTAL CUSTOMERS */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition duration-200">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-black uppercase tracking-wider">Total Customers</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">856</h3>
            <span className="text-xs text-emerald-600 font-black mt-1.5 block">↑ 16.2% <span className="text-slate-400 font-extrabold">prev</span></span>
          </div>
        </div>

        {/* PENDING ORDERS */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition duration-200">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0">
            <ShoppingCart size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-black uppercase tracking-wider">Pending Orders</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">12</h3>
            <span className="text-xs text-rose-600 font-black mt-1.5 block">↓ 5.2% <span className="text-slate-400 font-extrabold">prev</span></span>
          </div>
        </div>

        {/* TOTAL TABLES */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition duration-200">
          <div className="w-12 h-12 rounded-2xl bg-[#B9E9E9]/10 text-teal-700 flex items-center justify-center flex-shrink-0 font-black">
            <Layers size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-black uppercase tracking-wider">Total Tables</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">20</h3>
            <span className="text-xs text-[#0f766e] font-black mt-1.5 block">12 Available</span>
          </div>
        </div>
      </section>

      {/* MIDDLE CHARTS ROW */}
      <div className="grid gap-6 lg:grid-cols-[2.2fr_1fr_1.1fr]">
        
        {/* REVENUE OVERVIEW */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">Revenue Overview</h2>
            <div className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 rounded-xl bg-white text-sm font-black text-slate-700 cursor-pointer shadow-sm hover:bg-slate-50 transition">
              <span>Monthly</span>
              <ChevronDown size={12} />
            </div>
          </div>

          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ORDERS STATUS DONUT */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5 flex flex-col justify-between">
          <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">Orders Status</h2>
          
          <div className="relative h-[130px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={56}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xl font-black text-slate-900 leading-none">1,245</span>
              <span className="text-[10px] text-slate-500 font-black mt-1 uppercase tracking-wider">Total</span>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            {orderStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between font-black text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-900 font-black">
                  <span>{item.value}</span>
                  <span className="text-slate-400 font-bold">({item.percentage})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ORDERS LIST */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">Recent Orders</h2>
            <button className="text-sm font-black text-[#5850ec] hover:underline" onClick={() => router.push('/dashboard/orders')}>
              View All
            </button>
          </div>

          <div className="space-y-3.5">
            {[
              { id: '#ORD1258', table: 'Table 5', total: '₹1,250', status: 'Completed', time: '2 mins ago', color: 'bg-emerald-50 text-emerald-600' },
              { id: '#ORD1257', table: 'Table 2', total: '₹850', status: 'Preparing', time: '15 mins ago', color: 'bg-orange-50 text-orange-500' },
              { id: '#ORD1256', table: 'Table 7', total: '₹1,450', status: 'Confirmed', time: '20 mins ago', color: 'bg-blue-50 text-blue-600' },
              { id: '#ORD1255', table: 'Table 3', total: '₹950', status: 'Completed', time: '30 mins ago', color: 'bg-emerald-50 text-emerald-600' },
              { id: '#ORD1254', table: 'Table 1', total: '₹1,150', status: 'Preparing', time: '45 mins ago', color: 'bg-orange-50 text-orange-500' },
            ].map((order) => (
              <div key={order.id} className="flex justify-between items-center text-sm font-black">
                <div>
                  <p className="text-slate-900 text-base font-black">{order.id}</p>
                  <p className="text-slate-500 text-xs font-bold mt-0.5">{order.time}</p>
                </div>
                <span className="text-slate-700 font-black">{order.table}</span>
                <span className="text-slate-900 font-black">{order.total}</span>
                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${order.color}`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* QUICK ACTIONS ROW */}
      <section className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
        {[
          { label: 'Add New Menu', icon: UtensilsCrossed, bg: 'bg-violet-50 text-[#8b5cf6]', path: '/dashboard/menu' },
          { label: 'Manage Tables', icon: Layers, bg: 'bg-blue-50 text-blue-600', path: '/dashboard/qr-tables' },
          { label: 'Generate QR', icon: QrCode, bg: 'bg-cyan-50 text-cyan-600', path: '/dashboard/qr-tables' },
          { label: 'Manage Offers', icon: Gift, bg: 'bg-orange-50 text-orange-500', path: '/dashboard/menu' },
          { label: 'Inventory', icon: Package, bg: 'bg-rose-50 text-rose-500', path: '/dashboard/inventory' },
          { label: 'Staff Management', icon: UserCheck, bg: 'bg-emerald-50 text-emerald-600', path: '/dashboard/staff' },
          { label: 'Reports', icon: BarChart3, bg: 'bg-indigo-50 text-indigo-600', path: '/dashboard/analytics' },
        ].map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.label}
              onClick={() => router.push(act.path)}
              className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 rounded-2xl transition-all duration-200 active:scale-95 flex-shrink-0"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${act.bg}`}>
                <Icon size={18} />
              </div>
              <span className="text-sm font-black text-slate-800">{act.label}</span>
            </button>
          );
        })}
      </section>

      {/* BOTTOM ROW */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* COLUMN 1: TOP SELLING ITEMS & RESERVATIONS */}
        <div className="space-y-6">
          {/* TOP SELLING ITEMS */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">Top Selling Items</h2>
              <button className="text-sm font-black text-[#5850ec] hover:underline" onClick={() => router.push('/dashboard/menu')}>
                View All
              </button>
            </div>
            
            <div className="space-y-3">
              {[
                { name: 'Paneer Butter Masala', count: 245, sales: '₹48,500' },
                { name: 'Veg Biryani', count: 210, sales: '₹37,800' },
                { name: 'Margherita Pizza', count: 185, sales: '₹29,600' },
                { name: 'Masala Dosa', count: 162, sales: '₹24,300' },
                { name: 'Veg Burger', count: 140, sales: '₹16,800' },
              ].map((item) => (
                <div key={item.name} className="flex justify-between items-center text-sm font-black text-slate-700">
                  <span className="text-slate-900 line-clamp-1 text-sm font-black">{item.name}</span>
                  <span className="text-slate-500 font-extrabold text-xs">{item.count} orders</span>
                  <span className="text-slate-900 font-black text-sm">{item.sales}</span>
                </div>
              ))}
            </div>
          </div>

          {/* UPCOMING RESERVATIONS */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">Upcoming Reservations</h2>
              <button className="text-sm font-black text-[#5850ec] hover:underline" onClick={() => router.push('/dashboard/reservations')}>
                View All
              </button>
            </div>

            <div className="space-y-3.5">
              {[
                { table: 'Table 4', name: 'Rahul Verma', time: '02 May, 7:30 PM', guests: '4 Guests', status: 'Confirmed', color: 'bg-emerald-50 text-emerald-600' },
                { table: 'Table 7', name: 'Priya Singh', time: '02 May, 8:00 PM', guests: '2 Guests', status: 'Confirmed', color: 'bg-emerald-50 text-emerald-600' },
                { table: 'Table 2', name: 'Karan Patel', time: '02 May, 8:30 PM', guests: '6 Guests', status: 'Pending', color: 'bg-yellow-50 text-yellow-500' },
              ].map((res, i) => (
                <div key={i} className="flex justify-between items-center text-sm font-extrabold text-slate-800">
                  <div className="w-16">
                    <p className="text-slate-900 font-black text-sm">{res.table}</p>
                  </div>
                  <div className="flex-1 px-2">
                    <p className="text-slate-900 font-black text-sm line-clamp-1">{res.name}</p>
                    <p className="text-slate-500 text-xs font-extrabold mt-0.5">{res.time}</p>
                  </div>
                  <span className="text-slate-600 font-extrabold w-16 text-sm">{res.guests}</span>
                  <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${res.color}`}>
                    {res.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 2: SALES OVERVIEW BAR & LOW STOCK */}
        <div className="space-y-6">
          {/* SALES OVERVIEW BAR */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">Sales Overview</h2>
              <button className="text-sm font-black text-[#5850ec] hover:underline" onClick={() => router.push('/dashboard/analytics')}>
                View All
              </button>
            </div>

            <div className="h-[148px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesOverviewData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* LOW STOCK ALERT */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">Low Stock Alert</h2>
              <button className="text-sm font-black text-[#5850ec] hover:underline" onClick={() => router.push('/dashboard/inventory')}>
                View All
              </button>
            </div>

            <div className="space-y-3.5">
              {[
                { name: 'Tomato', value: '5 kg left', status: 'Critical', color: 'bg-rose-50 text-rose-500' },
                { name: 'Cheese', value: '2 kg left', status: 'Low', color: 'bg-yellow-50 text-yellow-550' },
                { name: 'Onion', value: '3 kg left', status: 'Low', color: 'bg-yellow-50 text-yellow-550' },
                { name: 'Oil', value: '4 ltr left', status: 'Low', color: 'bg-yellow-50 text-yellow-550' },
              ].map((item) => (
                <div key={item.name} className="flex justify-between items-center text-sm font-black text-slate-800">
                  <span className="text-slate-900 font-black text-sm">{item.name}</span>
                  <span className="text-slate-500 font-extrabold text-sm">{item.value}</span>
                  <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${item.color}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 3: ORDER SOURCE DONUT & RECENT FEEDBACK */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5 flex flex-col justify-between">
            <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">Order Source</h2>

            <div className="flex items-center gap-6">
              <div className="h-[120px] w-[120px] relative flex items-center justify-center flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderSourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={32}
                      outerRadius={50}
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

              <div className="space-y-2.5 text-sm flex-1">
                {orderSourceData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between font-black text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-slate-900 font-black text-sm">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RECENT FEEDBACK */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">Recent Feedback</h2>
              <button className="text-sm font-black text-[#5850ec] hover:underline" onClick={() => router.push('/dashboard/waiter')}>
                View All
              </button>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Amit Kumar', rate: 5, comment: 'Great food and excellent service!', time: '2 mins ago' },
                { name: 'Pooja Mehta', rate: 5, comment: 'Food was good. But waiting time little long.', time: '15 mins ago' },
              ].map((feedback, i) => (
                <div key={i} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0 font-extrabold space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-900 font-black text-base">{feedback.name}</span>
                    <span className="text-slate-500 text-xs font-extrabold">{feedback.time}</span>
                  </div>
                  <div className="flex gap-0.5 text-yellow-400">
                    {Array.from({ length: feedback.rate }).map((_, idx) => (
                      <Star key={idx} size={14} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 font-black leading-relaxed mt-1 text-sm">{feedback.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
