import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateRestaurantTaxProfileDto {
  @ApiProperty({ example: 'VAT-15' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 0.15 })
  @IsNumber()
  rate: number;
}
