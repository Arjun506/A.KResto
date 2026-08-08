import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class TransferItemDto {
  @IsString()
  @IsNotEmpty()
  inventoryItemId: string;

  @IsNumber()
  @Min(0.001)
  quantity: number;
}

export class CreateTransferDto {
  @IsString()
  @IsNotEmpty()
  sourceBranchId: string;

  @IsString()
  @IsNotEmpty()
  destinationBranchId: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransferItemDto)
  items: TransferItemDto[];
}
