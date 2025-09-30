// components/LoadingSpinner.jsx
import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner({ size = 'medium', text = 'Chargement...' }) {
  return (
    <div className={styles.container}>
      <div className={`${styles.spinner} ${styles[size]}`}>
        <div className={styles.spinnerInner}></div>
      </div>
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
}