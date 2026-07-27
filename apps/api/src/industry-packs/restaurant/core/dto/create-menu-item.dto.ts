import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsObject,
} from 'class-validator';

export class CreateRestaurantMenuItemDto {
  @ApiProperty({ example: 'Margeritha Pizza' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'Classic pizza with marinara sauce and mozzarella cheese',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 12.99 })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ example: { prepMinutes: 15 } })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
