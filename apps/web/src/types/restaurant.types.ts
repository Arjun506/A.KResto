export type Subscription = {
  id: string;
  tenantId: string;
  planName: string;
  status: string;
  billingEmail: string | null;
  currentPeriodStart: string;
  currentPeriodEnd: string;
};

export type Restaurant = {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  location?: string | null;
  isActive?: boolean;
  subscriptions?: Subscription[];
};

export type RestaurantsListResponse = Restaurant[];

export type CreateRestaurantRequest = {
  name: string;
  slug?: string;
  address?: string;
  location?: string;
  isActive?: boolean;
  planName?: string;
  expiresAt?: string;
};

export type UpdateRestaurantRequest = {
  name?: string;
  slug?: string;
  address?: string;
  location?: string;
  isActive?: boolean;
  planName?: string;
  expiresAt?: string;
};

