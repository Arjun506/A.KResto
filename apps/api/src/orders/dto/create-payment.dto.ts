import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsString()
  @IsNotEmpty()
  paymentMethod!: string; // CASH, CARD, UPI, WALLET

  @IsOptional()
  @IsString()
  transactionId?: string;
}
