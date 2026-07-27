import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateProductVersionDto {
  @ApiPropertyOptional({ example: 'Updated pricing and description snapshot' })
  @IsOptional()
  @IsString()
  reason?: string;
}
