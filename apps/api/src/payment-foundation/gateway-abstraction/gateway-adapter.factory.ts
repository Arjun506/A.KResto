import { Injectable } from '@nestjs/common';
import {
  IPaymentGatewayAdapter,
  GatewayChargeResponse,
} from './gateway-adapter.interface';

@Injectable()
export class MockGatewayAdapter implements IPaymentGatewayAdapter {
  async authorize(
    amount: number,
    currency: string,
    token: string,
  ): Promise<GatewayChargeResponse> {
    // Simulate successful mock authorization
    return {
      success: true,
      transactionRef: `MOCK-AUTH-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      authCode: `AUTH-${Math.floor(100000 + Math.random() * 900000)}`,
      feeAmount: amount * 0.02,
    };
  }

  async capture(
    transactionRef: string,
    amount: number,
  ): Promise<GatewayChargeResponse> {
    return {
      success: true,
      transactionRef: `MOCK-CAP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      feeAmount: amount * 0.01,
    };
  }

  async refund(
    transactionRef: string,
    amount: number,
  ): Promise<GatewayChargeResponse> {
    return {
      success: true,
      transactionRef: `MOCK-REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      feeAmount: 0,
    };
  }

  async void(transactionRef: string): Promise<GatewayChargeResponse> {
    return {
      success: true,
      transactionRef: `MOCK-VOID-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      feeAmount: 0,
    };
  }
}

@Injectable()
export class GatewayAdapterFactory {
  constructor(private readonly mockAdapter: MockGatewayAdapter) {}

  getAdapter(providerCode: string): IPaymentGatewayAdapter {
    // Route any adapter request to mock adapter for developer sandboxed execution
    return this.mockAdapter;
  }
}
