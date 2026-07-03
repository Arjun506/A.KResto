# 🚀 AK Resto - Complete API Integration Guide

## Overview

This guide covers full integration of the frontend HTML with backend APIs, payment gateway, and order tracking system.

---

## 📁 File Structure

```
a3-resto-saas/apps/web/public/
├── ak-resto-premium.html (Original design)
└── ak-resto-api-integrated.html (Production with API integration)
```

---

## 🔌 API Integration Points

### 1. Backend Configuration

**Base URL**: `http://localhost:3001`  
**Production**: Configure via environment variable

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
```

### 2. Authentication

**Token Storage**:
```javascript
localStorage.setItem('authToken', token);
const authToken = localStorage.getItem('authToken');
```

**Header Injection**:
```javascript
headers['Authorization'] = `Bearer ${authToken}`;
```

---

## 📋 API Endpoints Reference

### Menu Management

#### Get All Menu Items
```http
GET /menu/items?restaurantId=abc123
Authorization: Bearer {token}
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Margherita Pizza",
      "description": "Fresh mozzarella",
      "price": 249,
      "category": "veg",
      "image": "https://...",
      "isPopular": true,
      "available": true
    }
  ]
}
```

#### Get Categories
```http
GET /menu/categories?restaurantId=abc123
```

**Response**:
```json
{
  "success": true,
  "data": [
    { "id": "veg", "name": "Vegetarian", "icon": "🌱" },
    { "id": "non-veg", "name": "Non-Vegetarian", "icon": "🍗" }
  ]
}
```

---

### Order Management

#### Create Order
```http
POST /orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "items": [
    { "id": "1", "quantity": 2, "price": 249 }
  ],
  "restaurantId": "abc123",
  "customerEmail": "user@example.com",
  "customerPhone": "+1234567890",
  "deliveryAddress": "123 Main St",
  "paymentMethod": "razorpay"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "ORD-12345",
    "razorpayOrderId": "order_123",
    "total": 598,
    "status": "pending",
    "createdAt": "2024-06-17T10:30:00Z"
  }
}
```

#### Get Order Status
```http
GET /orders/{orderId}
Authorization: Bearer {token}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "ORD-12345",
    "status": "preparing",
    "items": [...],
    "total": 598,
    "deliveryAddress": "123 Main St",
    "estimatedDeliveryTime": "45 minutes",
    "statusHistory": [
      { "status": "pending", "timestamp": "2024-06-17T10:30:00Z" },
      { "status": "confirmed", "timestamp": "2024-06-17T10:35:00Z" }
    ]
  }
}
```

#### Get User Orders
```http
GET /orders/user/me
Authorization: Bearer {token}
```

**Response**:
```json
{
  "success": true,
  "data": [
    { "id": "ORD-12345", "status": "delivered", "total": 598 },
    { "id": "ORD-12346", "status": "preparing", "total": 450 }
  ]
}
```

---

### Reservations

#### Create Reservation
```http
POST /reservations
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "date": "2024-06-25",
  "time": "19:30",
  "guests": 4,
  "specialRequests": "Window seat preferred",
  "restaurantId": "abc123"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "RES-12345",
    "confirmationCode": "AB12CD34",
    "status": "confirmed",
    "confirmationEmail": "sent"
  }
}
```

---

### Payments

#### Verify Payment (Razorpay)
```http
POST /payments/verify
Authorization: Bearer {token}
Content-Type: application/json

{
  "orderId": "ORD-12345",
  "razorpayPaymentId": "pay_123abc",
  "razorpayOrderId": "order_123",
  "razorpaySignature": "signature_hash"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "orderId": "ORD-12345",
    "paymentStatus": "completed",
    "transactionId": "pay_123abc"
  }
}
```

---

### Authentication

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "user123",
      "name": "John Doe",
      "email": "user@example.com",
      "phone": "+1234567890"
    }
  }
}
```

#### Signup
```http
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

---

### Restaurant Info

#### Get Restaurant Details
```http
GET /restaurants/{restaurantId}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "name": "AK Resto",
    "description": "Premium dining experience",
    "image": "https://...",
    "videoUrl": "https://...",
    "address": "123 Food Street",
    "phone": "+1234567890",
    "email": "info@akrestos.com",
    "isOpen": true,
    "rating": 4.8,
    "totalReviews": 245,
    "hours": {
      "monday": "11:00-23:00",
      "tuesday": "11:00-23:00"
    }
  }
}
```

---

## 💳 Payment Gateway Integration (Razorpay)

### Setup Steps

1. **Create Razorpay Account**
   - Visit: https://razorpay.com
   - Get API Key and Secret

2. **Configure Frontend**
   ```javascript
   const RAZORPAY_KEY_ID = 'rzp_live_xxxxxxxxxx'; // From environment
   ```

3. **Initialize Payment**
   ```javascript
   const options = {
       key: RAZORPAY_KEY_ID,
       amount: 49800, // in paise (₹498)
       currency: 'INR',
       name: 'AK Resto',
       description: 'Order #ORD-12345',
       order_id: 'order_123',
       handler: function(response) {
           // Verify payment on backend
           verifyPayment(response);
       },
       prefill: {
           email: 'user@example.com',
           contact: '+1234567890'
       }
   };
   const rzp = new Razorpay(options);
   rzp.open();
   ```

4. **Backend Verification**
   ```javascript
   const crypto = require('crypto');
   
   function verifySignature(orderId, paymentId, signature) {
       const hmac = crypto.createHmac('sha256', RAZORPAY_SECRET);
       const body = orderId + '|' + paymentId;
       hmac.update(body);
       const generatedSignature = hmac.digest('hex');
       return signature === generatedSignature;
   }
   ```

---

## 🎥 Video & Image Management

### Video Background Setup

**Frontend**:
```html
<video id="heroBg" class="video-bg" autoplay muted loop playsinline>
    <source src="" type="video/mp4">
</video>
```

**JavaScript**:
```javascript
async function loadRestaurantInfo() {
    const response = await APIClient.getRestaurantInfo(restaurantId);
    if (response.data.videoUrl) {
        document.getElementById('heroBg').src = response.data.videoUrl;
    }
}
```

### Recommended Video Specs
- **Format**: MP4 (H.264 codec)
- **Duration**: 30-60 seconds (looping)
- **Resolution**: 1920x1080 minimum
- **Bitrate**: 3-5 Mbps
- **Size**: < 10MB recommended

### Image Upload Endpoint
```http
POST /uploads
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "file": <binary>,
  "type": "menu-item"
}
```

---

## 📊 Order Tracking System

### Status Flow

```
pending → confirmed → preparing → ready → out_for_delivery → delivered
```

### Real-time Updates (WebSocket)

```javascript
const socket = io(API_BASE_URL);

socket.on('order:status-update', (data) => {
    console.log('Order status changed:', data);
    displayOrderStatus(data);
});

// Join order room
socket.emit('subscribe:order', { orderId: 'ORD-12345' });
```

### Status Polling (Fallback)

```javascript
function startOrderPolling(orderId, interval = 5000) {
    const pollInterval = setInterval(async () => {
        const response = await APIClient.getOrderStatus(orderId);
        displayOrderStatus(response.data);
        
        if (response.data.status === 'delivered') {
            clearInterval(pollInterval);
        }
    }, interval);
}
```

---

## 🔐 Security Considerations

### 1. Token Management
```javascript
// Set token expiration
const token = response.data.token;
const expiresIn = response.data.expiresIn; // in seconds
localStorage.setItem('tokenExpiry', Date.now() + expiresIn * 1000);

// Check and refresh before expiry
function checkTokenExpiry() {
    const expiry = localStorage.getItem('tokenExpiry');
    if (expiry && Date.now() > expiry) {
        refreshToken();
    }
}
```

### 2. CORS Configuration
```javascript
// Backend (NestJS)
app.enableCors({
    origin: ['http://localhost:3000', 'https://akrestos.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
});
```

### 3. Payment Security
- Never expose Razorpay Secret on frontend
- Always verify signature on backend
- Use HTTPS in production
- Implement rate limiting on payment endpoints

### 4. Data Validation
```javascript
const orderSchema = z.object({
    items: z.array(z.object({
        id: z.string(),
        quantity: z.number().min(1),
        price: z.number().positive()
    })),
    customerEmail: z.string().email(),
    customerPhone: z.string().regex(/^\+?[0-9]{10,}$/),
    deliveryAddress: z.string().min(10)
});
```

---

## 🚀 Deployment Guide

### Environment Variables

Create `.env.local`:
```env
# API
VITE_API_URL=https://api.akrestos.com
VITE_API_TIMEOUT=30000

# Payment Gateway
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
VITE_RAZORPAY_KEY_SECRET=xxxxx (backend only!)

# Restaurant
VITE_RESTAURANT_ID=default

# Features
VITE_ENABLE_VIDEO_BG=true
VITE_ENABLE_ORDERS=true
VITE_ENABLE_BOOKING=true
```

### Docker Setup

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./
EXPOSE 3000
CMD ["http-server", "dist", "-p", "3000", "-c-1"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  frontend:
    build: ./apps/web
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://api:3001
    depends_on:
      - api

  api:
    build: ./apps/api
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://...
      - RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID}
    depends_on:
      - db

  db:
    image: postgres:15
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_PASSWORD=password
```

---

## 🧪 Testing

### API Testing with cURL

```bash
# Get menu items
curl -H "Authorization: Bearer {token}" \
  http://localhost:3001/menu/items?restaurantId=default

# Create order
curl -X POST http://localhost:3001/orders \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"items": [...], "restaurantId": "default"}'

# Track order
curl -H "Authorization: Bearer {token}" \
  http://localhost:3001/orders/ORD-12345
```

### Frontend Testing

```javascript
// Test API client
const response = await APIClient.getMenuItems('default');
console.assert(response.success, 'Menu fetch failed');
console.assert(Array.isArray(response.data), 'Menu data not array');

// Test cart
addToCart({ id: 1, name: 'Pizza', price: 249 });
console.assert(cartItems.length === 1, 'Cart add failed');
```

---

## 📱 Mobile Optimization

### Responsive API Handling

```javascript
// Adjust API timeout for mobile
const API_TIMEOUT = navigator.connection?.effectiveType === '4g' 
    ? 30000 
    : 60000;

// Progressive image loading
const imageOptions = {
    placeholder: 'data:image/svg+xml,...',
    sizes: 'sm:100vw,md:50vw,lg:33vw',
    loading: 'lazy'
};
```

### Offline Support

```javascript
// Service Worker caching
self.addEventListener('fetch', event => {
    if (event.request.method === 'GET') {
        event.respondWith(
            caches.open('api-cache').then(cache => {
                return fetch(event.request).then(response => {
                    cache.put(event.request, response.clone());
                    return response;
                }).catch(() => cache.match(event.request));
            })
        );
    }
});
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: CORS errors
```
Solution: Check backend CORS configuration and frontend origin
```

**Issue**: Payment gateway not loading
```
Solution: Verify Razorpay script tag and API key
```

**Issue**: Menu items not loading
```
Solution: Check API endpoint, authentication token, and restaurantId
```

**Issue**: Order tracking not updating
```
Solution: Implement WebSocket or increase polling interval
```

---

## 📞 Support Resources

- **API Documentation**: `/api-docs` (Swagger UI)
- **Backend Repo**: `a3-resto-saas/apps/api`
- **Frontend Repo**: `a3-resto-saas/apps/web`
- **Razorpay Docs**: https://razorpay.com/docs

---

## ✅ Integration Checklist

- [ ] Configure API base URL
- [ ] Set up authentication flow
- [ ] Implement menu loading
- [ ] Add cart functionality
- [ ] Integrate Razorpay
- [ ] Set up order tracking
- [ ] Add booking system
- [ ] Configure video backgrounds
- [ ] Test all API endpoints
- [ ] Set up error handling
- [ ] Implement loading states
- [ ] Add success/error toasts
- [ ] Test mobile responsiveness
- [ ] Deploy to staging
- [ ] Final production testing

---

## 🎉 Next Steps

1. **Backend Setup**: Configure all API endpoints per spec
2. **Database**: Ensure Prisma schema matches API responses
3. **Testing**: Run full integration tests
4. **Deployment**: Deploy to staging environment
5. **Monitoring**: Set up error tracking and analytics

