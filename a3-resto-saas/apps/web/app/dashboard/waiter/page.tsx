'use client';

import { useEffect, useMemo, useState } from 'react';
import { getOrders, updateOrderStatus } from '@/services/order.service';
import { getSocket } from '@/services/socket';
import type { Order } from '@/src/types/order.types';
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
  X
} from 'lucide-react';

type WaiterAlert = {
  id: string;
  type: string;
  requestType: string;
  tableId: string;
  tableName: string;
  createdAt: string;
};

type TableState = {
  id: string;
  name: string;
  status: 'Occupied' | 'Available' | 'Reserved' | 'Cleaning';
  customerName?: string;
  activeBill?: number;
};

export default function WaiterPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedTableFilter, setSelectedTableFilter] = useState<string>('all');
  
  // Mobile Tab selector: 'tables' | 'serve' | 'alerts'
  const [mobileTab, setMobileTab] = useState<'tables' | 'serve' | 'alerts'>('tables');

  // Waiter specific metrics
  const [tipsCount, setTipsCount] = useState(650);
  const [earningsCount, setEarningsCount] = useState(1850);

  // Table grid mock data
  const [tablesGrid, setTablesGrid] = useState<TableState[]>([
    { id: 't-1', name: 'Table 1', status: 'Occupied', customerName: 'Rohit S.', activeBill: 540 },
    { id: 't-2', name: 'Table 2', status: 'Available' },
    { id: 't-3', name: 'Table 3', status: 'Reserved', customerName: 'Karan J.' },
    { id: 't-4', name: 'Table 4', status: 'Cleaning' },
    { id: 't-5', name: 'Table 5', status: 'Occupied', customerName: 'Simran K.', activeBill: 890 },
    { id: 't-6', name: 'Table 6', status: 'Available' },
  ]);

  const [alerts, setAlerts] = useState<WaiterAlert[]>([
    {
      id: 'alt-1',
      type: 'WAITER_REQUEST',
      requestType: 'Need Water',
      tableId: 't-1',
      tableName: 'Table 1',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'alt-2',
      type: 'WAITER_REQUEST',
      requestType: 'Need Bill',
      tableId: 't-5',
      tableName: 'Table 5',
      createdAt: new Date().toISOString(),
    },
  ]);

  const uniqueTables = useMemo(() => {
    return Array.from(new Set(orders.map((order) => order.tableId))).sort();
  }, [orders]);

  const visibleOrders = useMemo(() => {
    if (selectedTableFilter === 'all') return orders;
    return orders.filter((order) => order.tableId === selectedTableFilter);
  }, [orders, selectedTableFilter]);

  const loadOrders = async () => {
    try {
      setOrders(await getOrders().catch(() => []));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    void loadOrders();

    const socket = getSocket();
    
    const sync = (order: Order) => {
      setOrders((current) => {
        const exists = current.some((item) => item.id === order.id);
        return exists
          ? current.map((item) => (item.id === order.id ? order : item))
          : [order, ...current];
      });
    };

    const remove = (payload: { id: string }) => {
      setOrders((current) => current.filter((order) => order.id !== payload.id));
    };

    const alertHandler = (payload: any) => {
      if (payload && payload.type === 'WAITER_REQUEST') {
        setAlerts((current) => [
          {
            id: `alt-${Date.now()}`,
            type: payload.type,
            requestType: payload.requestType,
            tableId: payload.tableId,
            tableName: payload.tableName || `Table ${payload.tableId.slice(-3)}`,
            createdAt: payload.createdAt || new Date().toISOString(),
          },
          ...current,
        ]);
      }
    };

    socket.on('orderCreated', sync);
    socket.on('waiterOrderSync', sync);
    socket.on('orderDeleted', remove);
    socket.on('waiterNotification', alertHandler);

    return () => {
      socket.off('orderCreated', sync);
      socket.off('waiterOrderSync', sync);
      socket.off('orderDeleted', remove);
      socket.off('waiterNotification', alertHandler);
    };
  }, []);

  const markCompleted = async (order: Order) => {
    try {
      const updated = await updateOrderStatus(order.id, 'COMPLETED');
      setOrders((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (e) {
      // Local fallback for simulation
      setOrders((current) =>
        current.map((item) => (item.id === order.id ? { ...order, status: 'COMPLETED' } : item))
      );
    }
  };

  const clearAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  const updateTableStatus = (tableId: string, status: TableState['status']) => {
    setTablesGrid(
      tablesGrid.map((t) => (t.id === tableId ? { ...t, status } : t))
    );
  };

  // Quick action alerts triggering simulated events
  const sendSimulatedRequest = (action: string) => {
    alert(`🛎️ Waiter alert sent to chef/counter: [${action}]`);
  };

  const readyOrders = useMemo(() => orders.filter(o => o.status === 'READY'), [orders]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-24 text-slate-900 bg-[#F6F8FD] p-1 min-h-screen">
      
      {/* HEADER */}
      <div>
        <div className="flex items-center gap-2 text-[#8b5cf6]">
          <Smartphone size={20} />
          <span className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">Service Operations</span>
        </div>
        <h1 className="text-3xl font-black mt-1 text-slate-900">Waiter Operations View</h1>
        <p className="text-xs text-slate-500 font-bold mt-0.5">
          Live table allocation tracking, water/bill request queue, and KDS ready orders.
        </p>
      </div>

      {/* METRICS ROW (5 CARDS) */}
      <section className="grid gap-4 grid-cols-2 md:grid-cols-5">
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-wider">My Tables</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">6 Active</h3>
          <span className="text-[10px] text-slate-400 font-bold">Assigned zones</span>
        </div>
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-wider">Ready to Serve</p>
          <h3 className="text-2xl font-black text-rose-500 mt-1">{readyOrders.length} orders</h3>
          <span className="text-[10px] text-slate-400 font-bold">KDS kitchen ready</span>
        </div>
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-wider">New Requests</p>
          <h3 className="text-2xl font-black text-yellow-600 mt-1">{alerts.length} pending</h3>
          <span className="text-[10px] text-slate-400 font-bold">Water, bill, helper calls</span>
        </div>
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-wider">Shift Tips</p>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">₹{tipsCount}</h3>
          <span className="text-[10px] text-slate-400 font-bold">Collected tips</span>
        </div>
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm col-span-2 md:col-span-1">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-wider">Daily Earnings</p>
          <h3 className="text-2xl font-black text-indigo-600 mt-1">₹{earningsCount}</h3>
          <span className="text-[10px] text-slate-400 font-bold">Calculated from base + tips</span>
        </div>
      </section>

      {/* QUICK ACTIONS BUTTON BAR */}
      <div className="bg-white border border-slate-100 p-4 rounded-[2.2rem] shadow-sm">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3 px-2">Quick Services</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          <button 
            onClick={() => sendSimulatedRequest('Call Chef')}
            className="py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-slate-700 hover:bg-[#BFDEF3]/25 hover:text-blue-900 transition active:scale-95 shadow-sm"
          >
            👨‍🍳 Call Chef
          </button>
          <button 
            onClick={() => sendSimulatedRequest('Call Counter')}
            className="py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-slate-700 hover:bg-[#BFDEF3]/25 hover:text-blue-900 transition active:scale-95 shadow-sm"
          >
            💰 Call Counter
          </button>
          <button 
            onClick={() => sendSimulatedRequest('Request Items')}
            className="py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-slate-700 hover:bg-[#BFDEF3]/25 hover:text-blue-900 transition active:scale-95 shadow-sm"
          >
            🍽️ Request Items
          </button>
          <button 
            onClick={() => sendSimulatedRequest('Request Cleaning')}
            className="py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-slate-700 hover:bg-[#BFDEF3]/25 hover:text-blue-900 transition active:scale-95 shadow-sm"
          >
            🧹 Clean Table
          </button>
          <button 
            onClick={() => sendSimulatedRequest('Request Water')}
            className="py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-slate-700 hover:bg-[#BFDEF3]/25 hover:text-blue-900 transition active:scale-95 shadow-sm"
          >
            💧 Request Water
          </button>
          <button 
            onClick={() => sendSimulatedRequest('Call Supervisor')}
            className="py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-slate-700 hover:bg-[#BFDEF3]/25 hover:text-blue-900 transition active:scale-95 shadow-sm"
          >
            🙋 Manager Call
          </button>
        </div>
      </div>

      {/* MOBILE SCROLL BAR TABS */}
      <div className="flex md:hidden rounded-2xl bg-white p-1 border border-slate-200 shadow-sm">
        <button
          onClick={() => setMobileTab('tables')}
          className={`flex-1 text-center py-2.5 rounded-xl text-xs font-black transition-all ${
            mobileTab === 'tables' ? 'bg-[#BFDEF3] text-blue-900 shadow-sm' : 'text-slate-550'
          }`}
        >
          Assigned Tables
        </button>
        <button
          onClick={() => setMobileTab('serve')}
          className={`flex-1 text-center py-2.5 rounded-xl text-xs font-black transition-all ${
            mobileTab === 'serve' ? 'bg-[#E0B7F4]/20 text-[#8b5cf6] shadow-sm' : 'text-slate-550'
          }`}
        >
          Serve ({readyOrders.length})
        </button>
        <button
          onClick={() => setMobileTab('alerts')}
          className={`flex-1 text-center py-2.5 rounded-xl text-xs font-black transition-all ${
            mobileTab === 'alerts' ? 'bg-[#B9E9E9] text-teal-950 shadow-sm' : 'text-slate-550'
          }`}
        >
          Alerts ({alerts.length})
        </button>
      </div>

      {/* PRIMARY GRID WORKSPACE */}
      <div className="grid gap-6 md:grid-cols-[1fr_360px]">
        
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          
          {/* ASSIGNED TABLES GRID */}
          <div className={`${mobileTab !== 'tables' ? 'hidden md:block' : ''} space-y-4`}>
            <div className="bg-[#BFDEF3]/10 border border-[#BFDEF3]/20 px-5 py-3.5 rounded-2xl flex justify-between items-center shadow-sm">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">My Table Assignments Zone</span>
              <span className="bg-[#BFDEF3] text-blue-900 text-xs font-black px-2.5 py-0.5 rounded-full">{tablesGrid.length} Zones</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tablesGrid.map((table) => (
                <div key={table.id} className="bg-white border border-slate-150 p-5 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between hover:border-slate-350 transition duration-150">
                  <div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <h3 className="text-base font-black text-slate-900">{table.name}</h3>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                        table.status === 'Available' ? 'bg-emerald-100 text-[#0f766e]' :
                        table.status === 'Occupied' ? 'bg-purple-100 text-purple-800' :
                        table.status === 'Reserved' ? 'bg-yellow-100 text-yellow-800' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {table.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 mt-3 text-xs text-slate-550 font-bold">
                      {table.customerName ? (
                        <>
                          <p>Customer: <span className="text-slate-800 font-black">{table.customerName}</span></p>
                          <p>Active Order Bill: <span className="text-rose-500 font-black">₹{table.activeBill}</span></p>
                        </>
                      ) : (
                        <p className="text-slate-400 italic">No guest seated</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-[9px] font-black">
                    <button
                      onClick={() => updateTableStatus(table.id, table.status === 'Available' ? 'Occupied' : 'Available')}
                      className="bg-slate-50 border border-slate-200 hover:bg-slate-100 py-2 rounded-lg text-slate-700 transition"
                    >
                      {table.status === 'Available' ? 'Mark Seated' : 'Release'}
                    </button>
                    <button
                      onClick={() => updateTableStatus(table.id, 'Cleaning')}
                      className="bg-slate-50 border border-slate-200 hover:bg-slate-100 py-2 rounded-lg text-slate-700 transition"
                    >
                      Clean Call
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ACTIVE READY ORDERS TO SERVE */}
          <div className={`${mobileTab !== 'serve' ? 'hidden md:block' : ''} space-y-4`}>
            <div className="bg-[#E0B7F4]/10 border border-[#E0B7F4]/20 px-5 py-3.5 rounded-2xl flex justify-between items-center shadow-sm">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Ready to Serve Tickets</span>
              <span className="bg-[#E0B7F4] text-purple-950 text-xs font-black px-2.5 py-0.5 rounded-full">{readyOrders.length} Orders</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {readyOrders.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs font-bold bg-white rounded-3xl border border-slate-100 shadow-sm col-span-2">
                  No kitchen orders currently ready for serving.
                </div>
              ) : (
                readyOrders.map((order) => (
                  <div key={order.id} className="bg-white border border-slate-150 p-5 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between hover:border-slate-350 transition duration-150">
                    <div>
                      <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                        <div>
                          <h3 className="text-base font-black text-slate-900">Table #{order.tableId.slice(-4).toUpperCase()}</h3>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">{order.orderNumber}</p>
                        </div>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-0.5 rounded-full font-black">
                          {order.status}
                        </span>
                      </div>

                      <div className="mt-4 space-y-1.5">
                        {order.items.map((it) => (
                          <div key={it.id} className="text-xs font-bold text-slate-650 flex justify-between items-center bg-slate-50 px-3 py-2 rounded-xl border border-slate-150">
                            <span>Item #{it.menuItemId.slice(-4).toUpperCase()}</span>
                            <span className="font-black text-slate-900 bg-slate-200/50 px-2 py-0.5 rounded text-[10px]">x{it.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => void markCompleted(order)}
                      className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3 rounded-xl transition active:scale-95 shadow-sm"
                    >
                      Serve Food & Close
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: CUSTOMER SERVICE ALERTS QUEUE */}
        <div className={`${mobileTab !== 'alerts' ? 'hidden md:block' : ''} space-y-4`}>
          <div className="bg-[#B9E9E9]/20 border border-[#B9E9E9]/40 px-5 py-3.5 rounded-2xl flex justify-between items-center shadow-sm">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Alert Log</span>
            <span className="bg-[#B9E9E9] text-teal-950 text-xs font-black px-2.5 py-0.5 rounded-full">{alerts.length} Active</span>
          </div>

          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm space-y-5">
            {alerts.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs font-bold">
                📭 No active table alerts.
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {alerts.map((alert, idx) => (
                  <div key={alert.id} className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl flex items-start justify-between gap-3 shadow-inner">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="text-yellow-600 mt-0.5 flex-shrink-0" size={16} />
                      <div>
                        <p className="font-black text-sm text-slate-900">{alert.tableName}</p>
                        <p className="text-xs text-rose-500 font-extrabold mt-0.5">{alert.requestType}</p>
                        <span className="text-[10px] text-slate-400 font-bold block mt-1">
                          {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => clearAlert(alert.id)}
                      className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 transition active:scale-95 shadow-sm"
                    >
                      <Check size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
