import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateInventoryItemDto {
  @IsString()
  @MaxLength(160)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  sku?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  category?: string;

  @IsNumber()
  @Min(0)
  quantity!: number;

  @IsString()
  @MaxLength(40)
  unit!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  lowStockLevel?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  reorderLevel?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  costPerUnit?: number;

  @IsOptional()
  @IsString()
  supplierId?: string;

  @IsOptional()
  @IsString()
  branchId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateInventoryItemDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  sku?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  category?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  unit?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  lowStockLevel?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  reorderLevel?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  costPerUnit?: number;

  @IsOptional()
  @IsString()
  supplierId?: string | null;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class DeductStockDto {
  @IsNumber()
  @Min(0.01)
  quantity!: number;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class AdjustStockDto {
  @IsNumber()
  changeQuantity!: number;

  @IsOptional()
  @IsString()
  type?: string; // MANUAL_ADJUSTMENT, WASTAGE, DAMAGE, STOCK_COUNT_CORRECTION, OPENING_BALANCE

  @IsOptional()
  @IsString()
  reason?: string;
}

