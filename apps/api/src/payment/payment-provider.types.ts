export type CreateCheckoutResult = {
  checkoutUrl?: string;
  providerSubscriptionId?: string;
};

export type CreateSubscriptionResult = {
  checkoutUrl?: string;
  providerSubscriptionId?: string;
};

export type OpenBillingPortalResult = {
  url: string;
};

export type InvoiceSummary = {
  id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'open' | 'failed';
  issuedAt: string; // ISO
};

export type GetInvoiceHistoryResult = {
  invoices: InvoiceSummary[];
};
