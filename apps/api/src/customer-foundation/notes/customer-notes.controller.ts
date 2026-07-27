import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerNotesService } from './customer-notes.service';
import { CreateCustomerNoteDto } from './create-note.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Customer Foundation — Notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers/:customerId/notes')
export class CustomerNotesController {
  constructor(private readonly service: CustomerNotesService) {}

  @Post()
  @ApiOperation({ summary: 'Create private, shared, or pinned customer note' })
  async addNote(
    @Param('customerId') customerId: string,
    @Body() dto: CreateCustomerNoteDto,
    @Req() req: any,
  ) {
    return this.service.addNote(customerId, req.user?.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get customer notes' })
  async getNotes(@Param('customerId') customerId: string, @Req() req: any) {
    return this.service.getNotes(customerId, req.user?.id);
  }

  @Delete(':noteId')
  @ApiOperation({ summary: 'Soft delete customer note' })
  async softDeleteNote(@Param('noteId') noteId: string) {
    return this.service.softDeleteNote(noteId);
  }
}
