// Core Types for Business OS v3.0

export type TenantStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED' | 'ARCHIVED';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  location?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  timezone: string;
  currency: string;
  isActive: boolean;
  industry: string;
  settings?: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'OWNER' 
  | 'MANAGER' 
  | 'SUPERVISOR' 
  | 'OPERATOR' 
  | 'CASHIER' 
  | 'RECEPTIONIST' 
  | 'CUSTOMER' 
  | 'VENDOR' 
  | 'SUPPLIER' 
  | 'PARTNER' 
  | 'AUDITOR' 
  | 'SUPPORT' 
  | 'DEVELOPER';

export interface User {
  id: string;
  tenantId?: string | null;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSession {
  sessionId: string;
  userId: string;
  tenantId: string;
  roles: UserRole[];
  expiresAt: Date;
}

export interface AuditRecord {
  id: string;
  tenantId: string;
  userId?: string | null;
  entity: string;
  entityId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'AUTHENTICATE' | 'REFUND' | 'EXPORT';
  changes: string[];
  oldValues?: Record<string, any> | null;
  newValues?: Record<string, any> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface ApiFailure {
  success: false;
  message: string;
  statusCode?: number;
  details?: any;
}

export interface SidebarItem {
  id: string;
  label: string;
  route: string;
  icon: string;
  requiredRole?: UserRole[];
}

export interface StateTransitionRequest {
  entityId: string;
  entityType: string;
  currentState: string;
  targetState: string;
  userId: string;
  payload?: Record<string, any>;
}
