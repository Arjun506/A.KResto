import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PriceBooksService } from './price-books.service';
import { CreatePriceBookDto } from './dto/create-price-book.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Pricing Foundation — Price Books')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('price-books')
export class PriceBooksController {
  constructor(private readonly service: PriceBooksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new master price book container' })
  async createPriceBook(@Body() dto: CreatePriceBookDto, @Req() req: any) {
    return this.service.createPriceBook(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({
    summary: 'List price books with pagination & tenant isolation',
  })
  async listPriceBooks(
    @Query('tenantId') tenantId?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.service.listPriceBooks(tenantId, Number(page), Number(limit));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get detailed price book record by ID' })
  async getPriceBookById(@Param('id') id: string) {
    return this.service.getPriceBookById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete price book container' })
  async softDeletePriceBook(@Param('id') id: string, @Req() req: any) {
    return this.service.softDeletePriceBook(id, req.user?.id);
  }
}
