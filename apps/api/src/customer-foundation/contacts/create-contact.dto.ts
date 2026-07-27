import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CustomerContactType } from '@prisma/client';

export class CreateCustomerContactDto {
  @ApiProperty({
    enum: CustomerContactType,
    example: CustomerContactType.PRIMARY_EMAIL,
  })
  @IsEnum(CustomerContactType)
  @IsNotEmpty()
  type: CustomerContactType;

  @ApiProperty({ example: 'customer@example.com' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
