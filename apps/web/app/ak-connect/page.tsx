"use client";

import { useEffect, useMemo, useState } from 'react';
import CustomerShell from '@/components/ak-connect/CustomerShell';
import type { BusinessDiscoveryCard } from '@/src/types/customer-connect.types';
import {
  getFeaturedBusinesses,
  getNearbyBusinesses,
  getPopularBusinesses,
  getRecommendations,
  getRecentlyViewed,
  getTrendingBusinesses,
  searchBusinesses,
} from '@/services/customer-connect.service';

export default function AkConnectPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const [featured, setFeatured] = useState<BusinessDiscoveryCard[]>([]);
  const [trending, setTrending] = useState<BusinessDiscoveryCard[]>([]);
  const [popular, setPopular] = useState<BusinessDiscoveryCard[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<BusinessDiscoveryCard[]>([]);

  const [quickPreview, setQuickPreview] = useState<BusinessDiscoveryCard | null>(null);

  // Suggestions (lightweight; can be replaced with backend)
  const suggestions = useMemo(() => {
    const base = ['Fine Dining', 'Modern Indian', 'Healthy Bowls', 'Bakery & Coffee', 'Street Classics'];
    const q = query.trim().toLowerCase();
    if (!q) return base.slice(0, 4);
    return base.filter((x) => x.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  useEffect(() => {
    let live = true;
    setLoading((v) => (v ? v : true));

    Promise.allSettled([
      getFeaturedBusinesses(),
      getTrendingBusinesses(),
      getPopularBusinesses(),
      getRecentlyViewed(),
      getRecommendations(),
    ])
      .then((results) => {
        if (!live) return;
        const featuredRes = results[0];
        const trendingRes = results[1];
        const popularRes = results[2];
        const recentlyRes = results[3];

        if (featuredRes.status === 'fulfilled') setFeatured(featuredRes.value.items);
        if (trendingRes.status === 'fulfilled') setTrending(trendingRes.value.items);
        if (popularRes.status === 'fulfilled') setPopular(popularRes.value.items);
        if (recentlyRes.status === 'fulfilled') setRecentlyViewed(recentlyRes.value.items);

        // Nearby load (best effort)
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              try {
                const nearby = await getNearbyBusinesses({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                if (!live) return;
                // Inject nearby into featured if user hasn't searched
                if (!query.trim()) setFeatured(nearby.items);
              } catch {
                // ignore
              }
            },
            () => undefined,
            { timeout: 4000 },
          );
        }
      })
      .finally(() => live && setLoading(false));

    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = async () => {
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    try {
      const result = await searchBusinesses(q, { sortBy: 'relevance' });
      // Put search results into trending to make it visible immediately.
      setTrending(result.items);
      setPopular(result.items);
      setRecentlyViewed((prev) => (prev.length ? prev : result.items));
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerShell
      query={query}
      setQuery={setQuery}
      onSearch={onSearch}
      loading={loading}
      suggestions={suggestions}
      recentlyViewed={recentlyViewed}
      featured={featured}
      trending={trending}
      popular={popular}
      onQuickPreview={(b) => setQuickPreview(b)}
      quickPreview={quickPreview}
    />
  );
}


