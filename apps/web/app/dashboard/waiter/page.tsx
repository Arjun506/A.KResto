'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import {
  Smartphone,
  Check,
  Clock,
  Bell,
  AlertTriangle,
  UtensilsCrossed,
  DollarSign,
  Layers,
  Sparkles,
  ClipboardList,
  ChevronDown,
  X,
  LogOut,
  Star,
  UserCheck,
  Settings,
  Flame,
  Activity,
  FileText,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Search,
  Award,
  TrendingUp,
  ThumbsUp,
  Coffee,
  HelpCircle,
  Calendar
} from 'lucide-react';

// Custom illustration matching mockup
const TipsJarIllustration = () => (
  <svg width="100" height="70" viewBox="0 0 120 90" fill="none" className="mx-auto my-1 drop-shadow-md">
    {/* Glass Jar Body */}
    <rect x="42" y="25" width="36" height="42" rx="8" fill="#818CF8" fillOpacity="0.15" stroke="#818CF8" strokeWidth="2" />
    <rect x="48" y="20" width="24" height="6" rx="2" fill="#818CF8" stroke="#818CF8" strokeWidth="1.5" />
    
    {/* Lid */}
    <rect x="46" y="15" width="28" height="6" rx="3" fill="#4F46E5" />
    
    {/* Coins inside */}
    <circle cx="52" cy="40" r="4.5" fill="#FBBF24" />
    <circle cx="68" cy="45" r="4.5" fill="#F59E0B" />
    <circle cx="58" cy="55" r="4.5" fill="#FBBF24" />
    <circle cx="64" cy="35" r="4.5" fill="#FBBF24" />
    
    {/* Coins falling/floating outside */}
    <path d="M54 12C54 10 58 8 58 8" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="59" cy="5" r="3.5" fill="#FBBF24" />
    <circle cx="68" cy="11" r="3.5" fill="#FBBF24" />
    
    {/* Hand holding jar */}
    <path d="M25 65C35 60 45 58 52 62C58 65 65 67 72 65C80 62 85 55 90 52" stroke="#FDA4AF" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

// Types
type WaiterOrder = {
  id: string;
  orderNumber: string;
  tableId: string;
  source: 'Dine-in' | 'Takeaway' | 'Delivery';
  items: {
    name: string;
    quantity: number;
    notes?: string;
  }[];
  status: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  totalBill: number;
  priority?: boolean;
  createdAt: string;
};

type TableState = {
  id: string;
  name: string;
  status: 'Occupied' | 'Available' | 'Reserved' | 'Cleaning';
  customerName?: string;
  activeBill?: number;
  capacity: number;
  allergies?: string;
  preferences?: string;
};

type TableRequest = {
  id: string;
  tableName: string;
  requestType: 'Water Request' | 'Extra Plate Request' | 'Extra Chair Request' | 'Cleaning Request' | 'Bill Request' | 'Special Assistance Request';
  status: 'Pending' | 'Served';
  time: string;
  notes?: string;
};

type TipLog = {
  id: string;
  date: string;
  table: string;
  amount: number;
  type: 'Cash' | 'Card' | 'UPI';
};

export default function WaiterPanel() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [shiftStatus, setShiftStatus] = useState<'Active' | 'On Break' | 'Ended'>('Active');
  
  // Waiter identity data matching mockup
  const waiterProfile = {
    name: 'Ravi Verma',
    role: 'Waiter',
    status: 'Online',
    avatar: 'RV'
  };

  const isOwner = user?.role === 'OWNER' || user?.role === 'RESTAURANT_OWNER' || user?.role === 'SUPER_ADMIN' || user?.role === 'MANAGER';

  // Mock Active Assigned Tables
  useEffect(() => {
    if (!isLoading && (!user || (user.role !== 'WAITER' && !isOwner))) {
      router.push('/login');
    }
  }, [user, isLoading, isOwner, router]);

  const [tables, setTables] = useState<TableState[]>([
    { id: 't-1', name: 'Table 1', status: 'Occupied', customerName: 'Rohit Sharma', activeBill: 1240, capacity: 4, allergies: 'Peanut Allergy', preferences: 'Prefers window seating' },
    { id: 't-2', name: 'Table 2', status: 'Available', capacity: 2 },
    { id: 't-3', name: 'Table 3', status: 'Reserved', customerName: 'Simran Kaur', capacity: 6, preferences: 'Celebrating Birthday' },
    { id: 't-4', name: 'Table 4', status: 'Cleaning', capacity: 4 },
    { id: 't-5', name: 'Table 5', status: 'Occupied', customerName: 'Kabir J.', activeBill: 610, capacity: 2 },
    { id: 't-6', name: 'Table 6', status: 'Available', capacity: 4 }
  ]);

  // Mock Orders to Serve (ready from kitchen)
  const [orders, setOrders] = useState<WaiterOrder[]>([
    {
      id: 'o-201',
      orderNumber: 'KOD-9281',
      tableId: 'Table 4',
      source: 'Dine-in',
      priority: true,
      items: [
        { name: 'Butter Chicken Masala', quantity: 2 },
        { name: 'Garlic Naan Buttered', quantity: 3 }
      ],
      status: 'READY',
      totalBill: 890,
      createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
    },
    {
      id: 'o-202',
      orderNumber: 'KOD-8802',
      tableId: 'Table 12',
      source: 'Dine-in',
      items: [
        { name: 'Paneer Tikka Platter', quantity: 1 }
      ],
      status: 'PREPARING',
      totalBill: 340,
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
    },
    {
      id: 'o-203',
      orderNumber: 'KOD-7729',
      tableId: 'Token #81',
      source: 'Takeaway',
      items: [
        { name: 'Triple Chocolate Brownie', quantity: 2 }
      ],
      status: 'READY',
      totalBill: 280,
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    },
    {
      id: 'o-204',
      orderNumber: 'KOD-6192',
      tableId: 'Table 9',
      source: 'Dine-in',
      items: [
        { name: 'Greek Feta Salad', quantity: 1 }
      ],
      status: 'COMPLETED',
      totalBill: 195,
      createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString()
    }
  ]);

  // Active Customer Requests
  const [requests, setRequests] = useState<TableRequest[]>([
    { id: 'r-1', tableName: 'Table 1', requestType: 'Water Request', status: 'Pending', time: '5 mins ago' },
    { id: 'r-2', tableName: 'Table 5', requestType: 'Bill Request', status: 'Pending', time: '2 mins ago', notes: 'Prefers card payment' },
    { id: 'r-3', tableName: 'Table 3', requestType: 'Extra Chair Request', status: 'Pending', time: '10 mins ago' }
  ]);

  // Tip logs
  const [tips, setTips] = useState<TipLog[]>([
    { id: 'tp-1', date: '2026-06-14', table: 'Table 1', amount: 200, type: 'UPI' },
    { id: 'tp-2', date: '2026-06-14', table: 'Table 5', amount: 150, type: 'Cash' },
    { id: 'tp-3', date: '2026-06-14', table: 'Table 9', amount: 300, type: 'Card' }
  ]);

  // Actions
  const handleServeRequest = (reqId: string) => {
    setRequests(current => current.filter(r => r.id !== reqId));
  };

  const handleServeOrder = (orderId: string) => {
    setOrders(current =>
      current.map(o => (o.id === orderId ? { ...o, status: 'COMPLETED' } : o))
    );
  };

  const handleSeating = (tableId: string, name: string) => {
    if (!name) return;
    setTables(current =>
      current.map(t =>
        t.id === tableId ? { ...t, status: 'Occupied', customerName: name, activeBill: 0 } : t
      )
    );
  };

  const handleReleaseTable = (tableId: string) => {
    setTables(current =>
      current.map(t =>
        t.id === tableId ? { ...t, status: 'Available', customerName: undefined, activeBill: undefined } : t
      )
    );
  };

  const handleCleaningCall = (tableId: string) => {
    setTables(current =>
      current.map(t =>
        t.id === tableId ? { ...t, status: 'Cleaning' } : t
      )
    );
  };

  // Calculations
  const activeTablesCount = useMemo(() => tables.filter(t => t.status === 'Occupied').length, [tables]);
  const readyOrdersCount = useMemo(() => orders.filter(o => o.status === 'READY').length, [orders]);
  const activeRequestsCount = useMemo(() => requests.filter(r => r.status === 'Pending').length, [requests]);
  const totalTipsSum = useMemo(() => tips.reduce((acc, t) => acc + t.amount, 0), [tips]);
  const totalEarningsSum = useMemo(() => 1200 + totalTipsSum, [totalTipsSum]); // Base shift allowance (₹1200) + tips

  // Sidebar links mapping to mockup
  const serviceLinks = [
    { id: 'my-tables', label: 'My Tables', icon: Layers, badge: activeTablesCount, badgeColor: 'bg-[#3B82F6]' },
    { id: 'orders-serve', label: 'Orders to Serve', icon: UtensilsCrossed, badge: readyOrdersCount, badgeColor: 'bg-[#F97316]' },
    { id: 'table-requests', label: 'Table Requests', icon: Bell, badge: activeRequestsCount, badgeColor: 'bg-[#10B981]' },
    { id: 'call-waiter', label: 'Call Waiter', icon: Smartphone }
  ];

  const operationsLinks = [
    { id: 'order-history', label: 'Order History', icon: ClipboardList },
    { id: 'dine-in', label: 'Dine In', icon: Layers },
    { id: 'takeaway', label: 'Takeaway', icon: UtensilsCrossed },
    { id: 'delivery', label: 'Delivery', icon: Smartphone }
  ];

  const otherLinks = [
    { id: 'tips-earnings', label: 'Tips / Earnings', icon: DollarSign },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: 4, badgeColor: 'bg-red-500' },
    { id: 'feedback', label: 'Feedback', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#0B0F19] text-slate-100 overflow-hidden font-sans">
      
      {/* 1. MOCKUP SIDEBAR CONTAINER (PURPLE ACTIVE ACCENTS) */}
      <aside className="w-64 bg-[#0F172A] border-r border-[#1E293B] flex flex-col justify-between flex-shrink-0 select-none overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
        <div className="p-4 flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 pb-4 mb-4 border-b border-[#1E293B]">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20">
              🛎️
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight text-white leading-none">Spice Corner</h1>
              <span className="text-[10px] text-[#818CF8] font-extrabold uppercase tracking-widest mt-1 block">Waiter Panel</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            {/* Dashboard Link */}
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                  activeTab === 'dashboard'
                    ? 'bg-[#4F46E5] text-white shadow-lg shadow-indigo-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers size={15} />
                  <span>Dashboard</span>
                </div>
              </button>
            </div>

            {/* SERVICES */}
            <div className="space-y-1">
              <span className="px-3 text-[9px] font-black uppercase tracking-wider text-slate-500 block mb-1">Services</span>
              {serviceLinks.map(item => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                      isSelected
                        ? 'bg-[#4F46E5] text-white shadow-lg shadow-indigo-500/25'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={15} className={isSelected ? 'text-white' : 'text-slate-400'} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full text-white ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* OPERATIONS */}
            <div className="space-y-1">
              <span className="px-3 text-[9px] font-black uppercase tracking-wider text-slate-500 block mb-1">Operations</span>
              {operationsLinks.map(item => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                      isSelected
                        ? 'bg-[#4F46E5] text-white shadow-lg shadow-indigo-500/25'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={15} className={isSelected ? 'text-white' : 'text-slate-400'} />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* OTHER */}
            <div className="space-y-1">
              <span className="px-3 text-[9px] font-black uppercase tracking-wider text-slate-500 block mb-1">Other</span>
              {otherLinks.map(item => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                      isSelected
                        ? 'bg-[#4F46E5] text-white shadow-lg shadow-indigo-500/25'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={15} className={isSelected ? 'text-white' : 'text-slate-400'} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full text-white ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
              <button
                onClick={() => setShiftStatus('Ended')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
              >
                <div className="flex items-center gap-2.5">
                  <LogOut size={15} />
                  <span>Log Out</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Tips Jar Illustration Card (Matching Mockup Image) */}
        <div className="p-4 border-t border-[#1E293B]">
          <div className="bg-[#1E293B]/70 rounded-2xl p-3 relative overflow-hidden shadow-inner text-center border border-[#334155]/40 mb-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Today's Earnings</span>
            <h3 className="text-xl font-black text-white leading-none">₹{totalEarningsSum}</h3>
            
            <div className="my-1.5 flex justify-center items-center gap-2 text-[10px] text-slate-400 font-bold">
              <span>Total Tips:</span>
              <span className="text-emerald-400 font-black">₹{totalTipsSum}</span>
            </div>

            <TipsJarIllustration />
          </div>

          {/* Profile chip at very bottom */}
          <div className="flex items-center gap-3 pt-3 border-t border-[#1E293B]">
            <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center font-black text-white text-xs relative">
              {waiterProfile.avatar}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-[#0F172A] rounded-full" />
            </div>
            <div className="text-left leading-none">
              <h4 className="text-xs font-bold text-white">{waiterProfile.name}</h4>
              <span className="text-[9px] text-slate-400 font-semibold mt-1 block">{waiterProfile.role} • {shiftStatus}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. PRIMARY VIEW WORKSPACE */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0B0F19] overflow-hidden">
        
        {/* Top Header Panel */}
        <header className="h-16 border-b border-[#1E293B] bg-[#0F172A] px-6 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2 uppercase tracking-wide">
              {activeTab === 'dashboard' && 'Service Summary & Leaderboard'}
              {activeTab === 'my-tables' && 'Floor Map & Table Allocations'}
              {activeTab === 'orders-serve' && 'Serve Queue (Food Pickups Ready)'}
              {activeTab === 'table-requests' && 'Active Table Assistance Calls'}
              {activeTab === 'call-waiter' && 'Emergency Customer Call Logs'}
              {activeTab === 'order-history' && 'Order History Logs'}
              {activeTab === 'dine-in' && 'Dine In Flow Setup'}
              {activeTab === 'takeaway' && 'Takeaway token log'}
              {activeTab === 'delivery' && 'Delivery staff handovers'}
              {activeTab === 'tips-earnings' && 'Tip tracker ledger'}
              {activeTab === 'notifications' && 'System Notifications Log'}
              {activeTab === 'feedback' && 'Customer satisfaction ratings'}
              {activeTab === 'settings' && 'Shift details & Settings'}
            </h2>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Spice Corner waiter execution dashboard.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#1E293B] border border-[#334155] px-3 py-1.5 rounded-xl text-xs font-bold">
              <span className={`w-2 h-2 rounded-full ${shiftStatus === 'Active' ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
              <span>Shift: {shiftStatus}</span>
            </div>
          </div>
        </header>

        {/* Content Pane */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-800">
          
          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* KPIs Row */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-[#0F172A] border border-[#1E293B] p-4.5 rounded-2xl">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block">Assigned Tables</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-white">6</span>
                    <span className="text-[10px] text-slate-450 font-bold">Zones 1-3</span>
                  </div>
                </div>
                <div className="bg-[#0F172A] border border-[#1E293B] p-4.5 rounded-2xl">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block">Orders to serve</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-[#F97316]">{readyOrdersCount}</span>
                    <span className="text-[10px] text-slate-400 font-bold">Ready</span>
                  </div>
                </div>
                <div className="bg-[#0F172A] border border-[#1E293B] p-4.5 rounded-2xl">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block">Pending Requests</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-rose-400">{activeRequestsCount}</span>
                    <span className="text-[10px] text-slate-400 font-bold">Assistance</span>
                  </div>
                </div>
                <div className="bg-[#0F172A] border border-[#1E293B] p-4.5 rounded-2xl">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block">Satisfaction Score</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-emerald-400">96.5%</span>
                    <span className="text-[10px] text-emerald-400 font-bold">Excellent</span>
                  </div>
                </div>
                <div className="bg-[#0F172A] border border-[#1E293B] p-4.5 rounded-2xl col-span-2 lg:col-span-1">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block">Shift Tips</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-indigo-400">₹{totalTipsSum}</span>
                    <span className="text-[10px] text-slate-400 font-bold">3 Tables</span>
                  </div>
                </div>
              </div>

              {/* Main dashboard view panels */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Waiter Leaderboard */}
                <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Award size={14} className="text-indigo-400" /> Waiter Leaderboard (Shift Tips)
                  </h3>
                  <div className="space-y-3">
                    {[
                      { rank: '1st', name: 'Ravi Verma (You)', tips: 650, active: true },
                      { rank: '2nd', name: 'Neha Gupta', tips: 580, active: false },
                      { rank: '3rd', name: 'Karan Malhotra', tips: 460, active: false }
                    ].map((w, idx) => (
                      <div key={idx} className={`p-3 rounded-xl border flex justify-between items-center text-xs ${
                        w.active ? 'bg-indigo-500/10 border-indigo-500/30 text-white' : 'bg-[#1E293B] border-transparent text-slate-300'
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-400">{w.rank}</span>
                          <span className="font-bold">{w.name}</span>
                        </div>
                        <span className="font-black text-emerald-400">₹{w.tips}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Table Performance Analytics */}
                <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Activity size={14} className="text-[#F97316]" /> Service Time Stats
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-[#1E293B] rounded-xl flex justify-between">
                      <span className="text-slate-400 font-bold">Average service time:</span>
                      <span className="text-white font-black">6.4 mins</span>
                    </div>
                    <div className="p-3 bg-[#1E293B] rounded-xl flex justify-between">
                      <span className="text-slate-400 font-bold">Total tables served today:</span>
                      <span className="text-white font-black">18 tables</span>
                    </div>
                    <div className="p-3 bg-[#1E293B] rounded-xl flex justify-between">
                      <span className="text-slate-400 font-bold">Table turnover duration:</span>
                      <span className="text-white font-black">42 mins avg</span>
                    </div>
                  </div>
                </div>

                {/* Upselling & Preference Suggestions (Smart Features) */}
                <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={14} className="text-purple-400" /> AI Upselling tips
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">Based on current cart items at Table 1: recommend Ginger Beer mocktail.</p>
                  </div>
                  <div className="space-y-2.5 my-2">
                    <div className="p-3 bg-[#1E293B] rounded-xl border border-[#334155]/30">
                      <span className="text-[9px] text-[#F97316] font-black uppercase tracking-wider block">Recommended Combo</span>
                      <p className="text-xs font-bold text-white mt-1">Suggest Chocolate Brownie with Butter Chicken checks. Historical conversion: 22%.</p>
                    </div>
                    <div className="p-3 bg-[#1E293B] rounded-xl border border-[#334155]/30">
                      <span className="text-[9px] text-emerald-400 font-black uppercase tracking-wider block">Dietary Note</span>
                      <p className="text-xs font-bold text-white mt-1">Table 1 allergen warning is flagged (Peanut allergy). Ensure kitchen cook ticks checklist.</p>
                    </div>
                  </div>
                  <span className="text-[8px] text-slate-500 text-center font-bold">Updated real-time by chef orders</span>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: MY TABLES GRID */}
          {activeTab === 'my-tables' && (
            <div className="space-y-6">
              {/* Floor Seating Map Status Checkboxes */}
              <div className="flex gap-2 pb-2 border-b border-[#1E293B]">
                {['All Status', 'Available', 'Occupied', 'Reserved', 'Cleaning'].map(status => (
                  <button
                    key={status}
                    className="px-3.5 py-1.5 bg-[#0F172A] hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-bold border border-[#1E293B]"
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* Grid map */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tables.map(table => (
                  <div key={table.id} className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 flex flex-col justify-between shadow-xl hover:border-slate-700 transition">
                    <div>
                      <div className="flex justify-between items-center pb-2.5 border-b border-[#1E293B]">
                        <h4 className="text-base font-black text-white">{table.name}</h4>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          table.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400' :
                          table.status === 'Occupied' ? 'bg-indigo-500/10 text-indigo-400' :
                          table.status === 'Reserved' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {table.status}
                        </span>
                      </div>

                      {/* Customer Details info */}
                      <div className="space-y-1.5 mt-4 text-xs text-slate-300 font-semibold">
                        <p>Capacity: <span className="text-white font-bold">{table.capacity} Persons</span></p>
                        {table.customerName ? (
                          <>
                            <p>Guest Name: <span className="text-white font-bold">{table.customerName}</span></p>
                            <p>Active Bill: <span className="text-rose-400 font-black">₹{table.activeBill}</span></p>
                          </>
                        ) : (
                          <p className="text-slate-500 italic">Table vacant</p>
                        )}
                        {table.allergies && (
                          <p className="text-red-400 font-bold bg-red-500/10 px-2 py-1 rounded mt-1.5 text-[10px]">
                            ⚠️ Allergy: {table.allergies}
                          </p>
                        )}
                        {table.preferences && (
                          <p className="text-slate-400 italic text-[10px] mt-1">
                            Notes: {table.preferences}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 mt-5 pt-3.5 border-t border-[#1E293B] text-[10px] font-black">
                      {table.status === 'Available' ? (
                        <button
                          onClick={() => {
                            const name = prompt('Enter seating guest name:');
                            if (name) handleSeating(table.id, name);
                          }}
                          className="w-full bg-[#4F46E5] hover:bg-indigo-600 text-white py-2 rounded-xl transition"
                        >
                          Seat Guest
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReleaseTable(table.id)}
                          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-xl border border-slate-700 transition"
                        >
                          Clear/Vacate
                        </button>
                      )}
                      <button
                        onClick={() => handleCleaningCall(table.id)}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-xl border border-slate-700 transition"
                      >
                        Call Cleaning
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS TO SERVE */}
          {activeTab === 'orders-serve' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.filter(o => o.status === 'READY' || o.status === 'PREPARING').map(order => (
                  <div key={order.id} className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 flex flex-col justify-between shadow-xl">
                    <div>
                      <div className="flex justify-between items-start pb-2 border-b border-[#1E293B]">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Order Ticket</span>
                          <h4 className="text-sm font-black text-white mt-1">{order.orderNumber} ({order.tableId})</h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          order.status === 'READY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'
                        }`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="space-y-2 mt-4">
                        {order.items.map((it, i) => (
                          <div key={i} className="flex justify-between items-center text-xs p-2.5 bg-[#1E293B] rounded-xl">
                            <span className="font-bold text-slate-200">{it.name}</span>
                            <span className="font-black text-white bg-slate-800 px-2 py-0.5 rounded">x{it.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-[#1E293B]">
                      {order.status === 'READY' ? (
                        <button
                          onClick={() => handleServeOrder(order.id)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-2.5 rounded-xl transition"
                        >
                          ✓ Food Served to Table
                        </button>
                      ) : (
                        <div className="text-center text-xs text-slate-500 font-semibold py-2">
                          👨‍🍳 Kitchen preparing items...
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TABLE REQUESTS */}
          {activeTab === 'table-requests' && (
            <div className="max-w-xl space-y-4">
              {requests.length === 0 ? (
                <div className="text-center text-xs text-slate-400 py-12 bg-[#0F172A] rounded-2xl border border-[#1E293B]">
                  No active customer assistance requests.
                </div>
              ) : (
                requests.map(req => (
                  <div key={req.id} className="p-4 bg-[#0F172A] border border-[#1E293B] rounded-2xl flex items-center justify-between gap-4 shadow-xl">
                    <div className="flex items-start gap-3">
                      <Bell className="text-indigo-400 mt-0.5 flex-shrink-0" size={16} />
                      <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-wider">{req.tableName}</h4>
                        <p className="text-xs text-rose-400 font-bold mt-0.5">{req.requestType}</p>
                        {req.notes && <p className="text-[10px] text-slate-400 italic mt-0.5">Notes: {req.notes}</p>}
                        <span className="text-[9px] text-slate-500 font-bold mt-1 block">{req.time}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleServeRequest(req.id)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl transition active:scale-95 shadow-sm"
                    >
                      Resolve Call
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 5: CALL WAITER / QR ASSISTANCE */}
          {activeTab === 'call-waiter' && (
            <div className="max-w-xl space-y-4">
              <div className="p-4 bg-[#1E293B]/70 rounded-2xl border border-[#334155]/40 text-xs">
                <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">Immediate Assistance Log</span>
                <p className="text-slate-300 font-semibold mt-1">This screen displays QR-table helper calls. Quick services buttons are mapped below.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-black">
                <button
                  onClick={() => {
                    const newReq: TableRequest = {
                      id: `r-${Date.now()}`,
                      tableName: 'Table 2',
                      requestType: 'Water Request',
                      status: 'Pending',
                      time: 'Just now'
                    };
                    setRequests([newReq, ...requests]);
                    alert('💧 Simulated: [Water Request] sent for Table 2');
                  }}
                  className="p-3 bg-[#0F172A] hover:bg-slate-800 border border-[#1E293B] rounded-xl text-slate-200 transition"
                >
                  💧 Request Water
                </button>
                <button
                  onClick={() => {
                    const newReq: TableRequest = {
                      id: `r-${Date.now()}`,
                      tableName: 'Table 1',
                      requestType: 'Bill Request',
                      status: 'Pending',
                      time: 'Just now'
                    };
                    setRequests([newReq, ...requests]);
                    alert('💰 Simulated: [Bill Request] sent for Table 1');
                  }}
                  className="p-3 bg-[#0F172A] hover:bg-slate-800 border border-[#1E293B] rounded-xl text-slate-200 transition"
                >
                  💰 Request Bill
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: ORDER HISTORY */}
          {activeTab === 'order-history' && (
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-4 max-w-3xl">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Historical Served Tickets</h3>
              <div className="space-y-2.5">
                {orders.filter(o => o.status === 'COMPLETED').map(order => (
                  <div key={order.id} className="p-3 bg-[#1E293B] rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-black text-white block">{order.orderNumber} ({order.tableId})</span>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 font-black">₹{order.totalBill}</span>
                      <p className="text-[9px] text-slate-500 font-semibold mt-0.5">Closed Successfully</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: DINE IN, TAKEAWAY, DELIVERY FLOWS */}
          {['dine-in', 'takeaway', 'delivery'].includes(activeTab) && (
            <div className="max-w-xl space-y-4">
              <div className="p-5 bg-[#0F172A] border border-[#1E293B] rounded-2xl text-xs space-y-3">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">{activeTab.toUpperCase()} Operation Log</h3>
                <p className="text-slate-300 leading-normal font-semibold">
                  This workspace manages active tokens, delivery partner handovers, and splits. Synchronized with the billing counter POS.
                </p>
                <div className="p-3.5 bg-[#1E293B] rounded-xl border border-[#334155]/30">
                  <span className="text-[9px] text-[#F97316] font-black uppercase tracking-wider block">Token assignment</span>
                  <p className="text-slate-200 mt-1 font-bold">Active Takeaway orders wait for token updates. KDS marks ready for pickup.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: TIPS / EARNINGS LEDGER */}
          {activeTab === 'tips-earnings' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Ledger */}
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-4 lg:col-span-2">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Tip History Ledger</h3>
                <div className="space-y-2.5">
                  {tips.map(tip => (
                    <div key={tip.id} className="p-3 bg-[#1E293B] rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white block">{tip.table}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">Method: {tip.type}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-400 font-black">₹{tip.amount}</span>
                        <p className="text-[9px] text-slate-500 font-semibold mt-0.5">{tip.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Summaries & Bonus Incentives */}
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Shift Earnings summary</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-[#1E293B] rounded-xl">
                    <span className="text-slate-400 text-[10px] font-bold block uppercase tracking-wider">Basic Shift allowance</span>
                    <h4 className="text-xl font-black text-white mt-1">₹1,200</h4>
                  </div>
                  <div className="p-4 bg-[#1E293B] rounded-xl">
                    <span className="text-slate-400 text-[10px] font-bold block uppercase tracking-wider">Tip Collection</span>
                    <h4 className="text-xl font-black text-white mt-1">₹{totalTipsSum}</h4>
                  </div>
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center text-xs font-black text-emerald-400">
                    🏆 Performance Incentive Achieved: +₹250!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="max-w-xl space-y-4">
              {[
                { title: 'Food Ready for Table 4', body: 'Chef Ramesh marked Butter Chicken ready at Grill station.', time: '5 mins ago' },
                { title: 'New Reservation Alert', body: 'Table 3 reserved for Simran Kaur at 13:30.', time: '15 mins ago' },
                { title: 'Kitchen Shift Announcement', body: 'Staff briefing in the main hall at 16:30.', time: '1 hr ago' }
              ].map((n, idx) => (
                <div key={idx} className="p-4 bg-[#0F172A] border border-[#1E293B] rounded-2xl text-xs space-y-1 shadow-lg">
                  <div className="flex justify-between items-center font-black text-white">
                    <span>{n.title}</span>
                    <span className="text-[9px] text-slate-500 font-bold">{n.time}</span>
                  </div>
                  <p className="text-slate-400 font-semibold">{n.body}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 10: FEEDBACK */}
          {activeTab === 'feedback' && (
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-4 max-w-2xl">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Shift Customer Reviews</h3>
              <div className="space-y-3">
                {[
                  { table: 'Table 1', score: 5, comments: 'Ravi was extremely polite and suggested gluten-free alternatives quickly. Excellent service!' },
                  { table: 'Table 9', score: 4.5, comments: 'Quick food delivery, very tidy table.' }
                ].map((f, i) => (
                  <div key={i} className="p-3.5 bg-[#1E293B] rounded-xl text-xs space-y-2 border border-[#334155]/20">
                    <div className="flex justify-between font-black text-white">
                      <span>{f.table}</span>
                      <span className="text-yellow-400 flex items-center gap-1 font-bold">★ {f.score}</span>
                    </div>
                    <p className="text-slate-300 italic font-semibold">"{f.comments}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 11: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 space-y-6 max-w-2xl">
              <h3 className="text-base font-black text-white uppercase tracking-wider pb-3 border-b border-[#1E293B]">Shift Configuration</h3>
              <div className="space-y-4 text-xs font-black">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-300 uppercase block">Shift Status</label>
                  <select
                    value={shiftStatus}
                    onChange={(e) => setShiftStatus(e.target.value as any)}
                    className="w-full bg-[#1E293B] border border-[#334155] rounded-xl px-3 py-2 text-xs outline-none text-slate-200 font-bold"
                  >
                    <option value="Active">Shift Active (On duty)</option>
                    <option value="On Break">Shift Break (Off duty temporary)</option>
                    <option value="Ended">Shift Ended (Clocked Out)</option>
                  </select>
                </div>

                <div className="space-y-2 pt-3 border-t border-[#1E293B]">
                  <label className="text-xs font-black text-slate-300 uppercase block">Device Settings</label>
                  <div className="flex items-center justify-between p-3.5 bg-[#1E293B] rounded-xl">
                    <span className="text-slate-300 font-bold">Waiter KDS notifications audio</span>
                    <button className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition border border-slate-600 text-[10px]">
                      Test Chime
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}

