import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateReturnAuthDto {
  @ApiProperty({ example: 'RMA-2026-0081' })
  @IsString()
  @IsNotEmpty()
  rmaNumber: string;

  @ApiProperty({ example: 'DEFECTIVE_PRODUCT' })
  @IsString()
  @IsNotEmpty()
  reasonCode: string;

  @ApiProperty({ example: 199.99 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  refundAmount: number;

  @ApiPropertyOptional({
    example: 'Customer reported battery failure upon opening',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
