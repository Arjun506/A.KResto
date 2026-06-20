# 🔧 Backend API Fetchers - Complete Implementation

## Overview

Complete ready-to-use NestJS backend implementations for all API endpoints needed by the frontend.

---

## 📋 Menu Items API

### Controller

```typescript
// apps/api/src/menu/menu.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { apiSuccess } from '../common/responses/api-response';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  /**
   * Get all menu items for a restaurant
   * GET /menu/items?restaurantId=abc123
   */
  @Get('items')
  async getMenuItems(
    @Query('restaurantId') restaurantId: string,
    @Query('category') category?: string,
  ) {
    const items = await this.menuService.getMenuItems(restaurantId, category);
    return apiSuccess(items, 'Menu items fetched');
  }

  /**
   * Get menu categories
   * GET /menu/categories?restaurantId=abc123
   */
  @Get('categories')
  async getCategories(@Query('restaurantId') restaurantId: string) {
    const categories = await this.menuService.getCategories(restaurantId);
    return apiSuccess(categories, 'Categories fetched');
  }

  /**
   * Get single menu item
   * GET /menu/items/:id
   */
  @Get('items/:id')
  async getMenuItemById(@Param('id') id: string) {
    const item = await this.menuService.getMenuItemById(id);
    return apiSuccess(item, 'Menu item fetched');
  }

  /**
   * Create menu item (Owner only)
   * POST /menu/items
   */
  @Post('items')
  @UseGuards(JwtAuthGuard)
  async createMenuItem(
    @Req() req: AuthenticatedRequest,
    @Body() createMenuItemDto: CreateMenuItemDto,
  ) {
    const item = await this.menuService.createMenuItem(
      req.user,
      createMenuItemDto,
    );
    return apiSuccess(item, 'Menu item created', 201);
  }
}
```

### Service

```typescript
// apps/api/src/menu/menu.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';

interface MenuItemQuery {
  restaurantId: string;
  category?: string;
  isAvailable?: boolean;
}

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all menu items with optional filtering
   */
  async getMenuItems(restaurantId: string, category?: string) {
    const where: MenuItemQuery = {
      restaurantId,
      isAvailable: true,
    };

    if (category && category !== 'all') {
      where.category = category;
    }

    return this.prisma.menuItem.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        category: true,
        image: true,
        isPopular: true,
        isVegetarian: true,
        preparationTime: true,
        allergens: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get menu categories for a restaurant
   */
  async getCategories(restaurantId: string) {
    const categories = await this.prisma.menuCategory.findMany({
      where: { restaurantId },
      select: {
        id: true,
        name: true,
        icon: true,
        description: true,
        itemCount: true,
      },
      orderBy: { position: 'asc' },
    });

    return categories;
  }

  /**
   * Get single menu item
   */
  async getMenuItemById(id: string) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
      include: {
        category: true,
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Menu item not found');
    }

    return item;
  }

  /**
   * Create new menu item
   */
  async createMenuItem(user: User, dto: CreateMenuItemDto) {
    // Verify user is restaurant owner
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: dto.restaurantId },
    });

    if (restaurant.ownerId !== user.id) {
      throw new ForbiddenException('Not authorized');
    }

    return this.prisma.menuItem.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        category: dto.category,
        image: dto.image,
        isVegetarian: dto.isVegetarian,
        preparationTime: dto.preparationTime,
        allergens: dto.allergens,
        restaurantId: dto.restaurantId,
      },
    });
  }

  /**
   * Search menu items
   */
  async searchMenuItems(restaurantId: string, query: string) {
    return this.prisma.menuItem.findMany({
      where: {
        restaurantId,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
    });
  }

  /**
   * Get popular items
   */
  async getPopularItems(restaurantId: string, limit = 6) {
    return this.prisma.menuItem.findMany({
      where: {
        restaurantId,
        isPopular: true,
      },
      take: limit,
      orderBy: { orderCount: 'desc' },
    });
  }
}
```

### DTOs

```typescript
// apps/api/src/menu/dto/create-menu-item.dto.ts
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';

export class CreateMenuItemDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  category: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsBoolean()
  @IsOptional()
  isVegetarian?: boolean;

  @IsNumber()
  @IsOptional()
  preparationTime?: number; // in minutes

  @IsArray()
  @IsOptional()
  allergens?: string[];

  @IsString()
  restaurantId: string;
}
```

---

## 🛒 Orders API

### Controller

```typescript
// apps/api/src/orders/orders.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { apiSuccess } from '../common/responses/api-response';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * Create new order
   * POST /orders
   */
  @Post()
  async createOrder(
    @Req() req: AuthenticatedRequest,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    const order = await this.ordersService.createOrder(req.user, createOrderDto);
    return apiSuccess(order, 'Order created', 201);
  }

  /**
   * Get order by ID with full details
   * GET /orders/:orderId
   */
  @Get(':orderId')
  async getOrderById(@Param('orderId') orderId: string) {
    const order = await this.ordersService.getOrderById(orderId);
    return apiSuccess(order, 'Order fetched');
  }

  /**
   * Get user's orders
   * GET /orders/user/me
   */
  @Get('user/me')
  async getUserOrders(
    @Req() req: AuthenticatedRequest,
    @Query('limit') limit = 10,
    @Query('skip') skip = 0,
  ) {
    const orders = await this.ordersService.getUserOrders(
      req.user.id,
      Number(limit),
      Number(skip),
    );
    return apiSuccess(orders, 'User orders fetched');
  }

  /**
   * Get order status
   * GET /orders/:orderId/status
   */
  @Get(':orderId/status')
  async getOrderStatus(@Param('orderId') orderId: string) {
    const status = await this.ordersService.getOrderStatus(orderId);
    return apiSuccess(status, 'Order status fetched');
  }

  /**
   * Cancel order (if allowed)
   * POST /orders/:orderId/cancel
   */
  @Post(':orderId/cancel')
  async cancelOrder(
    @Param('orderId') orderId: string,
    @Body() { reason }: { reason: string },
  ) {
    const result = await this.ordersService.cancelOrder(orderId, reason);
    return apiSuccess(result, 'Order cancelled');
  }
}
```

### Service

```typescript
// apps/api/src/orders/orders.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import Razorpay from 'razorpay';

@Injectable()
export class OrdersService {
  private razorpay: Razorpay;

  constructor(private prisma: PrismaService) {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  /**
   * Create new order and initiate Razorpay order
   */
  async createOrder(user: User, dto: CreateOrderDto) {
    // Calculate totals
    const itemsTotal = dto.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const deliveryFee = itemsTotal > 0 ? 40 : 0;
    const tax = Math.round((itemsTotal + deliveryFee) * 0.18);
    const total = itemsTotal + deliveryFee + tax;

    try {
      // Create Razorpay order
      const razorpayOrder = await this.razorpay.orders.create({
        amount: Math.round(total * 100), // Convert to paise
        currency: 'INR',
        receipt: `order_${Date.now()}_${user.id}`,
        notes: {
          restaurantId: dto.restaurantId,
          userId: user.id,
          customerId: user.id,
        },
      });

      // Create order in database
      const order = await this.prisma.order.create({
        data: {
          userId: user.id,
          restaurantId: dto.restaurantId,
          status: 'pending',
          itemsTotal,
          deliveryFee,
          tax,
          total,
          customerEmail: dto.customerEmail,
          customerPhone: dto.customerPhone,
          deliveryAddress: dto.deliveryAddress,
          razorpayOrderId: razorpayOrder.id,
          paymentStatus: 'pending',
          items: {
            create: dto.items.map((item) => ({
              menuItemId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
          statusHistory: {
            create: {
              status: 'pending',
              notes: 'Order created',
            },
          },
        },
        include: {
          items: {
            include: {
              menuItem: true,
            },
          },
        },
      });

      return {
        id: order.id,
        razorpayOrderId: razorpayOrder.id,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to create order: ${error.message}`);
    }
  }

  /**
   * Get full order details
   */
  async getOrderById(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            menuItem: {
              select: {
                id: true,
                name: true,
                description: true,
                price: true,
                image: true,
              },
            },
          },
        },
        restaurant: {
          select: {
            id: true,
            name: true,
            image: true,
            phone: true,
          },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      ...order,
      estimatedDeliveryTime: this.calculateDeliveryTime(order.status),
    };
  }

  /**
   * Get user's order history
   */
  async getUserOrders(userId: string, limit: number, skip: number) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        items: {
          include: {
            menuItem: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip,
    });

    const total = await this.prisma.order.count({
      where: { userId },
    });

    return {
      orders,
      total,
      limit,
      skip,
      hasMore: skip + limit < total,
    };
  }

  /**
   * Get order status only
   */
  async getOrderStatus(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        paymentStatus: true,
        statusHistory: {
          select: {
            status: true,
            notes: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      orderId: order.id,
      status: order.status,
      paymentStatus: order.paymentStatus,
      estimatedDeliveryTime: this.calculateDeliveryTime(order.status),
      statusHistory: order.statusHistory,
    };
  }

  /**
   * Update order status (internal use)
   */
  async updateOrderStatus(
    orderId: string,
    newStatus: string,
    notes?: string,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Validate status transition
    const validTransitions: Record<string, string[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['preparing', 'cancelled'],
      preparing: ['ready'],
      ready: ['out_for_delivery'],
      out_for_delivery: ['delivered'],
      delivered: [],
      cancelled: [],
    };

    if (!validTransitions[order.status]?.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${order.status} to ${newStatus}`,
      );
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        statusHistory: {
          create: {
            status: newStatus,
            notes: notes || `Order status changed to ${newStatus}`,
          },
        },
      },
      include: {
        statusHistory: true,
      },
    });

    // Emit WebSocket event for real-time updates
    // this.ordersGateway.notifyOrderUpdate(orderId, updatedOrder);

    return updatedOrder;
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string, reason: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      throw new BadRequestException('Order cannot be cancelled at this stage');
    }

    return this.updateOrderStatus(orderId, 'cancelled', `Cancelled: ${reason}`);
  }

  /**
   * Calculate delivery time based on status
   */
  private calculateDeliveryTime(status: string): string {
    const timeMap: Record<string, string> = {
      pending: '30-40 minutes',
      confirmed: '25-35 minutes',
      preparing: '15-25 minutes',
      ready: '10-15 minutes',
      out_for_delivery: '5-10 minutes',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };
    return timeMap[status] || 'TBD';
  }
}
```

### DTOs

```typescript
// apps/api/src/orders/dto/create-order.dto.ts
import {
  IsString,
  IsNumber,
  IsArray,
  IsEmail,
  IsPhoneNumber,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString()
  id: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsString()
  restaurantId: string;

  @IsEmail()
  customerEmail: string;

  @IsPhoneNumber('IN') // Adjust country code as needed
  customerPhone: string;

  @IsString()
  deliveryAddress: string;
}
```

---

## 📅 Reservations API

### Controller

```typescript
// apps/api/src/reservations/reservations.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { apiSuccess } from '../common/responses/api-response';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  /**
   * Create new reservation
   * POST /reservations
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  async createReservation(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateReservationDto,
  ) {
    const reservation = await this.reservationsService.createReservation(
      req.user,
      dto,
    );
    return apiSuccess(reservation, 'Reservation created', 201);
  }

  /**
   * Get available slots
   * GET /reservations/availability?restaurantId=abc&date=2024-06-25
   */
  @Get('availability')
  async getAvailableSlots(
    @Query('restaurantId') restaurantId: string,
    @Query('date') date: string,
    @Query('partySize') partySize: number,
  ) {
    const slots = await this.reservationsService.getAvailableSlots(
      restaurantId,
      date,
      partySize,
    );
    return apiSuccess(slots, 'Available slots fetched');
  }

  /**
   * Get user reservations
   * GET /reservations/user/me
   */
  @Get('user/me')
  @UseGuards(JwtAuthGuard)
  async getUserReservations(@Req() req: AuthenticatedRequest) {
    const reservations = await this.reservationsService.getUserReservations(
      req.user.id,
    );
    return apiSuccess(reservations, 'User reservations fetched');
  }

  /**
   * Cancel reservation
   * DELETE /reservations/:id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async cancelReservation(@Param('id') id: string) {
    const result = await this.reservationsService.cancelReservation(id);
    return apiSuccess(result, 'Reservation cancelled');
  }
}
```

### Service

```typescript
// apps/api/src/reservations/reservations.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  private slotDuration = 90; // 90 minutes per reservation

  constructor(private prisma: PrismaService) {}

  /**
   * Create reservation
   */
  async createReservation(user: User, dto: CreateReservationDto) {
    // Check availability
    const availableSlots = await this.getAvailableSlots(
      dto.restaurantId,
      dto.date,
      dto.guests,
    );

    if (
      !availableSlots.some(
        (slot) => slot.time === dto.time && slot.available,
      )
    ) {
      throw new ConflictException('Time slot not available');
    }

    // Create reservation
    const reservation = await this.prisma.reservation.create({
      data: {
        userId: user.id,
        restaurantId: dto.restaurantId,
        date: new Date(dto.date),
        time: dto.time,
        guests: dto.guests,
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        specialRequests: dto.specialRequests,
        status: 'confirmed',
        confirmationCode: this.generateConfirmationCode(),
      },
    });

    // Send confirmation email
    // await this.emailService.sendReservationConfirmation(reservation);

    return {
      id: reservation.id,
      confirmationCode: reservation.confirmationCode,
      date: reservation.date,
      time: reservation.time,
      guests: reservation.guests,
      status: reservation.status,
    };
  }

  /**
   * Get available time slots
   */
  async getAvailableSlots(
    restaurantId: string,
    date: string,
    partySize: number,
  ) {
    // Get restaurant opening hours
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: {
        openingTime: true,
        closingTime: true,
        maxCapacity: true,
      },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    // Get existing reservations for the date
    const existingReservations = await this.prisma.reservation.findMany({
      where: {
        restaurantId,
        date: {
          gte: new Date(date),
          lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
        },
        status: 'confirmed',
      },
      select: {
        time: true,
        guests: true,
      },
    });

    // Generate available slots
    const slots = [];
    const [openHour, openMin] = restaurant.openingTime.split(':');
    const [closeHour, closeMin] = restaurant.closingTime.split(':');

    let currentHour = parseInt(openHour);
    let currentMin = parseInt(openMin);
    const closeHourInt = parseInt(closeHour);
    const closeMinInt = parseInt(closeMin);

    while (
      currentHour < closeHourInt ||
      (currentHour === closeHourInt && currentMin < closeMinInt)
    ) {
      const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
      
      // Check if slot is booked
      const bookedGuests = existingReservations
        .filter((res) => res.time === timeStr)
        .reduce((sum, res) => sum + res.guests, 0);

      const available =
        bookedGuests + partySize <= restaurant.maxCapacity;

      slots.push({
        time: timeStr,
        available,
        spotsRemaining: restaurant.maxCapacity - bookedGuests,
      });

      currentMin += 30; // 30-minute intervals
      if (currentMin >= 60) {
        currentMin -= 60;
        currentHour += 1;
      }
    }

    return slots;
  }

  /**
   * Get user reservations
   */
  async getUserReservations(userId: string) {
    return this.prisma.reservation.findMany({
      where: { userId },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            image: true,
            address: true,
            phone: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  /**
   * Cancel reservation
   */
  async cancelReservation(id: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return this.prisma.reservation.update({
      where: { id },
      data: { status: 'cancelled' },
    });
  }

  private generateConfirmationCode(): string {
    return `RES-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
}
```

---

## 🏪 Restaurant Info API

### Controller

```typescript
// apps/api/src/restaurants/restaurants.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { apiSuccess } from '../common/responses/api-response';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  /**
   * Get restaurant info
   * GET /restaurants/:id
   */
  @Get(':id')
  async getRestaurant(@Param('id') id: string) {
    const restaurant = await this.restaurantsService.getRestaurant(id);
    return apiSuccess(restaurant, 'Restaurant fetched');
  }

  /**
   * Get restaurant status
   * GET /restaurants/:id/status
   */
  @Get(':id/status')
  async getRestaurantStatus(@Param('id') id: string) {
    const status = await this.restaurantsService.getRestaurantStatus(id);
    return apiSuccess(status, 'Restaurant status fetched');
  }

  /**
   * Get restaurant ratings & reviews
   * GET /restaurants/:id/reviews
   */
  @Get(':id/reviews')
  async getReviews(@Param('id') id: string, @Query('limit') limit = 10) {
    const reviews = await this.restaurantsService.getReviews(
      id,
      Number(limit),
    );
    return apiSuccess(reviews, 'Reviews fetched');
  }
}
```

### Service

```typescript
// apps/api/src/restaurants/restaurants.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get restaurant full details
   */
  async getRestaurant(id: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        menuCategories: true,
        images: true,
      },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return {
      id: restaurant.id,
      name: restaurant.name,
      description: restaurant.description,
      image: restaurant.image,
      videoUrl: restaurant.videoUrl,
      address: restaurant.address,
      phone: restaurant.phone,
      email: restaurant.email,
      website: restaurant.website,
      cuisineTypes: restaurant.cuisineTypes,
      rating: restaurant.rating,
      totalReviews: restaurant.totalReviews,
      isOpen: this.isRestaurantOpen(restaurant),
      openingTime: restaurant.openingTime,
      closingTime: restaurant.closingTime,
      deliveryEnabled: restaurant.deliveryEnabled,
      deliveryFee: restaurant.deliveryFee,
      minimumOrder: restaurant.minimumOrder,
    };
  }

  /**
   * Get restaurant status
   */
  async getRestaurantStatus(id: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    const isOpen = this.isRestaurantOpen(restaurant);

    return {
      id: restaurant.id,
      isOpen,
      status: isOpen ? 'OPEN' : 'CLOSED',
      openingTime: restaurant.openingTime,
      closingTime: restaurant.closingTime,
      message: isOpen
        ? 'Restaurant is open for orders'
        : 'Restaurant is currently closed',
    };
  }

  /**
   * Get restaurant reviews
   */
  async getReviews(restaurantId: string, limit: number) {
    return this.prisma.review.findMany({
      where: { restaurantId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  private isRestaurantOpen(restaurant: any): boolean {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const currentDay = now.getDay();

    // Simple check - customize based on your requirements
    return (
      currentTime >= restaurant.openingTime &&
      currentTime < restaurant.closingTime
    );
  }
}
```

---

## ✅ Setup Checklist

- [ ] Create all controllers
- [ ] Create all services
- [ ] Create all DTOs
- [ ] Create Prisma schema for all models
- [ ] Run migrations
- [ ] Add error handling
- [ ] Add validation
- [ ] Add logging
- [ ] Add tests
- [ ] Deploy to staging
- [ ] Final testing

---

## 📚 Next Steps

1. Copy these services into your NestJS backend
2. Create corresponding Prisma models
3. Run database migrations
4. Configure environment variables
5. Test all endpoints
6. Connect frontend to backend

