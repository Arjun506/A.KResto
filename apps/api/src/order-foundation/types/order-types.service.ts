import { Injectable } from '@nestjs/common';
import { OrderType } from '@prisma/client';

@Injectable()
export class OrderTypesService {
  getOrderTypes() {
    return Object.values(OrderType).map((code) => ({ code, label: code }));
  }
}
