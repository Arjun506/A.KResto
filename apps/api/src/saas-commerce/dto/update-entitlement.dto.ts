import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateEntitlementDto {
  @ApiProperty({ example: 'ai.copilot' })
  @IsString()
  @IsNotEmpty()
  featureKey: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  isEnabled: boolean;

  @ApiPropertyOptional({ example: { limit: 10 } })
  @IsOptional()
  config?: any;
}
