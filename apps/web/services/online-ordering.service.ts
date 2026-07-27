/**
 * Online Food Ordering Platform Service
 * Handles all restaurant discovery, ordering, delivery tracking, coupons, etc.
 */

import api from './api';
import { unwrap } from './helpers';

// ============================================
// TYPES / INTERFACES
// ============================================

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  cuisine?: string[];
  rating: number;
  reviewCount: number;
  deliveryTime: number; // minutes
  deliveryCharge: number;
  minOrderValue: number;
  isOpen: boolean;
  latitude?: number;
  longitude?: number;
  address?: string;
  phone?: string;
  offerPercentage?: number;
  tags?: string[];
  preparationTime?: number;
  hasHomeDelivery: boolean;
}

export interface SearchFilters {
  search?: string;
  cuisine?: string[];
  sortBy?: 'rating' | 'deliveryTime' | 'price' | 'relevance';
  minRating?: number;
  maxDeliveryTime?: number;
  minOrderValue?: number;
  hasOffer?: boolean;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
}

export interface MenuItem {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: string;
  isVeg: boolean;
  rating?: number;
  isAvailable: boolean;
  prepTime?: number;
  addons?: MenuAddon[];
  variants?: MenuVariant[];
}

export interface MenuAddon {
  id: string;
  name: string;
  price: number;
  isRequired?: boolean;
}

export interface MenuVariant {
  id: string;
  name: string;
  priceDelta: number;
}

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount?: number;
  expiresAt: string;
  isActive: boolean;
  applicableRestaurants?: string[]; // if empty, apply to all
}

export interface CartItem {
  menuItemId: string;
  quantity: number;
  specialInstructions?: string;
  selectedAddons?: { addonId: string; quantity?: number }[];
  selectedVariant?: string;
}

export interface OrderItem extends CartItem {
  name: string;
  price: number;
}

export interface Order {
  id: string;
  tenantId: string;
  customerId: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  couponCode?: string;
  tax: number;
  total: number;
  paymentMethod: 'online' | 'cash';
  deliveryAddress: DeliveryAddress;
  orderStatus: 'pending' | 'accepted' | 'preparing' | 'ready' | 'picked_up' | 'in_delivery' | 'delivered' | 'cancelled';
  createdAt: string;
  acceptedAt?: string;
  readyAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  cancellationReason?: string;
  refundAmount?: number;
  penaltyCharge?: number;
  deliveryPartner?: DeliveryPartner;
  rating?: number;
  review?: string;
  feedbackGiven: boolean;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  instructions?: string;
}

export interface OrderTracking {
  orderId: string;
  status: Order['orderStatus'];
  currentLocation?: { latitude: number; longitude: number };
  estimatedDeliveryTime?: string;
  deliveryPartner?: DeliveryPartner;
  timeline: {
    status: string;
    timestamp: string;
    location?: { latitude: number; longitude: number };
  }[];
}

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  rating: number;
  imageUrl?: string;
  vehicleType: 'bike' | 'car' | 'bicycle';
  currentLocation?: { latitude: number; longitude: number };
}

export interface TableBooking {
  id: string;
  tenantId: string;
  customerId: string;
  guestCount: number;
  bookingDate: string;
  bookingTime: string;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface EventBooking {
  id: string;
  tenantId: string;
  customerId: string;
  eventType: 'birthday' | 'anniversary' | 'wedding' | 'corporate' | 'other';
  eventDate: string;
  guestCount: number;
  budget: number;
  decorationPreferences?: string[];
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface DecorationPackage {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  decorationItems?: string[];
}

// ============================================
// RESTAURANT DISCOVERY & SEARCH
// ============================================

export const searchRestaurants = async (filters: SearchFilters): Promise<Restaurant[]> => {
  return unwrap<Restaurant[]>(
    api.get('/public/restaurants/search', { params: filters })
  );
};

export const getRestaurantDetail = async (restaurantSlug: string): Promise<Restaurant> => {
  return unwrap<Restaurant>(
    api.get(`/public/restaurants/${restaurantSlug}/detail`)
  );
};

export const getFeaturedRestaurants = async (): Promise<Restaurant[]> => {
  return unwrap<Restaurant[]>(
    api.get('/public/restaurants/featured')
  );
};

export const getRestaurantsByOffering = async (): Promise<Restaurant[]> => {
  return unwrap<Restaurant[]>(
    api.get('/public/restaurants/with-offers')
  );
};

export const getRestaurantsCuisine = async (cuisine: string): Promise<Restaurant[]> => {
  return unwrap<Restaurant[]>(
    api.get(`/public/restaurants/cuisine/${cuisine}`)
  );
};

// ============================================
// MENU & ITEMS
// ============================================

export const getRestaurantMenu = async (restaurantSlug: string): Promise<MenuItem[]> => {
  return unwrap<MenuItem[]>(
    api.get(`/public/restaurants/${restaurantSlug}/menu`)
  );
};

export const getMenuCategories = async (restaurantSlug: string): Promise<string[]> => {
  return unwrap<string[]>(
    api.get(`/public/restaurants/${restaurantSlug}/categories`)
  );
};

export const searchMenuItems = async (restaurantSlug: string, query: string): Promise<MenuItem[]> => {
  return unwrap<MenuItem[]>(
    api.get(`/public/restaurants/${restaurantSlug}/menu/search`, { params: { q: query } })
  );
};

export const getMenuItemDetail = async (restaurantSlug: string, itemId: string): Promise<MenuItem> => {
  return unwrap<MenuItem>(
    api.get(`/public/restaurants/${restaurantSlug}/menu/${itemId}`)
  );
};

// ============================================
// ORDERS
// ============================================

export interface CreateOrderPayload {
  tenantId: string;
  customerId?: string;
  items: CartItem[];
  deliveryAddress: DeliveryAddress;
  paymentMethod: 'online' | 'cash';
  couponCode?: string;
  specialInstructions?: string;
}

export const createOrder = async (data: CreateOrderPayload): Promise<Order> => {
  return unwrap<Order>(
    api.post('/orders', data)
  );
};

export const getOrder = async (orderId: string): Promise<Order> => {
  return unwrap<Order>(
    api.get(`/orders/${orderId}`)
  );
};

export const getOrderHistory = async (customerId: string, limit = 10, offset = 0): Promise<Order[]> => {
  return unwrap<Order[]>(
    api.get(`/orders/customer/${customerId}`, { params: { limit, offset } })
  );
};

export const trackOrder = async (orderId: string): Promise<OrderTracking> => {
  return unwrap<OrderTracking>(
    api.get(`/orders/${orderId}/tracking`)
  );
};

export interface CancelOrderPayload {
  orderId: string;
  reason: string;
  isAfterPreparation?: boolean;
}

export const cancelOrder = async (data: CancelOrderPayload): Promise<{ success: boolean; refundAmount: number; penaltyCharge?: number }> => {
  return unwrap<{ success: boolean; refundAmount: number; penaltyCharge?: number }>(
    api.post(`/orders/${data.orderId}/cancel`, data)
  );
};

export interface RequestCancellationPayload {
  orderId: string;
  reason: string;
}

export const requestOrderCancellation = async (data: RequestCancellationPayload): Promise<{ success: boolean; message: string }> => {
  return unwrap<{ success: boolean; message: string }>(
    api.post(`/orders/${data.orderId}/request-cancellation`, data)
  );
};

export interface FeedbackPayload {
  orderId: string;
  rating: number;
  review?: string;
  deliveryPartnerRating?: number;
  deliveryPartnerReview?: string;
}

export const submitOrderFeedback = async (data: FeedbackPayload): Promise<{ success: boolean }> => {
  return unwrap<{ success: boolean }>(
    api.post(`/orders/${data.orderId}/feedback`, data)
  );
};

// ============================================
// COUPONS & OFFERS
// ============================================

export const getAvailableCoupons = async (): Promise<Coupon[]> => {
  return unwrap<Coupon[]>(
    api.get('/coupons')
  );
};

export const validateCoupon = async (couponCode: string, tenantId?: string, orderValue?: number): Promise<{ valid: boolean; discount: number; message: string }> => {
  return unwrap<{ valid: boolean; discount: number; message: string }>(
    api.post('/coupons/validate', { couponCode, tenantId, orderValue })
  );
};

export const applyCoupon = async (orderId: string, couponCode: string): Promise<{ success: boolean; newTotal: number; discount: number }> => {
  return unwrap<{ success: boolean; newTotal: number; discount: number }>(
    api.post(`/orders/${orderId}/apply-coupon`, { couponCode })
  );
};

// ============================================
// TABLE BOOKING
// ============================================

export interface BookTablePayload {
  tenantId: string;
  customerId?: string;
  guestCount: number;
  bookingDate: string;
  bookingTime: string;
  customerName?: string;
  customerPhone?: string;
  specialRequests?: string;
}

export const bookTable = async (data: BookTablePayload): Promise<TableBooking> => {
  return unwrap<TableBooking>(
    api.post('/table-bookings', data)
  );
};

export const getTableBookings = async (customerId: string): Promise<TableBooking[]> => {
  return unwrap<TableBooking[]>(
    api.get(`/table-bookings/customer/${customerId}`)
  );
};

export const getAvailableTables = async (tenantId: string, date: string, time: string, guestCount: number): Promise<any[]> => {
  return unwrap<any[]>(
    api.get(`/restaurants/${tenantId}/available-tables`, { params: { date, time, guestCount } })
  );
};

export const cancelTableBooking = async (bookingId: string, reason?: string): Promise<{ success: boolean }> => {
  return unwrap<{ success: boolean }>(
    api.post(`/table-bookings/${bookingId}/cancel`, { reason })
  );
};

// ============================================
// EVENT BOOKING
// ============================================

export interface BookEventPayload {
  tenantId: string;
  customerId?: string;
  eventType: EventBooking['eventType'];
  eventDate: string;
  guestCount: number;
  budget: number;
  decorationPackageIds?: string[];
  specialRequests?: string;
  customerName?: string;
  customerPhone?: string;
}

export const bookEvent = async (data: BookEventPayload): Promise<EventBooking> => {
  return unwrap<EventBooking>(
    api.post('/event-bookings', data)
  );
};

export const getEventBookings = async (customerId: string): Promise<EventBooking[]> => {
  return unwrap<EventBooking[]>(
    api.get(`/event-bookings/customer/${customerId}`)
  );
};

export const getDecorationPackages = async (tenantId: string): Promise<DecorationPackage[]> => {
  return unwrap<DecorationPackage[]>(
    api.get(`/restaurants/${tenantId}/decoration-packages`)
  );
};

export const getEventPackages = async (tenantId: string, eventType: string): Promise<any[]> => {
  return unwrap<any[]>(
    api.get(`/restaurants/${tenantId}/event-packages`, { params: { eventType } })
  );
};

export const cancelEventBooking = async (bookingId: string, reason?: string): Promise<{ success: boolean; refundAmount: number }> => {
  return unwrap<{ success: boolean; refundAmount: number }>(
    api.post(`/event-bookings/${bookingId}/cancel`, { reason })
  );
};

// ============================================
// DELIVERY PARTNER (PUBLIC)
// ============================================

export interface CreateDeliveryPartnerPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  aadharNumber: string;
  panNumber: string;
  vehicleType: 'bike' | 'car' | 'bicycle';
  vehicleNumber: string;
  bankAccountNumber: string;
  ifscCode: string;
  latitude: number;
  longitude: number;
}

export const registerDeliveryPartner = async (data: CreateDeliveryPartnerPayload): Promise<{ id: string; message: string }> => {
  return unwrap<{ id: string; message: string }>(
    api.post('/delivery-partners/register', data)
  );
};

export const uploadDeliveryPartnerDocuments = async (partnerId: string, documents: FormData): Promise<{ success: boolean; verificationStatus: string }> => {
  return unwrap<{ success: boolean; verificationStatus: string }>(
    api.post(`/delivery-partners/${partnerId}/upload-documents`, documents, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  );
};

export const getDeliveryPartnerStatus = async (partnerId: string): Promise<{ verificationStatus: string; isActive: boolean; documentsVerified: string[] }> => {
  return unwrap<{ verificationStatus: string; isActive: boolean; documentsVerified: string[] }>(
    api.get(`/delivery-partners/${partnerId}/status`)
  );
};

export const getAvailableDeliveries = async (latitude: number, longitude: number, radiusKm?: number): Promise<any[]> => {
  return unwrap<any[]>(
    api.get('/delivery-partners/available-orders', { params: { latitude, longitude, radiusKm } })
  );
};

export interface AcceptDeliveryPayload {
  orderId: string;
  deliveryPartnerId: string;
  estimatedPickupTime: number; // minutes
}

export const acceptDelivery = async (data: AcceptDeliveryPayload): Promise<{ success: boolean; order: Order }> => {
  return unwrap<{ success: boolean; order: Order }>(
    api.post('/delivery-partners/accept-delivery', data)
  );
};

export interface UpdateDeliveryLocationPayload {
  orderId: string;
  latitude: number;
  longitude: number;
  status?: 'en_route_to_pickup' | 'arrived_at_pickup' | 'picked_up' | 'en_route_to_delivery' | 'delivered';
}

export const updateDeliveryLocation = async (data: UpdateDeliveryLocationPayload): Promise<{ success: boolean }> => {
  return unwrap<{ success: boolean }>(
    api.post('/delivery-partners/update-location', data)
  );
};

export const getDeliveryPartnerEarnings = async (partnerId: string, period?: 'daily' | 'weekly' | 'monthly'): Promise<{ totalEarnings: number; completedDeliveries: number; details: any[] }> => {
  return unwrap<{ totalEarnings: number; completedDeliveries: number; details: any[] }>(
    api.get(`/delivery-partners/${partnerId}/earnings`, { params: { period } })
  );
};

export interface GetDeliveryPricePayload {
  restaurantLatitude: number;
  restaurantLongitude: number;
  deliveryLatitude: number;
  deliveryLongitude: number;
}

export const calculateDeliveryPrice = async (data: GetDeliveryPricePayload): Promise<{ basePricePerKm: number; distance: number; totalPrice: number; estimatedTime: number }> => {
  return unwrap<{ basePricePerKm: number; distance: number; totalPrice: number; estimatedTime: number }>(
    api.post('/delivery/calculate-price', data)
  );
};

export const completeDelivery = async (orderId: string, latitude: number, longitude: number): Promise<{ success: boolean; earnings: number }> => {
  return unwrap<{ success: boolean; earnings: number }>(
    api.post(`/delivery-partners/complete-delivery/${orderId}`, { latitude, longitude })
  );
};

export const rejectDelivery = async (orderId: string, reason?: string): Promise<{ success: boolean }> => {
  return unwrap<{ success: boolean }>(
    api.post(`/delivery-partners/reject-delivery/${orderId}`, { reason })
  );
};

// ============================================
// RATING & REVIEWS
// ============================================

export interface RateRestaurantPayload {
  tenantId: string;
  rating: number;
  review?: string;
}

export const rateRestaurant = async (data: RateRestaurantPayload): Promise<{ success: boolean }> => {
  return unwrap<{ success: boolean }>(
    api.post('/ratings/restaurant', data)
  );
};

export const getRestaurantReviews = async (tenantId: string, limit = 5, offset = 0): Promise<any[]> => {
  return unwrap<any[]>(
    api.get(`/restaurants/${tenantId}/reviews`, { params: { limit, offset } })
  );
};

// ============================================
// REFUND & RETURNS
// ============================================

export interface InitiateReturnPayload {
  orderId: string;
  reason: string;
  images?: string[];
}

export const initiateReturn = async (data: InitiateReturnPayload): Promise<{ returnId: string; status: string; message: string }> => {
  return unwrap<{ returnId: string; status: string; message: string }>(
    api.post('/returns/initiate', data)
  );
};

export const getReturnStatus = async (returnId: string): Promise<any> => {
  return unwrap<any>(
    api.get(`/returns/${returnId}/status`)
  );
};

export interface ProcessRefundPayload {
  returnId: string;
  refundAmount: number;
  reason: string;
}

export const processRefund = async (data: ProcessRefundPayload): Promise<{ success: boolean; transactionId: string }> => {
  return unwrap<{ success: boolean; transactionId: string }>(
    api.post('/returns/process-refund', data)
  );
};

