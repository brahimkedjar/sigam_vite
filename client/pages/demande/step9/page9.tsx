// UserObligationsPage.tsx - Updated
'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './UserObligations.module.css';
import { useSearchParams } from '@/src/hooks/useSearchParams';
import { FiChevronLeft, FiChevronRight, FiDownload, FiCheckCircle, FiAlertCircle, FiClock } from 'react-icons/fi';
import Sidebar from '../../sidebar/Sidebar';
import Navbar from '../../navbar/Navbar';
import { useViewNavigator } from '../../../src/hooks/useViewNavigator';
import { STEP_LABELS } from '../../../src/constants/steps';
import { useRouter } from 'next/router';

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
  payments: Payment[];
  tsPaiements?: TsPaiement[]; // Add TsPaiement data
}

interface Payment {
  id: number;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  receiptNumber: string;
  status: string;
  proofUrl: string | null;
  currency: string;
}

interface TsPaiement {
  id_tsPaiement: number;
  datePerDebut: string;
  datePerFin: string;
  surfaceMin: number;
  surfaceMax: number;
}

const UserObligationsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryId = router.query?.id;
  const idParam = searchParams?.get('id') ?? (Array.isArray(queryId) ? queryId[0] : queryId ?? null);
  const idProc = idParam ? parseInt(idParam, 10) : undefined;
  const [permisId, setPermisId] = useState<number | null>(null);
  const [obligations, setObligations] = useState<Obligation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [pendingAmount, setPendingAmount] = useState<number>(0);
  const { currentView, navigateTo } = useViewNavigator('nouvelle-demande');
  const [statutProc, setStatutProc] = useState<string | undefined>(undefined);
  const apiURL = process.env.NEXT_PUBLIC_API_URL; 
  const [permisDetails, setPermisDetails] = useState<any>(null);
  const [dateAttribution, setDateAttribution] = useState<Date>(new Date());

  const isRouterReady = router.isReady === undefined ? false : router.isReady;

  if (isRouterReady && !idProc) {
    return (
      <div className={styles.appContainer}>
        <Navbar />
        <div className={styles.appContent}>
          <Sidebar currentView={currentView} navigateTo={navigateTo} />
          <main className={styles.mainContent}>
            <div className={styles.loadingContainer}>
              <h1>Procédure introuvable</h1>
              <p>Aucune procédure sélectionnée. Choisissez un dossier puis réessayez.</p>
            </div>
          </main>
        </div>
      </div>
    );
  }


  // Add this useEffect to calculate amounts whenever obligations change
  useEffect(() => {
    if (obligations.length > 0) {
      const total = obligations.reduce((sum: number, obligation: Obligation) => {
        return sum + (obligation.amount || 0);
      }, 0);
      
      const paid = obligations.reduce((sum: number, obligation: Obligation) => {
        if (obligation.status === 'Payé') {
          return sum + (obligation.amount || 0);
        }
        return sum;
      }, 0);
      
      const pending = obligations.reduce((sum: number, obligation: Obligation) => {
        if (obligation.status !== 'Payé') {
          return sum + (obligation.amount || 0);
        }
        return sum;
      }, 0);
      
      setTotalAmount(total);
      setPaidAmount(paid);
      setPendingAmount(pending);
      
      console.log('Amounts calculated:', { total, paid, pending });
    }
  }, [obligations]);

  // Fetch obligations with TsPaiement data
  // UserObligationsPage.tsx - Updated data fetching
useEffect(() => {
  const initializePayments = async () => {
    if (!idProc) return;

    try {
      setLoading(true);
      
      // Get procedure with permis details
      const procedureResponse = await axios.get(`${apiURL}/payments/procedures/${idProc}`);
      
      if (!procedureResponse.data.permis) throw new Error('Aucun permis associé');

      const currentPermisId = procedureResponse.data.permis.id;
      setPermisId(currentPermisId);
      setPermisDetails(procedureResponse.data.permis);
      
      // Get attribution date from permis if available
      const attributionDate = procedureResponse.data.permis.date_octroi 
        ? new Date(procedureResponse.data.permis.date_octroi)
        : new Date();
      setDateAttribution(attributionDate);

      // Check if obligations exist
      const obligationsResponse = await axios.get(
        `${apiURL}/payments/obligations/${currentPermisId}`
      );

      if (obligationsResponse.data.length === 0) {
        // Initialize obligations with attribution date
        await axios.post(`${apiURL}/payments/initialize/${currentPermisId}/${idProc}`, {
          dateAttribution: attributionDate.toISOString()
        });
        
        // Get the newly created obligations
        const newObligationsResponse = await axios.get(
          `${apiURL}/payments/obligations/${currentPermisId}`
        );
        
        // Get TsPaiement data for surface tax obligations
        const obligationsWithTsPaiement = await Promise.all(
          newObligationsResponse.data.map(async (obligation: any) => {
            if (obligation.typePaiement?.libelle === 'Taxe superficiaire') {
              try {
                const tsPaiementResponse = await axios.get(
                  `${apiURL}/payments/ts-paiement/obligation/${obligation.id}`
                );
                return {
                  ...obligation,
                  tsPaiements: tsPaiementResponse.data
                };
              } catch (error) {
                console.error('Error fetching TsPaiement data:', error);
                return obligation;
              }
            }
            return obligation;
          })
        );
        
        setObligations(obligationsWithTsPaiement);
      } else {
        // Get TsPaiement data for existing surface tax obligations
        const obligationsWithTsPaiement = await Promise.all(
          obligationsResponse.data.map(async (obligation: any) => {
            if (obligation.typePaiement?.libelle === 'Taxe superficiaire') {
              try {
                const tsPaiementResponse = await axios.get(
                  `${apiURL}/payments/ts-paiement/obligation/${obligation.id}`
                );
                return {
                  ...obligation,
                  tsPaiements: tsPaiementResponse.data
                };
              } catch (error) {
                console.error('Error fetching TsPaiement data:', error);
                return obligation;
              }
            }
            return obligation;
          })
        );
        
        setObligations(obligationsWithTsPaiement);
      }
    } catch (err) {
      console.error('Error in initializePayments:', err);
      setError(err instanceof Error ? err.message : 'Échec de l\'initialisation');
    } finally {
      setLoading(false);
    }
  };

  initializePayments();
}, [idProc, router.asPath]);

  const handleTerminerProcedure = async () => {
    if (!idProc) return;
    
    try {
      const res = await axios.put(`${apiURL}/api/procedures/terminer/${idProc}`);
      await axios.post(`${apiURL}/api/procedure-etape/finish/${idProc}/9`);
      alert('Procédure terminée avec succés');
      router.push(`/demande/Timeline/Timeline?id=${idProc}`)
       
    } catch (err) {
      alert('Erreur lors de la terminaison de la procédure');
      console.error(err);
    }
  };

  const handleBack = () => {
    if (!idProc) {
      setError("ID procédure manquant");
      return;
    }
    router.push(`/demande/step8/page8?id=${idProc}`)
  };

  useEffect(() => {
    if (!idProc) return;

    axios.get(`${apiURL}/api/procedures/${idProc}/demande`)
      .then(res => {
        setStatutProc(res.data.procedure.statut_proc);
      })
      .catch(err => {
        console.error("Erreur lors de la récupération de la demande", err);
      });
  }, [idProc, router.asPath]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Payé':
        return <FiCheckCircle className={styles.statusIconPaid} />;
      case 'En retard':
        return <FiAlertCircle className={styles.statusIconOverdue} />;
      case 'A payer':
        return <FiClock className={styles.statusIconPending} />;
      default:
        return <FiClock className={styles.statusIconPending} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Payé':
        return 'Payé';
      case 'En retard':
        return 'En retard';
      case 'A payer':
        return 'En attente';
      default:
        return status;
    }
  };

  const getLegalReference = (paymentTypeId: number): string => {
    switch (paymentTypeId) {
      case 1: return 'Article 45 du Code Minier';
      case 2: return 'Article 28 du Code Minier';
      case 3: return 'Article 33 Décret 07-154';
      default: return '';
    }
  };

  // Enhanced getPeriodDisplay function
const formatDateUTC = (dateString: string | Date) => {
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};
const getPeriodDisplay = (obligation: Obligation) => {
  if (obligation.typePaiement.libelle !== "Taxe superficiaire") {
    return <span className={styles.fiscalYear}>{obligation.fiscalYear}</span>;
  }

  if (obligation.tsPaiements && obligation.tsPaiements.length > 0) {
    const tsPaiement = obligation.tsPaiements[0];
    return (
      <div className={styles.periodDisplay}>
        <div className={styles.dateBox}>
          <span className={styles.label}>Début</span>
          <span className={styles.date}>{formatDateUTC(tsPaiement.datePerDebut)}</span>
        </div>
        <span className={styles.arrow}>⟶</span>
        <div className={styles.dateBox}>
          <span className={styles.label}>Fin</span>
          <span className={styles.date}>{formatDateUTC(tsPaiement.datePerFin)}</span>
        </div>
      </div>
    );
  }

  return <span className={styles.fiscalYear}>{obligation.fiscalYear}</span>;
};


  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Obligations fiscales</h1>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.appContainer}>
      <Navbar />
      <div className={styles.appContent}>
        <Sidebar currentView={currentView} navigateTo={navigateTo} />
        <main className={styles.mainContent}>
          <div className={styles.breadcrumb}>
            <span>SIGAM</span>
            <FiChevronRight className={styles.breadcrumbArrow} />
            <span>Mes obligations fiscales</span>
          </div>
          
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p>Chargement de vos obligations en cours...</p>
            </div>
          ) : (
            <>
              <div className={styles.container}>
                <div className={styles.header}>
                  <h1 className={styles.title}>
                    Mes obligations fiscales
                    <div className={styles.finalizeButtonContainer}>
                      <button
                        onClick={handleTerminerProcedure}
                        className={styles.finalizeButton}
                        disabled={statutProc === 'TERMINEE' || !statutProc}
                      >
                        ✅ Terminer la procédure
                      </button>
                    </div>
                  </h1>
                  <p className={styles.subtitle}>
                    Visualisez l'état de vos obligations fiscales pour ce permis
                  </p>
                </div>

                <div className={styles.summaryCards}>
                  <div className={styles.summaryCard}>
                    <div className={styles.cardIconTotal}>
                      <FiAlertCircle />
                    </div>
                    <div className={styles.cardContent}>
                      <h3>Total des obligations</h3>
                      <p className={styles.cardAmount}>{totalAmount.toLocaleString()} DZD</p>
                    </div>
                  </div>

                  <div className={styles.summaryCard}>
                    <div className={styles.cardIconPaid}>
                      <FiCheckCircle />
                    </div>
                    <div className={styles.cardContent}>
                      <h3>Montant payé</h3>
                      <p className={styles.cardAmount}>{paidAmount.toLocaleString()} DZD</p>
                    </div>
                  </div>

                  <div className={styles.summaryCard}>
                    <div className={styles.cardIconPending}>
                      <FiClock />
                    </div>
                    <div className={styles.cardContent}>
                      <h3>Restant à payer</h3>
                      <p className={styles.cardAmount}>{pendingAmount.toLocaleString()} DZD</p>
                    </div>
                  </div>
                </div>

                <div className={styles.obligationsSection}>
                  <h2>Détail des obligations</h2>

                  <div className={styles.obligationsTableContainer}>
                    <table className={styles.obligationsTable}>
                      <thead>
                        <tr>
                          <th>Type de frais</th>
                          <th>Référence légale</th>
                          <th>Montant (DZD)</th>
                          <th>Période</th>
                          <th>échéance</th>
                          <th>Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(obligations || []).map((obligation) => (
                          <tr key={obligation.id} className={styles.obligationRow}>
                            <td>
                              <div className={styles.obligationType}>
                                <strong>{obligation.typePaiement.libelle}</strong>
                              </div>
                            </td>
                            <td>
                              <div className={styles.legalReference}>
                                {getLegalReference(obligation.typePaiement.id)}
                              </div>
                            </td>
                            <td className={styles.amountCell}>
                              {obligation.amount.toLocaleString()} DZD
                            </td>
                            <td>
                              {getPeriodDisplay(obligation)}
                            </td>
                            <td>
                              {formatDateUTC(obligation.dueDate)}
                            </td>
                            <td>
                              <div className={styles.statusCell}>
                                {getStatusIcon(obligation.status)}
                                <span className={`${styles.statusText} ${styles[obligation.status]}`}>
                                  {getStatusText(obligation.status)}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {permisDetails && (
                  <div className={styles.permisInfoSection}>
                    <h2>Informations du permis</h2>
                    <div className={styles.permisInfoGrid}>
                      <div className={styles.permisInfoItem}>
                        <span className={styles.infoLabel}>Type de permis:</span>
                        <span className={styles.infoValue}>{permisDetails.typePermis?.lib_type}</span>
                      </div>
                      <div className={styles.permisInfoItem}>
                        <span className={styles.infoLabel}>Superficie:</span>
                        <span className={styles.infoValue}>{permisDetails.superficie} hectares</span>
                      </div>
                      <div className={styles.permisInfoItem}>
                        <span className={styles.infoLabel}>Date d'attribution:</span>
                        <span className={styles.infoValue}>{(permisDetails.date_octroi)}</span>
                      </div>
                      <div className={styles.permisInfoItem}>
                        <span className={styles.infoLabel}>Durée:</span>
                        <span className={styles.infoValue}>{permisDetails.typePermis?.duree_initiale} années</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className={styles.noteSection}>
                  <div className={styles.noteBox}>
                    <FiAlertCircle className={styles.noteIcon} />
                    <div className={styles.noteContent}>
                      <h3>Note importante</h3>
                      <p>
                        Cette interface vous permet de visualiser vos obligations fiscales.
                        Pour effectuer un paiement, veuillez contacter le département des fiscalités.
                        Tous les paiements doivent être effectués selon les modalités prévues par la réglementation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={styles.navigationButtons}>
                <button className={`${styles.btn} ${styles.btnOutline}`} onClick={handleBack}>
                  <FiChevronLeft className={styles.btnIcon} />
                  Précédent
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserObligationsPage;
