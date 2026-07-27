import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePurchaseOrderDto {
  @ApiProperty({ example: 'supplier_id_123' })
  @IsString()
  @IsNotEmpty()
  supplierId: string;
}
