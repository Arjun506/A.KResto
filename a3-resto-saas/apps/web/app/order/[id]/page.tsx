'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  trackOrder,
  submitOrderFeedback,
  getOrder,
  requestOrderCancellation,
  type Order,
  type OrderTracking,
} from '@/services/online-ordering.service';
import {
  AnimatedButton,
  GlassContainer,
  StatusBadge,
  OrderTimeline,
  DeliveryPartnerCard,
  Alert,
  AnimatedPopup,
} from '@/components/common/animated-components';
import {
  ArrowLeft,
  MapPin,
  Phone,
  MessageCircle,
  Star,
  Clock,
  DollarSign,
  Share2,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export default function OrderTrackingPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [tracking, setTracking] = useState<OrderTracking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCancelRequest, setShowCancelRequest] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    rating: 5,
    review: '',
    deliveryPartnerRating: 5,
    deliveryPartnerReview: '',
  });
  const [cancellationReason, setCancellationReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load order and tracking data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [orderData, trackingData] = await Promise.all([
          getOrder(orderId),
          trackOrder(orderId),
        ]);

        setOrder(orderData);
        setTracking(trackingData);
        setError(null);
      } catch (err) {
        console.error('Error loading order:', err);
        setError('Failed to load order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Poll for updates every 5 seconds
    const interval = setInterval(loadData, 5000);

    return () => clearInterval(interval);
  }, [orderId]);

  const handleSubmitFeedback = async () => {
    try {
      setSubmitting(true);
      await submitOrderFeedback({
        orderId,
        ...feedbackData,
      });
      setShowFeedback(false);
      setError(null);
      // Reload order
      const updatedOrder = await getOrder(orderId);
      setOrder(updatedOrder);
    } catch (err: any) {
      setError(err.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancellationRequest = async () => {
    if (!cancellationReason.trim()) {
      setError('Please provide a reason for cancellation');
      return;
    }

    try {
      setSubmitting(true);
      await requestOrderCancellation({
        orderId,
        reason: cancellationReason,
      });
      setShowCancelRequest(false);
      setCancellationReason('');
      setError(null);
      // Reload order
      const updatedOrder = await getOrder(orderId);
      setOrder(updatedOrder);
    } catch (err: any) {
      setError(err.message || 'Failed to request cancellation');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 px-4 py-8 flex items-center justify-center">
        <GlassContainer className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Error
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <AnimatedButton
            variant="primary"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </AnimatedButton>
        </GlassContainer>
      </div>
    );
  }

  if (!order || !tracking) {
    return null;
  }

  const isDelivered = order.orderStatus === 'delivered';
  const isCancelled = order.orderStatus === 'cancelled';
  const canRequestCancellation = !['preparing', 'picked_up', 'in_delivery', 'delivered', 'cancelled'].includes(order.orderStatus);
  const canProvideFeedback = isDelivered && !order.feedbackGiven;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <Share2 className="w-6 h-6 text-gray-900 dark:text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <Alert
            type="error"
            title="Error"
            message={error}
            onClose={() => setError(null)}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Status and Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <GlassContainer>
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isDelivered ? 'Order Delivered' : isCancelled ? 'Order Cancelled' : 'Order Status'}
                  </h2>
                  <StatusBadge status={order.orderStatus} />
                </div>

                {/* Status Animation */}
                <div className="relative h-20">
                  <div className="absolute inset-0 flex items-center justify-between">
                    {[
                      { label: 'Pending', status: 'pending' },
                      { label: 'Accepted', status: 'accepted' },
                      { label: 'Preparing', status: 'preparing' },
                      { label: 'Picked Up', status: 'picked_up' },
                      { label: 'Delivering', status: 'in_delivery' },
                      { label: 'Delivered', status: 'delivered' },
                    ].map((step, index) => (
                      <div key={step.status} className="flex flex-col items-center flex-1">
                        <div
                          className={`
                            w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                            ${['pending', 'accepted', 'preparing', 'picked_up', 'in_delivery', 'delivered'].indexOf(order.orderStatus) >= index
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                              : 'bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white'
                            }
                          `}
                        >
                          {['pending', 'accepted', 'preparing', 'picked_up', 'in_delivery', 'delivered'].indexOf(order.orderStatus) > index ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* Progress bar */}
                  <div className="absolute top-3 left-0 right-0 h-1 bg-gray-300 dark:bg-gray-600 rounded-full">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          (
                            ['pending', 'accepted', 'preparing', 'picked_up', 'in_delivery', 'delivered'].indexOf(
                              order.orderStatus
                            ) / 5
                          ) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </GlassContainer>

            {/* Delivery Partner */}
            {order.deliveryPartner && order.orderStatus !== 'cancelled' && (
              <GlassContainer>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Delivery Partner
                </h3>

                <DeliveryPartnerCard
                  name={order.deliveryPartner.name}
                  rating={order.deliveryPartner.rating}
                  image={order.deliveryPartner.imageUrl}
                  vehicle={order.deliveryPartner.vehicleType}
                />

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <AnimatedButton
                    variant="secondary"
                    onClick={() => window.open(`tel:${order.deliveryPartner?.phone}`)}
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </AnimatedButton>
                  <AnimatedButton
                    variant="secondary"
                    onClick={() => {}}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </AnimatedButton>
                </div>
              </GlassContainer>
            )}

            {/* Timeline */}
            {tracking.timeline && (
              <OrderTimeline
                events={tracking.timeline}
                currentStatus={order.orderStatus}
              />
            )}
          </div>

          {/* Order Summary and Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Summary */}
            <GlassContainer>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-white/20 dark:border-white/10">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ₹{(item.quantity * item.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-white/20 dark:border-white/10">
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Subtotal:</span>
                  <span className="text-gray-900 dark:text-white">₹{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Delivery:</span>
                  <span className="text-gray-900 dark:text-white">₹{order.deliveryCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Tax:</span>
                  <span className="text-gray-900 dark:text-white">₹{order.tax.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Discount:</span>
                    <span>-₹{order.discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                <span>Total:</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
            </GlassContainer>

            {/* Actions */}
            <GlassContainer className="space-y-3">
              {canProvideFeedback && (
                <AnimatedButton
                  variant="primary"
                  onClick={() => setShowFeedback(true)}
                  className="w-full"
                >
                  <Star className="w-4 h-4" />
                  Rate Order
                </AnimatedButton>
              )}

              {canRequestCancellation && (
                <AnimatedButton
                  variant="danger"
                  onClick={() => setShowCancelRequest(true)}
                  className="w-full"
                >
                  <XCircle className="w-4 h-4" />
                  Request Cancellation
                </AnimatedButton>
              )}

              {isDelivered && (
                <AnimatedButton
                  variant="secondary"
                  onClick={() => router.push('/orders')}
                  className="w-full"
                >
                  View More Orders
                </AnimatedButton>
              )}
            </GlassContainer>
          </div>
        </div>
      </div>

      {/* Feedback Popup */}
      <AnimatedPopup
        isOpen={showFeedback}
        title="Rate Your Order"
        onClose={() => setShowFeedback(false)}
        actions={
          <>
            <AnimatedButton
              variant="secondary"
              onClick={() => setShowFeedback(false)}
              className="w-full"
            >
              Cancel
            </AnimatedButton>
            <AnimatedButton
              variant="primary"
              onClick={handleSubmitFeedback}
              loading={submitting}
              className="w-full"
            >
              Submit Feedback
            </AnimatedButton>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Order Rating: {feedbackData.rating} ⭐
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={feedbackData.rating}
              onChange={(e) => setFeedbackData({ ...feedbackData, rating: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <textarea
            placeholder="Tell us about your order..."
            value={feedbackData.review}
            onChange={(e) => setFeedbackData({ ...feedbackData, review: e.target.value })}
            rows={3}
            className="w-full bg-white/10 dark:bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Delivery Partner Rating: {feedbackData.deliveryPartnerRating} ⭐
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={feedbackData.deliveryPartnerRating}
              onChange={(e) =>
                setFeedbackData({ ...feedbackData, deliveryPartnerRating: parseInt(e.target.value) })
              }
              className="w-full"
            />
          </div>

          <textarea
            placeholder="Tell us about the delivery partner..."
            value={feedbackData.deliveryPartnerReview}
            onChange={(e) => setFeedbackData({ ...feedbackData, deliveryPartnerReview: e.target.value })}
            rows={2}
            className="w-full bg-white/10 dark:bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
        </div>
      </AnimatedPopup>

      {/* Cancellation Request Popup */}
      <AnimatedPopup
        isOpen={showCancelRequest}
        title="Request Cancellation"
        onClose={() => setShowCancelRequest(false)}
        actions={
          <>
            <AnimatedButton
              variant="secondary"
              onClick={() => setShowCancelRequest(false)}
              className="w-full"
            >
              Keep Order
            </AnimatedButton>
            <AnimatedButton
              variant="danger"
              onClick={handleCancellationRequest}
              loading={submitting}
              className="w-full"
            >
              Request Cancellation
            </AnimatedButton>
          </>
        }
      >
        <div className="space-y-4">
          <Alert
            type="warning"
            title="Note"
            message="Your request will be sent to the restaurant. They may approve or reject it."
          />

          <textarea
            placeholder="Reason for cancellation..."
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            rows={4}
            className="w-full bg-white/10 dark:bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
        </div>
      </AnimatedPopup>
    </div>
  );
}
