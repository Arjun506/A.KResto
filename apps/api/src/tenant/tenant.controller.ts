import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Tenant Platform')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tenants')
export class TenantController {
  constructor(private readonly service: TenantService) {}

  @Post()
  @ApiOperation({ summary: 'Provision new multi-tenant instance' })
  async createTenant(@Body() dto: CreateTenantDto) {
    return this.service.createTenant(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all tenants' })
  async listTenants(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.service.listTenants(Number(page), Number(limit));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tenant details by ID' })
  async getTenantById(@Param('id') id: string) {
    return this.service.getTenantById(id);
  }

  @Post(':id/features')
  @ApiOperation({ summary: 'Enable or disable tenant feature flag' })
  async setFeatureFlag(
    @Param('id') id: string,
    @Body('featureKey') featureKey: string,
    @Body('isEnabled') isEnabled: boolean,
    @Body('config') config?: any,
  ) {
    return this.service.setFeatureFlag(id, featureKey, isEnabled, config);
  }
}
