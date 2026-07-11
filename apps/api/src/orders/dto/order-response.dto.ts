// Keep DTO self-contained to avoid TS module-resolution issues
export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class OrderItemResponseDto {
  id!: string;
  quantity!: number;
  price!: string;
  notes?: string | null;
  menuItemId!: string;
  name?: string | null;
}

export class OrderResponseDto {
  id!: string;
  orderNumber!: string;
  customerName?: string | null;
  customerPhone?: string | null;
  status!: OrderStatus;
  totalAmount!: string;
  restaurantId!: string;
  tableId!: string;
  createdAt!: Date;
  updatedAt!: Date;

  items!: OrderItemResponseDto[];
}
