import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 'prop_id_123' })
  @IsString()
  @IsNotEmpty()
  propertyId: string;

  @ApiProperty({ example: 'room_id_123' })
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @ApiPropertyOptional({ example: 'cust_id_123' })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiProperty({ example: '2026-07-24T14:00:00.000Z' })
  @IsDateString()
  checkInDateTime: string;

  @ApiProperty({ example: '2026-07-28T11:00:00.000Z' })
  @IsDateString()
  checkOutDateTime: string;
}
