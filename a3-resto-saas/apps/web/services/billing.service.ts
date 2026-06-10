import api from './api';
import { unwrap } from './helpers';

export const createRazorpaySubscription = async (planId: string) => {
  return unwrap<{ checkoutUrl?: string; subscriptionId?: string }>(
    api.post('/billing/razorpay/subscriptions', { planId }),
  );
};

export const createStripeCheckout = async (planId: string) => {
  return unwrap<{ checkoutUrl: string }>(
    api.post('/billing/stripe/checkout', { planId }),
  );
};

export const openStripeBillingPortal = async () => {
  return unwrap<{ url: string }>(api.post('/billing/stripe/portal'));
};

export const getInvoiceHistory = async () => {
  return unwrap(api.get('/billing/invoices'));
};
