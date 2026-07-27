import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CustomerIdentityType, CustomerLifecycleStage } from '@prisma/client';

export class RegisterCustomerDto {
  @ApiPropertyOptional({ example: 't_cuid_123' })
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiPropertyOptional({ example: 'usr_cuid_123' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ example: 'biz_cuid_123' })
  @IsOptional()
  @IsString()
  businessId?: string;

  @ApiPropertyOptional({ example: 'CUST-88392' })
  @IsOptional()
  @IsString()
  customerCode?: string;

  @ApiPropertyOptional({
    enum: CustomerIdentityType,
    example: CustomerIdentityType.REGISTERED,
  })
  @IsOptional()
  @IsEnum(CustomerIdentityType)
  identityType?: CustomerIdentityType;

  @ApiPropertyOptional({
    enum: CustomerLifecycleStage,
    example: CustomerLifecycleStage.PROSPECT,
  })
  @IsOptional()
  @IsEnum(CustomerLifecycleStage)
  lifecycleStage?: CustomerLifecycleStage;

  @ApiPropertyOptional({ example: 'EXT-SYSTEM-99' })
  @IsOptional()
  @IsString()
  externalId?: string;

  @ApiPropertyOptional({ example: 'SAP_CRM' })
  @IsOptional()
  @IsString()
  externalSystem?: string;

  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ example: '+1-555-0199' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, any>;
}
