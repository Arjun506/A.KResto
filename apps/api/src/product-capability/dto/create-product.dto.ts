import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  sku: string;

  @IsString()
  barcode: string;

  @IsString()
  qrCode: string;

  @IsString()
  category: string;

  @IsString()
  brand: string;

  @IsString()
  unit: string;

  @IsNumber()
  tax: number;

  @IsObject()
  pricing: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsArray()
  videos?: string[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  attributes?: Array<{ key: string; values: string[] }>;

  @IsOptional()
  @IsArray()
  variants?: Array<Record<string, unknown>>;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  visibility?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsObject()
  seo?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  supplier?: string;

  @IsOptional()
  @IsString()
  manufacturer?: string;

  @IsOptional()
  @IsString()
  kind?: string;
}
