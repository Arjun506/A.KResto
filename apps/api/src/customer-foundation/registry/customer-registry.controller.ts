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
import { CustomerRegistryService } from './customer-registry.service';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { UpdateCustomerStatusDto } from './dto/update-customer-status.dto';
import { UpdateCustomerLifecycleDto } from './dto/update-customer-lifecycle.dto';
import { MergeCustomerDto } from './dto/merge-customer.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Customer Foundation — Registry & Lifecycle')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomerRegistryController {
  constructor(private readonly service: CustomerRegistryService) {}

  @Post()
  @ApiOperation({
    summary:
      'Register a new enterprise customer (Guest, Registered, Business, Org)',
  })
  async registerCustomer(@Body() dto: RegisterCustomerDto, @Req() req: any) {
    return this.service.registerCustomer(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({
    summary: 'List customers with pagination & tenant isolation',
  })
  async listCustomers(
    @Query('tenantId') tenantId?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.service.listCustomers(tenantId, Number(page), Number(limit));
  }

  @Get('duplicates')
  @ApiOperation({
    summary: 'Detect duplicate customer records by email or phone',
  })
  async detectDuplicates(
    @Query('email') email?: string,
    @Query('phone') phone?: string,
    @Query('tenantId') tenantId?: string,
  ) {
    return this.service.detectDuplicates(email, phone, tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get detailed customer record by ID' })
  async getCustomerById(@Param('id') id: string) {
    return this.service.getCustomerById(id);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update customer status (Active, Suspended, Archived)',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerStatusDto,
    @Req() req: any,
  ) {
    return this.service.updateStatus(id, dto.status, req.user?.id);
  }

  @Patch(':id/lifecycle')
  @ApiOperation({
    summary:
      'Update customer lifecycle stage (Prospect, Lead, Active, Inactive)',
  })
  async updateLifecycleStage(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerLifecycleDto,
    @Req() req: any,
  ) {
    return this.service.updateLifecycleStage(
      id,
      dto.lifecycleStage,
      req.user?.id,
    );
  }

  @Post(':id/merge')
  @ApiOperation({ summary: 'Merge source customer into target customer' })
  async mergeCustomers(
    @Param('id') id: string,
    @Body() dto: MergeCustomerDto,
    @Req() req: any,
  ) {
    return this.service.mergeCustomers(
      id,
      dto.targetCustomerId,
      req.user?.id,
      dto.reason,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete customer record' })
  async softDeleteCustomer(@Param('id') id: string, @Req() req: any) {
    return this.service.softDeleteCustomer(id, req.user?.id);
  }
}
