import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreatePromotionDto {
  @ApiProperty({ example: 'SUMMER20' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Summer Campaign discount' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 20.0 })
  @IsNumber()
  discountPercent: number;
}
