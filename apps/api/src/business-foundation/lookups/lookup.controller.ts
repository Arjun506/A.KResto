import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LookupService } from './lookup.service';
import { PublicTenant } from '../../tenant/public-tenant.decorator';

@ApiTags('Business Foundation — Reference Lookups')
@PublicTenant()
@Controller('lookups')
export class LookupController {
  constructor(private readonly service: LookupService) {}

  @Get('categories')
  @ApiOperation({
    summary: 'Get reference list of supported business categories',
  })
  getCategories() {
    return this.service.getBusinessCategories();
  }

  @Get('currencies')
  @ApiOperation({ summary: 'Get ISO standard currency codes' })
  getCurrencies() {
    return this.service.getCurrencies();
  }

  @Get('timezones')
  @ApiOperation({ summary: 'Get standard global timezone identifiers' })
  getTimezones() {
    return this.service.getTimezones();
  }

  @Get('languages')
  @ApiOperation({ summary: 'Get supported language locales' })
  getLanguages() {
    return this.service.getLanguages();
  }

  @Get('countries')
  @ApiOperation({ summary: 'Get ISO country reference list' })
  getCountries() {
    return this.service.getCountries();
  }
}
