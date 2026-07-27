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
import { OrganizationService } from './organization.service';
import {
  CreateOrganizationDto,
  CreateBusinessDto,
  CreateLocationDto,
} from './dto/create-organization.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Organization')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('organizations')
export class OrganizationController {
  constructor(private readonly service: OrganizationService) {}

  @Post()
  @ApiOperation({ summary: 'Create new enterprise organization' })
  async createOrganization(@Body() dto: CreateOrganizationDto) {
    return this.service.createOrganization(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List organizations for a tenant' })
  async listOrganizations(@Query('tenantId') tenantId: string) {
    return this.service.listOrganizations(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization hierarchy by ID' })
  async getOrganizationById(@Param('id') id: string) {
    return this.service.getOrganizationById(id);
  }

  @Post('businesses')
  @ApiOperation({ summary: 'Add business unit under organization' })
  async createBusiness(@Body() dto: CreateBusinessDto) {
    return this.service.createBusiness(dto);
  }

  @Post('locations')
  @ApiOperation({ summary: 'Add physical/logical location under division' })
  async createLocation(@Body() dto: CreateLocationDto) {
    return this.service.createLocation(dto);
  }
}
