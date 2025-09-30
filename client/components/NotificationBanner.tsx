'use client';
import React from 'react';
import styles from './NotificationBanner.module.css';

interface Props {
  message: string;
  type: 'error' | 'success' | 'info';
  onClose: () => void;
}

const NotificationBanner: React.FC<Props> = ({ message, type, onClose }) => {
  return (
    <div className={styles.overlay}>
      <div className={`${styles.popup} ${styles[type]}`}>
        <p>{message}</p>
        <button onClick={onClose} className={styles.closeBtn}>
          ✖ Fermer
        </button>
      </div>
    </div>
  );
};

export default NotificationBanner;
