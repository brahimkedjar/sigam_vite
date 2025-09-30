// src/chat/chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Logger } from '@nestjs/common';

interface AuthenticatedSocket extends Socket {
  data: {
    userId: number;
    username: string;
  };
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private connectedUsers = new Map<number, string>();

  constructor(private chatService: ChatService) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const { userId, username } = client.handshake.auth;
      
      this.logger.log(`Client connecting: ${client.id}, userId: ${userId}, username: ${username}`);
      
      if (!userId) {
        this.logger.warn('No userId provided, disconnecting client');
        client.disconnect();
        return;
      }

      this.connectedUsers.set(userId, client.id);
      client.data.userId = userId;
      client.data.username = username;

      // Join user to their personal room
      client.join(`user_${userId}`);

      this.logger.log(`User ${userId} (${username}) connected successfully`);
    } catch (error) {
      this.logger.error('Connection error:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.data.userId) {
      this.connectedUsers.delete(client.data.userId);
      this.logger.log(`User ${client.data.userId} disconnected`);
    }
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    client: AuthenticatedSocket,
    payload: { content: string; receiverId: number },
  ) {
    try {
      this.logger.log(`Message from user ${client.data.userId} to ${payload.receiverId}: ${payload.content}`);
      
      const message = await this.chatService.sendMessage(client.data.userId, {
        content: payload.content,
        receiverId: payload.receiverId,
      });

      // Send to sender
      client.emit('new_message', message);

      // Send to receiver if online
      const receiverSocketId = this.connectedUsers.get(payload.receiverId);
      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('new_message', message);
        this.logger.log(`Message delivered to user ${payload.receiverId}`);
      } else {
        this.logger.log(`User ${payload.receiverId} is offline, message stored`);
      }

      // Update conversations for both users
      this.updateUserConversations(client.data.userId);
      this.updateUserConversations(payload.receiverId);
    } catch (error) {
      this.logger.error('Failed to send message:', error);
      client.emit('error', { message: 'Failed to send message' });
    }
  }

  @SubscribeMessage('mark_as_read')
  async handleMarkAsRead(client: AuthenticatedSocket, conversationId: number) {
    try {
      await this.chatService.getMessages(conversationId, client.data.userId);
      this.updateUserConversations(client.data.userId);
    } catch (error) {
      this.logger.error('Failed to mark as read:', error);
      client.emit('error', { message: 'Failed to mark as read' });
    }
  }

  private async updateUserConversations(userId: number) {
    try {
      const conversations = await this.chatService.getConversations(userId);
      const socketId = this.connectedUsers.get(userId);
      if (socketId) {
        this.server.to(socketId).emit('conversations_updated', conversations);
      }
    } catch (error) {
      this.logger.error('Failed to update conversations:', error);
    }
  }
}