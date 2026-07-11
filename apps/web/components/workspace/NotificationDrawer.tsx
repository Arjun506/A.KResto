'use client';

import { useEffect, useState } from 'react';
import { X, Bell, Trash2, ShieldCheck, Mail, MessageSquare, ToggleLeft, ToggleRight, Check } from 'lucide-react';

interface NotificationItem {
  id: number;
  title: string;
  body: string;
  time: string;
  read: boolean;
  category: 'order' | 'alert' | 'system';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    title: 'New order #ORD1265 placed',
    body: 'Table 5 requested Dine-in service (3 items - total ₹820).',
    time: '2 mins ago',
    read: false,
    category: 'order'
  },
  {
    id: 2,
    title: 'Critical Stock Alert: Tomato',
    body: 'Red Tomatoes are running low. Current stock is below 5kg.',
    time: '10 mins ago',
    read: false,
    category: 'alert'
  },
  {
    id: 3,
    title: 'Table 7 requested assistance',
    body: 'Customer requested waiter attendance for order billing details.',
    time: '15 mins ago',
    read: true,
    category: 'order'
  },
  {
    id: 4,
    title: 'System Backup Successful',
    body: 'Weekly restaurant ERP backup completed successfully on AWS S3.',
    time: '1 hour ago',
    read: true,
    category: 'system'
  }
];

export default function NotificationDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'settings'>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [search, setSearch] = useState('');

  // Settings state
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [inAppAlerts, setInAppAlerts] = useState(true);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-notification-drawer', handleOpen);
    return () => window.removeEventListener('open-notification-drawer', handleOpen);
  }, []);

  if (!isOpen) return null;

  const handleDismiss = (id: number) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const filteredList = notifications.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.body.toLowerCase().includes(search.toLowerCase())
  );

  const unreadCount = notifications.filter((x) => !x.read).length;

  return (
    <div className="fixed inset-y-0 right-0 z-[9990] w-full max-w-md bg-white dark:bg-[#11131c] border-l border-slate-200/50 dark:border-slate-800/40 shadow-2xl overflow-hidden flex flex-col glass animate-cc-panel-in select-none">
      
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-850/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 relative">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-white" />
            )}
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 dark:text-slate-100">
              Notification Center
            </h2>
            <p className="text-[10px] text-slate-400 font-bold">Review system alerts & logs</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 transition"
        >
          <X size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex px-4 border-b border-slate-100 dark:border-slate-850/40 text-xs font-bold text-slate-500">
        {[
          { id: 'all', label: `Notifications (${notifications.length})` },
          { id: 'settings', label: 'Alert Preferences' }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition capitalize cursor-pointer ${
                isActive
                  ? 'border-indigo-500 text-indigo-650 dark:text-indigo-400 font-extrabold'
                  : 'border-transparent hover:text-slate-700'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-5" style={{ scrollbarWidth: 'thin' }}>
        
        {activeTab === 'all' && (
          <div className="space-y-4">
            
            {/* Search and Quick Actions bar */}
            {notifications.length > 0 && (
              <div className="flex items-center justify-between gap-3 text-[10px] font-black uppercase text-indigo-600">
                <button
                  onClick={handleMarkAllRead}
                  className="hover:text-indigo-850 transition cursor-pointer flex items-center gap-0.5"
                >
                  <Check size={12} /> Mark all read
                </button>
                <button
                  onClick={handleClearAll}
                  className="hover:text-rose-600 transition cursor-pointer flex items-center gap-0.5 text-rose-500"
                >
                  <Trash2 size={12} /> Clear all
                </button>
              </div>
            )}

            {/* Notification items list */}
            <div className="space-y-2.5">
              {filteredList.length === 0 ? (
                <div className="py-12 text-center">
                  <Bell className="w-8 h-8 text-slate-200 dark:text-slate-750 mx-auto mb-2 animate-bounce" />
                  <p className="text-xs font-bold text-slate-400">
                    No active notifications or alerts
                  </p>
                </div>
              ) : (
                filteredList.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 border rounded-2xl flex gap-3 text-left transition ${
                      item.read
                        ? 'bg-slate-50/20 dark:bg-slate-800/5 border-slate-100 dark:border-slate-850/20'
                        : 'bg-indigo-50/15 dark:bg-indigo-950/10 border-indigo-100/35 dark:border-indigo-900/20 relative'
                    }`}
                  >
                    {!item.read && (
                      <span className="absolute top-4 left-2.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                    )}
                    
                    <div className="flex-1 space-y-1 pl-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                          {item.title}
                        </h4>
                        <span className="text-[9px] font-bold text-slate-400 shrink-0">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        {item.body}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDismiss(item.id)}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-650 self-start transition"
                      title="Dismiss Alert"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4 text-left">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-350">
              Notification Channel Subscriptions
            </h3>
            
            <div className="border border-slate-200/50 dark:border-slate-800/40 rounded-2xl overflow-hidden divide-y divide-slate-150 dark:divide-slate-850/40">
              
              {/* Email Alerts */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-850/40 text-slate-450 border border-slate-200/20">
                    <Mail size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">Email Notifications</h4>
                    <p className="text-[10px] text-slate-450 mt-0.5">Send daily summary reports & audit logs</p>
                  </div>
                </div>
                <button onClick={() => setEmailAlerts(!emailAlerts)} className="text-indigo-500 cursor-pointer">
                  {emailAlerts ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-slate-300" />}
                </button>
              </div>

              {/* SMS Alerts */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-850/40 text-slate-450 border border-slate-200/20">
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">SMS / WhatsApp Alerts</h4>
                    <p className="text-[10px] text-slate-450 mt-0.5">Send instant transactional order updates</p>
                  </div>
                </div>
                <button onClick={() => setSmsAlerts(!smsAlerts)} className="text-indigo-500 cursor-pointer">
                  {smsAlerts ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-slate-300" />}
                </button>
              </div>

              {/* In-app Alerts */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-850/40 text-slate-450 border border-slate-200/20">
                    <Bell size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">In-App Live Stream</h4>
                    <p className="text-[10px] text-slate-450 mt-0.5">Show real-time toast alert banners</p>
                  </div>
                </div>
                <button onClick={() => setInAppAlerts(!inAppAlerts)} className="text-indigo-500 cursor-pointer">
                  {inAppAlerts ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-slate-300" />}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="px-5 py-3.5 bg-slate-50 dark:bg-[#151722]/50 border-t border-slate-100 dark:border-slate-850/20 flex items-center justify-between text-[10px] font-bold text-slate-400">
        <span className="flex items-center gap-1">
          <ShieldCheck size={13} className="text-emerald-500" /> Secure channel connection
        </span>
        <span>AK Business OS</span>
      </div>

    </div>
  );
}
