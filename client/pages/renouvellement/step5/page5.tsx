'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  FiPlus,
  FiTrash2,
  FiCheckCircle,
  FiAlertTriangle,
  FiMapPin,
  FiEdit2,
  FiRefreshCw,
  FiChevronLeft,
  FiSave,
  FiDownload,
  FiUpload,
  FiChevronRight
} from 'react-icons/fi';
import * as turf from '@turf/turf';
import styles from '@/pages/demande/step5/cadastre.module.css';
import { useRouter } from 'next/router';
import axios from 'axios';
import Navbar from '../../navbar/Navbar';
import Sidebar from '../../sidebar/Sidebar';
import { useAuthStore } from '../../../src/store/useAuthStore';
import { useSearchParams } from '@/src/hooks/useSearchParams';
import { BsSave } from 'react-icons/bs';
import { useViewNavigator } from '../../../src/hooks/useViewNavigator';
import ProgressStepper from '../../../components/ProgressStepper';
import { STEP_LABELS } from '../../../src/constants/steps';
import { useActivateEtape } from '@/src/hooks/useActivateEtape';
import router from 'next/router';
import { Phase, Procedure, ProcedureEtape, ProcedurePhase, StatutProcedure } from '@/src/types/procedure';
import proj4 from 'proj4';
//import ArcGISMap from '@/components/map/DynamicArcGISMap'; // cleaner with `@` alias
const ArcGISMap = dynamic(() => import('@/components/map/ArcGISMap'), { ssr: false });

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
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTab, setActiveTab] = useState('coordinates');
  const [comment, setComment] = useState('');
  const [overlapDetected, setOverlapDetected] = useState(false);
  const [overlapPermits, setOverlapPermits] = useState<string[]>([]);
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
  const { currentView, navigateTo } = useViewNavigator();
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
  const [utmZone, setUtmZone] = useState<number>(31); // Default UTM zone
  const [utmHemisphere, setUtmHemisphere] = useState<'N'>('N'); // Default Northern hemisphere
const [activatedSteps, setActivatedSteps] = useState<Set<number>>(new Set());

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
        console.error("❌ Failed to fetch summary", error);
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

  const [existingPolygons, setExistingPolygons] = useState<{idProc: number; num_proc: string; coordinates: [number, number][]}[]>([]);

  useEffect(() => {
    const fetchExisting = async () => {
      try {
        const res = await axios.get(`${apiURL}/coordinates/existing`);
        const polygons = res.data.map((poly: any) => ({
          idProc: poly.idProc,
          num_proc: poly.num_proc,
          coordinates: poly.coordinates.map((coord: [number, number]) => [
            coord[0],
            coord[1]
          ])
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

  useEffect(() => {
    if (!idProc) return;
    const fetchCoordinates = async () => {
      try {
        const res = await axios.get(`${apiURL}/coordinates/procedure/${idProc}`);
        const coords = res.data;
        const safeCoords = (coords ?? []).filter((c: any) => {
          const point = c?.coordonnee;
          return typeof point?.x !== 'undefined' && typeof point?.y !== 'undefined';
        });
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
        if (mappedPoints.length > 0 && mappedPoints[0].system) {
          setCoordinateSystem(mappedPoints[0].system);
          if (mappedPoints[0].zone) setUtmZone(mappedPoints[0].zone);
          if (mappedPoints[0].hemisphere) setUtmHemisphere(mappedPoints[0].hemisphere);
        }
      } catch (err) {
        console.error('❌ Failed to load coordinates:', err);
        setError('Failed to load coordinates');
        setTimeout(() => setError(null), 4000);
      }
    };
    fetchCoordinates();
  }, [idProc, utmZone, utmHemisphere]);

  const saveCoordinatesToBackend = async () => {
    if (!points || points.length < 3) {
      setError("Le polygone doit contenir au moins 3 points.");
      setTimeout(() => setError(null), 4000);
      return;
    }
    try {
      await axios.post(`${apiURL}/coordinates/update`, {
        id_proc: idProc,
        id_zone_interdite: null,
        points,
        superficie
      });
      setSuccess("✅ Coordonnées sauvegardées avec succés !");
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      console.error("❌ Erreur lors de la sauvegarde des coordonnées:", err);
      setError("❌ échec de la sauvegarde des coordonnées.");
      setTimeout(() => setError(null), 4000);
    }
  };

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
        console.error('❌ Failed to fetch demande:', error);
        setError('Failed to fetch demande data');
        setTimeout(() => setError(null), 4000);
      }
    };
    fetchDemande();
  }, [router.isReady, router.query.id]);

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

  const handleSaveEtape = async () => {
    if (!idProc) {
      setError("ID procédure manquant !");
      setTimeout(() => setError(null), 4000);
      return;
    }
    setSavingEtape(true);
    try {
      await axios.post(`${apiURL}/api/procedure-etape/finish/${idProc}/5`);
      setSuccess("étape 5 enregistrée avec succés !");
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
    existingPolygons.forEach(({ num_proc, coordinates: existingCoords }) => {
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
    setOverlapDetected(overlappingSites.length > 0);
    setOverlapPermits(overlappingSites);
  }, [points, existingPolygons]);

  const handleMapClick = useCallback((x: number, y: number) => {
    if (isDrawing) {
      addPoint({ x, y });
    }
  }, [isDrawing, addPoint]);

  useEffect(() => {
    calculateArea();
    checkForOverlaps();
  }, [points, calculateArea, checkForOverlaps]);

  const polygonValid = points.length >= 4 && hasUniqueCoords;
  const allFilled = points.every(p => !isNaN(p.x) && !isNaN(p.y) && !isNaN(p.h));

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
                <h1>Définir le périmétre du permis minier</h1>
                <p className={styles['subtitle']}>Délimitation géographique et vérification des empiétements territoriaux</p>
              </header>
              <div className={styles['app-layout']}>
                <section className={styles['map-container']}>
                  <div className={styles['map-header']}>
                    <h2>
                      <FiMapPin /> Carte interactive
                      <span className={styles['badge']}>{points.length} points</span>
                    </h2>
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
                        //disabled={!isCadastre || statutProc === 'TERMINEE' || !statutProc}
                      >
                        <FiEdit2 /> {isDrawing ? 'Mode dessin actif' : 'Dessiner un polygone'}
                      </button>
                      <button className={styles['map-btn']} onClick={calculateArea} 
                      //disabled={!isCadastre || statutProc === 'TERMINEE' || !statutProc}
                      >
                        <FiRefreshCw /> Calculer superficie
                      </button>
                    </div>
                  </div>
                  <ArcGISMap
                    ref={mapRef}
                    points={points}
                    superficie={superficie}
                    isDrawing={isDrawing}
                    onMapClick={handleMapClick}
                    onPolygonChange={(polygon) => {
                      if (polygon && polygon.length >= 3) {
                        setPoints(polygon.map((coord, index) => ({
                          id: generateId(),
                          idTitre: points.length > 0 ? points[0].idTitre : 1007,
                          h: points.length > 0 ? points[0].h : 32,
                          x: coord[0],
                          y: coord[1],
                          system: coordinateSystem,
                          zone: coordinateSystem === "UTM" ? utmZone : undefined,
                          hemisphere: coordinateSystem === "UTM" ? utmHemisphere : undefined
                        })));
                      }
                    }}
                    existingPolygons={existingPolygons}
                    coordinateSystem={coordinateSystem}
                    utmZone={utmZone}
                    utmHemisphere={utmHemisphere}
                  />
                  <div className={styles['map-footer']}>
                    <div className={styles['area-display']}>
                      <span>Superficie calculée:</span>
                      <strong>{superficie.toLocaleString()} ha</strong>
                    </div>
                    <div className={styles['map-export']}>
                      <button className={styles['export-btn']} onClick={exportData}
                      // disabled={statutProc === 'TERMINEE' || !statutProc}
                       >
                        <FiDownload /> Exporter
                      </button>
                      <label className={styles['import-btn']}>
                        <FiUpload /> Importer
                        <input type="file" accept=".json" onChange={importData} hidden
                        // disabled={!isCadastre} 
                         />
                      </label>
                    </div>
                  </div>
                </section>
                <section className={styles['data-panel']}>
                  <div className={styles['panel-tabs']}>
                    <button
                      className={`${styles['tab-btn']} ${activeTab === 'coordinates' ? styles['active'] : ''}`}
                      onClick={() => setActiveTab('coordinates')}
                    //  disabled={statutProc === 'TERMINEE' || !statutProc}
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
                          <h3>Points du périmétre</h3>
                          {isCadastre && (
                            <button className={styles['add-btn']} onClick={() => addPoint()} 
                           // disabled={statutProc === 'TERMINEE' || !statutProc}
                            >
                              <FiPlus /> Ajouter
                            </button>
                          )}
                        </div>
                        <div className={styles['coordinates-table']}>
                          <div className={`${styles['table-row']} ${styles['header']}`}>
                            <div>#</div>
                            <div>ID Titre</div>
                            <div>Fuseau</div>
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
                                //  disabled={!isCadastre}
                                />
                              </div>
                              <div>
                                <input
                                  type="number"
                                  value={point.h}
                                  onChange={(e) => handleChange(point.id, 'h', e.target.value)}
                                 // disabled={!isCadastre}
                                />
                              </div>
                              <div>
                                <input
                                  type="number"
                                  value={point.x}
                                  onChange={(e) => handleChange(point.id, 'x', e.target.value)}
                                 // disabled={!isCadastre}
                                />
                              </div>
                              <div>
                                <input
                                  type="number"
                                  value={point.y}
                                  onChange={(e) => handleChange(point.id, 'y', e.target.value)}
                                //  disabled={!isCadastre}
                                />
                              </div>
                              <div>
                                <button
                                  className={styles['delete-btn']}
                                  onClick={() => removePoint(point.id)}
                                 // disabled={points.length <= 3 || !isCadastre || statutProc === 'TERMINEE' || !statutProc}
                                  title={!isCadastre ? "Non autorisé" : points.length <= 3 ? "Un polygone doit avoir au moins 3 points" : "Supprimer ce point"}
                                >
                                  <FiTrash2 />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    {activeTab === 'validation' && (
                      <div className={styles['validation-section']}>
                        <div className={`${styles['validation-card']} ${overlapDetected ? styles['error'] : styles['success']}`}>
                          <div className={styles['card-header']}>
                            {overlapDetected ? <FiAlertTriangle /> : <FiCheckCircle />}
                            <h3>Vérification des empiétements</h3>
                          </div>
                          {overlapDetected ? (
                            <>
                              <p>Empiétements détectés avec les permis suivants :</p>
                              <ul>
                                {overlapPermits.map((permit, idx) => (
                                  <li key={idx}>{permit}</li>
                                ))}
                              </ul>
                              <textarea
                                placeholder="Ajouter une remarque sur cet empiétement..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                               // disabled={!isCadastre}
                              />
                            </>
                          ) : (
                            <p>Aucun empiétement détecté</p>
                          )}
                        </div>
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
                             //   disabled={!isCadastre}
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
                              //  disabled={!isCadastre}
                              />
                            </div>
                            <div>
                              <label>Daira</label>
                              <input
                                value={permitData.daira}
                                onChange={(e) => setPermitData({ ...permitData, daira: e.target.value })}
                              //  disabled={!isCadastre}
                              />
                            </div>
                            <div>
                              <label>Commune</label>
                              <input
                                value={permitData.commune}
                                onChange={(e) => setPermitData({ ...permitData, commune: e.target.value })}
                             //   disabled={!isCadastre}
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
                    //  disabled={!isCadastre || statutProc === 'TERMINEE' || !statutProc}
                      >
                        Enregistrer brouillon
                      </button>
                      <button
                        className={styles['primary-btn']}
                        //disabled={!polygonValid || !allFilled || !isCadastre || statutProc === 'TERMINEE' || !statutProc}
                        onClick={saveCoordinatesToBackend}
                      >
                        <FiSave /> Valider le périmétre
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
                   //   disabled={savingEtape || statutProc === 'TERMINEE' || !statutProc}
                    >
                      <BsSave className={styles['btnIcon']} /> {savingEtape ? "Sauvegarde en cours..." : "Sauvegarder l'étape"}
                    </button>
                    <button
                      className={`${styles['btn']} ${styles['btn-primary']}`}
                      onClick={handleNext}
                    //  disabled={isLoading}
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
