import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateShipmentDto {
  @ApiProperty({ example: 'order_id_123' })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiPropertyOptional({ example: 'hub_id_123' })
  @IsOptional()
  @IsString()
  originHubId?: string;

  @ApiPropertyOptional({ example: 'hub_id_456' })
  @IsOptional()
  @IsString()
  destinationHubId?: string;

  @ApiProperty({ example: 1.5 })
  @IsNumber()
  weightKg: number;

  @ApiProperty({ example: 30.0 })
  @IsNumber()
  lengthCm: number;

  @ApiProperty({ example: 20.0 })
  @IsNumber()
  widthCm: number;

  @ApiProperty({ example: 15.0 })
  @IsNumber()
  heightCm: number;
}
