'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './demande2.module.css';
import InfosGenerales from './InfosGenerales';
import RepresentantLegal from './RepresentantLegal';
import Actionnaires from './Actionnaires';
import DetailsRC from './DetailsRC';
import axios from 'axios';
import { FiX, FiFileText, FiChevronRight, FiChevronLeft, FiEdit, FiLoader, FiSearch } from 'react-icons/fi';
import { useSearchParams } from '@/src/hooks/useSearchParams';
import Navbar from '../../navbar/Navbar';
import Sidebar from '../../sidebar/Sidebar';
import { BsSave } from 'react-icons/bs';
import TauxWarningModal from '../../../src/hooks/taux_warning';
import { useViewNavigator } from '../../../src/hooks/useViewNavigator';
import ProgressStepper from '../../../components/ProgressStepper';
import { STEP_LABELS } from '../../../src/constants/steps';
import { useActivateEtape } from '@/src/hooks/useActivateEtape';
import router from 'next/router';
import { Phase, Procedure, ProcedureEtape, ProcedurePhase, StatutProcedure } from '@/src/types/procedure';
// Type definitions
type StatutJuridique = {
  id_statutJuridique: number;
  code_statut: string;
  statut_fr: string;
  statut_ar: string;
};

type Pays = {
  id_pays: number;
  nom_pays: string;
  nationalite: string;
};

type AccordionItem = {
  id: string;
  title: string;
  color: 'blue' | 'green' | 'orange' | 'purple';
};

type Actionnaire = {
  id?: number;
  nom: string;
  prenom: string;
  lieu_naissance: string;
  qualification: string;
  numero_carte: string;
  taux_participation: string;
  id_pays: number | null
};

type SocieteData = {
  infos: {
    nom_fr: string;
    nom_ar: string;
    statut_id: number;
    tel: string;
    email: string;
    fax: string;
    adresse: string;
    id_pays: number | null;
  };
  repLegal: {
    nom: string;
    prenom: string;
    nom_ar: string;
    prenom_ar: string;
    tel: string;
    email: string;
    fax: string;
    qualite: string;
    nin: string;
    taux_participation: string;
    id_pays: number | null;
  };
  rcDetails: {
    numero_rc: string;
    date_enregistrement: string;
    capital_social: string;
    nis: string;
    adresse_legale: string;
    nif: string;
  };
  actionnaires: Actionnaire[];
};

const initialData: SocieteData = {
  infos: {
    nom_fr: '',
    nom_ar: '',
    statut_id: 0,
    tel: '',
    email: '',
    fax: '',
    adresse: '',
    id_pays: 0
  },
  repLegal: {
    nom: '',
    prenom: '',
    nom_ar: '',
    prenom_ar: '',
    tel: '',
    email: '',
    fax: '',
    qualite: '',
    nin: '',
    taux_participation: '',
    id_pays: 0
  },
  rcDetails: {
    numero_rc: '',
    date_enregistrement: '',
    capital_social: '',
    nis: '',
    adresse_legale: '',
    nif: '',
  },
  actionnaires: []
};

type DetenteurOption = {
  id_detenteur: number;
  nom_societeFR: string;
  nom_societeAR: string;
  telephone: string;
  email: string;
};

export default function Step2() {
  // State management
  const [codeDemande, setCodeDemande] = useState<string | null>(null);
  const [idDemande, setIdDemande] = useState<string | null>(null);
  const [detenteurId, setDetenteurId] = useState<number | null>(null);
  const [statutProc, setStatutProc] = useState<string | undefined>(undefined);
  const [statutsJuridiques, setStatutsJuridiques] = useState<StatutJuridique[]>([]);
  const [tauxSummary, setTauxSummary] = useState({
    total: 0,
    rep: 0,
    actionnaires: 0,
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | null>(null);
  const [disabledSections, setDisabledSections] = useState({
    infos: false,
    repLegal: false,
    rcDetails: false,
    actionnaires: false,
  });
  const [isModifying, setIsModifying] = useState({
    infos: false,
    repLegal: false,
    rcDetails: false,
    actionnaires: false,
  });
  const [savingEtape, setSavingEtape] = useState(false);
  const [etapeMessage, setEtapeMessage] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<SocieteData>(initialData);
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});
  const [showTauxModal, setShowTauxModal] = useState(false);
  const [paysOptions, setPaysOptions] = useState<Pays[]>([]);
  const [detenteurOptions, setDetenteurOptions] = useState<DetenteurOption[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showDetenteurDropdown, setShowDetenteurDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Chargement des données...');
  const [checkInterval, setCheckInterval] = useState<NodeJS.Timeout | null>(null);
  const [isPageReady, setIsPageReady] = useState(false);
  const [currentStep, setCurrentStep] = useState(2);
  const [activatedSteps, setActivatedSteps] = useState<Set<number>>(new Set());
  const [procedureData, setProcedureData] = useState<Procedure | null>(null);
  const [currentEtape, setCurrentEtape] = useState<{ id_etape: number } | null>(null);
  const [procedureTypeId, setProcedureTypeId] = useState<number | undefined>();
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [hasActivatedStep2, setHasActivatedStep2] = useState(false); 
  const [idProc, setIdProc] = useState<number | undefined>(undefined);

  // Hooks
  const searchParams = useSearchParams();
  const { currentView, navigateTo } = useViewNavigator("nouvelle-demande");
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  // Check if all required data is available
  const checkRequiredData = useCallback(() => {
    if (!idProc) return false;
    if (!procedureData) return false;
    if (!idDemande) return false;
    return true;
  }, [idProc, procedureData, idDemande]);

  // Set up interval to check for required data
  useEffect(() => {
    if (checkRequiredData()) {
      setIsPageReady(true);
      setIsLoading(false);
      if (checkInterval) {
        clearInterval(checkInterval);
        setCheckInterval(null);
      }
    }
  }, [checkRequiredData, checkInterval]);

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
        const res = await axios.get(`${apiURL}/api/procedures/${idProc}/demande`);
        const demande = res.data;

        setCodeDemande(demande.code_demande);
        setIdDemande(demande.id_demande.toString());
        setStatutProc(res.data.procedure.statut_proc);

        // Check if demande already has a detenteur associated
        if (demande.detenteur) {
          const fonctions = demande.detenteur.fonctions;
          const representant = fonctions.find((f: { type_fonction: string; }) => f.type_fonction === "Representant");
          const actionnaires = fonctions.filter((f: { type_fonction: string; }) => f.type_fonction === "Actionnaire");
          
          setDetenteurId(demande.detenteur.id_detenteur);
          setSearchQuery(demande.detenteur.nom_societeFR || '');
          
          // Get the first element of registreCommerce array (or empty object if none)
          const rcData = demande.detenteur.registreCommerce && demande.detenteur.registreCommerce.length > 0 
            ? demande.detenteur.registreCommerce[0] 
            : {};
          
          setFormData({
            infos: {
              nom_fr: demande.detenteur.nom_societeFR,
              nom_ar: demande.detenteur.nom_societeAR,
              statut_id: demande.detenteur.id_statutJuridique || 0,
              tel: demande.detenteur.telephone,
              email: demande.detenteur.email,
              fax: demande.detenteur.fax,
              adresse: demande.detenteur.adresse_siege,
              id_pays: demande.detenteur.id_pays,
            },
            repLegal: representant ? {
              nom: representant.personne.nomFR,
              prenom: representant.personne.prenomFR,
              nom_ar: representant.personne.nomAR,
              prenom_ar: representant.personne.prenomAR,
              tel: representant.personne.telephone,
              email: representant.personne.email,
              fax: representant.personne.fax,
              qualite: representant.personne.qualification,
              nin: representant.personne.num_carte_identite,
              taux_participation: representant.taux_participation.toString(),
              id_pays: representant.personne.id_pays
            } : initialData.repLegal,
            rcDetails: {
              numero_rc: rcData.numero_rc || '',
              date_enregistrement: formatDate(rcData.date_enregistrement),
              capital_social: rcData.capital_social?.toString() || '',
              nis: rcData.nis || '',
              adresse_legale: rcData.adresse_legale || '',
              nif: rcData.nif || '',
            },
            actionnaires: actionnaires.map((a: any) => ({
              nom: a.personne.nomFR,
              prenom: a.personne.prenomFR,
              lieu_naissance: a.personne.lieu_naissance,
              qualification: a.personne.qualification,
              numero_carte: a.personne.num_carte_identite,
              taux_participation: a.taux_participation.toString(),
              id_pays: a.personne.id_pays
            }))
          });

          setDisabledSections({
            infos: true,
            repLegal: !!representant,
            rcDetails: !!rcData.numero_rc,
            actionnaires: actionnaires.length > 0,
          });
        } else {
          // No detenteur associated yet, reset form
          setFormData(initialData);
          setDetenteurId(null);
          setSearchQuery('');
          setDisabledSections({
            infos: false,
            repLegal: false,
            rcDetails: false,
            actionnaires: false,
          });
        }
        
        setLoadingMessage("Données de demande chargées, chargement des options...");
      } catch (err) {
        console.error("Erreur lors de la récupération de la demande par id_proc:", err);
        setLoadingMessage("Erreur lors de la récupération de la demande");
      }
    };

    fetchDemandeFromProc();
  }, [idProc, procedureData, apiURL]);

  // Fetch additional data (countries, legal statuses) when idDemande is available
  useEffect(() => {
    if (!idDemande) return;

    const fetchAdditionalData = async () => {
      try {
        // Fetch countries
        const paysResponse = await axios.get<Pays[]>(`${apiURL}/statuts-juridiques/pays`);
        setPaysOptions(paysResponse.data);
        
        // Fetch legal statuses
        const statutsResponse = await axios.get<StatutJuridique[]>(`${apiURL}/api/statuts-juridiques`);
        setStatutsJuridiques(statutsResponse.data);
        
        setLoadingMessage("Options chargées, vérification des données...");
      } catch (error) {
        console.error("Error fetching additional data:", error);
        setLoadingMessage("Erreur lors du chargement des options");
      }
    };

    fetchAdditionalData();
  }, [idDemande, apiURL]);

  // Set up interval to check for required data if not all available
  useEffect(() => {
    if (!checkRequiredData() && !checkInterval) {
      const interval = setInterval(() => {
        setRefetchTrigger(prev => prev + 1);
      }, 500); // Check every 500ms
      setCheckInterval(interval);
    }

    return () => {
      if (checkInterval) {
        clearInterval(checkInterval);
      }
    };
  }, [checkRequiredData, checkInterval]);

  // Search for detenteurs
  useEffect(() => {
    const fetchDetenteurs = async () => {
      if (searchQuery.length < 2) {
        setDetenteurOptions([]);
        return;
      }
      
      setIsSearching(true);
      try {
        const response = await axios.get(`${apiURL}/api/detenteur-morale/search`, {
          params: { q: searchQuery }
        });
        setDetenteurOptions(response.data);
      } catch (error) {
        console.error("Error fetching detenteurs:", error);
        setDetenteurOptions([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(fetchDetenteurs, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, apiURL]);

  // Activate step 2 when all data is ready
  useActivateEtape({
    idProc,
    etapeNum: 2,
    shouldActivate: currentStep === 2 && !activatedSteps.has(2) && isPageReady,
    onActivationSuccess: (stepStatus: string) => {
      if (stepStatus === 'TERMINEE') {
        setActivatedSteps(prev => new Set(prev).add(2));
        setHasActivatedStep2(true);
        return;
      }

      setActivatedSteps(prev => new Set(prev).add(2));
      setHasActivatedStep2(true);
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

  // Helper functions
  const formatDate = (isoDate?: string) => {
    if (!isoDate) return '';
    return new Date(isoDate).toISOString().split('T')[0];
  };

  const handleDetenteurSelect = async (detenteurId: number) => {
    try {
      // Fetch complete detenteur data
      const response = await axios.get(`${apiURL}/api/detenteur-morale/${detenteurId}`);
      const detenteur = response.data;
      
      // Update form data with the selected detenteur's information
      setFormData({
        infos: {
          nom_fr: detenteur.nom_societeFR || '',
          nom_ar: detenteur.nom_societeAR || '',
          statut_id: detenteur.id_statutJuridique || 0,
          tel: detenteur.telephone || '',
          email: detenteur.email || '',
          fax: detenteur.fax || '',
          adresse: detenteur.adresse_siege || '',
          id_pays: detenteur.id_pays || 0,
        },
        repLegal: initialData.repLegal,
        rcDetails: initialData.rcDetails,
        actionnaires: []
      });
      
      setDetenteurId(detenteurId);
      setSearchQuery(detenteur.nom_societeFR || '');
      setShowDetenteurDropdown(false);
      
      // Associate the detenteur with the current demande
      if (idDemande) {
        try {
          await axios.put(`${apiURL}/api/demande/${idDemande}/associate-detenteur`, {
            id_detenteur: detenteurId
          });
          console.log("Detenteur associated with demande successfully");
        } catch (error) {
          console.error("Error associating detenteur with demande:", error);
        }
      }
      
      // Fetch and set representant legal
      try {
        const repResponse = await axios.get(`${apiURL}/api/representant-legal/${detenteurId}`);
        if (repResponse.data) {
          const rep = repResponse.data;
          setFormData(prev => ({
            ...prev,
            repLegal: {
              nom: rep.personne?.nomFR || '',
              prenom: rep.personne?.prenomFR || '',
              nom_ar: rep.personne?.nomAR || '',
              prenom_ar: rep.personne?.prenomAR || '',
              tel: rep.personne?.telephone || '',
              email: rep.personne?.email || '',
              fax: rep.personne?.fax || '',
              qualite: rep.personne?.qualification || '',
              nin: rep.personne?.num_carte_identite || '',
              taux_participation: rep.taux_participation?.toString() || '',
              id_pays: rep.personne?.id_pays || 0
            }
          }));
        }
      } catch (error) {
        console.log("No representant legal found for this detenteur");
      }
      
      // Fetch and set registre commerce
      try {
        const rcResponse = await axios.get(`${apiURL}/api/registre-commerce/${detenteurId}`);
        if (rcResponse.data) {
          const rc = rcResponse.data;
          setFormData(prev => ({
            ...prev,
            rcDetails: {
              numero_rc: rc.numero_rc || '',
              date_enregistrement: formatDate(rc.date_enregistrement),
              capital_social: rc.capital_social?.toString() || '',
              nis: rc.nis || '',
              adresse_legale: rc.adresse_legale || '',
              nif: rc.nif || '',
            }
          }));
        }
      } catch (error) {
        console.log("No registre commerce found for this detenteur");
      }
      
      // Fetch and set actionnaires
      try {
        const actionnairesResponse = await axios.get(`${apiURL}/api/actionnaires/${detenteurId}`);
        if (actionnairesResponse.data) {
          const actionnaires = actionnairesResponse.data;
          setFormData(prev => ({
            ...prev,
            actionnaires: actionnaires.map((a: any) => ({
              nom: a.personne?.nomFR || '',
              prenom: a.personne?.prenomFR || '',
              lieu_naissance: a.personne?.lieu_naissance || '',
              qualification: a.personne?.qualification || '',
              numero_carte: a.personne?.num_carte_identite || '',
              taux_participation: a.taux_participation?.toString() || '',
              id_pays: a.personne?.id_pays || 0
            }))
          }));
        }
      } catch (error) {
        console.log("No actionnaires found for this detenteur");
      }
      
      // Disable all sections since we're using existing data
      setDisabledSections({
        infos: true,
        repLegal: true,
        rcDetails: true,
        actionnaires: true,
      });
      
      setToastType('success');
      setToastMessage('Détenteur sélectionné et associé avec succés');
      
    } catch (error) {
      console.error("Error loading detenteur data:", error);
      setToastType('error');
      setToastMessage('Erreur lors du chargement des données du détenteur');
    }
  };

  // Event handlers
  const handleNext = () => {
    const tauxRep = parseFloat(formData.repLegal.taux_participation || '0');
    const tauxActionnaires = formData.actionnaires.reduce((acc, a) => acc + parseFloat(a.taux_participation || '0'), 0);
    const totalTaux = tauxRep + tauxActionnaires;

    if (totalTaux !== 100) {
      setTauxSummary({ total: totalTaux, rep: tauxRep, actionnaires: tauxActionnaires });
      setShowTauxModal(true);
      return;
    }

    if (idProc) {
      router.push(`/demande/step3/page3?id=${idProc}`)
    } else {
      alert("ID procédure manquant.");
    }
  };

  const handlePrevious = () => {
    router.push(`/demande/step1/page1?id=${idProc}`)
  };

  const handleSaveEtapeFixed = async () => {
    if (!idProc) {
      setEtapeMessage("ID procedure introuvable !");
      return;
    }

    setSavingEtape(true);
    setEtapeMessage(null);

    try {
      let etapeId = 2;

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
      setEtapeMessage("�tape 2 enregistr�e avec succ�s !");
      setRefetchTrigger(prev => prev + 1);
    } catch (err) {
      console.error(err);
      setEtapeMessage("Erreur lors de l'enregistrement de l'�tape.");
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
      await axios.post(`${apiURL}/api/procedure-etape/finish/${idProc}/2`);
      setEtapeMessage("étape 2 enregistrée avec succés !");
    } catch (err) {
      console.error(err);
      setEtapeMessage("Erreur lors de l'enregistrement de l'étape.");
    } finally {
      setSavingEtape(false);
    }
  };

  const handleInfosChange = (data: SocieteData['infos']) => {
    setFormData(prev => ({ ...prev, infos: data }));
  };

  const handleRepLegalChange = (data: SocieteData['repLegal']) => {
    setFormData(prev => ({ ...prev, repLegal: data }));
  };

  const handleRcDetailsChange = (data: SocieteData['rcDetails']) => {
    setFormData(prev => ({ ...prev, rcDetails: data }));
  };

  const handleActionnairesChange = (data: SocieteData['actionnaires']) => {
    setFormData(prev => ({ ...prev, actionnaires: data }));
  };

  const toggle = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const handleSaveSection = async (section: keyof SocieteData) => {
    setIsSaving(prev => ({ ...prev, [section]: true }));
    setToastMessage(null);

    try {
      let response;

      switch (section) {
        case 'infos':
          if (detenteurId) {
            response = await axios.put(`${apiURL}/api/detenteur-morale/${detenteurId}`, formData.infos);
          } else {
            response = await axios.post(`${apiURL}/api/detenteur-morale`, formData.infos);
            const newId = response.data?.id_detenteur;
            if (newId) {
              setDetenteurId(newId);
              if (idDemande) {
                await axios.put(`${apiURL}/api/demande/${idDemande}/link-detenteur`, {
                  id_detenteur: newId
                });
              }
            }
          }
          break;

        case 'repLegal':
          if (!detenteurId) throw new Error("Détenteur non défini !");
          if (!formData.repLegal.nin) throw new Error("NIN du représentant légal est requis");

          try {
            response = await axios.put(
              `${apiURL}/api/representant-legal/${formData.repLegal.nin}`,
              {
                ...formData.repLegal,
                id_detenteur: detenteurId,
              }
            );
          } catch (err: any) {
            if (axios.isAxiosError(err) && err.response?.status === 404) {
              response = await axios.post(
                `${apiURL}/api/representant-legal`,
                {
                  ...formData.repLegal,
                  id_detenteur: detenteurId
                }
              );
            } else {
              throw err;
            }
          }
          break;

        case 'rcDetails':
          if (!detenteurId) throw new Error("Détenteur non défini !");

          try {
            response = await axios.put(
              `${apiURL}/api/registre-commerce/${detenteurId}`,
              {
                ...formData.rcDetails,
                id_detenteur: detenteurId
              }
            );
          } catch (err: any) {
            if (axios.isAxiosError(err) && err.response?.status === 404) {
              response = await axios.post(
                `${apiURL}/api/registre-commerce`,
                {
                  ...formData.rcDetails,
                  id_detenteur: detenteurId
                }
              );
            } else {
              throw err;
            }
          }
          break;

        case 'actionnaires':
          if (!detenteurId) throw new Error("Détenteur non défini !");
          // Validate actionnaires before sending
          const invalidActionnaires = formData.actionnaires.filter(a => !a.id_pays);
          if (invalidActionnaires.length > 0) {
            console.error('Actionnaires missing country:', invalidActionnaires);
            throw new Error("Tous les actionnaires doivent avoir un pays sélectionné");
          }

          response = await axios.put(
            `${apiURL}/api/actionnaires/${detenteurId}`,
            {
              actionnaires: formData.actionnaires,
              id_detenteur: detenteurId
            }
          );
          break;
      }

      setToastType('success');
      setToastMessage(`✅ Section "${section}" enregistrée avec succés.`);
      setDisabledSections(prev => ({ ...prev, [section]: true }));
      setIsModifying(prev => ({ ...prev, [section]: false }));

    } catch (error: any) {
      console.error('=== FRONTEND: SAVE SECTION ERROR ===');
      console.error('Error details:', error);

      let message = 'Erreur inconnue';
      if (axios.isAxiosError(error)) {
        console.error('Axios error response:', error.response?.data);
        message = error.response?.data?.message || error.message;
      } else if (error.message) {
        message = error.message;
      }

      setToastType('error');
      setToastMessage(`❌ ${message}`);
    } finally {
      setIsSaving(prev => ({ ...prev, [section]: false }));
    }
  };

  const handleModifySection = (section: keyof SocieteData) => {
    setDisabledSections(prev => ({ ...prev, [section]: false }));
    setIsModifying(prev => ({ ...prev, [section]: true }));
  };

  const handleDeleteActionnaires = async () => {
    if (!detenteurId) return;

    try {
      await axios.delete(`${apiURL}/api/actionnaires/${detenteurId}`);
      setFormData(prev => ({ ...prev, actionnaires: [] }));
      setToastType('success');
      setToastMessage('Actionnaires supprimés avec succés');
    } catch (error) {
      setToastType('error');
      setToastMessage('Erreur lors de la suppression des actionnaires');
    }
  };

  // Accordion items
  const accordions: AccordionItem[] = [
    { id: 'infos', title: "Informations générales de la société", color: 'blue' },
    { id: 'repLegal', title: "Représentant légal de la société", color: 'orange' },
    { id: 'rcDetails', title: "Détails du Registre de Commerce", color: 'green' },
    { id: 'actionnaires', title: "Actionnaires de la société", color: 'purple' },
  ];

  // Show loading state until all required data is available
  if (!isPageReady) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>{loadingMessage}</p>
        {!idProc && <p>En attente de l'ID de procédure...</p>}
        {idProc && !procedureData && <p>Chargement des données de procédure...</p>}
        {procedureData && !idDemande && <p>Chargement des données de demande...</p>}
        {idDemande && (!paysOptions.length || !statutsJuridiques.length) && <p>Chargement des options...</p>}
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
            <span>Identification</span>
          </div>

          <div className={styles.demandeContainer}>
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
            <div className={styles.contentWrapper}>
              <h2 className={styles.pageTitle}>
                <span className={styles.stepNumber}>étape 2</span>
                Identification de la société
              </h2>
              <p className={styles.pageSubtitle}>
                Informations légales complétes de l'entité morale demandant le permis minier
              </p>

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
              
              <div className={styles.detenteurSearchSection}>
                <h3 className={styles.searchTitle}>Sélectionner un détenteur existant</h3>
                <div className={styles.searchContainer}>
                  <div className={styles.searchInputWrapper}>
                    <FiSearch className={styles.searchIcon} />
                    <input
                      type="text"
                      placeholder="Rechercher un détenteur par nom..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowDetenteurDropdown(true);
                      }}
                      onFocus={() => setShowDetenteurDropdown(true)}
                      className={styles.searchInput}
                    />
                    {isSearching && <FiLoader className={styles.searchSpinner} />}
                  </div>
                  
                  {showDetenteurDropdown && detenteurOptions.length > 0 && (
                    <div className={styles.dropdown}>
                      {detenteurOptions.map(detenteur => (
                        <div
                          key={detenteur.id_detenteur}
                          className={styles.dropdownItem}
                          onClick={() => handleDetenteurSelect(detenteur.id_detenteur)}
                        >
                          <div className={styles.detenteurName}>{detenteur.nom_societeFR}</div>
                          <div className={styles.detenteurDetails}>
                            {detenteur.nom_societeAR && <span>{detenteur.nom_societeAR}</span>}
                            {detenteur.telephone && <span>Tél: {detenteur.telephone}</span>}
                            {detenteur.email && <span>Email: {detenteur.email}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {showDetenteurDropdown && searchQuery.length >= 2 && detenteurOptions.length === 0 && !isSearching && (
                    <div className={styles.dropdown}>
                      <div className={styles.noResults}>Aucun détenteur trouvé</div>
                    </div>
                  )}
                </div>
              </div>
              
              {detenteurId && (
                <button
                  className={styles.clearButton}
                  onClick={() => {
                    setSearchQuery('');
                    setDetenteurId(null);
                    setFormData(initialData);
                    setDisabledSections({
                      infos: false,
                      repLegal: false,
                      rcDetails: false,
                      actionnaires: false,
                    });
                  }}
                >
                  <FiX /> Effacer la sélection
                </button>
              )}

              {accordions.map(({ id, title, color }) => (
                <div
                  className={`${styles.accordion} ${openSection === id ? styles.active : ''}`}
                  key={id}
                >
                  <div
                    className={`${styles.accordionHeader} ${styles[color]}`}
                    onClick={() => toggle(id)}
                  >
                    <span>{title}</span>
                    <span className={styles.accordionIcon}>{openSection === id ? '▲' : '▼'}</span>
                  </div>

                  {openSection === id && (
                    <div className={styles.accordionBody}>
                      {id === 'infos' && (
                        <>
                          <InfosGenerales
                            data={formData.infos}
                            onChange={handleInfosChange}
                            statutsJuridiques={statutsJuridiques}
                            paysOptions={paysOptions}
                            disabled={disabledSections.infos && !isModifying.infos}
                          />
                          <div className={styles.sectionButtons}>
                            {(!disabledSections.infos || isModifying.infos) ? (
                              <button
                                className={styles.btnSave}
                                onClick={() => handleSaveSection('infos')}
                                disabled={isSaving.infos || statutProc === 'TERMINEE' || !statutProc}
                              >
                                {isSaving.infos ? (
                                  <>
                                    <FiLoader className={styles.spinner} /> Sauvegarde...
                                  </>
                                ) : (
                                  <>
                                    <BsSave /> Sauvegarder
                                  </>
                                )}
                              </button>
                            ) : (
                              <button
                                className={styles.btnModify}
                                disabled={statutProc === 'TERMINEE' || !statutProc}
                                onClick={() => handleModifySection('infos')}
                              >
                                <FiEdit /> Modifier
                              </button>
                            )}
                          </div>
                        </>
                      )}

                      {id === 'repLegal' && (
                        <>
                          <RepresentantLegal
                            data={formData.repLegal}
                            onChange={handleRepLegalChange}
                            paysOptions={paysOptions}
                            disabled={disabledSections.repLegal && !isModifying.repLegal}
                          />
                          <div className={styles.sectionButtons}>
                            {(!disabledSections.repLegal || isModifying.repLegal) ? (
                              <button
                                className={styles.btnSave}
                                onClick={() => handleSaveSection('repLegal')}
                                disabled={isSaving.repLegal || statutProc === 'TERMINEE' || !statutProc}
                              >
                                {isSaving.repLegal ? (
                                  <>
                                    <FiLoader className={styles.spinner} /> Sauvegarde...
                                  </>
                                ) : (
                                  <>
                                    <BsSave /> Sauvegarder
                                  </>
                                )}
                              </button>
                            ) : (
                              <button
                                className={styles.btnModify}
                                disabled={statutProc === 'TERMINEE' || !statutProc}
                                onClick={() => handleModifySection('repLegal')}
                              >
                                <FiEdit /> Modifier
                              </button>
                            )}
                          </div>
                        </>
                      )}

                      {id === 'rcDetails' && (
                        <>
                          <DetailsRC
                            data={formData.rcDetails}
                            onChange={handleRcDetailsChange}
                            disabled={disabledSections.rcDetails && !isModifying.rcDetails}
                          />
                          <div className={styles.sectionButtons}>
                            {(!disabledSections.rcDetails || isModifying.rcDetails) ? (
                              <button
                                className={styles.btnSave}
                                onClick={() => handleSaveSection('rcDetails')}
                                disabled={isSaving.rcDetails || statutProc === 'TERMINEE' || !statutProc}
                              >
                                {isSaving.rcDetails ? (
                                  <>
                                    <FiLoader className={styles.spinner} /> Sauvegarde...
                                  </>
                                ) : (
                                  <>
                                    <BsSave /> Sauvegarder
                                  </>
                                )}
                              </button>
                            ) : (
                              <button
                                className={styles.btnModify}
                                disabled={statutProc === 'TERMINEE' || !statutProc}
                                onClick={() => handleModifySection('rcDetails')}
                              >
                                <FiEdit /> Modifier
                              </button>
                            )}
                          </div>
                        </>
                      )}

                      {id === 'actionnaires' && (
                        <>
                          <Actionnaires
                            data={formData.actionnaires}
                            onChange={handleActionnairesChange}
                            paysOptions={paysOptions}
                            disabled={disabledSections.actionnaires && !isModifying.actionnaires}
                          />
                          <div className={styles.sectionButtons}>
                            {formData.actionnaires.length > 0 && (
                              <>
                                {(!disabledSections.actionnaires || isModifying.actionnaires) ? (
                                  <button
                                    className={styles.btnSave}
                                    onClick={() => handleSaveSection('actionnaires')}
                                    disabled={isSaving.actionnaires || statutProc === 'TERMINEE' || !statutProc}
                                  >
                                    {isSaving.actionnaires ? (
                                      <>
                                        <FiLoader className={styles.spinner} /> Sauvegarde...
                                      </>
                                    ) : (
                                      <>
                                        <BsSave /> Sauvegarder
                                      </>
                                    )}
                                  </button>
                                ) : (
                                  <button
                                    className={styles.btnModify}
                                    disabled={statutProc === 'TERMINEE' || !statutProc}
                                    onClick={() => handleModifySection('actionnaires')}
                                  >
                                    <FiEdit /> Modifier
                                  </button>
                                )}

                                <button
                                  className={styles.btnDelete}
                                  disabled={statutProc === 'TERMINEE' || !statutProc}
                                  onClick={handleDeleteActionnaires}
                                  style={{ marginLeft: '10px', backgroundColor: '#dc3545', color: '#fff' }}
                                >
                                  <FiX /> Supprimer les actionnaires
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}

              <div className={styles.stepButtons}>
                <button className={styles.btnPrevious} onClick={handlePrevious}>
                  <FiChevronLeft className={styles.btnIcon} /> Précédente
                </button>

                <button
                  className={styles.btnSave}
                  onClick={handleSaveEtapeFixed}
                  disabled={savingEtape || statutProc === 'TERMINEE' || !statutProc}
                >
                  <BsSave className={styles.btnIcon} /> {savingEtape ? "Sauvegarde en cours..." : "Sauvegarder l'étape"}
                </button>
                <button className={styles.btnNext} onClick={handleNext}>
                  Suivante <FiChevronRight className={styles.btnIcon} />
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

          {toastMessage && (
            <div className={`${styles.toast} ${toastType === 'success' ? styles.toastSuccess : styles.toastError}`}>
              {toastMessage}
              <button onClick={() => setToastMessage(null)} className={styles.toastClose}>×</button>
            </div>
          )}

          {showTauxModal && (
            <TauxWarningModal
              total={tauxSummary.total}
              tauxRep={tauxSummary.rep}
              tauxActionnaires={tauxSummary.actionnaires}
              onClose={() => setShowTauxModal(false)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
