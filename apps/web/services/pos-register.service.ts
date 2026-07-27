import api from './api';
import { unwrap } from './helpers';

export interface PosSession {
  id: string;
  tenantId: string;
  cashierId: string;
  openingTime: string;
  closingTime?: string | null;
  openingBalance: string | number;
  closingBalance?: string | number | null;
  expectedBalance?: string | number | null;
  status: 'OPEN' | 'CLOSED';
  notes?: string | null;
  payments?: any[];
  cashLogs?: any[];
  cashier?: {
    id: string;
    name: string;
    email: string;
  };
}

export const getActiveRegisterSession = async (): Promise<PosSession | null> => {
  return unwrap<PosSession | null>(api.get('/pos-register/session/active'));
};

export const openRegisterSession = async (openingBalance: number): Promise<PosSession> => {
  return unwrap<PosSession>(api.post('/pos-register/session/open', { openingBalance }));
};

export const closeRegisterSession = async (data: {
  closingBalance: number;
  notes?: string;
}): Promise<PosSession> => {
  return unwrap<PosSession>(api.post('/pos-register/session/close', data));
};

export const addRegisterCashLog = async (data: {
  amount: number;
  type: 'CASH_IN' | 'CASH_OUT';
  reason: string;
}): Promise<any> => {
  return unwrap<any>(api.post('/pos-register/session/cash-log', data));
};

export const getRegisterSessionHistory = async (): Promise<PosSession[]> => {
  return unwrap<PosSession[]>(api.get('/pos-register/sessions'));
};

