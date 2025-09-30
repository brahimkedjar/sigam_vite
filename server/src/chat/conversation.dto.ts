import { MessageDto } from './message.dto';

export class ConversationDto {
  id: number;
  user1Id: number;
  user2Id: number;
  lastMessage?: MessageDto;
  unreadCount: number;
  otherUser: {
    id: number;
    nom: string;
    prenom: string;
    username: string;
  };

  constructor(partial: Partial<ConversationDto>) {
    Object.assign(this, partial);
  }
}