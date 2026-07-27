import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerConsentService } from './customer-consent.service';
import { UpdateConsentDto } from './update-consent.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Customer Foundation — Consent Platform')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers/:customerId/consents')
export class CustomerConsentController {
  constructor(private readonly service: CustomerConsentService) {}

  @Post()
  @ApiOperation({
    summary:
      'Update customer consent (Marketing, Privacy, Data Sharing, Cookie, Terms)',
  })
  async updateConsent(
    @Param('customerId') customerId: string,
    @Body() dto: UpdateConsentDto,
    @Req() req: any,
  ) {
    return this.service.updateConsent(customerId, dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get immutable customer consent history' })
  async getConsentHistory(@Param('customerId') customerId: string) {
    return this.service.getConsentHistory(customerId);
  }
}
