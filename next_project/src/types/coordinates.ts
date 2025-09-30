// types/coordinates.ts
export type CoordinateSystem = 'WGS84' | 'UTM' | 'LAMBERT' | 'MERCATOR';

export type Coordinate = {
  id: string;
  x: string;
  y: string;
  z: string;
  system: CoordinateSystem;
  zone?: number;
  hemisphere?: 'N';
};