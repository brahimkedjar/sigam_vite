// src/pages/Demande/Step8/Page8.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './cd_step.module.css';
import { useSearchParams } from '@/src/hooks/useSearchParams';
import router from 'next/router';
import { FiChevronLeft, FiChevronRight, FiSave } from 'react-icons/fi';
import { STEP_LABELS } from '@/src/constants/steps';
import Navbar from '@/pages/navbar/Navbar';
import Sidebar from '@/pages/sidebar/Sidebar';
import { ViewType } from '@/src/types/viewtype';
import ProgressStepper from '@/components/ProgressStepper';
import { useViewNavigator } from '@/src/hooks/useViewNavigator';
import { useActivateEtape } from '@/src/hooks/useActivateEtape';
import { Phase, Procedure, ProcedureEtape, ProcedurePhase, StatutProcedure } from '@/src/types/procedure';
interface Procedure1 {
  id_proc: number;
  num_proc: string;
  id_seance?: number;
  demandes: Array<{
    typeProcedure: { // ðŸ”‘ Moved typeProcedure to demande level
      libelle: string;
    };
    detenteur: {
      nom_societeFR: string;
    };
  }>;
}
interface Seance {
  id_seance: number;
  num_seance: string;
  date_seance: string;
  exercice: number;
  remarques?: string;
  membres: Array<{
    id_membre: number;
    nom_membre: string;
    prenom_membre: string;
    fonction_membre: string;
    email_membre: string;
    signature_type: 'electronique' | 'manuelle';
  }>;
  procedures?: Array<{
    id_proc: number;
    num_proc: string;
  }>;
  comites: Array<Comite>;
}

interface Comite {
  id_comite: number;
  date_comite: string;
  objet_deliberation: string;
  resume_reunion: string;
  fiche_technique?: string;
  carte_projettee?: string;
  rapport_police?: string;
  decisionCDs: Array<Decision>;
}

interface Decision {
  numero_decision: string;
  id_decision: number;
  decision_cd: 'favorable' | 'defavorable';
  duree_decision?: number;
  commentaires?: string;
}

interface MemberOption {
  id_membre: number;
  nom_membre: string;
  prenom_membre: string;
  fonction_membre: string;
  email_membre?: string;
}

type AlertState = {
  type: 'success' | 'error';
  message: string;
};

const Page8: React.FC = () => {
  const searchParams = useSearchParams();
  const idProcStr = searchParams?.get('id');
  const idProc = idProcStr ? parseInt(idProcStr, 10) : undefined;

  const [procedure, setProcedure] = useState<Procedure1 | null>(null);
  const [seance, setSeance] = useState<Seance | null>(null);
  const [comite, setComite] = useState<Comite | null>(null);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const { currentView, navigateTo } = useViewNavigator("nouvelle-demande");
  const [detenteur, setDetenteur] = useState<string | ''>('');
  const [savingEtape, setSavingEtape] = useState(false);
  const [etapeMessage, setEtapeMessage] = useState<string | null>(null);
  const [statutProc, setStatutProc] = useState<string | undefined>(undefined);
  const [procedureData, setProcedureData] = useState<Procedure | null>(null);
  const [currentEtape, setCurrentEtape] = useState<{ id_etape: number } | null>(null);
  const [procedureTypeId, setProcedureTypeId] = useState<number | undefined>();
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [hasActivatedStep7, setHasActivatedStep7] = useState(false); // Add flag for step 2
  const [currentStep] = useState(7);
  const [activatedSteps, setActivatedSteps] = useState<Set<number>>(new Set());
  const [isPageReady, setIsPageReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Chargement des parametres...');
  const [availableMembers, setAvailableMembers] = useState<MemberOption[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState<string | null>(null);
  const [seanceAlert, setSeanceAlert] = useState<AlertState | null>(null);
  const [decisionAlert, setDecisionAlert] = useState<AlertState | null>(null);
  const [isSavingSeance, setIsSavingSeance] = useState(false);
  const [isSavingDecision, setIsSavingDecision] = useState(false);
  const [seanceForm, setSeanceForm] = useState({
    num: '',
    date: '',
    exercice: new Date().getFullYear(),
    remarques: '',
    selectedMembers: [] as number[],
  });
  const [decisionForm, setDecisionForm] = useState({
    date_comite: '',
    numero_decision: '',
    avis: '' as '' | 'favorable' | 'defavorable',
    duree: '',
    commentaires: '',
  });

  const buildDecisionNumber = () => {
    const now = new Date();
    const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    return `DEC-${stamp}-${idProc ?? 'PROC'}`;
  };


  useEffect(() => {
  const checkInterval = setInterval(() => {
    if (idProc && procedureData ) {
      setIsPageReady(true);
      setIsLoading(false);
      clearInterval(checkInterval);
    } else {
      if (!idProc) {
        setLoadingMessage("En attente de l'ID de procédure...");
      } else if (!procedureData) {
        setLoadingMessage('Chargement des données de procédure...');
    }
  }
  }, 1); // Check every millisecond

  return () => clearInterval(checkInterval);
}, [idProc, procedureData]);

const fetchProcedureData = async () => {
  if (!idProc) return;

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
  } catch (error) {
    console.error('Error fetching procedure data:', error);
  }
};

useEffect(() => {
  fetchProcedureData();
}, [idProc, refetchTrigger]);

  useActivateEtape({
    idProc,
    etapeNum: 7,
    shouldActivate: currentStep === 7 && !activatedSteps.has(7) && isPageReady,
    onActivationSuccess: (stepStatus: string) => {
      if (stepStatus === 'TERMINEE') {
        setActivatedSteps(prev => new Set(prev).add(7));
        setHasActivatedStep7(true);
        return;
      }

      setActivatedSteps(prev => new Set(prev).add(7));
      if (procedureData) {
        const updatedData = { ...procedureData };
        
        if (updatedData.ProcedureEtape) {
          const stepToUpdate = updatedData.ProcedureEtape.find(pe => pe.id_etape === 7);
          if (stepToUpdate && stepStatus === 'EN_ATTENTE') {
            stepToUpdate.statut = 'EN_COURS' as StatutProcedure;
          }
          setCurrentEtape({ id_etape: 7 });
        }
        
        if (updatedData.ProcedurePhase) {
          const phaseContainingStep7 = updatedData.ProcedurePhase.find(pp => 
            pp.phase?.etapes?.some(etape => etape.id_etape === 7)
          );
          if (phaseContainingStep7 && stepStatus === 'EN_ATTENTE') {
            phaseContainingStep7.statut = 'EN_COURS' as StatutProcedure;
          }
        }
        
        setProcedureData(updatedData);
        setHasActivatedStep7(true);
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
  
const toLocalDateTimeValue = (value?: string | null) => {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const toISODateTime = (value: string) => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString();
};

  useEffect(() => {
    if (!apiURL) {
      return;
    }

    const fetchMembers = async () => {
      setMembersLoading(true);
      setMembersError(null);
      try {
        const response = await axios.get<MemberOption[]>(`${apiURL}/api/seances/membres-comite`);
        setAvailableMembers(response.data);
      } catch (err) {
        console.error('Erreur lors du chargement des membres du comité:', err);
        setMembersError('Impossible de charger les membres du comité');
      } finally {
        setMembersLoading(false);
      }
    };

    fetchMembers();
  }, [apiURL]);

  useEffect(() => {
    if (!seance) {
      return;
    }
    setSeanceForm({
      num: seance.num_seance,
      date: toLocalDateTimeValue(seance.date_seance),
      exercice: seance.exercice,
      remarques: seance.remarques || '',
      selectedMembers: seance.membres.map((membre) => membre.id_membre),
    });
  }, [seance]);

  useEffect(() => {
    if (decision && comite) {
      setDecisionForm({
        date_comite: toLocalDateTimeValue(comite.date_comite),
        numero_decision: decision.numero_decision,
        avis: decision.decision_cd,
        duree: decision.duree_decision ? decision.duree_decision.toString() : '',
        commentaires: decision.commentaires || '',
      });
      return;
    }

    setDecisionForm((prev) => {
      const nextDate = prev.date_comite || (seance ? toLocalDateTimeValue(seance.date_seance) : '');
      const nextNumero = prev.numero_decision || buildDecisionNumber();
      if (nextDate === prev.date_comite && nextNumero === prev.numero_decision) {
        return prev;
      }
      return {
        ...prev,
        date_comite: nextDate,
        numero_decision: nextNumero,
      };
    });
  }, [decision, comite, seance]);




  useEffect(() => {
    if (idProc) {
      fetchData();
    } else {
      setError('ID de procédure manquant');
      setLoading(false);
    }
  }, [idProc]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [procRes,detenteur, seancesBasicRes, seancesWithDecRes] = await Promise.all([
        axios.get(`${apiURL}/api/procedures/${idProc}`),
        axios.get(`${apiURL}/api/procedures/${idProc}/demande`),
        axios.get(`${apiURL}/api/seances`),
        axios.get(`${apiURL}/api/seances/with-decisions`),
      ]);
console.log('Procedure fetched:', detenteur?.data);

      setProcedure(procRes.data);
      setDetenteur(detenteur.data.detenteur?.nom_societeFR || '');
      setStatutProc(detenteur.data.procedure.statut_proc);
      const idSeance = procRes.data.id_seance;
      if (!idSeance) {
        setSeance(null);
        setComite(null);
        setDecision(null);
        setLoading(false);
        return;
      }

      const foundSeanceBasic = seancesBasicRes.data.find((s: Seance) => s.id_seance === idSeance);
      const foundSeanceWithDec = seancesWithDecRes.data.data.find((s: Seance) => s.id_seance === idSeance);

      if (!foundSeanceBasic || !foundSeanceWithDec) {
        setSeance(null);
        setComite(null);
        setDecision(null);
        setLoading(false);
        return;
      }

      const fullSeance = {
        ...foundSeanceBasic,
        comites: foundSeanceWithDec.comites,
      };
      setSeance(fullSeance);

      const foundComite = foundSeanceWithDec.comites.find((c: Comite) =>
  c.decisionCDs[0]?.numero_decision?.endsWith(`-${idProc}`)
);

      if (foundComite) {
        setComite(foundComite);
        if (foundComite.decisionCDs && foundComite.decisionCDs.length > 0) {
          setDecision(foundComite.decisionCDs[0]);
        } else {
          setDecision(null);
        }
      } else {
        setComite(null);
        setDecision(null);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des données:', err);
      setError('Erreur lors de la récupération des données');
    } finally {
      setLoading(false);
    }
  };

  const handleMemberToggle = (memberId: number) => {
    setSeanceForm((prev) => {
      const exists = prev.selectedMembers.includes(memberId);
      return {
        ...prev,
        selectedMembers: exists
          ? prev.selectedMembers.filter((id) => id !== memberId)
          : [...prev.selectedMembers, memberId],
      };
    });
  };

  const handleSeanceSubmit = async (): Promise<boolean> => {
    if (!apiURL || !idProc) {
      setSeanceAlert({ type: 'error', message: 'Procédure introuvable pour cette séance.' });
      return false;
    }
    if (!seanceForm.num.trim()) {
      setSeanceAlert({ type: 'error', message: 'Renseignez le numéro de séance.' });
      return false;
    }
    if (!seanceForm.date) {
      setSeanceAlert({ type: 'error', message: 'Veuillez renseigner la date et l\'heure de la séance.' });
      return false;
    }
    if (seanceForm.selectedMembers.length === 0) {
      setSeanceAlert({ type: 'error', message: 'Sélectionnez au moins un membre du comité présent.' });
      return false;
    }

    const isoDate = toISODateTime(seanceForm.date);
    if (!isoDate) {
      setSeanceAlert({ type: 'error', message: 'Format de date invalide.' });
      return false;
    }

    const existingProcedureIds = seance?.procedures?.map((proc) => proc.id_proc).filter(Boolean) || [];
    const uniqueProcedureIds = seance
      ? Array.from(new Set([...existingProcedureIds, idProc]))
      : [idProc];

    const basePayload = {
      num_seance: seanceForm.num.trim(),
      date_seance: isoDate,
      exercice: Number(seanceForm.exercice) || new Date().getFullYear(),
      membresIds: seanceForm.selectedMembers,
      proceduresIds: uniqueProcedureIds,
      statut: 'terminee' as const,
      remarques: seanceForm.remarques || undefined,
    };

    setIsSavingSeance(true);
    setSeanceAlert(null);

    let success = false;
    try {
      const response = seance
        ? await axios.put(`${apiURL}/api/seances/${seance.id_seance}`, basePayload)
        : await axios.post(`${apiURL}/api/seances`, basePayload);

      setSeance(response.data);
      await fetchData();
      setSeanceAlert({
        type: 'success',
        message: seance ? 'Séance mise à jour avec succès.' : 'Séance enregistrée avec succès.',
      });
      success = true;
    } catch (err) {
      console.error("Erreur lors de l'enregistrement de la séance:", err);
      setSeanceAlert({ type: 'error', message: "Impossible d'enregistrer la séance." });
    } finally {
      setIsSavingSeance(false);
    }

    return success;
  };
  const handleDecisionSubmit = async (): Promise<boolean> => {
    if (!apiURL || !idProc) {
      setDecisionAlert({ type: 'error', message: 'Procédure introuvable pour cette décision.' });
      return false;
    }
    if (!seance) {
      setDecisionAlert({ type: 'error', message: 'Aucune séance associée à cette procédure.' });
      return false;
    }
    if (!decisionForm.avis) {
      setDecisionAlert({ type: 'error', message: 'Choisissez un avis favorable ou défavorable.' });
      return false;
    }

    const isoDate = toISODateTime(decisionForm.date_comite || seanceForm.date || '');
    if (!isoDate) {
      setDecisionAlert({ type: 'error', message: 'Format de date du comité invalide.' });
      return false;
    }

    setIsSavingDecision(true);
    setDecisionAlert(null);

    let success = false;
    try {
      let comiteId = comite?.id_comite;
      let decisionId = decision?.id_decision;

      if (!comiteId) {
        try {
          const existing = await axios.post(`${apiURL}/api/comites/by-procedure`, {
            seanceId: seance.id_seance,
            procedureId: idProc,
          });
          if (existing.data?.id_comite) {
            comiteId = existing.data.id_comite;
            decisionId = existing.data.decisionCDs?.[0]?.id_decision ?? null;
          }
        } catch (err) {
          console.warn('Aucun comité existant pour cette procédure:', err);
        }
      }

      const comitePayload = {
        id_seance: seance.id_seance,
        id_proc: idProc,
        date_comite: isoDate,
        numero_decision: decisionForm.numero_decision || buildDecisionNumber(),
        objet_deliberation: comite?.objet_deliberation || `Décision pour ${procedure?.num_proc || idProc}`,
        resume_reunion: comite?.resume_reunion || '',
      };

      if (comiteId) {
        await axios.put(`${apiURL}/api/comites/${comiteId}`, {
          date_comite: comitePayload.date_comite,
          numero_decision: comitePayload.numero_decision,
          objet_deliberation: comitePayload.objet_deliberation,
          resume_reunion: comitePayload.resume_reunion,
        });
      } else {
        const createdComite = await axios.post(`${apiURL}/api/comites`, comitePayload);
        comiteId = createdComite.data.id_comite;
        decisionId = createdComite.data.decisionCDs?.[0]?.id_decision ?? null;
      }

      if (!comiteId) {
        throw new Error('Comité introuvable après création.');
      }

      const decisionPayload = {
        id_comite: comiteId,
        decision_cd: decisionForm.avis as 'favorable' | 'defavorable',
        numero_decision: decisionForm.numero_decision || buildDecisionNumber(),
        duree_decision: decisionForm.duree ? parseInt(decisionForm.duree, 10) : undefined,
        commentaires: decisionForm.commentaires || undefined,
      };

      if (decisionId) {
        await axios.put(`${apiURL}/api/decisions/${decisionId}`, decisionPayload);
      } else {
        await axios.post(`${apiURL}/api/decisions`, decisionPayload);
      }

      setDecisionAlert({ type: 'success', message: 'Décision enregistrée avec succès.' });
      await fetchData();
      success = true;
    } catch (err) {
      console.error("Erreur lors de l'enregistrement de la décision:", err);
      setDecisionAlert({ type: 'error', message: "Impossible d'enregistrer la décision." });
    } finally {
      setIsSavingDecision(false);
    }

    return success;
  };

  const handleSaveAll = async () => {
    const seanceSaved = await handleSeanceSubmit();
    if (!seanceSaved) {
      return;
    }
    await handleDecisionSubmit();
  };

  const handleSaveEtape = async () => {
  if (!idProc) {
    setEtapeMessage("ID procedure introuvable !");
    return;
  }

  setSavingEtape(true);
  setEtapeMessage(null);

  try {
    await axios.post(`${apiURL}/api/procedure-etape/finish/${idProc}/7`);
    setEtapeMessage("étape 7 enregistrée avec succés !");
  } catch (err) {
    console.error(err);
    setEtapeMessage("Erreur lors de l'enregistrement de l'étape.");
  } finally {
    setSavingEtape(false);
  }
};

  const handleNext = () => {
    router.push(`/demande/step8/page8?id=${idProc}`)
  };

  const handlePrevious = () => {
    router.push(`/demande/step6/page6?id=${idProc}`)
  };

  if (loading) {
    return (
      <div className={styles.appContainer}>
        <Navbar />
        <div className={styles.appContent}>
          <Sidebar currentView={currentView} navigateTo={navigateTo} />
          <main className={styles.mainContent}>
                                <div className={styles.contentWrapper}>

             {procedureData && (
  <ProgressStepper
    phases={phases}
    currentProcedureId={idProc}
    currentEtapeId={currentEtape?.id_etape}
    procedurePhases={procedureData.ProcedurePhase || []}
    procedureTypeId={procedureTypeId}
  />
)}
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Chargement des données...</p>
            </div>
            </div>
          </main>
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
        <div className={styles.breadcrumb}>
          <span>SIGAM</span>
          <FiChevronRight className={styles.breadcrumbArrow} />
          <span>Capacitiés</span>
        </div>
                    <div className={styles.contentWrapper}>
           {procedureData && (
  <ProgressStepper
    phases={phases}
    currentProcedureId={idProc}
    currentEtapeId={currentEtape?.id_etape}
    procedurePhases={procedureData.ProcedurePhase || []}
    procedureTypeId={procedureTypeId}
  />
)}

           <h1 className={styles.mainTitle}>
              <span className={styles.stepNumber}>8</span>
              Décision du Comité de Direction
            </h1>
            {error && (
              <div className={`${styles.alert} ${styles['alert-error']}`}>
                <span className={styles.alertIcon}>!</span>
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className={styles.contentContainer}>
            <div className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <h2>Résultat de la séance</h2>
                <span className={styles.seanceBadge}>
                  {seance?.num_seance ? `Séance ${seance.num_seance}` : 'Nouvelle séance'}
                </span>
              </div>
              <div className={styles.cardContent}>
                {!seance && (
                  <div className={`${styles.alert} ${styles['alert-error']}`}>
                    <span className={styles.alertIcon}>!</span>
                    <span>Cette procédure n'a pas encore de séance enregistrée. Saisissez les informations ci-dessous pour créer l'enregistrement officiel.</span>
                  </div>
                )}
                {seanceAlert && (
                  <div className={`${styles.alert} ${seanceAlert.type === 'success' ? styles['alert-success'] : styles['alert-error']}`}>
                    <span className={styles.alertIcon}>{seanceAlert.type === 'success' ? '+' : '!'}</span>
                    <span>{seanceAlert.message}</span>
                  </div>
                )}
                <div className={styles.formGroup}>
                  <label>Numéro de séance *</label>
                  <input
                    type="text"
                    value={seanceForm.num}
                    onChange={(e) => setSeanceForm((prev) => ({ ...prev, num: e.target.value }))}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Date de la séance *</label>
                  <input
                    type="datetime-local"
                    value={seanceForm.date}
                    onChange={(e) => setSeanceForm((prev) => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Exercice</label>
                    <input
                      type="number"
                      min="1900"
                      value={seanceForm.exercice}
                      onChange={(e) => setSeanceForm((prev) => ({ ...prev, exercice: Number(e.target.value) }))}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Remarques</label>
                    <textarea
                      rows={3}
                      value={seanceForm.remarques}
                      onChange={(e) => setSeanceForm((prev) => ({ ...prev, remarques: e.target.value }))}
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Membres présents *</label>
                  {membersLoading ? (
                    <p className={styles.formHint}>Chargement des membres...</p>
                  ) : membersError ? (
                    <div className={`${styles.alert} ${styles['alert-error']}`}>
                      <span className={styles.alertIcon}>!</span>
                      <span>{membersError}</span>
                    </div>
                  ) : (
                    <div className={styles.memberSelectGrid}>
                      {availableMembers.map((member) => {
                        const isSelected = seanceForm.selectedMembers.includes(member.id_membre);
                        return (
                          <button
                            type="button"
                            key={member.id_membre}
                            className={`${styles.memberSelectCard} ${isSelected ? styles.memberSelectCardSelected : ''}`}
                            onClick={() => handleMemberToggle(member.id_membre)}
                          >
                            <div className={styles.memberSelectName}>
                              {member.prenom_membre} {member.nom_membre}
                            </div>
                            <div className={styles.memberSelectRole}>{member.fonction_membre}</div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={`${styles.button} ${styles.primaryButton}`}
                    onClick={handleSeanceSubmit}
                    disabled={isSavingSeance}
                  >
                    {isSavingSeance ? 'Enregistrement...' : seance ? 'Mettre à jour la séance' : 'Créer la séance'}
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <h2>Avis du comité</h2>
              </div>
              <div className={styles.cardContent}>
                {decisionAlert && (
                  <div className={`${styles.alert} ${decisionAlert.type === 'success' ? styles['alert-success'] : styles['alert-error']}`}>
                    <span className={styles.alertIcon}>{decisionAlert.type === 'success' ? '+' : '!'}</span>
                    <span>{decisionAlert.message}</span>
                  </div>
                )}
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Date du comité</label>
                    <input
                      type="datetime-local"
                      value={decisionForm.date_comite}
                      onChange={(e) => setDecisionForm((prev) => ({ ...prev, date_comite: e.target.value }))}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Numéro de décision</label>
                    <input
                      type="text"
                      value={decisionForm.numero_decision}
                      onChange={(e) => setDecisionForm((prev) => ({ ...prev, numero_decision: e.target.value }))}
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Avis *</label>
                  <div className={styles.decisionToggle}>
                    <button
                      type="button"
                      className={`${styles.toggleOption} ${decisionForm.avis === 'favorable' ? styles.toggleOptionActive : ''}`}
                      onClick={() => setDecisionForm((prev) => ({ ...prev, avis: 'favorable' }))}
                    >
                      Avis favorable
                    </button>
                    <button
                      type="button"
                      className={`${styles.toggleOption} ${decisionForm.avis === 'defavorable' ? styles.toggleOptionActive : ''}`}
                      onClick={() => setDecisionForm((prev) => ({ ...prev, avis: 'defavorable' }))}
                    >
                      Avis défavorable
                    </button>
                  </div>
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Durée (mois)</label>
                    <input
                      type="number"
                      min="1"
                      value={decisionForm.duree}
                      onChange={(e) => setDecisionForm((prev) => ({ ...prev, duree: e.target.value }))}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Commentaires</label>
                    <textarea
                      rows={3}
                      value={decisionForm.commentaires}
                      onChange={(e) => setDecisionForm((prev) => ({ ...prev, commentaires: e.target.value }))}
                    />
                  </div>
                </div>
                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={`${styles.button} ${styles.primaryButton}`}
                    onClick={handleDecisionSubmit}
                    disabled={isSavingDecision || !seance}
                  >
                    {isSavingDecision ? 'Enregistrement...' : "Enregistrer l'avis du comité"}
                  </button>
                  {!seance && (
                    <p className={styles.formHint}>Associez la procédure à une séance avant de saisir l'avis.</p>
                  )}
                </div>
              </div>
            </div>
            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <button 
                onClick={handlePrevious}
                className={`${styles.button} ${styles.secondaryButton}`}
              >
                <FiChevronLeft className={styles.buttonIcon} />
                Précédent
              </button>

              <button
                onClick={handleSaveAll}
                className={`${styles.button} ${styles.primaryButton}`}
                disabled={isSavingSeance || isSavingDecision}
              >
                {isSavingSeance || isSavingDecision ? 'Enregistrement...' : 'Enregistrer la séance et l\'avis'}
              </button>
              
              <button
                onClick={handleSaveEtape}
                className={`${styles.button} ${styles.saveButton}`}
                disabled={saving}
              >
                <FiSave className={styles.buttonIcon} />
                {saving ? 'Enregistrement...' : 'Sauvegarder'}
              </button>
              
              <button 
                onClick={handleNext}
                className={`${styles.button} ${styles.primaryButton}`}
              >
                Suivant
                <FiChevronRight className={styles.buttonIcon} />
              </button>
            </div>
            <div className={styles['etapeSaveSection']}>
                {etapeMessage && (
                  <div className={styles['etapeMessage']}>
                    {etapeMessage}
                  </div>
                )}
              </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page8;



