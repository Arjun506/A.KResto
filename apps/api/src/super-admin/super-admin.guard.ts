import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context
      .switchToHttp()
      .getRequest<{ user?: { role?: string } }>();
    const role = req.user?.role;

    if (role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Super admin access only');
    }

    return true;
  }
}
