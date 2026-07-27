'use client';

import { useEffect } from 'react';
import type { Socket } from 'socket.io-client';

import { getSocket } from '@/services/socket';

export const useRealtime = (
  handlers: Record<string, (...args: unknown[]) => void>,
) => {
  useEffect(() => {
    const socket: Socket = getSocket();
    const entries = Object.entries(handlers);

    entries.forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      entries.forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [handlers]);
};

