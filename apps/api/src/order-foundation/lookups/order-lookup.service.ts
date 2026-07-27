import { Injectable } from '@nestjs/common';
import {
  OrderType,
  UniversalOrderStatus,
  FulfillmentType,
  FulfillmentStatus,
} from '@prisma/client';

@Injectable()
export class OrderLookupService {
  getOrderTypes() {
    return Object.values(OrderType).map((code) => ({ code, label: code }));
  }

  getOrderStatuses() {
    return Object.values(UniversalOrderStatus).map((code) => ({
      code,
      label: code,
    }));
  }

  getFulfillmentTypes() {
    return Object.values(FulfillmentType).map((code) => ({
      code,
      label: code,
    }));
  }

  getFulfillmentStatuses() {
    return Object.values(FulfillmentStatus).map((code) => ({
      code,
      label: code,
    }));
  }

  getTransactionTypes() {
    return [
      'QUOTE',
      'ESTIMATE',
      'RESERVATION',
      'BOOKING',
      'SUBSCRIPTION',
      'INVOICE',
      'CREDIT_NOTE',
      'DEBIT_NOTE',
      'ADJUSTMENT',
      'SERVICE_TICKET',
      'ORDER',
    ].map((code) => ({ code, label: code }));
  }
}
