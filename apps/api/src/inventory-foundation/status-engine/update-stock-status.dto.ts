import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { StockStatus } from '@prisma/client';

export class UpdateStockStatusDto {
  @ApiProperty({ enum: StockStatus, example: StockStatus.QUARANTINED })
  @IsEnum(StockStatus)
  @IsNotEmpty()
  status: StockStatus;
}
