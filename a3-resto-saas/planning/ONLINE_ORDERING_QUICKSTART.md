# A3 Resto - Online Food Ordering Platform Quick Start Guide

## 🚀 Getting Started

### Customer Features - Where to Find Them

#### 1. **Home Page - Search & Discover**
- **URL:** `/online-ordering`
- **What it does:**
  - Search for restaurants and dishes
  - Browse featured restaurants
  - Filter by cuisine (North Indian, Chinese, Continental, etc.)
  - View special offers
  - See top-rated establishments

#### 2. **Restaurant Menu & Details**
- **URL:** `/restaurant/[slug]`
- **Example:** `/restaurant/pizza-palace`
- **Features:**
  - Restaurant information (ratings, delivery time, charges)
  - Complete menu with categories
  - Search within menu
  - Add items to cart with quantity management
  - Real-time cart total calculation

#### 3. **Shopping Cart & Checkout**
- **URL:** `/checkout`
- **Features:**
  - Review selected items
  - Enter delivery address
  - Choose payment method (online/cash)
  - Apply coupons for discounts
  - Place order with confirmation

#### 4. **Order Tracking - Live Updates**
- **URL:** `/order/[orderId]`
- **Example:** `/order/clh5x1q8r0000qz9l8h5k8r9l`
- **Features:**
  - Real-time order status (6-stage progression)
  - Delivery partner details with contact
  - Visual timeline of order events
  - GPS-based delivery tracking
  - Rate order and delivery partner
  - Request cancellation from restaurant
  - Track delivery boy location

---

### Delivery Partner Features - Getting Started

#### 1. **Registration & Signup**
- **URL:** `/delivery-partner/signup`
- **4-Step Process:**
  1. Personal Info (Name, Email, Phone, Password)
  2. Government Documents (Aadhar, PAN)
  3. Vehicle Details (Type & Registration)
  4. Bank Account (For earnings transfer)

#### 2. **Document Verification**
- **URL:** `/delivery-partner/verify/[partnerId]`
- **After registration:**
  - Upload clear photos of documents
  - Verify identity with KYC
  - Wait for approval (typically 1-2 hours)

#### 3. **Delivery Dashboard**
- **URL:** `/delivery-partner/dashboard`
- **Three Main Tabs:**

**Available Orders Tab (🎯)**
- View nearby delivery requests
- See pickup and delivery locations
- Check delivery fee (per km rate)
- Accept orders with one click

**Active Delivery Tab (🚚)**
- Current delivery in progress
- Navigation to pickup location
- Navigation to delivery location
- Real-time tracking updates
- Complete delivery button

**Earnings Tab (💰)**
- Total earnings summary
- Daily breakdown
- Weekly statistics
- Delivery count per day
- Withdraw earnings to bank

---

## 🎨 UI/UX Highlights

### Design Features
✨ **Glass Morphism** - Modern frosted glass effect containers  
✨ **Smooth Animations** - 300ms transitions throughout  
✨ **Gradient Backgrounds** - Purple to blue to pink theme  
✨ **Dark Mode Support** - Full dark theme available  
✨ **Responsive Design** - Mobile, tablet, and desktop  
✨ **Accessibility** - Keyboard navigation, color contrast  

### Color Scheme
- **Primary:** Purple & Blue (`from-purple-600 to-blue-600`)
- **Success:** Green (`bg-green-600`)
- **Pending:** Yellow (`bg-yellow-600`)
- **Active:** Blue (`bg-blue-600`)
- **Delivered:** Emerald (`bg-emerald-600`)
- **Cancelled:** Red (`bg-red-600`)

---

## 💻 Component Examples

### Using the UI Components

```tsx
// Import components
import {
  AnimatedButton,
  GlassContainer,
  MenuItemCard,
  StatusBadge,
  Alert,
} from '@/components/common/animated-components';

// Create a button
<AnimatedButton 
  variant="primary" 
  onClick={handleClick}
>
  Place Order
</AnimatedButton>

// Status indicator
<StatusBadge status="in_delivery" />

// Show alert
<Alert 
  type="success" 
  title="Order placed!" 
  message="Your food will arrive in 30 mins"
/>

// Card container
<GlassContainer>
  <p>Your content here with glass effect</p>
</GlassContainer>
```

---

## 📡 API Integration

### Service Methods Available

```tsx
import {
  searchRestaurants,
  getRestaurantDetail,
  getRestaurantMenu,
  createOrder,
  trackOrder,
  submitOrderFeedback,
  getAvailableCoupons,
  validateCoupon,
  getAvailableDeliveries,
  acceptDelivery,
  completeDelivery,
  getDeliveryPartnerEarnings,
} from '@/services/online-ordering.service';

// Example usage
const restaurants = await searchRestaurants({
  search: 'pizza',
  cuisine: ['Italian'],
  maxDeliveryTime: 30,
});

const order = await createOrder({
  restaurantId: 'rest-123',
  items: [{ menuItemId: 'item-1', quantity: 2 }],
  deliveryAddress: { ... },
  paymentMethod: 'online',
});

const tracking = await trackOrder(order.id);
```

---

## 📱 Mobile Optimization

All pages are fully responsive:
- **Mobile:** Stacked layout, thumb-friendly buttons
- **Tablet:** 2-column grids
- **Desktop:** 3-4 column grids with full features

---

## 🔐 Authentication Flow

1. **Customer Login** → `/login`
2. **Delivery Partner Signup** → `/delivery-partner/signup`
3. **Document Verification** → `/delivery-partner/verify`
4. **Dashboard Access** → `/delivery-partner/dashboard`

---

## 📊 Data Flow

### Order Creation
```
Search Restaurants 
  ↓
View Menu
  ↓
Add to Cart
  ↓
Checkout (Apply Coupon)
  ↓
Place Order (Payment)
  ↓
Order Confirmation
  ↓
Delivery Partner Assigned
  ↓
Real-time Tracking
  ↓
Delivered & Feedback
```

### Delivery Partner Workflow
```
Register Account
  ↓
Submit Documents
  ↓
Verification Approval
  ↓
Access Dashboard
  ↓
View Available Orders
  ↓
Accept Order
  ↓
Navigate to Pickup
  ↓
Pickup Order
  ↓
Navigate to Delivery
  ↓
Complete Delivery
  ↓
Earn Commission
```

---

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## 📋 Features Checklist

### Phase 1 - Core Ordering (Current)
- [x] Restaurant search and discovery
- [x] Menu browsing with categories
- [x] Shopping cart management
- [x] Checkout with address input
- [x] Coupon application
- [x] Order placement
- [x] Order tracking with timeline
- [x] Feedback submission

### Phase 2 - Delivery Partner System
- [x] Partner registration and verification
- [x] Available deliveries near location
- [x] Accept/reject orders
- [x] Live GPS tracking
- [x] Earnings dashboard
- [x] Per-km pricing display

### Phase 3 - Additional Features (Planned)
- [ ] Table reservations
- [ ] Event/party bookings
- [ ] Decoration packages
- [ ] Return and refund system
- [ ] Loyalty rewards program
- [ ] Social features (share, reviews)

---

## 🆘 Troubleshooting

### Page not loading
- Check URL is correct
- Verify backend API is running
- Check browser console for errors

### Cart not showing
- Ensure restaurant slug is correct
- Check browser localStorage for cart data
- Clear cache if items disappear

### Location tracking not working
- Enable geolocation in browser
- Check GPS is enabled on device
- Verify HTTPS is used in production

### Orders not appearing
- Backend API must return correct data
- Customer ID must be set
- Check network tab for API errors

---

## 📞 Quick Links

| Feature | URL |
|---------|-----|
| Home | `/online-ordering` |
| Search | `/online-ordering?search=pizza` |
| Restaurant | `/restaurant/[slug]` |
| Checkout | `/checkout` |
| My Orders | `/orders` |
| Order Detail | `/order/[orderId]` |
| Delivery Signup | `/delivery-partner/signup` |
| Delivery Dashboard | `/delivery-partner/dashboard` |
| Table Booking | `/book-table` |

---

## 📚 Component Documentation

### GlassContainer
Modern glass morphism container with blur effect
```tsx
<GlassContainer className="p-6">
  Content here
</GlassContainer>
```

### AnimatedButton
Button with multiple variants and animations
```tsx
<AnimatedButton 
  variant="primary|secondary|danger|ghost"
  size="sm|md|lg"
  loading={isLoading}
  onClick={handler}
>
  Button Text
</AnimatedButton>
```

### RestaurantCard
Restaurant showcase with rating and offer
```tsx
<RestaurantCard
  image={imageUrl}
  name="Restaurant Name"
  rating={4.5}
  reviewCount={120}
  deliveryTime={30}
  deliveryCharge={50}
  offer={20}
  tags={['Italian', 'Pizza']}
  onClick={handleClick}
/>
```

### MenuItemCard
Menu item display with add button
```tsx
<MenuItemCard
  image={imageUrl}
  name="Item Name"
  description="Item description"
  price={299}
  rating={4.8}
  isVeg={true}
  onAddClick={handleAdd}
/>
```

### StatusBadge
Order status indicator
```tsx
<StatusBadge status="in_delivery" />
```

### Alert
Alert messages
```tsx
<Alert
  type="success|error|warning|info"
  title="Alert Title"
  message="Optional message"
  onClose={handler}
/>
```

---

## 🎯 Best Practices

### For Developers
1. Always use TypeScript types from service interfaces
2. Handle loading states with skeletons
3. Show error alerts for API failures
4. Use responsive grid layouts
5. Test on mobile devices
6. Follow Tailwind naming conventions

### For Users
1. Complete profile to enable features
2. Enable location for better recommendations
3. Save favorite restaurants
4. Track orders in real-time
5. Provide feedback after delivery
6. Use coupons for discounts

---

## 🚀 Performance Tips

- Lazy load images
- Use skeleton loading states
- Debounce search input
- Cache menu data
- Preload next screen components
- Optimize images to <100KB

---

**Last Updated:** June 17, 2026  
**Version:** 1.0.0  
**Status:** Ready for Testing
