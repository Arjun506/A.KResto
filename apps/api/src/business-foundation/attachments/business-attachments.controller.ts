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
import { BusinessAttachmentsService } from './business-attachments.service';
import { CreateAttachmentDto } from './create-attachment.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Business Foundation — Attachments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('businesses/:businessId/attachments')
export class BusinessAttachmentsController {
  constructor(private readonly service: BusinessAttachmentsService) {}

  @Post()
  @ApiOperation({
    summary:
      'Register attachment metadata (Images, Documents, Certificates, Licenses, Contracts)',
  })
  async addAttachment(
    @Param('businessId') businessId: string,
    @Body() dto: CreateAttachmentDto,
  ) {
    return this.service.addAttachment(businessId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List attachments for a business' })
  async getAttachments(@Param('businessId') businessId: string) {
    return this.service.getAttachments(businessId);
  }

  @Delete(':attachmentId')
  @ApiOperation({ summary: 'Soft delete attachment record' })
  async softDeleteAttachment(@Param('attachmentId') attachmentId: string) {
    return this.service.softDeleteAttachment(attachmentId);
  }
}
