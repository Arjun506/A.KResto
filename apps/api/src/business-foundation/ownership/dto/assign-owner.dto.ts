import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
} from 'class-validator';
import { OwnershipRole } from '@prisma/client';

export class AssignOwnershipDto {
  @ApiProperty({ example: 'usr_cuid_123' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ enum: OwnershipRole, example: OwnershipRole.OWNER })
  @IsEnum(OwnershipRole)
  @IsNotEmpty()
  role: OwnershipRole;

  @ApiPropertyOptional({ example: 100.0 })
  @IsOptional()
  @IsNumber()
  percentage?: number;
}
