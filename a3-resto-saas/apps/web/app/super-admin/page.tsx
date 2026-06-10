'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  Store,
  UtensilsCrossed,
  CreditCard,
  Users,
  ShoppingCart,
  TrendingUp,
  BarChart3,
  Sliders,
  Palette,
  QrCode,
  Package,
  DollarSign,
  UserCheck,
  Star,
  HelpCircle,
  Settings,
  Activity,
  AlignLeft,
  Search,
  Bell,
  ChevronDown,
  Download,
  Crown,
  Plus,
  X,
  ToggleLeft,
  ToggleRight,
  Calendar,
  CheckCircle,
  XCircle,
  Shield,
  ArrowUpRight
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
  Cell
} from 'recharts';

import {
  getRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
} from '@/services/restaurant.service';
import type { Restaurant } from '@/src/types/restaurant.types';

type LocalTenant = {
  id: string;
  name: string;
  owner: string;
  plan: 'Starter' | 'Pro' | 'Enterprise';
  status: 'Approved' | 'Pending' | 'Suspended';
  mrr: string;
  expiresAt: string;
  features: {
    aiInsights: boolean;
    customLayouts: boolean;
    advancedPos: boolean;
    delivery: boolean;
  };
};

const comparisonData = [
  { day: '01 May', revenue: 180000, expenses: 100000 },
  { day: '05 May', revenue: 210000, expenses: 110000 },
  { day: '10 May', revenue: 190000, expenses: 120000 },
  { day: '15 May', revenue: 310000, expenses: 150000 },
  { day: '20 May', revenue: 250000, expenses: 140000 },
  { day: '25 May', revenue: 290000, expenses: 130000 },
  { day: '31 May', revenue: 380000, expenses: 160000 },
];

const subOverviewData = [
  { name: 'Enterprise', value: 86, color: '#8b5cf6' },
  { name: 'Professional', value: 92, color: '#38bdf8' },
  { name: 'Starter', value: 78, color: '#10b981' },
];

const orderStatusData = [
  { name: 'Pending', value: 1245, percentage: '4.8%', color: '#fbbf24' },
  { name: 'Confirmed', value: 8542, percentage: '33.2%', color: '#3b82f6' },
  { name: 'Preparing', value: 7654, percentage: '29.8%', color: '#f97316' },
  { name: 'Ready', value: 5623, percentage: '21.9%', color: '#06b6d4' },
  { name: 'Completed', value: 2321, percentage: '9.0%', color: '#8b5cf6' },
  { name: 'Cancelled', value: 304, percentage: '1.2%', color: '#ef4444' },
];

export default function SuperAdminPage() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<
    | 'dashboard'
    | 'restaurants'
    | 'subscriptions'
    | 'settings'
    | 'logs'
  >('dashboard');

  const [tenants, setTenants] = useState<LocalTenant[]>([]);
  const [loading, setLoading] = useState(true);

  const [pricingPlans, setPricingPlans] = useState([
    { id: 'starter', name: 'Starter Plan', price: '999', duration: 'month' },
    { id: 'pro', name: 'Pro Plan', price: '2999', duration: 'month' },
    { id: 'enterprise', name: 'Enterprise Plan', price: 'Custom', duration: 'contract' },
  ]);

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [platformFee, setPlatformFee] = useState(2.5);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Tenant Form State
  const [newRestName, setNewRestName] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [newPlan, setNewPlan] = useState<'Starter' | 'Pro' | 'Enterprise'>('Pro');

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const list = await getRestaurants();
      const mapped = list.map((item: any) => {
        const sub = item.subscriptions?.[0];
        const planName = sub?.planName || 'Pro';
        const expiresAt = sub?.currentPeriodEnd ? sub.currentPeriodEnd.split('T')[0] : '2026-12-31';
        return {
          id: item.id,
          name: item.name,
          owner: item.location || 'Rohan Das',
          plan: planName as any,
          status: (item.isActive ? 'Approved' : 'Suspended') as any,
          mrr: planName === 'Starter' ? 'Rs. 999' : planName === 'Pro' ? 'Rs. 2999' : 'Custom',
          expiresAt,
          features: {
            aiInsights: planName !== 'Starter',
            customLayouts: true,
            advancedPos: planName === 'Enterprise',
            delivery: false,
          },
        };
      });
      setTenants(mapped);
    } catch (error) {
      console.error('Failed to load restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    void loadRestaurants();
  }, [router]);

  const addRestaurant = async () => {
    if (!newRestName || !newOwner) return;
    try {
      await createRestaurant({
        name: newRestName,
        location: newOwner,
        planName: newPlan,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 Year subscription
      });
      setNewRestName('');
      setNewOwner('');
      setShowAddModal(false);
      await loadRestaurants();
    } catch (err) {
      console.error(err);
      alert('Failed to register restaurant tenant.');
    }
  };

  const toggleFeature = (tenantId: string, feature: keyof LocalTenant['features']) => {
    setTenants(
      tenants.map((t) => {
        if (t.id === tenantId) {
          return {
            ...t,
            features: {
              ...t.features,
              [feature]: !t.features[feature],
            },
          };
        }
        return t;
      })
    );
  };

  const updateStatus = async (tenantId: string, status: LocalTenant['status']) => {
    try {
      await updateRestaurant(tenantId, { isActive: status === 'Approved' });
      await loadRestaurants();
    } catch (err) {
      console.error(err);
      alert('Failed to update tenant status.');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F6F8FD] text-slate-900 font-sans select-none overflow-x-hidden">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-[#E0B7F4]/20 via-[#BFDEF3]/25 to-[#B9E9E9]/25 text-slate-800 p-5 flex flex-col justify-between border-r border-[#E0B7F4]/20 flex-shrink-0">
        <div className="flex flex-col">
          {/* LOGO */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <img src="/ak-resto-logo.png" alt="A.K Resto Logo" className="w-9 h-9 object-contain rounded-xl shadow-sm" />
            <div>
              <h1 className="text-sm font-black tracking-tight leading-none text-slate-900">A.K Resto</h1>
              <span className="text-[9px] text-[#8b5cf6] font-black uppercase tracking-wider mt-1 block">Super Admin Panel</span>
            </div>
          </div>

          {/* SIDEBAR NAVIGATION (17 Links matching mockup) */}
          <nav className="space-y-0.5 max-h-[70vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-purple-200/50 scrollbar-track-transparent">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'restaurants', label: 'Restaurants', icon: Store },
              { id: 'subscriptions', label: 'Subscriptions', icon: Crown },
              { id: 'users', label: 'Users & Roles', icon: Users },
              { id: 'orders', label: 'Orders', icon: ShoppingCart },
              { id: 'payments', label: 'Payments', icon: CreditCard },
              { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
              { id: 'features', label: 'Restaurant Features', icon: Sliders },
              { id: 'themes', label: 'Themes & Templates', icon: Palette },
              { id: 'qrcode', label: 'QR Code Manager', icon: QrCode },
              { id: 'inventory', label: 'Inventory Requests', icon: Package },
              { id: 'expenses', label: 'Expense Manager', icon: DollarSign },
              { id: 'attendance', label: 'Staff Attendance', icon: UserCheck },
              { id: 'feedback', label: 'Feedback & Reviews', icon: Star },
              { id: 'tickets', label: 'Support Tickets', icon: HelpCircle },
              { id: 'settings', label: 'System Settings', icon: Settings },
              { id: 'logs', label: 'Logs & Activity', icon: Activity },
            ].map((item) => {
              const Icon = item.icon;
              const isActive =
                (item.id === 'dashboard' && currentView === 'dashboard') ||
                (item.id === 'restaurants' && currentView === 'restaurants') ||
                (item.id === 'subscriptions' && currentView === 'subscriptions') ||
                (item.id === 'settings' && currentView === 'settings') ||
                (item.id === 'logs' && currentView === 'logs');

              const routeHandler = () => {
                if (['dashboard', 'restaurants', 'subscriptions', 'settings', 'logs'].includes(item.id)) {
                  setCurrentView(item.id as any);
                } else {
                  alert(`${item.label} view is customized for this session via settings.`);
                }
              };

              return (
                <button
                  key={item.id}
                  onClick={routeHandler}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-black transition-all duration-150 text-left
                  ${
                    isActive
                      ? 'bg-[#BFDEF3] text-[#1e3a8a] shadow-sm shadow-[#BFDEF3]/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-purple-500/5'
                  }`}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM ENTERPRISE CARD */}
        <div className="mt-6 pt-4 border-t border-slate-200/60">
          <div className="bg-white border border-[#BFDEF3] rounded-2xl p-4 relative overflow-hidden shadow-sm">
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-gradient-to-tr from-[#8b5cf6]/5 to-[#38bdf8]/5 rounded-full blur-xl" />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-violet-500/10 flex items-center justify-center text-[#8b5cf6]">
                  <Shield size={15} />
                </div>
                <div>
                  <h3 className="font-extrabold text-[11px] text-slate-900">Enterprise Plan</h3>
                  <p className="text-[8px] text-slate-500 font-extrabold mt-0.5">Valid till : 30 Dec 2026</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] font-extrabold text-slate-500">
                  <span>Usage: 78%</span>
                  <span>780 / 1,000 Nodes</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#8b5cf6] to-[#38bdf8] h-full rounded-full" style={{ width: '78%' }} />
                </div>
              </div>

              <button className="w-full bg-[#B9E9E9] hover:bg-[#a5dbdb] text-[#0f766e] text-[9px] py-2.5 rounded-xl font-black border border-[#B9E9E9]/20 active:scale-95 transition-all">
                View Plan Details
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* RIGHT WORKSPACE */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        
        {/* TOP BAR */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-500 transition active:scale-95 sm:hidden">
              <AlignLeft size={18} />
            </button>
            
            {/* SEARCH */}
            <div className="relative max-w-md w-full hidden sm:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                placeholder="Search restaurants, users, orders..."
                className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2.5 rounded-xl text-xs outline-none text-slate-700 focus:border-[#BFDEF3] focus:bg-white transition"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* BELL */}
            <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-500 transition active:scale-95 relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-4 h-4 bg-yellow-500 text-white rounded-full flex items-center justify-center text-[8px] font-black leading-none border border-white">
                12
              </span>
            </button>

            {/* GEAR */}
            <button onClick={() => setCurrentView('settings')} className="p-2 hover:bg-slate-50 rounded-xl text-slate-500 transition active:scale-95">
              <Settings size={18} />
            </button>

            <div className="h-8 w-[1px] bg-slate-100" />

            {/* PROFILE */}
            <div className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50/50 p-1 rounded-xl transition">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#8b5cf6] to-[#38bdf8] flex items-center justify-center text-white text-xs font-black border border-slate-200">
                SA
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-black text-slate-800 leading-none">Super Admin</p>
                <p className="text-[9px] text-zinc-400 font-extrabold mt-1 leading-none">Owner</p>
              </div>
              <ChevronDown size={12} className="text-slate-400 group-hover:translate-y-0.5 transition-transform" />
            </div>
          </div>
        </header>

        {/* VIEW ROUTER */}
        <main className="p-6 flex-1 space-y-6">
          
          {currentView === 'dashboard' && (
            <>
              {/* TITLE & EXPORT */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
                    Dashboard 👋
                  </h1>
                  <p className="text-sm text-slate-500 mt-1.5 font-bold">Welcome back, Super Admin</p>
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

              {/* METRICS ROW */}
              <section className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                {/* TOTAL RESTAURANTS */}
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition duration-200">
                  <div className="w-12 h-12 rounded-2xl bg-violet-50 text-[#8b5cf6] flex items-center justify-center flex-shrink-0">
                    <Store size={22} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-black uppercase tracking-wider">Total Restaurants</p>
                    <h3 className="text-2xl font-black text-slate-900 mt-1">256</h3>
                    <span className="text-xs text-emerald-600 font-black mt-1.5 block">↑ +12 <span className="text-slate-400 font-extrabold">prev</span></span>
                  </div>
                </div>

                {/* ACTIVE RESTAURANTS */}
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition duration-200">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Store size={22} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-black uppercase tracking-wider">Active Restaurants</p>
                    <h3 className="text-2xl font-black text-slate-900 mt-1">198</h3>
                    <span className="text-xs text-emerald-600 font-black mt-1.5 block">↑ +8 <span className="text-slate-400 font-extrabold">prev</span></span>
                  </div>
                </div>

                {/* TOTAL ORDERS */}
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition duration-200">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <ShoppingCart size={22} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-black uppercase tracking-wider">Total Orders</p>
                    <h3 className="text-2xl font-black text-slate-900 mt-1">25,689</h3>
                    <span className="text-xs text-emerald-600 font-black mt-1.5 block">↑ 18.5% <span className="text-slate-400 font-extrabold">prev</span></span>
                  </div>
                </div>

                {/* TOTAL REVENUE */}
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition duration-200">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0 font-black text-2xl">
                    ₹
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-black uppercase tracking-wider">Total Revenue</p>
                    <h3 className="text-2xl font-black text-slate-900 mt-1">₹48,75,890</h3>
                    <span className="text-xs text-emerald-600 font-black mt-1.5 block">↑ 22.7% <span className="text-slate-400 font-extrabold">prev</span></span>
                  </div>
                </div>

                {/* TOTAL PROFIT */}
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition duration-200">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0 font-black">
                    <TrendingUp size={22} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-black uppercase tracking-wider">Total Profit</p>
                    <h3 className="text-2xl font-black text-slate-900 mt-1">₹18,45,230</h3>
                    <span className="text-xs text-emerald-600 font-black mt-1.5 block">↑ 20.3% <span className="text-slate-400 font-extrabold">prev</span></span>
                  </div>
                </div>

                {/* EXPIRING SOON */}
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition duration-200">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0">
                    <Calendar size={22} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-black uppercase tracking-wider">Expiring Soon</p>
                    <h3 className="text-2xl font-black text-slate-900 mt-1">14</h3>
                    <span className="text-xs text-slate-500 font-extrabold mt-1.5 block">Subscriptions</span>
                  </div>
                </div>
              </section>

              {/* MIDDLE ROW (LINE CHART, DONUT CHART, RECENT NOTIFICATIONS) */}
              <div className="grid gap-6 lg:grid-cols-[2.2fr_1fr_1.1fr]">
                {/* DUAL LINE CHART (REVENUE & EXPENSES) */}
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
                      <AreaChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="day" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                        <Tooltip />
                        <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={0.03} fill="#10b981" />
                        <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} fillOpacity={0.03} fill="#ef4444" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* ORDERS STATUS OVERVIEW */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5 flex flex-col justify-between">
                  <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">Orders Status</h2>

                  <div className="relative h-[120px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={orderStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={36}
                          outerRadius={52}
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
                      <span className="text-xl font-black text-slate-900 leading-none">25,689</span>
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

                {/* RECENT NOTIFICATIONS */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
                  <div className="flex justify-between items-center">
                    <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">Recent Alerts</h2>
                    <button className="text-sm font-black text-[#5850ec] hover:underline">View All</button>
                  </div>

                  <div className="space-y-4">
                    {[
                      { title: 'New restaurant "Spice Corner" registered', time: '15 mins ago', badge: 'New', color: 'bg-emerald-50 text-emerald-600' },
                      { title: 'Payment received from "Food Plaza"', time: '1 hour ago', badge: 'Payment', color: 'bg-indigo-50 text-indigo-600' },
                      { title: 'Subscription expired - "Tasty Bites"', time: '2 hours ago', badge: 'Alert', color: 'bg-rose-50 text-rose-550' },
                      { title: 'Low stock alert in "Pizza House"', time: '3 hours ago', badge: 'Alert', color: 'bg-yellow-50 text-yellow-600' },
                      { title: 'New review received for "Burger Hub"', time: '5 hours ago', badge: 'Review', color: 'bg-emerald-50 text-emerald-600' },
                    ].map((n, i) => (
                      <div key={i} className="text-sm border-b border-slate-100 last:border-0 pb-3 last:pb-0 font-extrabold">
                        <div className="flex justify-between items-start gap-2">
                          <p className="text-slate-900 leading-tight flex-1 font-black">{n.title}</p>
                          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${n.color}`}>
                            {n.badge}
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs font-bold mt-1.5">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* QUICK ACTIONS */}
              <section className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
                {[
                  { label: 'Create Restaurant', icon: Store, bg: 'bg-violet-50 text-[#5850ec]', action: () => setCurrentView('restaurants') },
                  { label: 'Manage Subscription', icon: Crown, bg: 'bg-blue-50 text-blue-600', action: () => setCurrentView('subscriptions') },
                  { label: 'Generate QR Code', icon: QrCode, bg: 'bg-cyan-50 text-cyan-600', action: () => setCurrentView('settings') },
                  { label: 'Theme & Templates', icon: Palette, bg: 'bg-orange-50 text-orange-500', action: () => setCurrentView('settings') },
                  { label: 'Manage Features', icon: Sliders, bg: 'bg-rose-50 text-rose-500', action: () => setCurrentView('restaurants') },
                  { label: 'System Users', icon: Users, bg: 'bg-emerald-50 text-emerald-600', action: () => setCurrentView('restaurants') },
                ].map((act) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={act.label}
                      onClick={act.action}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 rounded-2xl transition-all duration-200 active:scale-95 flex-shrink-0"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${act.bg}`}>
                        <Icon size={16} />
                      </div>
                      <span className="text-sm font-black text-slate-800">{act.label}</span>
                    </button>
                  );
                })}
              </section>

              {/* BOTTOM COLUMNS */}
              <div className="grid gap-6 lg:grid-cols-[2.2fr_1fr_1.1fr]">
                {/* TOP PERFORMING RESTAURANTS */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
                  <div className="flex justify-between items-center">
                    <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">Top Performing Restaurants</h2>
                    <button className="text-sm font-black text-[#5850ec] hover:underline">View All</button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm font-black text-slate-700 border-collapse">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-100">
                          <th className="pb-3 text-xs uppercase tracking-wider font-black">Restaurant Name</th>
                          <th className="pb-3 text-xs uppercase tracking-wider font-black">Orders</th>
                          <th className="pb-3 text-xs uppercase tracking-wider font-black">Revenue</th>
                          <th className="pb-3 text-xs uppercase tracking-wider font-black">Profit</th>
                          <th className="pb-3 text-xs uppercase tracking-wider font-black">Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: 'Spice Corner', orders: '1,245', rev: '₹2,45,800', profit: '₹95,400', rate: '4.8' },
                          { name: 'Food Plaza', orders: '1,120', rev: '₹2,15,600', profit: '₹82,300', rate: '4.6' },
                          { name: 'Tasty Bites', orders: '980', rev: '₹1,85,400', profit: '₹71,200', rate: '4.5' },
                          { name: 'Burger Hub', orders: '875', rev: '₹1,65,700', profit: '₹62,450', rate: '4.4' },
                          { name: 'Pizza House', orders: '760', rev: '₹1,45,300', profit: '₹55,600', rate: '4.3' },
                        ].map((res, i) => (
                          <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                            <td className="py-3 text-slate-900 font-black text-sm">{res.name}</td>
                            <td className="text-slate-600 font-extrabold text-sm">{res.orders}</td>
                            <td className="text-slate-900 font-black text-sm">{res.rev}</td>
                            <td className="text-emerald-600 font-black text-sm">{res.profit}</td>
                            <td className="text-amber-500 font-black text-sm">⭐ {res.rate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* SUBSCRIPTION OVERVIEW */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5 flex flex-col justify-between">
                  <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">Subscription Tier</h2>

                  <div className="relative h-[110px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={subOverviewData}
                          cx="50%"
                          cy="50%"
                          innerRadius={28}
                          outerRadius={45}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {subOverviewData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-base font-black text-slate-900 leading-none">256</span>
                      <span className="text-[9px] text-slate-400 font-black mt-1 uppercase tracking-wider">Total</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    {subOverviewData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between font-black text-slate-700">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span>{item.name}</span>
                        </div>
                        <span className="text-slate-900 font-black">{item.value} ({Math.round((item.value / 256) * 100)}%)</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* UPCOMING EXPIRY LIST */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
                  <div className="flex justify-between items-center">
                    <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">Subscription Expiry</h2>
                    <button className="text-sm font-black text-[#5850ec] hover:underline">View All</button>
                  </div>

                  <div className="space-y-3.5">
                    {[
                      { name: 'Tasty Bites', plan: 'Enterprise Plan', date: '02 Jun 2024', days: '3 Days Left', color: 'bg-rose-50 text-rose-600' },
                      { name: 'Food Plaza', plan: 'Professional Plan', date: '05 Jun 2024', days: '6 Days Left', color: 'bg-rose-50 text-rose-600' },
                      { name: 'Burger Hub', plan: 'Professional Plan', date: '08 Jun 2024', days: '9 Days Left', color: 'bg-rose-50 text-rose-600' },
                      { name: 'Pizza House', plan: 'Starter Plan', date: '12 Jun 2024', days: '13 Days Left', color: 'bg-yellow-50 text-yellow-600 font-black' },
                      { name: 'Spice Corner', plan: 'Enterprise Plan', date: '15 Jun 2024', days: '16 Days Left', color: 'bg-yellow-50 text-yellow-600 font-black' },
                    ].map((exp, i) => (
                      <div key={i} className="flex justify-between items-center text-sm font-extrabold">
                        <div className="flex-1 pr-2">
                          <p className="text-slate-900 line-clamp-1 font-black">{exp.name}</p>
                          <p className="text-slate-500 text-xs font-bold mt-0.5">{exp.plan}</p>
                        </div>
                        <span className="text-slate-400 text-xs w-16 text-center">{exp.date}</span>
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase flex-shrink-0 tracking-wider ${exp.color}`}>
                          {exp.days}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* FOOTER METRICS ROW (6 CARDS) */}
              <section className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-t border-slate-200 pt-6">
                {[
                  { label: 'Total Staff', val: '1,245', icon: UserCheck, color: 'text-violet-600 bg-violet-50' },
                  { label: 'Total Customers', val: '45,689', icon: Users, color: 'text-blue-600 bg-blue-50' },
                  { label: 'Total Dishes', val: '1,245', icon: UtensilsCrossed, color: 'text-emerald-600 bg-emerald-50' },
                  { label: 'Total Tables', val: '856', icon: Layers, color: 'text-orange-500 bg-orange-50' },
                  { label: 'Total Inventory Items', val: '568', icon: Package, color: 'text-rose-500 bg-rose-50' },
                  { label: 'Total Feedback', val: '2,458', icon: Star, color: 'text-cyan-600 bg-cyan-50' },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition duration-200">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.color}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-black uppercase tracking-wider">{stat.label}</p>
                        <h3 className="text-sm font-black text-slate-900 mt-0.5">{stat.val}</h3>
                      </div>
                    </div>
                  );
                })}
              </section>
            </>
          )}

          {/* RESTAURANTS VIEW */}
          {currentView === 'restaurants' && (
            <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
              {/* TENANTS LIST */}
              <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Registered Restaurant Tenants</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage global system access and plan parameters.</p>
                  </div>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-[#5850ec] hover:bg-[#4b45cc] text-white px-5 py-3 rounded-xl text-sm font-black flex items-center gap-2 active:scale-95 transition-all shadow-md shadow-indigo-600/10"
                  >
                    <Plus size={16} /> Add Restaurant
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm font-black text-slate-700">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400">
                        <th className="py-3 font-black text-xs uppercase tracking-wider">Restaurant</th>
                        <th className="font-black text-xs uppercase tracking-wider">Owner</th>
                        <th className="font-black text-xs uppercase tracking-wider">Plan</th>
                        <th className="font-black text-xs uppercase tracking-wider">Status</th>
                        <th className="font-black text-xs uppercase tracking-wider">Expiry</th>
                        <th className="font-black text-xs uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tenants.map((t) => (
                        <tr key={t.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                          <td className="py-4">
                            <p className="font-black text-base text-slate-900">{t.name}</p>
                            <p className="text-xs text-slate-400 font-bold mt-0.5">ID: {t.id}</p>
                          </td>
                          <td className="font-bold text-slate-700">{t.owner}</td>
                          <td>
                            <span className="px-3 py-1.5 bg-[#BFDEF3] rounded-xl text-[10px] font-black uppercase text-[#1e3a8a] tracking-wider">
                              {t.plan}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                                t.status === 'Approved'
                                  ? 'bg-emerald-50 text-emerald-600'
                                  : t.status === 'Pending'
                                  ? 'bg-yellow-50 text-yellow-600'
                                  : 'bg-rose-50 text-rose-600'
                              }`}
                            >
                              {t.status}
                            </span>
                          </td>
                          <td className="text-slate-500 text-xs">
                            <span className="flex items-center gap-1.5 font-bold">
                              <Calendar size={14} className="text-slate-400" /> {t.expiresAt}
                            </span>
                          </td>
                          <td>
                            <div className="flex gap-1">
                              {t.status !== 'Approved' && (
                                <button
                                  onClick={() => void updateStatus(t.id, 'Approved')}
                                  className="p-2 hover:bg-slate-50 rounded-xl text-emerald-600 transition"
                                  title="Approve"
                                >
                                  <CheckCircle size={16} />
                                </button>
                              )}
                              {t.status !== 'Suspended' && (
                                <button
                                  onClick={() => void updateStatus(t.id, 'Suspended')}
                                  className="p-2 hover:bg-slate-50 rounded-xl text-rose-500 transition"
                                  title="Suspend"
                                >
                                  <XCircle size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* TENANT FEATURE TOGGLES */}
              <div className="space-y-6">
                <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm space-y-5">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Feature Access</h2>
                    <p className="text-xs text-slate-500 mt-1">Enable/Disable specific premium SaaS pages for active tenants.</p>
                  </div>

                  <div className="space-y-4">
                    {tenants.map((t) => (
                      <div key={t.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                        <p className="font-black text-sm text-[#8b5cf6]">{t.name}</p>
                        
                        <div className="grid gap-2 text-xs">
                          <div className="flex justify-between items-center text-slate-700 font-bold">
                            <span>AI Insights Portal</span>
                            <button onClick={() => toggleFeature(t.id, 'aiInsights')}>
                              {t.features.aiInsights ? (
                                <ToggleRight className="text-rose-500" size={26} />
                              ) : (
                                <ToggleLeft className="text-slate-400" size={26} />
                              )}
                            </button>
                          </div>

                          <div className="flex justify-between items-center text-slate-700 font-bold">
                            <span>QR Layout Builder</span>
                            <button onClick={() => toggleFeature(t.id, 'customLayouts')}>
                              {t.features.customLayouts ? (
                                <ToggleRight className="text-rose-500" size={26} />
                              ) : (
                                <ToggleLeft className="text-slate-400" size={26} />
                              )}
                            </button>
                          </div>

                          <div className="flex justify-between items-center text-slate-700 font-bold">
                            <span>Advanced POS Billing</span>
                            <button onClick={() => toggleFeature(t.id, 'advancedPos')}>
                              {t.features.advancedPos ? (
                                <ToggleRight className="text-rose-500" size={26} />
                              ) : (
                                <ToggleLeft className="text-slate-400" size={26} />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBSCRIPTIONS VIEW */}
          {currentView === 'subscriptions' && (
            <section className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-900">Subscription Model Configurator</h2>
                <p className="text-sm text-slate-500 mt-1">Configure pricing rates and parameters for selling access to restaurants.</p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {pricingPlans.map((plan) => (
                  <div key={plan.id} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-black text-sm capitalize text-slate-900">{plan.name}</h3>
                      <Settings className="text-rose-500 cursor-pointer hover:rotate-45 transition-transform" size={16} />
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 font-black block mb-1.5 uppercase">Set Pricing (INR)</label>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-sm font-black">₹</span>
                        <input
                          type="text"
                          value={plan.price}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPricingPlans(
                              pricingPlans.map((p) => (p.id === plan.id ? { ...p, price: val } : p))
                            );
                          }}
                          className="bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl text-sm font-black outline-none text-slate-900 w-full focus:border-[#5850ec]"
                        />
                        <span className="text-xs text-slate-500 font-bold">/{plan.duration}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed font-bold">
                      Changes take effect on next client payment renewal checkout sequence.
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SYSTEM SETTINGS VIEW */}
          {currentView === 'settings' && (
            <section className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm space-y-5">
                <h2 className="text-lg font-black text-slate-900">Global Platform Control</h2>
                <div className="space-y-4 font-bold">
                  <div className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <div>
                      <p className="font-black text-sm text-slate-900">Maintenance Mode</p>
                      <p className="text-xs text-slate-400 mt-0.5">Suspend all public table ordering APIs globally</p>
                    </div>
                    <button onClick={() => setMaintenanceMode(!maintenanceMode)}>
                      {maintenanceMode ? (
                        <span className="px-3.5 py-1.5 bg-rose-500 text-white text-xs font-black rounded-lg cursor-pointer">Active</span>
                      ) : (
                        <span className="px-3.5 py-1.5 bg-slate-100 border text-slate-550 text-xs font-black rounded-lg cursor-pointer">Inactive</span>
                      )}
                    </button>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <div>
                      <p className="font-black text-sm text-slate-900">Global Platform Fee</p>
                      <p className="text-xs text-slate-400 mt-0.5">Charged per checkout order transaction</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={platformFee}
                        onChange={(e) => setPlatformFee(Number(e.target.value))}
                        className="w-16 bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl text-center text-sm font-black outline-none"
                      />
                      <span className="text-sm text-slate-500 font-black">%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <div>
                      <p className="font-black text-sm text-slate-900">System Database Control</p>
                      <p className="text-xs text-slate-400 mt-0.5">Purge inactive sessions or reset mock logs</p>
                    </div>
                    <button
                      onClick={() => {
                        alert('🧹 System cache and temporary session logs successfully purged!');
                      }}
                      className="bg-rose-500 hover:bg-rose-600 px-5 py-2.5 rounded-xl text-xs font-black text-white transition active:scale-95 cursor-pointer"
                    >
                      Purge Logs
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm space-y-5">
                <h2 className="text-lg font-black text-slate-900">Billing Gateway Keys</h2>
                <div className="space-y-4 text-xs font-black text-slate-700">
                  <div className="space-y-1.5">
                    <span className="text-slate-400">Razorpay Production Key ID</span>
                    <input
                      type="text"
                      value="rzp_live_A3Resto98102"
                      readOnly
                      className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-slate-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-slate-400">Stripe Webhook Secret Signature</span>
                    <input
                      type="text"
                      value="whsec_8710283A9128381A27"
                      readOnly
                      className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-slate-500 outline-none"
                    />
                  </div>
                  <button
                    onClick={() => alert('🔑 Sandbox environment API webhook endpoints successfully re-synced.')}
                    className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 py-3.5 rounded-xl text-slate-700 font-black transition active:scale-95 cursor-pointer"
                  >
                    Force Webhook Recalibration
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* LOGS & ACTIVITY VIEW */}
          {currentView === 'logs' && (
            <section className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm space-y-5">
                <h2 className="text-lg font-black text-slate-900">Platform Monitoring Logs</h2>
                <div className="space-y-3">
                  {[
                    { name: 'API Health Check', status: 'Operational', desc: 'Latency: 18ms' },
                    { name: 'DB Backups Status', status: 'Backup Completed', desc: 'Saved to S3 at 02:00 AM' },
                    { name: 'Socket Event Handlers', status: 'Isolated', desc: '32 active tenant namespaces' },
                    { name: 'Billing Gateways', status: 'Synced', desc: 'Stripe & Razorpay webhooks listening' },
                  ].map((item) => (
                    <div key={item.name} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center text-sm font-black">
                      <div>
                        <p className="text-slate-900 font-black">{item.name}</p>
                        <p className="text-xs text-slate-400 font-bold mt-0.5">{item.desc}</p>
                      </div>
                      <span className="text-[10px] px-3 py-1 bg-emerald-50 text-emerald-600 font-black rounded-lg border border-emerald-100">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm space-y-5">
                <h2 className="text-lg font-black text-slate-900">Recent System Audit Trails</h2>
                <div className="space-y-3.5 text-xs font-black text-slate-500">
                  <div className="flex gap-2">
                    <span className="text-rose-500 font-black">[SYSTEM]</span>
                    <p>Auto-renewed subscription for Spicy Hub (rest-1). Expiry extended to Dec 2026.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-sky-500 font-black">[WEBHOOK]</span>
                    <p>Received checkout.session.completed webhook for rest-3. Custom MRR approved.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-emerald-500 font-black">[OWNER]</span>
                    <p>Super Admin changed starter plan price to ₹999/month.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-rose-500 font-black">[SYSTEM]</span>
                    <p>Weekly database backup zipped and encrypted (185MB).</p>
                  </div>
                </div>
              </div>
            </section>
          )}

        </main>

      </div>

      {/* ADD RESTAURANT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-5">
            <h2 className="text-xl font-black text-slate-900">Register New Restaurant</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 font-black uppercase block mb-1.5">Restaurant Name</label>
                <input
                  value={newRestName}
                  onChange={(e) => setNewRestName(e.target.value)}
                  placeholder="e.g. Royal Treat"
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl outline-none text-slate-800 text-sm font-black focus:border-[#BFDEF3]"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 font-black uppercase block mb-1.5">Owner Full Name</label>
                <input
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  placeholder="e.g. Rohan Das"
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl outline-none text-slate-800 text-sm font-black focus:border-[#BFDEF3]"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 font-black uppercase block mb-1.5">Select Plan Level</label>
                <select
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl outline-none text-slate-800 text-sm font-black focus:border-[#BFDEF3]"
                >
                  <option value="Starter">Starter Plan</option>
                  <option value="Pro">Pro Plan</option>
                  <option value="Enterprise">Enterprise Plan</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 py-3.5 rounded-2xl font-black text-xs text-slate-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => void addRestaurant()}
                className="flex-1 bg-[#5850ec] hover:bg-[#4b45cc] py-3.5 rounded-2xl font-black text-xs text-white transition active:scale-95"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
