# AK Business OS v1.0 — PRODUCTION BACKLOG

**Status**: Ready for Sprint Execution  
**Target**: Restaurant Operating & Generating Revenue  
**Updated**: 2026-07-11

---

## EXECUTIVE SUMMARY

This backlog consolidates all incomplete work for AK Business OS v1.0 production release. Every item blocks a real restaurant from operating or reduces operational efficiency. Items are grouped by business criticality and estimated effort.

---

## HIGH PRIORITY — BLOCKS RESTAURANT OPERATIONS

These items **MUST** be completed before any restaurant can operate.

### 1. **Inventory Integration Engine** 
**Status**: 🔴 CRITICAL  
**Business Value**: Orders fail without inventory tracking; kitchen can't confirm stock  
**Impact**: Restaurant cannot fulfill orders safely  

**Technical Details**:
- Prisma models exist: `menu_item_ingredients`, `inventory_movements`
- Service implementation: [inventory.service.ts](apps/api/src/inventory/inventory.service.ts)
- TS compilation errors: Property 'menu_item_ingredients' does not exist on PrismaService
- Root Cause: Prisma client generation was stale

**Resolution**: ✅ COMPLETED
- Regenerated Prisma client: `npx prisma generate --schema prisma/schema.prisma`
- All models now properly typed in generated client
- API build passes successfully

**Verification Checklist**:
- [ ] `npm run build` succeeds in both apps/api and apps/web
- [ ] GET /inventory/items returns sample stock data
- [ ] POST /inventory/items creates new inventory item
- [ ] Menu items can have ingredients assigned via PATCH /inventory/menu-items/{id}/ingredients
- [ ] Orders consume inventory via consumeForOrder() transaction
- [ ] Inventory movements logged for each order

---

### 2. **Order Management Workflow**
**Status**: 🟡 PARTIAL  
**Business Value**: Core restaurant revenue driver  
**Impact**: No orders = no revenue  

**Existing Implementation**:
- Order creation: [orders.controller.ts](apps/api/src/orders/orders.controller.ts) — ✅ Ready
- Order checkout: [orders.service.ts](apps/api/src/orders/orders.service.ts#L315) integrates inventory consumption
- Order status updates: ✅ Ready
- WebSocket events: ✅ Socket.IO configured

**TODO - Phase 1**:
- [ ] Test full order lifecycle: create → confirm → prepare → ready → serve → bill
- [ ] Verify inventory deduction on order checkout
- [ ] Verify audit log entries for each status change
- [ ] Verify payment capture flow
- [ ] Test QR ordering workflow

**TODO - Phase 2** (if Phase 1 passes):
- [ ] Order modification during preparation
- [ ] Order cancellation with inventory restore
- [ ] Partial refunds on cancellation
- [ ] Split bills for table sharing

**Files to Test**:
- [orders.page.tsx](apps/web/app/dashboard/orders/page.tsx) — Mock data only
- [checkout.page.tsx](apps/web/app/checkout/page.tsx) — E2E test

---

### 3. **Restaurant POS & Billing**
**Status**: 🟡 PARTIAL  
**Business Value**: Cash collection and reconciliation  
**Impact**: No bills = accounting chaos  

**Existing**:
- POS page exists: [pos.page.tsx](apps/web/app/dashboard/pos/page.tsx) — ✅ UI ready
- Payment service: [payments.module.ts](apps/api/src/payments) — ✅ Module exists
- Invoice generation: Not yet integrated

**TODO**:
- [ ] POS checkout captures payment method (Cash/Card/UPI/Wallet)
- [ ] Payment recording persists to database
- [ ] Invoice generation on payment confirmation
- [ ] Duplicate prevention (same order cannot be billed twice)
- [ ] Refund flow for wrong billings
- [ ] End-of-day settlement report

**Files to Create/Modify**:
- [ ] Payment capture endpoint: `POST /payments/capture`
- [ ] Invoice generation service
- [ ] POS page integration with real API

---

### 4. **Kitchen Panel & Preparation Workflow**
**Status**: 🟡 PARTIAL  
**Business Value**: Order fulfillment coordination  
**Impact**: Kitchen chaos, order delays, customer dissatisfaction  

**Existing**:
- Kitchen page: [kitchen.page.tsx](apps/web/app/dashboard/kitchen/page.tsx) — ✅ UI ready
- Order status updates: [orders.controller.ts](apps/api/src/orders/orders.controller.ts#L65) — ✅ Endpoint ready
- WebSocket gateway for real-time: ✅ Socket.IO configured

**TODO**:
- [ ] Kitchen page connects to real orders API
- [ ] Orders display filtered by status
- [ ] Chef can mark items "preparing" → "ready"
- [ ] Real-time updates via WebSocket
- [ ] KOT (Kitchen Order Ticket) printing support
- [ ] Multiple station routing (main/sides/dessert)

---

### 5. **Table Management & QR Ordering**
**Status**: 🟡 PARTIAL  
**Business Value**: Self-service reduces staff workload  
**Impact**: Customer experience, staff efficiency  

**Existing**:
- QR code generation: ✅ Models exist (tables.qrCode)
- QR ordering flow: [qr-order.page.tsx](apps/web/app/qr-order/page.tsx) — ✅ UI ready
- Reservations page: [reservations.page.tsx](apps/web/app/dashboard/reservations/page.tsx) — ✅ UI ready

**TODO**:
- [ ] Generate QR codes per table (encode table ID)
- [ ] QR order flow links table → ordering → checkout
- [ ] Reservation system integration
- [ ] Table status tracking (Occupied/Available/Reserved)

---

### 6. **Finance Engine & Reconciliation**
**Status**: 🔴 MISSING  
**Business Value**: Profit tracking, tax compliance, investor reporting  
**Impact**: Accounting nightmares, tax penalties  

**TODO**:
- [ ] Daily revenue summary (Cash/Card/UPI breakdown)
- [ ] Expense tracking (Supplier payments, salaries, utilities)
- [ ] P&L statement generation
- [ ] GST calculation and filing assistance
- [ ] Bank reconciliation helpers
- [ ] Profit margin analysis by menu item

**Database Models to Create**:
- `daily_revenue` — aggregated daily sales by payment method
- `expenses` — operational costs
- `profit_loss` — period summaries

---

### 7. **Menu Management & Item Control**
**Status**: 🟡 PARTIAL  
**Business Value**: Restaurant can change offerings without code  
**Impact**: Menu obsolescence, inventory waste  

**Existing**:
- Menu page: [menu.page.tsx](apps/web/app/dashboard/menu/page.tsx) — ✅ UI ready
- Menu models: ✅ menu_items, menu_item_addons, menu_item_variants

**TODO**:
- [ ] Menu CRUD (Create/Read/Update/Delete items)
- [ ] Category management
- [ ] Pricing variants (Small/Medium/Large)
- [ ] Addon management (Extra spice, side items)
- [ ] Menu availability toggle (hide sold-out items)
- [ ] Image uploads for menu items

---

## MEDIUM PRIORITY — IMPROVES OPERATIONS

These improve efficiency but restaurant can operate without them initially.

### 1. **Notification Engine**
**Status**: 🟡 PARTIAL  
**Impact**: Staff awareness, customer notifications  

**TODO**:
- [ ] Order placed → notify kitchen + host
- [ ] Order ready → notify waiter + customer
- [ ] Payment failed → notify cashier + customer
- [ ] Low inventory → alert manager
- [ ] Support ticket → route to admin

**Files**:
- [notifications.service.ts](apps/api/src/notifications/notifications.service.ts)

---

### 2. **Analytics & Reporting Dashboard**
**Status**: 🟡 PARTIAL  
**Impact**: Business intelligence, decision support  

**Existing**:
- Analytics page: [analytics.page.tsx](apps/web/app/dashboard/analytics/page.tsx) — ✅ UI ready

**TODO**:
- [ ] Daily sales trend
- [ ] Hourly order volume
- [ ] Top-selling items
- [ ] Average order value
- [ ] Table occupancy rate
- [ ] Staff performance metrics

---

### 3. **Staff & Role Management**
**Status**: 🟡 PARTIAL  
**Impact**: Team organization, shift scheduling  

**Existing**:
- Staff page: [staff.page.tsx](apps/web/app/dashboard/staff/page.tsx) — UI exists

**TODO**:
- [ ] Create staff accounts (Owner/Manager/Cashier/Chef/Waiter)
- [ ] Assign roles with permission matrix
- [ ] Shift scheduling
- [ ] Attendance tracking
- [ ] Performance reviews

---

### 4. **CRM & Customer Tracking**
**Status**: 🟡 PARTIAL  
**Impact**: Customer loyalty, repeat business  

**TODO**:
- [ ] Customer profile with order history
- [ ] Phone/Email for SMS/Email marketing
- [ ] Loyalty points tracking
- [ ] Birthday/Anniversary offers
- [ ] Repeat customer discounts

---

### 5. **Reservation System**
**Status**: 🟡 PARTIAL  
**Impact**: Table planning, customer confidence  

**Existing**:
- Reservations page exists: ✅ UI ready
- Reservations model exists: ✅ Database ready

**TODO**:
- [ ] Reservation booking
- [ ] Calendar view
- [ ] SMS/Email confirmation
- [ ] No-show tracking
- [ ] Walk-in vs. pre-booked reporting

---

## LOW PRIORITY — VERSION 1.1 FEATURES

Can wait until production stability is confirmed.

### 1. **AI & Forecasting**
- Demand forecasting
- Inventory optimization recommendations
- Dynamic pricing suggestions

### 2. **Marketplace Integration**
- Zomato/Swiggy aggregation
- Order sync from delivery platforms

### 3. **HRMS (Human Resource Management)**
- Payroll integration
- Leave management
- Training modules

### 4. **Website Builder**
- Custom restaurant website
- Online ordering integration

### 5. **Loyalty & Rewards Platform**
- Gamification
- Digital wallet
- Referral programs

### 6. **Universal Workflow Automation**
- Event-triggered actions
- Business rule engine
- Webhook integrations

---

## CRITICAL FIX TRACKER

### ✅ COMPLETED

#### 1. Prisma Client Generation (FIXED)
**Issue**: `Property 'menu_item_ingredients' does not exist on type 'PrismaService'`  
**Root Cause**: Stale Prisma generated client  
**Solution**: Ran `npx prisma generate --schema prisma/schema.prisma`  
**Impact**: Backend now compiles successfully  

#### 2. React Hook Order Violation in SuperAdminPage (FIXED)
**Issue**: "React has detected a change in the order of Hooks called by SuperAdminPage"  
**Root Cause**: Early return with `if (!mounted)` placed after hook initialization but before other hooks  
**Solution**: Moved all hooks before the early return  
**File**: [super-admin.page.tsx](apps/web/app/super-admin/page.tsx)  
**Impact**: Admin portal now loads without console errors  

---

### 🔴 REMAINING ISSUES

#### 1. WebSocket Connection Error
**Issue**: `WebSocket connection to 'ws://localhost:3001/socket.io' failed: net::ERR_CONNECTION_REFUSED`  
**Root Cause**: API server not running  
**Solution**: Start API: `npm run dev` in apps/api  
**Severity**: ⚠️ Warning only — graceful fallback to polling

#### 2. Missing Page Error Handling
**Issue**: Some pages like `/dashboard/inventory` fetch from `/inventory/*` endpoints that may return 404  
**Root Cause**: API endpoints not fully tested with frontend  
**Solution**: 
  - Add error boundaries to all pages
  - Implement proper loading/error states
  - Fall back to mock data in dev mode

---

## TESTING MATRIX — PRODUCTION V1.0

| Feature | Status | Test Date | Tester | Notes |
|---------|--------|-----------|--------|-------|
| API Build | ✅ PASS | 2026-07-11 | System | `npm run build` succeeds |
| Web Build | ✅ PASS | 2026-07-11 | System | `npm run build` succeeds |
| Super Admin Portal | ✅ PASS | 2026-07-11 | System | Loads without React Hook errors |
| Dashboard Routes | ✅ PASS | 2026-07-11 | System | All 20+ dashboard routes load |
| Order Creation | 🟡 TODO | — | QA Lead | End-to-end test needed |
| Inventory Deduction | 🟡 TODO | — | QA Lead | Verify stock decrements on order |
| Payment Capture | 🟡 TODO | — | QA Lead | Test all payment methods |
| Kitchen Panel | 🟡 TODO | — | QA Lead | Real-time order updates |
| E2E Restaurant Workflow | 🟡 TODO | — | QA Lead | Full workflow from order to bill |

---

## DEPLOYMENT READINESS CHECKLIST

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] ESLint passes (no critical warnings)
- [ ] Prisma schema consistent with migrations
- [ ] No console errors/warnings in production build

### Database
- [ ] All migrations applied to production database
- [ ] Backup strategy documented and tested
- [ ] Disaster recovery plan in place

### API
- [ ] All endpoints tested and documented
- [ ] Rate limiting configured
- [ ] Error handling and logging comprehensive
- [ ] WebSocket stable for 1000+ concurrent connections

### Frontend
- [ ] All pages tested on Chrome/Safari/Firefox
- [ ] Mobile responsive (tested on iOS/Android)
- [ ] Offline fallback working
- [ ] Performance optimized (<3s initial load)

### Infrastructure
- [ ] SSL certificate installed
- [ ] CDN configured for static assets
- [ ] Server logs centralized
- [ ] Monitoring and alerting in place

### Documentation
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Deployment guide
- [ ] Troubleshooting runbook
- [ ] User manuals for each role

---

## NEXT IMMEDIATE ACTIONS

1. **Start API Server**: `npm run dev` in `/apps/api`
2. **Run Full E2E Test**: Create order → Kitchen prep → Billing → Inventory deduction
3. **Load Test**: 100 concurrent diners + 10 orders/sec
4. **Security Audit**: Payment data, user auth, RBAC
5. **Go/No-Go Decision**: Ready for beta launch?

---

**Prepared By**: CTO/Principal Architect  
**Last Updated**: 2026-07-11  
**Target Launch**: 2026-Q3
