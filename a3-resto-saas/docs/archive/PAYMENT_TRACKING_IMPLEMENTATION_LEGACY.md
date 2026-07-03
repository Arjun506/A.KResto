# 💳 Payment Gateway & Order Tracking Implementation

## 1. Razorpay Payment Integration

### Setup & Configuration

**Step 1: Install Razorpay SDK**

```bash
# Frontend (already included via CDN)
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>

# Backend
npm install razorpay
```

**Step 2: Environment Variables**

```env
# .env.local (Frontend)
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx

# .env (Backend)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxx
```

### Frontend Implementation

**Create Order & Initiate Payment**:

```typescript
// services/payment.service.ts
export class PaymentService {
    private razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

    async initiatePayment(order: Order): Promise<void> {
        try {
            // Step 1: Create order on backend
            const orderResponse = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    items: order.items,
                    restaurantId: order.restaurantId,
                    customerEmail: order.customerEmail,
                    customerPhone: order.customerPhone,
                    deliveryAddress: order.deliveryAddress
                })
            });

            const { data: createdOrder } = await orderResponse.json();

            // Step 2: Open Razorpay checkout
            const options = {
                key: this.razorpayKeyId,
                amount: Math.round(createdOrder.total * 100), // Convert to paise
                currency: 'INR',
                name: 'AK Resto',
                description: `Order #${createdOrder.id}`,
                order_id: createdOrder.razorpayOrderId,
                
                handler: async (response: RazorpayResponse) => {
                    await this.verifyPayment(response, createdOrder.id);
                },

                prefill: {
                    name: order.customerName,
                    email: order.customerEmail,
                    contact: order.customerPhone
                },

                notes: {
                    orderId: createdOrder.id,
                    restaurantId: order.restaurantId
                },

                theme: {
                    color: '#c9a87c'
                },

                modal: {
                    ondismiss: () => {
                        console.log('Payment cancelled');
                    }
                }
            };

            const razorpay = new (window as any).Razorpay(options);
            razorpay.open();

        } catch (error) {
            console.error('Payment initiation failed:', error);
            throw new Error('Failed to initiate payment');
        }
    }

    private async verifyPayment(
        response: RazorpayResponse,
        orderId: string
    ): Promise<void> {
        try {
            const verifyResponse = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    orderId,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature
                })
            });

            const { success, data } = await verifyResponse.json();

            if (success) {
                // Payment successful
                this.handlePaymentSuccess(data);
            } else {
                throw new Error('Payment verification failed');
            }
        } catch (error) {
            console.error('Payment verification failed:', error);
            this.handlePaymentFailure(error);
        }
    }

    private handlePaymentSuccess(paymentData: PaymentVerificationResponse): void {
        // Update UI
        showToast('Payment successful! Your order has been confirmed.', 'success');
        
        // Clear cart
        cartItems = [];
        updateCart();
        
        // Close cart panel
        closeCart();
        
        // Redirect to order tracking
        switchTab('orders');
        trackOrderById(paymentData.orderId);
    }

    private handlePaymentFailure(error: any): void {
        showToast('Payment failed. Please try again.', 'error');
        console.error('Payment error:', error);
    }
}
```

### Backend Implementation (NestJS)

**Order Creation Controller**:

```typescript
// orders/orders.controller.ts
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
    constructor(private ordersService: OrdersService) {}

    @Post()
    async createOrder(
        @Req() req: AuthenticatedRequest,
        @Body() createOrderDto: CreateOrderDto
    ) {
        return await this.ordersService.createOrder(req.user, createOrderDto);
    }
}
```

**Order Service**:

```typescript
// orders/orders.service.ts
import Razorpay from 'razorpay';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
    private razorpay: Razorpay;

    constructor(private prisma: PrismaService) {
        this.razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
    }

    async createOrder(user: User, createOrderDto: CreateOrderDto) {
        // Calculate total
        const itemsTotal = createOrderDto.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
        const deliveryFee = itemsTotal > 0 ? 40 : 0;
        const tax = (itemsTotal + deliveryFee) * 0.18;
        const total = itemsTotal + deliveryFee + tax;

        try {
            // Step 1: Create Razorpay Order
            const razorpayOrder = await this.razorpay.orders.create({
                amount: Math.round(total * 100), // Convert to paise
                currency: 'INR',
                receipt: `order_${Date.now()}`,
                notes: {
                    restaurantId: createOrderDto.restaurantId,
                    userId: user.id
                }
            });

            // Step 2: Save Order to Database
            const order = await this.prisma.order.create({
                data: {
                    userId: user.id,
                    restaurantId: createOrderDto.restaurantId,
                    status: 'pending',
                    itemsTotal,
                    deliveryFee,
                    tax,
                    total,
                    customerEmail: createOrderDto.customerEmail,
                    customerPhone: createOrderDto.customerPhone,
                    deliveryAddress: createOrderDto.deliveryAddress,
                    razorpayOrderId: razorpayOrder.id,
                    paymentStatus: 'pending',
                    items: {
                        create: createOrderDto.items.map(item => ({
                            menuItemId: item.id,
                            quantity: item.quantity,
                            price: item.price
                        }))
                    }
                }
            });

            return {
                success: true,
                data: {
                    id: order.id,
                    razorpayOrderId: razorpayOrder.id,
                    total: order.total,
                    status: order.status
                }
            };
        } catch (error) {
            throw new Error(`Failed to create order: ${error.message}`);
        }
    }

    async verifyPayment(verifyPaymentDto: VerifyPaymentDto) {
        const crypto = require('crypto');

        // Step 1: Verify Razorpay Signature
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        const body = `${verifyPaymentDto.razorpayOrderId}|${verifyPaymentDto.razorpayPaymentId}`;
        hmac.update(body);
        const generatedSignature = hmac.digest('hex');

        if (generatedSignature !== verifyPaymentDto.razorpaySignature) {
            throw new Error('Invalid payment signature');
        }

        // Step 2: Update Order Status
        const order = await this.prisma.order.update({
            where: { razorpayOrderId: verifyPaymentDto.razorpayOrderId },
            data: {
                paymentStatus: 'completed',
                status: 'confirmed',
                razorpayPaymentId: verifyPaymentDto.razorpayPaymentId,
                paidAt: new Date()
            }
        });

        return {
            success: true,
            data: {
                orderId: order.id,
                paymentStatus: order.paymentStatus,
                transactionId: order.razorpayPaymentId
            }
        };
    }
}
```

**Payment Webhook Handler**:

```typescript
// payments/payments.controller.ts
@Post('webhook')
async handlePaymentWebhook(@Body() payload: any, @Headers() headers: any) {
    const crypto = require('crypto');
    const signature = headers['x-razorpay-signature'];
    
    const body = JSON.stringify(payload);
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET);
    hmac.update(body);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== signature) {
        throw new UnauthorizedException('Invalid webhook signature');
    }

    // Handle different webhook events
    switch (payload.event) {
        case 'payment.authorized':
            await this.handlePaymentAuthorized(payload);
            break;
        case 'payment.failed':
            await this.handlePaymentFailed(payload);
            break;
        case 'refund.created':
            await this.handleRefund(payload);
            break;
    }

    return { received: true };
}
```

---

## 2. Order Tracking System

### Frontend Order Tracking

**Track Order by ID**:

```typescript
// services/order-tracking.service.ts
export class OrderTrackingService {
    async trackOrder(orderId: string): Promise<OrderStatus> {
        const response = await fetch(`/api/orders/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Order not found');
        }

        return response.json();
    }

    displayOrderStatus(order: OrderStatus): void {
        const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];
        const currentStatusIdx = statuses.indexOf(order.status);

        const timeline = document.getElementById('orderStatus');
        timeline.innerHTML = `
            <div class="space-y-8">
                <div class="flex justify-between items-end">
                    ${statuses.map((status, idx) => `
                        <div class="flex flex-col items-center flex-1 relative">
                            <!-- Status Dot -->
                            <div class="w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                                idx <= currentStatusIdx 
                                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black' 
                                    : 'bg-gray-700 text-gray-400'
                            } mb-4 font-bold">
                                ${idx < currentStatusIdx ? '✓' : idx + 1}
                            </div>
                            
                            <!-- Connecting Line -->
                            ${idx < statuses.length - 1 ? `
                                <div class="absolute top-6 left-1/2 w-1/2 h-1 transform translate-x-1/2 ${
                                    idx < currentStatusIdx ? 'bg-yellow-400' : 'bg-gray-700'
                                }"></div>
                            ` : ''}
                            
                            <!-- Status Label -->
                            <span class="text-sm font-medium capitalize text-center">
                                ${status.replace(/_/g, ' ')}
                            </span>
                            
                            <!-- Timestamp -->
                            ${order.statusHistory[idx] ? `
                                <span class="text-xs text-gray-400 mt-1">
                                    ${new Date(order.statusHistory[idx].timestamp).toLocaleString()}
                                </span>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>

                <!-- Order Details -->
                <div class="glass rounded-lg p-6 space-y-3">
                    <h3 class="font-bold text-lg">Order #${order.id}</h3>
                    
                    <div>
                        <p class="text-gray-400 text-sm">Items</p>
                        <ul class="space-y-1 mt-1">
                            ${order.items.map(item => `
                                <li class="text-sm">
                                    ${item.quantity}x ${item.menuItem.name}
                                </li>
                            `).join('')}
                        </ul>
                    </div>

                    <div>
                        <p class="text-gray-400 text-sm">Delivery Address</p>
                        <p class="text-sm">${order.deliveryAddress}</p>
                    </div>

                    <div>
                        <p class="text-gray-400 text-sm">Estimated Delivery</p>
                        <p class="text-sm font-bold">
                            ${order.estimatedDeliveryTime || 'Calculating...'}
                        </p>
                    </div>

                    <div class="border-t border-yellow-900/20 pt-3">
                        <p class="text-gray-400 text-sm">Total Amount</p>
                        <p class="text-lg font-bold text-yellow-400">₹${order.total}</p>
                    </div>
                </div>

                <!-- Contact Restaurant -->
                <button class="btn-secondary w-full" onclick="contactRestaurant('${order.restaurantId}')">
                    📞 Contact Restaurant
                </button>
            </div>
        `;
    }

    subscribeToOrderUpdates(orderId: string, callback: (order: OrderStatus) => void): void {
        // Use WebSocket for real-time updates
        const socket = io(API_BASE_URL);
        socket.on('connect', () => {
            socket.emit('subscribe:order', { orderId });
            socket.on('order:status-update', callback);
        });
    }

    startPolling(orderId: string, interval: number = 5000): void {
        const pollInterval = setInterval(async () => {
            try {
                const order = await this.trackOrder(orderId);
                this.displayOrderStatus(order);

                // Stop polling when delivered
                if (order.status === 'delivered') {
                    clearInterval(pollInterval);
                }
            } catch (error) {
                console.error('Polling error:', error);
            }
        }, interval);
    }
}
```

### Backend Order Status Management

**Order Service with Status Updates**:

```typescript
// orders/orders.service.ts
@Injectable()
export class OrdersService {
    constructor(
        private prisma: PrismaService,
        private eventsGateway: OrdersGateway
    ) {}

    async updateOrderStatus(
        orderId: string,
        newStatus: OrderStatus,
        notes?: string
    ): Promise<Order> {
        // Validate status transition
        const validTransitions = {
            'pending': ['confirmed'],
            'confirmed': ['preparing'],
            'preparing': ['ready'],
            'ready': ['out_for_delivery'],
            'out_for_delivery': ['delivered'],
            'delivered': []
        };

        const order = await this.prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!validTransitions[order.status]?.includes(newStatus)) {
            throw new BadRequestException(
                `Cannot transition from ${order.status} to ${newStatus}`
            );
        }

        // Update order
        const updatedOrder = await this.prisma.order.update({
            where: { id: orderId },
            data: {
                status: newStatus,
                statusHistory: {
                    create: {
                        status: newStatus,
                        notes,
                        timestamp: new Date()
                    }
                },
                // Auto-calculate estimated delivery time
                estimatedDeliveryTime: this.calculateDeliveryTime(newStatus)
            },
            include: {
                items: { include: { menuItem: true } },
                statusHistory: true
            }
        });

        // Emit real-time update via WebSocket
        this.eventsGateway.notifyOrderUpdate(orderId, updatedOrder);

        // Send status email to customer
        await this.emailService.sendOrderStatusUpdate(updatedOrder);

        return updatedOrder;
    }

    private calculateDeliveryTime(status: OrderStatus): string {
        const timeMap = {
            'pending': '30-40 minutes',
            'confirmed': '25-35 minutes',
            'preparing': '15-25 minutes',
            'ready': '10-15 minutes',
            'out_for_delivery': '5-10 minutes',
            'delivered': 'Delivered'
        };
        return timeMap[status] || 'TBD';
    }

    async getRecentOrders(userId: string, limit: number = 10) {
        return this.prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: {
                restaurant: true,
                items: { include: { menuItem: true } }
            }
        });
    }
}
```

**WebSocket Gateway for Real-Time Updates**:

```typescript
// gateways/orders.gateway.ts
import { WebSocketGateway, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({
    cors: { origin: '*' },
    namespace: 'orders'
})
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private userSockets: Map<string, Socket[]> = new Map();

    handleConnection(socket: Socket) {
        console.log(`Client connected: ${socket.id}`);
    }

    handleDisconnect(socket: Socket) {
        console.log(`Client disconnected: ${socket.id}`);
    }

    @SubscribeMessage('subscribe:order')
    handleSubscribeOrder(socket: Socket, data: { orderId: string }) {
        socket.join(`order:${data.orderId}`);
        console.log(`Socket ${socket.id} subscribed to order ${data.orderId}`);
    }

    notifyOrderUpdate(orderId: string, order: Order) {
        this.server.to(`order:${orderId}`).emit('order:status-update', order);
    }

    notifyUserOrders(userId: string, orders: Order[]) {
        this.server.to(`user:${userId}`).emit('user:orders-update', orders);
    }

    @SubscribeMessage('unsubscribe:order')
    handleUnsubscribeOrder(socket: Socket, data: { orderId: string }) {
        socket.leave(`order:${data.orderId}`);
    }
}
```

---

## 3. Error Handling & Recovery

### Frontend Error Handling

```typescript
// services/error-handler.service.ts
export class ErrorHandler {
    static handlePaymentError(error: Error): void {
        switch (error.message) {
            case 'Payment failed':
                showToast('Payment failed. Please try again.', 'error');
                break;
            case 'Invalid payment signature':
                showToast('Payment could not be verified. Please contact support.', 'error');
                break;
            case 'Order not found':
                showToast('Order not found. Please check the order ID.', 'error');
                break;
            default:
                showToast('An error occurred. Please try again.', 'error');
        }
    }

    static handleNetworkError(): void {
        showToast('Network error. Please check your connection.', 'error');
    }

    static handleTimeout(): void {
        showToast('Request timeout. Please try again.', 'error');
    }
}
```

### Backend Error Handling

```typescript
// common/filters/payment-exception.filter.ts
@Catch(PaymentException)
export class PaymentExceptionFilter implements ExceptionFilter {
    catch(exception: PaymentException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        response.status(400).json({
            success: false,
            error: {
                code: exception.code,
                message: exception.message,
                timestamp: new Date().toISOString()
            }
        });
    }
}
```

---

## 4. Testing

### Unit Tests

```typescript
// orders/orders.service.spec.ts
describe('OrdersService', () => {
    let service: OrdersService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [OrdersService, PrismaService]
        }).compile();

        service = module.get<OrdersService>(OrdersService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    describe('createOrder', () => {
        it('should create order and return razorpay order id', async () => {
            const mockOrder = {
                items: [{ id: '1', quantity: 2, price: 249 }],
                restaurantId: 'rest1',
                customerEmail: 'test@example.com'
            };

            const result = await service.createOrder(mockOrder);
            expect(result.razorpayOrderId).toBeDefined();
        });
    });

    describe('updateOrderStatus', () => {
        it('should update order status', async () => {
            const result = await service.updateOrderStatus('ord1', 'confirmed');
            expect(result.status).toBe('confirmed');
        });

        it('should reject invalid status transition', async () => {
            await expect(
                service.updateOrderStatus('ord1', 'invalid_status')
            ).rejects.toThrow();
        });
    });
});
```

---

## ✅ Checklist

- [ ] Set up Razorpay account and get API keys
- [ ] Configure environment variables
- [ ] Implement order creation endpoint
- [ ] Implement payment verification
- [ ] Implement order tracking
- [ ] Set up WebSocket for real-time updates
- [ ] Implement status email notifications
- [ ] Add payment webhook handler
- [ ] Test payment flow end-to-end
- [ ] Test order status updates
- [ ] Implement error handling
- [ ] Add unit tests
- [ ] Test on production-like environment
- [ ] Deploy to staging
- [ ] Final production testing

