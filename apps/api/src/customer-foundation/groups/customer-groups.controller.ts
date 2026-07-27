import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerGroupsService } from './customer-groups.service';
import {
  CreateCustomerGroupDto,
  AssignCustomerGroupDto,
} from './create-group.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Customer Foundation — Groups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customer-groups')
export class CustomerGroupsController {
  constructor(private readonly service: CustomerGroupsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new customer segment group (VIP, Corporate, Wholesale)',
  })
  async createGroup(
    @Body() dto: CreateCustomerGroupDto,
    @Query('tenantId') tenantId?: string,
  ) {
    return this.service.createGroup(tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List customer segment groups' })
  async listGroups(@Query('tenantId') tenantId?: string) {
    return this.service.listGroups(tenantId);
  }

  @Post(':customerId/assign')
  @ApiOperation({ summary: 'Assign customer to segment group' })
  async assignGroup(
    @Param('customerId') customerId: string,
    @Body() dto: AssignCustomerGroupDto,
  ) {
    return this.service.assignGroup(customerId, dto);
  }

  @Delete(':customerId/unassign/:groupId')
  @ApiOperation({ summary: 'Remove customer from segment group' })
  async unassignGroup(
    @Param('customerId') customerId: string,
    @Param('groupId') groupId: string,
  ) {
    return this.service.unassignGroup(customerId, groupId);
  }
}
