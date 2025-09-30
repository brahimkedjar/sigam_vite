import { Controller, Post, Body, HttpException, HttpStatus, Get, Param, Delete, Put, Query } from '@nestjs/common';
import { CoordonneesService } from './coordonnees.service';

@Controller('coordinates')
export class CoordonneesController {
  constructor(private readonly coordonneesService: CoordonneesService) {}

  @Get('/existing')
  async getExistingPerimeters() {
    return await this.coordonneesService.getExistingPerimeters();
  }

  @Post()
  async createCoordonnees(
    @Body() body: {
      id_proc: number;
      id_zone_interdite: number;
      points: {
        x: string;
        y: string;
        z: string;
        system?: string;
        zone?: number;
        hemisphere?: string;
      }[];
      statut_coord?: 'NOUVEAU' | 'ANCIENNE' | 'DEMANDE_INITIALE';
    }
  ) {
    return this.coordonneesService.createCoordonnees(
      body.id_proc,
      body.id_zone_interdite,
      body.points,
      body.statut_coord
    );
  }

  @Get('/procedure/:id')
  async getCoordonneesByProcedure(@Param('id') id_proc: string) {
    try {
      const coords = await this.coordonneesService.getCoordonneesByProcedure(Number(id_proc));
      return coords;
    } catch (error) {
      throw new HttpException('Failed to fetch coordinates', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/procedure/:id')
  async deleteCoordonneesByProcedure(@Param('id') id_proc: string) {
    try {
      return await this.coordonneesService.deleteCoordonneesByProcedure(Number(id_proc));
    } catch (error) {
      throw new HttpException('Failed to delete coordinates', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/update')
  async updateCoordonnees(
    @Body() body: {
      id_proc: number;
      id_zone_interdite: number;
      points: { 
        x: string; 
        y: string; 
        z: string;
        system?: string;
        zone?: number;
        hemisphere?: string;
      }[];
      statut_coord?: 'NOUVEAU' | 'ANCIENNE' | 'DEMANDE_INITIALE';
      superficie?: number;
    },
  ) {
    return this.coordonneesService.updateCoordonnees(
      body.id_proc,
      body.id_zone_interdite,
      body.points,
      body.statut_coord,
      body.superficie
    );
  }

  // New endpoint to get coordinate systems
  @Get('/systems')
  async getCoordinateSystems() {
    return {
      systems: [
        { value: 'WGS84', label: 'WGS84 (Lat/Lon)' },
        { value: 'UTM', label: 'UTM' },
        { value: 'LAMBERT', label: 'Lambert' },
        { value: 'MERCATOR', label: 'Mercator' }
      ]
    };
  }

  // In your controller
@Get('/zones/utm')
async getUTMZones() {
  return {
    zones: Array.from({ length: 60 }, (_, i) => i + 1),
    hemispheres: ['N', 'S']
  };
}

@Get('/convert')
async convertCoordinates(
  @Query('x') x: string,
  @Query('y') y: string,
  @Query('from') from: string,
  @Query('to') to: string,
  @Query('zone') zone?: string,
  @Query('hemisphere') hemisphere?: string
) {
  // Implement coordinate conversion logic here
  // This would use a library like proj4 for accurate conversions
  return this.coordonneesService.convertCoordinate(
    parseFloat(x),
    parseFloat(y),
    from,
    to,
    zone ? parseInt(zone) : undefined,
    hemisphere
  );
}
}