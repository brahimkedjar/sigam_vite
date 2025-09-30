// src/chat/chat.controller.ts
import { Controller, Get, Post, Body, Param, Req, UnauthorizedException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './create-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
    private prisma: PrismaService

  private extractUserIdFromRequest(req: any): number {
    // Check for custom header first
    const userIdHeader = req.headers['x-user-id'];
    if (userIdHeader) {
      const userId = parseInt(userIdHeader, 10);
      if (!isNaN(userId)) {
        return userId;
      }
    }

    // Fallback to token if custom header not available
    const authHeader = req.headers?.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      if (token !== 'null') {
        try {
          const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
          return payload.id || payload.sub;
        } catch (error) {
          throw new UnauthorizedException('Invalid token');
        }
      }
    }

    throw new UnauthorizedException('User ID not provided');
  }

  @Post('message')
  async sendMessage(@Req() req: any, @Body() createMessageDto: CreateMessageDto) {
    const userId = this.extractUserIdFromRequest(req);
    return this.chatService.sendMessage(userId, createMessageDto);
  }

  @Get('conversations')
  async getConversations(@Req() req: any) {
    const userId = this.extractUserIdFromRequest(req);
    return this.chatService.getConversations(userId);
  }

  @Get('conversation/:id/messages')
  async getMessages(@Req() req: any, @Param('id') id: string) {
    const userId = this.extractUserIdFromRequest(req);
    return this.chatService.getMessages(+id, userId);
  }

  @Get('unread-count')
  async getUnreadCount(@Req() req: any) {
    const userId = this.extractUserIdFromRequest(req);
    return this.chatService.getUnreadCount(userId);
  }

@Get('users')
async getAvailableUsers(@Req() req: any) {
  const userId = this.extractUserIdFromRequest(req);
  return this.chatService.getAvailableUsers(userId);
}
}