import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

const getApiBaseUrl = () => {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:3001'
  );
};

export const getSocket = (tenantId?: string) => {
  const token = typeof window !== 'undefined'
    ? window.localStorage.getItem('token')
    : null;

  if (socket) {
    if (token) {
      socket.auth = { token };
    }
    if (tenantId) {
      socket.io.opts.query = { tenantId };
    }
    if (socket.disconnected) {
      socket.connect();
    }
    return socket;
  }

  socket = io(getApiBaseUrl(), {
    auth: token ? { token } : undefined,
    query: tenantId ? { tenantId } : undefined,
    autoConnect: true,
    transports: ['websocket'],
  });

  return socket;
};

// Backward-compatible default export (only initialize on client to avoid build hangs)
const defaultSocket = typeof window !== 'undefined' ? getSocket() : null;
export default defaultSocket;

