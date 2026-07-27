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
import { CustomerContactsService } from './customer-contacts.service';
import { CreateCustomerContactDto } from './create-contact.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Customer Foundation — Contacts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers/:customerId/contacts')
export class CustomerContactsController {
  constructor(private readonly service: CustomerContactsService) {}

  @Post()
  @ApiOperation({
    summary: 'Add customer contact entry (Emails, Phones, Alternate)',
  })
  async addContact(
    @Param('customerId') customerId: string,
    @Body() dto: CreateCustomerContactDto,
  ) {
    return this.service.addContact(customerId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List contacts for a customer' })
  async getContacts(@Param('customerId') customerId: string) {
    return this.service.getContacts(customerId);
  }

  @Delete(':contactId')
  @ApiOperation({ summary: 'Soft delete customer contact' })
  async softDeleteContact(@Param('contactId') contactId: string) {
    return this.service.softDeleteContact(contactId);
  }
}
