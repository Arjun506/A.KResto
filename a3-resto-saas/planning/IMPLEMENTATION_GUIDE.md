# A3 Resto Dashboard Redesign - Implementation Guide

## ✅ Completed Work

### 1. **Enhanced Authentication System**
**File**: `apps/web/context/auth-context.tsx`

- Added `UserRole` type (OWNER | CASHIER | CHEF | WAITER | SUPER_ADMIN)
- Implemented JWT token decoding with role extraction
- Added user object to auth context with id, email, role, restaurantId
- Maintains backward compatibility with existing login

**Key Functions**:
```typescript
export type UserRole = 'OWNER' | 'CASHIER' | 'CHEF' | 'WAITER' | 'SUPER_ADMIN';

interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  restaurantId?: string;
}

const { token, user, isLoading, login, logout } = useAuth();
```

### 2. **Role-Based Routing Hook**
**File**: `apps/web/hooks/use-role-based-redirect.ts`

- Created `useRoleBasedRedirect()` hook for automatic dashboard routing
- Maps roles to correct dashboard pages:
  - OWNER → /dashboard
  - CASHIER → /dashboard/billing  
  - CHEF → /dashboard/kitchen
  - WAITER → /dashboard/waiter
  - SUPER_ADMIN → /super-admin

**Usage**:
```typescript
const { user, isLoading } = useRoleBasedRedirect();
// Automatically redirects to correct dashboard on login
```

### 3. **Login Page Components**
**Files**:
- `apps/web/components/login/RoleSelector.tsx` - Role selection UI
- `apps/web/components/login/LoginForm.tsx` - Login form component

**Features**:
- Visual role selector with icons and descriptions
- Clean, modern login form
- Error handling and validation
- Remember me checkbox
- Forgot password link

### 4. **Billing Counter Dashboard**
**File**: `apps/web/app/dashboard/billing/page.tsx`

**Features Implemented**:
- ✅ Today's Orders KPI (56 orders, +13.3% vs yesterday)
- ✅ Today's Revenue KPI (₹18,750, +18.6% vs yesterday)
- ✅ Pending Orders counter (12 orders)
- ✅ Completed Orders counter (44 orders)
- ✅ Cancelled Orders counter (2 orders)
- ✅ Total Tables counter (20 available)
- ✅ Hourly Orders Chart (area chart)
- ✅ Order Status Pie Chart (New, Preparing, Ready, Completed)
- ✅ Recent Orders Table with actions
- ✅ Dark mode support
- ✅ Role-based access control

**Charts & Visualizations**:
- Recharts integration for responsive charts
- Real-time data display capability
- Color-coded status indicators

---

## 🔄 Implementation in Progress

### Owner Admin Dashboard
**File**: `apps/web/app/dashboard/page.tsx`

Currently has basic structure. Needs enhancement with:
1. Additional KPI cards (Total Customers, Total Profit, Pending Orders, Total Tables)
2. Revenue Overview chart
3. Orders Status breakdown
4. Top Selling Items list
5. Upcoming Reservations
6. Low Stock Alerts
7. Recent Feedback
8. Export Report functionality

---

## 📋 Still To Implement

### 5. Kitchen Dashboard
**Location**: `apps/web/app/dashboard/kitchen/page.tsx`

**Required Features**:
```
Dashboard Layout:
├── Header: "Welcome Chef! 👨‍🍳"
├── Status Cards:
│   ├── New Orders (requires attention)
│   ├── Orders in Progress
│   ├── Ready to Serve
│   ├── Completed Today
│   └── Avg. Preparation Time
├── New Orders List (large, high priority)
├── Preparing Orders (with timers)
├── Ready to Serve (Mark Served button)
├── Quick Actions:
│   ├── Mark Ready
│   ├── Request Refund
│   └── Add Stock Request
└── Kitchen Announcements

Design Inspiration: 3rd image (Orange/Red theme)
```

### 6. Waiter Panel Dashboard
**Location**: `apps/web/app/dashboard/waiter/page.tsx`

**Required Features**:
```
Dashboard Layout:
├── Header: "Good Morning, Ravi! 👋"
├── Status Cards:
│   ├── Assigned Tables (6)
│   ├── Orders to Serve (3)
│   ├── New Service Requests (3)
│   ├── Total Tips (₹650)
│   └── Total Earnings (₹1,850)
├── My Assigned Tables (grid view with status)
├── Orders to Serve (with delivery status)
├── Service Requests:
│   ├── Water refill requests
│   ├── Table cleaning requests
│   └── Issue reports
├── Table Status Map
├── Quick Actions:
│   ├── Call Waiter
│   ├── Request Cleaning
│   └── Bill Request
└── My Earnings Summary

Design Inspiration: 4th image (Purple/Indigo theme)
```

### 7. Feature-Rich Modules

#### Orders Management
```
Pages needed:
- /dashboard/orders (all orders view)
  ├── New Orders
  ├── Recent Orders
  ├── Online Orders
  ├── QR Code Orders
  ├── Offline Orders
  ├── Booking Orders
  ├── Order Creation Modal
  └── Receipt Generation/Print

Features:
- Order tracking
- Status updates
- Receipt printing
- Invoice generation
- Online order integration
```

#### Menu Management
```
Pages needed:
- /dashboard/menu (menu items)
  ├── Add/Edit Menu Items
  ├── Image Upload
  ├── Price Management
  ├── Availability Scheduling (time-based)
  ├── Category Management
  └── Menu Preview

Features:
- Bulk menu updates
- Time-based availability
- Item-level permissions
- Menu variants
```

#### QR Code Management
```
Pages needed:
- /dashboard/qr-tables (QR code generation)
  ├── Generate QR Codes
  ├── Print QR Codes
  ├── Table Assignment
  ├── QR Distribution Tracking

Features:
- Batch QR generation
- Custom QR templates
- Print management
```

#### Customer Management
```
Pages needed:
- /dashboard/customers
  ├── Customer Directory
  ├── Visit History
  ├── Loyalty Program
  ├── Notifications
  ├── Offers & Coupons per Customer

Features:
- Customer profiles
- Visit tracking
- Repeat customer identification
- Communication tools
```

#### Reservations
```
Pages needed:
- /dashboard/reservations
  ├── Reservation Calendar
  ├── Table Availability View
  ├── Reservation Management
  ├── Cancellation Handling
  ├── Website Integration

Features:
- Calendar view
- Real-time table status
- Customer notifications
- Wait list management
```

#### Payments
```
Pages needed:
- /dashboard/payments
  ├── Bill Generation
  ├── Payment Gateway Integration (Paytm/GooglePay/PhonePay)
  ├── Receipt Printing
  ├── QR Code in Receipt
  ├── Payment History

Features:
- Multiple payment methods
- QR code integration
- Receipt customization
- Payment tracking
```

#### Offers & Coupons
```
Pages needed:
- /dashboard/offers
  ├── Create Offers
  ├── Create Coupons
  ├── Apply to Customers
  ├── Website Integration
  ├── Analytics

Features:
- Offer templates
- Coupon generation
- Usage tracking
- Redemption management
```

#### Inventory/Stock
```
Pages needed:
- /dashboard/inventory
  ├── Stock Tracking
  ├── Stock Valuation
  ├── Usage Tracking
  ├── Defection Tracking
  ├── Low Stock Alerts

Features:
- Real-time stock levels
- Purchase history
- Variance tracking
- Alert system
```

#### Purchase Management
```
Pages needed:
- /dashboard/purchases
  ├── Purchase Requests (from Chef)
  ├── Approval Workflow
  ├── Purchase History
  ├── Supplier Management

Features:
- Request creation
- Multi-level approvals
- Purchase orders
- Supplier tracking
```

---

## 🔧 How to Continue Implementation

### Quick Start for Kitchen Dashboard:

```bash
# Create the kitchen dashboard page
touch apps/web/app/dashboard/kitchen/page.tsx

# Add the following component structure:
```

```typescript
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { ChefHat, Clock, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

export default function KitchenDashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'CHEF')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen bg-orange-50 dark:bg-slate-900 p-6">
      {/* Similar structure to billing dashboard */}
      {/* Use orange/red color scheme */}
    </div>
  );
}
```

### Authorization Pattern:

```typescript
// Always include this pattern to protect dashboards
useEffect(() => {
  if (!isLoading && (!user || user.role !== 'EXPECTED_ROLE')) {
    router.push('/login');
  }
}, [user, isLoading, router]);
```

---

## 🎨 Design Color Schemes

By Role:
- **Owner**: Purple/Indigo (#5850ec, #6366f1)
- **Billing**: Blue (#3b82f6, #2563eb)
- **Kitchen**: Orange/Red (#f97316, #ef4444)
- **Waiter**: Green/Emerald (#10b981, #059669)

---

## 📊 Mock Data Services

For development, use mock data objects stored in each page component:

```typescript
const mockOrders = [
  { id: '#ORD1258', table: 'Table 5', items: 4, amount: '₹1,250', status: 'New' },
  // ...
];

const mockMetrics = {
  todayOrders: 56,
  todayRevenue: 18750,
  // ...
};
```

Later, replace with API calls:
```typescript
// After backend integration
const { data: orders } = await orderService.getTodaysOrders();
const { data: metrics } = await dashboardService.getMetrics();
```

---

## 🔗 Integration Points

### Services to Create/Update:
- `services/dashboard.service.ts` - KPIs, metrics
- `services/kitchen.service.ts` - Kitchen orders, timers
- `services/waiter.service.ts` - Table service, requests
- `services/notifications.service.ts` - Real-time updates

### Backend Endpoints Needed:
```
GET /api/dashboard/metrics - KPI data
GET /api/dashboard/orders - Order list with filters
POST /api/dashboard/orders - Create new order
PATCH /api/orders/{id}/status - Update order status
GET /api/kitchen/orders - Kitchen order queue
GET /api/waiter/tables - Assigned tables
GET /api/customers - Customer directory
POST /api/payments/generate-bill - Bill generation
```

---

## 🚀 Next Steps

1. **Create Kitchen Dashboard** - Follow the same pattern as Billing Counter
2. **Create Waiter Panel** - Implement table and service request features
3. **Create Admin Dashboard** - Enhance existing owner dashboard
4. **Implement Modules** - Orders, Menu, QR, Customers, Reservations, etc.
5. **Add Real-Time Features** - Socket.io integration for live updates
6. **Connect to Backend** - Replace mock data with API calls
7. **Add Notifications** - Toast, emails, SMS based on events
8. **Mobile Optimization** - Ensure responsive design for all screens

---

## 📝 Notes

- All dashboards use Tailwind CSS for styling
- Dark mode is fully supported
- Icons from `lucide-react`
- Charts from `recharts`
- Role-based access is enforced at page level

---

## 🆘 Support

For detailed implementation of any module, refer to the image designs provided and use the pattern established in the Billing Counter Dashboard as a template.
