import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SupportTicketsService } from './support-tickets.service';
import { CreateSupportTicketDto } from './dto/create-ticket.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('CRM Foundation — Support Tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('crm-tickets')
export class SupportTicketsController {
  constructor(private readonly service: SupportTicketsService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new customer support ticket' })
  async createTicket(@Body() dto: CreateSupportTicketDto) {
    return this.service.createTicket(dto);
  }

  @Post(':id/assign')
  @ApiOperation({
    summary: 'Assign support ticket to a support representative',
  })
  async assignTicket(
    @Param('id') id: string,
    @Body() body: { assignedTo: string },
  ) {
    return this.service.assignTicket(id, body.assignedTo);
  }

  @Post(':id/resolve')
  @ApiOperation({ summary: 'Resolve support ticket' })
  async resolveTicket(@Param('id') id: string) {
    return this.service.resolveTicket(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get support ticket details' })
  async getTicket(@Param('id') id: string) {
    return this.service.getTicket(id);
  }

  @Get()
  @ApiOperation({ summary: 'List all support tickets' })
  async listTickets(@Query('tenantId') tenantId?: string) {
    return this.service.listTickets(tenantId);
  }
}
