'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from '@/src/hooks/useSearchParams';
import axios from 'axios';
import {
  FiChevronLeft, FiChevronRight, FiMapPin, FiFileText, FiX,
  FiMap, FiGlobe, FiHash, FiEdit2, FiSearch,
  FiSave,
  FiRefreshCw,
  FiUpload
} from 'react-icons/fi';
import styles from '../../demande/step4/substances.module.css';
import Navbar from '../../navbar/Navbar';
import Sidebar from '../../sidebar/Sidebar';
import * as turf from '@turf/turf';
import { BsSave } from 'react-icons/bs';
import ConfirmReplaceModal from './ConfirmReplaceModal';
import SummaryModal from "../../demande/popup/page6_popup";
import ProgressStepper from '../../../components/ProgressStepper';
import { STEP_LABELS } from '../../../src/constants/steps';
import { useViewNavigator } from '../../../src/hooks/useViewNavigator';
import { toast } from 'react-toastify';
import { useActivateEtape } from '@/src/hooks/useActivateEtape';
import router from 'next/router';
import { Phase, Procedure, ProcedureEtape, ProcedurePhase, StatutProcedure } from '@/src/types/procedure';
import { CoordinateConverter } from '@/utils/coordinateConverter';
import proj4 from 'proj4';
import * as RW from 'react-window';
import * as XLSX from 'xlsx';


// Types
type CoordinateSystem = 'WGS84' | 'UTM' | 'LAMBERT' | 'MERCATOR';

type ImportedPoint = {
  id: string;
  x: string;
  y: string;
  z: string;
  system: CoordinateSystem;
  zone?: number;
  hemisphere?: 'N';
};

type Point = {
  id: string;
  x: string;
  y: string;
  z: string;
  system: CoordinateSystem;
  zone?: number;
  hemisphere?: 'N';
};

type CoordinateConversion = {
  from: CoordinateSystem;
  to: CoordinateSystem;
  zone?: number;
  hemisphere?: 'N';
};

type SubstanceWithPriority = {
  id_sub: number;
  nom_subFR: string;
  categorie_sub: string;
  priorite: 'principale' | 'secondaire';
};

type Wilaya = {
  id_wilaya: number;
  id_antenne: number;
  code_wilaya: string;
  nom_wilayaFR: string;
};

type Daira = {
  id_daira: number;
  id_wilaya: number;
  code_daira: string;
  nom_dairaFR: string;
};

type Commune = {
  id_commune: number;
  id_daira: number;
  code_commune: string;
  nom_communeFR: string;
};

export default function Step4_Substances() {
  const searchParams = useSearchParams();
  const [idDemande, setIdDemande] = useState<number | null>(null);
  const [codeDemande, setCodeDemande] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentStep] = useState(4);
  const [activatedSteps, setActivatedSteps] = useState<Set<number>>(new Set());
  const [isPageReady, setIsPageReady] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Chargement des paramétres...');

  // Site Information State
  const [points, setPoints] = useState<Point[]>([]);
  const [polygonArea, setPolygonArea] = useState<number | null>(null);
  const [wilaya, setWilaya] = useState('');
  const [commune, setCommune] = useState('');
  const [daira, setDaira] = useState('');
  const [lieuDitFr, setLieuDitFr] = useState('');
  const [lieuDitAr, setLieuDitAr] = useState('');
  const [statutJuridique, setStatutJuridique] = useState('');
  const [occupantLegal, setOccupantLegal] = useState('');
  const [superficie, setSuperficie] = useState('');
  const [travaux, setTravaux] = useState('');
  const [dureeTravaux, setDureeTravaux] = useState('');
  const [dateDebutPrevue, setDateDebutPrevue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Substances State
  const [allSubstances, setAllSubstances] = useState<SubstanceWithPriority[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [famille, setFamille] = useState('');
  const [savingEtape, setSavingEtape] = useState(false);
  const [etapeMessage, setEtapeMessage] = useState<string | null>(null);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [superficiermax, setSuperficiermax] = useState(0);

  // Administrative divisions state
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [dairas, setDairas] = useState<Daira[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [selectedWilaya, setSelectedWilaya] = useState<string>('');
  const [selectedDaira, setSelectedDaira] = useState<string>('');
  const [selectedCommune, setSelectedCommune] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<'principale' | 'secondaire'>('secondaire');
  const [selectedSubstances, setSelectedSubstances] = useState<SubstanceWithPriority[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [existingCoords, setExistingCoords] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [statutProc, setStatutProc] = useState<string | undefined>(undefined);

  // Coordinate system state
  const [coordinateSystem, setCoordinateSystem] = useState<CoordinateSystem>('UTM');
  const [utmZone, setUtmZone] = useState<number>(31);
  const [utmHemisphere, setUtmHemisphere] = useState<'N'>('N');
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [coordinateErrors, setCoordinateErrors] = useState<{ [key: string]: string }>({});

  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const [procedureData, setProcedureData] = useState<Procedure | null>(null);
  const [currentEtape, setCurrentEtape] = useState<{ id_etape: number } | null>(null);
  const [procedureTypeId, setProcedureTypeId] = useState<number | undefined>();
  const [hasActivatedStep4, setHasActivatedStep4] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { currentView, navigateTo } = useViewNavigator("nouvelle-demande");

const [idProc, setIdProc] = useState<number | undefined>(undefined);

const filteredSubstances = useMemo(() => {
    return allSubstances.filter((s) => {
      const matchesFamille = famille ? s.categorie_sub === famille : true;
      const matchesSearch = s.nom_subFR.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFamille && matchesSearch;
    });
  }, [allSubstances, famille, searchTerm]);

  
const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const sub = filteredSubstances[index];
    return (
      <li key={sub.id_sub} style={style} className={styles['substance-item']}>
        <label className={styles['substance-label']}>
          <input
            disabled={statutProc === 'TERMINEE'}
            type="checkbox"
            className={styles['substance-checkbox']}
            checked={isChecked(sub.id_sub)}
            onChange={() => handleSelect(sub)}
          />
          <span className={styles['custom-checkbox']} />
          <span className={styles['substance-name']}>{sub.nom_subFR}</span>
          <span className={styles['substance-category']}>{sub.categorie_sub}</span>
        </label>
      </li>
    );
  };


// Get idProc from URL parameters and store it in state
useEffect(() => {
  const idProcStr = searchParams?.get('id');
  if (!idProcStr) {
    setError('ID de procédure non trouvé dans les paramétres');
    setLoadingMessage('ID de procédure non trouvé dans les paramétres');
    return;
  }

  const parsedId = parseInt(idProcStr, 10);
  if (isNaN(parsedId)) {
    setError('ID de procédure invalide');
    setLoadingMessage('ID de procédure invalide');
    return;
  }

  setIdProc(parsedId);
}, [searchParams]);

// Check for required data every millisecond
useEffect(() => {
  const checkInterval = setInterval(() => {
    if (idProc && procedureData && idDemande) {
      setIsPageReady(true);
      setIsLoading(false);
      clearInterval(checkInterval);
    } else {
      if (!idProc) {
        setLoadingMessage("En attente de l'ID de procédure...");
      } else if (!procedureData) {
        setLoadingMessage('Chargement des données de procédure...');
      } else if (!idDemande) {
        setLoadingMessage('Chargement des données de demande...');
      }
    }
  }, 1); // Check every millisecond

  return () => clearInterval(checkInterval);
}, [idProc, procedureData, idDemande]);

// Fetch all required data when idProc is available
useEffect(() => {
  if (!idProc) return;

  const fetchAllData = async () => {
    try {
      setLoadingMessage('Chargement des données de procédure...');

      // Fetch procedure data
      const procedureRes = await axios.get<Procedure>(
        `${apiURL}/api/procedure-etape/procedure/${idProc}`
      );
      setProcedureData(procedureRes.data);

      if (procedureRes.data.demandes && procedureRes.data.demandes.length > 0) {
        setProcedureTypeId(procedureRes.data.demandes[0].typeProcedure?.id);
        setIdDemande(procedureRes.data.demandes[0].id_demande);
        setCodeDemande(procedureRes.data.demandes[0].code_demande);
        setStatutProc(procedureRes.data.statut_proc);
        setSuperficiermax(procedureRes.data.demandes[0].typePermis?.superficie_max || 0);

        // Set demande-related fields
        const demande = procedureRes.data.demandes[0];
        setWilaya(demande.wilaya?.nom_wilayaFR || '');
        setDaira(demande.daira?.nom_dairaFR || '');
        setCommune(demande.commune?.nom_communeFR || '');
        setSelectedWilaya(demande.id_wilaya?.toString() || '');
        setSelectedDaira(demande.id_daira?.toString() || '');
        setSelectedCommune(demande.id_commune?.toString() || '');
        setLieuDitFr(demande.lieu_ditFR || '');
        setLieuDitAr(demande.lieu_ditAR || '');
        setStatutJuridique(demande.statut_juridique_terrain || '');
        setOccupantLegal(demande.occupant_terrain_legal || '');
        setSuperficie(demande.superficie?.toString() || '');
        setTravaux(demande.description_travaux || '');
        setDureeTravaux(demande.duree_travaux_estimee?.toString() || '');
        setDateDebutPrevue(demande.date_demarrage_prevue?.split('T')[0] || '');
      }

      const activeEtape = procedureRes.data.ProcedureEtape.find(
        (pe: ProcedureEtape) => pe.statut === 'EN_COURS'
      );
      if (activeEtape) {
        setCurrentEtape({ id_etape: activeEtape.id_etape });
      }

      // Fetch wilayas
      setLoadingMessage('Chargement des wilayas...');
      const wilayasRes = await axios.get(`${apiURL}/api/wilayas`);
      setWilayas(wilayasRes.data);

      // Fetch coordinates
      setLoadingMessage('Chargement des coordonnées...');
      const coordsRes = await axios.get(`${apiURL}/coordinates/procedure/${idProc}`);
      const coords = coordsRes.data.filter(
        (c: any) => c?.coordonnee?.x && c?.coordonnee?.y
      );
      setPoints(
        coords.map((c: any) => ({
          id: generateId(),
          x: c.coordonnee.x.toString(),
          y: c.coordonnee.y.toString(),
          z: c.coordonnee.z?.toString() || '0',
          system: c.coordonnee.system || 'WGS84',
          zone: c.coordonnee.zone,
          hemisphere: c.coordonnee.hemisphere,
        }))
      );

      // Set coordinate system from first point if available
      if (coords.length > 0 && coords[0].coordonnee.system) {
        setCoordinateSystem(coords[0].coordonnee.system);
        setUtmZone(coords[0].coordonnee.zone || 31);
        setUtmHemisphere(coords[0].coordonnee.hemisphere || 'N');
      }

      // Fetch substances
      setLoadingMessage('Chargement des substances...');
      const substancesRes = await axios.get(
        `${apiURL}/api/substances/demande/${procedureRes.data.demandes[0].id_demande}`
      );
      const substancesWithPriority = substancesRes.data.map((item: any) => ({
        id_sub: item.id_sub,
        nom_subFR: item.nom_subFR,
        categorie_sub: item.categorie_sub,
        priorite: item.priorite || 'secondaire',
      }));
      setSelectedSubstances(substancesWithPriority);
      setSelectedIds(substancesWithPriority.map((item: any) => item.id_sub));

      setLoadingMessage('Données chargées avec succés');
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Erreur lors du chargement des données');
      setLoadingMessage('Erreur lors du chargement des données');
    }
  };

  fetchAllData();
}, [idProc, apiURL]);


  // Fetch dairas when wilaya changes
  useEffect(() => {
    if (!selectedWilaya) {
      setDairas([]);
      setSelectedDaira('');
      setCommunes([]);
      setSelectedCommune('');
      return;
    }

    const fetchDairas = async () => {
      try {
        const res = await axios.get(`${apiURL}/api/wilayas/${selectedWilaya}/dairas`);
        setDairas(res.data);
      } catch (err) {
        console.error('Erreur lors du chargement des dairas:', err);
        setError('Erreur lors du chargement des dairas');
      }
    };

    fetchDairas();
  }, [selectedWilaya, apiURL]);

  // Fetch communes when daira changes
  useEffect(() => {
    if (!selectedDaira) {
      setCommunes([]);
      setSelectedCommune('');
      return;
    }

    const fetchCommunes = async () => {
      try {
        const res = await axios.get(`${apiURL}/api/dairas/${selectedDaira}/communes`);
        setCommunes(res.data);
      } catch (err) {
        console.error('Erreur lors du chargement des communes:', err);
        setError('Erreur lors du chargement des communes');
      }
    };

    fetchCommunes();
  }, [selectedDaira, apiURL]);

  // Activate Step 4 if needed
  useActivateEtape({
    idProc,
    etapeNum: 4,
    shouldActivate: currentStep === 4 && !activatedSteps.has(4) && isPageReady,
    onActivationSuccess: () => {
      setActivatedSteps((prev) => new Set(prev).add(4));
      if (procedureData) {
        const updatedData = { ...procedureData };
        if (updatedData.ProcedureEtape) {
          const stepToUpdate = updatedData.ProcedureEtape.find((pe) => pe.id_etape === 4);
          if (stepToUpdate) {
            stepToUpdate.statut = 'EN_COURS' as StatutProcedure;
          }
          setCurrentEtape({ id_etape: 4 });
        }
        if (updatedData.ProcedurePhase) {
          const phaseContainingStep4 = updatedData.ProcedurePhase.find((pp) =>
            pp.phase?.etapes?.some((etape) => etape.id_etape === 4)
          );
          if (phaseContainingStep4) {
            phaseContainingStep4.statut = 'EN_COURS' as StatutProcedure;
          }
        }
        setProcedureData(updatedData);
        setHasActivatedStep4(true);
      }
    },
  });

  // Fetch substances when famille or idDemande changes
  useEffect(() => {
    if (!idDemande) return;
    const fetchSubstances = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${apiURL}/api/substances`, { params: { famille } });
        setAllSubstances(res.data);
      } catch (err) {
        console.error('Erreur lors du chargement des substances:', err);
        setError('Erreur lors du chargement des substances');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubstances();
  }, [idDemande, famille, apiURL]);

  const phases: Phase[] = procedureData?.ProcedurePhase
    ? procedureData.ProcedurePhase.map((pp: ProcedurePhase) => pp.phase).sort(
        (a: Phase, b: Phase) => a.ordre - b.ordre
      )
    : [];

  const generateId = () => Math.random().toString(36).substring(2, 9);

  // Coordinate validation and conversion
  const validateCoordinate = (value: string, field: 'x' | 'y', system: CoordinateSystem): boolean => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return false;

    try {
      switch (system) {
        case 'WGS84':
          return CoordinateConverter.validateWGS84(field === 'x' ? numValue : 0, field === 'y' ? numValue : 0);
        case 'UTM':
          if (field === 'x') return numValue >= 100000 && numValue <= 999999;
          if (field === 'y') return numValue >= 0 && numValue <= 10000000;
          return true;
        default:
          return true;
      }
    } catch (error) {
      console.error('Erreur de validation des coordonnées:', error);
      return false;
    }
  };

  const convertCoordinate = (point: Point, conversion: CoordinateConversion): Point => {
    const { from, to, zone, hemisphere } = conversion;
    if (from === to) return point;

    const numericPoint = {
      x: parseFloat(point.x),
      y: parseFloat(point.y),
      z: parseFloat(point.z),
      system: from,
      zone: point.zone,
      hemisphere: point.hemisphere,
    };

    try {
      const converted = CoordinateConverter.convertCoordinate(numericPoint, to, zone || point.zone, hemisphere || point.hemisphere);
      return {
        ...point,
        x: converted.x.toString(),
        y: converted.y.toString(),
        system: to,
        zone: converted.zone,
        hemisphere: converted.hemisphere,
      };
    } catch (error) {
      console.error('échec de la conversion des coordonnées:', error);
      toast.error('Erreur de conversion des coordonnées');
      return point;
    }
  };

  const convertAllCoordinates = (conversion: CoordinateConversion) => {
    const convertedPoints = points.map((point) => convertCoordinate(point, conversion));
    setPoints(convertedPoints);
    setCoordinateSystem(conversion.to);
    if (conversion.to === 'UTM') {
      setUtmZone(conversion.zone || utmZone);
      setUtmHemisphere(conversion.hemisphere || utmHemisphere);
    }
    toast.success(`Coordonnées converties en ${conversion.to}`);
  };

  const submitCoordinates = async (statutCoord: 'DEMANDE_INITIALE' = 'DEMANDE_INITIALE') => {
    if (!idProc) {
      toast.error('ID de procédure introuvable');
      return;
    }

    setIsSaving(true);
    const payload = {
      id_proc: idProc,
      id_zone_interdite: null,
      points: points.map((p) => ({
        x: parseFloat(p.x),
        y: parseFloat(p.y),
        z: parseFloat(p.z),
        system: p.system,
        zone: p.zone,
        hemisphere: p.hemisphere,
      })),
      statut_coord: statutCoord,
    };

    try {
      const res = await fetch(`${apiURL}/coordinates/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Erreur lors de la mise à jour');
      toast.success('✅ Coordonnées enregistrées avec succés');
    } catch (err) {
      console.error('Erreur lors de l’enregistrement des coordonnées:', err);
      toast.error('❌ Erreur lors de l’enregistrement des coordonnées');
    } finally {
      setIsSaving(false);
      setShowModal(false);
    }
  };

  const saveCoordinatesToBackend = async () => {
    if (!idProc) {
      toast.error('ID de procédure introuvable');
      return;
    }

    const errors: { [key: string]: string } = {};
    points.forEach((point, index) => {
      if (!validateCoordinate(point.x, 'x', coordinateSystem)) {
        errors[`x-${index}`] = `Coordonnée X invalide pour le point ${index + 1}`;
      }
      if (!validateCoordinate(point.y, 'y', coordinateSystem)) {
        errors[`y-${index}`] = `Coordonnée Y invalide pour le point ${index + 1}`;
      }
    });

    if (Object.keys(errors).length > 0) {
      setCoordinateErrors(errors);
      toast.error('Veuillez corriger les erreurs de coordonnées');
      return;
    }

    setCoordinateErrors({});
    if (polygonArea !== null && polygonArea / 10000 > superficiermax) {
      toast.warning(`⚠ï¸ La superficie calculée (${(polygonArea / 10000).toFixed(2)} Ha) dépasse la limite autorisée (${superficiermax} Ha)`);
      return;
    }

    const newPoints = points.map((p) => ({
      x: parseFloat(p.x),
      y: parseFloat(p.y),
      z: parseFloat(p.z),
    }));

    try {
      const existingRes = await fetch(`${apiURL}/coordinates/procedure/${idProc}`);
      if (!existingRes.ok) throw new Error('Erreur lors de la récupération des coordonnées existantes');

      const existing = await existingRes.json();
      const existingPoints = existing.map((pc: any) => ({
        x: parseFloat(pc.coordonnee.x),
        y: parseFloat(pc.coordonnee.y),
        z: parseFloat(pc.coordonnee.z),
      }));

      setExistingCoords(existingPoints);
      const areEqual = newPoints.length === existingPoints.length &&
        newPoints.every((np, index) => {
          const ep = existingPoints[index];
          return Math.abs(np.x - ep.x) < 0.00001 && Math.abs(np.y - ep.y) < 0.00001 && Math.abs(np.z - ep.z) < 0.00001;
        });

      if (areEqual) {
        toast.info('✅ Coordonnées identiques déjà enregistrées');
        return;
      }

      if (existingPoints.length > 0) {
        setShowModal(true);
      } else {
        await submitCoordinates();
      }
    } catch (error) {
      console.error('Erreur de vérification des coordonnées existantes:', error);
      toast.error('Erreur de vérification des coordonnées existantes');
    }
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      let importedPoints: ImportedPoint[] = [];
      if (file.name.endsWith('.csv')) {
        importedPoints = await importCSV(file);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        importedPoints = await importExcel(file);
      } else {
        toast.error('Format de fichier non supporté. Veuillez utiliser CSV ou Excel.');
        return;
      }

      if (importedPoints.length > 0) {
        setPoints(importedPoints);
        setCoordinateErrors({});
        toast.success(`${importedPoints.length} points importés avec succés!`);
      } else {
        toast.error('Aucune donnée valide trouvée dans le fichier.');
      }
    } catch (error) {
      console.error('Erreur lors de l’importation:', error);
      toast.error('Erreur lors de l’importation du fichier.');
    } finally {
      event.target.value = '';
    }
  };

  const importCSV = (file: File): Promise<ImportedPoint[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result;
          if (typeof content !== 'string') {
            reject(new Error('Le contenu du fichier est invalide'));
            return;
          }

          const lines = content.split('\n');
          const points: ImportedPoint[] = [];
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const values = line.split(',').map((v) => v.trim().replace(/"/g, ''));
            if (values.length >= 5) {
              const point: ImportedPoint = {
                id: values[0] || `point-${i}`,
                x: values[1],
                y: values[2],
                z: values[3] || '0',
                system: values[4] as CoordinateSystem,
                zone: values[5] ? parseInt(values[5]) : undefined,
                hemisphere: values[6] as 'N' | undefined,
              };
              if (point.x && point.y) points.push(point);
            }
          }
          resolve(points);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };

  const importExcel = async (file: File): Promise<ImportedPoint[]> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const points: ImportedPoint[] = [];
      for (let i = 1; i < data.length; i++) {
        const row = data[i] as any[];
        if (!row || row.length < 5) continue;

        const point: ImportedPoint = {
          id: row[0] || `point-${i}`,
          x: String(row[1]),
          y: String(row[2]),
          z: String(row[3] || '0'),
          system: row[4] as CoordinateSystem,
          zone: row[5] ? parseInt(row[5] as string) : undefined,
          hemisphere: row[6] as 'N' | undefined,
        };
        if (point.x && point.y) points.push(point);
      }
      return points;
    } catch (error) {
      console.error('Erreur lors de la lecture du fichier Excel:', error);
      throw error;
    }
  };

  proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');
  proj4.defs('EPSG:30591', '+proj=lcc +lat_1=36.76666666666667 +lat_2=37.25 +lat_0=36.5 +lon_0=2.5 +x_0=500000 +y_0=300000 +ellps=clrk80ign +units=m +no_defs');
  proj4.defs('EPSG:30592', '+proj=lcc +lat_1=32.5 +lat_2=35.16666666666666 +lat_0=33.3 +lon_0=2.7 +x_0=500000 +y_0=300000 +ellps=clrk80ign +units=m +no_defs');

  const handleSelect = async (sub: SubstanceWithPriority) => {
    if (!idDemande) {
      toast.error('ID de demande introuvable');
      return;
    }

    setIsLoading(true);
    const isSelected = selectedIds.includes(sub.id_sub);

    try {
      if (isSelected) {
        await axios.delete(`${apiURL}/api/substances/demande/${idDemande}/${sub.id_sub}`);
        setSelectedSubstances((prev) => prev.filter((s) => s.id_sub !== sub.id_sub));
        setSelectedIds((prev) => prev.filter((id) => id !== sub.id_sub));
      } else {
        const response = await axios.post(`${apiURL}/api/substances/demande/${idDemande}`, {
          id_substance: sub.id_sub,
          priorite: selectedPriority,
        });
        const newSubstance: SubstanceWithPriority = {
          id_sub: sub.id_sub,
          nom_subFR: sub.nom_subFR,
          categorie_sub: sub.categorie_sub,
          priorite: selectedPriority,
        };
        setSelectedSubstances((prev) => [...prev, newSubstance]);
        setSelectedIds((prev) => [...prev, sub.id_sub]);
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la sélection:', err);
      toast.error('Erreur lors de la mise à jour de la sélection');
    } finally {
      setIsLoading(false);
    }
  };

  const changePriority = async (id_sub: number, newPriority: 'principale' | 'secondaire') => {
    if (!idDemande) {
      toast.error('ID de demande introuvable');
      return;
    }

    try {
      await axios.delete(`${apiURL}/api/substances/demande/${idDemande}/${id_sub}`);
      await axios.post(`${apiURL}/api/substances/demande/${idDemande}`, {
        id_substance: id_sub,
        priorite: newPriority,
      });
      setSelectedSubstances((prev) =>
        prev.map((sub) => (sub.id_sub === id_sub ? { ...sub, priorite: newPriority } : sub))
      );
    } catch (err) {
      console.error('Erreur lors du changement de priorité:', err);
      toast.error('Erreur lors du changement de priorité');
    }
  };

  useEffect(() => {
    if (points.length >= 3 && points.every((coord) => coord.x && coord.y)) {
      try {
        let area: number;
        if (coordinateSystem === 'UTM') {
          const numericPoints = points.map((p) => ({
            x: parseFloat(p.x),
            y: parseFloat(p.y),
            z: parseFloat(p.z),
            system: p.system as CoordinateSystem,
            zone: p.zone,
            hemisphere: p.hemisphere,
          }));
          area = CoordinateConverter.calculateUTMArea(numericPoints);
        } else {
          let pointsForCalculation = points.map((point) => {
            const numericPoint = {
              x: parseFloat(point.x),
              y: parseFloat(point.y),
              z: parseFloat(point.z),
              system: point.system as CoordinateSystem,
              zone: point.zone,
              hemisphere: point.hemisphere,
            };
            if (point.system !== 'WGS84') {
              return CoordinateConverter.convertCoordinate(numericPoint, 'WGS84');
            }
            return numericPoint;
          });

          const polygon = turf.polygon([[
            ...pointsForCalculation.map((coord) => [coord.x, coord.y]),
            [pointsForCalculation[0].x, pointsForCalculation[0].y],
          ]]);
          area = turf.area(polygon);
        }
        setPolygonArea(area);
        setSuperficie((area / 10000).toFixed(2));
      } catch (err) {
        console.error('Erreur lors du calcul de la superficie:', err);
        setPolygonArea(null);
      }
    } else {
      setPolygonArea(null);
    }
  }, [points, coordinateSystem]);

  const isChecked = (id: number) => selectedIds.includes(id);

  const addPoint = useCallback(() => {
    const newPoint = {
      id: generateId(),
      x: '',
      y: '',
      z: '0',
      system: coordinateSystem,
      zone: coordinateSystem === 'UTM' ? utmZone : undefined,
      hemisphere: coordinateSystem === 'UTM' ? utmHemisphere : undefined,
    };
    setPoints((prev) => [...prev, newPoint]);
    return newPoint;
  }, [coordinateSystem, utmZone, utmHemisphere]);

  const removeCoordinateRow = (index: number) => {
    const newCoords = [...points];
    newCoords.splice(index, 1);
    setPoints(newCoords);
    const newErrors = { ...coordinateErrors };
    Object.keys(newErrors).forEach((key) => {
      if (key.includes(`-${index}`)) delete newErrors[key];
    });
    setCoordinateErrors(newErrors);
  };

  const handleCoordinateChange = (index: number, field: keyof Point, value: string) => {
    if (field === 'x' || field === 'y') {
      if (!validateCoordinate(value, field, coordinateSystem)) {
        setCoordinateErrors((prev) => ({
          ...prev,
          [`${field}-${index}`]: `Coordonnée ${field.toUpperCase()} invalide pour le systéme ${coordinateSystem}`,
        }));
      } else {
        const newErrors = { ...coordinateErrors };
        delete newErrors[`${field}-${index}`];
        setCoordinateErrors(newErrors);
      }
    }

    const newCoords = [...points];
    (newCoords[index][field] as any) = value;
    setPoints(newCoords);
  };

  const handleSaveEtape = async () => {
    if (!idProc) {
      setEtapeMessage('ID de procédure introuvable !');
      return;
    }

    setSavingEtape(true);
    setEtapeMessage(null);

    try {
      await axios.post(`${apiURL}/api/procedure-etape/finish/${idProc}/4`);
      setEtapeMessage('étape 4 enregistrée avec succés !');
    } catch (err) {
      console.error('Erreur lors de l’enregistrement de l’étape:', err);
      setEtapeMessage('Erreur lors de l’enregistrement de l’étape.');
    } finally {
      setSavingEtape(false);
    }
  };

  const handleNext = async () => {
    if (!idProc || !idDemande) {
      toast.error('ID de procédure ou de demande introuvable');
      return;
    }

    if (!selectedWilaya || !superficie) {
      toast.error('Veuillez remplir tous les champs obligatoires (Wilaya, Superficie)');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const selectedWilayaObj = wilayas.find((w) => w.id_wilaya.toString() === selectedWilaya);
      const selectedDairaObj = dairas.find((d) => d.id_daira.toString() === selectedDaira);
      const selectedCommuneObj = communes.find((c) => c.id_commune.toString() === selectedCommune);

      const demandeData = {
        id_wilaya: selectedWilayaObj ? selectedWilayaObj.id_wilaya : null,
        id_daira: selectedDairaObj ? selectedDairaObj.id_daira : null,
        id_commune: selectedCommuneObj ? selectedCommuneObj.id_commune : null,
        lieu_ditFR: lieuDitFr,
        lieu_ditAR: lieuDitAr,
        superficie: parseFloat(superficie) || null,
        statut_juridique_terrain: statutJuridique,
        occupant_terrain_legal: occupantLegal,
        description_travaux: travaux,
        duree_travaux_estimee: dureeTravaux,
      };

      await axios.put(`${apiURL}/demandes/${idDemande}`, demandeData);
      const res = await axios.get(`${apiURL}/api/demande/${idDemande}/summary`);
      setSummaryData(res.data);
      setShowModal(true);
      setSuccess('Données enregistrées avec succés !');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de l’étape:', err);
      toast.error('Erreur lors de la sauvegarde de l’étape');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (!idProc) {
      toast.error('ID de procédure introuvable');
      return;
    }
    router.push(`/demande/step3/page3?id=${idProc}`)
  };

  // Helper components
  const UTMSettings = () => (
    <div className={styles['utm-settings']}>
      <div className={styles['form-group']}>
        <label className={styles['form-label']}>Zone UTM</label>
        <select
          value={utmZone}
          onChange={(e) => setUtmZone(parseInt(e.target.value))}
          className={styles['form-select']}
          disabled={statutProc === 'TERMINEE'}
        >
          {Array.from({ length: 4 }, (_, i) => i + 29).map((zone) => (
            <option key={zone} value={zone}>{zone}</option>
          ))}
        </select>
      </div>
      <div className={styles['form-group']}>
        <label className={styles['form-label']}>Hémisphére</label>
        <select
          value={utmHemisphere}
          onChange={(e) => setUtmHemisphere(e.target.value as 'N')}
          className={styles['form-select']}
          disabled={statutProc === 'TERMINEE'}
        >
          <option value="N">Nord (N)</option>
        </select>
      </div>
    </div>
  );

  const ConversionModal = () => {
    const [conversionSettings, setConversionSettings] = useState<{
      system: CoordinateSystem;
      zone: number;
      hemisphere: 'N';
      applyToAll: boolean;
    }>({
      system: 'UTM',
      zone: utmZone,
      hemisphere: utmHemisphere,
      applyToAll: true,
    });

    const handleConvert = () => {
      try {
        const convertedPoints = points.map((point) => {
          if (conversionSettings.applyToAll) {
            return convertCoordinate(point, {
              from: point.system,
              to: conversionSettings.system,
              zone: conversionSettings.zone,
              hemisphere: conversionSettings.hemisphere,
            });
          } else {
            return convertCoordinate(point, {
              from: point.system,
              to: conversionSettings.system,
              zone: point.zone,
              hemisphere: point.hemisphere,
            });
          }
        });

        setPoints(convertedPoints);
        setCoordinateSystem(conversionSettings.system);
        if (conversionSettings.system === 'UTM') {
          setUtmZone(conversionSettings.zone);
          setUtmHemisphere(conversionSettings.hemisphere);
        }
        setShowConversionModal(false);
        toast.success(`Coordonnées converties en ${conversionSettings.system}`);
      } catch (error) {
        toast.error('Erreur lors de la conversion');
      }
    };

    return (
      <div className={styles['modal-overlay']}>
        <div className={styles['modal']}>
          <div className={styles['modal-header']}>
            <h3>Conversion de Coordonnées</h3>
            <button onClick={() => setShowConversionModal(false)} className={styles['close-btn']}>
              <FiX />
            </button>
          </div>
          <div className={styles['modal-body']}>
            <div className={styles['form-group']}>
              <label className={styles['form-label']}>Systéme cible</label>
              <select
                value={conversionSettings.system}
                onChange={(e) => setConversionSettings((prev) => ({ ...prev, system: e.target.value as CoordinateSystem }))}
                className={styles['form-select']}
              >
                <option value="WGS84">WGS84 (Lat/Lon)</option>
                <option value="UTM">UTM</option>
                <option value="LAMBERT">Lambert</option>
                <option value="MERCATOR">Mercator</option>
              </select>
            </div>
            {conversionSettings.system === 'UTM' && (
              <>
                <div className={styles['form-group']}>
                  <label className={styles['form-label']}>Zone UTM</label>
                  <select
                    value={conversionSettings.zone}
                    onChange={(e) => setConversionSettings((prev) => ({ ...prev, zone: parseInt(e.target.value) }))}
                    className={styles['form-select']}
                  >
                    {Array.from({ length: 4 }, (_, i) => i + 29).map((zone) => (
                      <option key={zone} value={zone}>{zone}</option>
                    ))}
                  </select>
                </div>
                <div className={styles['form-group']}>
                  <label className={styles['form-label']}>Hémisphére</label>
                  <select
                    value={conversionSettings.hemisphere}
                    onChange={(e) => setConversionSettings((prev) => ({ ...prev, hemisphere: e.target.value as 'N' }))}
                    className={styles['form-select']}
                  >
                    <option value="N">Nord (N)</option>
                    <option value="S">Sud (S)</option>
                  </select>
                </div>
                <div className={styles['form-group']}>
                  <label className={styles['checkbox-label']}>
                    <input
                      type="checkbox"
                      checked={conversionSettings.applyToAll}
                      onChange={(e) => setConversionSettings((prev) => ({ ...prev, applyToAll: e.target.checked }))}
                    />
                    Appliquer à toutes les coordonnées
                  </label>
                  <small className={styles['help-text']}>Si désactivé, chaque point conservera sa zone individuelle</small>
                </div>
              </>
            )}
            <div className={styles['modal-actions']}>
              <button onClick={handleConvert} className={styles['btn-primary']}>Convertir</button>
              <button onClick={() => setShowConversionModal(false)} className={styles['btn-outline']}>Annuler</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isPageReady) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>{loadingMessage}</p>
      </div>
    );
  }

  return (
    <div className={styles.appContainer}>
      <Navbar />
      <div className={styles['app-content']}>
        <Sidebar currentView={currentView} navigateTo={navigateTo} />
        <main className={styles['main-content']}>
          <div className={styles['breadcrumb']}>
            <span>SIGAM</span>
            <FiChevronRight className={styles['breadcrumb-arrow']} />
            <span>Substances & Coordonnées</span>
          </div>
          <div className={styles['informations-container']}>
            {procedureData && (
              <ProgressStepper
                phases={phases}
                currentProcedureId={idProc}
                currentEtapeId={currentStep}
                procedurePhases={procedureData.ProcedurePhase || []}
                procedureTypeId={procedureTypeId}
              />
            )}
            <div className={styles['header-section']}>
              <h1 className={styles['page-title']}>
                <FiMapPin className={styles['title-icon']} />
                étape 4: Substances & Coordonnées
              </h1>
              <p className={styles['page-subtitle']}>
                Veuillez fournir les informations sur les substances et les coordonnées prévues
              </p>
            </div>
            <div className={styles['form-grid']}>
              <div className={styles['form-column']}>
                <div className={styles['form-card']}>
                  <div className={styles['form-card-header']}>
                    <FiMap className={styles['card-icon']} />
                    <h3>Coordonnées GPS</h3>
                  </div>
                  <div className={styles['form-card-body']}>
                    <div className={styles['coordinate-system-info']}>
                      <span className={styles['system-label']}>
                        Systéme: {coordinateSystem}
                        {coordinateSystem === 'UTM' && ` (Zone ${utmZone}${utmHemisphere})`}
                      </span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => document.getElementById('file-import')?.click()}
                          className={styles['btn-import']}
                          disabled={statutProc === 'TERMINEE' || !statutProc}
                        >
                          <FiUpload className={styles['btn-icon']} />
                          Importer
                        </button>
                        <input
                          id="file-import"
                          type="file"
                          accept=".csv,.xlsx,.xls"
                          style={{ display: 'none' }}
                          onChange={handleFileImport}
                        />
                        <button
                          onClick={() => setShowConversionModal(true)}
                          className={styles['btn-convert']}
                          disabled={statutProc === 'TERMINEE' || !statutProc}
                        >
                          <FiRefreshCw className={styles['btn-icon']} />
                          Convertir
                        </button>
                      </div>
                    </div>
                    <div className={styles['coordinates-table-container']}>
                      <table className={styles['coordinates-table']}>
                        <thead>
                          <tr>
                            <th>{coordinateSystem === 'WGS84' ? 'Longitude' : coordinateSystem === 'UTM' ? 'Easting (m)' : 'Coordonnée X'}</th>
                            <th>{coordinateSystem === 'WGS84' ? 'Latitude' : coordinateSystem === 'UTM' ? 'Northing (m)' : 'Coordonnée Y'}</th>
                            <th>Altitude (m)</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {points.map((coord, index) => (
                            <tr key={index}>
                              <td>
                                <input
                                  type="text"
                                  className={`${styles['form-input']} ${coordinateErrors[`x-${index}`] ? styles['input-error'] : ''}`}
                                  placeholder={coordinateSystem === 'WGS84' ? '2.987654' : '500000'}
                                  value={coord.x}
                                  onChange={(e) => handleCoordinateChange(index, 'x', e.target.value)}
                                  disabled={statutProc === 'TERMINEE'}
                                />
                                {coordinateErrors[`x-${index}`] && (
                                  <div className={styles['error-message']}>{coordinateErrors[`x-${index}`]}</div>
                                )}
                                {coord.system === 'UTM' && coord.zone && (
                                  <div className={styles['coord-meta']}>Zone: {coord.zone}{coord.hemisphere}</div>
                                )}
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className={`${styles['form-input']} ${coordinateErrors[`y-${index}`] ? styles['input-error'] : ''}`}
                                  placeholder={coordinateSystem === 'WGS84' ? '34.123456' : '4000000'}
                                  value={coord.y}
                                  onChange={(e) => handleCoordinateChange(index, 'y', e.target.value)}
                                  disabled={statutProc === 'TERMINEE'}
                                />
                                {coordinateErrors[`y-${index}`] && (
                                  <div className={styles['error-message']}>{coordinateErrors[`y-${index}`]}</div>
                                )}
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className={styles['form-input']}
                                  placeholder="500"
                                  value={coord.z}
                                  onChange={(e) => handleCoordinateChange(index, 'z', e.target.value)}
                                  disabled={statutProc === 'TERMINEE'}
                                />
                              </td>
                              <td>
                                {points.length > 1 && (
                                  <button
                                    disabled={statutProc === 'TERMINEE' || !statutProc}
                                    className={styles['btn-remove-row']}
                                    onClick={() => removeCoordinateRow(index)}
                                  >
                                    <FiX />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <button
                          disabled={statutProc === 'TERMINEE' || !statutProc}
                          className={styles['btn-add-row']}
                          onClick={addPoint}
                        >
                          <FiEdit2 className={styles['btn-icon']} />
                          Ajouter un point
                        </button>
                        <button
                          className={`${styles['btn-save']} ${isSaving || !statutProc || (polygonArea !== null && polygonArea / 10000 > superficiermax) || Object.keys(coordinateErrors).length > 0 ? styles['btn-disabled'] : ''}`}
                          onClick={saveCoordinatesToBackend}
                          disabled={isSaving || !statutProc || (polygonArea !== null && polygonArea / 10000 > superficiermax) || Object.keys(coordinateErrors).length > 0}
                        >
                          {isSaving ? (
                            <>
                              <span className={styles['spinner']} /> Enregistrement...
                            </>
                          ) : (
                            <>
                              Enregistrer les coordonnées <FiSave className={styles['btn-icon']} />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    {polygonArea && superficiermax && (
                      <div className={styles['polygon-info']}>
                        <div className={styles['info-row']}>
                          <span className={styles['info-label']}>Superficie calculée :&nbsp;</span>
                          <span className={`${styles['info-value']} ${polygonArea / 10000 > superficiermax ? styles['error-text'] : styles['success-text']}`}>
                            {(polygonArea / 10000).toFixed(2)} Ha
                          </span>
                        </div>
                        <div className={styles['info-row']}>
                          <span className={styles['info-label']}>Superficie maximale autorisée :&nbsp;</span>
                          <span className={styles['info-value']}>{superficiermax} Ha</span>
                        </div>
                        {polygonArea / 10000 > superficiermax && (
                          <div className={styles['warning-box']}>
                            ⚠ï¸ La superficie calculée dépasse la limite maximale autorisée pour ce type de permis.
                          </div>
                        )}
                      </div>
                    )}
                    {coordinateSystem === 'UTM' && <UTMSettings />}
                  </div>
                </div>
                <div className={styles['form-card']}>
                  <div className={styles['form-card-header']}>
                    <FiGlobe className={styles['card-icon']} />
                    <h3>Localisation Administrative</h3>
                  </div>
                  <div className={styles['form-card-body']}>
                    <div className={styles['form-group']}>
                      <label className={styles['form-label']}>
                        <FiMapPin className={styles['input-icon']} />
                        Wilaya
                      </label>
                      <select
                        disabled={statutProc === 'TERMINEE'}
                        className={styles['form-select']}
                        value={selectedWilaya}
                        onChange={(e) => setSelectedWilaya(e.target.value)}
                      >
                        <option value="">Sélectionner une wilaya</option>
                        {wilayas.map((w) => (
                          <option key={w.id_wilaya} value={w.id_wilaya}>{w.code_wilaya} - {w.nom_wilayaFR}</option>
                        ))}
                      </select>
                    </div>
                    <div className={styles['form-group']}>
                      <label className={styles['form-label']}>
                        <FiMapPin className={styles['input-icon']} />
                        Daïra
                      </label>
                      <select
                        className={styles['form-select']}
                        value={selectedDaira}
                        onChange={(e) => setSelectedDaira(e.target.value)}
                        disabled={!selectedWilaya || statutProc === 'TERMINEE'}
                      >
                        <option value="">Sélectionner une daïra</option>
                        {dairas.map((d) => (
                          <option key={d.id_daira} value={d.id_daira}>{d.code_daira} - {d.nom_dairaFR}</option>
                        ))}
                      </select>
                    </div>
                    <div className={styles['form-group']}>
                      <label className={styles['form-label']}>
                        <FiMapPin className={styles['input-icon']} />
                        Commune
                      </label>
                      <select
                        className={styles['form-select']}
                        value={selectedCommune}
                        onChange={(e) => setSelectedCommune(e.target.value)}
                        disabled={!selectedDaira || statutProc === 'TERMINEE'}
                      >
                        <option value="">Sélectionner une commune</option>
                        {communes.map((c) => (
                          <option key={c.id_commune} value={c.id_commune}>{c.code_commune} - {c.nom_communeFR}</option>
                        ))}
                      </select>
                    </div>
                    <div className={styles['form-group']}>
                      <label className={styles['form-label']}>
                        <FiFileText className={styles['input-icon']} />
                        Lieu Dit FR
                      </label>
                      <input
                        disabled={statutProc === 'TERMINEE'}
                        type="text"
                        className={styles['form-input']}
                        value={lieuDitFr}
                        onChange={(e) => setLieuDitFr(e.target.value)}
                      />
                    </div>
                    <div className={styles['form-group']}>
                      <label className={styles['form-label']}>
                        <FiFileText className={styles['input-icon']} />
                        Lieu Dit AR
                      </label>
                      <input
                        disabled={statutProc === 'TERMINEE'}
                        type="text"
                        className={styles['form-input']}
                        value={lieuDitAr}
                        onChange={(e) => setLieuDitAr(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles['form-card']}>
                  <div className={styles['form-card-header']}>
                    <FiFileText className={styles['card-icon']} />
                    <h3>Statut Juridique du Terrain</h3>
                  </div>
                  <div className={styles['form-card-body']}>
                    <div className={styles['form-group']}>
                      <label className={styles['form-label']}>
                        <FiFileText className={styles['input-icon']} />
                        Statut Juridique
                      </label>
                      <select
                        disabled={statutProc === 'TERMINEE'}
                        className={styles['form-select']}
                        value={statutJuridique}
                        onChange={(e) => setStatutJuridique(e.target.value)}
                      >
                        <option value="">Sélectionner un statut</option>
                        <option value="Domaine public">Domaine public</option>
                        <option value="Domaine privé de l'état">Domaine privé de l'état</option>
                        <option value="Propriété privée">Propriété privée</option>
                      </select>
                    </div>
                    <div className={styles['form-group']}>
                      <label className={styles['form-label']}>
                        <FiFileText className={styles['input-icon']} />
                        Occupant Légal
                      </label>
                      <input
                        disabled={statutProc === 'TERMINEE'}
                        type="text"
                        className={styles['form-input']}
                        value={occupantLegal}
                        onChange={(e) => setOccupantLegal(e.target.value)}
                      />
                    </div>
                    <div className={styles['form-group']}>
                      <label className={styles['form-label']}>
                        <FiHash className={styles['input-icon']} />
                        Superficie (Ha)
                      </label>
                      <input
                        disabled={statutProc === 'TERMINEE'}
                        type="number"
                        className={styles['form-input']}
                        value={superficie}
                        onChange={(e) => setSuperficie(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles['form-column']}>
      {/* Available Substances */}
      <div className={styles['form-card']}>
        <div className={styles['form-card-header']}>
          <FiFileText className={styles['card-icon']} />
          <h3>Substances Minérales</h3>
        </div>
        <div className={styles['form-card-body']}>
          <div className={styles['filter-section']}>
            {/* Famille filter */}
            <div className={styles['form-group']}>
              <label className={styles['form-label']}>Filtrer par famille</label>
              <select
                disabled={statutProc === 'TERMINEE'}
                className={styles['form-select']}
                onChange={(e) => setFamille(e.target.value)}
                value={famille}
              >
                <option value="">Toutes les familles</option>
                <option value="métalliques">Métalliques</option>
                <option value="non-métalliques">Non métalliques</option>
                <option value="radioactives">Radioactives</option>
              </select>
            </div>

            {/* Search input */}
            <div className={styles['form-group']}>
              <label className={styles['form-label']}>Rechercher une substance</label>
              <div className={styles['search-container']}>
                <FiSearch className={styles['search-icon']} />
                <input
                  disabled={statutProc === 'TERMINEE'}
                  type="text"
                  placeholder="Rechercher..."
                  className={styles['search-input']}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

          {/* Virtualized list */}
          <div className={styles['substances-list-container']}>
            <h4 className={styles['list-title']}>
              Substances disponibles
              <span className={styles['list-count']}>{filteredSubstances.length}</span>
            </h4>
            <RW.FixedSizeList
              height={400} // Scrollable area height
              itemCount={filteredSubstances.length}
              itemSize={48} // Row height (px)
              width="100%"
            >
              {Row}
            </RW.FixedSizeList>
          </div>
        </div>
      </div>
      {/* Selected Substances */}
      <div className={styles['form-card']}>
        <div className={styles['form-card-header']}>
          <FiFileText className={styles['card-icon']} />
          <h3>Substances Sélectionnées</h3>
        </div>
        <div className={styles['form-card-body']}>
          <h4 className={styles['list-title']}>
            Substances choisies
            <span className={styles['list-count']}>{selectedIds.length}</span>
          </h4>
          <ul className={styles['selected-substances-list']}>
            {selectedSubstances.map((sub) => (
              <li key={sub.id_sub} className={styles['selected-substance']}>
                <div className={styles['substance-info']}>
                  <span className={styles['substance-name']}>{sub.nom_subFR}</span>
                  <span className={styles['substance-category']}>{sub.categorie_sub}</span>
                  <select
                    disabled={statutProc === 'TERMINEE' || !statutProc}
                    className={styles['priority-select']}
                    value={sub.priorite}
                    onChange={(e) =>
                      changePriority(sub.id_sub, e.target.value as 'principale' | 'secondaire')
                    }
                  >
                    <option value="secondaire">Secondaire</option>
                    <option value="principale">Principale</option>
                  </select>
                  <span className={`${styles['priority-badge']} ${styles[sub.priorite]}`}>
                    {sub.priorite === 'principale' ? 'Principale' : 'Secondaire'}
                  </span>
                </div>
                <button
                  disabled={statutProc === 'TERMINEE' || !statutProc}
                  className={styles['remove-btn']}
                  onClick={() => handleSelect(sub)}
                >
                  <FiX />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      </div>
      </div>
      </div>
</div>            <div className={styles['navigation-buttons']}>
              <button
                className={`${styles['btn']} ${styles['btn-outline']}`}
                onClick={handleBack}
                disabled={isLoading}
              >
                <FiChevronLeft className={styles['btn-icon']} />
                Précédent
              </button>
              <button
                className={styles['btnSave']}
                onClick={handleSaveEtape}
                disabled={savingEtape || statutProc === 'TERMINEE' || !statutProc}
              >
                <BsSave className={styles['btnIcon']} />
                {savingEtape ? 'Sauvegarde en cours...' : 'Sauvegarder l’étape'}
              </button>
              <button
                className={`${styles['btn']} ${styles['btn-primary']}`}
                onClick={handleNext}
                disabled={isLoading || isSubmitting}
              >
                {isLoading || isSubmitting ? (
                  <span className={styles['btn-loading']}>
                    <span className={styles['spinner-small']}></span>
                    {isSubmitting ? 'Soumission...' : 'Vérification...'}
                  </span>
                ) : (
                  <>
                    Suivant
                    <FiChevronRight className={styles['btn-icon']} />
                  </>
                )}
              </button>
            </div>
            <div className={styles['etapeSaveSection']}>
              {etapeMessage && <div className={styles['etapeMessage']}>{etapeMessage}</div>}
            </div>
            {showModal && summaryData && (
              <SummaryModal
                data={summaryData}
                onClose={() => {
                  setShowModal(false);
                  router.push(`/demande/step5/page5?id=${idProc}`).then(() => router.reload());
                }}
              />
            )}
            {showConversionModal && <ConversionModal />}
          </div>
        </main>
      </div>
    </div>
  );
}

