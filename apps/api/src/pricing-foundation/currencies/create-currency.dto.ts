import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCurrencyDto {
  @ApiProperty({ example: 'USD' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'US Dollar' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '$' })
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsNumber()
  precision?: number;
}

export class SetExchangeRateDto {
  @ApiProperty({ example: 'USD' })
  @IsString()
  @IsNotEmpty()
  baseCurrency: string;

  @ApiProperty({ example: 'EUR' })
  @IsString()
  @IsNotEmpty()
  targetCurrency: string;

  @ApiProperty({ example: 0.92 })
  @IsNumber()
  @IsNotEmpty()
  rate: number;
}
