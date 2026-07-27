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
import { Injectable, Logger } from '@nestjs/common';
import type { JwtUser } from '../common/types/jwt-user.interface';

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
@Injectable()
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private readonly socketUsers = new Map<string, string>(); // socketId -> userId

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = this.extractToken(client);
      if (!token) {
        client.disconnect(true);
        return;
      }

      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      const user: JwtUser = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        tenantId: payload.tenantId ?? undefined,
      };

      client.data = {
        user,
        tenantId: user.tenantId,
      };

      this.socketUsers.set(client.id, user.id);

      // Join user specific room
      await client.join(`user:${user.id}`);

      // Join tenant specific room if user is scoped and is a staff member
      const allowedRoles = [
        'SUPER_ADMIN',
        'RESTAURANT_OWNER',
        'MANAGER',
        'CASHIER',
        'WAITER',
        'CHEF',
      ];
      if (user.tenantId && allowedRoles.includes(user.role)) {
        await client.join(`tenant:${user.tenantId}`);
      }

      this.logger.debug(
        `Client ${client.id} authenticated for user ${user.id}`,
      );
    } catch (err) {
      this.logger.error('WebSocket connection authentication failed', err);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    const userId = this.socketUsers.get(client.id);
    if (userId) {
      void client.leave(`user:${userId}`);
    }
    if (client.data?.tenantId) {
      void client.leave(`tenant:${client.data.tenantId}`);
    }
    this.socketUsers.delete(client.id);
    this.logger.debug(`Client ${client.id} disconnected`);
  }

  /**
   * Push a notification to a specific user
   */
  emitNotification(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('notification', notification);
  }

  /**
   * Push a notification to all users of a specific tenant
   */
  emitTenantNotification(tenantId: string, notification: any) {
    this.server.to(`tenant:${tenantId}`).emit('notification', notification);
  }

  private extractToken(client: Socket): string | null {
    const authHeader = client.handshake.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
    const tokenQuery = client.handshake.query?.token;
    if (typeof tokenQuery === 'string') {
      return tokenQuery;
    }
    return null;
  }
}
