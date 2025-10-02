// components/map/ArcGISMap.tsx
'use client';
import { forwardRef, useRef, useEffect, useImperativeHandle, useState } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import Polygon from '@arcgis/core/geometry/Polygon';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';
import * as proj4 from 'proj4';
import esriConfig from '@arcgis/core/config';
import '../../src/config/arcgis-config';

// Configure ArcGIS Enterprise portal
esriConfig.portalUrl = "https://sig.anam.dz/portal";

// Strip app-level custom headers from ArcGIS/ANAM/CDN requests to avoid CORS issues
if (typeof window !== 'undefined') {
  try {
    const corsServers = esriConfig.request.corsEnabledServers as string[];
    const ensure = (h: string) => { if (!corsServers.includes(h)) corsServers.push(h); };
    [
      'sig.anam.dz',
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
      esriConfig.request.interceptors.push({
        urls: (url: string) => {
          try {
            const u = new URL(url, window.location.origin);
            const h = u.hostname.toLowerCase();
            return (
              h === 'sig.anam.dz' ||
              h.endsWith('.arcgis.com') ||
              h.endsWith('arcgisonline.com') ||
              h === 'cdn.arcgis.com'
            );
          } catch { return false; }
        },
        before: (params: any) => {
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
}

export interface ArcGISMapRef {
  getPoints: () => Coordinate[];
  resetMap: () => void;
  calculateArea: () => number;
  queryMiningTitles: (geometry?: any) => Promise<any[]>;
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
  utmHemisphere = 'N'
}, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<MapView | null>(null);
  const graphicsLayerRef = useRef<GraphicsLayer | null>(null);
  const existingPolygonsLayerRef = useRef<GraphicsLayer | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [enterpriseLayers, setEnterpriseLayers] = useState<any[]>([]);
  const [activeLayers, setActiveLayers] = useState<{[key: string]: boolean}>({
    titres: true,
    exploration: true,
    perimetres: true
  });

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
  const queryMiningTitles = async (geometry?: any): Promise<any[]> => {
    if (!viewRef.current) return [];

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
      return result.features.map(feature => feature.attributes);
      
    } catch (error) {
      console.error('Error querying mining titles:', error);
      return [];
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
  const addEnterpriseLayers = (map: Map) => {
    const layers = [];

    try {
      // Add sample basemap (you can replace this with your own basemaps)
      const baseLayer = new MapImageLayer({
        url: enterpriseServices.sampleWorldCities,
        title: "Carte de Base ANAM",
        opacity: 0.8
      });
      map.add(baseLayer);
      layers.push(baseLayer);

      // Add Mining Titles Layer (YOUR MAIN SERVICE)
      const titresLayer = new FeatureLayer({
        url: enterpriseServices.titresMinieres,
        title: "Titres Miniers ANAM",
        outFields: ["*"],
        opacity: activeLayers.titres ? 0.7 : 0,
        popupTemplate: {
          title: "Titre Minier: {NOM}",
          content: `
            <div class="popup-content">
              <p><strong>Type:</strong> {TYPE_TITRE}</p>
              <p><strong>Statut:</strong> {STATUT}</p>
              <p><strong>Superficie:</strong> {SUPERFICIE} ha</p>
              <p><strong>Date Début:</strong> {DATE_DEBUT}</p>
              <p><strong>Date Fin:</strong> {DATE_FIN}</p>
              <p><strong>Titulaire:</strong> {TITULAIRE}</p>
            </div>
          `
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
      map.add(titresLayer);
      layers.push(titresLayer);

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
      map.add(explorationLayer);
      layers.push(explorationLayer);

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
      map.add(perimetresLayer);
      layers.push(perimetresLayer);

      setEnterpriseLayers(layers);
      console.log("ANAM Enterprise layers loaded successfully");

    } catch (error) {
      console.error("Error loading ANAM enterprise layers:", error);
      // Fallback to standard basemap
      map.basemap = "topo-vector";
    }
  };

  // Initialize ArcGIS Map with ANAM Enterprise services
  useEffect(() => {
    if (!mapRef.current) return;

    const initializeMap = async () => {
      try {
        // Create map
        const map = new Map({
          basemap: "topo-vector" // Fallback basemap
        });

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

        // Add ANAM Enterprise layers
        addEnterpriseLayers(map);

        // Create graphics layers for user drawings
        const mainGraphicsLayer = new GraphicsLayer();
        const existingGraphicsLayer = new GraphicsLayer();
        
        map.add(mainGraphicsLayer);
        map.add(existingGraphicsLayer);

        graphicsLayerRef.current = mainGraphicsLayer;
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
});

        await view.when();
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

  return (
    <div className="arcgis-enterprise-container">
      <div 
        ref={mapRef} 
        className="arcgis-map"
        style={{ 
          height: '100%', 
          width: '100%',
          cursor: isDrawing ? 'crosshair' : 'grab'
        }}
      />
      
      {/* Layer control panel */}
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

      <style jsx>{`
        .arcgis-enterprise-container {
          position: relative;
          height: 100%;
          width: 100%;
        }
        .layer-control-panel {
          position: absolute;
          top: 10px;
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
      `}</style>
    </div>
  );
});

ArcGISMap.displayName = 'ArcGISMap';

export default ArcGISMap;
