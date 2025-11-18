'use client';

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useDemandeInfo } from '../../../utils/useDemandeInfo';
import { FiChevronLeft, FiChevronRight, FiUser, FiDollarSign, FiTool, FiFileText, FiCalendar } from 'react-icons/fi';
import styles from './capacites.module.css';
import { useSearchParams } from '@/src/hooks/useSearchParams';
import Navbar from '../../navbar/Navbar';
import Sidebar from '../../sidebar/Sidebar';
import { BsSave } from 'react-icons/bs';
import { useViewNavigator } from '../../../src/hooks/useViewNavigator';
import ProgressStepper from '../../../components/ProgressStepper';
import { STEP_LABELS } from '../../../src/constants/steps';
import { useActivateEtape } from '@/src/hooks/useActivateEtape';
import ExpertDropdown from '@/components/ExpertDropdown';
import { toast } from 'react-toastify';
import { Phase, Procedure, ProcedureEtape, ProcedurePhase, StatutProcedure } from '@/src/types/procedure';
import router from 'next/router';

type ExpertMinier = {
  id_expert: number;
  nom_expert: string;
  num_agrement: string;
  date_agrement: string;
  etat_agrement: string;
  adresse: string | null;
  email: string | null;
  tel_expert: string | null;
  fax_expert: string | null;
  specialisation: string | null;
};

// Data status interface
interface DataStatus {
  idProc: boolean;
  procedureData: boolean;
  idDemande: boolean;
  allDataReady: boolean;
}

export default function Capacites() {
  const [form, setForm] = useState({
    id_expert: 0,
    duree_travaux: '',
    capital_social: '',
    budget: '',
    description: '',
    financement: '',
    nom_expert: '',
    specialisation: '',
    num_agrement: '',
    etat_agrement: '',
    date_demarrage_prevue: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { isReady } = useDemandeInfo();
  const searchParams = useSearchParams();
  const [idDemande, setIdDemande] = useState<string | null>(null);
  const [codeDemande, setCodeDemande] = useState<string | null>(null);
  const [savingEtape, setSavingEtape] = useState(false);
  const [etapeMessage, setEtapeMessage] = useState<string | null>(null);
  const { currentView, navigateTo } = useViewNavigator("nouvelle-demande");
  const [statutProc, setStatutProc] = useState<string | undefined>(undefined);
  const [currentStep, setCurrentStep] = useState(3);
  const [activatedSteps, setActivatedSteps] = useState<Set<number>>(new Set());
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const [selectedExpert, setSelectedExpert] = useState<ExpertMinier | null>(null);
  const [procedureData, setProcedureData] = useState<Procedure | null>(null);
  const [currentEtape, setCurrentEtape] = useState<{ id_etape: number } | null>(null);
  const [procedureTypeId, setProcedureTypeId] = useState<number | undefined>();
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [hasActivatedStep3, setHasActivatedStep3] = useState(false);
  const [idProc, setIdProc] = useState<number | undefined>(undefined);
  const [isPageReady, setIsPageReady] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Chargement des données...');
  const [dataStatus, setDataStatus] = useState<DataStatus>({
    idProc: false,
    procedureData: false,
    idDemande: false,
    allDataReady: false
  });
  const [checkInterval, setCheckInterval] = useState<NodeJS.Timeout | null>(null);
  // Missing docs alert for first-phase reminder
  const [missingDocsAlert, setMissingDocsAlert] = useState<{ missing: string[]; deadline?: string | null } | null>(null);
  const [tick, setTick] = useState(0);

  const computeRemaining = (deadline?: string | null) => {
    if (!deadline) return null;
    const d = new Date(deadline).getTime();
    const now = Date.now();
    const diff = d - now;
    if (diff <= 0) return 'Délai expiré';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}j ${hours}h restants`;
  };

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!idDemande) { setMissingDocsAlert(null); return; }
    const controller = new AbortController();
    const load = async () => {
      try {
        const res = await axios.get(`${apiURL}/api/procedure/${idDemande}/documents`, { signal: controller.signal });
        const miss = (res.data?.missingSummary?.requiredMissing ?? []).map((d: any) => d.nom_doc);
        const deadline = res.data?.deadlines?.miseEnDemeure ?? null;
        if (Array.isArray(miss) && miss.length > 0) {
          setMissingDocsAlert({ missing: miss, deadline });
        } else {
          setMissingDocsAlert(null);
        }
      } catch (e) {
        if (!axios.isCancel(e)) setMissingDocsAlert(null);
      }
    };
    load();
    return () => controller.abort();
  }, [idDemande, apiURL, tick]);

  // Check if all required data is available
  const checkRequiredData = useCallback(() => {
    const newStatus = {
      idProc: !!idProc,
      procedureData: !!procedureData,
      idDemande: !!idDemande,
      allDataReady: !!(idProc && procedureData && idDemande)
    };
    
    setDataStatus(newStatus);
    return newStatus.allDataReady;
  }, [idProc, procedureData, idDemande]);

  // Set up interval to check for required data
  useEffect(() => {
    // Clear any existing interval
    if (checkInterval) {
      clearInterval(checkInterval);
      setCheckInterval(null);
    }

    // If all data is ready, set page as ready
    if (checkRequiredData()) {
      setIsPageReady(true);
      setIsLoading(false);
      return;
    }

    // Set up a new interval to check for data
    const interval = setInterval(() => {
      const allReady = checkRequiredData();
      if (allReady) {
        setIsPageReady(true);
        setIsLoading(false);
        clearInterval(interval);
        setCheckInterval(null);
      }
    }, 100); // Check every 100ms

    setCheckInterval(interval);
    
    // Cleanup interval on component unmount
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [checkRequiredData]);

  // Get idProc from URL parameters
  useEffect(() => {
    const idProcStr = searchParams?.get('id');
    if (!idProcStr) {
      setLoadingMessage("ID de procédure non trouvé dans les paramétres");
      return;
    }

    const parsedId = parseInt(idProcStr, 10);
    if (isNaN(parsedId)) {
      setLoadingMessage("ID de procédure invalide");
      return;
    }

    setIdProc(parsedId);
    setLoadingMessage("Chargement des données de la procédure...");
  }, [searchParams]);

  // Fetch procedure data when idProc is available
  useEffect(() => {
    if (!idProc) return;

    const fetchProcedureData = async () => {
      try {
        const response = await axios.get<Procedure>(`${apiURL}/api/procedure-etape/procedure/${idProc}`);
        setProcedureData(response.data);
        
        if (response.data.demandes && response.data.demandes.length > 0) {
          setProcedureTypeId(response.data.demandes[0].typeProcedure?.id);
        }

        const activeEtape = response.data.ProcedureEtape.find((pe: ProcedureEtape) => pe.statut === 'EN_COURS');
        if (activeEtape) {
          setCurrentEtape({ id_etape: activeEtape.id_etape });
        }
        
        setLoadingMessage("Données de procédure chargées, récupération de la demande...");
      } catch (error) {
        console.error('Error fetching procedure data:', error);
        setLoadingMessage("Erreur lors du chargement des données de procédure");
      }
    };

    fetchProcedureData();
  }, [idProc, apiURL]);

  // Fetch demande data when procedure data is available
  useEffect(() => {
    if (!idProc || !procedureData) return;
    
    const fetchDemandeFromProc = async () => {
      try {
        const response = await axios.get(`${apiURL}/api/procedures/${idProc}/demande`);
        const demande = response.data;
        setIdDemande(demande.id_demande.toString());
        setCodeDemande(demande.code_demande);
        setStatutProc(demande.procedure.statut_proc);
        
        setForm({
          id_expert: demande.expertMinier?.id_expert || 0,
          duree_travaux: demande.duree_travaux_estimee || '',
          capital_social: demande.capital_social_disponible || '',
          budget: demande.budget_prevu || '',
          description: demande.description_travaux || '',
          financement: demande.sources_financement || '',
          nom_expert: demande.expertMinier?.nom_expert || '',
          specialisation: demande.expertMinier?.specialisation || '',
          num_agrement: demande.expertMinier?.num_agrement || '',
          etat_agrement: demande.expertMinier?.etat_agrement || '',
          date_demarrage_prevue: demande.date_demarrage_prevue?.split('T')[0] || ''
        });
        
        setLoadingMessage("Données de demande chargées, préparation de l'interface...");
      } catch (err) {
        console.error("Erreur récupération de la demande :", err);
        setError("Erreur récupération de la demande");
        setLoadingMessage("Erreur lors de la récupération de la demande");
      }
    };

    fetchDemandeFromProc();
  }, [idProc, procedureData, apiURL]);

  useActivateEtape({
    idProc,
    etapeNum: 3,
    shouldActivate: currentStep === 3 && !activatedSteps.has(3) && isPageReady,
    onActivationSuccess: (stepStatus: string) => {
      if (stepStatus === 'TERMINEE') {
        setActivatedSteps(prev => new Set(prev).add(3));
        setHasActivatedStep3(true);
        return;
      }

      setActivatedSteps(prev => new Set(prev).add(3));
      if (procedureData) {
        const updatedData = { ...procedureData };
        
        if (updatedData.ProcedureEtape) {
          const stepToUpdate = updatedData.ProcedureEtape.find(pe => pe.id_etape === 3);
          if (stepToUpdate && stepStatus === 'EN_ATTENTE') {
            stepToUpdate.statut = 'EN_COURS' as StatutProcedure;
          }
          setCurrentEtape({ id_etape: 3 });
        }
        
        if (updatedData.ProcedurePhase) {
          const phaseContainingStep3 = updatedData.ProcedurePhase.find(pp => 
            pp.phase?.etapes?.some(etape => etape.id_etape === 3)
          );
          if (phaseContainingStep3 && stepStatus === 'EN_ATTENTE') {
            phaseContainingStep3.statut = 'EN_COURS' as StatutProcedure;
          }
        }
        
        setProcedureData(updatedData);
        setHasActivatedStep3(true);
      }
      
      setTimeout(() => setRefetchTrigger(prev => prev + 1), 1000);
    }
  });

  const phases: Phase[] = procedureData?.ProcedurePhase 
    ? procedureData.ProcedurePhase
        .slice()
        .sort((a: ProcedurePhase, b: ProcedurePhase) => a.ordre - b.ordre)
        .map((pp: ProcedurePhase) => ({
          ...pp.phase,
          ordre: pp.ordre,
        }))
    : [];

  useEffect(() => {
    if (!isPageReady || !selectedExpert) return;

    setForm(prev => ({
      ...prev,
      nom_expert: selectedExpert.nom_expert,
      specialisation: selectedExpert.specialisation || '',
      num_agrement: selectedExpert.num_agrement || '',
      etat_agrement: selectedExpert.etat_agrement,
      id_expert: selectedExpert.id_expert, 
    }));
  }, [isPageReady, selectedExpert]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSaveEtape = async () => {
    if (!idProc) {
      setEtapeMessage("ID procedure introuvable !");
      return;
    }

    setSavingEtape(true);
    setEtapeMessage(null);

    try {
      await axios.post(`${apiURL}/api/procedure-etape/finish/${idProc}/3`);
      setEtapeMessage("étape 3 enregistrée avec succés !");
    } catch (err) {
      console.error(err);
      setEtapeMessage("Erreur lors de l'enregistrement de l'étape.");
    } finally {
      setSavingEtape(false);
    }
  };

  const handleNext = async () => {
    if (!idDemande) {
      toast.error("ID de demande non disponible");
      return;
    }

    try {
      await axios.put(`${apiURL}/api/capacites`, {
        id_demande: idDemande,
        duree_travaux: form.duree_travaux,
        capital_social: form.capital_social,
        budget: form.budget,
        description: form.description,
        financement: form.financement,
        date_demarrage_prevue: form.date_demarrage_prevue,
        id_expert: form.id_expert,
      });

      toast.success("✅ Capacités enregistrées avec succés");
      router.push(`/demande/step4/page4?id=${idProc}`);
    } catch (err) {
      console.error(err);
      toast.error("❌ Erreur lors de l'enregistrement");
    }
  };

  const handleBack = () => {
    if (!idProc) {
      setError("ID procédure manquant");
      return;
    }
    router.push(`/demande/step2/page2?id=${idProc}`);
  };

  if (!isReady) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement des informations de la demande...</p>
      </div>
    );
  }

  if (!isPageReady) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>{loadingMessage}</p>
        <div className={styles.dataStatus}>
          <p>état des données:</p>
          <ul>
            <li>ID Procédure: {dataStatus.idProc ? 'âœ“' : 'â³'}</li>
            <li>Données Procédure: {dataStatus.procedureData ? 'âœ“' : 'â³'}</li>
            <li>ID Demande: {dataStatus.idDemande ? 'âœ“' : 'â³'}</li>
          </ul>
        </div>
      </div>
    );
  }

  return (    
    <div className={styles.appContainer}>
      <Navbar />
      <div className={styles.appContent}>
        <Sidebar currentView={currentView} navigateTo={navigateTo} />
        <main className={styles.mainContent}>
          {missingDocsAlert && (
            <div style={{
              background: 'rgba(220,38,38,0.1)',
              border: '1px solid rgba(220,38,38,0.4)',
              padding: '10px 12px',
              borderRadius: 6,
              marginBottom: 12,
              color: '#991b1b',
              fontWeight: 600,
            }}>
              Documents obligatoires manquants: {missingDocsAlert.missing.join(', ')}
              {missingDocsAlert.deadline && (
                <span style={{ marginLeft: 8, fontWeight: 500 }}>
                  — {computeRemaining(missingDocsAlert.deadline)}
                </span>
              )}
            </div>
          )}
          <div className={styles.breadcrumb}>
            <span>SIGAM</span>
            <FiChevronRight className={styles.breadcrumbArrow} />
            <span>Capacitiés</span>
          </div>
          <div className={styles.capacitesContainer}>
            <div className={styles.contentWrapper}>
              {/* Progress Steps */}
              {procedureData && (
                <ProgressStepper
                  phases={phases}
                  currentProcedureId={idProc}
                  currentEtapeId={currentStep}
                  procedurePhases={procedureData.ProcedurePhase || []}
                  procedureTypeId={procedureTypeId}
                />
              )}

              <h2 className={styles.pageTitle}>
                <span className={styles.stepNumber}>étape 3</span>
                Capacités techniques et financiéres
              </h2>

              {codeDemande && idDemande && (
                <div className={styles.infoCard}>
                  <div className={styles.infoHeader}>
                    <h4 className={styles.infoTitle}>
                      <FiFileText className={styles.infoIcon} />
                      Informations Demande
                    </h4>
                  </div>
                  <div className={styles.infoContent}>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Code Demande :</span>
                      <span className={styles.infoValue}>{codeDemande}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>ID Demande :</span>
                      <span className={styles.infoValue}>{idDemande}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className={styles.formSections}>
                {/* Capacités Techniques Section */}
                <section className={styles.formSection}>
                  <div className={styles.sectionHeader}>
                    <FiTool className={styles.sectionIcon} />
                    <h3 className={styles.sectionTitle}>Capacités techniques</h3>
                  </div>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Durée estimée des travaux (mois)</label>
                      <input
                        disabled={statutProc === 'TERMINEE'}
                        type="text"
                        name="duree_travaux"
                        className={styles.formInput}
                        onChange={handleChange}
                        value={form.duree_travaux}
                        placeholder="Ex: 24"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Capital social disponible</label>
                      <input
                        disabled={statutProc === 'TERMINEE'}
                        type="text"
                        name="capital_social"
                        className={styles.formInput}
                        onChange={handleChange}
                        value={form.capital_social}
                        placeholder="Ex: 500 000 DZD"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Budget prévu</label>
                      <input
                        disabled={statutProc === 'TERMINEE'}
                        type="text"
                        name="budget"
                        className={styles.formInput}
                        onChange={handleChange}
                        value={form.budget}
                        placeholder="Ex: 2 000 000 DZD"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        <FiCalendar className={styles.inputIcon} />
                        Date de Début Prévue
                      </label>
                      <input
                        disabled={statutProc === 'TERMINEE'}
                        type="date"
                        name="date_demarrage_prevue"
                        className={styles.formInput}
                        value={form.date_demarrage_prevue}
                        onChange={handleChange}
                      />
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label className={styles.formLabel}>Description des travaux techniques</label>
                      <textarea
                        disabled={statutProc === 'TERMINEE'}
                        name="description"
                        className={styles.formTextarea}
                        onChange={handleChange}
                        value={form.description}
                        placeholder="Décrivez les travaux techniques prévus..."
                        rows={4}
                      />
                    </div>
                  </div>
                </section>

                {/* Capacités Financiéres Section */}
                <section className={styles.formSection}>
                  <div className={styles.sectionHeader}>
                    <FiDollarSign className={styles.sectionIcon} />
                    <h3 className={styles.sectionTitle}>Capacités financiéres</h3>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Sources de financement</label>
                    <textarea
                      disabled={statutProc === 'TERMINEE'}
                      name="financement"
                      className={styles.formTextarea}
                      onChange={handleChange}
                      value={form.financement}
                      placeholder="Détaillez vos sources de financement..."
                      rows={4}
                    />
                  </div>
                </section>

                {/* Expert Minier Section */}
                <section className={styles.formSection}>
                  <div className={styles.sectionHeader}>
                    <FiUser className={styles.sectionIcon} />
                    <h3 className={styles.sectionTitle}>Expert minier</h3>
                  </div>
                  
                  <div className={styles.expertSelector}>
                    <ExpertDropdown 
                      onSelect={setSelectedExpert}
                      disabled={statutProc === 'TERMINEE'}
                      initialExpert={form.id_expert ? selectedExpert : null}
                    />
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Nom complet*</label>
                      <input
                        type="text"
                        name="nom_expert"
                        className={styles.formInput}
                        onChange={handleChange}
                        value={form.nom_expert}
                        placeholder="Nom et prénom de l'expert"
                        required
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Specialisation*</label>
                      <input
                        type="text"
                        name="specialisation"
                        className={styles.formInput}
                        onChange={handleChange}
                        value={form.specialisation}
                        placeholder="Ex: Géologue senior"
                        required
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Numéro d'aggrement</label>
                      <input
                        type="text"
                        name="numero d'aggrement"
                        className={styles.formInput}
                        onChange={handleChange}
                        value={form.num_agrement}
                        placeholder="Numéro d'enregistrement"
                        disabled
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Etat D'aggrement*</label>
                      <input
                        type="text"
                        name="etat d'aggrement"
                        className={styles.formInput}
                        onChange={handleChange}
                        value={form.etat_agrement}
                        placeholder="Organisme d'affiliation"
                        required
                        disabled
                      />
                    </div>
                  </div>
                </section>
              </div>

              <div className={styles.actionButtons}>
                <button
                  onClick={handleBack}
                  className={styles.btnPrevious}
                  disabled={isLoading}
                >
                  <FiChevronLeft className={styles.btnIcon} />
                  Précédent
                </button>
                
                <button
                  className={styles.btnSave}
                  onClick={handleSaveEtape}
                  disabled={savingEtape || statutProc === 'TERMINEE' || !statutProc}
                >
                  <BsSave className={styles.btnIcon} /> {savingEtape ? "Sauvegarde en cours..." : "Sauvegarder l'étape"}
                </button>
                <button
                  onClick={handleNext}
                  className={styles.btnNext}
                  disabled={isLoading}
                >
                  Suivant
                  <FiChevronRight className={styles.btnIcon} />
                </button>
              </div>
              <div className={styles.etapeSaveSection}>
                {etapeMessage && (
                  <div className={styles.etapeMessage}>
                    {etapeMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
