import type { PlanTier, Tenant, UserRole } from '@prisma/client';

export type WorkspaceBusinessSummary = {
  id: string;
  name: string;
  slug: string;
  industry: string;
  status: string;
  currency: string;
  timezone: string;
  language: string;
};

export type WorkspaceOwnerSummary = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
};

export type WorkspaceBranchSummary = {
  id: string;
  name: string;
  code: string | null;
  isActive: boolean;
};

export type WorkspaceSubscriptionSummary = {
  id: string;
  planName: PlanTier;
  status: string;
  billingEmail: string | null;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
};

export type WorkspaceProvisionResponse = {
  access_token: string;
  workspace: Tenant;
  business: WorkspaceBusinessSummary;
  owner: WorkspaceOwnerSummary;
  branch: WorkspaceBranchSummary;
  subscription: WorkspaceSubscriptionSummary;
  modules: string[];
  roles: string[];
};

export type BusinessNameAvailabilityResponse = {
  name: string;
  slug: string;
  available: boolean;
  reason?: string;
};
