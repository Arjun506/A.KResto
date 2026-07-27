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
import { CustomerRelationshipsService } from './customer-relationships.service';
import { CreateCustomerRelationshipDto } from './create-relationship.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Customer Foundation — Relationships')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers/:customerId/relationships')
export class CustomerRelationshipsController {
  constructor(private readonly service: CustomerRelationshipsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create inter-customer, business, or organization relationship',
  })
  async createRelationship(
    @Param('customerId') customerId: string,
    @Body() dto: CreateCustomerRelationshipDto,
  ) {
    return this.service.createRelationship(customerId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get active relationships for a customer' })
  async getRelationships(@Param('customerId') customerId: string) {
    return this.service.getRelationships(customerId);
  }

  @Delete(':relationshipId')
  @ApiOperation({ summary: 'Soft delete relationship link' })
  async removeRelationship(@Param('relationshipId') relationshipId: string) {
    return this.service.removeRelationship(relationshipId);
  }
}
