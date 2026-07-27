import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RelationshipType } from '@prisma/client';

export class CreateRelationshipDto {
  @ApiProperty({ example: 'target_biz_cuid' })
  @IsString()
  @IsNotEmpty()
  targetBusinessId: string;

  @ApiProperty({ enum: RelationshipType, example: RelationshipType.FRANCHISE })
  @IsEnum(RelationshipType)
  @IsNotEmpty()
  type: RelationshipType;

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, any>;
}
