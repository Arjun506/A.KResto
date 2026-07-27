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
import { BusinessNotesService } from './business-notes.service';
import { CreateNoteDto } from './create-note.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Business Foundation — Notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('businesses/:businessId/notes')
export class BusinessNotesController {
  constructor(private readonly service: BusinessNotesService) {}

  @Post()
  @ApiOperation({ summary: 'Create private, shared, or pinned business note' })
  async addNote(
    @Param('businessId') businessId: string,
    @Body() dto: CreateNoteDto,
    @Req() req: any,
  ) {
    return this.service.addNote(businessId, req.user?.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get business notes timeline' })
  async getNotes(@Param('businessId') businessId: string, @Req() req: any) {
    return this.service.getNotes(businessId, req.user?.id);
  }

  @Delete(':noteId')
  @ApiOperation({ summary: 'Soft delete business note' })
  async softDeleteNote(@Param('noteId') noteId: string) {
    return this.service.softDeleteNote(noteId);
  }
}
