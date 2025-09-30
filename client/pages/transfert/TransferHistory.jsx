import styles from './TransferHistory.module.css';

export default function TransferHistory({ history }) {
  if (!history || history.length === 0) return null;

  return (
    <div className={styles.historyContainer}>
      <h3>Historique des transferts</h3>
      <div className={styles.historyList}>
        {history.map((transfer) => (
          <div key={transfer.id_transfert} className={styles.historyItem}>
            <div className={styles.historyHeader}>
              <span className={styles.transferId}>Transfert #{transfer.id_transfert}</span>
              <span className={styles.transferDate}>
                {transfer.date_transfert ? new Date(transfer.date_transfert).toLocaleDateString() : '-'}
              </span>
            </div>
            <div className={styles.historyDetails}>
              <div className={styles.detenteurs}>
                <div className={styles.detenteur}>
                  <span className={styles.label}>Cedant:</span>
                  <span className={styles.value}>
                    {transfer.transfertDetenteur?.find((item) => item.type_detenteur === 'ANCIEN')?.detenteur?.nom_societeFR || '-'}
                  </span>
                </div>
                <div className={styles.arrow}>➜</div>
                <div className={styles.detenteur}>
                  <span className={styles.label}>Cessionnaire:</span>
                  <span className={styles.value}>
                    {transfer.transfertDetenteur?.find((item) => item.type_detenteur === 'NOUVEAU')?.detenteur?.nom_societeFR || '-'}
                  </span>
                </div>
              </div>
              {transfer.motif_transfert && (
                <div className={styles.motif}>
                  <span className={styles.label}>Motif:</span>
                  <span className={styles.value}>{transfer.motif_transfert}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
