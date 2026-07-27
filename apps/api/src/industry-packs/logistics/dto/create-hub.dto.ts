import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateHubDto {
  @ApiProperty({ example: 'Central Distribution Center' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Indira Gandhi Street 12, Delhi' })
  @IsOptional()
  @IsString()
  address?: string;
}
