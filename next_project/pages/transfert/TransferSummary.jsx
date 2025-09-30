import styles from './TransferSummary.module.css';

export default function TransferSummary({ result, onViewDetails, onPrint }) {
  if (!result) return null;

  return (
    <div className={styles.summary}>
      <div className={styles.header}>
        <h3>Transfert initialise avec succes</h3>
        <div className={styles.successIcon}>OK</div>
      </div>

      <div className={styles.details}>
        <div className={styles.detailItem}>
          <span className={styles.label}>Identifiant transfert:</span>
          <span className={styles.value}>{result.demTransfert.id_transfert}</span>
        </div>

        <div className={styles.detailItem}>
          <span className={styles.label}>Identifiant demande:</span>
          <span className={styles.value}>{result.newDemandeId}</span>
        </div>

        <div className={styles.detailItem}>
          <span className={styles.label}>Identifiant procedure:</span>
          <span className={styles.value}>{result.procId}</span>
        </div>

        <div className={styles.detailItem}>
          <span className={styles.label}>Statut:</span>
          <span className={styles.status}>En cours</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.primaryButton} onClick={onViewDetails}>
          Consulter la demande
        </button>
        <button className={styles.outlineButton} onClick={onPrint}>
          Imprimer le recu
        </button>
      </div>
    </div>
  );
}
