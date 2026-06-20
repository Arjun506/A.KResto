'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  createOrder,
  validateCoupon,
  applyCoupon,
  type DeliveryAddress,
  type CartItem,
} from '@/services/online-ordering.service';
import {
  AnimatedButton,
  GlassContainer,
  Alert,
  AnimatedPopup,
} from '@/components/common/animated-components';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Truck,
  Percent,
  CreditCard,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

interface CheckoutFormData {
  customerName: string;
  customerPhone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  specialInstructions: string;
  paymentMethod: 'online' | 'cash';
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const restaurantSlug = searchParams.get('restaurant');
  const itemsParam = searchParams.get('items');

  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showOrdersummary, setShowOrderSummary] = useState(true);

  const [formData, setFormData] = useState<CheckoutFormData>({
    customerName: '',
    customerPhone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    specialInstructions: '',
    paymentMethod: 'online',
  });

  // Parse cart from URL
  useEffect(() => {
    if (itemsParam) {
      try {
        const decodedItems = JSON.parse(atob(itemsParam));
        setCart(decodedItems);
      } catch (err) {
        console.error('Error parsing cart:', err);
        setError('Invalid cart data');
      }
    }
  }, [itemsParam]);

  const handleFormChange = (field: keyof CheckoutFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    try {
      setValidatingCoupon(true);
      setError(null);

      const result = await validateCoupon(couponCode, '', subtotal);

      if (result.valid) {
        setAppliedCoupon({ code: couponCode, discount: result.discount });
        setDiscountAmount(result.discount);
        setSuccess('Coupon applied successfully!');
        setCouponCode('');
      } else {
        setError(result.message || 'Invalid coupon code');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to validate coupon');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = 50; // Default delivery charge
  const tax = Math.round((subtotal * 0.05) * 100) / 100; // 5% tax
  const total = subtotal + deliveryCharge + tax - discountAmount;

  const handleSubmitOrder = async () => {
    // Validate form
    if (!formData.customerName || !formData.customerPhone) {
      setError('Please enter your name and phone number');
      return;
    }

    if (!formData.street || !formData.city || !formData.state || !formData.zipCode) {
      setError('Please enter your complete address');
      return;
    }

    if (cart.length === 0) {
      setError('Cart is empty');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const deliveryAddress: DeliveryAddress = {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        latitude: 0, // Would come from geocoding in real app
        longitude: 0,
        instructions: formData.specialInstructions,
      };

      const order = await createOrder({
        restaurantId: restaurantSlug || '',
        items: cart,
        deliveryAddress,
        paymentMethod: formData.paymentMethod,
        couponCode: appliedCoupon?.code,
        specialInstructions: formData.specialInstructions,
      });

      setSuccess('Order placed successfully!');

      // Redirect to order tracking
      setTimeout(() => {
        router.push(`/order/${order.id}`);
      }, 2000);
    } catch (err: any) {
      console.error('Error placing order:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Checkout
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Alerts */}
            {error && (
              <Alert
                type="error"
                title="Error"
                message={error}
                onClose={() => setError(null)}
              />
            )}
            {success && (
              <Alert
                type="success"
                title="Success"
                message={success}
                onClose={() => setSuccess(null)}
              />
            )}

            {/* Delivery Address */}
            <GlassContainer>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-600" />
                Delivery Address
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.customerName}
                    onChange={(e) => handleFormChange('customerName', e.target.value)}
                    className="bg-white/10 dark:bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.customerPhone}
                    onChange={(e) => handleFormChange('customerPhone', e.target.value)}
                    className="bg-white/10 dark:bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Street Address"
                  value={formData.street}
                  onChange={(e) => handleFormChange('street', e.target.value)}
                  className="w-full bg-white/10 dark:bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => handleFormChange('city', e.target.value)}
                    className="bg-white/10 dark:bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => handleFormChange('state', e.target.value)}
                    className="bg-white/10 dark:bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Zip Code"
                  value={formData.zipCode}
                  onChange={(e) => handleFormChange('zipCode', e.target.value)}
                  className="w-full bg-white/10 dark:bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />

                <textarea
                  placeholder="Special instructions (optional)"
                  value={formData.specialInstructions}
                  onChange={(e) => handleFormChange('specialInstructions', e.target.value)}
                  rows={3}
                  className="w-full bg-white/10 dark:bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>
            </GlassContainer>

            {/* Payment Method */}
            <GlassContainer>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-600" />
                Payment Method
              </h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-white/20 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                  <input
                    type="radio"
                    value="online"
                    checked={formData.paymentMethod === 'online'}
                    onChange={(e) => handleFormChange('paymentMethod', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="font-medium text-gray-900 dark:text-white">
                    Online Payment (Card/UPI)
                  </span>
                </label>

                <label className="flex items-center gap-3 p-4 border border-white/20 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                  <input
                    type="radio"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={(e) => handleFormChange('paymentMethod', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="font-medium text-gray-900 dark:text-white">
                    Cash on Delivery
                  </span>
                </label>
              </div>
            </GlassContainer>

            {/* Coupons */}
            <GlassContainer>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Percent className="w-5 h-5 text-purple-600" />
                Coupons & Offers
              </h2>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 bg-white/10 dark:bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
                <AnimatedButton
                  variant="primary"
                  onClick={handleValidateCoupon}
                  loading={validatingCoupon}
                >
                  Apply
                </AnimatedButton>
              </div>

              {appliedCoupon && (
                <div className="p-4 bg-green-100/20 border border-green-300/50 rounded-lg">
                  <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                    ✓ Coupon "{appliedCoupon.code}" applied!
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Discount: ₹{appliedCoupon.discount}
                  </p>
                </div>
              )}
            </GlassContainer>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <GlassContainer className="sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 max-h-64 overflow-y-auto mb-6">
                {cart.map((item) => (
                  <div
                    key={item.menuItemId}
                    className="flex justify-between items-start pb-4 border-b border-white/20 dark:border-white/10"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-white/20 dark:border-white/10">
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Subtotal:</span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Delivery Charge:</span>
                  <span>₹{deliveryCharge}</span>
                </div>

                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Tax (5%):</span>
                  <span>₹{tax}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Discount:</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-3 border-t border-white/20 dark:border-white/10">
                  <span>Total:</span>
                  <span>₹{Math.round(total * 100) / 100}</span>
                </div>

                <AnimatedButton
                  variant="primary"
                  onClick={handleSubmitOrder}
                  loading={loading}
                  className="w-full mt-6"
                >
                  <DollarSign className="w-4 h-4" />
                  Place Order
                </AnimatedButton>
              </div>
            </GlassContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
