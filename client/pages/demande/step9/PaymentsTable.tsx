import styles from '@/pages/DEA/Payments.module.css';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface Payment {
  id: number;
  date_paiement: string | Date;
  montant_paye: number;
  mode_paiement: string;
  num_quittance: string;
  etat_paiement: string;
  justificatif_url: string | null;
}

interface PaymentsTableProps {
  payments: Payment[];
}

const PaymentsTable = ({ payments = [] }: PaymentsTableProps) => {

  if (!payments || payments.length === 0) {
    return (
      <div className={styles.paymentsHistory}>
        <h3 className={styles.sectionTitle}>Historique des paiements</h3>
        <p className={styles.noPayments}>Aucun paiement enregistré</p>
      </div>
    );
  }

  return (
    <div className={styles.paymentsHistory}>
      <h3 className={styles.sectionTitle}>Historique des paiements</h3>
      <table className={styles.paymentsTable}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Montant</th>
            <th>Mode</th>
            <th>Référence</th>
            <th>Statut</th>
            <th>Justificatif</th>
          </tr>
        </thead>
        <tbody>
  {payments.map((payment) => {
    const paymentDate = new Date(payment.date_paiement);
    const isValidDate = !isNaN(paymentDate.getTime());

    return (
      <tr key={payment.id}>
        <td>
          {isValidDate
            ? format(paymentDate, 'dd MMM yyyy', { locale: fr })
            : '—'}
        </td>
        <td>
          {typeof payment.montant_paye === 'number'
            ? payment.montant_paye.toLocaleString('fr-FR') + ' DZD'
            : '—'}
        </td>
        <td>{payment.mode_paiement || '—'}</td>
        <td>{payment.num_quittance || '—'}</td>
        <td>
          <span className={`${styles.statusBadge} ${
            payment.etat_paiement === 'VALIDEE'
              ? styles.statusValidated
              : payment.etat_paiement === 'REJETEE'
              ? styles.statusRejected
              : styles.statusPending
          }`}>
            {payment.etat_paiement || 'EN_ATTENTE'}
          </span>
        </td>
        <td>
          {payment.justificatif_url ? (
            <a
              href={payment.justificatif_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.downloadLink}
            >
              Télécharger
            </a>
          ) : (
            '—'
          )}
        </td>
      </tr>
    );
  })}
</tbody>

      </table>
    </div>
  );
};

export default PaymentsTable;
