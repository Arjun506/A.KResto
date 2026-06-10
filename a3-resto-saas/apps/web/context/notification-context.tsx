'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getSocket } from '@/services/socket';

type Toast = {
  id: number;
  title: string;
  body?: string;
};

type NotificationContextValue = {
  notify: (toast: Omit<Toast, 'id'>) => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now();
    setToasts((current) => [...current, { ...toast, id }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 4500);
  }, []);

  useEffect(() => {
    if (!window.localStorage.getItem('token')) return;

    const socket = getSocket();
    const onWaiterNotification = (payload: unknown) => {
      notify({
        title: 'Realtime notification',
        body:
          typeof payload === 'object' && payload
            ? JSON.stringify(payload)
            : String(payload),
      });
    };

    socket.on('waiterNotification', onWaiterNotification);
    socket.on('orderStatusChanged', onWaiterNotification);

    return () => {
      socket.off('waiterNotification', onWaiterNotification);
      socket.off('orderStatusChanged', onWaiterNotification);
    };
  }, [notify]);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="w-80 rounded-2xl border bg-white p-4 shadow-xl"
          >
            <p className="font-bold">{toast.title}</p>
            {toast.body && (
              <p className="mt-1 line-clamp-3 text-sm text-gray-500">
                {toast.body}
              </p>
            )}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const value = useContext(NotificationContext);
  if (!value) throw new Error('NotificationProvider missing');
  return value;
};
