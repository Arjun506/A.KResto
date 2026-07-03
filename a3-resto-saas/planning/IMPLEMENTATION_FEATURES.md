# A3 Resto - Comprehensive Features Implementation Guide

## 🎯 Project Overview
Complete restaurant management SaaS with role-based dashboards: Owner, Billing Counter, Kitchen, Waiter.

**Status**: Core auth & 2 dashboards complete. Building comprehensive feature modules.

---

## 📋 Module 1: ORDERS MANAGEMENT ✅ COMPLETE

### Features Implemented
- ✅ View all orders (new, recent, online, booking, offline/QR, partial, custom)
- ✅ Filter by order type and status
- ✅ Search by order ID, customer name, phone
- ✅ View detailed order information
- ✅ Generate & print receipts
- ✅ Download receipt as JSON
- ✅ Create new orders (modal with order type selection)
- ✅ Real-time order status updates
- ✅ Support for dine-in, takeaway, online, booking orders
- ✅ QR code scanned orders
- ✅ Delivery address for online orders
- ✅ Booking time for reservation orders

### API Endpoints to Connect
```
POST   /api/orders/create
GET    /api/orders
GET    /api/orders/:id
PATCH  /api/orders/:id/status
GET    /api/orders/type/:type
POST   /api/orders/:id/receipt
```

### Next Steps
- Connect to backend API
- Real-time socket.io updates
- Add order editing capability
- Add order cancellation with refund logic

---

## 📋 Module 2: MENU MANAGEMENT - To Be Created

### Features to Implement
- [ ] **Add Menu Items**
  - Item name, description
  - Category selection
  - Price input
  - Image upload
  - Vegetarian/Non-vegetarian flag
  - Spice level indicator
  - Availability status

- [ ] **Manage Existing Menus**
  - Edit item details
  - Update prices
  - Change availability
  - View sales count
  - Delete items (with confirmation)
  - Bulk actions

- [ ] **Time-based Menu Availability**
  - Select days (Mon-Sun)
  - Time slot selection (breakfast, lunch, dinner, etc.)
  - Set different menus for different times
  - Mark items as "available till" specific time
  - Seasonal menu management

- [ ] **Menu Cart Features**
  - Add items to cart with timing info
  - Show available time windows
  - Calculate preparation time estimate
  - Show wait time before serving
  - Suggested items based on time

- [ ] **Categories**
  - Create/edit/delete categories
  - Category icons
  - Reorder categories
  - Assign items to categories

- [ ] **Food Ordering Integration**
  - Online ordering menu
  - Display on website
  - Menu visibility toggle
  - Special offers on items
  - Combo deals

### UI Components
```
- MenuList (table of all items with actions)
- MenuForm (add/edit modal)
- ImageUpload (drag-drop image upload)
- CategoryManager (manage categories)
- TimeAvailability (set time-based availability)
- MenuPreview (how it looks online)
```

### Mock Data Structure
```typescript
interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  isVeg: boolean;
  spiceLevel: 'mild' | 'medium' | 'spicy';
  prepTime: number; // minutes
  availability: {
    days: string[]; // ['Monday', 'Tuesday'...]
    slots: string[]; // ['breakfast', 'lunch', 'dinner']
  };
  isActive: boolean;
  createdAt: string;
}
```

### API Endpoints
```
GET    /api/menu/items
POST   /api/menu/items
PUT    /api/menu/items/:id
DELETE /api/menu/items/:id
GET    /api/menu/categories
POST   /api/menu/categories
PUT    /api/menu/categories/:id
```

---

## 📋 Module 3: QR CODE MANAGEMENT - To Be Created

### Features to Implement
- [ ] **QR Code Generation**
  - Generate QR code for each table
  - Dynamic QR code generation per restaurant
  - QR points to online ordering page
  - Include table number in QR data

- [ ] **QR Code Printing**
  - Print single QR code
  - Bulk print (all tables)
  - Print on stickers/paper
  - Customize print size
  - Preview before printing

- [ ] **Table Assignment**
  - Assign QR code to table
  - Manage table list
  - Add new tables
  - Delete tables
  - Edit table details

- [ ] **QR Code Management**
  - View all QR codes
  - Track QR scans
  - View scan history
  - Deactivate QR codes
  - Regenerate QR codes

### UI Components
```
- QRCodeList (display all QR codes)
- QRCodeGenerator (create new QR)
- TableManager (manage tables)
- QRPrintModal (print options)
- ScanHistory (track scans)
```

### Mock Data
```typescript
interface Table {
  id: string;
  tableNumber: string;
  capacity: number;
  location: string;
  qrCode: string; // URL or data
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  scans: number;
  lastScanned: string;
}
```

---

## 📋 Module 4: CUSTOMER MANAGEMENT - To Be Created

### Features to Implement
- [ ] **Customer Directory**
  - View all customers
  - Search by name, phone, email
  - Filter by visit frequency
  - Sort by last visit, visit count

- [ ] **Customer Details**
  - Name, phone, email, address
  - Total visits count
  - Visit frequency tracking
  - Last visit date
  - Loyalty points/tier
  - Customer photo

- [ ] **Notifications**
  - Send notification to individual customer
  - Select customers to notify (regular, VIP, etc.)
  - Notification template selection
  - SMS/Email/Push options
  - Track delivery status

- [ ] **Offers & Coupons**
  - Apply offers to specific customer
  - Assign discount coupons
  - Generate unique coupon codes
  - Track coupon usage
  - Set expiry dates
  - Apply bulk offers

- [ ] **Customer Loyalty**
  - Loyalty points system
  - Track points earned
  - Points redemption
  - Tier-based benefits
  - Birthday discounts

### UI Components
```
- CustomerList (searchable, sortable)
- CustomerProfile (detailed view)
- NotificationModal (send notifications)
- OfferAssignment (apply offers)
- LoyaltyTracker (points & tier)
```

### Mock Data
```typescript
interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  visitCount: number;
  lastVisit: string;
  totalSpent: number;
  loyaltyTier: 'bronze' | 'silver' | 'gold';
  loyaltyPoints: number;
  photo?: string;
  createdAt: string;
}
```

---

## 📋 Module 5: RESERVATION SYSTEM - To Be Created

### Features to Implement
- [ ] **Pre-Reservations**
  - Calendar view of bookings
  - Reserve table by date & time
  - Guest count input
  - Special requests notes
  - Confirmation notification

- [ ] **Table Booking Management**
  - View all bookings
  - Filter by date/status
  - Edit booking details
  - Extend or reduce booking time
  - Cancel booking (with confirmation)

- [ ] **Booking Display**
  - Show which table is booked
  - Time period display
  - Customer name display
  - Guest count
  - Booking status (confirmed, checked-in, completed, cancelled)

- [ ] **Website Integration**
  - Website booking form
  - Real-time availability
  - Auto-confirm bookings
  - Booking reminders to customer
  - Waitlist management

- [ ] **Cancellation & Rescheduling**
  - Cancel with reason
  - Offer alternative dates
  - Refund policy display
  - Reschedule existing booking

### UI Components
```
- ReservationCalendar (date picker)
- TableGrid (visual table availability)
- BookingForm (new reservation)
- BookingList (all bookings)
- CancellationModal (cancel with reason)
```

### Mock Data
```typescript
interface Reservation {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  tableNumber: string;
  guestCount: number;
  bookingDate: string;
  bookingTime: string;
  duration: number; // hours
  specialRequests: string;
  status: 'confirmed' | 'checked-in' | 'completed' | 'cancelled';
  createdAt: string;
}
```

---

## 📋 Module 6: PAYMENTS & BILLING - To Be Created

### Features to Implement
- [ ] **Bill Generation**
  - Select items/order
  - Apply discounts/coupons
  - Calculate GST
  - Show payment summary
  - Add tips option
  - Generate bill number

- [ ] **Payment Processing**
  - Multiple payment methods (Cash, Card, UPI)
  - Digital payment gateways:
    - **Paytm**: Integration for UPI/Wallet
    - **Google Pay**: Direct payment
    - **PhonePe**: UPI payments
    - **Other QR codes**: Custom payment QR
  - QR code payment option
  - Partial payments
  - EMI options

- [ ] **Receipt Management**
  - Print receipt
  - Email receipt
  - SMS receipt
  - Save receipt as PDF
  - Reprint receipt
  - Receipt customization

- [ ] **QR Code in Receipt**
  - Add payment QR code to receipt
  - Supports multiple payment gateways
  - Dynamic QR generation
  - Payment tracking

- [ ] **Scanner Integration**
  - Barcode scanner support
  - QR code scanner
  - Track scanned items
  - Auto-fill order details

### UI Components
```
- BillGenerator (create bill)
- PaymentModal (select payment method)
- ReceiptTemplate (print/email)
- GatewayIntegration (payment processing)
- ScannerIntegration (item scanning)
```

### Payment Gateway Configuration
```typescript
interface PaymentConfig {
  paytm: {
    merchantId: string;
    merchantKey: string;
    website: string;
  };
  googlePay: {
    merchantId: string;
  };
  phonePe: {
    merchantId: string;
    apiKey: string;
  };
}
```

---

## 📋 Module 7: OFFERS & COUPONS - To Be Created

### Features to Implement
- [ ] **Generate Offers**
  - Create discount offers
  - Percentage or fixed amount
  - Min purchase requirement
  - Max discount limit
  - Validity period
  - Applicable items/categories

- [ ] **Create Coupons**
  - Generate unique codes
  - Batch coupon generation
  - QR code for coupons
  - Single-use or multi-use
  - Coupon limit
  - Track redemptions

- [ ] **Apply to Customers**
  - Assign coupon to specific customer
  - Bulk assign to customer segment
  - Email coupon
  - SMS coupon
  - Apply automatically (loyalty rewards)

- [ ] **Website Integration**
  - Display coupons on website
  - Coupon listing
  - Apply during checkout
  - Coupon validation

- [ ] **Management & Tracking**
  - View all active offers/coupons
  - Redemption history
  - Failed redemption attempts
  - Expiry management
  - Edit/disable coupons

### UI Components
```
- OfferCreator (new offer form)
- CouponGenerator (batch generate)
- CouponList (manage coupons)
- RedemptionTracker (usage history)
```

---

## 📋 Module 8: INVENTORY & STOCK - To Be Created

### Features to Implement
- [ ] **Stock Tracking**
  - Item name, unit
  - Current stock quantity
  - Reorder level
  - Stock location/bin
  - Last updated time
  - Stock history log

- [ ] **Investment Tracking**
  - Cost per unit
  - Total investment amount
  - Purchase history
  - Supplier details
  - Batch numbers
  - Expiry tracking

- [ ] **Usage Tracking**
  - Track usage per order
  - Decrease stock when order placed
  - Batch deductions
  - Usage reports
  - Waste tracking

- [ ] **Defection & Waste**
  - Log spoilage/damage
  - Waste reason
  - Quantity lost
  - Value of waste
  - Waste reports

- [ ] **Low Stock Alerts**
  - Auto-alert when stock low
  - Email notifications
  - SMS alerts
  - Purchase order suggestions
  - Reorder templates

### UI Components
```
- StockList (inventory table)
- StockAdjustment (add/remove stock)
- LowStockAlerts (warning panel)
- UsageTracker (consumption logs)
- WasteLogger (damage/spoilage)
```

### Mock Data
```typescript
interface StockItem {
  id: string;
  itemName: string;
  unit: string;
  currentQty: number;
  reorderLevel: number;
  costPerUnit: number;
  totalInvestment: number;
  location: string;
  supplier: string;
  lastUpdated: string;
  expiryDate?: string;
}
```

---

## 📋 Module 9: PURCHASE MANAGEMENT - To Be Created

### Features to Implement
- [ ] **Stock Requests**
  - Chef/Staff can request items
  - Request details (item, qty, reason)
  - Urgency level
  - Request status tracking

- [ ] **Approval Workflow**
  - Billing Counter approval
  - Owner final approval
  - Request rejection with reason
  - Edit request before approval

- [ ] **Purchase Tracking**
  - Track all requests
  - Approval history
  - Supplier assignment
  - Purchase order generation
  - Delivery tracking

- [ ] **Product Management**
  - Select product to purchase
  - Quantity input
  - Unit price
  - Total cost calculation
  - Budget checking

- [ ] **Reporting**
  - Daily purchase report
  - Monthly spending
  - Supplier-wise breakdown
  - Category-wise breakdown
  - ROI analysis

### UI Components
```
- PurchaseRequest (create request)
- ApprovalQueue (pending approvals)
- PurchaseTracker (all purchases)
- SupplierManagement (supplier list)
- PurchaseReports (analytics)
```

### Mock Data
```typescript
interface PurchaseRequest {
  id: string;
  requestedBy: string;
  itemName: string;
  quantity: number;
  reason: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'billingApproved' | 'ownerApproved' | 'rejected' | 'purchased';
  billingApprovedBy?: string;
  billingApprovedAt?: string;
  ownerApprovedBy?: string;
  ownerApprovedAt?: string;
  createdAt: string;
}
```

---

## 🔑 Key Integration Points

### Backend APIs Required
```
Orders:        /api/orders/*
Menu:          /api/menu/*
QR Codes:      /api/qr-codes/*
Customers:     /api/customers/*
Reservations:  /api/reservations/*
Payments:      /api/payments/*
Offers:        /api/offers/*
Inventory:     /api/inventory/*
Purchases:     /api/purchases/*
```

### Real-time Features (Socket.io)
```
- New orders notification
- Order status updates
- Table status changes
- Payment confirmations
- Low stock alerts
- Customer notifications
```

### File Uploads
```
- Menu item images
- Customer photos
- Receipt PDFs
- QR code images
- Invoice documents
```

---

## 📅 Implementation Roadmap

### Phase 1 (Current) ✅
- ✅ Orders Management (Complete)
- 🔄 Menu Management (In Progress)

### Phase 2 (Next)
- QR Code Management
- Customer Management
- Reservation System

### Phase 3
- Payments & Billing
- Offers & Coupons

### Phase 4
- Inventory & Stock
- Purchase Management

---

## 🎨 Design Constants

### Colors by Role
- **Owner**: Purple (#5850ec)
- **Billing**: Blue (#3b82f6)
- **Kitchen**: Orange (#f97316)
- **Waiter**: Green (#10b981)

### UI Framework
- Framework: Next.js 16 + React 19
- Styling: Tailwind CSS 4
- Icons: Lucide React
- Charts: Recharts
- Real-time: Socket.io
- HTTP: Axios

---

## ✅ Testing Checklist

- [ ] Orders page loads and displays mock data
- [ ] Filters work (order type, status, search)
- [ ] Create order modal opens
- [ ] Print receipt generates PDF
- [ ] Download receipt as JSON
- [ ] View order details modal works
- [ ] Menu page renders with items
- [ ] Add menu item form works
- [ ] QR code generates and displays
- [ ] Print QR code works
- [ ] Customer list loads
- [ ] Send notification works
- [ ] Apply coupon functionality works
- [ ] Reservation calendar works
- [ ] Payment gateway integration works
- [ ] Inventory alerts display
- [ ] Purchase approval workflow functions

---

## 📞 Notes

This document serves as the comprehensive feature specification for the A3 Resto restaurant management system. Each module builds upon the authentication and core dashboard infrastructure already implemented.

**For questions or updates, refer to this document and the individual module implementation files.**
