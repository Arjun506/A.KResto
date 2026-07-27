'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  getRevenueAnalytics,
  getMenuAnalytics,
  type RevenueResponse,
  type MenuResponse
} from '@/services/analytics.service';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Calendar,
  Globe,
  Settings,
  Sparkles,
  BarChart3,
  FileSpreadsheet,
  ToggleLeft,
  ToggleRight,
  Save,
  Search,
  ChevronRight,
  TrendingDown
} from 'lucide-react';

const revenueData7d = [
  { day: 'Mon', revenue: 4000, orders: 18 },
  { day: 'Tue', revenue: 3000, orders: 12 },
  { day: 'Wed', revenue: 5000, orders: 22 },
  { day: 'Thu', revenue: 7000, orders: 30 },
  { day: 'Fri', revenue: 6000, orders: 26 },
  { day: 'Sat', revenue: 9000, orders: 42 },
  { day: 'Sun', revenue: 8000, orders: 38 },
];

const salesData = [
  { name: 'Butter Chicken', value: 45 },
  { name: 'Dal Makhani', value: 25 },
  { name: 'Garlic Naan', value: 20 },
  { name: 'Mango Lassi', value: 10 },
];

const COLORS = [
  '#4F46E5', // Indigo
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#F43F5E', // Rose
];

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const [revenueData, setRevenueData] = useState<RevenueResponse | null>(null);
  const [menuData, setMenuData] = useState<MenuResponse | null>(null);

  useEffect(() => {
    setMounted(true);
    const loadRealAnalytics = async () => {
      try {
        const [revRes, menuRes] = await Promise.all([
          getRevenueAnalytics(),
          getMenuAnalytics()
        ]);
        setRevenueData(revRes);
        setMenuData(menuRes);
      } catch (err) {
        console.warn('Failed to load real analytics page data:', err);
      }
    };
    void loadRealAnalytics();
  }, []);

  const [activeTab, setActiveTab] = useState<'insights' | 'pl' | 'website'>('insights');
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');

  const barChartData = useMemo(() => {
    if (!revenueData) return revenueData7d;
    const source = timeRange === '7d' ? revenueData.daily : revenueData.weekly;
    if (!source || source.length === 0) return revenueData7d;
    return source.map(item => ({
      day: item.label,
      revenue: parseFloat(item.revenue),
      orders: 0
    }));
  }, [revenueData, timeRange]);

  const pieChartData = useMemo(() => {
    if (!menuData || !menuData.topSellingItems || menuData.topSellingItems.length === 0) return salesData;
    const totalQty = menuData.topSellingItems.reduce((acc, curr) => acc + curr.quantity, 0) || 1;
    return menuData.topSellingItems.slice(0, 4).map(item => ({
      name: item.name,
      value: Math.round((item.quantity / totalQty) * 100)
    }));
  }, [menuData]);
  
  // Website Setup States
  const [domainName, setDomainName] = useState('royalfeast.a3resto.com');
  const [bannerText, setBannerText] = useState('Welcome! Get 15% discount on all online orders this Sunday.');
  const [seoTitle, setSeoTitle] = useState('Royal Feast | Premium Indian Dining & Delivery');
  const [seoDescription, setSeoDescription] = useState('Experience authentic Indian cuisine at Royal Feast. Hand-crafted biryanis, fresh tandoor breads, and curries delivered to your door.');
  
  const [enableOnlineOrders, setEnableOnlineOrders] = useState(true);
  const [publishMenuLive, setPublishMenuLive] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast('Website configurations and SEO meta tags successfully published!');
  };

  if (!mounted) {
    return <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-12 text-slate-500">Loading analytics...</div>;
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analytics & Sales Reports</h1>
          <p className="text-sm text-slate-500">
            Export profit-loss ledgers, track customer metrics, and configure public menu websites.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit self-start font-semibold text-xs">
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
              activeTab === 'insights'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Performance Insights
          </button>
          <button
            onClick={() => setActiveTab('pl')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
              activeTab === 'pl'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            Profit & Loss Sheet
          </button>
          <button
            onClick={() => setActiveTab('website')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
              activeTab === 'website'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            Website & SEO Settings
          </button>
        </div>
      </div>

      {/* 1. PERFORMANCE INSIGHTS */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          
          {/* Summary metrics */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Weekly Revenue</span>
                <span className="rounded-full bg-indigo-50 p-1.5 text-indigo-600">
                  <DollarSign className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">₹2.4L</span>
                <span className="text-xs text-emerald-500 font-bold flex items-center mt-1">
                  +12.4%
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Orders</span>
                <span className="rounded-full bg-emerald-50 p-1.5 text-emerald-600">
                  <ShoppingBag className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">1,240</span>
                <span className="text-xs text-emerald-500 font-bold flex items-center mt-1">
                  +8.2%
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unique Customers</span>
                <span className="rounded-full bg-amber-50 p-1.5 text-amber-600">
                  <Users className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">860</span>
                <span className="text-xs text-emerald-500 font-bold flex items-center mt-1">
                  +4.5%
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Ticket</span>
                <span className="rounded-full bg-rose-50 p-1.5 text-rose-600">
                  <TrendingUp className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">₹520</span>
                <span className="text-xs text-rose-500 font-bold flex items-center mt-1">
                  -1.5%
                </span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 xl:grid-cols-2">
            
            {/* Revenue chart */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold text-slate-900">Weekly Revenue Timeline</h2>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="rounded-lg border border-slate-200 px-3 py-1 text-xs focus:outline-none focus:border-indigo-500 bg-white font-semibold text-slate-700"
                >
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: '#F8FAFC' }} />
                    <Bar
                      dataKey="revenue"
                      fill="#4F46E5"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top selling chart */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-6">Top Selling Dishes (Product Share)</h2>
              
              <div className="h-80 grid grid-cols-1 md:grid-cols-2 items-center">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        dataKey="value"
                        outerRadius={90}
                        innerRadius={60}
                        paddingAngle={4}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-3 pl-4">
                  {pieChartData.map((item, idx) => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: COLORS[idx] }}></span>
                        <span className="font-semibold text-slate-700">{item.name}</span>
                      </div>
                      <span className="font-extrabold text-slate-900">{item.value}% sales</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. PROFIT & LOSS SHEET */}
      {activeTab === 'pl' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm max-w-4xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Profit & Loss (P&L) Statement</h2>
              <p className="text-xs text-slate-400">Current fiscal month ending June 30, 2026</p>
            </div>
            <button
              onClick={() => triggerToast('P&L spreadsheet generated and queued for download.')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 bg-white"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-slate-500" />
              Download XLS Report
            </button>
          </div>

          <div className="space-y-6 text-sm">
            {/* Revenue Section */}
            <div>
              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-1.5 uppercase text-xs tracking-wider flex justify-between">
                <span>1. Operating Revenue</span>
                <span className="text-indigo-600 font-extrabold">₹2,72,000</span>
              </h3>
              <div className="divide-y divide-slate-50 pl-3">
                <div className="flex justify-between py-2.5 text-slate-600">
                  <span>Online Store Sales (Website/QR orders)</span>
                  <span className="font-semibold text-slate-800">₹1,45,000</span>
                </div>
                <div className="flex justify-between py-2.5 text-slate-600">
                  <span>Offline Dine-in Sales</span>
                  <span className="font-semibold text-slate-800">₹95,000</span>
                </div>
                <div className="flex justify-between py-2.5 text-slate-600">
                  <span>Takeaway / Parcel orders</span>
                  <span className="font-semibold text-slate-800">₹32,000</span>
                </div>
              </div>
            </div>

            {/* COGS Section */}
            <div>
              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-1.5 uppercase text-xs tracking-wider flex justify-between">
                <span>2. Cost of Goods Sold (COGS)</span>
                <span className="text-rose-600 font-extrabold">- ₹87,200</span>
              </h3>
              <div className="divide-y divide-slate-50 pl-3">
                <div className="flex justify-between py-2.5 text-slate-600">
                  <span>Raw Material Sourcing (Dairy, Meats, Spices)</span>
                  <span className="font-semibold text-slate-800">₹84,000</span>
                </div>
                <div className="flex justify-between py-2.5 text-slate-600">
                  <span>Kitchen Wastage Loss deductions</span>
                  <span className="font-semibold text-slate-800">₹3,200</span>
                </div>
              </div>
            </div>

            {/* Expenses Section */}
            <div>
              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-1.5 uppercase text-xs tracking-wider flex justify-between">
                <span>3. Operational Expenses</span>
                <span className="text-rose-600 font-extrabold">- ₹81,000</span>
              </h3>
              <div className="divide-y divide-slate-50 pl-3">
                <div className="flex justify-between py-2.5 text-slate-600">
                  <span>Employee Salaries & Shifts</span>
                  <span className="font-semibold text-slate-800">₹48,000</span>
                </div>
                <div className="flex justify-between py-2.5 text-slate-600">
                  <span>Store Rental, Electricity & Water Bills</span>
                  <span className="font-semibold text-slate-800">₹25,000</span>
                </div>
                <div className="flex justify-between py-2.5 text-slate-600">
                  <span>Marketing, SMS Notifications & SEO promotion</span>
                  <span className="font-semibold text-slate-800">₹8,000</span>
                </div>
              </div>
            </div>

            {/* Net Profits Summary */}
            <div className="bg-indigo-50/50 rounded-xl p-5 border border-indigo-100 flex items-center justify-between mt-6">
              <div>
                <h4 className="font-extrabold text-indigo-950 text-base">Net Operating Margin (Profit)</h4>
                <p className="text-xs text-indigo-700 mt-0.5">Calculated after raw materials, wastage logs, and store expenses.</p>
              </div>
              
              <div className="text-right">
                <span className="text-2xl font-extrabold text-indigo-600">₹1,03,800</span>
                <p className="text-[10px] text-emerald-600 font-bold mt-1">38.1% Net Margin</p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 3. WEBSITE BUILDER AND SEO SETTINGS */}
      {activeTab === 'website' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          
          {/* Main Website Settings Form */}
          <form onSubmit={handleSaveSettings} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Globe className="h-5 w-5 text-indigo-600" />
              SaaS Public Website Customizer
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Custom Subdomain</label>
                <div className="flex">
                  <input
                    value={domainName}
                    onChange={(e) => setDomainName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">SEO Title Meta Tag</label>
                <input
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none font-semibold text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">SEO Description (Meta Tag)</label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none text-slate-700"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Online Landing Page Banner Alert Text</label>
              <input
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none text-slate-700"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 text-sm font-semibold transition-colors flex items-center gap-1.5"
              >
                <Save className="h-4 w-4" />
                Publish Changes Live
              </button>
            </div>
          </form>

          {/* Quick toggle switch indicators */}
          <div className="space-y-4">
            
            {/* Toggles Box */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Public Channel Controls</h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">Accept Online Orders</p>
                  <p className="text-[10px] text-slate-500">Allow customers to submit cart items online</p>
                </div>
                <button onClick={() => { setEnableOnlineOrders(!enableOnlineOrders); triggerToast(`Online orders ${!enableOnlineOrders ? 'enabled' : 'disabled'}`); }}>
                  {enableOnlineOrders ? (
                    <ToggleRight className="h-9 w-9 text-indigo-600" />
                  ) : (
                    <ToggleLeft className="h-9 w-9 text-slate-300" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">Publish Menu to Web</p>
                  <p className="text-[10px] text-slate-500">Enable public viewing of categories and pricing</p>
                </div>
                <button onClick={() => { setPublishMenuLive(!publishMenuLive); triggerToast(`Web menu publication ${!publishMenuLive ? 'enabled' : 'disabled'}`); }}>
                  {publishMenuLive ? (
                    <ToggleRight className="h-9 w-9 text-indigo-600" />
                  ) : (
                    <ToggleLeft className="h-9 w-9 text-slate-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Google SEO Preview Simulation */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-xs">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">Google Search Preview</h4>
              <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-1 shadow-2xs">
                <p className="text-[11px] text-slate-500">https://{domainName}</p>
                <p className="text-sm font-semibold text-blue-800 hover:underline cursor-pointer">{seoTitle}</p>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{seoDescription}</p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
