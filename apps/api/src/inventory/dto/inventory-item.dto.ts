import {
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
  @IsString()
  supplierId?: string;
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
  @IsString()
  supplierId?: string | null;
}

export class DeductStockDto {
  @IsNumber()
  @Min(0.01)
  quantity!: number;
}
