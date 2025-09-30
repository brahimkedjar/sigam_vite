// src/chat/dto/create-message.dto.ts
export class CreateMessageDto {
  content: string;
  receiverId: number;
}

// src/chat/dto/message.dto.ts
export class MessageDto {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  isRead: boolean;
  createdAt: Date;
  sender?: { id: number; nom: string; prenom: string; username: string };
}

// src/chat/dto/conversation.dto.ts
export class ConversationDto {
  id: number;
  user1Id: number;
  user2Id: number;
  lastMessage?: MessageDto;
  unreadCount: number;
  otherUser: { id: number; nom: string; prenom: string; username: string };
}