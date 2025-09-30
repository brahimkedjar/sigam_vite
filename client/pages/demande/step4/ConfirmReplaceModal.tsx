// components/ConfirmReplaceModal.tsx
import React from 'react';
import styles from './substances.module.css'; // we'll create this next

interface Coordinate {
  x: number;
  y: number;
  z: number;
}

interface Props {
  coordinates: Coordinate[];
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmReplaceModal: React.FC<Props> = ({ coordinates, onCancel, onConfirm }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>⚠️ Coordonnées déjà existantes</h2>
        <p>
  Cette demande contient déjà <strong>{coordinates?.length ?? 0}</strong> points.
</p>


<div className={styles.coordList}>
  {coordinates?.map((coord, index) => (
  <div key={index} className={styles.coordItem}>
    <span>Point {index + 1}: </span>
    <code>X: {coord.x}, Y: {coord.y}, Z: {coord.z}</code>
  </div>
)) ?? null}

</div>


        <p>Voulez-vous les remplacer ?</p>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>Annuler</button>
          <button className={styles.confirmBtn} onClick={onConfirm}>Remplacer</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmReplaceModal;
