'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from '@/src/hooks/useSearchParams';
import axios from 'axios';
import Modal from 'react-modal';
import { ToastContainer } from 'react-toastify';
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiSave, 
  FiCalendar,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo
} from 'react-icons/fi';
import styles from './page8.module.css';
import Sidebar from "../../sidebar/Sidebar";
import Navbar from "../../navbar/Navbar";
import { useViewNavigator } from '../../../src/hooks/useViewNavigator';
import ProgressStepper from '../../../components/ProgressStepper';
import { useActivateEtape } from '@/src/hooks/useActivateEtape';
import { STEP_LABELS } from '@/src/constants/steps';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import router from 'next/router';
import { Phase, Procedure, ProcedurePhase, StatutProcedure } from '@/src/types/procedure';

if (typeof window !== 'undefined') {
  Modal.setAppElement('#__next');
}

type RenewalData = {
  nombre_renouvellements: number;
  num_decision: string;
  date_decision: string;
  date_debut_validite: string;
  date_fin_validite: string;
  commentaire: string;
  duree_renouvellement: number;
};

interface PermitDetails {
  id?:number;
  code_permis: string;
  typePermis: string;
  detenteur: string;
  date_expiration: string;
  currentStatus: string;
  id_typePermis?: number;
}

interface PermitTypeDetails {
  duree_renouv: number;
  nbr_renouv_max: number;
}

const PermitRenewalPage = () => {
  const searchParams = useSearchParams();
  const originalIdStr = searchParams?.get("originalDemandeId");
  const originalProcIdStr = searchParams?.get("original_proc_id");
  const idProcStr = searchParams?.get('id');
  const idProc = idProcStr ? parseInt(idProcStr, 10) : undefined;
  const originalId = originalIdStr ? parseInt(originalIdStr, 10) : undefined;
  const [permitDetails, setPermitDetails] = useState<PermitDetails | null>(null);
  const [permitTypeDetails, setPermitTypeDetails] = useState<PermitTypeDetails | null>(null);
  const [renewalData, setRenewalData] = useState<RenewalData>({
    nombre_renouvellements: 0,
    num_decision: '',
    date_decision: '',
    date_debut_validite: '',
    date_fin_validite: '',
    commentaire: '',
    duree_renouvellement: 1
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { currentView, navigateTo } = useViewNavigator();
  const [statutProc, setStatutProc] = useState<string | undefined>(undefined);
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const [currentStep, setCurrentStep] = useState(8);
  const [activatedSteps, setActivatedSteps] = useState<Set<number>>(new Set());
  const [stepsReady, setStepsReady] = useState(false);
  const [showCheckAllModal, setShowCheckAllModal] = useState(false);
  const [procedureData, setProcedureData] = useState<Procedure | null>(null);
  const [currentEtape, setCurrentEtape] = useState<{ id_etape: number } | null>(null);
  const [procedureTypeId, setProcedureTypeId] = useState<number | undefined>();
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [hasActivatedStep8, setHasActivatedStep8] = useState(false); 
  const [isPageReady, setIsPageReady] = useState(false);

  useActivateEtape({
    idProc,
    etapeNum: 8,
    shouldActivate: currentStep === 8 && !activatedSteps.has(8) && isPageReady,
    onActivationSuccess: (stepStatus: string) => {
      if (stepStatus === 'TERMINEE') {
        setActivatedSteps(prev => new Set(prev).add(8));
        setHasActivatedStep8(true);
        return;
      }

      setActivatedSteps(prev => new Set(prev).add(8));
      if (procedureData) {
        const updatedData = { ...procedureData };
        
        if (updatedData.ProcedureEtape) {
          const stepToUpdate = updatedData.ProcedureEtape.find(pe => pe.id_etape === 8);
          if (stepToUpdate && stepStatus === 'EN_ATTENTE') {
            stepToUpdate.statut = 'EN_COURS' as StatutProcedure;
          }
          setCurrentEtape({ id_etape: 8 });
        }
        
        if (updatedData.ProcedurePhase) {
          const phaseContainingStep8 = updatedData.ProcedurePhase.find(pp => 
            pp.phase?.etapes?.some(etape => etape.id_etape === 8)
          );
          if (phaseContainingStep8 && stepStatus === 'EN_ATTENTE') {
            phaseContainingStep8.statut = 'EN_COURS' as StatutProcedure;
          }
        }
        
        setProcedureData(updatedData);
        setHasActivatedStep8(true);
      }
      
      setTimeout(() => setRefetchTrigger(prev => prev + 1), 1000);
    }
  });

  
  const phases: Phase[] = procedureData?.ProcedurePhase 
    ? procedureData.ProcedurePhase
        .map((pp: ProcedurePhase) => pp.phase)
        .sort((a: Phase, b: Phase) => a.ordre - b.ordre)
    : [];


  useEffect(() => {
    if (permitDetails && permitTypeDetails) {
      calculateNewDates();
    }
  }, [permitDetails, permitTypeDetails, renewalData.duree_renouvellement]);

  useEffect(() => {
    if (!idProc) return;

    const fetchProcedureData = async () => {
      try {
        const [procedureRes, renewalRes] = await Promise.all([
          axios.get(`${apiURL}/api/procedures/${idProc}`),
          axios.get(`${apiURL}/api/procedures/${idProc}/renouvellement`)
            .catch(() => ({ data: null })),
        ]);
        
    setShowConfirmation(false);
        const procedureData = procedureRes.data;
        setStatutProc(procedureData.statut_proc);

        const permit = renewalRes.data?.permis || procedureData.permis?.[0];
        
        if (permit) {
          setPermitDetails({
            id:permit.id,
            code_permis: permit.code_permis,
            typePermis: permit.typePermis?.lib_type || 'N/A',
            detenteur: permit.detenteur?.nom_societeFR || 'N/A',
            date_expiration: permit.date_expiration,
            currentStatus: permit.statut?.lib_statut || 'N/A',
            id_typePermis: permit.id_typePermis
          });

          if (permit.id_typePermis) {
            const typeRes = await axios.get(
              `${apiURL}/api/procedures/type/${permit.id_typePermis}/permit-type-details`
            );

            setPermitTypeDetails({
              duree_renouv: typeRes.data.duree_renouv,
              nbr_renouv_max: typeRes.data.nbr_renouv_max
            });

            setRenewalData(prev => ({
              ...prev,
              duree_renouvellement: Math.min(prev.duree_renouvellement, typeRes.data.duree_renouv)
            }));
          }
        }

        if (renewalRes.data) {
          setRenewalData({
            num_decision: renewalRes.data.num_decision || '',
            date_decision: renewalRes.data.date_decision || '',
            date_debut_validite: renewalRes.data.date_debut_validite || '',
            date_fin_validite: renewalRes.data.date_fin_validite || '',
            commentaire: renewalRes.data.commentaire || '',
            duree_renouvellement: renewalRes.data.duree_renouvellement || 1,
            nombre_renouvellements: renewalRes.data.permis.nombre_renouvellements,
          });
        }
      } catch (err) {
        console.error("Failed to fetch procedure data:", err);
        toast.error("échec du chargement des données du permis");
      }
    };

    fetchProcedureData();
  }, [idProc]);

  const generateDurationOptions = (maxDuration: number) => {
    const options = [];
    if (maxDuration >= 0.5) options.push({ value: 0.5, label: '6 mois' });
    for (let i = 1; i <= maxDuration; i++) {
      options.push({ value: i, label: `${i} an${i > 1 ? 's' : ''}` });
    }
    return options;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRenewalData(prev => ({
      ...prev,
      [name]: value
    }));

    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const duration = parseFloat(e.target.value);
    setRenewalData(prev => ({
      ...prev,
      duree_renouvellement: duration
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const requiredFields: (keyof RenewalData)[] = ['num_decision', 'date_decision', 'duree_renouvellement'];

    requiredFields.forEach(field => {
      if (!renewalData[field]) {
        errors[field] = 'Ce champ est obligatoire';
      }
    });

    if (permitTypeDetails && renewalData.duree_renouvellement > permitTypeDetails.duree_renouv) {
      errors.duree_renouvellement = `La durée ne peut pas dépasser ${permitTypeDetails.duree_renouv} an(s)`;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateNewDates = () => {
    if (!permitDetails?.date_expiration || !renewalData.duree_renouvellement) return;

    const expirationDate = new Date(permitDetails.date_expiration);
    const endDate = new Date(expirationDate);
    
    if (renewalData.duree_renouvellement === 0.5) {
      endDate.setMonth(endDate.getMonth() + 6);
    } else {
      endDate.setFullYear(endDate.getFullYear() + renewalData.duree_renouvellement);
    }

    setRenewalData(prev => ({
      ...prev,
      date_debut_validite: expirationDate.toISOString().split('T')[0],
      date_fin_validite: endDate.toISOString().split('T')[0]
    }));
  };

  // In your renewal page component

const handleSubmit = async () => {
  if (!validateForm()) return;
  if (!idProc || !permitDetails) {
    toast.error("Données du permis manquantes");
    return;
  }

  setIsSubmitting(true);

  try {
    // First, save the renewal data
    await axios.post(`${apiURL}/api/procedures/${idProc}/renouvellement`, {
      ...renewalData,
      date_decision: new Date(renewalData.date_decision).toISOString(),
      date_debut_validite: new Date(renewalData.date_debut_validite).toISOString(),
      date_fin_validite: new Date(renewalData.date_fin_validite).toISOString(),
      duree_renouvellement: renewalData.duree_renouvellement
    });

    // Then initialize obligations for renewal with explicit renewal parameters
    try {
    await axios.post(`${apiURL}/payments/renewal/${permitDetails.id}/${idProc}`, {
      renewalStartDate: renewalData.date_debut_validite,
      renewalDuration: renewalData.duree_renouvellement
    });
    toast.success("Obligations de renouvellement créées avec succés!");
  } catch (error) {
    toast.error("Erreur lors de la création des obligations de renouvellement");
  }

    const procedureRes = await axios.get(`${apiURL}/api/procedures/${idProc}`);
    let updatedPermit;
    try {
      const permitRes = await axios.get(`${apiURL}/api/procedures/${idProc}/permis`);
      updatedPermit = permitRes.data;
    } catch (permisError) {
      console.warn('Could not fetch permit directly, falling back to procedure data');
      updatedPermit = procedureRes.data.permis?.[0] || procedureRes.data;
    }

    if (!updatedPermit?.date_expiration) {
      console.error('Permit data missing expiration:', updatedPermit);
      throw new Error("Données de permis incomplétes - date d'expiration manquante");
    }

    setPermitDetails(prev => ({
      ...prev!,
      date_expiration: updatedPermit.date_expiration
    }));

    toast.success("Renouvellement enregistré avec succés!");
    setShowConfirmation(false);
  } catch (err) {
    console.error("Full error details:", err);
    const errorMessage = err instanceof Error ? err.message : "Erreur technique";
    toast.error(`échec du renouvellement: ${errorMessage}`);
  } finally {
    setIsSubmitting(false);
  }
};

  const handleNext = () => {
    router.push(`/renouvellement/step9/page9?id=${idProc}&originalDemandeId=${originalId}&original_proc_id=${originalIdStr}`);
  };

  const handleBack = () => {
    router.push(`/renouvellement/step7/page7?id=${idProc}&originalDemandeId=${originalId}&original_proc_id=${originalIdStr}`);
  };

  const handleSaveEtape = async () => {
    if (!idProc) {
      toast.error("ID procedure manquant");
      return;
    }

    try {
      await axios.post(`${apiURL}/api/procedure-etape/finish/${idProc}/8`);
      toast.success("étape 8 enregistrée avec succés");
    } catch (err) {
      console.error("Erreur étape", err);
      toast.error("Erreur lors de l'enregistrement de l'étape");
    }
  };

  if (!permitDetails || !permitTypeDetails) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Chargement des détails du permis...</p>
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
            <span>Renouvellement de permis</span>
          </div>

          <div className={styles.contentWrapper}>
            {procedureData && (
              <ProgressStepper
                phases={phases}
                currentProcedureId={idProc}
                currentEtapeId={currentStep}
                procedurePhases={procedureData.ProcedurePhase || []}
                procedureTypeId={procedureTypeId}
              />
            )}

            <div className={styles.renewalContainer}>
              <header className={styles.header}>
                <h1>Renouvellement du Permis Minier</h1>
                <p className={styles.subtitle}>Prolongation de la validité du permis existant</p>
              </header>

              <div className={styles.renewalGrid}>
                <section className={styles.permitDetails}>
                  <div className={styles.detailCard}>
                    <h2>
                      <FiFileText /> Détails du permis actuel
                    </h2>
                    <div className={styles.detailList}>
                      <div className={styles.detailItem}>
                        <strong>Code permis:</strong> {permitDetails.code_permis}
                      </div>
                      <div className={styles.detailItem}>
                        <strong>Type:</strong> {permitDetails.typePermis}
                      </div>
                      <div className={styles.detailItem}>
                        <strong>Titulaire:</strong> {permitDetails.detenteur}
                      </div>
                      <div className={styles.detailItem}>
                        <strong>Date d'expiration:</strong> {new Date(permitDetails.date_expiration).toLocaleDateString()}
                      </div>
                      <div className={styles.detailItem}>
                        <strong>Statut actuel:</strong> 
                        <span className={`${styles.statusBadge} ${permitDetails.currentStatus === 'En vigueur' ? styles.active : styles.pending}`}>
                          {permitDetails.currentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                <section className={styles.renewalForm}>
                  <div className={styles.formCard}>
                    <h2>
                      <FiCalendar /> Détails du renouvellement
                    </h2>

                    <div className={styles.formGroup}>
                      <label htmlFor="num_decision">Numéro de décision</label>
                      <input
                        type="text"
                        id="num_decision"
                        name="num_decision"
                        value={renewalData.num_decision}
                        onChange={handleChange}
                        className={validationErrors.num_decision ? styles.errorInput : ''}
                      />
                      {validationErrors.num_decision && (
                        <span className={styles.errorMessage}>{validationErrors.num_decision}</span>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="date_decision">Date de décision</label>
                      <input
                        type="date"
                        id="date_decision"
                        name="date_decision"
                        value={renewalData.date_decision}
                        onChange={handleChange}
                        className={validationErrors.date_decision ? styles.errorInput : ''}
                      />
                      {validationErrors.date_decision && (
                        <span className={styles.errorMessage}>{validationErrors.date_decision}</span>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="duree_renouvellement">Durée du renouvellement</label>
                      <select
                        id="duree_renouvellement"
                        name="duree_renouvellement"
                        value={renewalData.duree_renouvellement}
                        onChange={handleDurationChange}
                        className={validationErrors.duree_renouvellement ? styles.errorInput : ''}
                      >
                        <option value="">Sélectionner une durée</option>
                        {permitTypeDetails && generateDurationOptions(permitTypeDetails.duree_renouv).map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      {validationErrors.duree_renouvellement && (
                        <span className={styles.errorMessage}>{validationErrors.duree_renouvellement}</span>
                      )}
                      <div className={styles.durationInfo}>
                        <FiInfo /> Durée maximale autorisée: {permitTypeDetails?.duree_renouv} an(s) | 
                        Renouvellements restants: {permitTypeDetails?.nbr_renouv_max - renewalData.nombre_renouvellements}
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="date_debut_validite">Nouvelle date de début</label>
                      <input
                        type="date"
                        id="date_debut_validite"
                        name="date_debut_validite"
                        value={renewalData.date_debut_validite}
                        readOnly
                        className={styles.readOnlyInput}
                      />
                      <div className={styles.dateInfo}>
                        Correspond à la date d'expiration actuelle du permis
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="date_fin_validite">Nouvelle date d'expiration</label>
                      <input
                        type="date"
                        id="date_fin_validite"
                        name="date_fin_validite"
                        value={renewalData.date_fin_validite}
                        readOnly
                        className={styles.readOnlyInput}
                      />
                      <div className={styles.dateInfo}>
                        {renewalData.duree_renouvellement === 0.5 
                          ? '6 mois aprés la date d\'expiration actuelle'
                          : `${renewalData.duree_renouvellement} an(s) aprés la date d\'expiration actuelle`}
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="commentaire">Commentaires (optionnel)</label>
                      <textarea
                        id="commentaire"
                        name="commentaire"
                        value={renewalData.commentaire}
                        onChange={handleChange}
                        rows={3}
                      />
                    </div>

                    <div className={styles.formActions}>
                      <button
                        className={styles.calculateButton}
                        onClick={calculateNewDates}
                        disabled={!renewalData.duree_renouvellement || !permitDetails.date_expiration}
                      >
                        Calculer les nouvelles dates
                      </button>

                      <button
                        className={styles.submitButton}
                        onClick={() => setShowConfirmation(true)}
                        disabled={!renewalData.date_fin_validite || isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className={styles.buttonLoading}>
                            <span className={styles.spinner}></span>
                            Enregistrement...
                          </span>
                        ) : (
                          <>
                            <FiSave /> Enregistrer le renouvellement
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div className={styles.navigationButtons}>
            <button className={styles.backButton} onClick={handleBack}>
              <FiChevronLeft /> Précédent
            </button>
            <button className={styles.saveButton} onClick={handleSaveEtape}>
              <FiSave /> Sauvegarder l'étape
            </button>
            <button 
              className={styles.nextButton} 
              onClick={handleNext}
              disabled={!renewalData.date_fin_validite || isSubmitting}
            >
              Suivant <FiChevronRight />
            </button>
          </div>

          <Modal
  isOpen={showConfirmation}
  onRequestClose={() => setShowConfirmation(false)}
  className={styles.modal}
  overlayClassName={styles.modalOverlay}
>
  <div className={styles.modalContent}>
    <h2>
      <FiAlertCircle /> Confirmer le renouvellement
    </h2>
    <p>Vous êtes sur le point de renouveler le permis <strong>{permitDetails.code_permis}</strong>.</p>
    
    <div className={styles.confirmationDetails}>
      <div className={styles.confirmationItem}>
        <strong>Nouvelle date d'expiration:</strong> 
        {new Date(renewalData.date_fin_validite).toLocaleDateString()}
      </div>
      <div className={styles.confirmationItem}>
        <strong>Durée:</strong> 
        {renewalData.duree_renouvellement === 0.5 ? '6 mois' : `${renewalData.duree_renouvellement} an(s)`}
      </div>
      <div className={styles.confirmationItem}>
        <strong>Obligations fiscales:</strong> 
        {renewalData.duree_renouvellement === 0.5 ? '1 obligation (6 mois)' : `${renewalData.duree_renouvellement} obligations annuelles`}
      </div>
    </div>

    <div className={styles.modalButtons}>
      <button 
        className={styles.modalCancel}
        onClick={() => setShowConfirmation(false)}
      >
        Annuler
      </button>
      <button 
        className={styles.modalConfirm}
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Enregistrement...' : 'Confirmer'}
      </button>
    </div>
  </div>
</Modal>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </main>
      </div>
    </div>
  );
};

export default PermitRenewalPage;