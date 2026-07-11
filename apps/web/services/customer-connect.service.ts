import api from './api';
import type {
  BusinessCategory,
  BusinessDiscoveryCard,
  BusinessSearchResponse,
  CustomerRecommendationsResponse,
  BusinessDiscoverySectionResponse,
} from '@/src/types/customer-connect.types';

const unwrap = async <T,>(promise: Promise<{ data: unknown }>): Promise<T> => {
  const res = await promise;
  const maybe = res.data as { success?: boolean; data?: unknown; message?: unknown };
  if (maybe.success) return maybe.data as T;
  // allow mocked API shapes too
  if (typeof maybe.data !== 'undefined') return maybe.data as T;
  throw new Error((maybe.message as string) || 'Request failed');
};

type Geo = {
  lat: number;
  lng: number;
};

const storageKey = {
  recentlyViewed: (userId?: string) => `akconnect:recentlyViewed:${userId || 'guest'}`,
};

const demoCards: BusinessDiscoveryCard[] = [
  {
    id: 'b1',
    name: 'Olive & Ember',
    slug: 'olive-ember',
    coverImageUrl: '/images/olive-ember-cover.png',
    logoImageUrl: '/images/olive-ember-logo.png',
    rating: 4.8,
    reviewsCount: 1240,
    distanceKm: 1.7,
    deliveryTimeMinutes: 28,
    category: 'Fine Dining',
    offers: [
      {
        id: 'o1',
        title: '20% OFF',
        description: 'Limited time discovery offer',
        discountPercentage: 20,
      },
    ],
    isOpen: true,
    priceRange: { min: 20, max: 80 },
    deliveryFee: 2,
  },
  {
    id: 'b2',
    name: 'Saffron Social',
    slug: 'saffron-social',
    coverImageUrl: '/images/saffron-social-cover.png',
    logoImageUrl: '/images/saffron-social-logo.png',
    rating: 4.6,
    reviewsCount: 860,
    distanceKm: 3.2,
    deliveryTimeMinutes: 34,
    category: 'Modern Indian',
    offers: [
      {
        id: 'o2',
        title: '15% OFF',
        discountPercentage: 15,
      },
    ],
    isOpen: true,
    priceRange: { min: 15, max: 55 },
    deliveryFee: 0,
  },
  {
    id: 'b3',
    name: 'The Green Table',
    slug: 'green-table',
    coverImageUrl: '/images/green-table-cover.png',
    logoImageUrl: '/images/green-table-logo.png',
    rating: 4.7,
    reviewsCount: 642,
    distanceKm: 2.1,
    deliveryTimeMinutes: 24,
    category: 'Healthy Bowls',
    offers: [
      {
        id: 'o3',
        title: '10% OFF',
        discountPercentage: 10,
      },
    ],
    isOpen: true,
    priceRange: { min: 10, max: 45 },
    deliveryFee: 1,
  },
  {
    id: 'b4',
    name: 'Royal Blue Bakery',
    slug: 'royal-blue-bakery',
    coverImageUrl: '/images/royal-blue-cover.png',
    logoImageUrl: '/images/royal-blue-logo.png',
    rating: 4.5,
    reviewsCount: 512,
    distanceKm: 4.4,
    deliveryTimeMinutes: 19,
    category: 'Bakery & Coffee',
    offers: [
      {
        id: 'o4',
        title: 'Free Delivery',
        description: 'On select items',
      },
    ],
    isOpen: false,
    priceRange: { min: 8, max: 30 },
    deliveryFee: 0,
  },
  {
    id: 'b5',
    name: 'Emerald Street Grill',
    slug: 'emerald-street-grill',
    coverImageUrl: '/images/emerald-street-cover.png',
    logoImageUrl: '/images/emerald-street-logo.png',
    rating: 4.4,
    reviewsCount: 390,
    distanceKm: 0.9,
    deliveryTimeMinutes: 21,
    category: 'Street Classics',
    offers: [
      {
        id: 'o5',
        title: 'Buy 1 Get 1',
        description: 'On combo menu',
      },
    ],
    isOpen: true,
    priceRange: { min: 12, max: 50 },
    deliveryFee: 3,
  },
];

const safeJsonParse = <T,>(value: string | null): T | null => {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

export const searchBusinesses = async (
  query: string,
  opts?: { sortBy?: 'relevance' | 'rating' | 'distance'; geo?: Geo },
): Promise<BusinessSearchResponse> => {
  const q = query.trim();
  if (!q) {
    return { query: '', items: demoCards.slice(0, 4) };
  }

  // Attempt backend first (if available). If not, fall back to mock.
  try {
    const res = await api.get('/ak-connect/search', {
      params: {
        q,
        sortBy: opts?.sortBy || 'relevance',
        lat: opts?.geo?.lat,
        lng: opts?.geo?.lng,
      },
    });
    return await unwrap<BusinessSearchResponse>(Promise.resolve({ data: res.data }));
  } catch {
    const lowered = q.toLowerCase();
    const items = demoCards.filter((c) =>
      (c.name + ' ' + (c.category || '')).toLowerCase().includes(lowered),
    );
    return { query: q, items: items.length ? items : demoCards.slice(0, 4) };
  }
};

export const getNearbyBusinesses = async (
  geo: Geo,
): Promise<BusinessDiscoverySectionResponse> => {
  try {
    return await unwrap<BusinessDiscoverySectionResponse>(
      api.get('/ak-connect/nearby', { params: { lat: geo.lat, lng: geo.lng } }),
    );
  } catch {
    // mock ordering by distanceKm
    return {
      items: demoCards
        .map((c, idx) => ({
          ...c,
          distanceKm:
            typeof c.distanceKm === 'number' ? c.distanceKm : (idx + 1) * 0.9,
        }))
        .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0))
        .slice(0, 6),
    };
  }
};

export const getFeaturedBusinesses = async (): Promise<BusinessDiscoverySectionResponse> => {
  try {
    return await unwrap<BusinessDiscoverySectionResponse>(api.get('/ak-connect/featured'));
  } catch {
    return { items: demoCards.slice(0, 5) };
  }
};

export const getTrendingBusinesses = async (): Promise<BusinessDiscoverySectionResponse> => {
  try {
    return await unwrap<BusinessDiscoverySectionResponse>(api.get('/ak-connect/trending'));
  } catch {
    return {
      items: [...demoCards].sort((a, b) => b.reviewsCount - a.reviewsCount).slice(0, 6),
    };
  }
};

export const getPopularBusinesses = async (): Promise<BusinessDiscoverySectionResponse> => {
  try {
    return await unwrap<BusinessDiscoverySectionResponse>(api.get('/ak-connect/popular'));
  } catch {
    return { items: [...demoCards].sort((a, b) => b.rating - a.rating).slice(0, 6) };
  }
};

export const getBusinessCategories = async (): Promise<BusinessCategory[]> => {
  try {
    return await unwrap<BusinessCategory[]>(api.get('/ak-connect/categories'));
  } catch {
    return [
      { id: 'c1', name: 'Fine Dining' },
      { id: 'c2', name: 'Modern Indian' },
      { id: 'c3', name: 'Healthy Bowls' },
      { id: 'c4', name: 'Bakery & Coffee' },
      { id: 'c5', name: 'Street Classics' },
    ];
  }
};

export const getOffers = async (): Promise<BusinessDiscoverySectionResponse> => {
  try {
    return await unwrap<BusinessDiscoverySectionResponse>(api.get('/ak-connect/offers'));
  } catch {
    return { items: demoCards.filter((c) => (c.offers?.length || 0) > 0).slice(0, 5) };
  }
};

export const markRecentlyViewed = async (
  business: BusinessDiscoveryCard,
  userId?: string,
): Promise<void> => {
  const key = storageKey.recentlyViewed(userId);
  const parsed = safeJsonParse<BusinessDiscoveryCard[]>(
    typeof window !== 'undefined' ? window.localStorage.getItem(key) : null,
  );
  const list = parsed || [];
  const without = list.filter((x) => x.id !== business.id);
  const next = [business, ...without].slice(0, 10);
  window.localStorage.setItem(key, JSON.stringify(next));
};

export const getRecentlyViewed = async (
  userId?: string,
): Promise<BusinessDiscoverySectionResponse> => {
  const key = storageKey.recentlyViewed(userId);
  const parsed = safeJsonParse<BusinessDiscoveryCard[]>(
    typeof window !== 'undefined' ? window.localStorage.getItem(key) : null,
  );
  if (!parsed?.length) return { items: demoCards.slice(2, 6) };
  return { items: parsed.slice(0, 8) };
};

export const getRecommendations = async (
  userId?: string,
): Promise<CustomerRecommendationsResponse> => {
  try {
    return await unwrap<CustomerRecommendationsResponse>(
      api.get('/ak-connect/recommendations', { params: { userId } }),
    );
  } catch {
    return { items: [...demoCards].slice(1, 7) };
  }
};

