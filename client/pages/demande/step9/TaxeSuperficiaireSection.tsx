import React from 'react';
import styles from '@/pages/DEA/Payments.module.css';

interface TaxeCalculation {
  droitFixe?: number;
  droitProportionnel?: number;
  superficie?: number;
  mois?: number;
  taxeAnnuelle?: number;
  taxeAPayer?: number;
  periodeType?: string;
}

interface TaxeSuperficiaireSectionProps {
  obligations: any[];
  permis: {
    typePermis: {
      code_type: string;
      lib_type: string;
      duree_initiale?: number;
    };
    superficie?: number;
    nombre_renouvellements?: number;
    date_octroi?: Date;
  };
  dateAttribution: Date;
}

const TaxeSuperficiaireSection: React.FC<TaxeSuperficiaireSectionProps> = ({
  obligations,
  permis,
  dateAttribution
}) => {
  // Filter surface tax obligations
  const surfaceTaxObligations = obligations.filter(obligation => 
    obligation.typePaiement?.libelle === 'Taxe superficiaire'
  );

  const getCalculationDetails = (obligation: any): TaxeCalculation => {
    try {
      if (!obligation.details_calcul) {
        return {
          droitFixe: 0,
          droitProportionnel: 0,
          superficie: permis.superficie || 0,
          mois: 0,
          taxeAnnuelle: 0,
          taxeAPayer: obligation.amount || 0,
          periodeType: 'inconnu'
        };
      }
      
      const parsed = typeof obligation.details_calcul === 'string' 
        ? JSON.parse(obligation.details_calcul)
        : obligation.details_calcul;
      
      return {
        droitFixe: parsed.droitFixe || 0,
        droitProportionnel: parsed.droitProportionnel || 0,
        superficie: parsed.superficie || permis.superficie || 0,
        mois: parsed.mois || 0,
        taxeAnnuelle: parsed.taxeAnnuelle || 0,
        taxeAPayer: parsed.taxeAPayer || obligation.amount || 0,
        periodeType: parsed.periodeType || 'inconnu'
      };
    } catch (error) {
      return {
        droitFixe: 0,
        droitProportionnel: 0,
        superficie: permis.superficie || 0,
        mois: 0,
        taxeAnnuelle: obligation.amount || 0,
        taxeAPayer: obligation.amount || 0,
        periodeType: 'inconnu'
      };
    }
  };

  const getPeriodeTypeLabel = (periodeType?: string): string => {
    switch (periodeType) {
      case 'initial': return 'Période initiale';
      case 'premier_renouvellement': return 'Premier renouvellement';
      case 'autre_renouvellement': return 'Autre renouvellement';
      default: return periodeType || 'Inconnu';
    }
  };

  const formatNumber = (value: number | undefined): string => {
    if (value === undefined || value === null) return '0';
    return value.toLocaleString('fr-FR');
  };

  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return 'Date invalide';
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return 'Date invalide';
      
      // Use UTC methods to avoid timezone issues
      const day = dateObj.getUTCDate();
      const month = dateObj.getUTCMonth() + 1;
      const year = dateObj.getUTCFullYear();
      
      return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
    } catch {
      return 'Date invalide';
    }
  };

  // If no surface tax obligations, don't render the section
  if (surfaceTaxObligations.length === 0) {
    return null;
  }

  return (
    <div className={styles.taxeSection}>
      <h3>Détails de la Taxe Superficiaire</h3>
      
      <div className={styles.taxeSummary}>
        <div className={styles.taxeInfo}>
          <span>Type de permis:</span>
          <strong>{permis.typePermis?.lib_type} ({permis.typePermis?.code_type})</strong>
        </div>
        <div className={styles.taxeInfo}>
          <span>Superficie:</span>
          <strong>{permis.superficie || 0} hectares</strong>
        </div>
        <div className={styles.taxeInfo}>
          <span>Date d'attribution:</span>
          <strong>{formatDate(dateAttribution)}</strong>
        </div>
        <div className={styles.taxeInfo}>
          <span>Durée initiale:</span>
          <strong>{permis.typePermis?.duree_initiale || 0} années</strong>
        </div>
        <div className={styles.taxeInfo}>
          <span>Nombre de renouvellements:</span>
          <strong>{permis.nombre_renouvellements || 0}</strong>
        </div>
      </div>

      <h4>Obligations de taxe superficiaire ({surfaceTaxObligations.length} années)</h4>
      
      <table className={styles.taxeDetailsTable}>
        <thead>
          <tr>
            <th>Année</th>
            <th>Période</th>
            <th>Type</th>
            <th>Droit fixe</th>
            <th>Droit proportionnel</th>
            <th>Mois</th>
            <th>Taxe annuelle</th>
            <th>Taxe à payer</th>
            <th>Échéance</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {surfaceTaxObligations.map((obligation) => {
            const calculation = getCalculationDetails(obligation);
            
            // Fix year calculation
            const attributionYear = dateAttribution ? new Date(dateAttribution).getFullYear() : null;
            const yearLabel = obligation.fiscalYear && attributionYear
              ? (obligation.fiscalYear === attributionYear
                  ? '1ère année'
                  : `Année ${obligation.fiscalYear - attributionYear + 1}`)
              : 'N/A';

            return (
              <tr key={obligation.id}>
                <td>{obligation.fiscalYear || 'N/A'}</td>
                <td>{yearLabel}</td>
                <td>{getPeriodeTypeLabel(calculation.periodeType)}</td>
                <td>{formatNumber(calculation.droitFixe)} DA</td>
                <td>{formatNumber(calculation.droitProportionnel)} DA/ha</td>
                <td>{calculation.mois || 0}</td>
                <td>{formatNumber(calculation.taxeAnnuelle)} DA</td>
                <td>{formatNumber(calculation.taxeAPayer)} DA</td>
                <td>{formatDate(obligation.dueDate || obligation.date_echeance)}</td>
                <td>
                  <span className={styles.statusBadge}>
                    {obligation.statut || obligation.status || 'Inconnu'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className={styles.taxeExplanation}>
        <h4>Calcul de la taxe superficiaire:</h4>
        <p>
          La taxe superficiaire est calculée selon la formule:<br />
          <strong>Taxe annuelle = Droit fixe + (Droit proportionnel × Superficie)</strong>
        </p>
        <p>
          Pour la première année, la taxe est calculée au prorata des mois restants 
          à partir de la date d'attribution jusqu'au 31 décembre.
        </p>
        <p className={styles.calculationExample}>
          <strong>Exemple pour 34 hectares:</strong><br />
          Taxe annuelle = 10.000 DA + (200 DA/ha × 34 ha) = 16.800 DA<br />
          Taxe mensuelle = 16.800 DA ÷ 12 = 1.400 DA/mois<br />
          Première année (4 mois) = 1.400 DA × 4 = 5.600 DA
        </p>
      </div>
    </div>
  );
};

export default TaxeSuperficiaireSection;