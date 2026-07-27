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
import { BusinessContactsService } from './business-contacts.service';
import { CreateContactDto } from './create-contact.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Business Foundation — Contacts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('businesses/:businessId/contacts')
export class BusinessContactsController {
  constructor(private readonly service: BusinessContactsService) {}

  @Post()
  @ApiOperation({
    summary:
      'Add contact person (Primary, Billing, Emergency, Technical, Additional)',
  })
  async addContact(
    @Param('businessId') businessId: string,
    @Body() dto: CreateContactDto,
  ) {
    return this.service.addContact(businessId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List contacts for a business' })
  async getContacts(@Param('businessId') businessId: string) {
    return this.service.getContacts(businessId);
  }

  @Delete(':contactId')
  @ApiOperation({ summary: 'Soft delete business contact' })
  async softDeleteContact(@Param('contactId') contactId: string) {
    return this.service.softDeleteContact(contactId);
  }
}
