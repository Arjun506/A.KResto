'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { getBusinessSettings } from '@/services/business.service';
import { getLaunchStatus, LaunchStatusResponse } from '@/services/launch-center.service';
import {
  Sparkles,
  Calendar as CalendarIcon,
  Search,
  Bell,
  AlertTriangle,
  Package,
  Truck,
  ClipboardList,
  LayoutGrid,
  ArrowRight,
  CheckCircle,
  Clock,
  Plus,
  Sliders,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  CreditCard,
  ShoppingCart,
  UserCheck,
  BarChart3,
  Settings,
  Store,
  Zap,
  DollarSign,
  Briefcase,
  Layers,
  ChevronRight,
  ListTodo,
  FileText,
  Shield,
  Globe,
  Terminal,
  CalendarDays
} from 'lucide-react';

// Custom SVG sparkline generator
function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const width = 100;
  const height = 30;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg className="w-20 h-7 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export default function UniversalBusinessDashboard() {
  const { user } = useAuth();

  const [launchStatus, setLaunchStatus] = useState<LaunchStatusResponse | null>(null);
  const [industryFilter, setIndustryFilter] = useState<string>('Restaurant');
  const [roleFilter, setRoleFilter] = useState<string>('Owner');
  const [currentDate, setCurrentDate] = useState('');
  const [businessAddress, setBusinessAddress] = useState('12th Main Road, Indiranagar');
  const [businessPhone, setBusinessPhone] = useState('+91 98765 43210');

  // Checklist tasks states
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Audit raw stock supplies and ingredients counts', done: true },
    { id: 2, text: 'Verify weekly POS invoices batch exports', done: false },
    { id: 3, text: 'Schedule staff shift checkin rosters for tomorrow', done: false }
  ]);

  useEffect(() => {
    const today = new Date();
    setCurrentDate(today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    
    // Load setup progress
    const loadStatus = async () => {
      try {
        const res = await getLaunchStatus();
        setLaunchStatus(res);
      } catch (err) {
        console.warn('Failed to load checklist status.', err);
      }
    };
    
    // Load industry configuration
    const loadIndustry = async () => {
      try {
        const settings = await getBusinessSettings();
        if (settings) {
          if (settings.industry) setIndustryFilter(settings.industry);
          if (settings.address) setBusinessAddress(settings.address);
          if (settings.phone) setBusinessPhone(settings.phone);
        }
      } catch {}
    };

    void loadStatus();
    void loadIndustry();
  }, []);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  // Resolve dynamic customized data for all 7 industry verticals
  const getIndustryDetails = () => {
    const ind = industryFilter.toLowerCase();
    
    if (ind.includes('retail')) {
      return {
        label: 'Active POS Scans',
        val: '842 scans',
        stockWarning: 'Low stock: Milk Cartons & Wheat Flour packets.',
        bookings: ['Inbound cargo stock arrival - 3:00 PM', 'Bulk spices delivery - Tomorrow'],
        kpis: { label: 'Retail Orders', value: '184 sales' }
      };
    }
    if (ind.includes('hotel')) {
      return {
        label: 'Room Occupancy Rate',
        val: '78% (39 rooms)',
        stockWarning: 'Linens inventory is low in Storage 2.',
        bookings: ['Room 304 - Guest Checkin (1:00 PM)', 'Suite 102 - VIP Checkin (4:30 PM)'],
        kpis: { label: 'Guest Checkins', value: '42 bookings' }
      };
    }
    if (ind.includes('salon')) {
      return {
        label: 'Chairs Occupied',
        val: '5 / 8 chairs',
        stockWarning: 'Low stock: Hair dyes (Black, Brown) & conditioners.',
        bookings: ['Nisha Sharma - Hair Trim (2:00 PM)', 'Amit Kumar - Facial Massage (3:15 PM)'],
        kpis: { label: 'Stylist Slots', value: '31 sessions' }
      };
    }
    if (ind.includes('healthcare')) {
      return {
        label: 'OPD Appointments Count',
        val: '24 patients seen',
        stockWarning: 'Low stock: Surgical masks & saline bottles.',
        bookings: ['Dr. Verma - Patient Consultation (2:30 PM)', 'Lab report review schedule (4:00 PM)'],
        kpis: { label: 'OPD Patients', value: '19 cases' }
      };
    }
    if (ind.includes('warehouse')) {
      return {
        label: 'Active Pallets Tracked',
        val: '312 pallets',
        stockWarning: 'Low stock: Bubble wraps rolls & corrugated boxes.',
        bookings: ['Inbound Logistics #TRK829 (3:30 PM)', 'Outbound Dispatch (Tomorrow 8:00 AM)'],
        kpis: { label: 'Pallet Dispatches', value: '62 loads' }
      };
    }
    if (ind.includes('corporate')) {
      return {
        label: 'Resolving Tickets',
        val: '84 resolved',
        stockWarning: 'Low stock: Printer ink cartridges & A4 paper.',
        bookings: ['Weekly Team Sprint Meeting (2:00 PM)', 'Client Pitch: project alpha (4:30 PM)'],
        kpis: { label: 'Active Projects', value: '12 active' }
      };
    }
    // Default Restaurant Industry Pack
    return {
      label: 'Tables Occupied',
      val: '14 / 20 tables',
      stockWarning: 'Low stock: Red Tomatoes & Paneer Cottage Cheese.',
      bookings: ['Table 12 - Group Reservation (7:30 PM)', 'Table 4 - Couple Booking (8:15 PM)'],
      kpis: { label: 'Dining Orders', value: '124 orders' }
    };
  };

  const indDetails = getIndustryDetails();

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto p-4 select-none font-sans">
      
      {/* Workspace Dashboard Header Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-white/5 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-cyan-400">
              <Sliders size={14} />
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-cyan-400">
              Workspace Console Homepage
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-950 dark:text-white tracking-tight">
            Universal Operations Dashboard
          </h1>
          <p className="text-xs font-semibold text-slate-550 dark:text-slate-450">
            Control center for all workspace parameters, modules analytics, and transactions lists.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Industry Selection */}
          <div className="flex items-center gap-2 bg-white/40 dark:bg-slate-900/30 border border-slate-200/50 dark:border-white/5 rounded-xl px-3 py-1.5 shadow-sm text-xs font-bold text-slate-850 dark:text-slate-200">
            <span className="text-[9px] font-black text-slate-400 uppercase">Industry:</span>
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="bg-transparent border-0 outline-none p-0 focus:ring-0 text-xs font-black cursor-pointer"
            >
              <option value="Restaurant">Restaurant Pack</option>
              <option value="Retail">Retail Store</option>
              <option value="Salon">Salon & Wellness</option>
              <option value="Hotel">Hotel Operations</option>
              <option value="Healthcare">Healthcare Clinic</option>
              <option value="Warehouse">Warehouse Logistics</option>
              <option value="Corporate">Corporate Office</option>
            </select>
          </div>

          {/* Role Selection */}
          <div className="flex items-center gap-2 bg-white/40 dark:bg-slate-900/30 border border-slate-200/50 dark:border-white/5 rounded-xl px-3 py-1.5 shadow-sm text-xs font-bold text-slate-850 dark:text-slate-200">
            <span className="text-[9px] font-black text-slate-400 uppercase">View:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent border-0 outline-none p-0 focus:ring-0 text-xs font-black cursor-pointer"
            >
              <option value="Owner">Owner Console</option>
              <option value="Manager">Manager Console</option>
              <option value="Cashier">Staff Console</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid container for Sections 1, 2, 3 */}
      <div className="grid gap-5 grid-cols-1 lg:grid-cols-12">
        
        {/* SECTION 1: Welcome Banner (Span 8) */}
        <div className="lg:col-span-8 relative overflow-hidden rounded-3xl border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-slate-900/30 p-6 backdrop-blur-md shadow-sm">
          <div className="absolute -right-16 -top-16 w-44 h-44 rounded-full bg-blue-500/10 filter blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:bg-cyan-500/15 dark:text-cyan-400 px-2.5 py-1 rounded-md">
                {currentDate}
              </span>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white mt-4 leading-none">
                Welcome back, {user?.name || 'Administrator'}
              </h2>
              <p className="mt-2 text-xs font-semibold text-slate-550 dark:text-slate-400 leading-normal max-w-xl">
                The workspace console is active. You have <strong className="text-blue-650 dark:text-cyan-400">1 active low-stock warning</strong> and <strong className="text-blue-650 dark:text-cyan-400">2 pending bookings</strong> scheduled for this evening.
              </p>
            </div>
            <div className="mt-5 flex gap-3 text-xs font-extrabold text-blue-650 dark:text-cyan-400">
              <span className="flex items-center gap-1">
                <CheckCircle size={13} className="text-emerald-500" />
                All modules active
              </span>
              <span className="text-slate-300 dark:text-white/10">|</span>
              <span className="flex items-center gap-1">
                <Clock size={13} className="text-cyan-500" />
                Backup completed: 1 hr ago
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 2 & 3: Workspace Info & Health Score (Span 4) */}
        <div className="lg:col-span-4 bg-white/40 dark:bg-slate-900/30 border border-slate-200/50 dark:border-white/5 rounded-3xl p-6 backdrop-blur-md shadow-sm flex flex-col justify-between">
          <div>
            <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Active Workspace Info</span>
            <div className="mt-3 text-xs font-bold text-slate-700 dark:text-slate-300 space-y-1.5 text-left">
              <div className="flex justify-between">
                <span>Phone:</span>
                <span className="text-slate-950 dark:text-white">{businessPhone}</span>
              </div>
              <div className="flex justify-between">
                <span>Headquarters:</span>
                <span className="text-slate-950 dark:text-white truncate max-w-[150px]">{businessAddress}</span>
              </div>
            </div>
          </div>

          {/* Health circular progress score */}
          <div className="border-t border-slate-200/40 dark:border-white/5 pt-4.5 mt-4.5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full border-4 border-blue-500/10 border-t-blue-600 flex items-center justify-center text-xs font-black text-blue-650 dark:text-cyan-400 shrink-0">
              {launchStatus?.healthScore || 94}%
            </div>
            <div className="text-left">
              <span className="block text-xs font-black text-slate-950 dark:text-white">Workspace Health Score</span>
              <span className="block text-[9px] text-slate-450 mt-0.5">Checked across 13 core systems</span>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 4: KPI CARDS (6 Metrics) */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-6">
        {[
          { label: 'Total Revenue', val: 'Rs. 48,250', trend: '+12.4%', up: true, spark: [12, 18, 15, 24, 30, 28, 48], color: '#3b82f6' },
          { label: indDetails.kpis.label, val: indDetails.kpis.value, trend: '+8.2%', up: true, spark: [8, 14, 12, 22, 19, 25, 28], color: '#06b6d4' },
          { label: 'Active Members', val: '86 signups', trend: '+4.1%', up: true, spark: [5, 11, 9, 14, 16, 21, 23], color: '#8b5cf6' },
          { label: 'Cash Flow index', val: 'Rs. 38,400', trend: '+6.5%', up: true, spark: [10, 15, 14, 25, 22, 28, 38], color: '#10b981' },
          { label: 'Today\'s Expenses', val: 'Rs. 12,400', trend: '-2.5%', up: false, spark: [18, 16, 20, 15, 14, 13, 12], color: '#f43f5e' },
          { label: 'Growth Rating', val: '+10.5%', trend: 'Stable', up: true, spark: [20, 22, 26, 25, 28, 30, 32], color: '#f59e0b' }
        ].map((card, i) => (
          <div key={i} className="bg-white/40 dark:bg-slate-900/25 border border-slate-200/50 dark:border-white/5 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
            <span className="block text-[8px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-455">{card.label}</span>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-sm font-black text-slate-950 dark:text-white leading-none">{card.val}</span>
              <span className={`text-[8px] font-black uppercase tracking-wider px-1 py-0.5 rounded ${
                card.up 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450' 
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-450'
              }`}>
                {card.trend}
              </span>
            </div>
            {/* Sparkline chart */}
            <div className="mt-3.5 flex justify-end">
              <MiniSparkline data={card.spark} color={card.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Split Grid */}
      <div className="grid gap-6 grid-cols-12">
        
        {/* LEFT COLUMN: Actions, Modules, Transactions, Customers (Span 7) */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          
          {/* SECTION 5: Quick Actions */}
          <div className="bg-white/40 dark:bg-slate-900/25 border border-slate-200/50 dark:border-white/5 rounded-3xl p-5 shadow-sm text-left">
            <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-450 mb-3.5">
              Launch Shortcuts
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[
                { label: 'Create Order', icon: Plus, href: '/dashboard/orders' },
                { label: 'Open POS', icon: CreditCard, href: '/dashboard/pos' },
                { label: 'Add Product', icon: Store, href: '/dashboard/menu' },
                { label: 'Add Customer', icon: Users, href: '/dashboard/customers' },
                { label: 'View Reports', icon: BarChart3, href: '/dashboard/analytics' }
              ].map((qa, idx) => (
                <a
                  key={idx}
                  href={qa.href}
                  className="p-3 bg-white/20 dark:bg-slate-950/20 hover:bg-blue-650/10 hover:text-blue-600 dark:hover:bg-cyan-550/10 dark:hover:text-cyan-400 border border-slate-200/50 dark:border-white/5 rounded-2xl flex flex-col items-center gap-2 transition active:scale-95 shadow-sm"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-slate-200/50 dark:bg-white/5 text-slate-500">
                    <qa.icon size={14} />
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-805 dark:text-slate-250 truncate w-full text-center">
                    {qa.label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* SECTION 10: Installed Modules */}
          <div className="bg-white/40 dark:bg-slate-900/25 border border-slate-200/50 dark:border-white/5 rounded-3xl p-5 shadow-sm text-left">
            <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-450 mb-3.5">
              Enabled Workspace Modules
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[
                { name: 'POS Checkout', icon: CreditCard, color: 'text-blue-500 bg-blue-500/10' },
                { name: 'Inventory Logs', icon: Package, color: 'text-rose-500 bg-rose-500/10' },
                { name: 'Staff Rosters', icon: UserCheck, color: 'text-emerald-500 bg-emerald-500/10' },
                { name: 'AI Insights', icon: Sparkles, color: 'text-amber-500 bg-amber-500/10 animate-pulse' },
                { name: 'CRM & Loyalty', icon: Users, color: 'text-violet-500 bg-violet-500/10' }
              ].map((mod, idx) => (
                <div key={idx} className="p-3 border border-slate-200/40 dark:border-white/5 rounded-2xl bg-white/20 dark:bg-slate-950/20 flex flex-col items-center gap-2">
                  <span className={`grid h-7 w-7 place-items-center rounded-lg ${mod.color}`}>
                    <mod.icon size={13} />
                  </span>
                  <span className="text-[8px] font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider">
                    {mod.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 11: Recent Transactions */}
          <div className="bg-white/40 dark:bg-slate-900/25 border border-slate-200/50 dark:border-white/5 rounded-3xl p-5 shadow-sm text-left">
            <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-455 mb-3">
              Recent Transactions Logs
            </span>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-650 dark:text-slate-350">
                <thead>
                  <tr className="border-b border-slate-200/40 dark:border-white/5 text-[9px] uppercase tracking-wider text-slate-400">
                    <th className="py-2">Invoice #</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-semibold">
                  {[
                    { id: 'INV-8921', status: 'PAID', amount: 'Rs. 2,450', date: '2 mins ago', active: true },
                    { id: 'INV-8920', status: 'PAID', amount: 'Rs. 890', date: '15 mins ago', active: true },
                    { id: 'INV-8919', status: 'REFUNDED', amount: 'Rs. 1,200', date: '1 hr ago', active: false },
                    { id: 'INV-8918', status: 'PAID', amount: 'Rs. 4,120', date: '3 hrs ago', active: true }
                  ].map((tx) => (
                    <tr key={tx.id}>
                      <td className="py-2.5 font-black text-slate-950 dark:text-white">{tx.id}</td>
                      <td className="py-2.5">
                        <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          tx.active 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-2.5">{tx.amount}</td>
                      <td className="py-2.5 text-[10px] text-slate-400">{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 12: Recent Customers */}
          <div className="bg-white/40 dark:bg-slate-900/25 border border-slate-200/50 dark:border-white/5 rounded-3xl p-5 shadow-sm text-left">
            <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-455 mb-3.5">
              Recently Joined Loyalty Members
            </span>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {[
                { name: 'Nikhil Kumar', join: 'Joined today', points: '120 points' },
                { name: 'Sara Jones', join: 'Joined yesterday', points: '250 points' },
                { name: 'Amit Verma', join: 'Joined 2 days ago', points: '80 points' },
                { name: 'Rohan Patil', join: 'Joined 3 days ago', points: '160 points' }
              ].map((cust, idx) => (
                <div key={idx} className="p-2.5 border border-slate-200/40 dark:border-white/5 rounded-xl bg-white/20 dark:bg-slate-950/20 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-black text-slate-950 dark:text-white leading-none">{cust.name}</span>
                    <span className="block text-[8px] text-slate-450 mt-1 leading-none">{cust.join}</span>
                  </div>
                  <span className="text-[9px] font-black text-blue-650 dark:text-cyan-400 bg-blue-500/10 px-2 py-0.5 rounded-lg">
                    {cust.points}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Timeline, Notifications, Calendar, Insights, Team (Span 5) */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          
          {/* SECTION 6: Activity Timeline */}
          <div className="bg-white/40 dark:bg-slate-900/25 border border-slate-200/50 dark:border-white/5 rounded-3xl p-5 shadow-sm text-left">
            <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1.5">
              <Activity size={12} className="text-cyan-550 dark:text-cyan-400" />
              Live Operations Activity Timeline
            </span>
            <div className="space-y-4 font-semibold text-xs text-slate-800 dark:text-slate-350">
              {[
                { title: 'POS transaction completed: Rs. 2,450', desc: 'Invoice #INV-8921 finalized', time: '2 mins ago' },
                { title: 'Kitchen KOT prepared', desc: '1x Veg burger sent to Table 4', time: '12 mins ago' },
                { title: 'Cashier signed in: Amit Kumar', desc: 'Active billing counter session started', time: '35 mins ago' }
              ].map((log, idx) => (
                <div key={idx} className="flex gap-3 relative">
                  {idx < 2 && <div className="absolute top-4 left-1.5 bottom-0 w-[1px] bg-slate-200 dark:bg-white/5" />}
                  <span className="h-3 w-3 rounded-full bg-blue-500/10 border-2 border-blue-500 shrink-0 mt-1" />
                  <div>
                    <span className="block text-xs font-black text-slate-950 dark:text-white leading-none">{log.title}</span>
                    <span className="mt-0.5 block text-[9px] text-slate-450 leading-relaxed">{log.desc}</span>
                    <span className="mt-1 block text-[7px] text-slate-400 font-black uppercase tracking-wider">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 7: Notification Center */}
          <div className="bg-white/40 dark:bg-slate-900/25 border border-slate-200/50 dark:border-white/5 rounded-3xl p-5 shadow-sm text-left">
            <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <Bell size={12} className="text-rose-500" />
              Workspace Alerts History
            </span>
            <div className="space-y-2">
              <div className="p-3 bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100/30 rounded-2xl flex gap-2 items-center text-xs text-rose-700 dark:text-rose-400 font-bold">
                <AlertTriangle size={13} className="text-rose-500 shrink-0" />
                <span>{indDetails.stockWarning}</span>
              </div>
            </div>
          </div>

          {/* SECTION 8: Calendar Widget */}
          <div className="bg-white/40 dark:bg-slate-900/25 border border-slate-200/50 dark:border-white/5 rounded-3xl p-5 shadow-sm text-left">
            <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-455 mb-3.5 flex items-center gap-1.5">
              <CalendarIcon size={12} className="text-blue-505 dark:text-cyan-400" />
              Calendar Agenda Schedule
            </span>
            <div className="space-y-2">
              {indDetails.bookings.map((booking, idx) => (
                <div key={idx} className="p-3 bg-white/20 dark:bg-slate-950/20 border border-slate-200/40 dark:border-white/5 rounded-2xl flex items-center gap-3">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-cyan-400 shrink-0">
                    <Clock size={13} />
                  </span>
                  <span className="text-xs font-bold text-slate-905 dark:text-slate-200 truncate">{booking}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 9: Business Insights (AI Suggestions) */}
          <div className="bg-white/40 dark:bg-slate-900/25 border border-slate-200/50 dark:border-white/5 rounded-3xl p-5 shadow-sm text-left">
            <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3.5 flex items-center gap-1.5">
              <Sparkles size={12} className="text-yellow-500 animate-pulse" />
              AI Suggestions Ticker
            </span>
            <div className="space-y-2 text-xs font-bold text-slate-800 dark:text-slate-300">
              <div className="p-3.5 rounded-2xl border border-blue-500/20 bg-blue-500/5 flex items-start gap-2.5">
                <Activity size={13} className="text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                <span>Peak operational hours expected between 7:30 PM - 9:00 PM tonight.</span>
              </div>
              <div className="p-3.5 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 flex items-start gap-2.5">
                <UserCheck size={13} className="text-indigo-650 dark:text-indigo-405 shrink-0 mt-0.5" />
                <span>Waiter Ravi Verma completed preparation schedule for Station 1.</span>
              </div>
            </div>
          </div>

          {/* SECTION 13: Team Activity */}
          <div className="bg-white/40 dark:bg-slate-900/25 border border-slate-200/50 dark:border-white/5 rounded-3xl p-5 shadow-sm text-left">
            <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3.5 flex items-center gap-1.5">
              <Users size={12} className="text-indigo-500" />
              Active Team Roster
            </span>
            <div className="space-y-2 text-xs font-bold text-slate-800 dark:text-slate-300">
              {[
                { name: 'Amit Kumar', role: 'Cashier Counter', status: 'Online' },
                { name: 'Ravi Verma', role: 'Tables Waiter', status: 'Active' },
                { name: 'Chef Raj', role: 'Head Chef', status: 'In Kitchen' }
              ].map((staff, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 border border-slate-200/40 dark:border-white/5 rounded-xl bg-white/20 dark:bg-slate-950/20">
                  <div>
                    <span className="block text-xs font-black text-slate-950 dark:text-white leading-none">{staff.name}</span>
                    <span className="block text-[8px] text-slate-500 mt-1 leading-none">{staff.role}</span>
                  </div>
                  <span className="text-[8px] font-black uppercase text-emerald-650 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {staff.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks checklist */}
          <div className="bg-white/40 dark:bg-slate-900/25 border border-slate-200/50 dark:border-white/5 rounded-3xl p-5 shadow-sm text-left">
            <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3.5 flex items-center gap-1.5">
              <ListTodo size={12} className="text-indigo-500" />
              Console Task Checklist
            </span>
            <div className="space-y-2 text-xs font-bold text-slate-755 dark:text-slate-300">
              {tasks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => toggleTask(t.id)}
                  type="button"
                  className="w-full flex items-start gap-2 text-left"
                >
                  <span className="mt-0.5 text-indigo-650 dark:text-indigo-400 shrink-0">
                    {t.done ? <CheckCircle size={14} className="fill-current text-white dark:text-slate-900" /> : <Clock size={14} />}
                  </span>
                  <span className={t.done ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-300'}>{t.text}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
