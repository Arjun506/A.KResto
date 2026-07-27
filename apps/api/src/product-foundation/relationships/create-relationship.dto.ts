import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProductRelationshipType } from '@prisma/client';

export class CreateProductRelationshipDto {
  @ApiProperty({ example: 'prod_target_cuid' })
  @IsString()
  @IsNotEmpty()
  targetProductId: string;

  @ApiProperty({
    enum: ProductRelationshipType,
    example: ProductRelationshipType.CROSS_SELL,
  })
  @IsEnum(ProductRelationshipType)
  @IsNotEmpty()
  type: ProductRelationshipType;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  position?: number;
}
