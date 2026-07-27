export type UserRole = 'OWNER' | 'MANAGER' | 'STAFF' | 'WAITER' | 'KITCHEN';

export type UserSession = {
  sub: string;
  email: string;
  role: UserRole;
  tenantId: string | null;
};


