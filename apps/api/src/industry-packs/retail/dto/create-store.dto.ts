import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({ example: 'Supermarket Central' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Hauptstr 12, Berlin' })
  @IsOptional()
  @IsString()
  address?: string;
}
