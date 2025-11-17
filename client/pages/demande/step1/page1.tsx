"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSearchParams } from "@/src/hooks/useSearchParams";
import {
  FiUpload,
  FiCheck,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiAlertCircle,
  FiCheckCircle,
  FiAlertTriangle
} from "react-icons/fi";
import styles from "./documents.module.css";
import Navbar from "../../navbar/Navbar";
import Sidebar from "../../sidebar/Sidebar";
import { CgFileDocument } from "react-icons/cg";
import { BsSave } from "react-icons/bs";
import { useAuthStore } from "../../../src/store/useAuthStore";
import ProgressStepper from "../../../components/ProgressStepper";
import { STEP_LABELS } from "../../../src/constants/steps";
import { useViewNavigator } from "../../../src/hooks/useViewNavigator";
import router from 'next/router';
import { toast } from "react-toastify";
import { useLoading } from '@/components/globalspinner/LoadingContext';
import { Phase, Procedure, ProcedureEtape, ProcedurePhase, StatutProcedure } from "@/src/types/procedure";
import { useActivateEtape } from "@/src/hooks/useActivateEtape";

type Document = {
  id_doc: number;
  nom_doc: string;
  description: string;
  format: string;
  taille_doc: string;
  statut?: string;
  file_url?: string;
  is_required?: boolean;
  missing_action?: string;
  reject_message?: string;
};

type DossierFournis = {
  id_dossierFournis: number;
  statut_dossier: string;
  remarques?: string;
  date_depot: string;
};

type MissingSummary = {
  requiredMissing: Array<{
    id_doc: number;
    nom_doc: string;
    missing_action?: string;
    reject_message?: string;
  }>;
  blocking: Array<{
    id_doc: number;
    nom_doc: string;
    reject_message?: string;
  }>;
  blockingNext: Array<{
    id_doc: number;
    nom_doc: string;
  }>;
  warnings: Array<{
    id_doc: number;
    nom_doc: string;
  }>;
};

type DocStatus = "present" | "manquant" | "attente";
type DocumentWithStatus = Document & { statut: DocStatus };

type DemandeMeta = {
  id_demande: number;
  date_demande: string | null;
  date_instruction: string | null;
  date_refus: string | null;
  statut_demande: string | null;
  dossier_recevable: boolean | null;
  dossier_complet: boolean | null;
  duree_instruction: number | null;
};

export default function Step5_Documents() {
  const { resetLoading } = useLoading();
  const searchParams = useSearchParams();
  const [loadingState, setLoadingState] = useState<string>("Initializing...");
  const [idDemande, setIdDemande] = useState<string | null>(null);
  const [codeDemande, setCodeDemande] = useState<string | null>(null);
  const [documents, setDocuments] = useState<DocumentWithStatus[]>([]);
  const [statusMap, setStatusMap] = useState<Record<number, DocStatus>>({});
  const [fileUrls, setFileUrls] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [savingEtape, setSavingEtape] = useState(false);
  const [etapeMessage, setEtapeMessage] = useState<string | null>(null);
  const [currentDossier, setCurrentDossier] = useState<DossierFournis | null>(null);
  const [remarques, setRemarques] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const { auth, isLoaded, hasPermission } = useAuthStore();
  const [showCahierForm, setShowCahierForm] = useState(false);
  const [selectedCahierDoc, setSelectedCahierDoc] = useState<DocumentWithStatus | null>(null);
  const { currentView, navigateTo } = useViewNavigator("nouvelle-demande");
  const [currentStep, setCurrentStep] = useState(1);
  const [activatedSteps, setActivatedSteps] = useState<Set<number>>(new Set());
  const [statutProc, setStatutProc] = useState<string | undefined>(undefined);
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const [showCheckAllModal, setShowCheckAllModal] = useState(false);
  const [procedureData, setProcedureData] = useState<Procedure | null>(null);
  const [currentEtape, setCurrentEtape] = useState<{ id_etape: number } | null>(null);
  const [procedureTypeId, setProcedureTypeId] = useState<number | undefined>();
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [hasActivatedStep1, setHasActivatedStep1] = useState(false); 
  const [idProc, setIdProc] = useState<number | undefined>(undefined);
  const [isPageReady, setIsPageReady] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [missingSummary, setMissingSummary] = useState<MissingSummary | undefined>(undefined);
  const [deadlines, setDeadlines] = useState<{ miseEnDemeure: string | null; instruction: string | null } | null>(null);
  const [demandeMeta, setDemandeMeta] = useState<DemandeMeta | null>(null);
  const [letterPreview, setLetterPreview] = useState<{ type: string; content: string; deadline?: string | null; numero_recepisse?: string | null } | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Clear any stuck global spinner when landing here
  useEffect(() => {
    try { resetLoading(); } catch {}
  }, [resetLoading]);

  // Vérifier si des documents obligatoires manquent et bloquent la navigation
  const hasBlockingMissingDocs = missingSummary && missingSummary.blocking.length > 0;
  const hasBlockingNextMissingDocs = missingSummary && missingSummary.blockingNext.length > 0;

  const computeBusinessDeadlineInfo = () => {
    if (!demandeMeta?.duree_instruction) {
      return null;
    }

    const total = demandeMeta.duree_instruction;

    // Point de départ = début de procédure, sinon date_demande.
    const startRaw = (procedureData as any)?.date_debut_proc || demandeMeta.date_demande;
    if (!startRaw) return null;
    const start = new Date(startRaw);
    start.setHours(0, 0, 0, 0);

    const addBusinessDays = (base: Date, businessDays: number) => {
      const result = new Date(base);
      let added = 0;
      while (added < businessDays) {
        result.setDate(result.getDate() + 1);
        const day = result.getDay();
        if (day !== 0 && day !== 6) {
          added += 1;
        }
      }
      return result;
    };

    const countBusinessDaysBetween = (from: Date, to: Date) => {
      const d1 = new Date(from);
      const d2 = new Date(to);
      d1.setHours(0, 0, 0, 0);
      d2.setHours(0, 0, 0, 0);
      if (d2 < d1) return 0;

      let days = 0;
      const cursor = new Date(d1);
      while (cursor <= d2) {
        const day = cursor.getDay();
        if (day !== 0 && day !== 6) {
          days += 1;
        }
        cursor.setDate(cursor.getDate() + 1);
      }
      return days;
    };

    const deadline = addBusinessDays(start, total);

    // Si dossier recevable => timer arrêté à date_instruction.
    if (demandeMeta.dossier_recevable && demandeMeta.date_instruction) {
      const closure = new Date(demandeMeta.date_instruction);
      const used = countBusinessDaysBetween(start, closure);
      const remaining = Math.max(total - used, 0);
      return {
        mode: 'recevable' as const,
        used,
        remaining,
        total,
        deadline,
        closure,
      };
    }

    // Si demande rejetée => timer arrêté à date_refus.
    if (demandeMeta.statut_demande === 'REJETEE' && demandeMeta.date_refus) {
      const closure = new Date(demandeMeta.date_refus);
      const used = countBusinessDaysBetween(start, closure);
      const remaining = Math.max(total - used, 0);
      return {
        mode: 'rejetee' as const,
        used,
        remaining,
        total,
        deadline,
        closure,
      };
    }

    // Dossier encore en cours d'instruction : on affiche le temps restant dynamique.
    const now = new Date();
    const nowFloor = new Date(now);
    nowFloor.setHours(0, 0, 0, 0);

    if (nowFloor >= deadline) {
      return {
        mode: 'ongoing' as const,
        used: total,
        remaining: 0,
        total,
        deadline,
        closure: null,
      };
    }

    const remaining = countBusinessDaysBetween(nowFloor, deadline);
    const used = Math.max(total - remaining, 0);

    return {
      mode: 'ongoing' as const,
      used,
      remaining,
      total,
      deadline,
      closure: null,
    };
  };

    // Persist the deadline into localStorage payload for cross-step alerts
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!idProc || !missingSummary) return;
    try {
      const key = 'sigam_missing_required_docs';
      const raw = window.localStorage.getItem(key);
      let store: Record<string, any> = {};
      if (raw) {
        try { store = JSON.parse(raw) || {}; } catch { store = {}; }
      }
      const existing = store[idProc] || {};
        store[idProc] = {
          ...existing,
          missing: missingSummary.requiredMissing.map(d => d.nom_doc),
          procedureId: idProc,
          demandeId: idDemande,
          phase: 'FIRST',
          // Keep allowed prefixes if already computed elsewhere
          allowedPrefixes: existing.allowedPrefixes || undefined,
          // Utilise le délai d'instruction (10 jours ouvrables) si disponible,
          // sinon garde le comportement précédent basé sur la mise en demeure.
          deadline: deadlines?.instruction || deadlines?.miseEnDemeure || null,
          updatedAt: new Date().toISOString(),
        };
      window.localStorage.setItem(key, JSON.stringify(store));
      window.dispatchEvent(new CustomEvent('sigam:missing-docs', { detail: store[idProc] }));
    } catch {}
  }, [idProc, idDemande, missingSummary, deadlines]);

  // Stocker les documents manquants dans le localStorage pour le ProgressStepper et ClientLayout
  useEffect(() => {
  if (missingSummary && idProc) {
    // Construire dynamiquement les prxes autoriss pour toutes les tapes de la premire phase
    const firstPhase = (procedureData?.ProcedurePhase || [])
      .map((pp: ProcedurePhase) => pp.phase)
      .sort((a: Phase, b: Phase) => a.ordre - b.ordre)[0];

    const allowedPrefixes = firstPhase?.etapes?.map(e => `/demande/step${e.id_etape}`) || ['/demande/step1'];

    const missingDocsPayload = {
      missing: missingSummary.requiredMissing.map(doc => doc.nom_doc),
      procedureId: idProc,
      demandeId: idDemande,
      phase: 'FIRST',
      allowedPrefixes,
      updatedAt: new Date().toISOString()
    };

    // Stocker dans localStorage
    if (typeof window !== 'undefined') {
      const existing = window.localStorage.getItem('sigam_missing_required_docs');
      
      // Déclarer le type correctement
      let procedures: Record<number, any> = {};
      
      if (existing) {
        try {
          const parsed = JSON.parse(existing);
          // S'assurer que c'est un objet avec des clés numériques
          if (parsed && typeof parsed === 'object') {
            procedures = parsed;
          }
        } catch (e) {
          console.warn('Erreur de parsing du localStorage:', e);
          procedures = {};
        }
      }

      procedures[idProc] = missingDocsPayload;
      window.localStorage.setItem('sigam_missing_required_docs', JSON.stringify(procedures));
      
      // Déclencher un événement personnalisé pour notifier le ProgressStepper
      window.dispatchEvent(new CustomEvent('sigam:missing-docs', { 
        detail: missingDocsPayload 
      }));
    }
  }
}, [missingSummary, idProc, idDemande]);

  // Nettoyer le localStorage quand la procédure est terminée
  useEffect(() => {
    if (statutProc === 'TERMINEE' && idProc && typeof window !== 'undefined') {
      const existing = window.localStorage.getItem('sigam_missing_required_docs');
      if (existing) {
        try {
          const procedures = JSON.parse(existing);
          delete procedures[idProc];
          window.localStorage.setItem('sigam_missing_required_docs', JSON.stringify(procedures));
        } catch (e) {
          // Ignorer les erreurs de parsing
        }
      }
    }
  }, [statutProc, idProc]);

  // Check if all required data is available
  const checkRequiredData = useCallback(() => {
    if (!idProc) return false;
    if (!procedureData) return false;
    if (!idDemande) return false;
    if (documents.length === 0) return false;
    return true;
  }, [idProc, procedureData, idDemande, documents]);

  // Set up interval to check for required data
  useEffect(() => {
    if (checkRequiredData()) {
      setIsPageReady(true);
      setLoadingState(""); // Clear loading state when ready
    }
  }, [checkRequiredData]);

  // Get idProc from URL parameters
  useEffect(() => {
    const idProcStr = searchParams?.get('id');
    if (!idProcStr) {
      setLoadingState("ID de procédure non trouvé dans les paramétres");
      setError("ID de procédure non trouvé dans les paramétres");
      return;
    }

    const parsedId = parseInt(idProcStr, 10);
    if (isNaN(parsedId)) {
      setLoadingState("ID de procédure invalide");
      setError("ID de procédure invalide");
      return;
    }

    setIdProc(parsedId);
    setLoadingState("Chargement des données de la procédure...");
    setError(null); // Clear error once idProc is set
  }, [searchParams]);

  // Fetch procedure data when idProc is available
  useEffect(() => {
    if (!idProc) return;

    const fetchProcedureData = async () => {
      abortControllerRef.current = new AbortController();
      try {
        const response = await axios.get<Procedure>(`${apiURL}/api/procedure-etape/procedure/${idProc}`, {
          signal: abortControllerRef.current.signal,
        });
        setProcedureData(response.data);
        
        if (response.data.demandes && response.data.demandes.length > 0) {
          setProcedureTypeId(response.data.demandes[0].typeProcedure?.id);
        }

        const activeEtape = response.data.ProcedureEtape.find((pe: ProcedureEtape) => pe.statut === 'EN_COURS');
        if (activeEtape) {
          setCurrentEtape({ id_etape: activeEtape.id_etape });
        }
        
        setLoadingState("Données de procédure chargées, récupération de la demande...");
        setError(null);
      } catch (error) {
        if (axios.isCancel(error)) return;
        console.error('Error fetching procedure data:', error);
        setLoadingState("Erreur lors du chargement des données de procédure");
        setError("Erreur lors du chargement des données de procédure");
      }
    };

    fetchProcedureData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [idProc, apiURL, refetchTrigger]);

  // Fetch demande data when procedure data is available
  useEffect(() => {
    if (!idProc || !procedureData) return;

    const fetchDemandeData = async () => {
      abortControllerRef.current = new AbortController();
      try {
        const res = await axios.get(`${apiURL}/api/procedures/${idProc}/demande`, {
          signal: abortControllerRef.current.signal,
        });
        setIdDemande(res.data.id_demande.toString());
        setCodeDemande(res.data.code_demande);
        setStatutProc(res.data.procedure.statut_proc);
        setLoadingState("Données de demande chargées, récupération des documents...");
        setError(null);
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error("Erreur lors de la récupération de la demande", err);
        setLoadingState("Erreur lors de la récupération de la demande");
        setError("Erreur lors de la récupération de la demande");
      }
    };

    fetchDemandeData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [idProc, procedureData, apiURL]);

  // Fetch documents when idDemande is available
  useEffect(() => {
    if (!idDemande) return;

    const fetchDocuments = async () => {
      setIsLoading(true);
      abortControllerRef.current = new AbortController();
      try {
          const res = await axios.get(`${apiURL}/api/procedure/${idDemande}/documents`, {
            signal: abortControllerRef.current.signal,
          });
        setDocuments(res.data.documents);
        setMissingSummary(res.data.missingSummary);
          setDeadlines(res.data.deadlines);
          if (res.data.demande) {
            setDemandeMeta(res.data.demande);
          }

        const initialStatus: Record<number, DocStatus> = {};
        const initialFileUrls: Record<number, string> = {};

        res.data.documents.forEach((doc: DocumentWithStatus) => {
          initialStatus[doc.id_doc!] = doc.statut! || 'attente';
          if (doc.file_url!) {
            initialFileUrls[doc.id_doc!] = doc!.file_url!;
          }
        });

        setStatusMap(initialStatus);
        setFileUrls(initialFileUrls);

        if (res.data.dossierFournis) {
          setCurrentDossier(res.data.dossierFournis);
          setRemarques(res.data.dossierFournis.remarques || "");
        }
        
        setLoadingState(""); // Clear loading state
        setError(null);
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error("Erreur lors du chargement des documents", err);
        setLoadingState("Erreur lors du chargement des documents");
        setError("Erreur lors du chargement des documents");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [idDemande, apiURL, refetchTrigger]);

  useActivateEtape({
    idProc,
    etapeNum: 1,
    shouldActivate: currentStep === 1 && !activatedSteps.has(1) && isPageReady,
    onActivationSuccess: (stepStatus: string) => {
      if (stepStatus === 'TERMINEE') {
        setActivatedSteps(prev => new Set(prev).add(1));
        setHasActivatedStep1(true);
        return;
      }

      setActivatedSteps(prev => new Set(prev).add(1));
      if (procedureData) {
        const updatedData = { ...procedureData };
        
        if (updatedData.ProcedureEtape) {
          const stepToUpdate = updatedData.ProcedureEtape.find(pe => pe.id_etape === 1);
          if (stepToUpdate && stepStatus === 'EN_ATTENTE') {
            stepToUpdate.statut = 'EN_COURS' as StatutProcedure;
          }
          setCurrentEtape({ id_etape: 1 });
        }
        
        if (updatedData.ProcedurePhase) {
          const phaseContainingStep1 = updatedData.ProcedurePhase.find(pp => 
            pp.phase?.etapes?.some(etape => etape.id_etape === 1)
          );
          if (phaseContainingStep1 && stepStatus === 'EN_ATTENTE') {
            phaseContainingStep1.statut = 'EN_COURS' as StatutProcedure;
          }
        }
        
        setProcedureData(updatedData);
        setHasActivatedStep1(true);
      }
      
      setTimeout(() => setRefetchTrigger(prev => prev + 1), 1000);
    }
  });

  const phases: Phase[] = procedureData?.ProcedurePhase 
    ? procedureData.ProcedurePhase
        .map((pp: ProcedurePhase) => pp.phase)
        .sort((a: Phase, b: Phase) => a.ordre - b.ordre)
    : [];

  const handleOpenCahierForm = (doc: DocumentWithStatus) => {
    setSelectedCahierDoc(doc);
    setShowCahierForm(true);
  };

  const CahierFormModal = () => (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-content']}>
        <div className={styles['modal-header']}>
          <h3>Remplir Cahier des Charges</h3>
          <button
            onClick={() => setShowCahierForm(false)}
            className={styles['modal-close']}
          >
            &times;
          </button>
        </div>
        <div className={styles['modal-body']}>
          <iframe
            src={`/demande/step10/page10?id=${idProc}`}
            className={styles['cahier-iframe']}
          />
        </div>
      </div>
    </div>
  );

  const CheckAllModal = () => (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-content']}>
        <div className={styles['modal-header']}>
          <h3>Vérifier tous les documents</h3>
          <button
            onClick={() => setShowCheckAllModal(false)}
            className={styles['modal-close']}
          >
            &times;
          </button>
        </div>
        <div className={styles['modal-body']}>
          <p>Êtes-vous sûr de vouloir marquer tous les documents comme présents ?</p>
          <div className={styles['modal-actions']}>
            <button 
              className={styles['btn']} 
              onClick={() => setShowCheckAllModal(false)}
            >
              Annuler
            </button>
            <button 
              className={`${styles['btn']} ${styles['btn-primary']}`}
              onClick={handleCheckAllPresent}
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const MissingDocsModal = () => {
    if (!missingSummary) return null;

    return (
      <div className={styles['modal-overlay']}>
        <div className={styles['modal-content']}>
          <div className={styles['modal-header']}>
            <h3>
              <FiAlertTriangle className={styles['warning-icon']} />
              Documents obligatoires manquants
            </h3>
            {/* <button
              onClick={() => setShowMissingDocsModal(false)}
              className={styles['modal-close']}
            >
              &times;
            </button> */}
          </div>
          <div className={styles['modal-body']}>
            <div className={styles['missing-docs-section']}>
              {hasBlockingMissingDocs && (
                <div className={styles['blocking-docs']}>
                  <h4>❌ Documents causant un rejet immédiat:</h4>
                  <ul>
                    {missingSummary.blocking.map((doc, index) => (
                      <li key={index}>
                        <strong>{doc.nom_doc}</strong>
                        {doc.reject_message && <span> - {doc.reject_message}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {hasBlockingNextMissingDocs && (
                <div className={styles['blocking-next-docs']}>
                  <h4>⚠️ Documents bloquant la progression:</h4>
                  <ul>
                    {missingSummary.blockingNext.map((doc, index) => (
                      <li key={index}>{doc.nom_doc}</li>
                    ))}
                  </ul>
                  {deadlines?.miseEnDemeure && (
                    <p className={styles['deadline-info']}>
                      Délai pour compléter: 30 jours (jusqu'au {new Date(deadlines.miseEnDemeure).toLocaleDateString()})
                    </p>
                  )}
                </div>
              )}

              {missingSummary.warnings.length > 0 && (
                <div className={styles['warning-docs']}>
                  <h4>ℹ️ Documents avec avertissement:</h4>
                  <ul>
                    {missingSummary.warnings.map((doc, index) => (
                      <li key={index}>{doc.nom_doc}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className={styles['modal-actions']}>
              <button 
                className={`${styles['btn']} ${styles['btn-primary']}`}
                onClick={handlecompris}
              >
                Compris
              </button>
              {hasBlockingNextMissingDocs && idDemande && (
                <a
                  href={`${apiURL}/api/demande/${idDemande}/mise-en-demeure.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles['btn']} ${styles['btn-primary']}`}
                  style={{ marginLeft: '8px' }}
                >
                  Télécharger la mise en demeure (PDF)
                </a>
              )}
              {hasBlockingNextMissingDocs && (
                <button
                  className={`${styles['btn']} ${styles['btn-outline']}`}
                  onClick={async () => {
                    if (!idDemande) return;
                    try {
                      let res;
                      try {
                        res = await axios.get(`${apiURL}/api/demande/${idDemande}/letters`);
                      } catch (err: any) {
                        if (err?.response?.status === 404) {
                          res = await axios.get(`${apiURL}/api/procedure/${idDemande}/letters`);
                        } else {
                          throw err;
                        }
                      }
                      if (res.data?.letters?.miseEnDemeure) {
                        setLetterPreview({
                          type: 'MISE_EN_DEMEURE',
                          content: res.data.letters.miseEnDemeure.content,
                          deadline: res.data.letters.miseEnDemeure.deadline || null,
                        });
                      }
                    } catch (e) {
                      console.error('Erreur génération lettre mise en demeure', e);
                    }
                  }}
                >
                  Prévisualiser la mise en demeure
                </button>
              )}
              {hasBlockingMissingDocs && (
                <button
                  className={`${styles['btn']} ${styles['btn-outline']}`}
                  onClick={async () => {
                    if (!idDemande) return;
                    try {
                      let res;
                      try {
                        res = await axios.get(`${apiURL}/api/demande/${idDemande}/letters`);
                      } catch (err: any) {
                        if (err?.response?.status === 404) {
                          res = await axios.get(`${apiURL}/api/procedure/${idDemande}/letters`);
                        } else {
                          throw err;
                        }
                      }
                      if (res.data?.letters?.rejet) {
                        setLetterPreview({
                          type: 'REJET',
                          content: res.data.letters.rejet.content,
                        });
                      }
                    } catch (e) {
                      console.error('Erreur génération lettre de rejet', e);
                    }
                  }}
                >
                  Prévisualiser le rejet
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const LetterPreviewModal = () => {
    if (!letterPreview) return null;
    return (
      <div className={styles['modal-overlay']}>
        <div className={styles['modal-content']}>
          <div className={styles['modal-header']}>
            <h3>Courrier: {letterPreview.type}</h3>
            <button onClick={() => setLetterPreview(null)} className={styles['modal-close']}>&times;</button>
          </div>
          <div className={styles['modal-body']}>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{letterPreview.content}</pre>
          </div>
          <div className={styles['modal-actions']}>
            <button className={`${styles['btn']} ${styles['btn-primary']}`} onClick={() => setLetterPreview(null)}>
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleCheckAllPresent = () => {
    const newStatusMap: Record<number, DocStatus> = {};
    documents.forEach(doc => {
      newStatusMap[doc.id_doc] = "present";
    });
    setStatusMap(newStatusMap);
    setShowCheckAllModal(false);
    setSuccess("Tous les documents ont été marqués comme présents");
  };

  const submitDossier = async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload = {
      documents: Object.entries(statusMap).map(([id, status]) => ({
        id_doc: Number(id),
        status,
        file_url: fileUrls[Number(id)] || null
      })),
      remarques
    };

    try {
      const response = await axios.post(
        `${apiURL}/api/demande/${idDemande}/dossier-fournis`,
        payload
      );

      setMissingSummary(response.data.missingSummary);
      setDeadlines(response.data.deadlines);
      setSuccess("Dossier mis à jour avec succés");
      setRefetchTrigger(prev => prev + 1);
      return response.data;
    } catch (err) {
      console.error("Erreur lors de la soumission du dossier", err);
      setError("Erreur lors de la soumission du dossier");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const approveDemande = async () => {
    try {
      await axios.put(
        `${apiURL}/api/demande/${idDemande}/status`,
        { statut_demande: 'ACCEPTEE' }
      );
      setSuccess("Demande approuvée avec succés");
      setRefetchTrigger(prev => prev + 1);
    } catch (err) {
      console.error("Erreur lors de l'approbation", err);
      setError("Erreur lors de l'approbation");
    }
  };

  const rejectDemande = async () => {
    if (!rejectionReason) {
      toast.warning("⚠️ Veuillez spécifier un motif de rejet");
      return;
    }

    try {
      await axios.put(`${apiURL}/api/demande/${idDemande}/status`, {
        statut_demande: 'REJETEE',
        motif_rejet: rejectionReason,
      });

      toast.success("✅ Demande rejetée avec succés");
      setRefetchTrigger(prev => prev + 1);
    } catch (err) {
      console.error("Erreur lors du rejet", err);
      toast.error("❌ Erreur lors du rejet");
    }
  };

  const handleMiseEnDemeure = async () => {
    if (!idDemande) return;
    try {
      const result = await submitDossier();
      if (!result) return;
      toast.success('Mise en demeure lancée. Le délai de 30 jours est démarré.');
      // Ouvrir directement le PDF de mise en demeure
      if (apiURL) {
        window.open(`${apiURL}/api/demande/${idDemande}/mise-en-demeure.pdf`, '_blank');
      }
    } catch (err) {
      console.error('Erreur lors de la mise en demeure', err);
      toast.error("Erreur lors du lancement de la mise en demeure.");
    }
  };

  const handleFileUpload = async (id: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(
        `${apiURL}/api/demande/${idDemande}/document/${id}/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setFileUrls(prev => ({ ...prev, [id]: res.data.fileUrl }));
      toggleStatus(id, "present");
      return res.data.fileUrl;
    } catch (err) {
      console.error("Erreur lors de l'upload du fichier", err);
      setError("Erreur lors de l'upload du fichier");
      return null;
    }
  };

  const toggleStatus = (id: number, status: DocStatus) => {
    setStatusMap(prev => ({ ...prev, [id]: status }));
  };

  const countByStatus = (status: DocStatus) =>
    Object.values(statusMap).filter((s) => s === status).length;

  const total = documents.length;
  const presents = countByStatus("present");
  const manquants = countByStatus("manquant");
  const attente = countByStatus("attente");

  const hasRequiredMissingClient = documents.some((doc) => {
    if (!doc.is_required) return false;
    const status = statusMap[doc.id_doc];
    return status !== 'present';
  });

  // Vérifier si la navigation est bloquée
  const isNavigationBlocked = false;

  // Debounced navigation handlers
  const debounce = (func: () => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func();
      }, delay);
    };
  };

  const handleNext = useCallback(
    debounce(async () => {
      if (isNavigating) return;

      // Bloquer la navigation si au moins un document obligatoire est manquant
      const hasRequiredMissing = documents.some((doc) => {
        if (!doc.is_required) return false;
        const status = statusMap[doc.id_doc];
        return status !== 'present';
      });

      if (hasRequiredMissing) {
        toast.warning(
          "Des documents obligatoires sont manquants. Impossible de passer à l'étape suivante.",
        );
        return;
      }

      try {
        setIsNavigating(true);
        await router.push(`/demande/step2/page2?id=${idProc}`);
      } catch (err) {
        console.error('Erreur lors de la navigation vers l’étape suivante', err);
      } finally {
        setIsNavigating(false);
      }
    }, 300),
    [documents, statusMap, router, idProc, isNavigating]
  );

  const handlecompris = async () => {
    router.push(`/demande/step2/page2?id=${idProc}`);
  };
  const handleBack =async () => {
      router.push(`/demande/step1_typepermis/page1_typepermis?id=${idProc}`)
  }

  const handleSaveEtape = async () => {
    if (statutProc === 'TERMINEE') {
      setEtapeMessage("Procédure déjà terminée.");
      return;
    }

    setSavingEtape(true);
    setEtapeMessage(null);

    try {
      await submitDossier();
      await axios.post(`${apiURL}/api/procedure-etape/finish/${idProc}/${currentStep}`);
      setEtapeMessage(`Étape ${currentStep} enregistrée avec succès !`);
      setRefetchTrigger(prev => prev + 1);
    } catch (err) {
      console.error(err);
      setEtapeMessage("Erreur lors de l'enregistrement de l'étape.");
    } finally {
      setSavingEtape(false);
    }
  };

  // Afficher les documents manquants obligatoires
  const MissingDocsAlert = () => {
    if (!missingSummary || missingSummary.requiredMissing.length === 0) return null;

    // return (
    //   <div className={styles['missing-docs-alert']}>
    //     <div className={styles['alert-header']}>
    //       <FiAlertTriangle className={styles['alert-icon']} />
    //       <h4>Documents obligatoires manquants</h4>
    //       <button 
    //         onClick={() => setShowMissingDocsModal(true)}
    //         className={styles['details-btn']}
    //       >
    //         Voir les détails
    //       </button>
    //     </div>
        
    //     {hasBlockingMissingDocs && (
    //       <p className={styles['blocking-alert']}>
    //         ❌ Des documents causant un rejet immédiat sont manquants
    //       </p>
    //     )}
        
    //     {hasBlockingNextMissingDocs && (
    //       <p className={styles['blocking-next-alert']}>
    //         ⚠️ Des documents bloquant la progression sont manquants
    //       </p>
    //     )}
    //   </div>
    // );
  };

  // Show loading state until all required data is available
  if (!isPageReady) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>{loadingState}</p>
        {!idProc && <p>En attente de l'ID de procédure...</p>}
        {idProc && !procedureData && <p>Chargement des données de procédure...</p>}
        {procedureData && !idDemande && <p>Chargement des données de demande...</p>}
        {idDemande && documents.length === 0 && <p>Chargement des documents...</p>}
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
            <span>Documents</span>
          </div>

          <div className={styles['documents-container']}>
            <div className={styles['content-wrapper']}>
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

                {demandeMeta && (
                  <div className={styles['instruction-deadline-banner']}>
                    <div className={styles['recevabilite-row']}>
                      <label className={styles['recevabilite-label']}>
                        <input
                          type="checkbox"
                          checked={!!demandeMeta.dossier_recevable}
                          onChange={async (e) => {
                            if (!apiURL || !idDemande) return;
                            const value = e.target.checked;
                            try {
                              await axios.put(
                                `${apiURL}/api/demande/${idDemande}/recevabilite`,
                                { dossier_recevable: value },
                                { withCredentials: true }
                              );
                              setDemandeMeta((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      dossier_recevable: value,
                                      date_instruction: value ? new Date().toISOString() : null,
                                    }
                                  : prev,
                              );
                            } catch (err) {
                              console.error('Erreur lors de la mise à jour de la recevabilité', err);
                              toast.error("Erreur lors de la mise à jour de la recevabilité du dossier.");
                            }
                          }}
                        />
                        Dossier recevable
                      </label>

                      {demandeMeta.dossier_recevable && (
                        <span className={styles['recevabilite-indicator']}>
                          <FiCheckCircle className={styles['recevabilite-icon']} />
                          <span>Dossier marqué recevable</span>
                        </span>
                      )}
                    </div>

                    <div className={styles['instruction-deadline-text']}>
                      {(() => {
                        const info = computeBusinessDeadlineInfo();
                        if (!info) {
                          return <p>Délai d'instruction : non défini.</p>;
                        }
                        return (
                          <p>
                            Délai d'instruction : il reste{' '}
                            <strong>{info.remaining}</strong> jour(s) ouvrable(s) sur{' '}
                            <strong>{info.total}</strong> (jusqu'au{' '}
                            {info.deadline.toLocaleDateString('fr-FR')}).
                          </p>
                        );
                      })()}
                    </div>
                  </div>
                )}

                <h2 className={styles['page-title']}>
                <CgFileDocument className={styles['title-icon']} />
                Documents requis
              </h2>

              {error && (
                <div className={styles['error-message']}>
                  <FiAlertCircle className={styles['error-icon']} />
                  <p>{error}</p>
                </div>
              )}

              {success && (
                <div className={styles['success-message']}>
                  <FiCheck className={styles['success-icon']} />
                  <p>{success}</p>
                </div>
              )}

              {/* Alert pour documents manquants */}
              <MissingDocsAlert />

              {codeDemande && idDemande && (
                <div className={styles['info-card']}>
                  <div className={styles['info-header']}>
                    <h4 className={styles['info-title']}>
                      <FiFileText className={styles['info-icon']} />
                      Informations Demande
                    </h4>
                  </div>
                  <div className={styles['info-content']}>
                    <div className={styles['info-row']}>
                      <span className={styles['info-label']}>Code Demande :</span>
                      <span className={styles['info-value']}>{codeDemande}</span>
                    </div>
                    <div className={styles['info-row']}>
                      <span className={styles['info-label']}>ID Demande :</span>
                      <span className={styles['info-value']}>{idDemande}</span>
                    </div>
                  </div>
                </div>
              )}

              {!currentDossier && missingSummary && (
                <div className={styles['dossier-status-section']}>
                  <div className={styles['dossier-status']}>
                    <span>Statut du dossier: </span>
                    <strong className={
                      missingSummary.requiredMissing.length === 0
                        ? styles['status-complete']
                        : styles['status-incomplete']
                    }>
                      {missingSummary.requiredMissing.length === 0 ? 'Complet' : 'Incomplet'}
                    </strong>
                  </div>

                  <div className={styles['demande-actions']}>
                    {missingSummary.requiredMissing.length > 0 && missingSummary.blockingNext.length > 0 && (
                      <button
                        className={styles['mise-en-demeure-btn']}
                        onClick={handleMiseEnDemeure}
                        disabled={statutProc === 'TERMINEE' || !statutProc || isNavigating}
                      >
                        Mise en demeure (30 jours pour compléter)
                      </button>
                    )}
                    <div className={styles['reject-section']}>
                      <input
                        disabled={statutProc === 'TERMINEE'}
                        type="text"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Motif de rejet"
                        className={styles['reject-input']}
                      />
                      <button
                        className={styles['reject-btn']}
                        onClick={rejectDemande}
                        disabled={statutProc === 'TERMINEE' || !statutProc || isNavigating}
                      >
                        Rejeter la demande
                      </button>
                    </div>
                    <button
                      className={styles['approve-btn']}
                      onClick={approveDemande}
                      disabled={statutProc === 'TERMINEE' || !statutProc || isNavigating || hasBlockingMissingDocs}
                    >
                      Demande Acceptée
                    </button>
                  </div>

                  {missingSummary.requiredMissing.length === 0 && (
                    <div style={{ marginTop: '8px' }}>
                      <button
                        className={`${styles['btn']} ${styles['btn-outline']}`}
                        onClick={async () => {
                          if (!idDemande) return;
                          try {
                            let res;
                            try {
                              res = await axios.get(`${apiURL}/api/demande/${idDemande}/letters`);
                            } catch (err: any) {
                              if (err?.response?.status === 404) {
                                res = await axios.get(`${apiURL}/api/procedure/${idDemande}/letters`);
                              } else {
                                throw err;
                              }
                            }
                            if (res.data?.letters?.recepisse) {
                              setLetterPreview({
                                type: 'RECEPISSE',
                                content: res.data.letters.recepisse.content,
                                numero_recepisse: res.data.letters.recepisse.numero_recepisse || null,
                              });
                            }
                          } catch (e) {
                            console.error('Erreur génération récépissé', e);
                          }
                        }}
                      >
                        Prévisualiser le récépissé
                      </button>
                    </div>
                  )}
                </div>
              )}

              
<div style={{ marginTop: '8px' }}>
               
                    
                        <a
                          href={`${apiURL}/api/demande/${idDemande}/recepisse.pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${styles['btn']} ${styles['btn-primary']}`}
                          style={{ marginBottom: '8px' }}
                        >
                          Télécharger le récépissé (PDF)
                        </a>
                      
                    </div>
              {missingSummary && missingSummary.requiredMissing.length > 0 && (
                <div className={styles['missing-summary']}>
                  <h3>Pièces manquantes du dossier</h3>
                  <ul className={styles['missing-list']}>
                    {missingSummary.requiredMissing.map((item, idx) => (
                      <li key={idx} className={styles['missing-item']}>
                        <strong>{item.nom_doc}</strong>
                        {item.missing_action && (
                          <span className={styles['missing-action']}>
                            {item.missing_action === 'REJECT' ? ' — Rejet immédiat' : item.missing_action === 'BLOCK_NEXT' ? ' — Bloquant' : ' — Avertissement'}
                          </span>
                        )}
                        {item.reject_message && <em className={styles['missing-reason']}> — {item.reject_message}</em>}
                      </li>
                    ))}
                  </ul>

                  <div className={styles['proc-info']}>
                    <div>Code demande: <strong>{codeDemande ?? idDemande}</strong></div>
                    {procedureData?.demandes?.[0]?.typeProcedure?.libelle && (
                      <div>Type procédure: <strong>{procedureData.demandes[0].typeProcedure.libelle}</strong></div>
                    )}
                    {procedureData?.demandes?.[0]?.typePermis?.lib_type && (
                      <div>Type permis: <strong>{procedureData.demandes[0].typePermis.lib_type}</strong></div>
                    )}
                  </div>

                  {deadlines?.miseEnDemeure && (
                    <div className={styles['deadline-hint']}>
                      Échéance de mise en demeure: {new Date(deadlines.miseEnDemeure).toLocaleDateString()} (30 jours)
                    </div>
                  )}
                </div>
              )}

              {isLoading && documents.length === 0 ? (
                <div className={styles['loading-state']}>
                  <div className={styles['spinner']}></div>
                  <p>Chargement des documents...</p>
                </div>
              ) : (
                <>
                  <div className={styles['documents-overview']}>
                    <div className={styles['overview-card']}>
                      <h3 className={styles['overview-title']}>Documents requis</h3>
                      <div className={styles['overview-value']}>{total}</div>
                    </div>
                    <button
                      className={styles['check-all-btn']}
                      onClick={() => setShowCheckAllModal(true)}
                      disabled={statutProc === 'TERMINEE' || !statutProc || isNavigating}
                    >
                      <FiCheckCircle className={styles['btn-icon']} />
                      Tout marquer comme présent
                    </button>
                  </div>

                  <div className={styles['documents-list']}>
                    {documents.map((doc) => {
                      const status = statusMap[doc.id_doc];
                      const fileUrl = fileUrls[doc.id_doc];
                      const isRequired = doc.is_required;

                      return (
                        <div key={doc.id_doc} className={`${styles['document-card']} ${styles[status]} ${isRequired ? styles['required'] : ''}`}>
                          <div className={styles['document-header']}>
                            <h4 className={styles['document-title']}>
                              {doc.nom_doc}
                              {isRequired && <span className={styles['required-badge']}>Obligatoire</span>}
                            </h4>
                            <span className={styles['document-status']}>
                              {status === "present" ? "Présent" : status === "manquant" ? "Manquant" : "EN_ATTENTE"}
                            </span>
                          </div>
                          <div className={styles['document-details']}>
                            <div className={styles['document-description']}>{doc.description}</div>
                            <div className={styles['document-meta']}>
                              <span className={styles['document-format']}>{doc.format}</span>
                              <span className={styles['document-size']}>{doc.taille_doc}</span>
                            </div>
                            {fileUrl && (
                              <div className={styles['document-file']}>
                                <a
                                  href={fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={styles['file-link']}
                                >
                                  Voir le fichier joint
                                </a>
                              </div>
                            )}
                          </div>
                          <div className={styles['document-actions']}>
                            <button
                              disabled={statutProc === 'TERMINEE' || !statutProc || isNavigating}
                              className={`${styles['status-btn']} ${status === "present" ? styles['active'] : ""}`}
                              onClick={() => toggleStatus(doc.id_doc, "present")}
                            >
                              <FiCheck className={styles['btn-icon']} />
                              Présent
                            </button>
                            <button
                              disabled={statutProc === 'TERMINEE' || !statutProc || isNavigating}
                              className={`${styles['status-btn']} ${status === "manquant" ? styles['active'] : ""}`}
                              onClick={() => toggleStatus(doc.id_doc, "manquant")}
                            >
                              <FiX className={styles['btn-icon']} />
                              Manquant
                            </button>
                            <div className={styles['upload-section']}>
                              <label
                                htmlFor={`file-upload-${doc.id_doc}`}
                                className={`${styles['upload-btn']} ${styles['btn-outline']} ${statutProc === 'TERMINEE' || !statutProc || isNavigating ? styles['disabled'] : ''}`}
                              >
                                <FiUpload className={styles['btn-icon']} />
                                {fileUrl ? "Modifier" : "Upload"}
                              </label>
                            </div>

                            {doc.nom_doc === "Cahier des charges renseigné" && (
                              <button
                                className={styles['cahier-btn']}
                                onClick={() => handleOpenCahierForm(doc)}
                                disabled={isNavigating}
                              >
                                Remplir cahier de charge
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className={styles['progress-section']}>
                    <h3 className={styles['section-title']}>État d'avancement</h3>

                    <div className={styles['stats-grid']}>
                      <div className={styles['stat-card']}>
                        <div className={styles['stat-value']}>{total}</div>
                        <div className={styles['stat-label']}>Total</div>
                      </div>
                      <div className={`${styles['stat-card']} ${styles['present']}`}>
                        <div className={styles['stat-value']}>{presents}</div>
                        <div className={styles['stat-label']}>Présents</div>
                      </div>
                      <div className={`${styles['stat-card']} ${styles['missing']}`}>
                        <div className={styles['stat-value']}>{manquants}</div>
                        <div className={styles['stat-label']}>Manquants</div>
                      </div>
                    </div>

                    <div className={styles['completion-bar']}>
                      <div className={styles['completion-track']}>
                        <div
                          className={styles['completion-progress']}
                          style={{ width: `${((presents / total) * 100)}%` }}
                        ></div>
                      </div>
                      <div className={styles['completion-text']}>
                        {presents === total ? (
                          <span className={styles['complete']}>Tous les documents sont présents!</span>
                        ) : (
                          <span className={styles['incomplete']}>
                            {attente > 0 ? "Veuillez vérifier tous les documents" : "Documents en cours de vérification"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {currentDossier && (
                <div className={styles['dossier-status-section']}>
                  <div className={styles['dossier-status']}>
                    <span>Statut du dossier: </span>
                    <strong className={
                      currentDossier.statut_dossier === 'complet'
                        ? styles['status-complete']
                        : styles['status-incomplete']
                    }>
                      {currentDossier.statut_dossier === 'complet' ? 'Complet' : 'Incomplet'}
                    </strong>
                  </div>

                  <div className={styles['demande-actions']}>
                    <div className={styles['reject-section']}>
                      <input
                        disabled={statutProc === 'TERMINEE'}
                        type="text"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Motif de rejet"
                        className={styles['reject-input']}
                      />
                      <button
                        className={styles['reject-btn']}
                        onClick={rejectDemande}
                        disabled={statutProc === 'TERMINEE' || !statutProc || isNavigating}
                      >
                        Rejeter la demande
                      </button>
                    </div>
                    <button
                      className={styles['approve-btn']}
                      onClick={approveDemande}
                      disabled={statutProc === 'TERMINEE' || !statutProc || isNavigating || hasBlockingMissingDocs}
                    >
                      Demande Acceptée
                    </button>
                  </div>
                </div>
                
              )}
                </>
              )}

              <div className={styles['navigation-buttons']}>
                <button
                  className={`${styles['btn']} ${styles['btn-outline']}`}
                  onClick={handleBack}
                  disabled={isLoading || isSubmitting || statutProc === 'TERMINEE' || isNavigating}
                >
                  <FiChevronLeft className={styles['btn-icon']} />
                  Précédent
                </button>

                <button
                  className={styles['btnSave']}
                  onClick={handleSaveEtape}
                  disabled={savingEtape || isSubmitting || statutProc === 'TERMINEE' }
                >
                  <BsSave className={styles['btnIcon']} />
                  {savingEtape ? "Sauvegarde en cours..." : "Sauvegarder l'étape"}
                </button>

                <button
                  className={`${styles['btn']} ${styles['btn-primary']}`}
                  onClick={handleNext}
                  disabled={isLoading || isSubmitting || isNavigating || hasRequiredMissingClient}
                >
                  {isSubmitting ? (
                    <span className={styles['btn-loading']}>
                      <span className={styles['spinner-small']}></span>
                      {isSubmitting ? "Soumission..." : "Vérification..."}
                    </span>
                  ) : (
                    <>
                      Suivant
                      <FiChevronRight className={styles['btn-icon']} />
                    </>
                  )}
                </button>
              </div>

              {etapeMessage && (
                <div className={styles['etapeMessage']}>
                  {etapeMessage}
                </div>
              )}
            </div>
            {showCahierForm && <CahierFormModal />}
            {showCheckAllModal && <CheckAllModal />}
            {letterPreview && <LetterPreviewModal />}
          </div>
        </main>
      </div>
    </div>
  );
}
