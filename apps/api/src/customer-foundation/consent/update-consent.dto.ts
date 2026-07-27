import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ConsentType } from '@prisma/client';

export class UpdateConsentDto {
  @ApiProperty({ enum: ConsentType, example: ConsentType.MARKETING })
  @IsEnum(ConsentType)
  @IsNotEmpty()
  type: ConsentType;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  isGranted: boolean;

  @ApiPropertyOptional({ example: 'v2.1' })
  @IsOptional()
  @IsString()
  version?: string;

  @ApiPropertyOptional({ example: 'WEB_PORTAL' })
  @IsOptional()
  @IsString()
  source?: string;
}
