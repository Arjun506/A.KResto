import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateRestaurantModifierDto {
  @ApiProperty({ example: 'Extra Cheese' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1.5 })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ example: 'MODIFIER_GROUP_CHEESE' })
  @IsOptional()
  @IsString()
  groupCode?: string;
}
