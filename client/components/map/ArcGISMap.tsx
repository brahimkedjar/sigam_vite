'use client';
import { forwardRef, useRef, useEffect, useImperativeHandle, useState } from 'react';
import L from 'leaflet';
// @ts-ignore: CSS module declarations for leaflet-draw are not present in this project
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
// @ts-ignore: CSS module declarations for leaflet-draw are not present in this project
import 'leaflet-draw/dist/leaflet.draw.css';
import * as proj4 from 'proj4';
import styles from '../../pages/demande/step5/cadastre.module.css';

// Define coordinate system definitions
proj4.default.defs([
  ['WGS84', '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'],
  ['EPSG:4326', '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'],
  ['EPSG:30491', '+proj=lcc +lat_1=36 +lat_2=34 +lat_0=32 +lon_0=3 +x_0=0 +y_0=0 +ellps=clrk80 +units=m +no_defs'], // Lambert Nord
  ['EPSG:30492', '+proj=lcc +lat_1=36 +lat_2=34 +lat_0=32 +lon_0=9 +x_0=0 +y_0=0 +ellps=clrk80 +units=m +no_defs'], // Lambert Centre
  ['EPSG:30493', '+proj=lcc +lat_1=36 +lat_2=34 +lat_0=32 +lon_0=15 +x_0=0 +y_0=0 +ellps=clrk80 +units=m +no_defs'], // Lambert Sud
  ['EPSG:3857', '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs']
]);

// UTM zone definitions
for (let zone = 1; zone <= 60; zone++) {
  proj4.default.defs(`EPSG:326${zone.toString().padStart(2, '0')}`, 
    `+proj=utm +zone=${zone} +ellps=WGS84 +datum=WGS84 +units=m +no_defs`);
  proj4.default.defs(`EPSG:327${zone.toString().padStart(2, '0')}`, 
    `+proj=utm +zone=${zone} +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs`);
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
}

export const ArcGISMap = forwardRef<ArcGISMapRef, ArcGISMapProps>(({
  points,
  superficie,
  isDrawing,
  onMapClick,
  onPolygonChange,
  existingPolygons = [],
  layerType = 'topographie',
  coordinateSystem = 'UTM',
  utmZone = 31,
  utmHemisphere = 'N'
}, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const polygonRef = useRef<L.Polygon | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const drawControlRef = useRef<L.Control.Draw | null>(null);
  const existingLayersRef = useRef<{ [id: string]: L.Layer }>({});
  const centerMarkerRef = useRef<L.Marker | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  const convertToWGS84 = (point: Coordinate): [number, number] => {
    try {
      switch (point.system) {
        case 'WGS84':
          return [point.x, point.y];
        case 'UTM':
          const zone = point.zone ?? utmZone; // Fallback to prop
          const hemisphere = point.hemisphere ?? utmHemisphere; // Fallback to prop
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

  useImperativeHandle(ref, () => ({
    getPoints: () => points,
    resetMap: () => {
      if (mapInstance.current) {
        mapInstance.current.eachLayer((layer) => {
          if (layer instanceof L.Marker || layer instanceof L.Polygon) {
            layer.remove();
          }
        });
      }
    }
  }));

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current).setView([28.0339, 1.6596], 5);
    const baseLayers = {
      'Topographie': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }),
      'Géologie': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      }),
      'Cadastre Minier': L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      })
    };

    baseLayers['Topographie'].addTo(map);
    drawnItemsRef.current = new L.FeatureGroup().addTo(map);
    drawControlRef.current = new L.Control.Draw({
      edit: { featureGroup: drawnItemsRef.current },
      draw: {
        polygon: {
          allowIntersection: false,
          showArea: true,
          metric: true,
          shapeOptions: { color: '#2563eb', fillOpacity: 0.3 }
        },
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false
      }
    });

    mapInstance.current = map;
    setIsMapReady(true);

    setTimeout(() => {
      if (mapRef.current && mapInstance.current) {
        requestAnimationFrame(() => {
          mapInstance.current?.invalidateSize();
        });
      }
    }, 500);

    return () => {
      map.remove();
      mapInstance.current = null;
      setIsMapReady(false);
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;
    map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    switch (layerType) {
      case 'geologie':
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}').addTo(map);
        break;
      case 'minier':
        L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png').addTo(map);
        break;
      default:
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    }
  }, [layerType]);

  useEffect(() => {
    if (!mapInstance.current || !drawnItemsRef.current) return;
    const map = mapInstance.current;

    const handleDrawCreated = (e: L.LeafletEvent) => {
      const event = e as L.DrawEvents.Created;
      const layer = event.layer;
      drawnItemsRef.current?.clearLayers();
      drawnItemsRef.current?.addLayer(layer);

      if (layer instanceof L.Polygon) {
        const coords = layer.getLatLngs()[0] as L.LatLng[];
        const simplifiedCoords = coords.map(latLng => {
          const converted = convertFromWGS84(latLng.lng, latLng.lat, coordinateSystem, utmZone, utmHemisphere);
          return [converted[0], converted[1]] as [number, number];
        });
        onPolygonChange?.(simplifiedCoords);
      }
    };

    const handleDrawEdited = (e: L.LeafletEvent) => {
      const event = e as L.DrawEvents.Edited;
      const layers = event.layers.getLayers();
      if (layers.length > 0 && layers[0] instanceof L.Polygon) {
        const coords = (layers[0] as L.Polygon).getLatLngs()[0] as L.LatLng[];
        const simplifiedCoords = coords.map(latLng => {
          const converted = convertFromWGS84(latLng.lng, latLng.lat, coordinateSystem, utmZone, utmHemisphere);
          return [converted[0], converted[1]] as [number, number];
        });
        onPolygonChange?.(simplifiedCoords);
      }
    };

    const drawControl = drawControlRef.current;
    if (isDrawing && drawControl) {
      setTimeout(() => { map.addControl(drawControl); }, 0);
      map.on(L.Draw.Event.CREATED, handleDrawCreated);
      map.on(L.Draw.Event.EDITED, handleDrawEdited);
    }

    return () => {
      if (drawControl) { map.removeControl(drawControl); }
      map.off(L.Draw.Event.CREATED, handleDrawCreated);
      map.off(L.Draw.Event.EDITED, handleDrawEdited);
    };
  }, [isDrawing, onPolygonChange, coordinateSystem, utmZone, utmHemisphere]);

  useEffect(() => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;

    const handleClick = (e: L.LeafletMouseEvent) => {
      if (isDrawing && onMapClick) {
        const converted = convertFromWGS84(e.latlng.lng, e.latlng.lat, coordinateSystem, utmZone, utmHemisphere);
        onMapClick(converted[0], converted[1]);
      }
    };

    map.on('click', handleClick);
    return () => { map.off('click', handleClick); };
  }, [isDrawing, onMapClick, coordinateSystem, utmZone, utmHemisphere]);

  useEffect(() => {
    if (!mapInstance.current || !isMapReady) return;
    const map = mapInstance.current;

    Object.values(existingLayersRef.current).forEach(layer => {
      if (layer && map.hasLayer(layer)) { map.removeLayer(layer); }
    });
    existingLayersRef.current = {};

    existingPolygons.forEach(({ num_proc, coordinates }) => {
      try {
        if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 3) {
          console.warn('Invalid polygon data for:', num_proc);
          return;
        }

        const wgs84Coords = coordinates.map(coord => {
          if (!Array.isArray(coord) || coord.length < 2) {
            console.warn('Invalid coordinate array:', coord);
            return null;
          }
          const [x, y] = coord;
          if (typeof x !== 'number' || typeof y !== 'number' || isNaN(x) || isNaN(y)) {
            console.warn('Invalid coordinate values:', coord);
            return null;
          }
          const tempPoint: Coordinate = {
            id: 0,
            idTitre: 0,
            h: 0,
            x,
            y,
            system: coordinateSystem,
            zone: coordinateSystem === 'UTM' ? utmZone : undefined,
            hemisphere: coordinateSystem === 'UTM' ? utmHemisphere : undefined
          };
          const [lng, lat] = convertToWGS84(tempPoint);
          return L.latLng(lat, lng);
        }).filter(latLng => latLng !== null) as L.LatLng[];

        if (wgs84Coords.length < 3) {
          console.warn('Not enough valid coordinates for polygon:', num_proc);
          return;
        }

        const polygon = L.polygon(wgs84Coords, {
          color: '#dc2626',
          weight: 2,
          opacity: 0.7,
          fillOpacity: 0.2,
          dashArray: '5,5'
        }).addTo(map);

        existingLayersRef.current[num_proc] = polygon;
        polygon.bindPopup(`Procédure: ${num_proc}`);

        const bounds = polygon.getBounds();
        if (bounds.isValid()) {
          const center = bounds.getCenter();
          const label = L.marker(center, {
            icon: L.divIcon({
              className: 'polygon-label',
              html: `<div style="background: white; padding: 2px 5px; border-radius: 3px; border: 1px solid #ccc;">${num_proc}</div>`,
              iconSize: [80, 20],
            }),
            interactive: false
          }).addTo(map);
          existingLayersRef.current[`${num_proc}-label`] = label;
        }
      } catch (error) {
        console.error('Failed to create polygon for:', num_proc, error);
      }
    });
  }, [existingPolygons, isMapReady, coordinateSystem, utmZone, utmHemisphere]);

  const validateCoordinate = (point: Coordinate): boolean => {
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

  useEffect(() => {
    if (!mapInstance.current || !drawnItemsRef.current || !isMapReady) return;

    if (centerMarkerRef.current && mapInstance.current.hasLayer(centerMarkerRef.current)) {
      mapInstance.current.removeLayer(centerMarkerRef.current);
      centerMarkerRef.current = null;
    }

    markersRef.current.forEach(marker => { marker.remove(); });
    markersRef.current = [];

    try {
      const validPoints = points?.filter(p => !isNaN(p.x) && !isNaN(p.y) && validateCoordinate(p));
      const wgs84Points = validPoints?.map(point => {
        try {
          const [lng, lat] = convertToWGS84(point);
          return L.latLng(lat, lng);
        } catch (error) {
          console.error(`Failed to convert point ${point.id}:`, error);
          return null;
        }
      }).filter(point => point !== null) as L.LatLng[];

      drawnItemsRef.current.clearLayers();

      if (wgs84Points?.length >= 3) {
        const polygon = L.polygon(wgs84Points, {
          color: '#2563eb',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.3
        });

        drawnItemsRef.current.addLayer(polygon);
        polygonRef.current = polygon;

        setTimeout(() => {
          if (!mapInstance.current?.hasLayer(polygon)) return;
          const bounds = polygon.getBounds();
          const centroid = bounds.getCenter();
          const offsetLatLng = L.latLng(centroid.lat + 0.001, centroid.lng);

          if (centerMarkerRef.current && mapInstance.current.hasLayer(centerMarkerRef.current)) {
            mapInstance.current.removeLayer(centerMarkerRef.current);
          }

          centerMarkerRef.current = L.marker(offsetLatLng, {
            icon: L.divIcon({
              className: 'new-site-label',
              html: `<div>Nouveau</div>`,
              iconSize: [70, 20],
            }),
            interactive: false
          }).addTo(mapInstance.current!);

          mapInstance.current.fitBounds(polygon.getBounds());
        }, 0);
      }

      validPoints?.forEach((point, index) => {
        try {
          const [lng, lat] = convertToWGS84(point);
          const marker = L.marker([lat, lng], {
            icon: L.divIcon({
              className: 'map-marker',
              html: `<div>${index + 1}</div>`,
              iconSize: [24, 24]
            }),
            draggable: true
          }).addTo(mapInstance.current!);

          marker.on('dragend', (e) => {
            const newLatLng = e.target.getLatLng();
            if (onPolygonChange) {
              try {
                const converted = convertFromWGS84(newLatLng.lng, newLatLng.lat, coordinateSystem, utmZone, utmHemisphere);
                const updatedPoints = [...points];
                updatedPoints[index] = {
                  ...updatedPoints[index],
                  x: converted[0],
                  y: converted[1]
                };
                const coordinateArrays = updatedPoints.map(p => {
                  if (p.system === 'WGS84') {
                    return [p.x, p.y] as [number, number];
                  } else {
                    const wgs84 = convertToWGS84(p);
                    return convertFromWGS84(wgs84[0], wgs84[1], coordinateSystem, utmZone, utmHemisphere);
                  }
                });
                onPolygonChange(coordinateArrays);
              } catch (error) {
                console.error('Error updating point:', error);
              }
            }
          });

          markersRef.current.push(marker);
        } catch (error) {
          console.error(`Failed to create marker for point ${point.id}:`, error);
        }
      });
    } catch (error) {
      console.error('Error updating map:', error);
    }
  }, [points, onPolygonChange, isMapReady, coordinateSystem, utmZone, utmHemisphere]);

  return (
    <div 
      ref={mapRef} 
      className={styles['map-view']}
      style={{ cursor: isDrawing ? 'crosshair' : 'grab' }}
    />
  );
});

ArcGISMap.displayName = 'ArcGISMap';

export default ArcGISMap;