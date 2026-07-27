import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProductLookupService } from './product-lookup.service';
import { PublicTenant } from '../../tenant/public-tenant.decorator';

@ApiTags('Product Foundation — Reference Lookups')
@PublicTenant()
@Controller('product-lookups')
export class ProductLookupController {
  constructor(private readonly service: ProductLookupService) {}

  @Get('identity-types')
  @ApiOperation({ summary: 'Get product identity classification types' })
  getIdentityTypes() {
    return this.service.getIdentityTypes();
  }

  @Get('lifecycle-stages')
  @ApiOperation({ summary: 'Get product lifecycle stage definitions' })
  getLifecycleStages() {
    return this.service.getLifecycleStages();
  }

  @Get('publishing-statuses')
  @ApiOperation({ summary: 'Get publishing workflow states' })
  getPublishingStatuses() {
    return this.service.getPublishingStatuses();
  }

  @Get('relationship-types')
  @ApiOperation({ summary: 'Get inter-product relationship types' })
  getRelationshipTypes() {
    return this.service.getRelationshipTypes();
  }

  @Get('price-types')
  @ApiOperation({ summary: 'Get catalog price type definitions' })
  getPriceTypes() {
    return this.service.getPriceTypes();
  }
}
