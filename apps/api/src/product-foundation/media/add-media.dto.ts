import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProductMediaType } from '@prisma/client';

export class AddProductMediaDto {
  @ApiPropertyOptional({ example: 'var_cuid_123' })
  @IsOptional()
  @IsString()
  variantId?: string;

  @ApiProperty({ example: 'product-images/headphones-main.jpg' })
  @IsString()
  @IsNotEmpty()
  fileKey: string;

  @ApiProperty({ example: 'headphones-main.jpg' })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({ example: 'image/jpeg' })
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @ApiProperty({ enum: ProductMediaType, example: ProductMediaType.IMAGE })
  @IsEnum(ProductMediaType)
  @IsNotEmpty()
  type: ProductMediaType;

  @ApiProperty({ example: '/uploads/product-images/headphones-main.jpg' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  position?: number;
}
