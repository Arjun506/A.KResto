'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getAvailableDeliveries,
  getDeliveryPartnerEarnings,
  acceptDelivery,
  updateDeliveryLocation,
  completeDelivery,
  calculateDeliveryPrice,
  type Order,
} from '@/services/online-ordering.service';
import {
  AnimatedButton,
  GlassContainer,
  StatusBadge,
  Alert,
  SkeletonCard,
} from '@/components/common/animated-components';
import {
  Truck,
  MapPin,
  DollarSign,
  TrendingUp,
  Clock,
  Navigation,
  CheckCircle,
  AlertCircle,
  LogOut,
} from 'lucide-react';
import { EmptyState, OfflineState, Badge } from '@business-os/ui';

interface AvailableDelivery {
  id: string;
  restaurantName: string;
  restaurantAddress: string;
  deliveryAddress: string;
  orderValue: number;
  deliveryPrice: number;
  estimatedDistance: number;
  estimatedTime: number;
}

interface EarningsData {
  totalEarnings: number;
  completedDeliveries: number;
  details: {
    date: string;
    earnings: number;
    deliveries: number;
  }[];
}

export default function DeliveryPartnerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'earnings'>('available');
  const [availableDeliveries, setAvailableDeliveries] = useState<AvailableDelivery[]>([]);
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [activeDelivery, setActiveDelivery] = useState<AvailableDelivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Get current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            setCurrentLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          });
        }

        // Load available deliveries
        const deliveries = await getAvailableDeliveries(0, 0, 5); // Default location, 5km radius
        setAvailableDeliveries(deliveries);

        // Load earnings
        const earningsData = await getDeliveryPartnerEarnings('current-partner-id', 'daily');
        setEarnings(earningsData);

        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Refresh available deliveries every 30 seconds
    const interval = setInterval(loadData, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleAcceptDelivery = async (delivery: AvailableDelivery) => {
    try {
      setAccepting(true);
      await acceptDelivery({
        orderId: delivery.id,
        deliveryPartnerId: 'current-partner-id',
        estimatedPickupTime: delivery.estimatedTime,
      });

      setActiveDelivery(delivery);
      setAvailableDeliveries(availableDeliveries.filter((d) => d.id !== delivery.id));
      setActiveTab('active');
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to accept delivery');
    } finally {
      setAccepting(false);
    }
  };

  const handleCompleteDelivery = async () => {
    if (!activeDelivery || !currentLocation) {
      setError('Location not available');
      return;
    }

    try {
      setCompleting(true);
      await completeDelivery(activeDelivery.id, currentLocation.latitude, currentLocation.longitude);

      setActiveDelivery(null);
      setError(null);

      // Show success and reload
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to complete delivery');
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-6 h-6 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Delivery Partner
            </h1>
          </div>
          <AnimatedButton
            variant="secondary"
            size="sm"
            onClick={() => router.push('/login')}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </AnimatedButton>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Error Alert */}
        {error && (
          <Alert
            type="error"
            title="Error"
            message={error}
            onClose={() => setError(null)}
          />
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <GlassContainer>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Earnings</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  ₹{earnings?.totalEarnings.toFixed(2) || '0.00'}
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </GlassContainer>

          <GlassContainer>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Deliveries Completed</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {earnings?.completedDeliveries || 0}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </GlassContainer>

          <GlassContainer>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Available Orders</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {availableDeliveries.length}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </GlassContainer>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          {[
            { id: 'available', label: 'Available Orders', icon: '🎯' },
            { id: 'active', label: 'Active Delivery', icon: '🚚' },
            { id: 'earnings', label: 'Earnings', icon: '💰' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                px-6 py-3 rounded-lg font-semibold transition-all duration-300
                flex items-center gap-2
                ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white/10 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-white/20 hover:bg-white/20'
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'available' && (
          <div className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array(4).fill(0).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : availableDeliveries.length === 0 ? (
              <GlassContainer className="text-center py-12">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  No available deliveries in your area right now.
                </p>
                <AnimatedButton
                  variant="primary"
                  onClick={() => window.location.reload()}
                >
                  Refresh
                </AnimatedButton>
              </GlassContainer>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableDeliveries.map((delivery) => (
                  <GlassContainer key={delivery.id} className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {delivery.restaurantName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {delivery.restaurantAddress}
                        </p>
                      </div>
                      <span className="text-xl font-bold text-green-600">
                        ₹{delivery.deliveryPrice}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>{delivery.deliveryAddress}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Navigation className="w-4 h-4" />
                        <span>{delivery.estimatedDistance} km • {delivery.estimatedTime} min</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <DollarSign className="w-4 h-4" />
                        <span>Order Value: ₹{delivery.orderValue}</span>
                      </div>
                    </div>

                    <AnimatedButton
                      variant="primary"
                      onClick={() => handleAcceptDelivery(delivery)}
                      loading={accepting}
                      className="w-full"
                    >
                      <Truck className="w-4 h-4" />
                      Accept Delivery
                    </AnimatedButton>
                  </GlassContainer>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'active' && (
          <div className="space-y-6">
            {!activeDelivery ? (
              <GlassContainer className="text-center py-12">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No active delivery at the moment. Accept an order to get started.
                </p>
              </GlassContainer>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Delivery Details */}
                <div className="lg:col-span-2 space-y-6">
                  <GlassContainer>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      Active Delivery
                    </h2>

                    <div className="space-y-6">
                      {/* Pickup Location */}
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                          📍 Pickup Location
                        </h3>
                        <GlassContainer className="bg-blue-50 dark:bg-blue-900/20">
                          <p className="text-gray-900 dark:text-white">
                            {activeDelivery.restaurantName}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {activeDelivery.restaurantAddress}
                          </p>
                          <AnimatedButton
                            variant="secondary"
                            size="sm"
                            className="mt-3 w-full"
                            onClick={() =>
                              window.open(
                                `https://maps.google.com/?q=${activeDelivery.restaurantAddress}`
                              )
                            }
                          >
                            Navigate
                          </AnimatedButton>
                        </GlassContainer>
                      </div>

                      {/* Delivery Location */}
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                          📦 Delivery Location
                        </h3>
                        <GlassContainer className="bg-green-50 dark:bg-green-900/20">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {activeDelivery.deliveryAddress}
                          </p>
                          <AnimatedButton
                            variant="secondary"
                            size="sm"
                            className="mt-3 w-full"
                            onClick={() =>
                              window.open(
                                `https://maps.google.com/?q=${activeDelivery.deliveryAddress}`
                              )
                            }
                          >
                            Navigate
                          </AnimatedButton>
                        </GlassContainer>
                      </div>

                      {/* Order Details */}
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                          📋 Order Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-white/10 dark:bg-white/5 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Order Value</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              ₹{activeDelivery.orderValue}
                            </p>
                          </div>
                          <div className="p-4 bg-white/10 dark:bg-white/5 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Your Earnings</p>
                            <p className="text-2xl font-bold text-green-600">
                              ₹{activeDelivery.deliveryPrice}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Complete Delivery */}
                      <AnimatedButton
                        variant="primary"
                        onClick={handleCompleteDelivery}
                        loading={completing}
                        className="w-full"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Complete Delivery
                      </AnimatedButton>
                    </div>
                  </GlassContainer>
                </div>

                {/* Map/Status */}
                <GlassContainer>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                    Delivery Progress
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                        ✓
                      </div>
                      <span className="text-gray-900 dark:text-white">Order Picked Up</span>
                    </div>

                    <div className="h-6 w-1 bg-gradient-to-b from-gray-300 to-gray-200 ml-4" />

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
                        •
                      </div>
                      <span className="text-gray-900 dark:text-white">In Transit</span>
                    </div>

                    <div className="h-6 w-1 bg-gray-200 ml-4" />

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center" />
                      <span className="text-gray-600 dark:text-gray-400">Delivered</span>
                    </div>

                    <Alert
                      type="info"
                      title="Location Sharing"
                      message="Customer can see your real-time location on their map."
                    />
                  </div>
                </GlassContainer>
              </div>
            )}
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="space-y-6">
            {earnings ? (
              <>
                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <GlassContainer>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Today's Earnings</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      ₹{earnings.details[0]?.earnings.toFixed(2) || '0.00'}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      {earnings.details[0]?.deliveries || 0} deliveries
                    </p>
                  </GlassContainer>

                  <GlassContainer>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">This Week</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      ₹{earnings.details.reduce((sum, d) => sum + d.earnings, 0).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      {earnings.details.reduce((sum, d) => sum + d.deliveries, 0)} deliveries
                    </p>
                  </GlassContainer>
                </div>

                {/* Earnings History */}
                <GlassContainer>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Daily Breakdown
                  </h3>

                  <div className="space-y-3">
                    {earnings.details.map((day, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-white/5 dark:bg-white/3 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {new Date(day.date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {day.deliveries} deliveries
                          </p>
                        </div>
                        <span className="text-lg font-bold text-green-600">
                          ₹{day.earnings.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </GlassContainer>

                {/* Withdrawal */}
                <GlassContainer>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Withdraw Earnings
                  </h3>

                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm text-green-800 dark:text-green-300">
                        Available to withdraw
                      </p>
                      <p className="text-2xl font-bold text-green-600 mt-2">
                        ₹{earnings.totalEarnings.toFixed(2)}
                      </p>
                    </div>

                    <AnimatedButton
                      variant="primary"
                      className="w-full"
                      onClick={() => alert('Withdrawal feature coming soon!')}
                    >
                      Withdraw to Bank
                    </AnimatedButton>
                  </div>
                </GlassContainer>
              </>
            ) : (
              <GlassContainer className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No earnings data available yet.
                </p>
              </GlassContainer>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

