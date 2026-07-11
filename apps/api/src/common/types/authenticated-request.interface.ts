import type { JwtUser } from './jwt-user.interface';

export type AuthenticatedRequest = {
  user?: JwtUser;
  tenantId?: string;
};
