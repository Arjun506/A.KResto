import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductTagDto {
  @ApiProperty({ example: 'BestSeller' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: '#FF9800' })
  @IsOptional()
  @IsString()
  color?: string;
}

export class AssignProductTagDto {
  @ApiProperty({ example: 'tag_cuid_123' })
  @IsString()
  @IsNotEmpty()
  tagId: string;
}
