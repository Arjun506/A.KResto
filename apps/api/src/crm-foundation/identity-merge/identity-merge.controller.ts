import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerIdentityMergeService } from './identity-merge.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('CRM Foundation — Identity Merge')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('crm-identity-merge')
export class CustomerIdentityMergeController {
  constructor(private readonly service: CustomerIdentityMergeService) {}

  @Get('duplicates')
  @ApiOperation({
    summary: 'Scan customer tables and detect potential duplicate profiles',
  })
  async detectDuplicates(
    @Query('fullName') fullName: string,
    @Query('email') email?: string,
  ) {
    return this.service.detectDuplicates(fullName, email);
  }

  @Post('merge')
  @ApiOperation({
    summary: 'Merge source duplicate profile into primary target profile',
  })
  async mergeCustomers(
    @Body()
    body: {
      tenantId?: string;
      sourceCustomerId: string;
      targetCustomerId: string;
    },
  ) {
    return this.service.mergeCustomers(
      body.tenantId || 'GLOBAL',
      body.sourceCustomerId,
      body.targetCustomerId,
    );
  }
}
