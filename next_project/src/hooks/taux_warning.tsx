// components/TauxWarningModal.tsx
import React from 'react';
import styles from './TauxWarningModal.module.css';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

type Props = {
  total: number;
  tauxRep: number;
  tauxActionnaires: number;
  onClose: () => void;
};

export default function TauxWarningModal({ total, tauxRep, tauxActionnaires, onClose }: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <FiAlertTriangle className={styles.icon} />
          <h2>Attention !</h2>
          <button className={styles.closeBtn} onClick={onClose}><FiX /></button>
        </div>
        <div className={styles.body}>
          <p>Le total des taux de participation doit être exactement <strong>100%</strong>.</p>
          <ul>
            <li>Représentant légal : <strong>{tauxRep}%</strong></li>
            <li>Actionnaires : <strong>{tauxActionnaires}%</strong></li>
            <li>Total actuel : <strong>{total}%</strong></li>
          </ul>
        </div>
        <div className={styles.footer}>
          <button className={styles.okBtn} onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
}
