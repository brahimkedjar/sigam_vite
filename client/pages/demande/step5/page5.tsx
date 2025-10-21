'use client';
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { FiPlus, FiTrash2, FiCheckCircle, FiAlertTriangle, FiMapPin, FiEdit2, FiRefreshCw, FiChevronLeft, FiSave, FiDownload, FiUpload, FiChevronRight, FiLayers, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import * as turf from '@turf/turf';
import styles from './cadastre.module.css';
import { useRouter } from 'next/router';
import { useSearchParams } from '@/src/hooks/useSearchParams';
import axios from 'axios';
import Navbar from '@/pages/navbar/Navbar';
import Sidebar from '@/pages/sidebar/Sidebar';
import { useAuthStore } from '../../../src/store/useAuthStore';
import { BsSave } from 'react-icons/bs';
import { useViewNavigator } from '../../../src/hooks/useViewNavigator';
import ProgressStepper from '../../../components/ProgressStepper';
import { STEP_LABELS } from '../../../src/constants/steps';
import { useActivateEtape } from '@/src/hooks/useActivateEtape';
import dynamic from 'next/dynamic';
import { Phase, Procedure, ProcedureEtape, ProcedurePhase, StatutProcedure } from '@/src/types/procedure';
import proj4 from 'proj4';

const ArcGISMap = dynamic(() => import('@/components/arcgismap/ArcgisMap'), { ssr: false });

export type CoordinateSystem = 'WGS84' | 'UTM' | 'LAMBERT' | 'MERCATOR';

type Point = {
  id: number;
  idTitre: number;
  h: number;
  x: number;
  y: number;
  system: CoordinateSystem;
  zone?: number;
  hemisphere?: 'N';
};

type PermitData = {
  code: string;
  type: string;
  holder: string;
  wilaya: string;
  daira: string;
  commune: string;
};

export default function CadastrePage() {
  const [idDemande, setIdDemande] = useState<number | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [superficie, setSuperficie] = useState(0);
  const [superficieDeclaree, setSuperficieDeclaree] = useState<number | null>(null);
  const [superficieCadastrale, setSuperficieCadastrale] = useState<number | null>(null);
  const [sitGeoOk, setSitGeoOk] = useState<boolean>(false);
  const [empietOk, setEmpietOk] = useState<boolean>(false);
  const [geomOk, setGeomOk] = useState<boolean>(false);
  const [superfOk, setSuperfOk] = useState<boolean>(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTab, setActiveTab] = useState('coordinates');
  const [comment, setComment] = useState('');
  const [overlapDetected, setOverlapDetected] = useState(false);
  const [overlapPermits, setOverlapPermits] = useState<string[]>([]);
  const [miningTitleOverlaps, setMiningTitleOverlaps] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const idProcStr = searchParams?.get('id');
  const idProc = idProcStr ? parseInt(idProcStr, 10) : undefined;
  const [error, setError] = useState<string | null>(null);
  const [savingEtape, setSavingEtape] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const { auth, isLoaded, hasPermission } = useAuthStore();
  const isCadastre = auth.role === 'cadastre';
  const [isPolygonValid, setIsPolygonValid] = useState(true);
  const hasUniqueCoords = new Set(points.map(p => `${p.x},${p.y}`)).size === points.length;
  const [demandeSummary, setDemandeSummary] = useState<any>(null);
  const { currentView, navigateTo } = useViewNavigator("nouvelle-demande");
  const currentStep = 5;
  const [isLoading, setIsLoading] = useState(false);
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const [permitData, setPermitData] = useState<PermitData>({
    code: '',
    type: '',
    holder: '',
    wilaya: '',
    daira: '',
    commune: ''
  });
  const mapRef = useRef<any>(null);
  const [statutProc, setStatutProc] = useState<string | undefined>(undefined);
  const [procedureData, setProcedureData] = useState<Procedure | null>(null);
  const [currentEtape, setCurrentEtape] = useState<{ id_etape: number } | null>(null);
  const [procedureTypeId, setProcedureTypeId] = useState<number | undefined>();
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [hasActivatedStep5, setHasActivatedStep5] = useState(false);
  const [coordinateSystem, setCoordinateSystem] = useState<CoordinateSystem>('UTM');
  const [utmZone, setUtmZone] = useState<number>(31);
  const [utmHemisphere, setUtmHemisphere] = useState<'N'>('N');
  const [activatedSteps, setActivatedSteps] = useState<Set<number>>(new Set());
  const [editableRowId, setEditableRowId] = useState<number | null>(null);
  // Source des coordonnées: inscription provisoire vs coordonnées validées
  // Source des coordonnées: inscription provisoire vs coordonnées validées
  const [coordSource, setCoordSource] = useState<'provisoire' | 'validees'>('provisoire');
  const [provisionalPoints, setProvisionalPoints] = useState<Point[]>([]);
  const [validatedPoints, setValidatedPoints] = useState<Point[]>([]);

  // Helper: shallow-equality of arrays of points on key geometry/admin fields
  const equalPoints = (a: Point[] = [], b: Point[] = []) => {
    if (a === b) return true;
    if (!a || !b || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      const p = a[i], q = b[i];
      if (!q) return false;
      if (p.x !== q.x || p.y !== q.y || p.h !== q.h || p.idTitre !== q.idTitre) return false;
    }
    return true;
  };

  // Helper: apply selected dataset to UI in one pass (no reactive ping-pong)
  const applySourceFromArrays = (
    prov: Point[],
    val: Point[],
    source: 'provisoire' | 'validees'
  ) => {
    const data = source === 'provisoire' ? prov : val;
    if (data && data.length > 0) {
      if (!equalPoints(points, data)) setPoints(data);
      const first = data[0];
      if (first?.system) {
        setCoordinateSystem(first.system);
        if (first.zone) setUtmZone(first.zone);
        if (first.hemisphere) setUtmHemisphere(first.hemisphere);
      }
    } else {
      if (points.length) setPoints([]);
    }
  };

  const [showLayerPanel, setShowLayerPanel] = useState(false);
  // Stable signature of current displayed points to avoid re-applying same dataset
  
  const router = useRouter();

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
      setError('Failed to fetch procedure data');
      setTimeout(() => setError(null), 4000);
    }
  };

  useEffect(() => {
    fetchProcedureData();
  }, [idProc, refetchTrigger]);

  // Charger les deux jeux de coordonnées (provisoires et validées)
  useEffect(() => {
  if (!idProc) return;
  const load = async () => {
    let provArr: Point[] = [];
    let valArr: Point[] = [];
    // Provisoires
    try {
      const provRes = await axios.get(`${apiURL}/inscription-provisoire/procedure/${idProc}`);
      const rec = provRes.data;
      const pts = Array.isArray(rec?.points) ? rec.points : [];
      let baseId = generateId();
      provArr = pts.map((p: any, i: number) => ({
        id: baseId + i,
        idTitre: 1007,
        h: 32,
        x: p.x,
        y: p.y,
        system: p.system || 'UTM',
        zone: p.zone,
        hemisphere: p.hemisphere,
      }));
      if (typeof rec?.superficie_declaree === 'number') setSuperficieDeclaree(rec.superficie_declaree);
    } catch {}
    setProvisionalPoints(provArr);

    // Validées
    try {
      const res = await axios.get(`${apiURL}/coordinates/procedure/${idProc}`);
      const coords = (res.data ?? []).filter((c: any) => c?.coordonnee?.x !== undefined && c?.coordonnee?.y !== undefined);
      let baseId = generateId();
      valArr = coords.map((c: any, i: number) => ({
        id: c.coordonnee.id ?? (baseId + i),
        idTitre: c.coordonnee.idTitre || 1007,
        h: c.coordonnee.h || 32,
        x: c.coordonnee.x,
        y: c.coordonnee.y,
        system: c.coordonnee.system || 'UTM',
        zone: c.coordonnee.zone,
        hemisphere: c.coordonnee.hemisphere,
      }));
    } catch {}
    setValidatedPoints(valArr);

    // Apply selection once from freshly loaded arrays
    applySourceFromArrays(provArr, valArr, coordSource);
  };
  load();
}, [idProc, apiURL, refetchTrigger]);

  // Reflect selected source (provisoire/validées) into displayed points
  useEffect(() => {
    applySourceFromArrays(provisionalPoints, validatedPoints, coordSource);
  }, [coordSource, provisionalPoints, validatedPoints]);

  


  useActivateEtape({
    idProc,
    etapeNum: 5,
    shouldActivate: currentStep === 5 && !activatedSteps.has(5),
    onActivationSuccess: () => {
      setActivatedSteps(prev => new Set(prev).add(5));
      if (procedureData) {
        const updatedData = { ...procedureData };
        if (updatedData.ProcedureEtape) {
          const stepToUpdate = updatedData.ProcedureEtape.find(pe => pe.id_etape === 5);
          if (stepToUpdate) {
            stepToUpdate.statut = 'EN_COURS' as StatutProcedure;
          }
          setCurrentEtape({ id_etape: 5 });
        }
        if (updatedData.ProcedurePhase) {
          const phaseContainingStep5 = updatedData.ProcedurePhase.find(pp => 
            pp.phase?.etapes?.some(etape => etape.id_etape === 5)
          );
          if (phaseContainingStep5) {
            phaseContainingStep5.statut = 'EN_COURS' as StatutProcedure;
          }
        }
        setProcedureData(updatedData);
        setHasActivatedStep5(true);
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
    if (!idDemande) return;
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`${apiURL}/api/demande/${idDemande}/summary`);
        setDemandeSummary(res.data);
      } catch (error) {
        console.error("? Failed to fetch summary", error);
        setError('Failed to fetch demande summary');
        setTimeout(() => setError(null), 4000);
      }
    };
    fetchSummary();
  }, [idDemande]);

  useEffect(() => {
    if (demandeSummary) {
      setPermitData({
        code: demandeSummary.code_demande || '',
        type: demandeSummary.typePermis?.lib_type || '',
        holder: demandeSummary.detenteur?.nom_societeFR || '',
        wilaya: demandeSummary.wilaya?.nom_wilayaFR || '',
        daira: demandeSummary.daira?.nom_dairaFR || '',
        commune: demandeSummary.commune?.nom_communeFR || ''
      });
      // Try to fill declared surface from summary if available
      try {
        const sd = (demandeSummary.superficie_declaree ?? demandeSummary.superficieDeclaree ?? demandeSummary.superficie_declaree_ha ?? null);
        if (typeof sd === 'number') setSuperficieDeclaree(sd);
      } catch {}
    }
  }, [demandeSummary]);

  const generateId = () => {
    return Math.max(...points.map(p => p.id), 0) + 1;
  };

  const addPoint = useCallback((coords?: { x: number, y: number }) => {
    const newPoint: Point = {
      id: generateId(),
      idTitre: points.length > 0 ? points[0].idTitre : 1007,
      h: points.length > 0 ? points[0].h : 32,
      x: coords ? coords.x : 0,
      y: coords ? coords.y : 0,
      system: coordinateSystem,
      zone: coordinateSystem === 'UTM' ? utmZone : undefined,
      hemisphere: coordinateSystem === 'UTM' ? utmHemisphere : undefined
    };
    setPoints(prev => [...prev, newPoint]);
    return newPoint;
  }, [points, coordinateSystem, utmZone, utmHemisphere]);

  const insertPointAfter = (index: number) => {
    const base = points[index];
    const newPoint: Point = {
      id: generateId(),
      idTitre: base?.idTitre ?? (points[0]?.idTitre ?? 1007),
      h: base?.h ?? (points[0]?.h ?? 32),
      x: base ? base.x : 0,
      y: base ? base.y : 0,
      system: coordinateSystem,
      zone: coordinateSystem === 'UTM' ? (base?.zone ?? utmZone) : undefined,
      hemisphere: coordinateSystem === 'UTM' ? (base?.hemisphere ?? utmHemisphere) : undefined,
    };
    const next = [...points];
    next.splice(index + 1, 0, newPoint);
    setPoints(next);
  };

  const movePointUp = (index: number) => {
    if (index <= 0) return;
    const next = [...points];
    const [p] = next.splice(index, 1);
    next.splice(index - 1, 0, p);
    setPoints(next);
  };

  const movePointDown = (index: number) => {
    if (index >= points.length - 1) return;
    const next = [...points];
    const [p] = next.splice(index, 1);
    next.splice(index + 1, 0, p);
    setPoints(next);
  };

  const [existingPolygons, setExistingPolygons] = useState<{idProc: number; num_proc: string; coordinates: [number, number][]}[]>([]);
  const filteredExistingPolygons = useMemo(() => {
    if (!idProc) return existingPolygons;
    return existingPolygons.filter(p => p.idProc !== idProc);
  }, [existingPolygons, idProc]);
  const lastOverlapStatusRef = useRef<'none' | 'overlap' | 'unreachable' | null>(null);
  const autoCheckTimerRef = useRef<number | null>(null);

  // Load existing polygons from backend (for overlap checks)
  useEffect(() => {
    const fetchExisting = async () => {
      try {
        const res = await axios.get(`${apiURL}/coordinates/existing`);
        const polygons = res.data.map((poly: any) => ({
          idProc: poly.idProc,
          num_proc: poly.num_proc,
          coordinates: poly.coordinates.map((coord: [number, number]) => [coord[0], coord[1]])
        }));
        setExistingPolygons(polygons);
      } catch (err) {
        console.error('Failed to fetch polygons', err);
        setExistingPolygons([]);
        setError('Failed to fetch existing polygons');
        setTimeout(() => setError(null), 4000);
      }
    };
    fetchExisting();
  }, [apiURL]);

  // Load demande info (idDemande, statut) from procedure id
  useEffect(() => {
    if (!router.isReady) return;
    const id_proc = router.query.id as string;
    if (!id_proc) return;
    const fetchDemande = async () => {
      try {
        const res = await axios.get(`${apiURL}/api/procedures/${id_proc}/demande`);
        setIdDemande(res.data.id_demande);
        setStatutProc(res.data.procedure.statut_proc);
      } catch (error) {
        console.error('Failed to fetch demande:', error);
        // keep UI usable even if this fails
      }
    };
    fetchDemande();
  }, [router.isReady, router.query.id, apiURL]);

  // Ensure re-fetch on repeated navigations even to same URL
  useEffect(() => {
    const id_proc = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('id') ?? '' : '';
    if (!id_proc) return;
    const fetchDemande = async () => {
      try {
        const res = await axios.get(`${apiURL}/api/procedures/${id_proc}/demande`);
        setIdDemande(res.data.id_demande);
        setStatutProc(res.data.procedure.statut_proc);
      } catch (error) {
        // swallow duplicate errors
      }
    };
    fetchDemande();
  }, [router.asPath, apiURL]);

  // Removed legacy initial points loader to avoid ping-pong with source selection

  // Load existing verification (cadastral) status for the demande
  useEffect(() => {
    if (!idDemande) return;
    const fetchVerification = async () => {
      try {
        const res = await axios.get(`${apiURL}/verification-geo/demande/${idDemande}`);
        const v = res.data || {};
        if (typeof v.sit_geo_ok === 'boolean') setSitGeoOk(v.sit_geo_ok);
        if (typeof v.empiet_ok === 'boolean') setEmpietOk(v.empiet_ok);
        if (typeof v.geom_ok === 'boolean') setGeomOk(v.geom_ok);
        if (typeof v.superf_ok === 'boolean') setSuperfOk(v.superf_ok);
        if (typeof v.superficie_cadastrale === 'number') setSuperficieCadastrale(v.superficie_cadastrale);
      } catch (e) {
        // If not found yet, keep defaults; avoid noisy errors
      }
    };
    fetchVerification();
  }, [idDemande, apiURL]);
  // Add new function to check mining title overlaps
  const checkMiningTitleOverlaps = async () => {
    if (!mapRef.current || points.length < 3) {
      setError("Dessinez d'abord un polygone valide");
      setTimeout(() => setError(null), 4000);
      return;
    }

    try {
      const overlappingTitles = await mapRef.current.queryMiningTitles();
      if (overlappingTitles === null) {
        if (lastOverlapStatusRef.current !== 'unreachable') {
          lastOverlapStatusRef.current = 'unreachable';
          setError('Vérification ANAM indisponible (couche SIG inaccessible)');
          setTimeout(() => setError(null), 4000);
        }
        return;
      }
      setMiningTitleOverlaps(overlappingTitles);
      
      if (overlappingTitles.length > 0) {
        setOverlapDetected(true);
        setOverlapPermits(overlappingTitles.map((title: any) => {
          const typ = title.typetitre || title.codetype || 'Titre';
          const code = title.code ?? title.idtitre ?? title.objectid ?? '';
          const titulaire = [title.tnom, title.tprenom].filter(Boolean).join(' ').trim();
          const locationParts = [title.wilaya, title.daira, title.commune].filter(Boolean);
          const location = locationParts.length ? ` — ${locationParts.join(' / ')}` : '';
          const holder = titulaire ? ` — ${titulaire}` : '';
          return `${typ} ${title.codetype || ''} ${code}${holder}${location}`.replace(/\s+/g, ' ').trim();
        }));
        if (lastOverlapStatusRef.current !== 'overlap') {
          lastOverlapStatusRef.current = 'overlap'; setError(`Chevauchement détecté avec ${overlappingTitles.length} titre(s) minier(s) ANAM`); setTimeout(() => setError(null), 5000); }
      } else {
        setOverlapDetected(false);
        if (lastOverlapStatusRef.current !== 'none') {
          lastOverlapStatusRef.current = 'none'; setSuccess('Aucun chevauchement avec les titres miniers ANAM'); setTimeout(() => setSuccess(null), 2000); }
      }
    } catch (error) {
      console.error('Error checking mining title overlaps:', error);
      setError('Erreur lors de la vérification des titres miniers');
      setTimeout(() => setError(null), 4000);
    }
  };

   const handleSaveEtape = async () => {
    if (!idProc) {
      setError("ID procédure manquant !");
      setTimeout(() => setError(null), 4000);
      return;
    }
    setSavingEtape(true);
    try {
      await axios.post(`${apiURL}/api/procedure-etape/finish/${idProc}/5`);
      setSuccess("Étape 5 enregistrée avec succès !");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Erreur étape", err);
      setError("Erreur lors de l'enregistrement de l'étape");
      setTimeout(() => setError(null), 4000);
    } finally {
      setSavingEtape(false);
    }
  };

  const removePoint = (id: number) => {
    if (points.length <= 3) return;
    setPoints(points.filter(p => p.id !== id));
  };

  const handleChange = (id: number, key: keyof Point, value: string) => {
    setPoints(points.map(p =>
      p.id === id ? { ...p, [key]: key === 'id' || key === 'idTitre' || key === 'h' ? parseInt(value) || 0 : parseFloat(value) || 0 } : p
    ));
  };

  const saveCoordinatesToBackend = async () => {
    if (!idProc) {
      setError("ID procédure manquant !");
      setTimeout(() => setError(null), 4000);
      return;
    }
    if (!points || points.length < 3) {
      setError("Le polygone doit contenir au moins 3 points.");
      setTimeout(() => setError(null), 4000);
      return;
    }
    try {
      const payloadPoints = points.map(p => ({
        x: p.x.toString(),
        y: p.y.toString(),
        z: "0",
        system: p.system,
        zone: p.zone,
        hemisphere: p.hemisphere,
      }));
      await axios.post(`${apiURL}/coordinates/update`, {
        id_proc: idProc,
        id_zone_interdite: null,
        points: payloadPoints,
        superficie
      });
      setSuccess("Coordonnées sauvegardées avec succès !");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde des coordonnées:", err);
      setError("Échec de la sauvegarde des coordonnées.");
      setTimeout(() => setError(null), 4000);
    }
  };

  const validateCoordinate = (point: Point): boolean => {
    switch (point.system) {
      case 'WGS84':
        return point.x >= -180 && point.x <= 180 && point.y >= -90 && point.y <= 90;
      case 'UTM':
        const zone = point.zone ?? utmZone;
        const hemisphere = point.hemisphere ?? utmHemisphere;
        if (!zone || !hemisphere) return false;
        const easting = point.x;
        const northing = point.y;
        if (easting < 100000 || easting > 999999) return false;
        if (hemisphere === 'N') {
          return northing >= 0 && northing <= 10000000;
        } else {
          return northing >= 1000000 && northing <= 10000000;
        }
      case 'LAMBERT':
        return !isNaN(point.x) && !isNaN(point.y);
      case 'MERCATOR':
        return !isNaN(point.x) && !isNaN(point.y);
      default:
        return false;
    }
  };

  const calculateArea = useCallback(() => {
    const validPoints = points.filter(p => !isNaN(p.x) && !isNaN(p.y) && validateCoordinate(p));
    if (validPoints.length < 3) {
      setSuperficie(0);
      setIsPolygonValid(false);
      return 0;
    }
    try {
      let area: number;
      if (coordinateSystem === 'UTM' || coordinateSystem === 'LAMBERT') {
        const coordinates = validPoints.map(p => [p.x, p.y]);
        const cleanedCoordinates = coordinates.filter((coord, index) => 
          index === 0 || !(coord[0] === coordinates[index-1][0] && coord[1] === coordinates[index-1][1])
        );
        if (cleanedCoordinates.length < 3) {
          setIsPolygonValid(false);
          setSuperficie(0);
          return 0;
        }
        const first = cleanedCoordinates[0];
        const last = cleanedCoordinates[cleanedCoordinates.length - 1];
        const finalCoordinates = [...cleanedCoordinates];
        if (first[0] !== last[0] || first[1] !== last[1]) {
          finalCoordinates.push([...first]);
        }
        let shoelaceArea = 0;
        const n = finalCoordinates.length;
        for (let i = 0; i < n - 1; i++) {
          shoelaceArea += finalCoordinates[i][0] * finalCoordinates[i + 1][1] - finalCoordinates[i + 1][0] * finalCoordinates[i][1];
        }
        area = Math.abs(shoelaceArea) / 2;
      } else {
        const wgs84Coordinates = validPoints.map(point => {
          if (point.system === 'WGS84') {
            return [point.x, point.y];
          } else {
            return convertToWGS84(point);
          }
        });
        const cleanedCoordinates = wgs84Coordinates.filter((coord, index) => 
          index === 0 || !(coord[0] === wgs84Coordinates[index-1][0] && coord[1] === wgs84Coordinates[index-1][1])
        );
        if (cleanedCoordinates.length < 3) {
          setIsPolygonValid(false);
          setSuperficie(0);
          return 0;
        }
        const first = cleanedCoordinates[0];
        const last = cleanedCoordinates[cleanedCoordinates.length - 1];
        const finalCoordinates = [...cleanedCoordinates];
        if (first[0] !== last[0] || first[1] !== last[1]) {
          finalCoordinates.push([...first]);
        }
        const polygon = turf.polygon([finalCoordinates]);
        if (!turf.booleanValid(polygon)) {
          console.warn('Invalid polygon geometry');
          setIsPolygonValid(false);
          setSuperficie(0);
          return 0;
        }
        area = turf.area(polygon);
      }
      const areaHectares = area / 10000;
      setIsPolygonValid(true);
      setSuperficie(parseFloat(areaHectares.toFixed(2)));
      return areaHectares;
    } catch (err) {
      console.error('Area calculation error:', err);
      setIsPolygonValid(false);
      setSuperficie(0);
      setError('Failed to calculate area');
      setTimeout(() => setError(null), 4000);
      return 0;
    }
  }, [points, coordinateSystem, utmZone, utmHemisphere]);

  const convertToWGS84 = (point: Point): [number, number] => {
    try {
      if (point.system === "WGS84") {
        return [point.x, point.y];
      } else if (point.system === "UTM") {
        const zone = point.zone ?? utmZone;
        const hemisphere = point.hemisphere ?? utmHemisphere;
        if (!zone || !hemisphere) {
          console.warn(`UTM coordinate missing zone or hemisphere for point ${point.id}, using defaults: zone=${utmZone}, hemisphere=${utmHemisphere}`);
        }
        const zoneCode = zone.toString().padStart(2, "0");
        const sourceProj = hemisphere === "N" ? `EPSG:326${zoneCode}` : `EPSG:327${zoneCode}`;
        const converted = proj4(sourceProj, "EPSG:4326", [point.x, point.y]);
        return [converted[0], converted[1]];
      } else if (point.system === "LAMBERT") {
        let lambertZone = 'EPSG:30491';
        if (point.x > 1000000 && point.x < 2000000) {
          lambertZone = 'EPSG:30492';
        } else if (point.x >= 2000000) {
          lambertZone = 'EPSG:30493';
        }
        const converted = proj4(lambertZone, "EPSG:4326", [point.x, point.y]);
        return [converted[0], converted[1]];
      }
      throw new Error("Invalid coordinate system");
    } catch (error) {
      console.error("Coordinate conversion error:", error);
      return [0, 0];
    }
  };

  const handleCoordinateSystemChange = (system: CoordinateSystem) => {
    setCoordinateSystem(system);
    if (system !== 'UTM') {
      setUtmZone(31);
      setUtmHemisphere('N');
    }
    setPoints(points.map(p => ({
      ...p,
      system,
      zone: system === 'UTM' ? utmZone : undefined,
      hemisphere: system === 'UTM' ? utmHemisphere : undefined
    })));
  };

  const polygonValid = points.length >= 4 && hasUniqueCoords;
  const allFilled = points.every(p => !isNaN(p.x) && !isNaN(p.y) && !isNaN(p.h));

 const handleNext = () => {
    router.push(`/demande/step6/page6?id=${idProc}`);
  };

  const handleBack = () => {
    if (!idProc) {
      setError("ID procédure manquant");
      setTimeout(() => setError(null), 4000);
      return;
    }
    router.push(`/demande/step4/page4?id=${idProc}`);
  };

  const exportData = () => {
    const data = { points, superficie, permitData, createdAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `perimeter-${permitData.code}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.points && Array.isArray(data.points)) {
          const importedPoints = data.points.map((p: any) => ({
            id: p.id,
            idTitre: p.idTitre || 1007,
            h: p.h || 32,
            x: p.x,
            y: p.y,
            system: p.system || 'UTM',
            zone: p.system === 'UTM' ? (p.zone || utmZone) : undefined,
            hemisphere: p.system === 'UTM' ? (p.hemisphere || utmHemisphere) : undefined
          }));
          setPoints(importedPoints);
          if (data.superficie) setSuperficie(data.superficie);
          if (data.permitData) setPermitData(data.permitData);
        }
      } catch (error) {
        console.error('Error parsing file:', error);
        setError('Failed to import data');
        setTimeout(() => setError(null), 4000);
      }
    };
    reader.readAsText(file);
  };

  const handleMapClick = useCallback((x: number, y: number) => {
    if (isDrawing) {
      addPoint({ x, y });
    }
  }, [isDrawing, addPoint]);

  // Update the existing checkForOverlaps function to include mining titles
  const checkForOverlaps = useCallback(() => {
    const validPoints = points.filter(p => !isNaN(p.x) && !isNaN(p.y) && validateCoordinate(p));
    if (validPoints.length < 3) return;
    const coordinates = validPoints.map(p => [p.x, p.y]);
    const first = coordinates[0];
    const last = coordinates[coordinates.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      coordinates.push([...first]);
    }
    const newPoly = turf.polygon([coordinates]);
    const overlappingSites: string[] = [];
    filteredExistingPolygons.forEach(({ num_proc, coordinates: existingCoords }) => {
      try {
        if (!existingCoords || !Array.isArray(existingCoords)) {
          console.warn('Invalid existing coordinates for:', num_proc);
          return;
        }
        const existingPoly = turf.polygon([existingCoords]);
        const isSame = turf.booleanEqual(newPoly, existingPoly);
        if (isSame) return;
        const overlap = turf.booleanOverlap(newPoly, existingPoly) || turf.booleanIntersects(newPoly, existingPoly);
        if (overlap) {
          overlappingSites.push(num_proc);
        }
      } catch (e) {
        console.warn("Invalid polygon skipped:", num_proc, e);
      }
    });
    
    // Include mining title overlaps
    const allOverlaps = [
      ...overlappingSites,
      ...miningTitleOverlaps.map((title: any) => {
        const typ = title.typetitre || title.codetype || 'Titre';
        const code = title.code ?? title.idtitre ?? title.objectid ?? '';
        const titulaire = [title.tnom, title.tprenom].filter(Boolean).join(' ').trim();
        return `${typ} ${title.codetype || ''} ${code}${titulaire ? ' — ' + titulaire : ''}`.replace(/\s+/g,' ').trim();
      })
    ];
    setOverlapDetected(allOverlaps.length > 0);
    setOverlapPermits(allOverlaps);
  }, [points, filteredExistingPolygons, miningTitleOverlaps]);

  // Update useEffect to include mining title checks (debounced)
  useEffect(() => {
    calculateArea();
    checkForOverlaps();

    if (autoCheckTimerRef.current) {
      window.clearTimeout(autoCheckTimerRef.current);
      autoCheckTimerRef.current = null;
    }
    // Auto-check mining titles when polygon is complete
    if (points.length >= 3 && isPolygonValid) {
      autoCheckTimerRef.current = window.setTimeout(() => {
        checkMiningTitleOverlaps();
      }, 800) as unknown as number;
    }

    return () => {
      if (autoCheckTimerRef.current) {
        window.clearTimeout(autoCheckTimerRef.current);
        autoCheckTimerRef.current = null;
      }
    };
  }, [points, calculateArea, checkForOverlaps, isPolygonValid]);

  // Add function to calculate area using ArcGIS
  const calculateAreaWithArcGIS = () => {
    if (mapRef.current) {
      const area = mapRef.current.calculateArea();
      setSuperficie(parseFloat(area.toFixed(2)));
      setSuccess('Superficie calculée avec ArcGIS');
      setTimeout(() => setSuccess(null), 3000);
    } else {
      calculateArea(); // fallback to existing method
    }
  };

  // Update the map section in your return statement
  return (
    <div className={styles['app-container']}>
      <Navbar />
      <div className={styles['app-content']}>
        <Sidebar currentView={currentView} navigateTo={navigateTo} />
        <main className={styles['main-content']}>
          <div className={styles['breadcrumb']}>
            <span>SIGAM</span>
            <FiChevronRight className={styles['breadcrumb-arrow']} />
            <span>Cadastre</span>
          </div>
          <div className={styles['content-wrapper']}>
            {procedureData && (
              <ProgressStepper
                phases={phases}
                currentProcedureId={idProc}
                currentEtapeId={currentEtape?.id_etape}
                procedurePhases={procedureData.ProcedurePhase || []}
                procedureTypeId={procedureTypeId}
              />
            )}
            <div className={styles['cadastre-app']}>
              <header className={styles['app-header']}>
                <h1>Définir le périmètre du permis minier</h1>
                <p className={styles['subtitle']}>Délimitation géographique et vérification des empiétements territoriaux avec ArcGIS Enterprise ANAM</p>
              </header>
              <div className={styles['app-layout']}>
                {/* UPDATED MAP SECTION */}
                <section className={styles['map-container']}>
                  <div className={styles['map-header']}>
                    <h2>
                      <FiMapPin /> Carte ANAM ArcGIS Enterprise
                      <span className={styles['badge']}>{points.length} points</span>
                    </h2>
                    <div className={styles['map-controls-group']}>
                      <div className={styles['coordinate-system-controls']}>
                        <select
                          value={coordinateSystem}
                          onChange={(e) => handleCoordinateSystemChange(e.target.value as CoordinateSystem)}
                          className={styles['system-select']}
                        >
                          <option value="WGS84">WGS84 (Lat/Lon)</option>
                          <option value="UTM">UTM</option>
                          <option value="LAMBERT">Lambert</option>
                          <option value="MERCATOR">Mercator</option>
                        </select>
                        {coordinateSystem === 'UTM' && (
                          <>
                            <select
                              value={utmZone}
                              onChange={(e) => setUtmZone(parseInt(e.target.value))}
                              className={styles['zone-select']}
                            >
                              {Array.from({ length: 4 }, (_, i) => i + 29).map(zone => (
                                <option key={zone} value={zone}>{zone}</option>
                              ))}
                            </select>
                            <select
                              value={utmHemisphere}
                              onChange={(e) => setUtmHemisphere(e.target.value as 'N')}
                              className={styles['hemisphere-select']}
                            >
                              <option value="N">Nord (N)</option>
                            </select>
                          </>
                        )}
                      </div>
                      <div className={styles['map-controls']}>
                        <button
                          className={`${styles['map-btn']} ${isDrawing ? styles['active'] : ''}`}
                          onClick={() => isCadastre && setIsDrawing(!isDrawing)}
                        >
                          <FiEdit2 /> {isDrawing ? 'Dessin Actif' : 'Dessiner'}
                        </button>
                        <button 
                          className={styles['map-btn']} 
                          onClick={calculateAreaWithArcGIS}
                        >
                          <FiRefreshCw /> Calculer
                        </button>
                        <button 
                          className={styles['map-btn']}
                          onClick={checkMiningTitleOverlaps}
                          disabled={points.length < 3}
                        >
                          <FiAlertTriangle /> Vérifier Chevauchements
                        </button>
                        <button 
                          className={styles['map-btn']}
                          onClick={() => setShowLayerPanel(!showLayerPanel)}
                        >
                          <FiLayers /> Couches
                        </button>
                      </div>
                    </div>
                  </div>
                    <ArcGISMap
                      key={`map-${coordSource}`}
                      ref={mapRef}
                      points={points}
                      superficie={superficie}
                      isDrawing={isDrawing}
                      onMapClick={handleMapClick}
                      onPolygonChange={(polygon) => {
                        if (polygon && polygon.length >= 3) {
                          const baseId = generateId();
                          const next = polygon.map((coord, index) => ({
                            id: baseId + index,
                            idTitre: points.length > 0 ? points[0].idTitre : 1007,
                            h: points.length > 0 ? points[0].h : 32,
                            x: coord[0],
                            y: coord[1],
                            system: coordinateSystem,
                            zone: coordinateSystem === "UTM" ? utmZone : undefined,
                            hemisphere: coordinateSystem === "UTM" ? utmHemisphere : undefined
                          }));
                          const sameLen = next.length === points.length;
                          const sameGeom = sameLen && next.every((p, i) => p.x === points[i].x && p.y === points[i].y);
                          if (!sameGeom) {
                            setPoints(next);
                          }
                        }
                      }}
                      existingPolygons={filteredExistingPolygons}
                      coordinateSystem={coordinateSystem}
                      utmZone={utmZone}
                      utmHemisphere={utmHemisphere}
                      labelText={permitData.code || (demandeSummary?.code_demande ?? '')}
                      adminInfo={{
                        codePermis: permitData.code || (demandeSummary?.code_demande ?? ''),
                        typePermis: permitData.type,
                        titulaire: permitData.holder,
                        wilaya: permitData.wilaya,
                        daira: permitData.daira,
                        commune: permitData.commune
                      }}
                      declaredAreaHa={typeof superficieDeclaree === 'number' ? superficieDeclaree : undefined}
                      validationSummary={{
                        sitGeoOk,
                        empietOk,
                        geomOk,
                        superfOk
                      }}
                    />
                  
                  <div className={styles['map-footer']}>
                    <div className={styles['area-display']}>
                      <span>Superficie calculée:</span>
                      <strong>{superficie.toLocaleString()} ha</strong>
                      
                      {superficieDeclaree != null && (
                        <>
                          <span style={{ marginLeft: 16 }}> | Déclarée:</span>
                          <strong> {superficieDeclaree.toLocaleString()} ha</strong>
                        </>
                      )}
                      
                      {miningTitleOverlaps.length > 0 && (
                        <>
                          <span style={{ marginLeft: 16 }}> | Chevauchements:</span>
                          <strong style={{ color: '#dc2626' }}> {miningTitleOverlaps.length} titre(s) minier(s)</strong>
                        </>
                      )}
                    </div>
                    <div className={styles['map-export']}>
                      <button className={styles['export-btn']} onClick={exportData}>
                        <FiDownload /> Exporter
                      </button>
                      <label className={styles['import-btn']}>
                        <FiUpload /> Importer
                        <input type="file" accept=".json" onChange={importData} hidden />
                      </label>
                    </div>
                  </div>
                </section>

                <section className={styles['data-panel']}>
                  <div className={styles['panel-tabs']}>
                    <button
                      className={`${styles['tab-btn']} ${activeTab === 'coordinates' ? styles['active'] : ''}`}
                      onClick={() => setActiveTab('coordinates')}
                    >
                      Coordonnées
                    </button>
                    <button
                      className={`${styles['tab-btn']} ${activeTab === 'validation' ? styles['active'] : ''}`}
                      onClick={() => setActiveTab('validation')}
                    >
                      Validation
                    </button>
                    <button
                      className={`${styles['tab-btn']} ${activeTab === 'summary' ? styles['active'] : ''}`}
                      onClick={() => setActiveTab('summary')}
                    >
                      Résumé
                    </button>
                  </div>
                  
                  <div className={styles['panel-content']}>
                    {activeTab === 'coordinates' && (
                      <>
                        <div className={styles['table-header']}>
                          <h3>Points du périmètre</h3>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <select
                              value={coordSource}
                              onChange={(e) => setCoordSource(e.target.value as 'provisoire' | 'validees')}
                              className={styles['system-select']}
                              title="Source des coordonnées"
                            >
                              <option value="provisoire">Inscription provisoire</option>
                              <option value="validees">Coordonnées validées</option>
                            </select>
                            <button className={styles['add-btn']} onClick={() => addPoint()}>
                              <FiPlus /> Ajouter
                            </button>
                            <button className={styles['add-btn']} onClick={saveCoordinatesToBackend}>
                              <FiSave /> Enregistrer les coordonnées
                            </button>
                            <button className={styles['add-btn']} onClick={() => setRefetchTrigger(prev => prev + 1)}>
                              <FiRefreshCw /> Recharger
                            </button>
                          </div>
                        </div>
                        <div className={styles['coordinates-table']}>
                          <div className={`${styles['table-row']} ${styles['header']}`}>
                            <div>#</div>
                            <div>ID Titre</div>
                            <div>Fuseau </div>
                            <div>Easting (X)</div>
                            <div>Northing (Y)</div>
                            <div>Actions</div>
                          </div>
                          {points.map((point, index) => (
                            <div className={styles['table-row']} key={point.id}>
                              <div>{index + 1}</div>
                              <div>
                                <input
                                  type="number"
                                  value={point.idTitre}
                                  onChange={(e) => handleChange(point.id, 'idTitre', e.target.value)}
                                  disabled={editableRowId !== point.id}
                                />
                              </div>
                              <div>
                                <input
                                  type="number"
                                  value={point.h}
                                  onChange={(e) => handleChange(point.id, 'h', e.target.value)}
                                  disabled={editableRowId !== point.id}
                                />
                              </div>
                              <div>
                                <input
                                  type="number"
                                  value={point.x}
                                  onChange={(e) => handleChange(point.id, 'x', e.target.value)}
                                  disabled={editableRowId !== point.id}
                                />
                              </div>
                              <div>
                                <input
                                  type="number"
                                  value={point.y}
                                  onChange={(e) => handleChange(point.id, 'y', e.target.value)}
                                  disabled={editableRowId !== point.id}
                                />
                              </div>
                              <div>
                                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                  <button
                                    className={styles['delete-btn']}
                                    style={{ display: 'none' }}
                                    onClick={() => movePointUp(index)}
                                    disabled={index === 0}
                                    title={index === 0 ? "Premier point" : "Monter"}
                                  >
                                    <FiArrowUp />
                                  </button>
                                  <button
                                    className={styles['delete-btn']}
                                    style={{ display: 'none' }}
                                    onClick={() => movePointDown(index)}
                                    disabled={index === points.length - 1}
                                    title={index === points.length - 1 ? "Dernier point" : "Descendre"}
                                  >
                                    <FiArrowDown />
                                  </button>
                                  <button
                                    className={styles['delete-btn']}
                                    style={{ display: 'none' }}
                                    onClick={() => insertPointAfter(index)}
                                    title="Insérer après"
                                  >
                                    <FiPlus />
                                  </button>
                                  <button
                                    className={styles['delete-btn']}
                                    onClick={() => setEditableRowId(prev => prev === point.id ? null : point.id)}
                                    title={editableRowId === point.id ? "Terminer la modification" : "Modifier"}
                                  >
                                    <FiEdit2 />
                                  </button>
                                  <button
                                    className={styles['delete-btn']}
                                    onClick={() => removePoint(point.id)}
                                    disabled={points.length <= 3 }
                                    title={points.length <= 3 ? "Un polygone doit avoir au moins 3 points" : "Supprimer ce point"}
                                  >
                                    <FiTrash2 />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    
                    {activeTab === 'validation' && (
                      <div className={styles['validation-section']}>
                        {/* Enhanced Overlap Detection Card */}
                        <div className={`${styles['validation-card']} ${overlapDetected ? styles['error'] : styles['success']}`}>
                          <div className={styles['card-header']}>
                            {overlapDetected ? <FiAlertTriangle /> : <FiCheckCircle />}
                            <h3>Vérification des empiétements ANAM</h3>
                          </div>
                          {overlapDetected ? (
                            <>
                              <p>Empiètements détectés avec :</p>
                              <ul>
                                {overlapPermits.map((permit, idx) => (
                                  <li key={idx}>{permit}</li>
                                ))}
                              </ul>
                              
                              {miningTitleOverlaps.length > 0 && (
                                <div className={styles['mining-overlaps']}>
                                  <h4>Détails des titres miniers chevauchants :</h4>
                                  {miningTitleOverlaps.map((title: any, idx: number) => {
                                    const typ = title.typetitre || title.codetype || 'Titre minier';
                                    const code = title.code ?? title.idtitre ?? title.objectid ?? '';
                                    const titulaire = [title.tnom, title.tprenom].filter(Boolean).join(' ').trim();
                                    const locationParts = [title.wilaya, title.daira, title.commune].filter(Boolean);
                                    const location = locationParts.join(' / ');
                                    const formatDate = (v: any) => {
                                      if (!v && v !== 0) return null;
                                      try { const d = new Date(v); if (!isNaN(d.getTime())) return d.toLocaleDateString('fr-DZ'); } catch {}
                                      return null;
                                    };
                                    const dOctroi = formatDate(title.dateoctroi);
                                    const dExp = formatDate(title.dateexpiration);
                                    return (
                                      <div key={idx} className={styles['mining-title-detail']}>
                                        <strong>{`${typ} ${title.codetype || ''} ${code}`.replace(/\s+/g,' ').trim()} {titulaire ? `— ${titulaire}` : ''}</strong>
                                        <div className={styles['title-details']}>
                                          {location && <span>Localisation: {location}</span>}
                                          {(dOctroi || dExp) && <span>Dates: {dOctroi ? `Octroi ${dOctroi}` : ''}{dOctroi && dExp ? ' — ' : ''}{dExp ? `Expiration ${dExp}` : ''}</span>}
                                          {(title.substance1 || title.substances) && <span>Substance: {title.substance1 || title.substances}</span>}
                                          {title.sig_area && <span>Superficie: {title.sig_area} ha</span>}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                              
                              <textarea
                                placeholder="Ajouter une remarque sur ces empiétements..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className={styles['overlap-comment']}
                              />
                            </>
                          ) : (
                            <p>Aucun empiètement détecté avec les titres miniers ANAM</p>
                          )}
                          
                          <div className={styles['validation-actions']}>
                            <button
                              className={styles['map-btn']}
                              onClick={checkMiningTitleOverlaps}
                              disabled={points.length < 3}
                            >
                          <FiRefreshCw /> Re-vérifier
                            </button>
                          </div>
                        </div>

                        {/* Keep your existing validation cards */}
                        <div className={`${styles['validation-card']} ${!polygonValid || !allFilled || !isPolygonValid ? styles['warning'] : styles['success']}`}>
                          <div className={styles['card-header']}>
                            {!polygonValid || !allFilled || !isPolygonValid ? <FiAlertTriangle /> : <FiCheckCircle />}
                            <h3>Validation du polygone</h3>
                          </div>
                          {!polygonValid && <p>• Au moins 4 points requis pour former un polygone</p>}
                          {!allFilled && <p>• Toutes les coordonnées doivent être renseignées</p>}
                          {!isPolygonValid && <p>• Le polygone est géométriquement invalide</p>}
                          {polygonValid && allFilled && isPolygonValid && <p>Le polygone est valide</p>}
                        </div>

                        <div className={styles['validation-card']}>
                          <div className={styles['card-header']}>
                            <h3>Vérification cadastrale</h3>
                          </div>
                          <div className={styles['info-grid']}>
                            <div>
                              <label>Situation géographique OK</label>
                              <input type="checkbox" checked={sitGeoOk} onChange={(e) => setSitGeoOk(e.target.checked)} />
                            </div>
                            <div>
                              <label>Absence d'empiétements</label>
                              <input type="checkbox" checked={empietOk} onChange={(e) => setEmpietOk(e.target.checked)} />
                            </div>
                            <div>
                              <label>Géométrie correcte</label>
                              <input type="checkbox" checked={geomOk} onChange={(e) => setGeomOk(e.target.checked)} />
                            </div>
                            <div>
                              <label>Superficie conforme</label>
                              <input type="checkbox" checked={superfOk} onChange={(e) => setSuperfOk(e.target.checked)} />
                            </div>
                            <div>
                              <label>Superficie déclarée (ha)</label>
                              <input value={superficieDeclaree ?? ''} onChange={() => {}} disabled />
                            </div>
                            <div>
                              <label>Superficie cadastrale (ha)</label>
                              <input
                                type="number"
                                value={(superficieCadastrale ?? superficie) || 0}
                                onChange={(e) => setSuperficieCadastrale(parseFloat(e.target.value))}
                              />
                            </div>
                          </div>
                          <div style={{ marginTop: 8 }}>
                            <button
                              className={styles['map-btn']}
                              onClick={async () => {
                                if (!idDemande) return;
                                try {
                                  await axios.post(`${apiURL}/verification-geo/demande/${idDemande}`, {
                                    sit_geo_ok: sitGeoOk,
                                    empiet_ok: empietOk && !overlapDetected, // Auto-set based on overlap detection
                                    geom_ok: geomOk,
                                    superf_ok: superfOk,
                                    superficie_cadastrale: typeof superficieCadastrale === 'number' ? superficieCadastrale : superficie,
                                  });
                                  setSuccess('Vérification cadastrale enregistrée');
                                  setTimeout(() => setSuccess(null), 3000);
                                } catch (e) {
                                  setError("Erreur lors de l'enregistrement de la vérification cadastrale");
                                  setTimeout(() => setError(null), 4000);
                                }
                              }}
                            >
                              Enregistrer la vérification
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'summary' && (
                      <div className={styles['summary-section']}>
                        <div className={styles['summary-card']}>
                          <h3>Informations administratives</h3>
                          <div className={styles['info-grid']}>
                            <div>
                              <label>Code permis</label>
                              <input
                                value={permitData.code}
                                onChange={(e) => setPermitData({ ...permitData, code: e.target.value })}
                               // disabled={!isCadastre}
                              />
                            </div>
                            <div>
                              <label>Type permis</label>
                              <input
                                value={permitData.type}
                                onChange={(e) => setPermitData({ ...permitData, type: e.target.value })}
                              //  disabled={!isCadastre}
                              />
                            </div>
                            <div>
                              <label>Titulaire</label>
                              <input
                                value={permitData.holder}
                                onChange={(e) => setPermitData({ ...permitData, holder: e.target.value })}
                              //  disabled={!isCadastre}
                              />
                            </div>
                            <div>
                              <label>Wilaya</label>
                              <input
                                value={permitData.wilaya}
                                onChange={(e) => setPermitData({ ...permitData, wilaya: e.target.value })}
                             //   disabled={!isCadastre}
                              />
                            </div>
                            <div>
                              <label>Daira</label>
                              <input
                                value={permitData.daira}
                                onChange={(e) => setPermitData({ ...permitData, daira: e.target.value })}
                               // disabled={!isCadastre}
                              />
                            </div>
                            <div>
                              <label>Commune</label>
                              <input
                                value={permitData.commune}
                                onChange={(e) => setPermitData({ ...permitData, commune: e.target.value })}
                               // disabled={!isCadastre}
                              />
                            </div>
                          </div>
                        </div>
                        <div className={styles['summary-card']}>
                          <h3>Caractéristiques techniques</h3>
                          <div className={styles['info-grid']}>
                            <div>
                              <label>Nombre de points</label>
                              <p>{points.length}</p>
                            </div>
                            <div>
                              <label>Superficie</label>
                              <p>{superficie.toLocaleString()} ha</p>
                            </div>
                            <div>
                              <label>Statut validation</label>
                              <p className={polygonValid && allFilled ? styles['valid'] : styles['invalid']}>
                                {polygonValid && allFilled ? 'Valide' : 'Non valide'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={styles['panel-actions']}>
                    <button className={styles['secondary-btn']} 
                   // disabled={!isCadastre || statutProc === 'TERMINEE' || !statutProc}
                    >
                      <FiChevronLeft /> Retour
                    </button>
                    <div className={styles['action-group']}>
                      <button className={styles['secondary-btn']} 
                     // disabled={!isCadastre || statutProc === 'TERMINEE' || !statutProc}
                      >
                        Enregistrer brouillon
                      </button>
                      <button
                              className={styles['map-btn']}
                              style={{ marginLeft: 8 }}
                              onClick={async () => {
                                if (!idProc) return;
                                try {
                                  // Persist superficie cadastrale into Demande before promotion
                                  if (idDemande && typeof superficieCadastrale === 'number') {
                                    await axios.post(`${apiURL}/verification-geo/demande/${idDemande}`, {
                                      superficie_cadastrale: superficieCadastrale,
                                    });
                                  }
                                  await axios.post(`${apiURL}/inscription-provisoire/promote/${idProc}`);
                                  // Reload definitive coordinates
                                  const res = await axios.get(`${apiURL}/coordinates/procedure/${idProc}`);
                                  const coords = res.data;
                                  const safeCoords = (coords ?? []).filter((c: any) => c?.coordonnee?.x !== undefined && c?.coordonnee?.y !== undefined);
                                  const mappedPoints = safeCoords.map((c: any) => {
                                    const point = c.coordonnee;
                                    return {
                                      id: point.id,
                                      idTitre: point.idTitre || 1007,
                                      h: point.h || 32,
                                      x: point.x,
                                      y: point.y,
                                      system: point.system || 'UTM',
                                      zone: point.system === 'UTM' ? (point.zone || utmZone) : undefined,
                                      hemisphere: point.system === 'UTM' ? (point.hemisphere || utmHemisphere) : undefined
                                    };
                                  });
                                  setPoints(mappedPoints);
                                  setSuccess('Périmètres validés et promus');
                                  setTimeout(() => setSuccess(null), 3000);
                                } catch (e) {
                                  setError('Échec de la promotion des périmètres');
                                  setTimeout(() => setError(null), 4000);
                                }
                              }}
                            //  disabled={!statutProc}
                            >
                              Valider les périmètres
                            </button>
                    </div>
                  </div>
                </section>
              </div>
              {auth.role !== 'cadastre' && (
                <>
                  <div className={`${styles['navigation-buttons']} ${styles['top-buttons']}`}>
                    <button className={`${styles['btn']} ${styles['btn-outline']}`} onClick={handleBack}>
                      <FiChevronLeft className={styles['btn-icon']} />
                      Précédent
                    </button>
                    <button
                      className={styles['btnSave']}
                      onClick={handleSaveEtape}
                    //  disabled={savingEtape || statutProc === 'TERMINEE' || !statutProc}
                    >
                      <BsSave className={styles['btnIcon']} /> {savingEtape ? "Sauvegarde en cours..." : "Sauvegarder l'étape"}
                    </button>
                    <button
                      className={`${styles['btn']} ${styles['btn-primary']}`}
                      onClick={handleNext}
                     // disabled={isLoading}
                    >
                      Suivant
                      <FiChevronRight className={styles['btn-icon']} />
                    </button>
                  </div>
                  <div className={styles['etapeSaveSection']}>
                    {success && (
                      <div className={`${styles['etapeMessage']} ${styles['success']}`}>
                        {success}
                      </div>
                    )}
                    {error && (
                      <div className={`${styles['etapeMessage']} ${styles['error']}`}>
                        {error}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          {success && (
            <div className={`${styles.toast} ${styles.toastSuccess}`}>
              <FiCheckCircle className={styles.toastIcon} />
              <span>{success}</span>
            </div>
          )}
          {error && (
            <div className={`${styles.toast} ${styles.toastError}`}>
              <FiAlertTriangle className={styles.toastIcon} />
              <span>{error}</span>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

















