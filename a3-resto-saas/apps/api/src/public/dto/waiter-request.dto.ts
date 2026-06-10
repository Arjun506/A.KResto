import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class WaiterRequestDto {
  @IsString()
  @IsNotEmpty()
  restaurantSlug!: string;

  @IsString()
  @IsNotEmpty()
  tableId!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['Need Water', 'Call Waiter', 'Need Bill', 'Clean Table'])
  type!: 'Need Water' | 'Call Waiter' | 'Need Bill' | 'Clean Table';

  @IsOptional()
  @IsString()
  qrToken?: string;
}
