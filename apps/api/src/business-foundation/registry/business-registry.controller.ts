import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BusinessRegistryService } from './business-registry.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessStatusDto } from './dto/update-business-status.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Business Foundation — Registry')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('businesses')
export class BusinessRegistryController {
  constructor(private readonly service: BusinessRegistryService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new enterprise business entity' })
  async registerBusiness(@Body() dto: CreateBusinessDto, @Req() req: any) {
    return this.service.registerBusiness(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({
    summary: 'List businesses with pagination & tenant isolation',
  })
  async listBusinesses(
    @Query('tenantId') tenantId?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.service.listBusinesses(tenantId, Number(page), Number(limit));
  }

  @Get('duplicates')
  @ApiOperation({ summary: 'Detect potential duplicate business records' })
  async detectDuplicates(
    @Query('name') name: string,
    @Query('tenantId') tenantId?: string,
  ) {
    return this.service.detectDuplicates(name, tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get detailed business record by ID' })
  async getBusinessById(@Param('id') id: string) {
    return this.service.getBusinessById(id);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update business status (Verification, Activation, Suspension)',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateBusinessStatusDto,
    @Req() req: any,
  ) {
    return this.service.updateStatus(id, dto.status, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete business entity' })
  async softDeleteBusiness(@Param('id') id: string, @Req() req: any) {
    return this.service.softDeleteBusiness(id, req.user?.id);
  }
}
