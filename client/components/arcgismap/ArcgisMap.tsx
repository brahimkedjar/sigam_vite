// components/map/ArcGISMap.tsx
'use client';
// Configure ArcGIS before importing other @arcgis/core modules
import '../../src/config/arcgis-config';
import '@arcgis/core/assets/esri/themes/light/main.css';
import { forwardRef, useRef, useEffect, useImperativeHandle, useState } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Basemap from '@arcgis/core/Basemap';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import Polygon from '@arcgis/core/geometry/Polygon';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import TextSymbol from '@arcgis/core/symbols/TextSymbol';
import Sketch from '@arcgis/core/widgets/Sketch';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';
import * as proj4 from 'proj4';
import esriConfig from '@arcgis/core/config';
import * as print from '@arcgis/core/rest/print';
import PrintParameters from '@arcgis/core/rest/support/PrintParameters';
import PrintTemplate from '@arcgis/core/rest/support/PrintTemplate';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Configure ArcGIS Enterprise portal
try { esriConfig.portalUrl = "https://sig.anam.dz/portal"; } catch {}

// Strip app-level custom headers from ArcGIS/ANAM/CDN requests to avoid CORS issues
if (typeof window !== 'undefined') {
  try {
    const req = esriConfig.request as any;
    req.corsEnabledServers = req.corsEnabledServers || [];
    const corsServers = req.corsEnabledServers as string[];
    const ensure = (h: string) => { if (!corsServers.includes(h)) corsServers.push(h); };
    [
      'sig.anam.dz',
      'sig.anam.dz:443',
      'cdn.arcgis.com',
      'js.arcgis.com',
      'services.arcgisonline.com',
      'server.arcgisonline.com',
      'basemaps.arcgis.com',
      'tiles.arcgis.com'
    ].forEach(ensure);

    const key = '__SIGAM_ARCGIS_INTERCEPTOR__';
    const w = window as any;
    if (!w[key]) {
      esriConfig.request.interceptors!.push({
        // Provide a types-compatible list of host patterns; do final hostname verification in `before`
        urls: [
          'sig.anam.dz',
          /\.arcgis\.com$/,
          /\.arcgisonline\.com$/,
          'cdn.arcgis.com'
        ],
        before: (params: any) => {
          try {
            // Determine the request URL from available params locations
            const urlStr = params.url || params.requestOptions?.url || '';
            const u = new URL(urlStr, window.location.origin);
            const h = u.hostname.toLowerCase();
            // Only modify headers/credentials for the intended hosts
            if (
              h === 'sig.anam.dz' ||
              h.endsWith('.arcgis.com') ||
              h.endsWith('arcgisonline.com') ||
              h === 'cdn.arcgis.com'
            ) {
              const headers = new Headers(params.requestOptions?.headers || {});
              headers.delete('X-User-Id');
              headers.delete('x-user-id');
              headers.delete('X-User-Name');
              headers.delete('x-user-name');
              params.requestOptions = {
                ...params.requestOptions,
                headers,
                credentials: 'omit'
              };
            }
          } catch {}
          return params;
        }
      });
      w[key] = true;
    }
  } catch {}
}

export type CoordinateSystem = 'WGS84' | 'UTM' | 'LAMBERT' | 'MERCATOR';

export type Coordinate = {
  id: number;
  idTitre: number;
  h: number;
  x: number;
  y: number;
  system: CoordinateSystem;
  zone?: number;
  hemisphere?: 'N';
};

export interface ArcGISMapProps {
  points: Coordinate[];
  superficie: number;
  isDrawing: boolean;
  onMapClick?: (x: number, y: number) => void;
  onPolygonChange?: (coordinates: [number, number][]) => void;
  existingPolygons?: { idProc: number; num_proc: string; coordinates: [number, number][] }[];
  layerType?: string;
  coordinateSystem?: CoordinateSystem;
  utmZone?: number;
  utmHemisphere?: 'N';
  editable?: boolean;
  labelText?: string;
  // Optional: administrative info for reports
  adminInfo?: {
    codePermis?: string;
    typePermis?: string;
    titulaire?: string;
    wilaya?: string;
    daira?: string;
    commune?: string;
  };
  declaredAreaHa?: number; // Superficie déclarée
  validationSummary?: { // Validation flags to display in PDF
    sitGeoOk?: boolean;
    empietOk?: boolean;
    geomOk?: boolean;
    superfOk?: boolean;
  };
}

export interface ArcGISMapRef {
  getPoints: () => Coordinate[];
  resetMap: () => void;
  calculateArea: () => number;
  // Returns null if service unreachable or query fails
  queryMiningTitles: (geometry?: any) => Promise<any[] | null>;
}

export const ArcGISMap = forwardRef<ArcGISMapRef, ArcGISMapProps>(({ 
  points,
  superficie,
  isDrawing,
  onMapClick,
  onPolygonChange,
  existingPolygons = [],
  layerType = 'titres',
  coordinateSystem = 'UTM',
  utmZone = 31,
  utmHemisphere = 'N',
  editable = true,
  labelText,
  adminInfo,
  declaredAreaHa,
  validationSummary
}, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<MapView | null>(null);
  const graphicsLayerRef = useRef<GraphicsLayer | null>(null);
  const markersLayerRef = useRef<GraphicsLayer | null>(null);
  const existingPolygonsLayerRef = useRef<GraphicsLayer | null>(null);
  const titresLayerRef = useRef<FeatureLayer | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [enterpriseLayers, setEnterpriseLayers] = useState<any[]>([]);
  const [activeLayers, setActiveLayers] = useState<{[key: string]: boolean}>({
    titres: true,
    exploration: true,
    perimetres: true
  });
  const [isLayerPanelOpen, setIsLayerPanelOpen] = useState(true);
  const [selectedTitreAttributes, setSelectedTitreAttributes] = useState<any | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  // Guard to avoid duplicate MapView initialization in React StrictMode (dev)
  const initializedRef = useRef<boolean>(false);
  const polygonGraphicRef = useRef<Graphic | null>(null);
  const sketchRef = useRef<Sketch | null>(null);
  const [editingEnabled, setEditingEnabled] = useState(false);

  // YOUR ACTUAL ENTERPRISE SERVICE URLs
  const enterpriseServices = {
    // Mining titles - your main service
    titresMinieres: "https://sig.anam.dz/server/rest/services/Hosted/Titres_Miniers/FeatureServer/0",
    
    // Exploration data
    exploration: "https://sig.anam.dz/server/rest/services/Hosted/Exploration/FeatureServer/0",
    explorationView: "https://sig.anam.dz/server/rest/services/Hosted/Exploration_view/FeatureServer/0",
    
    // Promotion perimeters
    perimetresPromotion: "https://sig.anam.dz/server/rest/services/Hosted/périmètres_de_promotion/FeatureServer/0",
    
    // Survey data
    surveyResults: "https://sig.anam.dz/server/rest/services/Hosted/survey123_4997f19f3bdf42e9babef2713d3dce97_results/FeatureServer/0",
    
    // Utility services
    geometryService: "https://sig.anam.dz/server/rest/services/Utilities/Geometry/GeometryServer",
    printingService: "https://sig.anam.dz/server/rest/services/Utilities/PrintingTools/GPServer",
    
    // Sample basemap (you might want to add your own basemaps later)
    sampleWorldCities: "https://sig.anam.dz/server/rest/services/SampleWorldCities/MapServer"
  };

  // Use a safe, percent-encoded URL for the service name with accents
  const perimetresPromotionUrl = "https://sig.anam.dz/server/rest/services/Hosted/p%C3%A9rim%C3%A8tres_de_promotion/FeatureServer/0";
  
  // Allow disabling enterprise layers entirely in local/dev via env
  // Vite exposes env as import.meta.env; any string 'true' enables this toggle
  const DISABLE_ENTERPRISE_LAYERS = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_ARCGIS_DISABLE_ENTERPRISE === 'true');

  // Coordinate conversion functions (same as before)
  const convertToWGS84 = (point: Coordinate): [number, number] => {
    try {
      switch (point.system) {
        case 'WGS84':
          return [point.x, point.y];
        case 'UTM':
          const zone = point.zone ?? utmZone;
          const hemisphere = point.hemisphere ?? utmHemisphere;
          if (!zone || !hemisphere) {
            console.warn(`UTM coordinate missing zone or hemisphere for point ${point.id}, using defaults: zone=${utmZone}, hemisphere=${utmHemisphere}`);
          }
          const zoneCode = zone.toString().padStart(2, '0');
          const sourceProj = hemisphere === 'N' 
            ? `EPSG:326${zoneCode}` 
            : `EPSG:327${zoneCode}`;
          const convertedUTM = proj4.default(sourceProj, 'EPSG:4326', [point.x, point.y]);
          return [convertedUTM[0], convertedUTM[1]];
        case 'LAMBERT':
          let lambertZone = 'EPSG:30491';
          if (point.x > 1000000 && point.x < 2000000) {
            lambertZone = 'EPSG:30492';
          } else if (point.x >= 2000000) {
            lambertZone = 'EPSG:30493';
          }
          const convertedLambert = proj4.default(lambertZone, 'EPSG:4326', [point.x, point.y]);
          return [convertedLambert[0], convertedLambert[1]];
        case 'MERCATOR':
          const convertedMercator = proj4.default('EPSG:3857', 'EPSG:4326', [point.x, point.y]);
          return [convertedMercator[0], convertedMercator[1]];
        default:
          throw new Error(`Unsupported coordinate system: ${point.system}`);
      }
    } catch (error) {
      console.error(`Coordinate conversion error for point ${point.id}:`, error);
      return [0, 0];
    }
  };

  const convertFromWGS84 = (lng: number, lat: number, targetSystem: CoordinateSystem, targetZone?: number, targetHemisphere?: 'N'): [number, number] => {
    try {
      switch (targetSystem) {
        case 'WGS84':
          return [lng, lat];
        case 'UTM':
          const zone = targetZone ?? utmZone;
          const hemisphere = targetHemisphere ?? utmHemisphere;
          if (!zone || !hemisphere) {
            throw new Error('UTM conversion requires zone and hemisphere');
          }
          const zoneCode = zone.toString().padStart(2, '0');
          const targetProj = hemisphere === 'N' 
            ? `EPSG:326${zoneCode}` 
            : `EPSG:327${zoneCode}`;
          const convertedUTM = proj4.default('EPSG:4326', targetProj, [lng, lat]);
          return [convertedUTM[0], convertedUTM[1]];
        case 'LAMBERT':
          let lambertZone = 'EPSG:30491';
          if (lng > 6 && lng <= 12) {
            lambertZone = 'EPSG:30492';
          } else if (lng > 12) {
            lambertZone = 'EPSG:30493';
          }
          const convertedLambert = proj4.default('EPSG:4326', lambertZone, [lng, lat]);
          return [convertedLambert[0], convertedLambert[1]];
        case 'MERCATOR':
          const convertedMercator = proj4.default('EPSG:4326', 'EPSG:3857', [lng, lat]);
          return [convertedMercator[0], convertedMercator[1]];
        default:
          throw new Error(`Unsupported target coordinate system: ${targetSystem}`);
      }
    } catch (error) {
      console.error('Coordinate conversion error:', error);
      return [0, 0];
    }
  };

  // Function to query mining titles that intersect with current polygon
  const queryMiningTitles = async (geometry?: any): Promise<any[] | null> => {
    if (!viewRef.current) return null;

    try {
      const queryLayer = new FeatureLayer({
        url: enterpriseServices.titresMinieres
      });

      // Use provided geometry or create from current points
      let queryGeometry = geometry;
      if (!queryGeometry && points.length >= 3) {
        const validPoints = points.filter(p => !isNaN(p.x) && !isNaN(p.y));
        const wgs84Points = validPoints.map(point => convertToWGS84(point));
        
        queryGeometry = new Polygon({
          rings: [wgs84Points.map(coord => [coord[0], coord[1]])],
          spatialReference: { wkid: 4326 }
        });
      }

      const query = {
        geometry: queryGeometry,
        spatialRelationship: "intersects" as any,
        outFields: ["*"],
        returnGeometry: true
      };

      const result = await queryLayer.queryFeatures(query);
      const attributes = result.features.map(feature => feature.attributes);
      // Log all attributes received for debugging/inspection
      try { console.log('Titres miniers - attributs reçus (query):', attributes); } catch {}
      return attributes;
      
    } catch (error) {
      console.error('Error querying mining titles:', error);
      return null;
    }
  };

  useImperativeHandle(ref, () => ({
    getPoints: () => points,
    resetMap: () => {
      if (graphicsLayerRef.current) {
        graphicsLayerRef.current.removeAll();
      }
    },
    calculateArea: () => {
      if (points.length < 3) return 0;
      
      const validPoints = points.filter(p => !isNaN(p.x) && !isNaN(p.y));
      if (validPoints.length < 3) return 0;

      try {
        const coordinates = validPoints.map(point => {
          if (point.system === 'WGS84') {
            return [point.x, point.y];
          } else {
            return convertToWGS84(point);
          }
        });

        // Close the polygon if not closed
        const first = coordinates[0];
        const last = coordinates[coordinates.length - 1];
        const finalCoordinates = [...coordinates];
        if (first[0] !== last[0] || first[1] !== last[1]) {
          finalCoordinates.push([...first]);
        }

        // Create ArcGIS polygon
        const polygon = new Polygon({
          rings: [finalCoordinates.map(coord => [coord[0], coord[1]])],
          spatialReference: { wkid: 4326 }
        });

        // Calculate area in square meters
        const area = geometryEngine.planarArea(polygon, 'square-meters');
        return area ? area / 10000 : 0; // Convert to hectares
      } catch (error) {
        console.error('Area calculation error:', error);
        return 0;
      }
    },
    queryMiningTitles
  }));

  // Function to add Enterprise layers to the map
  const addEnterpriseLayers = async (map: Map) => {
    const layers = [];

    try {
      // Note: Do not add external MapImageLayer as a baselayer to avoid blocking map when ANAM DNS is unreachable.

      // Add Mining Titles Layer (YOUR MAIN SERVICE)
      const titresLayer = new FeatureLayer({
        url: enterpriseServices.titresMinieres,
        title: "Titres Miniers ANAM",
        outFields: ["*"],
        opacity: activeLayers.titres ? 0.7 : 0,
        popupTemplate: {
          title: "{typetitre} — {tnom}",
          content: [
            {
              type: 'fields',
              fieldInfos: [
                { fieldName: 'typetitre', label: 'Type' },
                { fieldName: 'codetype', label: 'Code Type' },
                { fieldName: 'code', label: 'Code' },
                { fieldName: 'idtitre', label: 'ID Titre' },
                { fieldName: 'tnom', label: 'Titulaire' },
                { fieldName: 'tprenom', label: 'Prénom titulaire' },
                { fieldName: 'substance1', label: 'Substance' },
                { fieldName: 'sig_area', label: 'Superficie (ha)' },
                { fieldName: 'wilaya', label: 'Wilaya' },
                { fieldName: 'daira', label: 'Daira' },
                { fieldName: 'commune', label: 'Commune' },
                { fieldName: 'carte', label: 'Carte' },
                { fieldName: 'lieudit', label: 'Lieu-dit' },
                { fieldName: 'dateoctroi', label: "Date d'octroi", format: { dateFormat: 'short-date' } as any },
                { fieldName: 'dateexpiration', label: 'Date d\'expiration', format: { dateFormat: 'short-date' } as any },
                { fieldName: 'objectid', label: 'OBJECTID' }
              ]
            }
          ] as any
        },
        renderer: {
          type: "simple",
          symbol: {
            type: "simple-fill",
            color: [255, 0, 0, 0.3],
            outline: {
              color: [255, 0, 0],
              width: 2
            }
          }
        } as any
      });
      try {
        await titresLayer.load();
        map.add(titresLayer);
        layers.push(titresLayer);
        // Keep a ref for hitTest logging
        titresLayerRef.current = titresLayer;
        try { console.log('Titres miniers - champs disponibles:', (titresLayer.fields || []).map((f: any) => f.name)); } catch {}
      } catch (e) {
        console.warn('Skipped Titres Miniers layer: service unreachable.', e);
      }

      // Add Exploration Layer
      const explorationLayer = new FeatureLayer({
        url: enterpriseServices.exploration,
        title: "Zones d'Exploration",
        outFields: ["*"],
        opacity: activeLayers.exploration ? 0.6 : 0,
        popupTemplate: {
          title: "Zone d'Exploration: {NOM}",
          content: `
            <div class="popup-content">
              <p><strong>Type:</strong> {TYPE_EXPLORATION}</p>
              <p><strong>Statut:</strong> {STATUT}</p>
              <p><strong>Société:</strong> {SOCIETE}</p>
            </div>
          `
        },
        renderer: {
          type: "simple",
          symbol: {
            type: "simple-fill",
            color: [0, 255, 0, 0.3],
            outline: {
              color: [0, 255, 0],
              width: 2
            }
          }
        } as any
      });
      try {
        await explorationLayer.load();
        map.add(explorationLayer);
        layers.push(explorationLayer);
      } catch (e) {
        console.warn("Skipped Exploration layer: service unreachable.", e);
      }

      // Add Promotion Perimeters Layer
      const perimetresLayer = new FeatureLayer({
        url: perimetresPromotionUrl,
        title: "Périmètres de Promotion",
        outFields: ["*"],
        opacity: activeLayers.perimetres ? 0.5 : 0,
        popupTemplate: {
          title: "Périmètre de Promotion",
          content: `
            <div class="popup-content">
              <p><strong>Type:</strong> {TYPE}</p>
              <p><strong>Superficie:</strong> {SUPERFICIE} ha</p>
            </div>
          `
        },
        renderer: {
          type: "simple",
          symbol: {
            type: "simple-fill",
            color: [0, 0, 255, 0.3],
            outline: {
              color: [0, 0, 255],
              width: 2
            }
          }
        } as any
      });
      // Normalize display strings for accented titles to avoid encoding artifacts in some editors
      try {
        (perimetresLayer as any).title = 'Périmètres de Promotion';
        if ((perimetresLayer as any).popupTemplate) {
          (perimetresLayer as any).popupTemplate.title = 'Périmètre de Promotion';
        }
      } catch {}
      try {
        await perimetresLayer.load();
        map.add(perimetresLayer);
        layers.push(perimetresLayer);
      } catch (e) {
        console.warn("Skipped Périmètres de Promotion layer: service unreachable.", e);
      }

      setEnterpriseLayers(layers);
      console.log(`ANAM Enterprise layers loaded: ${layers.length}/3`);

    } catch (error) {
      console.error("Error loading ANAM enterprise layers:", error);
    }
  };

  // Initialize ArcGIS Map with ANAM Enterprise services
  useEffect(() => {
    if (!mapRef.current) return;

    const initializeMap = async () => {
      if (initializedRef.current) return;
      initializedRef.current = true;
      try {
        // Prefer ArcGIS basemap for clear ArcGIS look & feel
        // Fallbacks: Esri raster tiles -> OSM tiles
        let map: Map;
        try {
          const esriVectorBasemap = Basemap.fromId('topo-vector');
          await esriVectorBasemap!.load();
          map = new Map({ basemap: esriVectorBasemap });
        } catch (eVec) {
          console.warn('ArcGIS vector basemap unavailable; trying Esri raster tiles.', eVec);
          try {
            const esriRasterTiles = new WebTileLayer({
              urlTemplate: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
            });
            const esriRasterBasemap = new Basemap({ baseLayers: [esriRasterTiles], title: 'Esri World Topo Map' });
            map = new Map({ basemap: esriRasterBasemap });
          } catch (eRas) {
            console.warn('Esri raster tiles unavailable; falling back to OpenStreetMap.', eRas);
            const osmLayer = new WebTileLayer({ urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png' });
            const osmBasemap = new Basemap({ baseLayers: [osmLayer], title: 'OpenStreetMap' });
            map = new Map({ basemap: osmBasemap });
          }
        }

        // Create map view centered on Algeria
        const view = new MapView({
          container: mapRef.current!,
          map: map,
          center: [2.632, 28.163], // Center of Algeria
          zoom: 6,
          constraints: {
            minZoom: 3,
            maxZoom: 20
          }
        });
        // Show ArcGIS UI components (Zoom, Attribution). Assets load from /assets
        try { (view.ui as any).components = ['zoom', 'attribution']; } catch {}

        // Add ANAM Enterprise layers (non-blocking; skipped if unreachable)
        if (!DISABLE_ENTERPRISE_LAYERS) {
          await addEnterpriseLayers(map);
        } else {
          console.warn('Enterprise layers are disabled by VITE_ARCGIS_DISABLE_ENTERPRISE=true');
        }

        // Create graphics layers for user drawings
        const mainGraphicsLayer = new GraphicsLayer();
        const markersLayer = new GraphicsLayer();
        const existingGraphicsLayer = new GraphicsLayer();
        
        map.add(mainGraphicsLayer);
        map.add(markersLayer);
        map.add(existingGraphicsLayer);

        graphicsLayerRef.current = mainGraphicsLayer;
        markersLayerRef.current = markersLayer;
        existingPolygonsLayerRef.current = existingGraphicsLayer;
        viewRef.current = view;

  // Set up click event
        view.on("click", (event) => {
  if (isDrawing && onMapClick) {
    const point = event.mapPoint;

    if (!point) return; // extra safeguard

    const lng = point.longitude ?? 0;
    const lat = point.latitude ?? 0;

    const converted = convertFromWGS84(
      lng,
      lat,
      coordinateSystem,
      utmZone,
      utmHemisphere
    );

    onMapClick(converted[0], converted[1]);
  }
  // Additionally, log attributes of any Titres Miniers feature clicked
  try {
    if (titresLayerRef.current) {
      (view as any).hitTest(event).then((response: any) => {
        const results: any[] = (response?.results || []);
        const filtered = results.filter((r: any) => {
          const lyr: any = r?.graphic?.layer;
          return !!lyr && (lyr.id === titresLayerRef.current?.id || lyr.title === 'Titres Miniers ANAM');
        });
        filtered.forEach((r: any) => {
          try { console.log('Titres miniers - attributs (click):', r.graphic?.attributes); } catch {}
          try { setSelectedTitreAttributes(r.graphic?.attributes || null); } catch {}
        });
      }).catch(() => {});
    }
  } catch {}
});

        await view.when();

        // Initialize Sketch for in-map editing (update-only)
        try {
          if (!sketchRef.current) {
            const sk = new Sketch({
              view,
              layer: graphicsLayerRef.current!,
              visibleElements: {
                createTools: { point: false, polyline: false, polygon: false, circle: false, rectangle: false },
                selectionTools: { 'lasso-selection': false, 'rectangle-selection': false },
                settingsMenu: false
              }
            });
            // Attach to UI in top-left, default hidden via state
            (sk as any).visible = false;
            view.ui.add(sk, 'top-left');
            // Propagate edits back to parent
            sk.on('update', (evt: any) => {
              try {
                if (!evt.graphics || !evt.graphics.length) return;
                const g = evt.graphics[0] as Graphic;
                const geom = g.geometry as any;
                if (geom?.type === 'polygon') {
                  const rings = (geom as Polygon).rings?.[0] || [];
                  const coords: [number, number][] = rings.map(([lng, lat]: number[]) => {
                    const [x, y] = convertFromWGS84(lng, lat, coordinateSystem, utmZone, utmHemisphere);
                    return [x, y];
                  });
                  // Remove duplicate last vertex if closed
                  if (coords.length > 1) {
                    const f = coords[0];
                    const l = coords[coords.length - 1];
                    if (f[0] === l[0] && f[1] === l[1]) coords.pop();
                  }
                  onPolygonChange?.(coords);
                }
              } catch {}
            });
            sketchRef.current = sk;
          }
        } catch {}

        setIsMapReady(true);
        
        console.log("ANAM ArcGIS Enterprise Map initialized successfully");

      } catch (error) {
        console.error("Error initializing ANAM ArcGIS Enterprise map:", error);
      }
    };

    initializeMap();

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
      }
    };
  }, []);

  // Update layer visibility when activeLayers changes
  useEffect(() => {
    if (!enterpriseLayers.length) return;

    enterpriseLayers.forEach(layer => {
      if (layer.title === "Titres Miniers ANAM") {
        layer.opacity = activeLayers.titres ? 0.7 : 0;
      } else if (layer.title === "Zones d'Exploration") {
        layer.opacity = activeLayers.exploration ? 0.6 : 0;
      } else if (layer.title === "Périmètres de Promotion") {
        layer.opacity = activeLayers.perimetres ? 0.5 : 0;
      }
    });
  }, [activeLayers, enterpriseLayers]);

  // Ensure visibility is applied even if title encoding differs (e.g., accents)
  useEffect(() => {
    if (!enterpriseLayers.length) return;
    enterpriseLayers.forEach((layer: any) => {
      const url: string = String(layer?.url || '');
      if (url.includes('/p%C3%A9rim%C3%A8tres_de_promotion/') || String(layer?.title || '') === 'Périmètres de Promotion') {
        layer.opacity = activeLayers.perimetres ? 0.5 : 0;
      }
    });
  }, [activeLayers, enterpriseLayers]);

  // Update drawing mode
  useEffect(() => {
    if (!viewRef.current) return;

    const view = viewRef.current;
    
    if (isDrawing) {
      view.container!.style.cursor = 'crosshair';
    } else {
      view.container!.style.cursor = 'grab';
    }
  }, [isDrawing]);

  // Update existing polygons
  useEffect(() => {
    if (!existingPolygonsLayerRef.current || !isMapReady) return;

    const layer = existingPolygonsLayerRef.current;
    layer.removeAll();

    existingPolygons.forEach(({ num_proc, coordinates }) => {
      try {
        if (!coordinates || coordinates.length < 3) {
          console.warn('Invalid polygon data for:', num_proc);
          return;
        }

        const wgs84Coords = coordinates.map(coord => {
          const tempPoint: Coordinate = {
            id: 0,
            idTitre: 0,
            h: 0,
            x: coord[0],
            y: coord[1],
            system: coordinateSystem,
            zone: coordinateSystem === 'UTM' ? utmZone : undefined,
            hemisphere: coordinateSystem === 'UTM' ? utmHemisphere : undefined
          };
          return convertToWGS84(tempPoint);
        });

        const polygon = new Polygon({
          rings: [wgs84Coords.map(coord => [coord[0], coord[1]])],
          spatialReference: { wkid: 4326 }
        });

        const fillSymbol = new SimpleFillSymbol({
          color: [128, 0, 128, 0.2],
          outline: {
            color: [128, 0, 128, 0.7],
            width: 2,
            style: "dash"
          }
        });

        const polygonGraphic = new Graphic({
          geometry: polygon,
          symbol: fillSymbol,
          attributes: {
            num_proc: num_proc
          },
          popupTemplate: {
            title: "Procédure Existante",
            content: `Numéro de procédure: ${num_proc}`
          }
        });

        layer.add(polygonGraphic);
      } catch (error) {
        console.error('Failed to create existing polygon:', num_proc, error);
      }
    });
  }, [existingPolygons, isMapReady, coordinateSystem, utmZone, utmHemisphere]);

  // Update current polygon and points
  useEffect(() => {
    if (!graphicsLayerRef.current || !isMapReady) return;

    const layer = graphicsLayerRef.current;
    layer.removeAll();

    try {
      const validPoints = points.filter(p => !isNaN(p.x) && !isNaN(p.y));
      const wgs84Points = validPoints.map(point => convertToWGS84(point));

      // Add polygon if we have enough points
      if (wgs84Points.length >= 3) {
        const polygon = new Polygon({
          rings: [wgs84Points.map(coord => [coord[0], coord[1]])],
          spatialReference: { wkid: 4326 }
        });

        const fillSymbol = new SimpleFillSymbol({
          color: [37, 99, 235, 0.3],
          outline: {
            color: [37, 99, 235, 1],
            width: 2
          }
        });

        const polygonGraphic = new Graphic({
          geometry: polygon,
          symbol: fillSymbol,
          popupTemplate: {
            title: "Nouveau Périmètre Minier",
            content: `
              <div class="popup-content">
                <p><strong>Superficie:</strong> ${superficie.toLocaleString()} ha</p>
                <p><strong>Nombre de points:</strong> ${points.length}</p>
                <p><strong>Système de coordonnées:</strong> ${coordinateSystem}</p>
                ${utmZone ? `<p><strong>Zone UTM:</strong> ${utmZone}</p>` : ''}
              </div>
            `
          }
        });

        layer.add(polygonGraphic);

        // Add label inside polygon (demande code)
        try {
          const center = polygon.extent?.center;
          if (center && labelText) {
            const label = String(labelText || '').trim();
            if (label.length > 0) {
              const textSymbol = new TextSymbol({
                text: label,
                color: [0, 0, 0, 1],
                haloColor: [255, 255, 255, 1],
                haloSize: 2,
                font: { size: 12, family: 'Arial', weight: 'bold' } as any
              });
              const textGraphic = new Graphic({
                geometry: center,
                symbol: textSymbol
              });
              layer.add(textGraphic);
            }
          }
        } catch {}

        // Zoom to polygon
        if (viewRef.current && wgs84Points.length > 0) {
          viewRef.current.goTo(polygon).catch(() => {
            // Ignore zoom errors
          });
        }
      }

      // Add point markers
      validPoints.forEach((point, index) => {
        const [lng, lat] = convertToWGS84(point);
        const mapPoint = new Point({
          longitude: lng,
          latitude: lat,
          spatialReference: { wkid: 4326 }
        });

        const markerSymbol = new SimpleMarkerSymbol({
          color: [37, 99, 235],
          outline: {
            color: [255, 255, 255],
            width: 2
          },
          size: 12
        });

        const markerGraphic = new Graphic({
          geometry: mapPoint,
          symbol: markerSymbol,
          attributes: {
            pointId: point.id,
            index: index + 1
          },
          popupTemplate: {
            title: `Point ${index + 1}`,
            content: `
              <div class="popup-content">
                <p><strong>ID:</strong> ${point.id}</p>
                <p><strong>X:</strong> ${point.x.toFixed(2)}</p>
                <p><strong>Y:</strong> ${point.y.toFixed(2)}</p>
                <p><strong>Système:</strong> ${point.system}</p>
                ${point.zone ? `<p><strong>Zone:</strong> ${point.zone}</p>` : ''}
              </div>
            `
          }
        });

        layer.add(markerGraphic);
      });

    } catch (error) {
      console.error('Error updating map graphics:', error);
    }
  }, [points, isMapReady, coordinateSystem, utmZone, utmHemisphere, superficie]);

  // Layer toggle handler
  const toggleLayer = (layerName: string) => {
    setActiveLayers(prev => ({
      ...prev,
      [layerName]: !prev[layerName]
    }));
  };

  // Export current map view to PNG
  const exportPNG = async () => {
    if (!viewRef.current) return;
    try {
      setIsExporting(true);
      const shot: any = await (viewRef.current as any).takeScreenshot({ format: 'png', quality: 1 });
      const a = document.createElement('a');
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      a.href = shot?.dataUrl || shot?.dataUrl; // ArcGIS returns dataUrl
      const code = selectedTitreAttributes?.code || selectedTitreAttributes?.idtitre || 'site-minier';
      a.download = `capture-${code}-${ts}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error('Erreur export PNG:', e);
    } finally {
      setIsExporting(false);
    }
  };

  // Export PDF via ArcGIS Printing Service
  const exportPDF = async () => {
    if (!viewRef.current) return;
    try {
      setIsExporting(true);
      const taskUrl = `${enterpriseServices.printingService}/Export%20Web%20Map%20Task`;
      // Compose a title from selected attributes when possible
      const typ = selectedTitreAttributes?.typetitre || selectedTitreAttributes?.codetype || 'Titre minier';
      const code = selectedTitreAttributes?.code ?? selectedTitreAttributes?.idtitre ?? selectedTitreAttributes?.objectid ?? '';
      const titulaire = [selectedTitreAttributes?.tnom, selectedTitreAttributes?.tprenom].filter(Boolean).join(' ').trim();
      const titleText = `${typ} ${selectedTitreAttributes?.codetype || ''} ${code}`.replace(/\s+/g, ' ').trim();

      // Pre-compute overlaps for inclusion in print layout (if supported)
      let overlapsForPrint: any[] | null = null;
      try { overlapsForPrint = await queryMiningTitles(); } catch {}
      const overlapCount = overlapsForPrint?.length || 0;
      const overlapList = (overlapsForPrint || []).slice(0, 8).map((t: any, i: number) => {
        const ttyp = t.typetitre || t.codetype || 'Titre';
        const tcode = t.code ?? t.idtitre ?? t.objectid ?? '';
        const ttit = [t.tnom, t.tprenom].filter(Boolean).join(' ').trim();
        const tloc = [t.wilaya, t.daira, t.commune].filter(Boolean).join(' / ');
        return `${i+1}. ${ttyp} ${t.codetype || ''} ${tcode}${ttit ? ' — ' + ttit : ''}${tloc ? ' — ' + tloc : ''}`.replace(/\s+/g,' ').trim();
      }).join('\n');

      const template = new PrintTemplate({
        format: 'pdf',
        layout: 'a4-portrait',
        layoutOptions: {
          titleText: titleText || 'Carte des titres miniers',
          authorText: titulaire || 'ANAM',
          // Custom text elements are used when the server layout supports them; safe to include
          customTextElements: [
            { label: 'Code permis', value: (adminInfo as any)?.codePermis ?? (labelText || '') },
            { label: 'Type permis', value: (adminInfo as any)?.typePermis ?? (selectedTitreAttributes?.typetitre || '') },
            { label: 'Titulaire', value: (adminInfo as any)?.titulaire ?? titulaire },
            { label: 'Wilaya', value: (adminInfo as any)?.wilaya ?? selectedTitreAttributes?.wilaya ?? '' },
            { label: 'Daira', value: (adminInfo as any)?.daira ?? selectedTitreAttributes?.daira ?? '' },
            { label: 'Commune', value: (adminInfo as any)?.commune ?? selectedTitreAttributes?.commune ?? '' },
            { label: 'Substance', value: selectedTitreAttributes?.substance1 || selectedTitreAttributes?.substances || '' },
            { label: 'Superficie (ha)', value: selectedTitreAttributes?.sig_area || superficie || '' },
            { label: 'Chevauchements (compte)', value: String(overlapCount) },
            { label: 'Chevauchements (liste)', value: overlapList }
          ] as any
        } as any
      });

      const params = new PrintParameters({
        view: viewRef.current!,
        template
      } as any);

      const result: any = await (print as any).execute(taskUrl, params as any);
      if (result?.url) {
        const a = document.createElement('a');
        a.href = result.url;
        const ts = new Date().toISOString().substring(0,19).replace(/[:T]/g, '-');
        const codePart = code ? `-${code}` : '';
        a.download = `rapport-titre${codePart}-${ts}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        console.warn('Aucune URL de PDF retournée par le service de cartographie.');
      }
    } catch (e) {
      console.error('Erreur export PDF:', e);
      // Fallback to client-side PDF composition when server print fails
      try {
        await exportClientPDF();
      } catch (e2) {
        console.error('Erreur export PDF (fallback):', e2);
      }
    } finally {
      setIsExporting(false);
    }
  };

  // Client-side PDF composition fallback (screenshot + attributes)
  const exportClientPDF = async () => {
    if (!viewRef.current) return;
    const view = viewRef.current as any;

    const shot: any = await view.takeScreenshot({ format: 'png', quality: 1 });
    const dataUrl: string = shot?.dataUrl || '';

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Agence Nationale des Activités Minières', pageWidth / 2, margin, { align: 'center' });
    doc.setFontSize(12);
    const typ = selectedTitreAttributes?.typetitre || selectedTitreAttributes?.codetype || 'Titre minier';
    const code = selectedTitreAttributes?.code ?? selectedTitreAttributes?.idtitre ?? selectedTitreAttributes?.objectid ?? '';
    const titleLine = `${typ}${selectedTitreAttributes?.codetype ? ' ' + selectedTitreAttributes.codetype : ''}${code ? ' — ' + code : ''}`.replace(/\s+/g, ' ').trim();
    doc.text(titleLine || 'Rapport du Titre Minier', pageWidth / 2, margin + 7, { align: 'center' });

    // Map image
    let y = margin + 14;
    try {
      if (dataUrl) {
        const imgW = pageWidth - margin * 2;
        // Estimate height using screenshot aspect ratio when available
        const sW = shot?.width || 1600;
        const sH = shot?.height || 900;
        const imgH = Math.min((imgW * sH) / sW, pageHeight * 0.45);
        doc.addImage(dataUrl, 'PNG', margin, y, imgW, imgH, undefined, 'FAST');
        y += imgH + 6;
      }
    } catch {}

    // Helpers
    const fmtNum = (n: any, fractionDigits = 1) => {
      const v = Number(n);
      if (!isFinite(v)) return '';
      try { return new Intl.NumberFormat('fr-DZ', { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }).format(v); } catch { return String(v); }
    };
    const yesNo = (b: any) => (b ? 'Oui' : 'Non');
    const stripUnsupported = (s: any) => {
      if (typeof s !== 'string') return s ?? '';
      try { return s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[\u0000-\u001F]/g, ' ').replace(/[^\x20-\x7E\u00A0-\u00FF]/g, ''); } catch { return s; }
    };

    // Attributes table (site minier)
    const titulaire = [selectedTitreAttributes?.tnom, selectedTitreAttributes?.tprenom].filter(Boolean).join(' ').trim();
    const location = [selectedTitreAttributes?.wilaya, selectedTitreAttributes?.daira, selectedTitreAttributes?.commune].filter(Boolean).join(' / ');
    const admin = {
      codePermis: (adminInfo as any)?.codePermis ?? (labelText || ''),
      typePermis: (adminInfo as any)?.typePermis ?? '',
      titulaire: (adminInfo as any)?.titulaire ?? titulaire,
      wilaya: (adminInfo as any)?.wilaya ?? selectedTitreAttributes?.wilaya ?? '',
      daira: (adminInfo as any)?.daira ?? selectedTitreAttributes?.daira ?? '',
      commune: (adminInfo as any)?.commune ?? selectedTitreAttributes?.commune ?? ''
    };
    const formatDate = (v: any) => {
      try { const d = new Date(v); if (!isNaN(d.getTime())) return d.toLocaleDateString('fr-DZ'); } catch {}
      return '';
    };
    const rowsAdmin: Array<[string, string]> = [
      ['Code permis', stripUnsupported(admin.codePermis)],
      ['Type permis', stripUnsupported(admin.typePermis || (selectedTitreAttributes?.typetitre || ''))],
      ['Titulaire', stripUnsupported(admin.titulaire)],
      ['Wilaya', stripUnsupported(admin.wilaya)],
      ['Daira', stripUnsupported(admin.daira)],
      ['Commune', stripUnsupported(admin.commune)]
    ];
    const rowsTech: Array<[string, string]> = [
      ['Nombre de points', String((points || []).length)],
      ['Superficie (ha)', fmtNum(selectedTitreAttributes?.sig_area || superficie, 1)],
      ['Superficie déclarée (ha)', (typeof (declaredAreaHa) !== 'undefined' ? fmtNum(declaredAreaHa, 1) : '')],
      ['Situation géographique OK', yesNo((validationSummary as any)?.sitGeoOk)],
      ['Absence d\'empiétements', yesNo((validationSummary as any)?.empietOk)],
      ['Géométrie correcte', yesNo((validationSummary as any)?.geomOk)],
      ['Superficie conforme', yesNo((validationSummary as any)?.superfOk)]
    ];

    // Build administrative table
    try {
      (autoTable as any)(doc, {
        head: [[{ content: 'Informations administratives', colSpan: 2, styles: { halign: 'center' } }]],
        body: rowsAdmin.map(([k, v]) => [k, v]),
        startY: y,
        theme: 'grid',
        styles: { font: 'helvetica', fontSize: 9 },
        headStyles: { fillColor: [31, 41, 55], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 'auto' } }
      });
    } catch {
      // graceful degrade: write key-values as simple text
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      let yy = y + 6;
      rowsAdmin.forEach(([k, v]) => { doc.text(`${k}: ${v}`, margin, yy); yy += 5; });
    }

    // Caractéristiques techniques
    let nextY = (doc as any)?.lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 10 : (y + 20);
    try {
      (autoTable as any)(doc, {
        head: [[{ content: 'Caractéristiques techniques', colSpan: 2, styles: { halign: 'center' } }]],
        body: rowsTech.map(([k, v]) => [k, v]),
        startY: nextY,
        theme: 'grid',
        styles: { font: 'helvetica', fontSize: 9 },
        headStyles: { fillColor: [31, 41, 55], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 'auto' } }
      });
    } catch {
      // ignore if autotable unavailable
    }

    // Chevauchements avec Titres Miniers ANAM
    nextY = (doc as any)?.lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 10 : (nextY + 20);
    try {
      const overlaps = await queryMiningTitles();
      if (overlaps && overlaps.length) {
        const overlapRows = overlaps.map((t: any, idx: number) => {
          const ttyp = t.typetitre || t.codetype || 'Titre';
          const tcode = t.code ?? t.idtitre ?? t.objectid ?? '';
          const ttit = [t.tnom, t.tprenom].filter(Boolean).join(' ').trim();
          const tloc = [t.wilaya, t.daira, t.commune].filter(Boolean).join(' / ');
          return [String(idx + 1), stripUnsupported(`${ttyp} ${t.codetype || ''}`.replace(/\s+/g,' ').trim()), String(tcode), stripUnsupported(ttit || ''), stripUnsupported(tloc || '')];
        });
        (autoTable as any)(doc, {
          head: [[{ content: `Chevauchements détectés (${overlaps.length})`, colSpan: 5, styles: { halign: 'center' } }], ['#', 'Type', 'Code', 'Titulaire', 'Localisation']],
          body: overlapRows,
          startY: nextY,
          theme: 'grid',
          styles: { font: 'helvetica', fontSize: 9 },
          headStyles: { fillColor: [31, 41, 55], textColor: 255 },
          alternateRowStyles: { fillColor: [245, 247, 250] },
          columnStyles: { 0: { cellWidth: 8 }, 1: { cellWidth: 40 }, 2: { cellWidth: 25 }, 3: { cellWidth: 55 }, 4: { cellWidth: 'auto' } }
        });
      } else {
        doc.setFont('helvetica', 'bold');
        doc.text('Chevauchements détectés (0)', margin, nextY);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text('Aucun empiètement détecté avec les titres miniers ANAM.', margin, nextY + 6);
      }
    } catch (e) {
      // If the service is unreachable, add a note
      doc.setFont('helvetica', 'bold');
      doc.text('Chevauchements — Information indisponible', margin, nextY);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`La vérification des chevauchements n'a pas pu être effectuée.`, margin, nextY + 6);
    }

    // Footer
    try {
      doc.setFontSize(8);
      const ts = new Date().toLocaleString('fr-DZ');
      doc.text(`Généré le ${ts}`, margin, pageHeight - 6);
    } catch {}

    const tsFile = new Date().toISOString().substring(0,19).replace(/[:T]/g, '-');
    const codePart = code ? `-${code}` : '';
    doc.save(`rapport-titre${codePart}-${tsFile}.pdf`);
  };

  return (
    <div className="arcgis-enterprise-container">
      <div 
        ref={mapRef} 
        className="arcgis-map"
        style={{ 
          height: '50vh', 
          width: '100%',
          cursor: isDrawing ? 'crosshair' : 'grab'
        }}
      />
      
      {/* Layer toggle button */}
      <button
        className="layer-toggle-btn"
        onClick={() => setIsLayerPanelOpen(v => !v)}
        aria-label={isLayerPanelOpen ? 'Masquer les couches' : 'Afficher les couches'}
      >
        {isLayerPanelOpen ? 'Masquer les couches' : 'Afficher les couches'}
      </button>

      {/* Export controls */}
      <div className="export-controls">
        <button className="export-btn" onClick={exportPNG} disabled={isExporting}>
          {isExporting ? 'Export…' : 'Exporter PNG'}
        </button>
        <button className="export-btn" onClick={exportPDF} disabled={isExporting}>
          {isExporting ? 'Export…' : 'Télécharger PDF'}
        </button>
      </div>

      {/* Layer control panel */}
      {isLayerPanelOpen && (
      <div className="layer-control-panel">
        <h4>Couches ANAM</h4>
        <div className="layer-list">
          <div className="layer-item">
            <input 
              type="checkbox" 
              checked={activeLayers.titres}
              onChange={() => toggleLayer('titres')}
            />
            <label>Titres Miniers</label>
          </div>
          <div className="layer-item">
            <input 
              type="checkbox" 
              checked={activeLayers.exploration}
              onChange={() => toggleLayer('exploration')}
            />
            <label>Zones d'Exploration</label>
          </div>
          <div className="layer-item">
            <input 
              type="checkbox" 
              checked={activeLayers.perimetres}
              onChange={() => toggleLayer('perimetres')}
            />
            <label>Périmètres de Promotion</label>
          </div>
        </div>
      </div>
      )}

      <style jsx>{`
        .arcgis-enterprise-container {
          position: relative;
          height: 50vh;
          width: 100%;
        }
        .layer-toggle-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 1001;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 6px 10px;
          font-size: 12px;
          color: #2d3748;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        }
        .layer-control-panel {
          position: fixed;
          top: 48px; /* leave space for toggle btn */
          right: 10px;
          background: white;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 1000;
          max-width: 220px;
          border: 1px solid #e2e8f0;
        }
        .layer-control-panel h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
          color: #2d3748;
        }
        .layer-item {
          display: flex;
          align-items: center;
          margin: 8px 0;
          padding: 4px 0;
        }
        .layer-item label {
          margin-left: 8px;
          font-size: 13px;
          cursor: pointer;
          color: #4a5568;
        }
        .layer-item input[type="checkbox"] {
          cursor: pointer;
        }
        .export-controls {
          position: absolute;
          bottom: 10px;
          right: 10px;
          z-index: 1001;
          display: flex;
          gap: 8px;
        }
        .export-btn {
          background: #1f2937;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 8px 10px;
          font-size: 12px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        }
        .export-btn[disabled] {
          opacity: 0.6;
          cursor: default;
        }
      `}</style>
    </div>
  );
});

ArcGISMap.displayName = 'ArcGISMap';

export default ArcGISMap;
