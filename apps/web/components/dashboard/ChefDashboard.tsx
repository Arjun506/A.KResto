'use client';

import { useState, useEffect } from 'react';
import {
  ChefHat,
  Clock,
  AlertCircle,
  Play,
  Check,
  CheckSquare,
  MessageSquare,
  Package,
  PlusCircle,
  TrendingUp,
  UserCheck,
  BookOpen,
  Volume2,
  VolumeX,
  Tv,
  RefreshCw,
  Plus
} from 'lucide-react';

export default function ChefDashboard() {
  const [soundOn, setSoundOn] = useState(true);
  const [screenFull, setScreenFull] = useState(false);

  const [metrics, setMetrics] = useState({
    newCount: 8,
    prepCount: 15,
    readyCount: 11,
    completedCount: 32,
    avgTime: '18 Min'
  });

  const [newOrders, setNewOrders] = useState([
    { id: '#ORD1265', table: 'Table 5', items: '4 items', time: '2 mins ago' },
    { id: '#ORD1266', table: 'Table 7', items: '3 items', time: '4 mins ago' },
    { id: '#ORD1267', table: 'Table 2', items: '5 items', time: '5 mins ago' },
    { id: '#ORD1268', table: 'Table 3', items: '2 items', time: '7 mins ago' },
    { id: '#ORD1269', table: 'Table 9', items: '3 items', time: '8 mins ago' },
    { id: '#ORD1270', table: 'Table 1', items: '4 items', time: '10 mins ago' },
    { id: '#ORD1271', table: 'Table 6', items: '2 items', time: '12 mins ago' },
    { id: '#ORD1272', table: 'Table 8', items: '3 items', time: '15 mins ago' },
  ]);

  const [preparingOrders, setPreparingOrders] = useState([
    { id: '#ORD1258', table: 'Table 5', items: '4 items', elapsed: '12:15 Min', status: 'In Progress', progress: 60 },
    { id: '#ORD1257', table: 'Table 2', items: '3 items', elapsed: '10:30 Min', status: 'In Progress', progress: 50 },
    { id: '#ORD1256', table: 'Table 7', items: '5 items', elapsed: '08:45 Min', status: 'In Progress', progress: 75 },
    { id: '#ORD1255', table: 'Table 3', items: '2 items', elapsed: '06:20 Min', status: 'In Progress', progress: 40 },
    { id: '#ORD1254', table: 'Table 1', items: '4 items', elapsed: '04:10 Min', status: 'In Progress', progress: 55 },
  ]);

  const [readyOrders, setReadyOrders] = useState([
    { id: '#ORD1249', table: 'Table 5', items: '3 items', time: '11:30 AM' },
    { id: '#ORD1250', table: 'Table 2', items: '4 items', time: '11:32 AM' },
    { id: '#ORD1251', table: 'Table 7', items: '3 items', time: '11:35 AM' },
  ]);

  const [prepTimeSettings, setPrepTimeSettings] = useState([
    { id: '#ORD1258', table: 'Table 5', items: '4 items', minutes: 15 },
    { id: '#ORD1257', table: 'Table 2', items: '3 items', minutes: 20 },
    { id: '#ORD1256', table: 'Table 7', items: '5 items', minutes: 25 },
    { id: '#ORD1255', table: 'Table 3', items: '2 items', minutes: 10 },
    { id: '#ORD1254', table: 'Table 1', items: '4 items', minutes: 15 },
  ]);

  const [stockList, setStockList] = useState([
    { id: '1', name: 'Tomato', qty: '6 kg', status: 'Critical', color: 'bg-rose-50 text-rose-500' },
    { id: '2', name: 'Onion', qty: '8 kg', status: 'Available', color: 'bg-emerald-50 text-emerald-600' },
    { id: '3', name: 'Paneer', qty: '4 kg', status: 'Low Stock', color: 'bg-yellow-50 text-yellow-505' },
    { id: '4', name: 'Chicken', qty: '12 kg', status: 'Available', color: 'bg-emerald-50 text-emerald-600' },
    { id: '5', name: 'Rice', qty: '20 kg', status: 'Available', color: 'bg-emerald-50 text-emerald-600' },
  ]);

  const [announcements, setAnnouncements] = useState([
    { id: 1, type: 'NEW', text: '8 new orders received', time: '2 mins ago' },
    { id: 2, type: 'ALERT', text: 'Stock Alert: Tomato is running low', time: '10 mins ago' },
    { id: 3, type: 'INFO', text: 'Order #ORD1258 is ready to serve', time: '15 mins ago' },
    { id: 4, type: 'UPDATE', text: 'Order #ORD1256 preparation time updated', time: '20 mins ago' },
  ]);

  const handleStartPreparing = (orderId: string) => {
    const order = newOrders.find((ord) => ord.id === orderId);
    if (!order) return;
    setNewOrders((current) => current.filter((ord) => ord.id !== orderId));
    setPreparingOrders((current) => [
      {
        id: order.id,
        table: order.table,
        items: order.items,
        elapsed: '00:01 Min',
        status: 'In Progress',
        progress: 10
      },
      ...current
    ]);
    setPrepTimeSettings((current) => [
      {
        id: order.id,
        table: order.table,
        items: order.items,
        minutes: 15
      },
      ...current
    ]);
  };

  const handleMarkReady = (orderId: string) => {
    const order = preparingOrders.find((ord) => ord.id === orderId);
    if (!order) return;
    setPreparingOrders((current) => current.filter((ord) => ord.id !== orderId));
    setPrepTimeSettings((current) => current.filter((ord) => ord.id !== orderId));
    setReadyOrders((current) => [
      {
        id: order.id,
        table: order.table,
        items: order.items,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...current
    ]);
  };

  const handleMarkServed = (orderId: string) => {
    setReadyOrders((current) => current.filter((ord) => ord.id !== orderId));
  };

  const handleUpdatePrepTime = (orderId: string, value: number) => {
    setPrepTimeSettings((current) =>
      current.map((sett) => (sett.id === orderId ? { ...sett, minutes: value } : sett))
    );
    alert(`Updated preparation time for ${orderId} to ${value} minutes.`);
  };

  const handleRequestStock = (item: string) => {
    setStockList((current) =>
      current.map((st) => (st.name === item ? { ...st, status: 'Pending Request' } : st))
    );
    alert(`Stock request raised for ${item}!`);
  };

  return (
    <div className="space-y-6 text-slate-900 bg-[#F6F8FD] p-1">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            Welcome Chef! 🧑‍🍳
          </h1>
          <p className="text-sm text-slate-505 mt-1.5 font-bold">Manage orders, update preparation and track kitchen operations.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundOn(!soundOn)}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 cursor-pointer transition text-sm font-black text-slate-700 shadow-sm"
          >
            {soundOn ? <Volume2 size={16} className="text-emerald-500" /> : <VolumeX size={16} className="text-slate-400" />}
            <span>Sound {soundOn ? 'On' : 'Off'}</span>
          </button>

          <button
            onClick={() => setScreenFull(!screenFull)}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 cursor-pointer transition text-sm font-black text-slate-700 shadow-sm"
          >
            <Tv size={16} className="text-slate-500" />
            <span>Screen Mode</span>
          </button>
        </div>
      </div>

      {/* METRICS ROW (5 CARDS) */}
      <section className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-550 flex items-center justify-center flex-shrink-0">
            <ChefHat size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-505 font-black uppercase tracking-wider">New Orders</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">8</h3>
            <span className="text-xs text-orange-600 font-black mt-1.5 block">Requires Attention</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-505 font-black uppercase tracking-wider">Preparing</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">15</h3>
            <span className="text-xs text-blue-605 font-black mt-1.5 block">In Progress</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-650 flex items-center justify-center flex-shrink-0">
            <Check size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-505 font-black uppercase tracking-wider">Ready to Serve</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">11</h3>
            <span className="text-xs text-emerald-605 font-black mt-1.5 block">Ready for Waiter</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-650 flex items-center justify-center flex-shrink-0">
            <CheckSquare size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-505 font-black uppercase tracking-wider">Completed</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">32</h3>
            <span className="text-xs text-slate-400 font-extrabold mt-1.5 block">Today Completed</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-650 flex items-center justify-center flex-shrink-0 font-black text-xl">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-505 font-black uppercase tracking-wider">Avg. Prep Time</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">18 Min</h3>
            <span className="text-xs text-slate-400 font-extrabold mt-1.5 block">Today Average</span>
          </div>
        </div>
      </section>

      {/* THREE COLUMN GRID */}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1.3fr_1.1fr]">
        
        {/* COLUMN 1: NEW ORDERS & PREP TIME MANAGEMENT */}
        <div className="space-y-6">
          
          {/* NEW ORDERS */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">
                New Orders <span className="bg-rose-500 text-white rounded-full px-2 py-0.5 text-[10px] ml-1">{newOrders.length}</span>
              </h2>
              <button className="text-sm font-black text-[#5850ec] hover:underline">View All</button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {newOrders.length === 0 ? (
                <p className="text-xs font-bold text-slate-400 text-center py-8">No new orders waiting.</p>
              ) : (
                newOrders.map((ord) => (
                  <div key={ord.id} className="flex justify-between items-center p-3 rounded-2xl border border-slate-50 hover:bg-slate-50 transition text-xs font-black">
                    <div>
                      <p className="text-slate-900 text-sm font-black">{ord.id}</p>
                      <p className="text-slate-505 font-bold mt-0.5">{ord.table} • {ord.items}</p>
                    </div>
                    <span className="text-slate-400 font-bold">{ord.time}</span>
                    <button
                      onClick={() => handleStartPreparing(ord.id)}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-650 text-white rounded-xl transition font-black active:scale-95 shadow-sm"
                    >
                      Start Preparing
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* PREPARATION TIME MANAGEMENT */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">Preparation Time Management</h2>
              <button className="text-sm font-black text-[#5850ec] hover:underline">View All</button>
            </div>

            <div className="space-y-3">
              {prepTimeSettings.map((sett) => (
                <div key={sett.id} className="flex justify-between items-center text-xs font-black">
                  <div className="w-16">
                    <p className="text-slate-900 text-sm font-black">{sett.id}</p>
                    <p className="text-slate-400 text-[10px] mt-0.5">{sett.table}</p>
                  </div>
                  <span className="text-slate-605 font-bold">{sett.items}</span>
                  <div className="flex items-center gap-2">
                    <select
                      value={sett.minutes}
                      onChange={(e) => handleUpdatePrepTime(sett.id, Number(e.target.value))}
                      className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-xs font-black text-slate-700 outline-none"
                    >
                      <option value={10}>10 Min</option>
                      <option value={15}>15 Min</option>
                      <option value={20}>20 Min</option>
                      <option value={25}>25 Min</option>
                      <option value={30}>30 Min</option>
                    </select>
                    <button
                      onClick={() => alert(`Saved preparation time for ${sett.id}`)}
                      className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-505 rounded-xl border border-orange-200 transition font-black"
                    >
                      Update
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* COLUMN 2: PREPARING ORDERS, READY TO SERVE, STOCK OVERVIEW */}
        <div className="space-y-6">
          
          {/* PREPARING ORDERS */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">
                Preparing Orders <span className="bg-orange-500 text-white rounded-full px-2 py-0.5 text-[10px] ml-1">{preparingOrders.length}</span>
              </h2>
              <button className="text-sm font-black text-[#5850ec] hover:underline">View All</button>
            </div>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {preparingOrders.map((ord) => (
                <div key={ord.id} className="flex justify-between items-center p-3.5 rounded-2xl border border-slate-50 hover:bg-slate-50 transition text-xs font-black">
                  <div>
                    <p className="text-slate-900 text-sm font-black">{ord.id}</p>
                    <p className="text-slate-505 font-bold mt-0.5">{ord.table} • {ord.items}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-bold bg-slate-50 border border-slate-150 px-2.5 py-1.5 rounded-xl flex items-center gap-1">
                      <Clock size={12} /> {ord.elapsed}
                    </span>
                    <button
                      onClick={() => handleMarkReady(ord.id)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition font-black active:scale-95 shadow-sm"
                    >
                      Mark Ready
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* READY TO SERVE */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">
                Ready to Serve <span className="bg-emerald-505 text-white rounded-full px-2 py-0.5 text-[10px] ml-1">{readyOrders.length}</span>
              </h2>
              <button className="text-sm font-black text-[#5850ec] hover:underline">View All</button>
            </div>

            <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
              {readyOrders.map((ord) => (
                <div key={ord.id} className="flex justify-between items-center p-3 rounded-2xl border border-slate-50 hover:bg-slate-50 transition text-xs font-black">
                  <div>
                    <p className="text-slate-900 text-sm font-black">{ord.id}</p>
                    <p className="text-slate-505 font-bold mt-0.5">{ord.table} • {ord.items}</p>
                  </div>
                  <span className="text-slate-505 font-bold">{ord.time}</span>
                  <button
                    onClick={() => handleMarkServed(ord.id)}
                    className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-[#5850ec] rounded-xl border border-indigo-200 transition font-black active:scale-95"
                  >
                    Mark Served
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* STOCK OVERVIEW */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">Stock Overview</h2>
              <button className="text-sm font-black text-[#5850ec] hover:underline">View All</button>
            </div>

            <div className="space-y-3">
              {stockList.map((st) => (
                <div key={st.id} className="flex justify-between items-center text-xs font-black">
                  <span className="text-slate-900 text-sm">{st.name}</span>
                  <span className="text-slate-505 font-bold">{st.qty}</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider ${st.color}`}>
                      {st.status}
                    </span>
                    {(st.status === 'Critical' || st.status === 'Low Stock') && (
                      <button
                        onClick={() => handleRequestStock(st.name)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-xl border border-rose-200 transition font-black active:scale-95"
                      >
                        Request Stock
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* COLUMN 3: ORDER PROGRESS (LIVE), KITCHEN ANNOUNCEMENTS, QUICK ACTIONS */}
        <div className="space-y-6">
          
          {/* ORDER PROGRESS (LIVE) */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">Order Progress (Live)</h2>
              <button className="text-sm font-black text-[#5850ec] hover:underline">View All</button>
            </div>

            <div className="space-y-4 max-h-[200px] overflow-y-auto pr-1">
              {preparingOrders.map((ord) => (
                <div key={ord.id} className="space-y-2 text-xs font-black">
                  <div className="flex justify-between">
                    <span className="text-slate-905 font-black">{ord.id} • {ord.table}</span>
                    <span className="text-slate-400 font-bold">{ord.elapsed}</span>
                  </div>
                  <div className="flex items-center gap-3.5">
                    <div className="flex-1 bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100">
                      <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${ord.progress}%` }} />
                    </div>
                    <span className="text-[10px] text-slate-505 font-black uppercase tracking-wider">{ord.progress}% {ord.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KITCHEN ANNOUNCEMENTS */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">Kitchen Announcements</h2>
              <button className="text-sm font-black text-[#5850ec] hover:underline">View All</button>
            </div>

            <div className="space-y-3">
              {announcements.map((a) => (
                <div key={a.id} className="flex gap-2 text-xs font-black border-b border-slate-50 pb-2.5 last:border-none last:pb-0">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider flex-shrink-0 mt-0.5 h-fit ${
                    a.type === 'NEW' ? 'bg-blue-50 text-blue-600' :
                    a.type === 'ALERT' ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-505'
                  }`}>
                    {a.type}
                  </span>
                  <div className="flex-1">
                    <p className="text-slate-805 leading-normal">{a.text}</p>
                    <span className="text-[9px] text-slate-400 font-bold block mt-1">{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
            <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3 text-xs font-black">
              {[
                { label: 'Update Prep Time', icon: Clock, color: 'bg-violet-50 text-[#8b5cf6]' },
                { label: 'Mark Order Ready', icon: CheckSquare, color: 'bg-emerald-50 text-emerald-650' },
                { label: 'Request Stock', icon: Package, color: 'bg-orange-50 text-orange-550' },
                { label: 'Add Stock Received', icon: PlusCircle, color: 'bg-blue-50 text-blue-600' },
                { label: 'Kitchen Display', icon: Tv, color: 'bg-cyan-50 text-cyan-600' },
                { label: 'View Recipes', icon: BookOpen, color: 'bg-rose-50 text-rose-550' },
              ].map((act, i) => {
                const Icon = act.icon;
                return (
                  <button
                    key={i}
                    onClick={() => alert(`Quick Action: ${act.label}`)}
                    className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition active:scale-95 text-left"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${act.color}`}>
                      <Icon size={16} />
                    </div>
                    <span className="text-[10px] font-black text-slate-800 leading-none">{act.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* BOTTOM METRICS ROW */}
      <section className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
        <div>
          <p className="text-[10px] text-slate-505 font-black uppercase tracking-wider">Total Orders Today</p>
          <p className="text-2xl font-black text-slate-900 mt-1">56</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-505 font-black uppercase tracking-wider">In Progress</p>
          <p className="text-2xl font-black text-orange-505 mt-1">15</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-555 font-black uppercase tracking-wider">Ready to Serve</p>
          <p className="text-2xl font-black text-cyan-600 mt-1">11</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-555 font-black uppercase tracking-wider">Completed</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">32</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-555 font-black uppercase tracking-wider">Cancelled</p>
          <p className="text-2xl font-black text-rose-500 mt-1">2</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-555 font-black uppercase tracking-wider">Avg. Prep Time</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">18 Min</p>
        </div>
      </section>

    </div>
  );
}
