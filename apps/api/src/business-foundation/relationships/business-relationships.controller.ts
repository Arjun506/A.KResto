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
import { BusinessRelationshipsService } from './business-relationships.service';
import { CreateRelationshipDto } from './dto/create-relationship.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Business Foundation — Relationships')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('businesses/:businessId/relationships')
export class BusinessRelationshipsController {
  constructor(private readonly service: BusinessRelationshipsService) {}

  @Post()
  @ApiOperation({
    summary:
      'Link inter-business relationship (Parent, Child, Franchise, Supplier, Customer)',
  })
  async createRelationship(
    @Param('businessId') businessId: string,
    @Body() dto: CreateRelationshipDto,
  ) {
    return this.service.createRelationship(businessId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active relationships for a business' })
  async getRelationships(@Param('businessId') businessId: string) {
    return this.service.getRelationships(businessId);
  }

  @Delete(':relationshipId')
  @ApiOperation({ summary: 'Soft delete business relationship link' })
  async removeRelationship(@Param('relationshipId') relationshipId: string) {
    return this.service.removeRelationship(relationshipId);
  }
}
