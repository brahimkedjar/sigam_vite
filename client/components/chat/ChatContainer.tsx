import React, { useEffect } from 'react';
import { useChat } from '../../src/hooks/useChat';
import { ChatSidebar } from './ChatSidebar';
import { ChatWindow } from './ChatWindow';
import { Conversation } from '@/src/hooks/useChat';
import styles from './Chat.module.css';
import { useAuthStore } from '@/src/store/useAuthStore';

export const ChatContainer: React.FC = () => {
  const { auth } = useAuthStore(); // ✅ Get logged-in user

  const {
    conversations,
    selectedConversation,
    messages,
    unreadCount,
    availableUsers,
    loadConversations,
    loadMessages,
    loadAvailableUsers,
    sendMessage,
    setSelectedConversation,
    isConnected,
  } = useChat();

  useEffect(() => {
    loadConversations();
    loadAvailableUsers();
  }, [loadConversations, loadAvailableUsers]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation, loadMessages]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = (content: string, receiverId: number) => {
    sendMessage(content, receiverId);
  };

  const handleStartConversation = async (userId: number) => {
    await sendMessage('👋 Hello! I\'d like to chat with you.', userId);
    await loadConversations();
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatLayout}>
        <ChatSidebar
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
          unreadCount={unreadCount}
          availableUsers={availableUsers}
          onStartConversation={handleStartConversation}
          isConnected={isConnected}
        />

        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            messages={messages}
            onSendMessage={handleSendMessage}
            currentUserId={auth?.id ?? 0}  
            isConnected={isConnected}
          />
        ) : (
          <div className={styles.chatWindow}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(249, 250, 251, 0.8) 0%, rgba(255, 255, 255, 0.9) 100%)'
            }}>
              <div style={{ textAlign: 'center', color: '#6b7280' }}>
                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>💬</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '8px' }}>
                  Welcome to Messenger
                </h3>
                <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>
                  Select a conversation or start a new one to begin chatting
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
