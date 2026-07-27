import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CustomerLookupService } from './customer-lookup.service';
import { PublicTenant } from '../../tenant/public-tenant.decorator';

@ApiTags('Customer Foundation — Reference Lookups')
@PublicTenant()
@Controller('customer-lookups')
export class CustomerLookupController {
  constructor(private readonly service: CustomerLookupService) {}

  @Get('identity-types')
  @ApiOperation({
    summary: 'Get supported customer identity classification types',
  })
  getIdentityTypes() {
    return this.service.getIdentityTypes();
  }

  @Get('lifecycle-stages')
  @ApiOperation({ summary: 'Get customer lifecycle stage definitions' })
  getLifecycleStages() {
    return this.service.getLifecycleStages();
  }

  @Get('consent-types')
  @ApiOperation({
    summary: 'Get supported consent types (Marketing, Privacy, Terms)',
  })
  getConsentTypes() {
    return this.service.getConsentTypes();
  }

  @Get('contact-types')
  @ApiOperation({ summary: 'Get customer contact type definitions' })
  getContactTypes() {
    return this.service.getContactTypes();
  }

  @Get('address-types')
  @ApiOperation({ summary: 'Get customer address type definitions' })
  getAddressTypes() {
    return this.service.getAddressTypes();
  }
}
