import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductAttributeDto {
  @ApiProperty({ example: 'Color' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'color' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({ example: 'STRING' })
  @IsOptional()
  @IsString()
  dataType?: string;

  @ApiPropertyOptional({ example: ['Red', 'Blue', 'Black'] })
  @IsOptional()
  options?: any;
}

export class SetAttributeValueDto {
  @ApiProperty({ example: 'attr_cuid_123' })
  @IsString()
  @IsNotEmpty()
  attributeId: string;

  @ApiPropertyOptional({ example: 'Midnight Black' })
  @IsOptional()
  @IsString()
  valueString?: string;
}
