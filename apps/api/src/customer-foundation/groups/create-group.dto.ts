import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCustomerGroupDto {
  @ApiProperty({ example: 'VIP Customers' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'vip-customers' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({ example: 'High value recurring client group' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '#FFD700' })
  @IsOptional()
  @IsString()
  color?: string;
}

export class AssignCustomerGroupDto {
  @ApiProperty({ example: 'grp_cuid_123' })
  @IsString()
  @IsNotEmpty()
  groupId: string;
}
