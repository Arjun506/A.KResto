import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CustomerAddressType } from '@prisma/client';

export class CreateCustomerAddressDto {
  @ApiProperty({ enum: CustomerAddressType, example: CustomerAddressType.HOME })
  @IsEnum(CustomerAddressType)
  @IsNotEmpty()
  type: CustomerAddressType;

  @ApiProperty({ example: '742 Evergreen Terrace' })
  @IsString()
  @IsNotEmpty()
  line1: string;

  @ApiPropertyOptional({ example: 'Apt 2B' })
  @IsOptional()
  @IsString()
  line2?: string;

  @ApiProperty({ example: 'Springfield' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiPropertyOptional({ example: 'OR' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: '97477' })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({ example: 'USA' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiPropertyOptional({ example: 44.0462 })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: -123.0236 })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ example: 'America/Los_Angeles' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
