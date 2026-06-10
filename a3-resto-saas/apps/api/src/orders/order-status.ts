// Enterprise-required order lifecycle (DTO/response contract)
export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Internal transition rules based on the enterprise contract
export const ORDER_STATUS_TRANSITIONS: Record<
  OrderStatus,
  ReadonlySet<OrderStatus>
> = {
  [OrderStatus.PENDING]: new Set([
    OrderStatus.PREPARING,
    OrderStatus.CANCELLED,
  ]),
  [OrderStatus.PREPARING]: new Set([OrderStatus.READY, OrderStatus.CANCELLED]),
  [OrderStatus.READY]: new Set([OrderStatus.COMPLETED, OrderStatus.CANCELLED]),
  [OrderStatus.COMPLETED]: new Set(),
  [OrderStatus.CANCELLED]: new Set(),
};

// Prisma enum currently includes an extra ACCEPTED value.
// We map it deterministically to the enterprise contract.
export const mapPrismaStatusToEnterpriseStatus = (
  status: string,
): OrderStatus => {
  if (status === 'ACCEPTED') return OrderStatus.PENDING;
  // Prisma returns one of the known strings.
  return status as OrderStatus;
};

export const isEnterpriseOrderStatus = (
  value: unknown,
): value is OrderStatus => {
  return Object.values(OrderStatus).includes(value as OrderStatus);
};
