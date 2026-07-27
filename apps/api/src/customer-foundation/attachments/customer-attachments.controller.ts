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
import { CustomerAttachmentsService } from './customer-attachments.service';
import { CreateCustomerAttachmentDto } from './create-attachment.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Customer Foundation — Attachments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers/:customerId/attachments')
export class CustomerAttachmentsController {
  constructor(private readonly service: CustomerAttachmentsService) {}

  @Post()
  @ApiOperation({
    summary:
      'Register customer attachment (ID Card, Proof of Address, Contract, Avatar)',
  })
  async addAttachment(
    @Param('customerId') customerId: string,
    @Body() dto: CreateCustomerAttachmentDto,
  ) {
    return this.service.addAttachment(customerId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List customer attachments' })
  async getAttachments(@Param('customerId') customerId: string) {
    return this.service.getAttachments(customerId);
  }

  @Delete(':attachmentId')
  @ApiOperation({ summary: 'Soft delete customer attachment' })
  async softDeleteAttachment(@Param('attachmentId') attachmentId: string) {
    return this.service.softDeleteAttachment(attachmentId);
  }
}
