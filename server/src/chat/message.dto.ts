export class MessageDto {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  isRead: boolean;
  createdAt: Date;
  sender?: {
    id: number;
    nom: string;
    prenom: string;
    username: string;
  };
  conversationId?: number;

  constructor(partial: Partial<MessageDto>) {
    Object.assign(this, partial);
  }
}