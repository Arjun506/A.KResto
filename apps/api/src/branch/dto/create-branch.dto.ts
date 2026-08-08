import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateBranchDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsOptional()
  operatingHours?: any;

  @IsString()
  @IsOptional()
  timezone?: string;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  managerId?: string;

  @IsString()
  @IsOptional()
  industryType?: string;
}

export class UpdateBranchDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsOptional()
  operatingHours?: any;

  @IsString()
  @IsOptional()
  timezone?: string;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  managerId?: string;

  @IsString()
  @IsOptional()
  industryType?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
