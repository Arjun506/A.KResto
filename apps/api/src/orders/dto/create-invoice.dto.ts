import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateInvoiceDto {
  @IsNumber()
  @Min(0.01)
  subtotal!: number;

  @IsNumber()
  @Min(0)
  tax!: number;

  @IsNumber()
  @Min(0)
  serviceCharge!: number;

  @IsNumber()
  @Min(0)
  discount!: number;

  @IsNumber()
  @Min(0.01)
  grandTotal!: number;

  @IsOptional()
  @IsString()
  pdfUrl?: string;
}
