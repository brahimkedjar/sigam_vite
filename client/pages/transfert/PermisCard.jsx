import styles from './PermisCard.module.css';

export default function PermisCard({ permis }) {
  if (!permis) return null;

  const typeLabel = permis.typePermis?.lib_type || permis.typePermis?.libelle || permis.id_typePermis;
  const rawStatus = permis.statut?.lib_statut || permis.statut?.libelle || permis.id_statut;
  const statusText = rawStatus != null ? String(rawStatus) : '';
  const superficie = permis.superficie != null ? `${permis.superficie} ha` : '-';
  const expiration = permis.date_expiration ? new Date(permis.date_expiration).toLocaleDateString() : '-';
  const statusClass = statusText && styles[statusText.toLowerCase()] ? styles[statusText.toLowerCase()] : '';

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Permis #{permis.code_permis}</h3>
        <span className={styles.badge}>{typeLabel}</span>
      </div>

      <div className={styles.details}>
        <div className={styles.detailItem}>
          <span className={styles.label}>Superficie:</span>
          <span className={styles.value}>{superficie}</span>
        </div>

        <div className={styles.detailItem}>
          <span className={styles.label}>Date d'expiration:</span>
          <span className={styles.value}>{expiration}</span>
        </div>

        <div className={styles.detailItem}>
          <span className={styles.label}>Statut:</span>
          <span className={`${styles.status} ${statusClass}`}>
            {statusText || '-'}
          </span>
        </div>
      </div>
    </div>
  );
}
