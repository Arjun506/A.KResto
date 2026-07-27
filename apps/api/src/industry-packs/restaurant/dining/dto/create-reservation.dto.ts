import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateRestaurantReservationDto {
  @ApiPropertyOptional({ example: 'cust_cuid_123' })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiProperty({ example: 'table_cuid_123' })
  @IsString()
  @IsNotEmpty()
  tableId: string;

  @ApiProperty({ example: 4 })
  @IsNumber()
  partySize: number;

  @ApiProperty({ example: '2026-07-24T18:00:00.000Z' })
  @IsString()
  @IsNotEmpty()
  reservedFor: string;
}
