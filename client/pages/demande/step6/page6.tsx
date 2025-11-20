'use client';

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FiSend, FiClock, FiCheck, FiX, FiChevronLeft, FiChevronRight, FiDownload, FiFileText, FiCalendar, FiEdit, FiRefreshCw } from "react-icons/fi";
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { useSearchParams } from "@/src/hooks/useSearchParams";
import styles from  "./avis_wali.module.css";
import Navbar from "../../navbar/Navbar";
import Sidebar from "../../sidebar/Sidebar";
import { BsFilePerson, BsSave } from "react-icons/bs";
import { useViewNavigator } from "../../../src/hooks/useViewNavigator";
import ProgressStepper from "../../../components/ProgressStepper";
import { STEP_LABELS } from "../../../src/constants/steps";
import { useActivateEtape } from "@/src/hooks/useActivateEtape";
import router from 'next/router';
import { Phase, Procedure, ProcedureEtape, ProcedurePhase, StatutProcedure } from "@/src/types/procedure";

type InteractionWali = {
  id_interaction: number;
  id_procedure: number;
  type_interaction: "envoi" | "reponse";
  date_interaction: string;
  date_reponse?: string;
  avis_wali?: "favorable" | "defavorable";
  remarques?: string;
  contenu?: string;
  nom_responsable_reception?: string;
};

type DemandeSummary = {
  code_demande: string;
  detenteur: {
    nom_societeFR: string;
    telephone: string;
    RegistreCommerce: Array<{
      numero_rc: string;
      nif: string;
      adresse_legale: string;
    }>;
  };
  procedure: {
    typeProcedure: {
      nom: string;
      domaine: string;
    };
    SubstanceAssocieeDemande: Array<{
      substance: {
        nom_subFR: string;
      };
    }>;
  };
  duree_travaux_estimee: number;
  budget_prevu: number;
  DemandeDocumentStatut: Array<{
    status: string;
    document: {
      nom_doc: string;
    };
  }>;
};

export default function AvisWaliStep() {
  const searchParams = useSearchParams();
  const idProcStr = searchParams?.get('id');
  const idProc = idProcStr ? parseInt(idProcStr, 10) : undefined;
  const [idProcedure, setIdProcedure] = useState<number | null>(null);
  const [form, setForm] = useState({
    type_interaction: "reponse",
    date_interaction: new Date().toISOString().split('T')[0],
    date_reponse: new Date().toISOString().split('T')[0],
    avis_wali: "favorable",
    contenu: "",
    nom_responsable_reception: "",
  });
  const [envoiForm, setEnvoiForm] = useState({
    date_envoi: new Date().toISOString().split('T')[0],
    remarques: "Envoi initial au wali",
  });
  const [interactions, setInteractions] = useState<InteractionWali[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfPreviewVisible, setPdfPreviewVisible] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [idDemande, setIdDemande] = useState<string | null>(null);
  const [codeDemande, setCodeDemande] = useState<string | null>(null);
  const [savingEtape, setSavingEtape] = useState(false);
  const [etapeMessage, setEtapeMessage] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const { currentView, navigateTo } = useViewNavigator("nouvelle-demande");
  const [statutProc, setStatutProc] = useState<string | undefined>(undefined);
  const [id_wilaya, setid_wilaya] = useState<number | null>(null);
  const currentStep = 6;
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const [procedureData, setProcedureData] = useState<Procedure | null>(null);
  const [currentEtape, setCurrentEtape] = useState<{ id_etape: number } | null>(null);
  const [procedureTypeId, setProcedureTypeId] = useState<number | undefined>();
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [hasActivatedStep6, setHasActivatedStep6] = useState(false);
  const [showEnvoiModal, setShowEnvoiModal] = useState(false);
  const [demandeSummary, setDemandeSummary] = useState<DemandeSummary | null>(null);
  const [activatedSteps, setActivatedSteps] = useState<Set<number>>(new Set());
  const [isPageReady, setIsPageReady] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Chargement des paramétres...');

  const fetchProcedureData = useCallback(async () => {
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
  }, [idProc, apiURL]);

  useEffect(() => {
    fetchProcedureData();
  }, [fetchProcedureData, refetchTrigger]);

  // Mark page as ready when required data is present so step activation can run
  useEffect(() => {
    if (idProc && procedureData && idDemande) {
      setIsPageReady(true);
    }
  }, [idProc, procedureData, idDemande]);

  useActivateEtape({
    idProc,
    etapeNum: 6,
    shouldActivate: currentStep === 6 && !activatedSteps.has(6) && isPageReady,
    onActivationSuccess: (stepStatus: string) => {
      if (stepStatus === 'TERMINEE') {
        setActivatedSteps((prev) => new Set(prev).add(6));
        setHasActivatedStep6(true);
        return;
      }

      setActivatedSteps((prev) => new Set(prev).add(6));
      setHasActivatedStep6(true);
      setTimeout(() => setRefetchTrigger(prev => prev + 1), 500);
    },
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

  const generateWaliLetter = async (preview = false) => {
  setIsGeneratingPdf(true);
  try {
    const response = await axios.get(`${apiURL}/api/demande/${idDemande}/summary`);
    console.log("wwwwwwwwwwwwwwwww",response)
    const demande = response.data;

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    // Metadata
    doc.setProperties({
      title: `Lettre pour Wali - ${demande.code_demande}`,
      subject: "Demande d'avis pour permis minier",
      author: "Ministére de l'énergie et des Mines"
    });

    // Header
    doc.addImage("/logo.jpg", "PNG", 15, 10, 30, 30);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Ministére de l'énergie et des Mines", 50, 15);
    doc.text("Direction Générale des Mines", 50, 20);
    doc.text("Alger, Algérie", 50, 25);

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(15, 40, 195, 40);

    // Ref Info
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(`Référence: ${demande.code_demande}`, 15, 45);
    doc.text(`Date: ${format(new Date(), "dd/MM/yyyy")}`, 160, 45);

    // Recipient
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("À Monsieur le Wali de la Wilaya de:", 15, 60);
    doc.setFont("helvetica", "normal");
    const wilaya = demande.detenteur?.RegistreCommerce?.[0]?.adresse_legale?.split(',')[1]?.trim() || 'Alger';
    doc.text(wilaya, 80, 60);

    // Objet
    doc.setFont("helvetica", "bold");
    doc.text("Objet:", 15, 75);
    doc.setFont("helvetica", "normal");
    doc.text("Demande d'avis concernant le permis minier", 30, 75);

    let y = 90;
    const marginLeft = 25;
    const lineHeight = 7;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const paragraph = `Monsieur le Wali,
Par la présente, nous avons l'honneur de vous soumettre la demande de permis minier déposée par la société ${demande.detenteur?.nom_societeFR || ''}, conformément aux dispositions réglementaires en vigueur.`;
    const lines = doc.splitTextToSize(paragraph, 165);
    doc.text(lines, marginLeft, y);
    y += lines.length * lineHeight + 5;

    // Company Info
doc.setFont("helvetica", "bold");
doc.text("Identification de l'entreprise:", marginLeft, y);
y += lineHeight;

const labelX = 25;
const valueX = 75;

const companyFields = [
  { label: "Raison sociale", value: demande.detenteur?.nom_societeFR },
  { label: "Registre de Commerce", value: demande.detenteur?.RegistreCommerce?.[0]?.numero_rc },
  { label: "NIF", value: demande.detenteur?.RegistreCommerce?.[0]?.nif },
  { label: "Adresse", value: demande.detenteur?.RegistreCommerce?.[0]?.adresse_legale },
  { label: "Téléphone", value: demande.detenteur?.telephone },
];

companyFields.forEach(({ label, value }) => {
  doc.setFont("helvetica", "bold");
  doc.text(`${label}:`, labelX, y);
  doc.setFont("helvetica", "normal");

  const wrapped = doc.splitTextToSize(value || "Non spécifié", 110);
  doc.text(wrapped, valueX, y);
  y += wrapped.length * lineHeight;
});


   // Project Info
y += 5;
doc.setFont("helvetica", "bold");
doc.text("Détails du projet:", marginLeft, y);
y += lineHeight;

const substanceText = demande.procedure?.SubstanceAssocieeDemande
  ?.map((s: any) => s.substance.nom_subFR)
  .join(', ') || "Non spécifiées";

const projectFields = [
  { label: "Type de permis", value: demande.procedure?.typeProcedure?.nom },
  { label: "Domaine", value: demande.procedure?.typeProcedure?.domaine },
  { label: "Substances concernées", value: substanceText },
  { label: "Durée estimée", value: `${demande.duree_travaux_estimee} mois` },
  { label: "Budget prévisionnel", value: demande.budget_prevu ? `${demande.budget_prevu.toLocaleString('fr-FR')} DZD` : 'Non spécifié' }
];

projectFields.forEach(({ label, value }) => {
  doc.setFont("helvetica", "bold");
  doc.text(`${label}:`, labelX, y);
  doc.setFont("helvetica", "normal");

  const wrapped = doc.splitTextToSize(value || "Non spécifié", 110);
  doc.text(wrapped, valueX, y);
  y += wrapped.length * lineHeight;
});


    // Documents
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Documents joints:", marginLeft, y);
    y += lineHeight;

    if (demande.DemandeDocumentStatut?.length > 0) {
      demande.DemandeDocumentStatut.forEach((docItem: any) => {
        const status = docItem.status === "present" ? "✔ Présent" : "âœ˜ Manquant";
        const color: [number, number, number] = docItem.status === "present" ? [0, 128, 0] : [200, 0, 0];
        const label = `- ${docItem.document.nom_doc}`;
        doc.setFont("helvetica", "normal");
        doc.text(label, marginLeft, y);
        doc.setTextColor(...color);
        doc.text(status, marginLeft + 140, y);
        doc.setTextColor(0); // Reset
        y += lineHeight;
      });
    } else {
      doc.text("- Aucun document joint", marginLeft, y);
      y += lineHeight;
    }

    // Conclusion
    y += 10;
    const closing = "Dans l'attente de votre aimable retour, nous vous prions d'agréer, Monsieur le Wali, l'expression de notre haute considération.";
    const closingLines = doc.splitTextToSize(closing, 160);
    doc.text(closingLines, marginLeft, y);
    y += closingLines.length * lineHeight;

    // Signature
    y += 15;
    doc.setFont("helvetica", "bold");
    doc.text("Le Directeur Général des Mines", marginLeft + 80, y);
    doc.setFont("helvetica", "normal");
    doc.text("Ministére de l'énergie et des Mines", marginLeft + 80, y + 7);

    if (preview) {
      const pdfBlob = doc.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      setPdfPreviewVisible(true);
    } else {
      doc.save(`lettre_wali_${demande.code_demande}.pdf`);
    }

    setSuccess("Lettre générée avec succés");
    setTimeout(() => setSuccess(null), 3000);
  } catch (err) {
    console.error("Erreur génération PDF :", err);
    setError("Erreur lors de la génération de la lettre");
  } finally {
    setIsGeneratingPdf(false);
  }
};

  const handleGenerateLetter = () => {
    generateWaliLetter(true);
  };

  const handleDownloadPdf = () => {
    generateWaliLetter(false);
    setPdfPreviewVisible(false);
  };

  const rejectDemande = async () => {
    if (!rejectionReason) {
      setError("Veuillez specifier un motif de rejet");
      return;
    }

    try {
      await axios.put(
        `${apiURL}/api/demande/${idDemande}/status`,
        { 
          statut_demande: 'REJETEE',
          rejectionReason: rejectionReason
        }
      );
      setSuccess("Demande rejetee avec succes");
      setRejectionReason("");
    } catch (err) {
      console.error("Erreur lors du rejet", err);
      setError("Erreur lors du rejet");
    }
  };

  const fetchDemandeAndWilaya = useCallback(async () => {
    if (!idProc) return;

    try {
      const res = await axios.get(`${apiURL}/api/procedures/${idProc}/demande`);
      const demande = res.data;

      setIdDemande(demande.id_demande.toString());
      setCodeDemande(demande.code_demande);
      setStatutProc(demande.procedure.statut_proc);

      const summary = await axios.get(`${apiURL}/api/demande/${demande.id_demande}/summary`);
      setid_wilaya(summary.data?.id_wilaya ?? summary.data?.daira?.id_wilaya ?? null);
      
      setIdProcedure(idProc);
      await fetchInteractions(idProc);

    } catch (err) {
      console.error("Erreur récupération demande/wilaya :", err);
      setError("Impossible de récupérer la demande ou la wilaya");
    }
  }, [idProc, apiURL]);

  useEffect(() => {
    fetchDemandeAndWilaya();
  }, [fetchDemandeAndWilaya]);

  const handleSaveEtapeFixed = async () => {
    if (!idProc) {
      setEtapeMessage("ID procedure introuvable !");
      return;
    }

    setSavingEtape(true);
    setEtapeMessage(null);

    try {
      let etapeId = 6;

      try {
        if (procedureData?.ProcedurePhase) {
          const pathname = window.location.pathname.replace(/^\/+/, '');
          const phasesList = (procedureData.ProcedurePhase || []) as ProcedurePhase[];
          const allEtapes = phasesList.flatMap(pp => pp.phase?.etapes ?? []);
          const match = allEtapes.find((e: any) => e.page_route === pathname);
          if (match?.id_etape != null) {
            etapeId = match.id_etape;
          }
        }
      } catch {
        // fallback to default etapeId
      }

      await axios.post(`${apiURL}/api/procedure-etape/finish/${idProc}/${etapeId}`);
      setEtapeMessage("étape 6 enregistrée avec succés !");
      
    } catch (err) {
      console.error(err);
      setEtapeMessage("Erreur lors de l'enregistrement de l'étape.");
    } finally {
      setSavingEtape(false);
    }
  };

  const handleSaveEtape = async () => {
    if (!idProc) {
      setEtapeMessage("ID procedure introuvable !");
      return;
    }

    setSavingEtape(true);
    setEtapeMessage(null);

    try {
      await axios.post(`${apiURL}/api/procedure-etape/finish/${idProc}/6`);
      setEtapeMessage("étape 6 enregistrée avec succés !");
    } catch (err) {
      console.error(err);
      setEtapeMessage("Erreur lors de l'enregistrement de l'étape.");
    } finally {
      setSavingEtape(false);
    }
  };

  const fetchInteractions = async (procId: number) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${apiURL}/interactions-wali/${procId}`);
      console.log("sssssssss",res.data)
      setInteractions(res.data);
    } catch (error) {
      console.error("Erreur chargement interactions :", error);
      setError("Erreur lors du chargement des interactions");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchProcedureData(),
        fetchDemandeAndWilaya(),
        idProc && fetchInteractions(idProc)
      ]);
      setSuccess("Données actualisées");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Erreur lors de l'actualisation", error);
      setError("Erreur lors de l'actualisation des données");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleNext = () => {
    router.push(`/demande/step7/page7?id=${idProc}`);
  };

  const handleBack = () => {
    if (!idProc) {
      setError("ID procédure manquant");
      return;
    }
    router.push(`/demande/step5/page5?id=${idProc}`);
  };

  const handleEnvoiInitial = async () => {
    if (!idProcedure) return;
    
    setIsLoading(true);
    setError(null);
    try {
      await axios.post(`${apiURL}/interactions-wali`, {
        id_procedure: idProcedure,
        type_interaction: "envoi",
        date_interaction: envoiForm.date_envoi,
        remarques: envoiForm.remarques,
        id_wilaya: id_wilaya
      });
      await fetchInteractions(idProcedure);
      setEnvoiForm({
        date_envoi: new Date().toISOString().split('T')[0],
        remarques: "Envoi initial au wali",
      });
      setShowEnvoiModal(false);
      setSuccess("Demande envoyée au Wali");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Erreur envoi initial :", err);
      setError("Erreur lors de l'envoi au Wali");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.contenu) {
      setError("Veuillez saisir le contenu de la réponse");
      return;
    }

    if (!form.nom_responsable_reception) {
      setError("Veuillez saisir le nom du responsable ayant reçu la réponse");
      return;
    }

    if (!idProcedure) return;
    
    setIsLoading(true);
    setError(null);
    try {
      await axios.post(`${apiURL}/interactions-wali`, {
        ...form,
        id_procedure: idProcedure,
        id_wilaya: id_wilaya,
        date_interaction: form.date_reponse,
        type_interaction: "reponse"
      });
      await fetchInteractions(idProcedure);
      setForm({
        type_interaction: "reponse",
        date_interaction: new Date().toISOString().split('T')[0],
        date_reponse: new Date().toISOString().split('T')[0],
        avis_wali: "favorable",
        contenu: "",
        nom_responsable_reception: "",
      });
      setSuccess("Réponse enregistrée avec succés");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Erreur enregistrement :", err);
      setError("Erreur lors de l'enregistrement");
    } finally {
      setIsLoading(false);
    }
  };

    const parseDateSafely = (dateString: string | null | undefined): Date => {
  if (!dateString) return new Date();
  
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? new Date() : date;
  } catch (error) {
    console.warn('Failed to parse date:', dateString, error);
    return new Date();
  }
};

const latestEnvoi = interactions
  .filter((i) => i.type_interaction === "envoi")
  .sort((a, b) => new Date(b.date_interaction || b.date_interaction).getTime() - new Date(a.date_interaction || a.date_interaction).getTime())[0];

  const daysLeft = latestEnvoi
  ? Math.max(0, 90 - Math.floor((Date.now() - parseDateSafely(latestEnvoi.date_interaction || latestEnvoi.date_interaction).getTime()) / (1000 * 60 * 60 * 24)))
  : null;



  const isReadOnly = statutProc === 'TERMINEE' || !statutProc;

  return (
    <div className={styles.appContainer}>
      <Navbar />
      <div className={styles.appContent}>
        <Sidebar currentView={currentView} navigateTo={navigateTo} />
        <main className={styles.mainContent}>
          <div className={styles.breadcrumb}>
            <span>SIGAM</span>
            <FiChevronRight className={styles.breadcrumbArrow} />
            <span>Avis du Wali</span>
          </div>
          <div className={styles.contentWrapper}>
             {procedureData && (
            <ProgressStepper
               phases={phases}
               currentProcedureId={idProc}
               currentEtapeId={currentEtape?.id_etape}
               procedurePhases={procedureData.ProcedurePhase || []}
               procedureTypeId={procedureTypeId}
               procedureEtapes={procedureData.ProcedureEtape || []}
             />
          )}
            <div className={styles.pageHeader}>
            <div className={styles.headerLeft}>
              <h1 className={styles.pageTitle}>
                <BsFilePerson className={styles.titleIcon} />
                Avis du Wali - étape 6
              </h1>
              {codeDemande && (
                <div className={styles.demandeInfo}>
                  <span className={styles.infoBadge}>Demande: {codeDemande}</span>
                  {idDemande && <span className={styles.infoBadge}>ID: {idDemande}</span>}
                </div>
              )}
            </div>
            <div className={styles.headerActions}>
              <button 
                onClick={refreshData}
                className={styles.refreshButton}
                disabled={isRefreshing}
              >
                <FiRefreshCw className={isRefreshing ? styles.spinning : ''} />
                Actualiser
              </button>
            </div>
          </div>
            {/* Status Messages */}
            {isLoading && !idProcedure && (
              <div className={styles.loadingState}>
                <div className={styles.spinner}></div>
                <p>Chargement de la procédure...</p>
              </div>
            )}
            
            {error && (
              <div className={styles.errorMessage}>
                <FiX className={styles.errorIcon} />
                <p>{error}</p>
                <button onClick={() => setError(null)} className={styles.closeError}>
                  <FiX />
                </button>
              </div>
            )}
            
            {success && (
              <div className={styles.successMessage}>
                <FiCheck className={styles.successIcon} />
                <p>{success}</p>
                <button onClick={() => setSuccess(null)} className={styles.closeSuccess}>
                  <FiX />
                </button>
              </div>
            )}

            {/* Rejection Section */}
            <div className={styles.rejectSection}>
              <h3 className={styles.sectionTitle}>Rejet de la Demande</h3>
              <div className={styles.rejectForm}>
                <input
                  disabled={isReadOnly}
                  type="text"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Motif de rejet (obligatoire)"
                  className={styles.rejectInput}
                />
                <button
                  className={styles.rejectBtn}
                  onClick={rejectDemande}
                  disabled={isReadOnly || !rejectionReason.trim()}
                >
                  <FiX className={styles.btnIcon} />
                  Rejeter la demande
                </button>
              </div>
            </div>

            {idProcedure && (
              <>
                {/* Action Section */}
                <div className={styles.actionSection}>
                  <div className={styles.actionGrid}>
                    <div className={styles.actionCard}>
                      <h4>Envoi au Wali</h4>
                      <p>Marquer la demande comme envoyée au Wali</p>
                      <button 
                        onClick={() => setShowEnvoiModal(true)} 
                        className={styles.primaryButton}
                        disabled={isLoading || isReadOnly}
                      >
                        <FiSend className={styles.btnIcon} />
                        Marquer comme envoyé
                      </button>
                    </div>

                    <div className={styles.actionCard}>
                      <h4>Génération de Lettre</h4>
                      <p>Générer la lettre officielle pour le Wali</p>
                      <button 
                        onClick={handleGenerateLetter} 
                        className={styles.secondaryButton}
                        disabled={isLoading || isGeneratingPdf || isReadOnly}
                      >
                        {isGeneratingPdf ? (
                          <span className={styles.btnLoading}>
                            <span className={styles.spinnerSmall}></span>
                            Génération...
                          </span>
                        ) : (
                          <>
                            <FiDownload className={styles.btnIcon} />
                            Générer lettre
                          </>
                        )}
                      </button>
                    </div>

                    {latestEnvoi && (
                      <div className={styles.delayCard}>
                        <div className={styles.delayHeader}>
                          <FiClock className={styles.delayIcon} />
                          <span>Délai de réponse</span>
                        </div>
                        <div className={styles.delayContent}>
                          <span className={styles.daysLeft}>{daysLeft} jour{daysLeft === 1 ? "" : "s"}</span>
                          <span className={styles.delayText}>restant{daysLeft === 1 ? "" : "s"}</span>
                        </div>
                        {daysLeft === 0 && (
                          <button 
                            className={styles.warningButton}
                            onClick={() => setShowEnvoiModal(true)}
                            disabled={isLoading || isReadOnly}
                          >
                            <FiSend className={styles.btnIcon} />
                            Relancer
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Response Form Section */}
                <div className={styles.responseSection}>
                  <div className={styles.sectionHeader}>
                    <h3>Réponse du Wali</h3>
                    <div className={styles.sectionActions}>
                      <button 
                        onClick={() => {
                          setForm({
                            type_interaction: "reponse",
                            date_interaction: new Date().toISOString().split('T')[0],
                            date_reponse: new Date().toISOString().split('T')[0],
                            avis_wali: "favorable",
                            contenu: "",
                            nom_responsable_reception: "",
                          });
                        }}
                        className={styles.outlineButton}
                        disabled={isReadOnly}
                      >
                        <FiEdit className={styles.btnIcon} />
                        Réinitialiser
                      </button>
                    </div>
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>Date de réponse</label>
                      <div className={styles.dateInputContainer}>
                        <FiCalendar className={styles.dateIcon} />
                        <input
                          disabled={isReadOnly}
                          type="date"
                          value={form.date_reponse}
                          onChange={(e) => setForm({ ...form, date_reponse: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Avis</label>
                      <div className={styles.radioGroup}>
                        <label className={`${styles.radioOption} ${form.avis_wali === 'favorable' ? styles.selected : ''}`}>
                          <input
                            disabled={isReadOnly}
                            type="radio"
                            value="favorable"
                            checked={form.avis_wali === 'favorable'}
                            onChange={() => setForm({ ...form, avis_wali: 'favorable' })}
                          />
                          <span className={styles.radioCustom}></span>
                          Favorable
                        </label>
                        <label className={`${styles.radioOption} ${form.avis_wali === 'defavorable' ? styles.selected : ''}`}>
                          <input
                            disabled={isReadOnly}
                            type="radio"
                            value="defavorable"
                            checked={form.avis_wali === 'defavorable'}
                            onChange={() => setForm({ ...form, avis_wali: 'defavorable' })}
                          />
                          <span className={styles.radioCustom}></span>
                          Défavorable
                        </label>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Nom du responsable</label>
                      <input
                        disabled={isReadOnly}
                        type="text"
                        placeholder="Nom du responsable ayant reçu la réponse"
                        value={form.nom_responsable_reception}
                        onChange={(e) => setForm({ ...form, nom_responsable_reception: e.target.value })}
                      />
                    </div>

                    <div className={styles.formGroupFull}>
                      <label>Contenu ou remarques</label>
                      <textarea
                        disabled={isReadOnly}
                        placeholder="Saisissez les détails de la réponse du Wali..."
                        value={form.contenu}
                        onChange={(e) => setForm({ ...form, contenu: e.target.value })}
                        rows={5}
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handleSubmit}
                    className={styles.successButton}
                    disabled={isLoading || isReadOnly || !form.contenu.trim() || !form.nom_responsable_reception.trim()}
                  >
                    {isLoading ? (
                      <span className={styles.btnLoading}>
                        <span className={styles.spinnerSmall}></span>
                        Enregistrement...
                      </span>
                    ) : (
                      <>
                        <FiCheck className={styles.btnIcon} />
                        Enregistrer la réponse
                      </>
                    )}
                  </button>
                </div>

                {/* History Section */}
                <div className={styles.historySection}>
                  <div className={styles.sectionHeader}>
                    <h3>Historique des interactions</h3>
                    <span className={styles.interactionCount}>{interactions.length} interaction(s)</span>
                  </div>
                  
                  {interactions.length === 0 ? (
                    <div className={styles.emptyState}>
                      <FiFileText className={styles.emptyIcon} />
                      <p>Aucune interaction enregistrée</p>
                    </div>
                  ) : (
                    <div className={styles.timeline}>
                      {interactions.map((interaction, idx) => (
                        <div key={idx} className={styles.timelineItem}>
                          <div className={`${styles.timelineBadge} ${styles[interaction.type_interaction]}`}>
                            {interaction.type_interaction === 'envoi' ? <FiSend /> : <FiCheck />}
                          </div>
                          <div className={styles.timelineContent}>
                            <div className={styles.timelineHeader}>
                              <span className={`${styles.interactionType} ${styles[interaction.type_interaction]}`}>
                                {interaction.type_interaction.toUpperCase()}
                              </span>
                              <span className={styles.interactionDate}>
                                {new Date(interaction.date_interaction).toLocaleDateString('fr-FR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <div className={styles.interactionDetails}>
                              {interaction.avis_wali && (
                                <span className={`${styles.avisBadge} ${styles[interaction.avis_wali]}`}>
                                  Avis {interaction.avis_wali}
                                </span>
                              )}
                              {interaction.nom_responsable_reception && (
                                <p><strong>Responsable:</strong> {interaction.nom_responsable_reception}</p>
                              )}
                              <p>{interaction.remarques || interaction.contenu || "Aucun détail fourni"}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Navigation */}
            <div className={styles.navigationSection}>
              <div className={styles.navigationButtons}>
                <button className={styles.outlineButton} onClick={handleBack}>
                  <FiChevronLeft className={styles.btnIcon} />
                  Précédent
                </button>
                
                <button
                  className={styles.saveButton}
                  onClick={handleSaveEtapeFixed}
                  disabled={savingEtape || isReadOnly}
                >
                  <BsSave className={styles.btnIcon} />
                  {savingEtape ? "Sauvegarde..." : "Sauvegarder l'étape"}
                </button>
                
                <button 
                  className={styles.primaryButton}
                  onClick={handleNext}
                  disabled={isLoading}
                >
                  Suivant
                  <FiChevronRight className={styles.btnIcon} />
                </button>
              </div>
              
              {etapeMessage && (
                <div className={styles.etapeMessage}>
                  {etapeMessage}
                </div>
              )}
            </div>

            {/* Modals */}
            {showEnvoiModal && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalContainer}>
                  <div className={styles.modalHeader}>
                    <h3>Envoi au Wali</h3>
                    <button onClick={() => setShowEnvoiModal(false)} className={styles.modalClose}>
                      <FiX />
                    </button>
                  </div>
                  <div className={styles.modalContent}>
                    <div className={styles.formGroup}>
                      <label>Date d'envoi</label>
                      <div className={styles.dateInputContainer}>
                        <FiCalendar className={styles.dateIcon} />
                        <input
                          type="date"
                          value={envoiForm.date_envoi}
                          onChange={(e) => setEnvoiForm({...envoiForm, date_envoi: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Remarques</label>
                      <textarea
                        placeholder="Remarques sur l'envoi..."
                        value={envoiForm.remarques}
                        onChange={(e) => setEnvoiForm({...envoiForm, remarques: e.target.value})}
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className={styles.modalActions}>
                    <button className={styles.outlineButton} onClick={() => setShowEnvoiModal(false)}>
                      Annuler
                    </button>
                    <button className={styles.primaryButton} onClick={handleEnvoiInitial} disabled={isLoading}>
                      <FiSend className={styles.btnIcon} />
                      Confirmer l'envoi
                    </button>
                  </div>
                </div>
              </div>
            )}

            {pdfPreviewVisible && (
              <div className={styles.pdfPreviewModal}>
                <div className={styles.pdfPreviewContainer}>
                  <div className={styles.pdfPreviewHeader}>
                    <FiFileText className={styles.pdfIcon} />
                    <h3>Aperçu de la Lettre Administrative</h3>
                    <button onClick={() => setPdfPreviewVisible(false)} className={styles.closeButton}>
                      <FiX />
                    </button>
                  </div>
                  <div className={styles.pdfPreviewContent}>
                    <iframe 
                      src={pdfUrl} 
                      width="100%" 
                      height="500px"
                      style={{ border: 'none' }}
                      title="Lettre Wali Preview"
                    />
                  </div>
                  <div className={styles.pdfPreviewActions}>
                    <button onClick={handleDownloadPdf} className={styles.primaryButton}>
                      <FiDownload className={styles.btnIcon} />
                      Télécharger le PDF
                    </button>
                    <button onClick={() => setPdfPreviewVisible(false)} className={styles.outlineButton}>
                      Fermer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
