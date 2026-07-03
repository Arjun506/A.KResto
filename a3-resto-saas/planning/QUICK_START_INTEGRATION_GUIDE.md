# 🚀 AK Resto Full Integration - Quick Start Guide

## 📂 Files Created

1. **ak-resto-api-integrated.html** - Production-ready frontend with full API integration
2. **API_INTEGRATION_GUIDE.md** - Complete API reference and integration guide
3. **PAYMENT_TRACKING_IMPLEMENTATION.md** - Razorpay & order tracking implementation
4. **BACKEND_API_IMPLEMENTATION.md** - Ready-to-use NestJS backend code

---

## 🎯 Quick Integration Steps

### Phase 1: Backend Setup (2-3 hours)

```bash
# 1. Copy backend code
cp BACKEND_API_IMPLEMENTATION.md a3-resto-saas/apps/api/

# 2. Create NestJS modules
nest g module menu
nest g service menu/menu
nest g controller menu/menu
nest g class menu/dto/create-menu-item.dto

# 3. Implement services from BACKEND_API_IMPLEMENTATION.md
# - Copy OrdersService
# - Copy MenuService
# - Copy ReservationsService
# - Copy RestaurantsService

# 4. Set environment variables
cat > a3-resto-saas/apps/api/.env << EOF
RAZORPAY_KEY_ID=rzp_test_xxxxxx
RAZORPAY_KEY_SECRET=xxxxxx
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret
EOF

# 5. Run migrations
npm run prisma migrate dev

# 6. Start backend
npm run start:api
```

### Phase 2: Frontend Integration (1-2 hours)

```bash
# 1. Copy integrated HTML
cp ak-resto-api-integrated.html a3-resto-saas/apps/web/public/

# 2. Configure API URL
# Edit in HTML or set environment variable:
export VITE_API_URL=http://localhost:3001

# 3. Configure Razorpay
# Get API key from: https://razorpay.com/dashboard
# Update in HTML:
const RAZORPAY_KEY_ID = 'rzp_live_xxxxxxxxxx';

# 4. Start frontend
npm run dev:web

# 5. Open in browser
# http://localhost:3000/public/ak-resto-api-integrated.html
```

### Phase 3: Testing (1-2 hours)

```bash
# 1. Test menu loading
# Should see menu items from database

# 2. Test ordering
# Add items → Checkout → Razorpay payment

# 3. Test order tracking
# After payment, should see order status updates

# 4. Test reservations
# Book table → Should see confirmation

# 5. Run integration tests
npm run test:integration
```

---

## 🔑 Environment Variables

Create `.env` files in both frontend and backend:

```env
# apps/api/.env
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxx
DATABASE_URL=postgresql://user:password@localhost:5432/akrestos
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=7d
NODE_ENV=development
PORT=3001

# apps/web/.env.local
VITE_API_URL=http://localhost:3001
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
VITE_RESTAURANT_ID=default
VITE_ENABLE_VIDEO_BG=true
```

---

## 🧪 Testing Endpoints

### With cURL

```bash
# Get menu items
curl -X GET "http://localhost:3001/menu/items?restaurantId=default" \
  -H "Authorization: Bearer {token}"

# Create order
curl -X POST "http://localhost:3001/orders" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"id": "1", "quantity": 2, "price": 249}],
    "restaurantId": "default",
    "customerEmail": "test@example.com",
    "customerPhone": "+919999999999",
    "deliveryAddress": "123 Main St"
  }'

# Track order
curl -X GET "http://localhost:3001/orders/ORD-12345" \
  -H "Authorization: Bearer {token}"

# Create reservation
curl -X POST "http://localhost:3001/reservations" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "date": "2024-06-25",
    "time": "19:30",
    "guests": 4,
    "restaurantId": "default"
  }'

# Get available slots
curl -X GET "http://localhost:3001/reservations/availability?restaurantId=default&date=2024-06-25&partySize=4"
```

---

## 📊 API Endpoint Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/menu/items` | GET | Fetch menu items |
| `/menu/categories` | GET | Fetch categories |
| `/orders` | POST | Create order |
| `/orders/:id` | GET | Get order details |
| `/orders/user/me` | GET | Get user orders |
| `/orders/:id/status` | GET | Get order status |
| `/payments/verify` | POST | Verify payment |
| `/reservations` | POST | Create reservation |
| `/reservations/availability` | GET | Get available slots |
| `/reservations/user/me` | GET | Get user reservations |
| `/restaurants/:id` | GET | Get restaurant info |
| `/restaurants/:id/status` | GET | Get restaurant status |

---

## 🎥 Video Background Setup

### Option 1: Use URL from Database

```typescript
async function loadRestaurantInfo() {
    const response = await APIClient.getRestaurantInfo(restaurantId);
    if (response.data.videoUrl) {
        document.getElementById('heroBg').querySelector('source').src = response.data.videoUrl;
        document.getElementById('heroBg').load();
    }
}
```

### Option 2: Upload Video

```typescript
const formData = new FormData();
formData.append('file', videoFile);
formData.append('type', 'hero-video');

const response = await fetch('/uploads', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
});
```

### Recommended Video Settings

- Format: MP4 (H.264)
- Duration: 30-60 seconds
- Resolution: 1920x1080
- Bitrate: 3-5 Mbps
- Max size: 10MB

---

## 💳 Razorpay Integration

### Get API Keys

1. Sign up at https://razorpay.com
2. Create application
3. Get Test Keys (for development)
4. Get Live Keys (for production)

### Test Payment Details

```
Card: 4111111111111111
Exp: 12/25
CVV: 123
OTP: 123456
```

---

## 📱 Mobile Optimization

The integrated HTML already includes:

- Responsive design for all devices
- Touch-friendly buttons (36px minimum)
- Mobile drawer navigation
- Optimized images with lazy loading
- Vertical scrolling for mobile

---

## 🔒 Security Checklist

- [ ] Store JWT tokens securely
- [ ] Use HTTPS in production
- [ ] Verify Razorpay signature on backend
- [ ] Validate all inputs on backend
- [ ] Rate limit API endpoints
- [ ] Use environment variables for secrets
- [ ] Implement CORS properly
- [ ] Add request logging
- [ ] Monitor for suspicious activity

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Menu not loading | Check API URL, auth token, restaurantId |
| Payment fails | Verify Razorpay keys, check webhook |
| Order not tracking | Check order ID, enable WebSocket/polling |
| Reservation error | Verify date format, check availability |
| CORS error | Check backend CORS config |
| Video not playing | Check video URL, browser support |

---

## 📈 Performance Optimization

```javascript
// Implement pagination
const PAGE_SIZE = 10;
let currentPage = 0;

async function loadMoreItems() {
    const response = await APIClient.getMenuItems(
        restaurantId,
        currentFilter,
        PAGE_SIZE,
        currentPage * PAGE_SIZE
    );
    currentPage++;
    renderMenuItems(response.data);
}

// Implement caching
const cache = new Map();
async function getCachedMenuItems(restaurantId) {
    if (cache.has(restaurantId)) {
        return cache.get(restaurantId);
    }
    const items = await APIClient.getMenuItems(restaurantId);
    cache.set(restaurantId, items, 1000 * 60 * 5); // 5 min cache
    return items;
}

// Lazy load images
document.querySelectorAll('img').forEach(img => {
    img.loading = 'lazy';
});
```

---

## 🚀 Deployment

### Docker Compose

```yaml
version: '3.8'
services:
  frontend:
    build: ./apps/web
    ports: ["3000:3000"]
    environment:
      - VITE_API_URL=http://api:3001

  api:
    build: ./apps/api
    ports: ["3001:3001"]
    environment:
      - DATABASE_URL=postgresql://db:5432/akrestos
      - RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID}
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_PASSWORD=password
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### Deploy to Production

```bash
# 1. Build Docker images
docker-compose build

# 2. Push to registry
docker tag akrestos-frontend your-registry/frontend:latest
docker push your-registry/frontend:latest

# 3. Deploy to server
docker-compose -f docker-compose.prod.yml up -d

# 4. Check logs
docker-compose logs -f api
```

---

## 📞 Support Resources

- **Razorpay Docs**: https://razorpay.com/docs/
- **NestJS Docs**: https://docs.nestjs.com/
- **Prisma Docs**: https://www.prisma.io/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs/

---

## ✅ Integration Completion Checklist

- [ ] Backend services implemented
- [ ] Database migrations run
- [ ] Frontend HTML deployed
- [ ] Razorpay configured
- [ ] Menu items loaded from API
- [ ] Orders creation working
- [ ] Payment flow tested
- [ ] Order tracking working
- [ ] Reservations working
- [ ] Real-time updates configured
- [ ] Error handling complete
- [ ] Mobile responsive verified
- [ ] Security checklist complete
- [ ] Performance optimized
- [ ] Staging tested
- [ ] Production deployed

---

## 🎉 You're Ready!

Your AK Resto restaurant platform is now ready for:

✅ Menu Management  
✅ Online Ordering  
✅ Payment Processing  
✅ Order Tracking  
✅ Table Reservations  
✅ Real-time Updates  
✅ Mobile Experience  

**Time to Launch! 🚀**

