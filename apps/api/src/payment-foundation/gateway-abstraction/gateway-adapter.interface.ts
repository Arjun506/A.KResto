export interface GatewayChargeResponse {
  success: boolean;
  transactionRef: string;
  authCode?: string;
  errorMessage?: string;
  feeAmount: number;
}

export interface IPaymentGatewayAdapter {
  authorize(
    amount: number,
    currency: string,
    token: string,
  ): Promise<GatewayChargeResponse>;
  capture(
    transactionRef: string,
    amount: number,
  ): Promise<GatewayChargeResponse>;
  refund(
    transactionRef: string,
    amount: number,
  ): Promise<GatewayChargeResponse>;
  void(transactionRef: string): Promise<GatewayChargeResponse>;
}
