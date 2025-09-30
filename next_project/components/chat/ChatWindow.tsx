// components/Chat/ChatWindow.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Conversation, Message } from '../../src/hooks/useChat';
import styles from './Chat.module.css';

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (content: string, receiverId: number) => void;
  currentUserId: number;
  isConnected: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  onSendMessage,
  currentUserId,
  isConnected,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim(), conversation.otherUser.id);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isOwnMessage = (message: Message) => {
    return message.senderId === currentUserId;
  };

  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatHeader}>
        <h2 className={styles.chatPartner}>
          {conversation.otherUser.nom} {conversation.otherUser.Prenom}
        </h2>
        <p className={styles.chatUsername}>
          @{conversation.otherUser.username}
          <span style={{ 
            marginLeft: '12px', 
            color: isConnected ? '#10b981' : '#ef4444',
            fontSize: '0.8rem'
          }}>
            ● {isConnected ? 'Online' : 'Offline'}
          </span>
        </p>
      </div>

      <div className={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#6b7280', 
            padding: '48px 24px' 
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>👋</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>
              Start a conversation with {conversation.otherUser.nom}
            </h3>
            <p>Send a message to begin your chat</p>
          </div>
        ) : (
          messages.map(message => {
            const ownMessage = isOwnMessage(message);
            
            return (
              <div
                key={message.id}
                className={`${styles.message} ${ownMessage ? styles.messageOwn : ''}`}
              >
                {!ownMessage && (
                  <div className={styles.avatarSmall}>
                    {conversation.otherUser.nom[0]}{conversation.otherUser.Prenom}
                  </div>
                )}
                
                <div
                  className={`${styles.messageBubble} ${
                    ownMessage 
                      ? styles.messageOutgoing 
                      : styles.messageIncoming
                  }`}
                >
                  <p style={{ margin: 0 }}>{message.content}</p>
                  <div className={styles.messageTime}>
                    {formatTime(message.createdAt)}
                    {ownMessage && (
                      <span style={{ marginLeft: '4px' }}>
                        {message.isRead ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>

                {ownMessage && (
                  <div className={styles.avatarSmallOwn}>
                    {message.sender?.nom[0]}{message.sender?.Prenom}
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.messageInputContainer}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className={styles.messageInput}
            disabled={!isConnected}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !isConnected}
            className={styles.sendButton}
            title={!isConnected ? "Connecting..." : "Send message"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};