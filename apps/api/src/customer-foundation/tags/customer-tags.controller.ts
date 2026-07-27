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
import { CustomerTagsService } from './customer-tags.service';
import { CreateCustomerTagDto, AssignCustomerTagDto } from './create-tag.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Customer Foundation — Tags')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customer-tags')
export class CustomerTagsController {
  constructor(private readonly service: CustomerTagsService) {}

  @Post()
  @ApiOperation({ summary: 'Create dynamic customer tag' })
  async createTag(
    @Body() dto: CreateCustomerTagDto,
    @Query('tenantId') tenantId?: string,
  ) {
    return this.service.createTag(tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List customer tags' })
  async listTags(@Query('tenantId') tenantId?: string) {
    return this.service.listTags(tenantId);
  }

  @Post(':customerId/assign')
  @ApiOperation({ summary: 'Assign tag to customer' })
  async assignTag(
    @Param('customerId') customerId: string,
    @Body() dto: AssignCustomerTagDto,
  ) {
    return this.service.assignTag(customerId, dto);
  }

  @Delete(':customerId/unassign/:tagId')
  @ApiOperation({ summary: 'Remove tag from customer' })
  async unassignTag(
    @Param('customerId') customerId: string,
    @Param('tagId') tagId: string,
  ) {
    return this.service.unassignTag(customerId, tagId);
  }
}
