import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BusinessOwnershipService } from './business-ownership.service';
import { AssignOwnershipDto } from './dto/assign-owner.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Business Foundation — Ownership')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('businesses/:businessId/owners')
export class BusinessOwnershipController {
  constructor(private readonly service: BusinessOwnershipService) {}

  @Post()
  @ApiOperation({
    summary: 'Assign owner, manager, operator or partner to business',
  })
  async assignOwnership(
    @Param('businessId') businessId: string,
    @Body() dto: AssignOwnershipDto,
  ) {
    return this.service.assignOwnership(businessId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List current active owners and managers' })
  async getCurrentOwners(@Param('businessId') businessId: string) {
    return this.service.getCurrentOwners(businessId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get historical ownership transfer records' })
  async getOwnershipHistory(@Param('businessId') businessId: string) {
    return this.service.getOwnershipHistory(businessId);
  }

  @Delete(':userId')
  @ApiOperation({
    summary: 'Remove user ownership/management role from business',
  })
  async unassignOwnership(
    @Param('businessId') businessId: string,
    @Param('userId') userId: string,
  ) {
    return this.service.unassignOwnership(businessId, userId);
  }
}
