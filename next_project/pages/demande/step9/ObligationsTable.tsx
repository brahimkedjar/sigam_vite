// components/payments/ObligationsTable.tsx

import styles from './UserObligations.module.css';

interface TypePaiement {
  id: number;
  libelle: string;
}
interface Obligation {
  id: number;
  typePaiement: {
    id: number;
    libelle: string;
  };
  amount: number; // ✅ au lieu de montant_attendu
  status: string; // ✅ au lieu de statut
}

interface ObligationsTableProps {
  obligations?: Obligation[]; // Optional with fallback
  onSelect: (obligation: Obligation) => void;
  selectedId?: number | null;
}

const ObligationsTable = ({ obligations = [], onSelect, selectedId }: ObligationsTableProps) => {

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Payé':
        return styles.statusPaid;
      case 'A payer':
        return styles.statusPending;
      case 'En retard':
        return styles.statusLate;
      default:
        return styles.statusDefault;
    }
  };

  const getLegalReference = (paymentType: string) => {
    switch (paymentType) {
      case 'Produit d\'attribution':
        return 'Art. 45 du Code Minier';
      case 'Droit d\'établissement':
        return 'Art. 28 du Code Minier';
      case 'Taxe superficiaire':
        return 'Art. 33 Décret 07-154';
      default:
        return '';
    }
  };

  return (
    <div className={styles.obligationsTableContainer}>
      <table className={styles.obligationsTable}>
        <thead>
          <tr>
            <th>Type de frais</th>
            <th>Montant (DZD)</th>
            <th>Référence</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {(obligations ?? []).map((obligation) => (
            <tr 
              key={obligation.id}
              className={`${styles.obligationRow} ${selectedId === obligation.id ? styles.selectedRow : ''}`}
              onClick={() => onSelect(obligation)}
            >
              <td>
                <strong>{obligation.typePaiement.libelle}</strong>
                <div className={styles.legalReference}>
                  {getLegalReference(obligation.typePaiement.libelle)}
                </div>
              </td>
<td>
  {typeof obligation.amount === 'number'
    ? obligation.amount.toLocaleString() + ' DZD'
    : 'Montant non défini'}
</td>

              <td>
                {obligation.typePaiement.libelle.substring(0, 2).toUpperCase()}-{obligation.id}
              </td>
              <td>
                <span className={`${styles.statusBadge} ${getStatusBadge(obligation.status)}`}>
                  {obligation.status}
                </span>
              </td>
            </tr>
          ))}
          <tr className={styles.totalRow}>
            <td colSpan={3}><strong>Total à payer</strong></td>
            <td>
              {obligations
                .filter(o => o.status === 'A payer' || o.status === 'En retard')
                .reduce((sum, o) => sum + o.amount, 0)
                .toLocaleString()} DZD
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default ObligationsTable;