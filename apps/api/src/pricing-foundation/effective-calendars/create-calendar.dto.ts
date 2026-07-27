import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePricingCalendarDto {
  @ApiProperty({ example: 'US Retail Business Hours & Holidays' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'America/New_York' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ example: ['2026-12-25', '2026-01-01'] })
  @IsOptional()
  blackoutDates?: any;

  @ApiPropertyOptional({ example: { monday: '09:00-17:00' } })
  @IsOptional()
  businessHours?: any;
}
