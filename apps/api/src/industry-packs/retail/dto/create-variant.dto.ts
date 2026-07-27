import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsObject } from 'class-validator';

export class CreateVariantDto {
  @ApiProperty({ example: 'prod_id_123' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 'SKU-SHIRT-BLUE-L' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: { color: 'blue', size: 'L' } })
  @IsObject()
  @IsNotEmpty()
  attributes: Record<string, any>;
}
