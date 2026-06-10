import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type TenantRequest = {
  tenantId?: string;
};

export const TenantId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<TenantRequest>();
    return req.tenantId;
  },
);
