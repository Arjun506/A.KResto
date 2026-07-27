import { Injectable } from '@nestjs/common';
import { PaymentMethodType } from '@prisma/client';

@Injectable()
export class PaymentMethodsService {
  getPaymentMethods() {
    return Object.values(PaymentMethodType).map((code) => ({
      code,
      label: code,
    }));
  }
}
