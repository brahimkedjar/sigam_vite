// src/chat/chat.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './create-message.dto';
import { MessageDto } from './message.dto';
import { ConversationDto } from './conversation.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async sendMessage(senderId: number, createMessageDto: CreateMessageDto) {
    const { content, receiverId } = createMessageDto;

    // Get or create conversation
    let conversation = await this.prisma.conversation.findFirst({
      where: {
        OR: [
          { user1Id: senderId, user2Id: receiverId },
          { user1Id: receiverId, user2Id: senderId },
        ],
      },
    });

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          user1Id: Math.min(senderId, receiverId),
          user2Id: Math.max(senderId, receiverId),
        },
      });
    }

    // Create message
    const message = await this.prisma.message.create({
      data: {
        content,
        senderId,
        receiverId,
        conversationId: conversation.id,
      },
      include: {
        sender: {
          select: { id: true, nom: true, Prenom: true, username: true },
        },
        conversation: true,
      },
    });

    // Update conversation timestamp
    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    return this.toMessageDto(message);
  }

  async getConversations(userId: number): Promise<ConversationDto[]> {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: {
        user1: { select: { id: true, nom: true, Prenom: true, username: true } },
        user2: { select: { id: true, nom: true, Prenom: true, username: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: { select: { id: true, nom: true, Prenom: true, username: true } },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return Promise.all(
      conversations.map(async (conv) => {
        const otherUser = conv.user1Id === userId ? conv.user2 : conv.user1;
        const unreadCount = await this.prisma.message.count({
          where: {
            conversationId: conv.id,
            receiverId: userId,
            isRead: false,
          },
        });

        const lastMessage = conv.messages[0] ? this.toMessageDto(conv.messages[0]) : undefined;

        return new ConversationDto({
          id: conv.id,
          user1Id: conv.user1Id,
          user2Id: conv.user2Id,
          lastMessage,
          unreadCount,
          otherUser: {
            id: otherUser.id,
            nom: otherUser.nom,
            prenom: otherUser.Prenom, // Map Prenom to prenom
            username: otherUser.username,
          },
        });
      })
    );
  }

 async getAvailableUsers(currentUserId: number) {
  return this.prisma.user.findMany({
    where: {
      id: { not: currentUserId },
    },
    select: {
      id: true,
      nom: true,
      Prenom: true,
      username: true,
      email: true,
    },
    orderBy: { nom: 'asc' },
  });
}

  async getMessages(conversationId: number, userId: number): Promise<MessageDto[]> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation || (conversation.user1Id !== userId && conversation.user2Id !== userId)) {
      throw new NotFoundException('Conversation not found');
    }

    // Mark messages as read
    await this.prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    const messages = await this.prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: { select: { id: true, nom: true, Prenom: true, username: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    return messages.map(message => this.toMessageDto(message));
  }

  async getUnreadCount(userId: number): Promise<number> {
    return this.prisma.message.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });
  }

  private toMessageDto(message: any): MessageDto {
    return new MessageDto({
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      receiverId: message.receiverId,
      isRead: message.isRead,
      createdAt: message.createdAt,
      sender: message.sender ? {
        id: message.sender.id,
        nom: message.sender.nom,
        prenom: message.sender.Prenom, // Map Prenom to prenom
        username: message.sender.username,
      } : undefined,
      conversationId: message.conversationId,
    });
  }
}