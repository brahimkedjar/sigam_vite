import React, { useState } from 'react';
import { User } from '@/src/hooks/useChat';
import styles from './Chat.module.css';

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableUsers: User[];
  onStartConversation: (userId: number) => void;
}

export const NewConversationModal: React.FC<NewConversationModalProps> = ({
  isOpen,
  onClose,
  availableUsers,
  onStartConversation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredUsers = availableUsers.filter(user =>
    `${user.nom} ${user.Prenom} ${user.username} ${user.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Start New Conversation</h2>
          <p style={{ color: '#6b7280', margin: '8px 0 0 0' }}>
            Select a user to start chatting with
          </p>
        </div>
        
        <input
          type="text"
          placeholder="Search users by name, username, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
          autoFocus
        />
        
        <div className={styles.usersList}>
          {filteredUsers.map(user => (
            <div
              key={user.id}
              className={styles.userItem}
              onClick={() => onStartConversation(user.id)}
            >
              <div className={styles.userAvatar}>
                {user.nom[0]}{user.Prenom[0]}
              </div>
              <div className={styles.userInfo}>
                <h4 className={styles.userName}>
                  {user.nom} {user.Prenom}
                </h4>
                <p className={styles.userUsername}>
                  @{user.username} • {user.email}
                </p>
              </div>
            </div>
          ))}
          
          {filteredUsers.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
              <p>No users found</p>
              <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                Try adjusting your search terms
              </p>
            </div>
          )}
        </div>
        
        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};