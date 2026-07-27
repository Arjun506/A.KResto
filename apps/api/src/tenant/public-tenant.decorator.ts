import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_TENANT_KEY = 'isPublicTenant';
export const PublicTenant = () => SetMetadata(IS_PUBLIC_TENANT_KEY, true);
