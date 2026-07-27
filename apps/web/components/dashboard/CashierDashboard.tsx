'use client';

import { useState, useMemo } from 'react';
import {
  CreditCard,
  ShoppingCart,
  Users,
  Layers,
  UtensilsCrossed,
  Printer,
  ChevronDown,
  Download,
  Search,
  Plus,
  Trash2,
  DollarSign,
  AlertTriangle,
  Clock,
  Gift,
  X,
  Check,
  Percent,
  Wallet
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';

const hourlySalesData = [
  { hour: '6 AM', sales: 2200 },
  { hour: '9 AM', sales: 4800 },
  { hour: '12 PM', sales: 12400 },
  { hour: '3 PM', sales: 6500 },
  { hour: '6 PM', sales: 15400 },
  { hour: '9 PM', sales: 22100 },
  { hour: '12 AM', sales: 9800 },
];

const orderStatusData = [
  { name: 'New', value: 12, percentage: '21.4%', color: '#3b82f6' },
  { name: 'Accepted', value: 10, percentage: '17.9%', color: '#10b981' },
  { name: 'Preparing', value: 15, percentage: '26.8%', color: '#f97316' },
  { name: 'Ready', value: 11, percentage: '19.6%', color: '#06b6d4' },
  { name: 'Completed', value: 6, percentage: '10.7%', color: '#8b5cf6' },
  { name: 'Cancelled', value: 2, percentage: '3.6%', color: '#ef4444' },
];

export default function CashierDashboard() {
  const [activeTab, setActiveTab] = useState<'All' | 'Dine In' | 'Takeaway' | 'Delivery'>('All');
  const [selectedOrderId, setSelectedOrderId] = useState('ORD1257');

  const [liveOrders, setLiveOrders] = useState([
    {
      id: 'ORD1258',
      table: 'Table 5',
      customerName: 'Rahul Verma',
      total: 1250,
      status: 'New',
      type: 'Dine In',
      time: '2 mins ago',
      cashier: 'Amit Kumar',
      items: [
        { name: 'Paneer Butter Masala', qty: 2, price: 220 },
        { name: 'Garlic Naan', qty: 4, price: 40 },
        { name: 'Cold Coffee', qty: 2, price: 149 }
      ]
    },
    {
      id: 'ORD1257',
      table: 'Table 2',
      customerName: 'Priya Singh',
      total: 540,
      status: 'Preparing',
      type: 'Dine In',
      time: '8 mins ago',
      cashier: 'Amit Kumar',
      items: [
        { name: 'Paneer Butter Masala', qty: 1, price: 220 },
        { name: 'Veg Biryani', qty: 1, price: 160 },
        { name: 'Garlic Naan', qty: 2, price: 40 },
        { name: 'Masala Papad', qty: 1, price: 40 },
        { name: 'Pepsi', qty: 2, price: 30 }
      ]
    },
    {
      id: 'ORD1256',
      table: 'Table 7',
      customerName: 'Karan Patel',
      total: 1450,
      status: 'Accepted',
      type: 'Dine In',
      time: '12 mins ago',
      cashier: 'Amit Kumar',
      items: [
        { name: 'Chicken Biryani', qty: 3, price: 249 },
        { name: 'Tandoori Tikka', qty: 2, price: 299 }
      ]
    },
    {
      id: 'ORD1253',
      table: 'Table 6',
      customerName: 'Amit Kumar',
      total: 780,
      status: 'Preparing',
      type: 'Takeaway',
      time: '15 mins ago',
      cashier: 'Amit Kumar',
      items: [
        { name: 'Chicken Burger', qty: 2, price: 199 },
        { name: 'Cold Coffee', qty: 1, price: 149 },
        { name: 'Garlic Naan', qty: 6, price: 40 }
      ]
    },
    {
      id: 'ORD1252',
      table: 'Table 4',
      customerName: 'Neha Sharma',
      total: 1320,
      status: 'New',
      type: 'Delivery',
      time: '18 mins ago',
      cashier: 'Amit Kumar',
      items: [
        { name: 'Butter Chicken', qty: 2, price: 329 },
        { name: 'Garlic Naan', qty: 4, price: 40 },
        { name: 'Cold Coffee', qty: 3, price: 149 }
      ]
    }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New order #ORD1258 for Table 5', time: '2 mins ago' },
    { id: 2, message: 'Order #ORD1256 accepted', time: '10 mins ago' },
    { id: 3, message: 'Order #ORD1255 is ready to serve', time: '20 mins ago' },
  ]);

  const filteredOrders = useMemo(() => {
    if (activeTab === 'All') return liveOrders;
    return liveOrders.filter((ord) => ord.type === activeTab);
  }, [liveOrders, activeTab]);

  const selectedOrder = useMemo(() => {
    return liveOrders.find((ord) => ord.id === selectedOrderId) || liveOrders[0];
  }, [liveOrders, selectedOrderId]);

  const updateOrderStatus = (orderId: string, nextStatus: string) => {
    setLiveOrders((current) =>
      current.map((ord) => (ord.id === orderId ? { ...ord, status: nextStatus } : ord))
    );
  };

  const handlePrintReceipt = (ord: any) => {
    alert(`Printing Receipt for Order ${ord.id}...\nTotal: ₹${(ord.total * 1.05).toFixed(2)}`);
  };

  // Calculations for billing
  const subtotal = selectedOrder ? selectedOrder.items.reduce((sum, item) => sum + (item.price * item.qty), 0) : 0;
  const cgst = subtotal * 0.025;
  const sgst = subtotal * 0.025;
  const totalBill = subtotal + cgst + sgst;

  return (
    <div className="space-y-6 text-slate-900 bg-[#F6F8FD] p-1">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            Dashboard 🎛️
          </h1>
          <p className="text-sm text-slate-505 mt-1.5 font-bold">Billing Counter - Amit Kumar</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 cursor-pointer transition text-sm font-black text-slate-700 shadow-sm">
            <Layers size={16} className="text-slate-500" />
            <span>Table QR Scan</span>
          </button>

          <button className="bg-[#5850ec] hover:bg-[#4b45cc] text-white px-5 py-3 rounded-xl text-sm font-black flex items-center gap-2 active:scale-95 transition-all shadow-md shadow-indigo-600/10">
            <Plus size={16} />
            <span>Walk-in Order</span>
          </button>
        </div>
      </div>

      {/* METRICS ROW (5 CARDS) */}
      <section className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <ShoppingCart size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-505 font-black uppercase tracking-wider">Today's Orders</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">56</h3>
            <span className="text-xs text-emerald-600 font-black mt-1.5 block">↑ 12.5% <span className="text-slate-400 font-extrabold">prev</span></span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-650 flex items-center justify-center flex-shrink-0 font-black text-xl">
            ₹
          </div>
          <div>
            <p className="text-xs text-slate-505 font-black uppercase tracking-wider">Today's Revenue</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">₹18,750</h3>
            <span className="text-xs text-emerald-600 font-black mt-1.5 block">↑ 18.6% <span className="text-slate-400 font-extrabold">prev</span></span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-505 flex items-center justify-center flex-shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-505 font-black uppercase tracking-wider">Pending Orders</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">12</h3>
            <span className="text-xs text-slate-400 font-extrabold mt-1.5 block">View All</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Check size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-505 font-black uppercase tracking-wider">Completed Orders</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">44</h3>
            <span className="text-xs text-slate-400 font-extrabold mt-1.5 block">View All</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-505 font-black uppercase tracking-wider">Cancelled Orders</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">2</h3>
            <span className="text-xs text-slate-400 font-extrabold mt-1.5 block">View All</span>
          </div>
        </div>
      </section>

      {/* THREE COLUMN GRID */}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1.5fr_1.4fr]">
        
        {/* LEFT COLUMN: STATUS OVERVIEW, QUICK ACTIONS, PAYMENT SUMMARY */}
        <div className="space-y-6">
          
          {/* ORDER STATUS OVERVIEW */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
            <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">Order Status Overview</h2>
            
            <div className="flex items-center gap-6">
              <div className="relative h-[110px] w-[110px] flex items-center justify-center flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={32}
                      outerRadius={48}
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
                  <span className="text-lg font-black text-slate-900 leading-none">56</span>
                  <span className="text-[8px] text-slate-500 font-black mt-1 uppercase tracking-wider">Total</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs flex-1">
                {orderStatusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between font-black text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </div>
                    <span className="text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
            <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">Quick Actions</h2>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'New Order', icon: ShoppingCart, color: 'bg-emerald-50 text-emerald-600' },
                { label: 'Dine In', icon: Layers, color: 'bg-blue-50 text-blue-650' },
                { label: 'Takeaway', icon: UtensilsCrossed, color: 'bg-orange-50 text-orange-505' },
                { label: 'Delivery', icon: CreditCard, color: 'bg-purple-50 text-purple-600' },
                { label: 'Reservations', icon: Clock, color: 'bg-cyan-50 text-cyan-600' },
                { label: 'Check Order', icon: Search, color: 'bg-rose-50 text-rose-500' },
                { label: 'Apply Coupon', icon: Gift, color: 'bg-yellow-50 text-yellow-600' },
                { label: 'Refund', icon: DollarSign, color: 'bg-red-50 text-red-500' },
              ].map((act, i) => {
                const Icon = act.icon;
                return (
                  <button
                    key={i}
                    onClick={() => alert(`Triggered ${act.label}`)}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition active:scale-95"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 ${act.color}`}>
                      <Icon size={18} />
                    </div>
                    <span className="text-[10px] font-black text-slate-800 text-center leading-none">{act.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PAYMENT SUMMARY */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
            <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">Payment Summary</h2>
            <div className="space-y-3">
              {[
                { method: 'Cash', value: '₹8,250', icon: DollarSign, color: 'text-emerald-500' },
                { method: 'UPI', icon: Wallet, value: '₹6,450', color: 'text-blue-500' },
                { method: 'Card', icon: CreditCard, value: '₹3,750', color: 'text-purple-500' },
                { method: 'Wallet', icon: Gift, value: '₹300', color: 'text-yellow-650' },
              ].map((p, i) => (
                <div key={i} className="flex justify-between items-center text-sm font-black text-slate-700">
                  <div className="flex items-center gap-2">
                    <p.icon size={16} className={p.color} />
                    <span>{p.method}</span>
                  </div>
                  <span className="text-slate-900">{p.value}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-slate-100 flex justify-between items-center font-black text-slate-900 text-base">
                <span>Total</span>
                <span>₹18,750</span>
              </div>
            </div>
          </div>

        </div>

        {/* CENTER COLUMN: RECENT ORDERS, HOURLY SALES, KITCHEN STATUS, NOTIFICATIONS */}
        <div className="space-y-6">
          
          {/* RECENT ORDERS */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">Recent Orders</h2>
              <button className="text-sm font-black text-[#5850ec] hover:underline">View All</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-black">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400">
                    <th className="py-2">Order ID</th>
                    <th className="py-2">Table</th>
                    <th className="py-2">Customer</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {liveOrders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 cursor-pointer" onClick={() => setSelectedOrderId(order.id)}>
                      <td className="py-3 font-black text-indigo-650">#{order.id}</td>
                      <td className="py-3 text-slate-750">{order.table}</td>
                      <td className="py-3 text-slate-750">{order.customerName}</td>
                      <td className="py-3 text-slate-900">₹{order.total}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                          order.status === 'New' ? 'bg-blue-50 text-blue-600' :
                          order.status === 'Preparing' ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* HOURLY SALES CHART */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
            <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">Today's Hourly Sales</h2>
            <div className="h-[140px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlySalesData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <XAxis dataKey="hour" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <ChartTooltip />
                  <Bar dataKey="sales" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* KITCHEN STATUS & NOTIFICATIONS */}
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* KITCHEN STATUS */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
              <h2 className="font-black text-base text-slate-900 uppercase tracking-wider">Kitchen Status</h2>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-blue-50/50 p-2.5 rounded-2xl border border-blue-50">
                  <p className="text-xl font-black text-blue-600">12</p>
                  <p className="text-[9px] text-slate-505 font-bold uppercase tracking-wider mt-1">New</p>
                </div>
                <div className="bg-orange-50/50 p-2.5 rounded-2xl border border-orange-55">
                  <p className="text-xl font-black text-orange-505">15</p>
                  <p className="text-[9px] text-slate-505 font-bold uppercase tracking-wider mt-1">Prep</p>
                </div>
                <div className="bg-cyan-50/50 p-2.5 rounded-2xl border border-cyan-50">
                  <p className="text-xl font-black text-cyan-600">11</p>
                  <p className="text-[9px] text-slate-505 font-bold uppercase tracking-wider mt-1">Ready</p>
                </div>
              </div>
            </div>

            {/* NOTIFICATIONS */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-black text-base text-slate-900 uppercase tracking-wider">Notifications</h2>
                <button className="text-xs text-indigo-650 font-black hover:underline">View All</button>
              </div>
              <div className="space-y-2.5 max-h-[100px] overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div key={n.id} className="text-[10px] font-extrabold text-slate-800 leading-normal border-b border-slate-50 pb-2 last:border-none">
                    <p className="line-clamp-1">{n.message}</p>
                    <span className="text-[8px] text-slate-400 mt-0.5 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: ACTIVE ORDERS & BILL CHECKOUT PANEL */}
        <div className="space-y-6">
          
          {/* ACTIVE ORDERS */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
            <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">Active Orders ({liveOrders.length})</h2>
            
            {/* TABS */}
            <div className="flex gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
              {(['All', 'Dine In', 'Takeaway', 'Delivery'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 text-[10px] font-black py-2 rounded-xl transition ${
                    activeTab === tab
                      ? 'bg-white text-indigo-650 shadow-sm'
                      : 'text-slate-505 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* LIST */}
            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
              {filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrderId(ord.id)}
                  className={`p-4 rounded-3xl border transition cursor-pointer flex justify-between items-center ${
                    selectedOrderId === ord.id
                      ? 'border-[#BFDEF3] bg-[#BFDEF3]/15 shadow-sm'
                      : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-left">
                    <p className="text-slate-900 text-sm font-black">#{ord.id} <span className="text-xs text-slate-400 font-bold ml-1">{ord.table}</span></p>
                    <span className="text-[10px] text-slate-400 font-bold block mt-1">{ord.time}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-900 text-sm font-black">₹{ord.total}</p>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider mt-1.5 inline-block ${
                      ord.status === 'New' ? 'bg-blue-50 text-blue-600' :
                      ord.status === 'Preparing' ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ORDER CHECKOUT PANEL */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-lg text-slate-900 flex items-center gap-1.5">
                  #{selectedOrder.id}
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                    selectedOrder.status === 'New' ? 'bg-blue-50 text-blue-600' :
                    selectedOrder.status === 'Preparing' ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {selectedOrder.status}
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400 font-extrabold mt-0.5">{selectedOrder.table} • {selectedOrder.type}</p>
              </div>

              <button
                onClick={() => handlePrintReceipt(selectedOrder)}
                className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-505 transition active:scale-95 border border-slate-100"
                title="Print Bill"
              >
                <Printer size={16} />
              </button>
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-505 font-black uppercase tracking-wider">
              <span>Time: 31 May, 12:45 PM</span>
              <span>Cashier: {selectedOrder.cashier}</span>
            </div>

            {/* BILL ITEMS TABLE */}
            <div className="overflow-x-auto py-2 border-t border-b border-slate-50">
              <table className="w-full text-left text-xs font-black">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-50">
                    <th className="py-1">Items</th>
                    <th className="py-1 text-center">Qty</th>
                    <th className="py-1 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {selectedOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 text-slate-900">{item.name}</td>
                      <td className="py-2.5 text-center text-slate-750">{item.qty}</td>
                      <td className="py-2.5 text-right text-slate-900">₹{item.price * item.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CALCULATIONS */}
            <div className="space-y-2.5 text-sm font-black text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-505 font-bold">Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-555 font-bold">CGST (2.5%)</span>
                <span>₹{cgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-555 font-bold">SGST (2.5%)</span>
                <span>₹{sgst.toFixed(2)}</span>
              </div>
              <div className="pt-2.5 border-t border-slate-100 flex justify-between text-slate-900 text-base">
                <span>Total</span>
                <span>₹{totalBill.toFixed(2)}</span>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <button
                onClick={() => alert('Editing Order...')}
                className="py-3 text-xs font-black rounded-xl text-slate-700 hover:bg-slate-50 border border-slate-200 transition active:scale-95"
              >
                Edit Order
              </button>

              <button
                onClick={() => updateOrderStatus(selectedOrder.id, 'Cancelled')}
                className="py-3 text-xs font-black rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition active:scale-95"
              >
                Cancel Order
              </button>

              <button
                onClick={() => updateOrderStatus(selectedOrder.id, 'Accepted')}
                className="py-3 text-xs font-black rounded-xl bg-[#5850ec] hover:bg-[#4b45cc] text-white transition active:scale-95 shadow-md shadow-indigo-500/10"
              >
                Accept Order
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

