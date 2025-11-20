'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from '@/src/hooks/useSearchParams';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Sidebar from '@/pages/sidebar/Sidebar';
import Navbar from '@/pages/navbar/Navbar';
import { FiChevronLeft, FiChevronRight, FiSave } from 'react-icons/fi';
import { useViewNavigator } from '@/src/hooks/useViewNavigator';
import styles from './permis.module.css'
import { useActivateEtape } from '@/src/hooks/useActivateEtape';
import ProgressStepper from '@/components/ProgressStepper';
import { STEP_LABELS } from '@/src/constants/steps';
import router from 'next/router';
import { BsSave } from 'react-icons/bs';
import { Phase, Procedure, ProcedureEtape, ProcedurePhase, StatutProcedure } from '@/src/types/procedure';
const PermisDesigner = dynamic(() => import('../../../components/PermisDesigner'), {
  ssr: false,
  loading: () => <div>Loading designer...</div>
});

interface PermisSaveResponse {
  id: number;
  [key: string]: any; // Allow other properties if needed
}

const Step10GeneratePermis = () => {
  const searchParams = useSearchParams();
  const idProcStr = searchParams?.get('id');
  const idProc = idProcStr ? parseInt(idProcStr, 10) : undefined;
  const [permisData, setPermisData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
    const [idDemande, setIdDemande] = useState<string | null>(null);
  const [codeDemande, setCodeDemande] = useState<string | null>(null);
  const [statutProc, setStatutProc] = useState<string | undefined>(undefined);
  const { currentView, navigateTo } = useViewNavigator("nouvelle-demande");
  const currentStep = 8;
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [savingEtape, setSavingEtape] = useState(false);
  const [etapeMessage, setEtapeMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
const [procedureData, setProcedureData] = useState<Procedure | null>(null);
const [currentEtape, setCurrentEtape] = useState<{ id_etape: number } | null>(null);
const [procedureTypeId, setProcedureTypeId] = useState<number | undefined>();
const [refetchTrigger, setRefetchTrigger] = useState(0);
const [hasActivatedStep8, setHasActivatedStep8] = useState(false); 
const [activatedSteps, setActivatedSteps] = useState<Set<number>>(new Set());
  const [isPageReady, setIsPageReady] = useState(false);

  const handleSaveEtapeFixed = async () => {
    if (!idProc) {
      setEtapeMessage("ID procedure introuvable !");
      return;
    }

    if (statutProc === 'TERMINEE') {
      setEtapeMessage("Procédure deja terminée.");
      return;
    }

    setSavingEtape(true);
    setEtapeMessage(null);

    try {
      let etapeId = 8;

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
      setEtapeMessage("étape 8 enregistrée avec succés !");
      
    } catch (err) {
      console.error(err);
      setEtapeMessage("Erreur lors de l'enregistrement de l'étape.");
    } finally {
      setSavingEtape(false);
    }
  };

  // If no idProc is provided, stop loading and show an error instead of spinning forever
  useEffect(() => {
    if (!idProc) {
      setError("ID de procédure introuvable");
      setLoading(false);
    } else {
      // reset error when idProc becomes available
      setError(null);
    }
  }, [idProc]);

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
    etapeNum: 8,
    shouldActivate: currentStep === 8 && !activatedSteps.has(8) && isPageReady,
    onActivationSuccess: (stepStatus: string) => {
      if (stepStatus === 'TERMINEE') {
        setActivatedSteps(prev => new Set(prev).add(8));
        setHasActivatedStep8(true);
        return;
      }

      setActivatedSteps(prev => new Set(prev).add(8));
      setHasActivatedStep8(true);
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



  useEffect(() => {
    // mark page ready once we have proc + demande identifiers
    if (idProc && idDemande && procedureData) {
      setIsPageReady(true);
    }
    
    if (!idProc) return;

    axios.get(`${apiURL}/api/procedures/${idProc}/demande`)
      .then(res => {
        setIdDemande(res.data.id_demande?.toString());
        setCodeDemande(res.data.code_demande!);
        setStatutProc(res.data.procedure.statut_proc);
      })
      .catch(err => {
        console.error("Erreur lors de la récupération de la demande", err);
        setError("Impossible de récupérer la demande");
      });
  }, [idProc]);

  const handleSaveEtape = async () => {
    if (!idProc) {
      setEtapeMessage("ID procedure introuvable !");
      return;
    }

    if (statutProc === 'TERMINEE') {
      setEtapeMessage("Procédure déjà terminée.");
      return;
    }

    setSavingEtape(true);
    setEtapeMessage(null);

    try {
      await axios.post(`${apiURL}/api/procedure-etape/finish/${idProc}/8`);
      setEtapeMessage("étape 8 enregistrée avec succés !");
    } catch (err) {
      console.error(err);
      setEtapeMessage("Erreur lors de l'enregistrement de l'étape.");
    } finally {
      setSavingEtape(false);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiURL}/api/procedures/${idProc}/demande`);
        const demandeId = response.data.id_demande;
        
        const summaryResponse = await axios.get(`${apiURL}/api/demande/${demandeId}/summary`);
        setPermisData(summaryResponse.data);
        console.log("qqqqqqqqqq",summaryResponse.data)
      } catch (err) {
        console.error('Failed to fetch permis data', err);
        setError('Failed to load permis data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (idProc) fetchData();
  }, [idProc, apiURL]);

  /*const handleSaveDesign = async (design: any): Promise<void> => {
    try {
      await axios.post(`${apiURL}/api/permis/templates`, design);
    } catch (error) {
      console.error('Failed to save design', error);
      throw new Error('Failed to save design');
    }
  };*/

  const handleNext = () => {
    router.push(`/demande/step9/page9?id=${idProc}`)
  };

  const handlePrevious = () => {
    router.push(`/demande/step7/page7?id=${idProc}`)
  };

  const handleGeneratePdf = async (design: any) => {
    try {
      const response = await axios.post(`${apiURL}/api/permis/generate-pdf`, design, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Failed to generate PDF', error);
      throw new Error('Failed to generate PDF');
    }
  };
const handleSavePermis = async (permisData: any): Promise<{id: number, code_permis: string}> => {
  // Resolve prior code number robustly so TXM/TXC keeps the same designation
  const resolveCodeNumber = async (): Promise<string | undefined> => {
    try {
      // 1) Direct stored value
      const stored = localStorage.getItem('prior_code_number');
      if (stored && stored.trim()) return stored.trim();

      // 2) Parse from prior code like "APM 2"
      const priorCode = localStorage.getItem('prior_code_permis');
      const m = priorCode?.trim().match(/(\d+)$/);
      if (m && m[1]) return m[1];

      // 3) Fetch prior permis info and parse
      const priorPermisId = localStorage.getItem('prior_permis_id');
      if (priorPermisId && apiURL) {
        try {
          const pr = await axios.get(`${apiURL}/Permisdashboard/${priorPermisId}`, { withCredentials: true });
          const code = pr.data?.code_permis || pr.data?.code || pr.data?.permis?.code_permis || '';
          const mm = String(code).match(/(\d+)$/);
          if (mm && mm[1]) return mm[1];
        } catch {}
      }
    } catch {}
    return undefined;
  };

  try {
    const payload: any = {
      id_demande: parseInt(idDemande!)
    };

    const codeNumber = await resolveCodeNumber();
    if (codeNumber) payload.codeNumber = codeNumber;

    const response = await axios.post(`${apiURL}/api/permis/save-permis`, payload, { withCredentials: true });

    // Clear only after a successful save
    try { if (codeNumber) localStorage.removeItem('prior_code_number'); } catch {}

    return response.data;
  } catch (error) {
    console.error('Failed to save permis', error);
    throw new Error('Failed to save permis');
  }
};

// Separate function for saving template
const handleSaveTemplate = async (templateData: any): Promise<void> => {
  try {
    await axios.post(`${apiURL}/api/permis/save-template`, templateData);
  } catch (error) {
    console.error('Failed to save template', error);
    throw new Error('Failed to save template');
  }
};
/*const handleSavePermis = async (permisData: any): Promise<PermisSaveResponse> => {
  try {
    const response = await axios.post(`${apiURL}/api/permis/save-permis`, {
      id_demande: parseInt(idDemande!),
      elements: permisData.elements // Make sure this contains all necessary data
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to save permis', error);
    throw new Error('Failed to save permis');
  }
};*/
  if (loading) return <div className="loading">Loading permis data...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!permisData) return <div className="error">No permis data found</div>;

  return (<div className={styles['app-container']}>
      <Navbar />
      <div className={styles['app-content']}>
        <Sidebar currentView={currentView} navigateTo={navigateTo} />
        <main className={styles['main-content']}>
          <div className={styles.headerContainer}>
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
          </div>
          <div className={styles['breadcrumb']}>
            <span>SIGAM</span>
            <FiChevronRight className={styles['breadcrumb-arrow']} />
            <span>Genaration Permis</span>
          </div>
                                          <div className={styles.contentWrapper}>

    <div className="page-container">
      <PermisDesigner 
  initialData={permisData}
  onSave={handleSaveTemplate}
  onGeneratePdf={handleGeneratePdf}
  onSavePermis={handleSavePermis}
  procedureId={idProc}
/>

      <style jsx>{`
        .page-container {
          margin: 0 auto;
        }
        .loading, .error {
          padding: 20px;
          text-align: center;
        }
        .error {
          color: #d32f2f;
        }
      `}</style>
      {/* Action Buttons */}
            <div className={styles['navigation-buttons']}>
                <button
                  className={`${styles['btn']} ${styles['btn-outline']}`}
                  onClick={handlePrevious}
                  disabled={isLoading || isSubmitting || statutProc === 'TERMINEE'}
                >
                  <FiChevronLeft className={styles['btn-icon']} />
                  Précédent
                </button>

                <button
                  className={styles['btnSave']}
                  onClick={handleSaveEtapeFixed}
                  disabled={savingEtape || isSubmitting || statutProc === 'TERMINEE' || !statutProc}
                >
                  <BsSave className={styles['btnIcon']} />
                  {savingEtape ? "Sauvegarde en cours..." : "Sauvegarder l'étape"}
                </button>

                <button
                  className={`${styles['btn']} ${styles['btn-primary']}`}
                  onClick={handleNext}
                  disabled={isLoading || isSubmitting}
                >
                  {isLoading || isSubmitting ? (
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
    </div>
    </main>
    </div>
    </div>
  );
};

export default Step10GeneratePermis;
