import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsObject,
} from 'class-validator';

export class CreateRoomTypeDto {
  @ApiProperty({ example: 'prop_id_123' })
  @IsString()
  @IsNotEmpty()
  propertyId: string;

  @ApiProperty({ example: 'Deluxe King Room' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 199.99 })
  @IsNumber()
  basePrice: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsNumber()
  maxOccupants?: number;

  @ApiPropertyOptional({ example: { view: 'Ocean View', beds: 1 } })
  @IsOptional()
  @IsObject()
  amenities?: Record<string, any>;
}
