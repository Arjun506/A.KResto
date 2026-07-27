import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreatePropertyDto {
  @ApiProperty({ example: 'Grand Hyatt Berlin' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Marlene-Dietrich-Platz 2, 10785 Berlin' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  starRating?: number;
}
