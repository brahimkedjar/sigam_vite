import React, { useState } from 'react';
import { Conversation, User } from '../../src/hooks/useChat';
import { NewConversationModal } from './NewConversationModal';
import styles from './Chat.module.css';

interface ChatSidebarProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  unreadCount: number;
  availableUsers: User[];
  onStartConversation: (userId: number) => void;
  isConnected: boolean;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  unreadCount,
  availableUsers,
  onStartConversation,
  isConnected,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStartConversation = (userId: number) => {
    onStartConversation(userId);
    setIsModalOpen(false);
  };

  const formatLastMessage = (content: string) => {
    if (content.length > 35) {
      return content.substring(0, 35) + '...';
    }
    return content;
  };

  return (
    <>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 className={styles.sidebarTitle}>
              💬 Messages
              {unreadCount > 0 && (
                <span className={styles.unreadBadge}>{unreadCount}</span>
              )}
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className={styles.newChatButton}
              title="Start new conversation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginTop: '8px',
            fontSize: '0.875rem',
            color: isConnected ? '#10b981' : '#ef4444'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isConnected ? '#10b981' : '#ef4444',
              animation: isConnected ? 'pulse 2s infinite' : 'none'
            }} />
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
        
        <div className={styles.conversationsList}>
          {conversations.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>💬</div>
              <p>No conversations yet</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className={styles.startConversationBtn}
              >
                Start your first conversation
              </button>
            </div>
          ) : (
            conversations.map(conversation => (
              <div
                key={conversation.id}
                className={`${styles.conversationItem} ${
                  selectedConversation?.id === conversation.id ? styles.conversationItemActive : ''
                }`}
                onClick={() => onSelectConversation(conversation)}
              >
                <div className={styles.avatar}>
                  {conversation.otherUser.nom[0]}{conversation.otherUser?.Prenom!}
                </div>
                <div className={styles.conversationInfo}>
                  <h3 className={styles.conversationName}>
                    {conversation.otherUser.nom} {conversation.otherUser?.Prenom!}
                  </h3>
                  {conversation.lastMessage && (
                    <p className={styles.lastMessage}>
                      {formatLastMessage(conversation.lastMessage?.content!)}
                    </p>
                  )}
                </div>
                {conversation.unreadCount > 0 && (
                  <span className={styles.unreadBadge}>
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <NewConversationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        availableUsers={availableUsers}
        onStartConversation={handleStartConversation}
      />
    </>
  );
};