'use client';

import { useState } from 'react';
import {
  Layers,
  Clock,
  Bell,
  AlertTriangle,
  UtensilsCrossed,
  DollarSign,
  UserCheck,
  CheckCircle,
  MessageSquare,
  Sparkles,
  ClipboardList,
  ChevronDown,
  X,
  Droplets,
  RotateCcw,
  Check
} from 'lucide-react';

interface Table {
  id: number;
  name: string;
  status: 'Occupied' | 'Available' | 'Reserved' | 'Cleaning';
  guests: number;
  time: string;
  activeBill: number;
}

export default function WaiterDashboard() {
  const [tables, setTables] = useState<Table[]>([
    { id: 1, name: 'Table 1', status: 'Occupied', guests: 3, time: '00:15', activeBill: 540 },
    { id: 2, name: 'Table 2', status: 'Occupied', guests: 4, time: '00:45', activeBill: 1320 },
    { id: 3, name: 'Table 3', status: 'Occupied', guests: 2, time: '00:30', activeBill: 410 },
    { id: 4, name: 'Table 4', status: 'Available', guests: 0, time: '--:--', activeBill: 0 },
    { id: 5, name: 'Table 5', status: 'Occupied', guests: 2, time: '00:30', activeBill: 890 },
    { id: 6, name: 'Table 6', status: 'Available', guests: 0, time: '--:--', activeBill: 0 },
    { id: 7, name: 'Table 7', status: 'Occupied', guests: 6, time: '01:15', activeBill: 1450 },
    { id: 8, name: 'Table 8', status: 'Reserved', guests: 2, time: '00:00', activeBill: 0 },
    { id: 9, name: 'Table 9', status: 'Occupied', guests: 3, time: '00:20', activeBill: 670 },
    { id: 10, name: 'Table 10', status: 'Occupied', guests: 4, time: '00:15', activeBill: 920 },
    { id: 11, name: 'Table 11', status: 'Occupied', guests: 2, time: '00:10', activeBill: 340 },
    { id: 12, name: 'Table 12', status: 'Occupied', guests: 3, time: '00:08', activeBill: 590 },
    { id: 13, name: 'Table 13', status: 'Occupied', guests: 4, time: '00:07', activeBill: 820 },
    { id: 14, name: 'Table 14', status: 'Occupied', guests: 5, time: '00:05', activeBill: 1150 },
    { id: 15, name: 'Table 15', status: 'Occupied', guests: 2, time: '00:03', activeBill: 480 },
  ]);

  const [readyOrders, setReadyOrders] = useState([
    { id: '#ORD1258', table: 'Table 5', items: '3 items', time: '11:28 AM' },
    { id: '#ORD1256', table: 'Table 7', items: '4 items', time: '11:25 AM' },
    { id: '#ORD1255', table: 'Table 3', items: '2 items', time: '11:20 AM' },
    { id: '#ORD1251', table: 'Table 9', items: '3 items', time: '11:18 AM' },
    { id: '#ORD1249', table: 'Table 11', items: '2 items', time: '11:15 AM' },
  ]);

  const [requests, setRequests] = useState([
    { id: 1, table: 'Table 3', type: 'Request: Water', time: '2 mins ago', status: 'Pending' },
    { id: 2, table: 'Table 7', type: 'Request: Table Cleaning', time: '5 mins ago', status: 'Pending' },
    { id: 3, table: 'Table 11', type: 'Request: Tissue', time: '10 mins ago', status: 'Pending' },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Order #ORD1258 is ready to serve', time: '2 mins ago' },
    { id: 2, text: 'Table 3 requested for water', time: '5 mins ago' },
    { id: 3, text: 'Table 7 requested for table cleaning', time: '8 mins ago' },
    { id: 4, text: 'New order received for Table 9', time: '12 mins ago' },
  ]);

  const [servedOrders, setServedOrders] = useState([
    { id: '#ORD1247', table: 'Table 2', items: '4 items', time: '11:10 AM', amount: '₹1,320', status: 'Paid' },
    { id: '#ORD1245', table: 'Table 1', items: '3 items', time: '11:05 AM', amount: '₹980', status: 'Paid' },
    { id: '#ORD1243', table: 'Table 6', items: '2 items', time: '10:55 AM', amount: '₹650', status: 'Paid' },
  ]);

  const handleServeNow = (orderId: string) => {
    const order = readyOrders.find((ord) => ord.id === orderId);
    if (!order) return;
    setReadyOrders((current) => current.filter((ord) => ord.id !== orderId));
    setServedOrders((current) => [
      {
        id: order.id,
        table: order.table,
        items: order.items,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        amount: '₹850',
        status: 'Paid'
      },
      ...current
    ]);
  };

  const handleTakeAction = (requestId: number) => {
    setRequests((current) =>
      current.map((req) => (req.id === requestId ? { ...req, status: 'Resolved' } : req))
    );
    setTimeout(() => {
      setRequests((current) => current.filter((req) => req.id !== requestId));
    }, 1500);
  };

  const handleUpdateTableStatus = (tableId: number, nextStatus: 'Occupied' | 'Available' | 'Reserved' | 'Cleaning') => {
    setTables((current) =>
      current.map((t) => (t.id === tableId ? { ...t, status: nextStatus } : t))
    );
  };

  return (
    <div className="space-y-6 text-slate-900 bg-[#F6F8FD] p-1">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            Good Morning, Ravi! 👋
          </h1>
          <p className="text-sm text-slate-505 mt-1.5 font-bold">Here's what's happening in the restaurant today.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 cursor-pointer transition text-sm font-black text-slate-700 shadow-sm">
            <Clock size={16} className="text-slate-500" />
            <span>31 May 2024, Friday, 11:30 AM</span>
          </div>
        </div>
      </div>

      {/* METRICS ROW (5 CARDS) */}
      <section className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#8b5cf6] flex items-center justify-center flex-shrink-0">
            <Layers size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-505 font-black uppercase tracking-wider">Assigned Tables</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">6</h3>
            <span className="text-xs text-[#0f766e] font-black mt-1.5 block">Active Tables</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <UtensilsCrossed size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-505 font-black uppercase tracking-wider">Orders to Serve</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">5</h3>
            <span className="text-xs text-blue-605 font-black mt-1.5 block">Ready to Serve</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-505 flex items-center justify-center flex-shrink-0">
            <Bell size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-505 font-black uppercase tracking-wider">New Requests</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">3</h3>
            <span className="text-xs text-orange-600 font-black mt-1.5 block">Needs Attention</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-650 flex items-center justify-center flex-shrink-0 font-black text-xl">
            ₹
          </div>
          <div>
            <p className="text-xs text-slate-505 font-black uppercase tracking-wider">Today's Tips</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">₹650</h3>
            <span className="text-xs text-slate-400 font-extrabold mt-1.5 block">Total Tips</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0 font-black text-xl">
            ₹
          </div>
          <div>
            <p className="text-xs text-slate-505 font-black uppercase tracking-wider">Today's Earnings</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">₹1,850</h3>
            <span className="text-xs text-slate-400 font-extrabold mt-1.5 block">Total Earnings</span>
          </div>
        </div>
      </section>

      {/* THREE COLUMN WAIT PANEL BODY */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1.4fr_1.4fr]">
        
        {/* COLUMN 1: MY ASSIGNED TABLES, ORDERS TO SERVE, TODAY'S SUMMARY */}
        <div className="space-y-6">
          
          {/* MY ASSIGNED TABLES */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">My Assigned Tables</h2>
              <button className="text-sm font-black text-[#5850ec] hover:underline">View All</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-black">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400">
                    <th className="py-2">Table No.</th>
                    <th className="py-2">Customers</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Hours</th>
                    <th className="py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {tables.filter(t => t.id === 2 || t.id === 5 || t.id === 7 || t.id === 9 || t.id === 11 || t.id === 14).map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/50">
                      <td className="py-3 font-black text-slate-900">{t.name}</td>
                      <td className="py-3 text-slate-505 font-bold">{t.guests ? `${t.guests} Guests` : '--'}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                          t.status === 'Occupied' ? 'bg-emerald-50 text-emerald-600' :
                          t.status === 'Reserved' ? 'bg-orange-50 text-orange-505' :
                          t.status === 'Cleaning' ? 'bg-purple-50 text-purple-600' : 'bg-slate-50 text-slate-505'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-505 font-bold">{t.time}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => alert(`Showing layout details for ${t.name}`)}
                          className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-xl transition font-black text-[#5850ec]"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ORDERS TO SERVE */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">Orders to Serve</h2>
              <button className="text-sm font-black text-[#5850ec] hover:underline">View All</button>
            </div>

            <div className="space-y-3.5">
              {readyOrders.length === 0 ? (
                <p className="text-xs font-bold text-slate-400 text-center py-6">All orders have been served!</p>
              ) : (
                readyOrders.map((ord) => (
                  <div key={ord.id} className="flex justify-between items-center text-xs font-black">
                    <div>
                      <p className="text-slate-900 text-sm font-black">{ord.id}</p>
                      <p className="text-slate-505 font-bold mt-0.5">{ord.table} • {ord.items}</p>
                    </div>
                    <span className="text-slate-505 font-bold">{ord.time}</span>
                    <button
                      onClick={() => handleServeNow(ord.id)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition font-black active:scale-95 shadow-sm shadow-emerald-550/10"
                    >
                      Serve Now
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* TODAY'S SUMMARY */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
            <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">Today's Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-violet-50/50 p-4 rounded-3xl border border-violet-50">
                <p className="text-[10px] text-slate-505 font-black uppercase tracking-wider">Orders Served</p>
                <p className="text-3xl font-black text-[#8b5cf6] mt-1">28</p>
              </div>
              <div className="bg-blue-50/50 p-4 rounded-3xl border border-blue-50">
                <p className="text-[10px] text-slate-505 font-black uppercase tracking-wider">Tables Handled</p>
                <p className="text-3xl font-black text-blue-600 mt-1">6</p>
              </div>
              <div className="bg-emerald-50/50 p-4 rounded-3xl border border-emerald-50">
                <p className="text-[10px] text-slate-555 font-black uppercase tracking-wider">Total Tips</p>
                <p className="text-3xl font-black text-emerald-650 mt-1">₹650</p>
              </div>
              <div className="bg-rose-50/50 p-4 rounded-3xl border border-rose-50">
                <p className="text-[10px] text-slate-555 font-black uppercase tracking-wider">Total Earnings</p>
                <p className="text-3xl font-black text-rose-500 mt-1">₹1,850</p>
              </div>
            </div>
          </div>

        </div>

        {/* COLUMN 2: NOTIFICATIONS & TABLE STATUS MAP */}
        <div className="space-y-6">
          
          {/* NOTIFICATIONS */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">Notifications</h2>
              <button className="text-sm font-black text-[#5850ec] hover:underline">View All</button>
            </div>
            
            <div className="space-y-3 max-h-[170px] overflow-y-auto pr-1">
              {notifications.map((n) => (
                <div key={n.id} className="flex gap-3 items-start border-b border-slate-50 pb-2.5 last:border-none last:pb-0">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-505 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bell size={14} />
                  </div>
                  <div className="flex-1 text-xs font-black">
                    <p className="text-slate-805 leading-normal">{n.text}</p>
                    <span className="text-[9px] text-slate-400 font-bold block mt-1">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TABLE STATUS MAP */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">Table Status Map</h2>
                <div className="flex items-center gap-3.5 mt-2 text-[9px] font-black uppercase tracking-wider text-slate-505">
                  <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Occupied</div>
                  <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-white border border-emerald-500" /> Available</div>
                  <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Reserved</div>
                  <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Cleaning</div>
                </div>
              </div>
              <button className="text-xs font-black text-[#5850ec] hover:underline flex-shrink-0">Legend</button>
            </div>

            {/* TABLE MAP GRID */}
            <div className="grid grid-cols-5 gap-3.5 py-2">
              {tables.map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    const statuses: ('Occupied' | 'Available' | 'Reserved' | 'Cleaning')[] = ['Occupied', 'Available', 'Reserved', 'Cleaning'];
                    const currentIdx = statuses.indexOf(t.status);
                    const nextStatus = statuses[(currentIdx + 1) % statuses.length];
                    handleUpdateTableStatus(t.id, nextStatus);
                  }}
                  className={`aspect-square rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition select-none ${
                    t.status === 'Occupied' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm shadow-emerald-500/5' :
                    t.status === 'Available' ? 'bg-white border-emerald-500 text-emerald-600 hover:bg-emerald-50/20' :
                    t.status === 'Reserved' ? 'bg-orange-50 border-orange-200 text-orange-600 shadow-sm' :
                    'bg-purple-50 border-purple-200 text-purple-600 shadow-sm'
                  }`}
                >
                  {/* Table Illustration Icon (Boxed outline) */}
                  <div className="w-7 h-5 border-2 border-current rounded-md flex items-center justify-center relative">
                    <span className="text-[10px] font-black">{t.id}</span>
                    <div className="absolute -top-1 w-3 h-0.5 bg-current rounded-full" />
                    <div className="absolute -bottom-1 w-3 h-0.5 bg-current rounded-full" />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => alert('Opening Full Table Layout Editor...')}
              className="w-full py-3 border border-slate-200 hover:bg-slate-50 transition rounded-2xl font-black text-sm text-slate-800 active:scale-95"
            >
              View Full Layout
            </button>
          </div>

        </div>

        {/* COLUMN 3: SERVICE REQUESTS, QUICK ACTIONS, RECENTLY SERVED */}
        <div className="space-y-6">
          
          {/* SERVICE REQUESTS */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">Service Requests</h2>
              <button className="text-sm font-black text-[#5850ec] hover:underline">View All</button>
            </div>

            <div className="space-y-3.5">
              {requests.length === 0 ? (
                <p className="text-xs font-bold text-slate-400 text-center py-6">No pending service requests!</p>
              ) : (
                requests.map((req) => (
                  <div
                    key={req.id}
                    className={`flex justify-between items-center p-3 rounded-2xl border transition ${
                      req.status === 'Resolved' ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-100'
                    }`}
                  >
                    <div>
                      <p className="text-slate-900 text-sm font-black">{req.table}</p>
                      <p className="text-[11px] text-slate-505 font-bold mt-0.5">{req.type} • {req.time}</p>
                    </div>
                    <button
                      disabled={req.status === 'Resolved'}
                      onClick={() => handleTakeAction(req.id)}
                      className={`px-4 py-2 rounded-xl transition text-xs font-black active:scale-95 ${
                        req.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : 'bg-[#5850ec] hover:bg-[#4b45cc] text-white shadow-sm'
                      }`}
                    >
                      {req.status === 'Resolved' ? 'Resolved' : 'Take Action'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
            <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">Quick Actions</h2>
            <div className="grid grid-cols-3 gap-3 text-xs font-black">
              {[
                { label: 'Call Waiter', icon: UserCheck, color: 'bg-violet-50 text-[#8b5cf6]' },
                { label: 'Request Cleaning', icon: RotateCcw, color: 'bg-emerald-50 text-emerald-650' },
                { label: 'Request Items', icon: ClipboardList, color: 'bg-orange-50 text-orange-505' },
                { label: 'Refill Water', icon: Droplets, color: 'bg-blue-50 text-blue-600' },
                { label: 'Update Table Status', icon: Layers, color: 'bg-cyan-50 text-cyan-600' },
                { label: 'Send Message', icon: MessageSquare, color: 'bg-rose-50 text-rose-500' },
              ].map((act, i) => {
                const Icon = act.icon;
                return (
                  <button
                    key={i}
                    onClick={() => alert(`Quick Action: ${act.label}`)}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition active:scale-95"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 ${act.color}`}>
                      <Icon size={16} />
                    </div>
                    <span className="text-[10px] text-center font-black text-slate-800 leading-none">{act.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RECENTLY SERVED ORDERS */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">Recently Served Orders</h2>
              <button className="text-sm font-black text-[#5850ec] hover:underline">View All</button>
            </div>

            <div className="space-y-3.5">
              {servedOrders.map((ord) => (
                <div key={ord.id} className="flex justify-between items-center text-xs font-black">
                  <div>
                    <p className="text-slate-900 text-sm font-black">{ord.id}</p>
                    <p className="text-slate-505 font-bold mt-0.5">{ord.table} • {ord.items}</p>
                  </div>
                  <span className="text-slate-505 font-bold">{ord.time}</span>
                  <div className="text-right">
                    <p className="text-slate-905 font-black">{ord.amount}</p>
                    <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-1.5 inline-block">
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

