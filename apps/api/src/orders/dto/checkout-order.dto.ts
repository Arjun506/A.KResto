import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CheckoutOrderDto {
  @IsString()
  @IsIn(['CASH', 'CARD', 'UPI', 'WALLET'])
  paymentMethod!: string;

  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsNumber()
  @Min(0)
  tax!: number;

  @IsNumber()
  @Min(0)
  serviceCharge!: number;

  @IsNumber()
  @Min(0)
  discount!: number;

  @IsOptional()
  @IsString()
  transactionId?: string;
}
