import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_TENANT_KEY } from './public-tenant.decorator';

type TenantRequest = {
  user?: {
    role?: string;
    tenantId?: string;
  };
  headers?: Record<string, string>;
  tenantId?: string;
};

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublicTenant = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_TENANT_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublicTenant) {
      return true;
    }

    const req = context.switchToHttp().getRequest<TenantRequest>();
    const tenantId = req.user?.tenantId || req.headers?.['x-tenant-id'];

    if (req.user?.role === 'SUPER_ADMIN') {
      if (tenantId) req.tenantId = tenantId;
      return true;
    }

    if (!tenantId) {
      throw new UnauthorizedException(
        'Missing tenant context (x-tenant-id header or authenticated tenant context)',
      );
    }

    req.tenantId = tenantId;
    return true;
  }
}
