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
import { OrderNotesService } from './order-notes.service';
import { AddOrderNoteDto } from './add-order-note.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Order Foundation — Notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders/:orderId/notes')
export class OrderNotesController {
  constructor(private readonly service: OrderNotesService) {}

  @Post()
  @ApiOperation({ summary: 'Add internal or customer-facing note to an order' })
  async addNote(
    @Param('orderId') orderId: string,
    @Body() dto: AddOrderNoteDto,
    @Req() req: any,
  ) {
    return this.service.addNote(orderId, dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List notes for an order' })
  async getNotes(@Param('orderId') orderId: string) {
    return this.service.getNotes(orderId);
  }
}
