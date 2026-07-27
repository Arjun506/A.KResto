export type BillingPlan = {
  id: 'starter' | 'pro' | 'enterprise';
  name: string;
  price: string;
  interval: string;
  limits: string[];
  features: string[];
  recommended?: boolean;
};

export type Invoice = {
  id: string;
  provider: 'razorpay' | 'stripe';
  amount: string;
  status: string;
  issuedAt: string;
};

