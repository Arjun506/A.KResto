import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PriceRuleType } from '@prisma/client';

export class CreatePriceRuleDto {
  @ApiProperty({ example: 'Wholesale Tier 1 15% Off' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    enum: PriceRuleType,
    example: PriceRuleType.PERCENTAGE_DISCOUNT,
  })
  @IsEnum(PriceRuleType)
  @IsNotEmpty()
  ruleType: PriceRuleType;

  @ApiProperty({ example: 15.0 })
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  minQuantity?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  priority?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isStackable?: boolean;

  @ApiPropertyOptional({ example: 'basePrice * 0.85' })
  @IsOptional()
  @IsString()
  formulaExpression?: string;
}
