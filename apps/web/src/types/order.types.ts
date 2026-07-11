export type Order = {
  id: string;
  orderNumber: string;
  customerName?: string | null;
  customerPhone?: string | null;
  tableId: string;
  restaurantId: string;
  totalAmount: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
};

export type OrderItem = {
  id: string;
  quantity: number;
  price: string;
  notes?: string | null;
  menuItemId: string;
  name?: string | null;
};

export type OrdersListResponse = Order[];

export type CreateOrderRequest = {
  customerName?: string;
  customerPhone?: string;
  tableId: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
    notes?: string;
  }>;
};

