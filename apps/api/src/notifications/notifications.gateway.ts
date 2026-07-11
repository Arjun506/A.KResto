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
    origin:
      (process.env.SOCKETIO_ORIGINS ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean).length > 0
        ? (process.env.SOCKETIO_ORIGINS ?? '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : false,
  },
})
@Injectable()
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
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
        restaurantId: payload.restaurantId ?? undefined,
      };

      client.data = {
        user,
        restaurantId: user.restaurantId,
      };

      this.socketUsers.set(client.id, user.id);

      // Join user specific room
      await client.join(`user:${user.id}`);
      
      // Join tenant specific room if user is scoped
      if (user.restaurantId) {
        await client.join(`tenant:${user.restaurantId}`);
      }

      this.logger.debug(`Client ${client.id} authenticated for user ${user.id}`);
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
    if (client.data?.restaurantId) {
      void client.leave(`tenant:${client.data.restaurantId}`);
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
