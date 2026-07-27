import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CustomerRelationshipType } from '@prisma/client';

export class CreateCustomerRelationshipDto {
  @ApiPropertyOptional({ example: 'cust_target_cuid' })
  @IsOptional()
  @IsString()
  targetCustomerId?: string;

  @ApiPropertyOptional({ example: 'biz_cuid_123' })
  @IsOptional()
  @IsString()
  targetBusinessId?: string;

  @ApiPropertyOptional({ example: 'org_cuid_123' })
  @IsOptional()
  @IsString()
  targetOrganizationId?: string;

  @ApiProperty({
    enum: CustomerRelationshipType,
    example: CustomerRelationshipType.FAMILY,
  })
  @IsEnum(CustomerRelationshipType)
  @IsNotEmpty()
  type: CustomerRelationshipType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
