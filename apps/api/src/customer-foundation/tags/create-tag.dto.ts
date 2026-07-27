import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCustomerTagDto {
  @ApiProperty({ example: 'HighValue' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: '#4CAF50' })
  @IsOptional()
  @IsString()
  color?: string;
}

export class AssignCustomerTagDto {
  @ApiProperty({ example: 'tag_cuid_123' })
  @IsString()
  @IsNotEmpty()
  tagId: string;
}
