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
import { TenantGuard } from '../../tenant/tenant.guard';
import { apiSuccess } from '../../common/responses/api-response';

@ApiTags('Customer Foundation — Registry & Lifecycle')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('customers')
export class CustomerRegistryController {
  constructor(private readonly service: CustomerRegistryService) {}

  @Post()
  @ApiOperation({
    summary:
      'Register a new enterprise customer (Guest, Registered, Business, Org)',
  })
  async registerCustomer(@Body() dto: RegisterCustomerDto, @Req() req: any) {
    const tenantId = req.user?.tenantId || dto.tenantId;
    const data = await this.service.registerCustomer({ ...dto, tenantId }, req.user?.id);
    return apiSuccess(data);
  }

  @Get()
  @ApiOperation({
    summary: 'List customers with search, pagination & tenant isolation',
  })
  async listCustomers(
    @Req() req: any,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('segment') segment?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const tenantId = req.user?.tenantId;
    const data = await this.service.listCustomers(tenantId, Number(page), Number(limit), search, status, segment);
    return apiSuccess(data);
  }

  @Get('duplicates')
  @ApiOperation({
    summary: 'Detect duplicate customer records by email or phone',
  })
  async detectDuplicates(
    @Req() req: any,
    @Query('email') email?: string,
    @Query('phone') phone?: string,
  ) {
    const tenantId = req.user?.tenantId;
    const data = await this.service.detectDuplicates(email, phone, tenantId);
    return apiSuccess(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get detailed customer record by ID' })
  async getCustomerById(@Param('id') id: string) {
    const data = await this.service.getCustomerById(id);
    return apiSuccess(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update customer details' })
  async updateCustomer(
    @Param('id') id: string,
    @Body() dto: any,
    @Req() req: any,
  ) {
    const data = await this.service.updateCustomer(id, dto, req.user?.id);
    return apiSuccess(data);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update customer status (ACTIVE, SUSPENDED, ARCHIVED, CLOSED)',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerStatusDto,
    @Req() req: any,
  ) {
    const data = await this.service.updateStatus(id, dto.status, req.user?.id);
    return apiSuccess(data);
  }

  @Patch(':id/lifecycle')
  @ApiOperation({
    summary:
      'Update customer lifecycle stage (PROSPECT, LEAD, ACTIVE, INACTIVE)',
  })
  async updateLifecycleStage(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerLifecycleDto,
    @Req() req: any,
  ) {
    const data = await this.service.updateLifecycleStage(
      id,
      dto.lifecycleStage,
      req.user?.id,
    );
    return apiSuccess(data);
  }

  @Post(':id/notes')
  @ApiOperation({ summary: 'Add note to customer profile' })
  async addNote(
    @Param('id') id: string,
    @Body() body: { content: string },
    @Req() req: any,
  ) {
    const data = await this.service.addCustomerNote(id, body.content, req.user?.id);
    return apiSuccess(data);
  }

  @Post(':id/merge')
  @ApiOperation({ summary: 'Merge source customer into target customer' })
  async mergeCustomers(
    @Param('id') id: string,
    @Body() dto: MergeCustomerDto,
    @Req() req: any,
  ) {
    const data = await this.service.mergeCustomers(
      id,
      dto.targetCustomerId,
      req.user?.id,
      dto.reason,
    );
    return apiSuccess(data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete customer record' })
  async softDeleteCustomer(@Param('id') id: string, @Req() req: any) {
    const data = await this.service.softDeleteCustomer(id, req.user?.id);
    return apiSuccess(data);
  }
}
