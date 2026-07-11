import { JwtUser } from './jwt-user.type';

export type TenantAwareRequest = {
  user?: JwtUser;
  tenantId?: string;
};
