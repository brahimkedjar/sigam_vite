'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import PaymentForm from '../PaymentForm';
import PaymentsTable from '../PaymentsTable';
import styles from './Payments.module.css';
import { useSearchParams } from '@/src/hooks/useSearchParams';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Sidebar from '../../../sidebar/Sidebar';
import Navbar from '../../../navbar/Navbar';
import { useViewNavigator } from '../../../../src/hooks/useViewNavigator';
import { STEP_LABELS } from '../../../../src/constants/steps';
import router from 'next/router';
import { useActivateEtape } from '@/src/hooks/useActivateEtape';
import TaxeSuperficiaireSection from '../TaxeSuperficiaireSection';

interface Obligation {
  id: number;
  details_calcul: string | null;
  typePaiement: {
    id: number;
    libelle: string;
  };
  amount: number;
  fiscalYear: number;
  dueDate: string;
  status: string;
  payments: RawPayment[];
}

interface RawPayment {
  id: number;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  receiptNumber: string;
  status: string;
  proofUrl: string | null;
  currency: string;
}



const PaymentPage = () => {
  const searchParams = useSearchParams();
const permisIdStr = searchParams?.get('permisId'); // Change from 'id' to 'permisId'
const permisId = permisIdStr ? parseInt(permisIdStr, 10) : undefined;
  const [obligations, setObligations] = useState<Obligation[]>([]);
  const [selectedObligation, setSelectedObligation] = useState<Obligation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const { currentView, navigateTo } = useViewNavigator('nouvelle-demande')
  const currentStep = 9; // 9 for the 10th step (zero-based index)
  const totalSteps = STEP_LABELS.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const [statutProc, setStatutProc] = useState<string | undefined>(undefined);
  const apiURL = process.env.NEXT_PUBLIC_API_URL; 
  const [permisDetails, setPermisDetails] = useState<any>(null);
  const [dateAttribution, setDateAttribution] = useState<Date>(new Date());    
  const statusStyles: Record<string, string> = {
  'Payé': styles.paidStatus,
  'En retard': styles.overdueStatus,
  'Partiellement payé': styles.partialStatus,
  'A payer': styles.pendingStatus,
};
  // useActivateEtape({ idProc, etapeNum: 9, statutProc });


// In your PaymentPage component, add this useEffect
useEffect(() => {
  if (obligations.length > 0) {
    const surfaceTax = obligations.filter(ob => 
      ob.typePaiement?.libelle === 'Taxe superficiaire'
    );
    
    console.log('DEBUG - Surface tax obligations:', surfaceTax);
    surfaceTax.forEach(ob => {
      console.log(`Obligation ${ob.id}:`, {
        details_calcul: ob.details_calcul,
        parsed: ob.details_calcul ? JSON.parse(ob.details_calcul) : 'No details'
      });
    });
  }
}, [obligations]);
  /*useEffect(() => {
    if (!idProc) return;
    const activateStep = async () => {
      try {
        await axios.post(`${apiURL}/api/procedure-etape/start/${idProc}/10`);
      } catch (err) {
        console.error("échec de l'activation de l'étape");
      }
    };

    activateStep();
  }, [idProc]);*/

    const handleBack = () => {
    if (!permisId) {
      setError("ID procédure manquant");
      return;
    }
    router.push(`/DEA/DEA_dashboard`);
  };
    
  useEffect(() => {
    if (obligations.length > 0) {
      const total = obligations.reduce((sum, obligation) => {
        return sum + (obligation.amount || 0);
      }, 0);
      setTotalAmount(total);
    }
  }, [obligations]);

   // In your useEffect where you initialize payments, add more logging:
// Replace your initializePayments function with this:
// Replace your initializePayments function with this:
useEffect(() => {
  const initializePayments = async () => {
    if (!permisId) return;

    try {
      setLoading(true);
      
      // Get permis details directly by permisId
      const permisResponse = await axios.get(`${apiURL}/api/permis/${permisId}`);
      console.log('Permis response:', permisResponse.data);
      
      if (!permisResponse.data) throw new Error('Permis non trouvé');

      setPermisDetails(permisResponse.data);
      
      // Get attribution date from permis if available, otherwise use current date
      const attributionDate = permisResponse.data.date_octroi 
        ? new Date(permisResponse.data.date_octroi)
        : new Date();
      setDateAttribution(attributionDate);
      console.log('Attribution date:', attributionDate);

      // Check if obligations exist
      const obligationsResponse = await axios.get(
        `${apiURL}/payments/obligations/${permisId}`
      );
      console.log('Obligations response:', obligationsResponse.data);
    } catch (err) {
      console.error('Error in initializePayments:', err);
      setError(err instanceof Error ? err.message : 'échec de l\'initialisation');
    } finally {
      setLoading(false);
    }
  };

  initializePayments();
}, [permisId]); // Change dependency from idProc to permisId
  const fetchPayments = async (obligationId: number) => {
    try {
      const response = await axios.get<RawPayment[]>(
        `${apiURL}/payments/payments/${obligationId}`
      );

      setSelectedObligation((prev) =>
        prev ? { ...prev, payments: response.data } : null
      );

      setObligations((prev) =>
        prev.map((obligation) =>
          obligation.id === obligationId
            ? { ...obligation, payments: response.data }
            : obligation
        )
      );
    } catch (error) {
      setError('Erreur lors du chargement de l\'historique');
    }
  };

  const handleObligationSelect = async (obligation: Obligation) => {
    setSelectedObligation(obligation);
    await fetchPayments(obligation.id);
  };



  const handlePaymentSubmit = async (paymentData: {
    amount: number;
    currency: string;
    paymentDate: string;
    paymentMethod: string;
    receiptNumber: string;
    proofUrl: string;
  }) => {
    try {
      if (!selectedObligation) return;

      await axios.post(`${apiURL}/payments`, {
        ...paymentData,
        obligationId: selectedObligation.id,
      });

      await fetchPayments(selectedObligation.id);

      const obligationsResponse = await axios.get<Obligation[]>(
        `${apiURL}/payments/obligations/${permisId}`
      );

      setObligations(obligationsResponse.data);
console.log('Updated obligations after payment:', obligationsResponse.data);
      const updated = obligationsResponse.data.find(o => o.id === selectedObligation.id);
      setSelectedObligation(updated || obligationsResponse.data[0]);
    } catch (error) {
      setError('échec de la soumission du paiement');
    }
  };

  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Paiements requis</h1>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

    return (
    <div className={styles['app-container']}>
      <Navbar />
      <div className={styles['app-content']}>
        <Sidebar currentView={currentView} navigateTo={navigateTo} />
        <main className={styles['main-content']}>
          <div className={styles['breadcrumb']}>
            <span>SIGAM</span>
            <FiChevronRight className={styles['breadcrumb-arrow']} />
            <span>Paiements</span>
          </div>
          <div className={styles['container']}>
                        <div className={styles['content-wrapper']}>
                         {/* Progress Steps */}
<div className={styles.progressBar}>
  <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
</div>
      <h1 className={styles.title}>Paiements requis <div className={styles['finalize-button-container']}>
 
</div></h1>
       

      {loading ? (
        <div className={styles.loading}>Chargement en cours...</div>
      ) : (
        <>
       
          <div className={styles.summarySection}>
            <h2>Résumé des paiements</h2>
            <table className={styles.summaryTable}>
              <thead>
                <tr>
                  <th>Type de frais</th>
                  <th>Montant (DZD)</th>
                  <th>Référence</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {obligations.map((obligation) => (
                  <tr
                    key={obligation.id}
                    className={selectedObligation?.id === obligation.id ? styles.selectedRow : ''}
                    onClick={() => handleObligationSelect(obligation)}
                  >
                    <td>
                      <strong>{obligation.typePaiement.libelle}</strong>
                      <div className={styles.legalReference}>
                        {getLegalReference(obligation.typePaiement.id)}
                      </div>
                    </td>
                    <td>{obligation.amount.toLocaleString()} DZD</td>
                    <td>
                      {obligation.typePaiement.libelle.substring(0, 2).toUpperCase()}-{obligation.id}
                    </td>
<td>
  <span className={statusStyles[obligation.status]}>
    {obligation.status}
  </span>
</td>
                  </tr>
                ))}
                <tr className={styles.totalRow}>
                  <td colSpan={3}><strong>Total à payer</strong></td>
                  <td><strong>{totalAmount.toLocaleString()} DZD</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.paymentSection}>
            <h2>Saisie des preuves de paiement</h2>
            <p className={styles.instructions}>
              Pour chaque frais, saisissez les informations de paiement reçues du demandeur et uploadez les justificatifs officiels.
              Vérifiez la conformité avant validation.
            </p>

            {selectedObligation && (
              <>
                <div className={styles.obligationHeader}>
                  <h3>
                    {selectedObligation.typePaiement.libelle}
                    <span className={styles.amountDue}>
                      Montant dû: {selectedObligation.amount.toLocaleString()} DZD • Réf: {selectedObligation.typePaiement.libelle.substring(0, 2).toUpperCase()}-{selectedObligation.id}
                    </span>
                  </h3>
                </div>

                <PaymentForm
                  obligation={selectedObligation}
                  onSubmit={handlePaymentSubmit}
                />

                {selectedObligation.payments && selectedObligation.payments.length > 0 && (
                  <PaymentsTable
                    payments={selectedObligation.payments.map((p) => ({
                      id: p.id,
                      date_paiement: p.paymentDate,
                      montant_paye: p.amount,
                      mode_paiement: p.paymentMethod,
                      num_quittance: p.receiptNumber,
                      etat_paiement: p.status,
                      justificatif_url: p.proofUrl,
                    }))}
                  />
                )}
                {permisDetails && (
              <TaxeSuperficiaireSection
                obligations={obligations}
                permis={permisDetails}
                dateAttribution={dateAttribution}
              />
            )}
              </>
            )}
          </div>
        </>
      )}
      </div>
      <div className={styles['navigation-buttons']}>
                            <button className={`${styles['btn']} ${styles['btn-outline']}`} onClick={handleBack} >
                                <FiChevronLeft className={styles['btn-icon']} />
                                Précédent
                            </button>
                        </div>
    </div>
    </main>
    </div>
    </div>
  );
};

function getLegalReference(paymentTypeId: number): string {
  switch (paymentTypeId) {
    case 1: return 'Article 45 du Code Minier';
    case 2: return 'Article 28 du Code Minier';
    case 3: return 'Article 33 Décret 07-154';
    default: return '';
  }
}

export default PaymentPage;
