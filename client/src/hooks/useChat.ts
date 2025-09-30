// hooks/useChat.ts
import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import axios, { AxiosError } from 'axios';
import { useAuthStore } from '@/src/store/useAuthStore';

export interface User {
  id: number;
  nom: string;
  Prenom: string;
  username: string;
  email: string;
}

export interface Message {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  isRead: boolean;
  createdAt: Date;
  sender?: User;
  conversationId: number;
}

export interface Conversation {
  id: number;
  user1Id: number;
  user2Id: number;
  lastMessage?: Message;
  unreadCount: number;
  otherUser: User;
}

export const useChat = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  
  const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const { auth } = useAuthStore();
const [availableUsers, setAvailableUsers] = useState<User[]>([]);

const loadAvailableUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${apiURL}/api/chat/users`, {
        headers: {
          'x-user-id': auth.id?.toString(),
          'x-user-name': auth.username || '',
        },
      });
      setAvailableUsers(response.data);
    } catch (error) {
      console.error('Failed to load available users:', error);
    }
  }, [apiURL, auth.id, auth.username]);

  useEffect(() => {
    if (!auth.id) return;

    const newSocket = io(apiURL, {
      auth: {
        userId: auth.id,
        username: auth.username,
      },
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to chat server');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from chat server');
    });

    newSocket.on('new_message', (message: Message) => {
      setMessages(prev => [...prev, message]);
      setConversations(prev => updateConversations(prev, message));
      setUnreadCount(prev => prev + 1);
    });

    newSocket.on('conversations_updated', (updatedConversations: Conversation[]) => {
      setConversations(updatedConversations);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [apiURL, auth.id, auth.username]);

  const updateConversations = (conversations: Conversation[], message: Message): Conversation[] => {
    return conversations.map(conv => {
      if (conv.id === message.conversationId) {
        return { ...conv, lastMessage: message };
      }
      return conv;
    });
  };

  const loadConversations = useCallback(async () => {
    try {
      const response = await axios.get(`${apiURL}/api/chat/conversations`, {
        headers: {
          'x-user-id': auth.id?.toString(),
          'x-user-name': auth.username || '',
        },
      });
      setConversations(response.data);
   } catch (error: unknown) {
  if (error instanceof AxiosError) {
    console.error('Failed to load conversations:', error.message);
    console.error('Error details:', error.response?.data);
  } else {
    console.error('Unexpected error:', error);
  }
}
  }, [apiURL, auth.id, auth.username]);

  const loadMessages = useCallback(async (conversationId: number) => {
    try {
      const response = await axios.get(`${apiURL}/api/chat/conversation/${conversationId}/messages`, {
        headers: {
          'x-user-id': auth.id?.toString(),
          'x-user-name': auth.username || '',
        },
      });
      setMessages(response.data);
      if (socket) {
        socket.emit('mark_as_read', conversationId);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  }, [socket, apiURL, auth.id, auth.username]);

  const sendMessage = useCallback(async (content: string, receiverId: number) => {
    if (socket) {
      socket.emit('send_message', { content, receiverId });
    }
  }, [socket]);

  const loadUnreadCount = useCallback(async () => {
    try {
      const response = await axios.get(`${apiURL}/api/chat/unread-count`, {
        headers: {
          'x-user-id': auth.id?.toString(),
          'x-user-name': auth.username || '',
        },
      });
      setUnreadCount(response.data);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  }, [apiURL, auth.id, auth.username]);

  return {
    socket,
    conversations,
    selectedConversation,
    messages,
    unreadCount,
    isConnected,
    loadConversations,
    loadMessages,
    sendMessage,
    loadUnreadCount,
    setSelectedConversation,
      availableUsers,
  loadAvailableUsers
  };
};