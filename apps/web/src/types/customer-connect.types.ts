export type MoneyRange = {
  min?: number;
  max?: number;
};

export type BusinessOffer = {
  id: string;
  title: string;
  description?: string;
  discountPercentage?: number;
  priceOff?: number;
  validUntil?: string;
};

export type BusinessCategory = {
  id: string;
  name: string;
  icon?: string;
};

export type BusinessDiscoveryCard = {
  id: string;
  name: string;
  slug: string;
  coverImageUrl?: string;
  logoImageUrl?: string;
  rating: number;
  reviewsCount: number;
  distanceKm?: number;
  deliveryTimeMinutes?: number;
  category?: string;
  offers?: BusinessOffer[];
  isOpen?: boolean;
  priceRange?: MoneyRange;
  deliveryFee?: number;
};

export type BusinessDiscoverySectionResponse = {
  items: BusinessDiscoveryCard[];
};

export type BusinessSearchResponse = {
  query: string;
  items: BusinessDiscoveryCard[];
};

export type CustomerRecommendationsResponse = {
  items: BusinessDiscoveryCard[];
};

