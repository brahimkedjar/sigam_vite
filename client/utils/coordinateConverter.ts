// utils/coordinateConverter.ts
import proj4 from 'proj4';

// === Define base coordinate systems ===
proj4.defs([
  ['WGS84', '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'],
  ['EPSG:4326', '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'],
  ['EPSG:3857', '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs'],
]);

// === UTM zone definitions (1–60, N and S) ===
for (let zone = 1; zone <= 60; zone++) {
  proj4.defs(
    `EPSG:326${zone.toString().padStart(2, '0')}`,
    `+proj=utm +zone=${zone} +ellps=WGS84 +datum=WGS84 +units=m +no_defs`
  );

  proj4.defs(
    `EPSG:327${zone.toString().padStart(2, '0')}`,
    `+proj=utm +zone=${zone} +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs`
  );
}

// === Algeria Lambert Conformal Conic ===
// EPSG:30491 – Nord Algerie (Clarke 1880)
// This is widely used in mining and geology
proj4.defs(
  'EPSG:30491',
  '+proj=lcc +lat_1=37.06666666666667 +lat_2=36.21666666666667 ' +
    '+lat_0=36.0 +lon_0=3.0 +x_0=500000.0 +y_0=300000.0 ' +
    '+ellps=clrk80 +units=m +no_defs'
);

export type CoordinateSystem = 'WGS84' | 'UTM' | 'LAMBERT' | 'MERCATOR';

export interface Point {
  x: number;
  y: number;
  z: number;
  system: CoordinateSystem;
  zone?: number;
  hemisphere?: 'N';
}

export class CoordinateConverter {
  /**
   * Convert coordinates between systems
   */
  static convertCoordinate(
    point: Point,
    targetSystem: CoordinateSystem,
    targetZone?: number,
    targetHemisphere?: 'N' 
  ): Point {
    if (point.system === targetSystem) {
      return { ...point };
    }

    const sourceProj = this.getProjString(point);
    const targetProj = this.getProjString({
      system: targetSystem,
      zone: targetZone || point.zone,
      hemisphere: (targetHemisphere || point.hemisphere || 'N') as 'N' ,
    });

    try {
      const [x, y] = proj4(sourceProj, targetProj, [point.x, point.y]);
      return {
        x,
        y,
        z: point.z,
        system: targetSystem,
        zone: targetZone || point.zone,
        hemisphere: (targetHemisphere || point.hemisphere || 'N') as 'N',
      };
    } catch (error) {
      console.error('Coordinate conversion error:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to convert coordinates: ${error.message}`);
      } else {
        throw new Error('Failed to convert coordinates: Unknown error');
      }
    }
  }

  /**
   * Get PROJ string for a system
   */
  private static getProjString(point: {
    system: CoordinateSystem;
    zone?: number;
    hemisphere?: 'N';
  }): string {
    switch (point.system) {
      case 'WGS84':
        return 'EPSG:4326';

      case 'UTM':
        if (!point.zone) throw new Error('UTM zone is required');
        // Default to Northern hemisphere for Algeria
        const hemi = point.hemisphere || 'N';
        const zoneCode = point.zone.toString().padStart(2, '0');
        return hemi === 'N'
          ? `EPSG:326${zoneCode}`
          : `EPSG:327${zoneCode}`;

      case 'MERCATOR':
        return 'EPSG:3857';

      case 'LAMBERT':
        // Use official EPSG:30491 – Nord Algérie (Clarke 1880)
        return 'EPSG:30491';

      default:
        throw new Error(`Unsupported coordinate system: ${point.system}`);
    }
  }

  /**
   * Calculate polygon area (UTM or Lambert) with shoelace formula
   */
  static calculateUTMArea(points: Point[]): number {
    if (points.length < 3) return 0;

    const closed = [...points];
    if (
      closed[0].x !== closed[closed.length - 1].x ||
      closed[0].y !== closed[closed.length - 1].y
    ) {
      closed.push(closed[0]);
    }

    let area = 0;
    for (let i = 0; i < closed.length - 1; i++) {
      area += closed[i].x * closed[i + 1].y - closed[i + 1].x * closed[i].y;
    }

    return Math.abs(area) / 2;
  }

  /**
   * Validate UTM
   */
  static validateUTM(
    x: number,
    y: number,
    zone: number,
    hemisphere?: 'N'
  ): boolean {
    if (x < 100000 || x > 999999) return false;
    const hemi = hemisphere || 'N';
    if (hemi === 'N') {
      if (y < 0 || y > 10000000) return false;
    } else {
      if (y < 1000000 || y > 10000000) return false;
    }
    if (zone < 1 || zone > 60) return false;
    return true;
  }

  /**
   * Validate WGS84
   */
  static validateWGS84(x: number, y: number): boolean {
    if (x < -180 || x > 180) return false;
    if (y < -90 || y > 90) return false;
    return true;
  }
}
