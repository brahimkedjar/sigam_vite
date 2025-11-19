"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSearchParams } from "@/src/hooks/useSearchParams";
import {
  FiUpload,
  FiCheck,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiAlertCircle,
  FiCheckCircle
} from "react-icons/fi";
import styles from '@/pages/demande/step1/documents.module.css';
import Navbar from "../../navbar/Navbar";
import Sidebar from "../../sidebar/Sidebar";
import { CgFileDocument } from "react-icons/cg";
import { BsSave } from "react-icons/bs";
import { useAuthStore } from "../../../src/store/useAuthStore";
import ProgressStepper from "../../../components/ProgressStepper";
import { STEP_LABELS } from "../../../src/constants/steps";
import { useViewNavigator } from "../../../src/hooks/useViewNavigator";
import router from 'next/router';
import { Phase, Procedure, ProcedureEtape, ProcedurePhase, StatutProcedure } from "@/src/types/procedure";
import { useActivateEtape } from "@/src/hooks/useActivateEtape";
import { toast } from "react-toastify";
type Document = {
  id_doc: number;
  nom_doc: string;
  description: string;
  format: string;
  taille_doc: string;
  statut?: string;
  file_url?: string;
};

type DossierFournis = {
  id_dossierFournis: number;
  statut_dossier: string;
  remarques?: string;
  date_depot: string;
};

type DocStatus = "present" | "manquant" | "attente";
type DocumentWithStatus = Document & { statut: DocStatus };

export default function Step5_Documents() {
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
  const abortControllerRef = useRef<AbortController | null>(null);

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
  }, [idDemande, apiURL]);
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
      setHasActivatedStep1(true);
      setTimeout(() => setRefetchTrigger(prev => prev + 1), 500);
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
      await axios.post(
        `${apiURL}/api/demande/${idDemande}/dossier-fournis`,
        payload
      );

      setSuccess("Dossier mis à jour avec succés");
      setRefetchTrigger(prev => prev + 1);
      return true;
    } catch (err) {
      console.error("Erreur lors de la soumission du dossier", err);
      setError("Erreur lors de la soumission du dossier");
      return false;
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
      setSuccess("Demande approuvee avec succes");
      setRefetchTrigger(prev => prev + 1);
    } catch (err) {
      console.error("Erreur lors de l'approbation", err);
      setError("Erreur lors de l'approbation");
    }
  };

  const rejectDemande = async () => {
    if (!rejectionReason) {
      toast.warning("Veuillez specifier un motif de rejet.");
      return;
    }

    try {
      await axios.put(`${apiURL}/api/demande/${idDemande}/status`, {
        statut_demande: 'REJETEE',
        rejectionReason,
      });

      toast.success("Demande rejetee avec succes");
      setRefetchTrigger(prev => prev + 1);
    } catch (err) {
      console.error("Erreur lors du rejet", err);
      toast.error("Erreur lors du rejet");
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
      if (attente > 0) {
        setError("Tous les documents doivent être marqués 'présent' ou 'manquant'");
        return;
      }

      if (isNavigating) return;
      setIsNavigating(true);
      setIsLoading(true);
      setError(null);

      try {
        const dossierSubmitted = await submitDossier();
        if (!dossierSubmitted) return;
        await router.push(`/demande/step2/page2?id=${idProc}`);
      } catch (err) {
        console.error("Erreur lors de la soumission du dossier", err);
        setError("Erreur lors de la soumission du dossier");
      } finally {
        setIsLoading(false);
        setIsNavigating(false);
      }
    }, 300),
    [attente, submitDossier, router, idProc, isNavigating]
  );

  const handleBack = async () => {
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
      await axios.post(`${apiURL}/api/procedure-etape/finish/${idProc}/${currentStep}`);
      setEtapeMessage(`étape ${currentStep} enregistrée avec succés !`);
      setRefetchTrigger(prev => prev + 1);
    } catch (err) {
      console.error(err);
      setEtapeMessage("Erreur lors de l'enregistrement de l'étape.");
    } finally {
      setSavingEtape(false);
    }
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
                   procedureEtapes={procedureData.ProcedureEtape || []}
                 />
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
                      disabled={statutProc === 'TERMINEE' || !statutProc || isNavigating}
                    >
                      Demande Acceptée
                    </button>
                  </div>
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

                      return (
                        <div key={doc.id_doc} className={`${styles['document-card']} ${styles[status]}`}>
                          <div className={styles['document-header']}>
                            <h4 className={styles['document-title']}>{doc.nom_doc}</h4>
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
                    <h3 className={styles['section-title']}>état d'avancement</h3>

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
                  disabled={isLoading || attente > 0 || isSubmitting || isNavigating}
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
          </div>
        </main>
      </div>
    </div>
  );
}
