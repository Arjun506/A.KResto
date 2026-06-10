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
  restaurantId?: string;
};

type AuthenticatedSocket = Socket & {
  data: SocketData;
};

type JwtPayload = {
  sub: string;
  email: string;
  role: string;
  restaurantId?: string | null;
};

@WebSocketGateway({
  cors: {
    origin: '*',
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
        const restaurantId = client.handshake.query?.restaurantId;
        if (typeof restaurantId === 'string' && restaurantId) {
          const clientData = this.getSocketData(client);
          clientData.restaurantId = restaurantId;
          this.socketTenants.set(client.id, restaurantId);
          await client.join(this.roomName(restaurantId));
          return;
        }
        client.disconnect(true);
        return;
      }

      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      const user: JwtUser = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        restaurantId: payload.restaurantId ?? undefined,
      };

      if (!user.restaurantId && user.role !== 'SUPER_ADMIN') {
        client.disconnect(true);
        return;
      }

      const clientData = this.getSocketData(client);
      clientData.user = user;

      if (user.restaurantId) {
        clientData.restaurantId = user.restaurantId;
        this.socketTenants.set(client.id, user.restaurantId);
        await client.join(this.roomName(user.restaurantId));
      }
    } catch {
      client.disconnect(true);
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    const restaurantId = this.socketTenants.get(client.id);
    if (restaurantId) {
      void client.leave(this.roomName(restaurantId));
    }

    this.socketTenants.delete(client.id);
    const clientData = this.getSocketData(client);
    delete clientData.user;
    delete clientData.restaurantId;
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
    const restaurantId = this.getSocketData(client).restaurantId;
    if (!restaurantId) {
      return { success: false, message: 'Missing tenant room' };
    }

    this.emitToTenant(restaurantId, 'orderCreated', data);
    return { success: true };
  }

  emitOrderCreated(order: OrderResponseDto) {
    this.emitToTenant(order.restaurantId, 'orderCreated', order);
    this.emitKitchenSync(order.restaurantId, order);
    this.emitWaiterSync(order.restaurantId, order);
  }

  emitOrderUpdated(order: OrderResponseDto) {
    this.emitToTenant(order.restaurantId, 'orderUpdated', order);
    this.server.to(`order:${order.id}`).emit('orderUpdated', order);
    this.emitKitchenSync(order.restaurantId, order);
    this.emitWaiterSync(order.restaurantId, order);
  }

  emitOrderDeleted(restaurantId: string, payload: { id: string }) {
    this.emitToTenant(restaurantId, 'orderDeleted', payload);
    this.emitToTenant(restaurantId, 'waiterOrderSync', payload);
  }

  emitOrderStatusChanged(order: OrderResponseDto) {
    this.emitToTenant(order.restaurantId, 'orderStatusChanged', order);
    this.server.to(`order:${order.id}`).emit('orderStatusChanged', order);
    this.emitOrderUpdated(order);
  }

  emitTableAssigned(restaurantId: string, payload: unknown) {
    this.emitToTenant(restaurantId, 'tableAssigned', payload);
    this.emitToTenant(restaurantId, 'waiterNotification', payload);
  }

  private emitKitchenSync(restaurantId: string, order: OrderResponseDto) {
    const status = String(order.status);

    this.emitToTenant(restaurantId, 'kitchenOrderSync', order);

    if (status === 'PREPARING') {
      this.emitToTenant(restaurantId, 'kitchenOrderPreparing', order);
    }

    if (status === 'READY') {
      this.emitToTenant(restaurantId, 'kitchenOrderReady', order);
    }

    if (status === 'COMPLETED') {
      this.emitToTenant(restaurantId, 'kitchenOrderCompleted', order);
    }
  }

  private emitWaiterSync(restaurantId: string, order: OrderResponseDto) {
    const status = String(order.status);

    this.emitToTenant(restaurantId, 'waiterOrderSync', order);

    if (status === 'READY') {
      this.emitToTenant(restaurantId, 'waiterNotification', {
        type: 'ORDER_READY',
        orderId: order.id,
        tableId: order.tableId,
      });
    }
  }

  private emitToTenant<TPayload>(
    restaurantId: string,
    event: string,
    payload: TPayload,
  ) {
    this.server.to(this.roomName(restaurantId)).emit(event, payload);
  }

  private roomName(restaurantId: string) {
    return `restaurant:${restaurantId}`;
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
