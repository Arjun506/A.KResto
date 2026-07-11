import {
  IsEmail,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { PlanTier } from '@prisma/client';
import { SUPPORTED_INDUSTRY_IDS } from '../business.constants';

export class CreateWorkspaceDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  businessName!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([...SUPPORTED_INDUSTRY_IDS])
  industry!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  ownerName!: string;

  @IsEmail()
  @IsNotEmpty()
  ownerEmail!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  ownerPassword!: string;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  timezone?: string;

  @IsString()
  @IsOptional()
  language?: string;

  @IsString()
  @IsOptional()
  themePreset?: string;

  @IsEnum(PlanTier)
  @IsOptional()
  selectedPlan?: PlanTier;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  address?: string;
}
