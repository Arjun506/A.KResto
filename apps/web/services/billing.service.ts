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
  return unwrap<any>(api.get('/billing/invoices'));
};

export const getSubscriptionStatus = async () => {
  return unwrap<any>(api.get('/subscription/status'));
};

export const simulatePaymentSuccess = async (planId: string, gateway: string) => {
  return unwrap<{ ok: boolean; plan: string }>(
    api.post('/billing/simulate-success', { planId, gateway }),
  );
};

export const activateLicenseKey = async (licenseKey: string) => {
  return unwrap<any>(
    api.post('/subscription/license/activate', { licenseKey }),
  );
};

