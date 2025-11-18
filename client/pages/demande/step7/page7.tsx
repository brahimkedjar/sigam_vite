// src/pages/Demande/Step8/Page8.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './cd_step.module.css';
import { useSearchParams } from '@/src/hooks/useSearchParams';
import router from 'next/router';
import { FiChevronLeft, FiChevronRight, FiSave, FiDownload } from 'react-icons/fi';
import { STEP_LABELS } from '@/src/constants/steps';
import Navbar from '@/pages/navbar/Navbar';
import Sidebar from '@/pages/sidebar/Sidebar';
import { ViewType } from '@/src/types/viewtype';
import ProgressStepper from '@/components/ProgressStepper';
import { useViewNavigator } from '@/src/hooks/useViewNavigator';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '@/public/logo.jpg';
import { useActivateEtape } from '@/src/hooks/useActivateEtape';
import { Phase, Procedure, ProcedureEtape, ProcedurePhase, StatutProcedure } from '@/src/types/procedure';
interface Procedure1 {
  id_proc: number;
  num_proc: string;
  id_seance?: number;
  demandes: Array<{
    typeProcedure: { 
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
      const [loadingMessage, setLoadingMessage] = useState('Chargement des paramétres...');


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
  
  // useActivateEtape({ idProc, etapeNum: 7, statutProc });
  const getDataUrlFromImage = async (src: string): Promise<string> => {
  const response = await fetch(src);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
};
const getProcedureType = (procedure: Procedure1): string => {
  return procedure.demandes[0]?.typeProcedure?.libelle || 'N/A';
};
const generatePDFReport = async () => {
  if (!procedure || !seance || !comite || !decision) return;

  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Add logo if available
        try {
          const logoSrc = typeof logo === 'string' ? logo : (logo as any).src;
          const logoDataUrl = await getDataUrlFromImage(logoSrc);
          doc.addImage(logoDataUrl, 'PNG', 15, 10, 30, 15);
        } catch (logoError) {
          console.warn('Could not load logo:', logoError);
          doc.setFontSize(16);
          doc.text('Rapport Officiel', 20, 20);
        }

    // Title
    doc.setFontSize(18);
    doc.setTextColor(40, 53, 147);
    doc.text('Rapport de Décision du Comité de Direction', 105, 30, { align: 'center' });

    // Procedure info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Procédure: ${procedure.num_proc}`, 15, 45);
    doc.text(`Type: ${procedure ? getProcedureType(procedure) : 'N/A'}`, 15, 50);
    doc.text(`Société: ${detenteur}`, 15, 55);

    // Seance info
    doc.text(`Séance du Comité: ${seance.num_seance}`, 15, 65);
    doc.text(`Date: ${formatDate(seance.date_seance)}`, 15, 70);
    doc.text(`Exercice: ${seance.exercice}`, 15, 75);

    // Decision info
    doc.setFontSize(14);
    doc.setTextColor(40, 53, 147);
    doc.text('Décision du Comité', 15, 85);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Numéro décision: ${decision.numero_decision}`, 15, 90);
    doc.text(`Date du comité: ${formatDate(comite.date_comite)}`, 15, 95);
    
    // Add summary table using autoTable
    autoTable(doc, {
      startY: 105,
      head: [['Détails', 'Valeurs']],
      body: [
        ['Décision', decision.decision_cd === 'favorable' ? 'Favorable âœ“' : 'Défavorable ✗'],
        ['Durée', decision.duree_decision ? `${decision.duree_decision} mois` : 'N/A'],
      ],
      theme: 'grid',
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255
      }
    });

    // Add members table
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 15,
      head: [['Membres du Comité', 'Fonction', 'Signature']],
      body: seance.membres.map(membre => [
        `${membre.prenom_membre} ${membre.nom_membre}`,
        membre.fonction_membre,
        membre.signature_type === 'electronique' ? 'E-Signature' : 'Manuelle'
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255
      }
    });

    // Add comments if available
    if (decision.commentaires) {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Commentaires:', 15, (doc as any).lastAutoTable.finalY + 15);
      
      // Split long comments into multiple lines
      const splitComments = doc.splitTextToSize(decision.commentaires, 180);
      doc.text(splitComments, 15, (doc as any).lastAutoTable.finalY + 20);
    }

    // Add footer
const pageCount = (doc.internal as any).getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${i} sur ${pageCount}`, 105, 287, { align: 'center' });
      doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 195, 287, { align: 'right' });
    }

    doc.save(`Rapport_Decision_${procedure.num_proc}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Une erreur est survenue lors de la génération du rapport');
  }
};




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
        setError('Aucune séance associée à cette procédure');
        setLoading(false);
        return;
      }

      const foundSeanceBasic = seancesBasicRes.data.find((s: Seance) => s.id_seance === idSeance);
      const foundSeanceWithDec = seancesWithDecRes.data.data.find((s: Seance) => s.id_seance === idSeance);

      if (!foundSeanceBasic || !foundSeanceWithDec) {
        setError('Séance non trouvée');
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
        }
      } else {
        setError('Comité non trouvé pour cette procédure');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des données:', err);
      setError('Erreur lors de la récupération des données');
    } finally {
      setLoading(false);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (error) {
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
            <div className={styles.errorContainer}>
              <div className={styles.errorIcon}>!</div>
              <h3>Erreur de chargement</h3>
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className={styles.retryButton}
              >
                Réessayer
              </button>
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
          </div>

          <div className={styles.contentContainer}>
            {/* Procedure Summary */}
            <div className={styles.summaryCard}>
              <div className={styles.summaryHeader}>
                <h2>Procédure {procedure?.num_proc}</h2>
                <span className={styles.procedureType}>
  {procedure ? getProcedureType(procedure) : 'N/A'}
</span>
              </div>
              <div className={styles.summaryContent}>
                <div className={styles.summaryItem}>
                  <strong>Société:</strong> 
                  
                  {detenteur || 'N/A'}
                </div>
              </div>
            </div>

            {/* Seance Information */}
            {seance && (
              <div className={styles.infoCard}>
                <div className={styles.cardHeader}>
                  <h2>Séance du Comité</h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Numéro:</span>
                      <span className={styles.infoValue}>{seance.num_seance}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Date:</span>
                      <span className={styles.infoValue}>{formatDate(seance.date_seance)}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Exercice:</span>
                      <span className={styles.infoValue}>{seance.exercice}</span>
                    </div>
                  </div>

                  {seance.remarques && (
                    <div className={styles.remarks}>
                      <h3 className={styles.subTitle}>Remarques</h3>
                      <p>{seance.remarques}</p>
                    </div>
                  )}

                  <h3 className={styles.subTitle}>Membres participants</h3>
                  <div className={styles.membersGrid}>
                    {seance.membres.map((membre) => (
                      <div key={membre.id_membre} className={styles.memberCard}>
                        <div className={styles.memberAvatar}>
                          {membre.prenom_membre.charAt(0)}{membre.nom_membre.charAt(0)}
                        </div>
                        <div className={styles.memberInfo}>
                          <h4>{membre.prenom_membre} {membre.nom_membre}</h4>
                          <p>{membre.fonction_membre}</p>
                          <p className={styles.memberEmail}>{membre.email_membre}</p>
                        </div>
                        <div className={`${styles.signatureBadge} ${membre.signature_type === 'electronique' ? styles.electronic : styles.manual}`}>
                          {membre.signature_type === 'electronique' ? 'E-Signature' : 'Signature manuelle'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Comite Decision */}
            {comite && (
              <div className={styles.infoCard}>
                <div className={styles.cardHeader}>
                  <h2>Décision du Comité</h2>
                  <button 
  className={styles.downloadButton}
  onClick={generatePDFReport}
>
  <FiDownload /> Télécharger le rapport
</button>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Numéro décision:</span>
                      <span className={styles.infoValue}>{decision?.numero_decision}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Date du comité:</span>
                      <span className={styles.infoValue}>{formatDate(comite.date_comite)}</span>
                    </div>
                    
                  </div>

                  <div className={styles.infoItemFull}>
                    <span className={styles.infoLabel}>Objet:</span>
                    <span className={styles.infoValue}>{comite.objet_deliberation}</span>
                  </div>

                  <div className={styles.infoItemFull}>
                    <span className={styles.infoLabel}>Résumé:</span>
                    <p className={styles.infoValue}>{comite.resume_reunion}</p>
                  </div>

                  <h3 className={styles.subTitle}>Documents joints</h3>
                  <div className={styles.documentsGrid}>
                    {comite.fiche_technique && (
                      <a href={comite.fiche_technique} target="_blank" rel="noopener noreferrer" className={styles.documentCard}>
                        <span>Fiche technique</span>
                        <span className={styles.downloadIcon}>â†“</span>
                      </a>
                    )}
                    {comite.carte_projettee && (
                      <a href={comite.carte_projettee} target="_blank" rel="noopener noreferrer" className={styles.documentCard}>
                        <span>Carte projetée</span>
                        <span className={styles.downloadIcon}>â†“</span>
                      </a>
                    )}
                    {comite.rapport_police && (
                      <a href={comite.rapport_police} target="_blank" rel="noopener noreferrer" className={styles.documentCard}>
                        <span>Rapport police</span>
                        <span className={styles.downloadIcon}>â†“</span>
                      </a>
                    )}
                    {!comite.fiche_technique && !comite.carte_projettee && !comite.rapport_police && (
                      <div className={styles.noDocuments}>Aucun document joint</div>
                    )}
                  </div>

                  {decision && (
                    <>
                      <h3 className={styles.subTitle}>Décision</h3>
                      <div className={`${styles.decisionCard} ${decision.decision_cd === 'favorable' ? styles.favorable : styles.defavorable}`}>
                        <div className={styles.decisionHeader}>
                          <h4>
                            {decision.decision_cd === 'favorable' ? (
                              <span className={styles.decisionIcon}>âœ“</span>
                            ) : (
                              <span className={styles.decisionIcon}>✗</span>
                            )}
                            Décision {decision.decision_cd === 'favorable' ? 'Favorable' : 'Défavorable'}
                          </h4>
                          {decision.duree_decision && (
                            <span className={styles.durationBadge}>
                              {decision.duree_decision} mois
                            </span>
                          )}
                        </div>
                        {decision.commentaires && (
                          <div className={styles.decisionComment}>
                            <strong>Commentaires:</strong> {decision.commentaires}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

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
