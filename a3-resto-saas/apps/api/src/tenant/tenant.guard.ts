import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

type TenantRequest = {
  user?: {
    role?: string;
    restaurantId?: string;
  };
  tenantId?: string;
};

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<TenantRequest>();

    const restaurantId = req.user?.restaurantId;
    if (req.user?.role === 'SUPER_ADMIN' && !restaurantId) {
      return true;
    }

    if (!restaurantId) {
      throw new UnauthorizedException(
        'Missing tenant context (restaurantId) in JWT',
      );
    }

    req.tenantId = restaurantId;
    return true;
  }
}
