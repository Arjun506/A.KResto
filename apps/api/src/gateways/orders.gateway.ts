import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import type { JwtUser } from '../common/types/jwt-user.interface';
import type { OrderResponseDto } from '../orders/dto/order-response.dto';

type SocketData = {
  user?: JwtUser;
  tenantId?: string;
};

type AuthenticatedSocket = Socket & {
  data: SocketData;
};

type JwtPayload = {
  sub: string;
  email: string;
  role: string;
  tenantId?: string | null;
};

@WebSocketGateway({
  cors: {
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map((s) => s.trim())
      : '*',
    credentials: true,
  },
})
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly socketTenants = new Map<string, string>();

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = this.extractToken(client);
      if (!token) {
        // Disallow joining tenant rooms for unauthenticated users
        // Guests can still connect to track specific orders via joinOrder, but they cannot join the restaurant-wide sync room.
        return;
      }

      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      const user: JwtUser = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        tenantId: payload.tenantId ?? undefined,
      };

      if (!user.tenantId && user.role !== 'SUPER_ADMIN') {
        client.disconnect(true);
        return;
      }

      const clientData = this.getSocketData(client);
      clientData.user = user;

      const allowedRoles = [
        'SUPER_ADMIN',
        'RESTAURANT_OWNER',
        'MANAGER',
        'CASHIER',
        'WAITER',
        'CHEF',
      ];
      if (user.tenantId && allowedRoles.includes(user.role)) {
        clientData.tenantId = user.tenantId;
        this.socketTenants.set(client.id, user.tenantId);
        await client.join(this.roomName(user.tenantId));
      }
    } catch {
      client.disconnect(true);
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    const tenantId = this.socketTenants.get(client.id);
    if (tenantId) {
      void client.leave(this.roomName(tenantId));
    }

    this.socketTenants.delete(client.id);
    const clientData = this.getSocketData(client);
    delete clientData.user;
    delete clientData.tenantId;
  }

  @SubscribeMessage('joinOrder')
  async handleJoinOrder(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { orderId: string },
  ) {
    if (payload?.orderId) {
      await client.join(`order:${payload.orderId}`);
      return { success: true, message: `Joined order:${payload.orderId}` };
    }
    return { success: false, message: 'Missing orderId' };
  }

  @SubscribeMessage('newOrder')
  handleNewOrder(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: unknown,
  ) {
    const tenantId = this.getSocketData(client).tenantId;
    if (!tenantId) {
      return { success: false, message: 'Missing tenant room' };
    }

    this.emitToTenant(tenantId, 'orderCreated', data);
    return { success: true };
  }

  emitOrderCreated(order: OrderResponseDto) {
    this.emitToTenant(order.tenantId, 'orderCreated', order);
    this.emitKitchenSync(order.tenantId, order);
    this.emitWaiterSync(order.tenantId, order);
  }

  emitOrderUpdated(order: OrderResponseDto) {
    this.emitToTenant(order.tenantId, 'orderUpdated', order);
    this.server.to(`order:${order.id}`).emit('orderUpdated', order);
    this.emitKitchenSync(order.tenantId, order);
    this.emitWaiterSync(order.tenantId, order);
  }

  emitOrderDeleted(tenantId: string, payload: { id: string }) {
    this.emitToTenant(tenantId, 'orderDeleted', payload);
    this.emitToTenant(tenantId, 'waiterOrderSync', payload);
  }

  emitOrderStatusChanged(order: OrderResponseDto) {
    this.emitToTenant(order.tenantId, 'orderStatusChanged', order);
    this.server.to(`order:${order.id}`).emit('orderStatusChanged', order);
    this.emitOrderUpdated(order);
  }

  emitTableAssigned(tenantId: string, payload: unknown) {
    this.emitToTenant(tenantId, 'tableAssigned', payload);
    this.emitToTenant(tenantId, 'waiterNotification', payload);
  }

  private emitKitchenSync(tenantId: string, order: OrderResponseDto) {
    const status = String(order.status);

    this.emitToTenant(tenantId, 'kitchenOrderSync', order);

    if (status === 'PREPARING') {
      this.emitToTenant(tenantId, 'kitchenOrderPreparing', order);
    }

    if (status === 'READY') {
      this.emitToTenant(tenantId, 'kitchenOrderReady', order);
    }

    if (status === 'COMPLETED') {
      this.emitToTenant(tenantId, 'kitchenOrderCompleted', order);
    }
  }

  private emitWaiterSync(tenantId: string, order: OrderResponseDto) {
    const status = String(order.status);

    this.emitToTenant(tenantId, 'waiterOrderSync', order);

    if (status === 'READY') {
      this.emitToTenant(tenantId, 'waiterNotification', {
        type: 'ORDER_READY',
        orderId: order.id,
        tableId: order.tableId,
      });
    }
  }

  private emitToTenant<TPayload>(
    tenantId: string,
    event: string,
    payload: TPayload,
  ) {
    this.server.to(this.roomName(tenantId)).emit(event, payload);
  }

  private roomName(tenantId: string) {
    return `restaurant:${tenantId}`;
  }

  private getSocketData(client: Socket): SocketData {
    return client.data as SocketData;
  }

  private extractToken(client: Socket): string | undefined {
    const auth = client.handshake.auth as { token?: unknown } | undefined;
    const authToken = auth?.token;
    if (typeof authToken === 'string' && authToken) return authToken;

    const queryToken = client.handshake.query?.token;
    if (typeof queryToken === 'string' && queryToken) return queryToken;

    const header = client.handshake.headers.authorization;
    if (typeof header === 'string' && header.startsWith('Bearer ')) {
      return header.slice('Bearer '.length);
    }

    return undefined;
  }
}
