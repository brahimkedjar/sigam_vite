import { Controller, Get, Param, Query } from '@nestjs/common';
import { PermisService } from './permis.service';

@Controller('permis')
export class PermisController {
  constructor(private readonly permisService: PermisService) {}

  @Get(':id')
  async getPermis(@Param('id') id: string) {
    const data = await this.permisService.getPermisById(id);
    return data;
  }

  @Get(':id/coordinates')
  async getCoordinates(@Param('id') id: string) {
    return this.permisService.getCoordinatesByPermisId(id);
  }

  // Stub endpoint for templates to keep designer happy

  // Optional: raw query (secured by read-only intent). Keep off by default.
  @Get('query/raw')
  async runRaw(@Query('sql') sql?: string) {
    if (!sql) return { rows: [] };
    return this.permisService.runRaw(sql);
  }

  @Get('procedure/:procedureId/permis')
  async findByProcedure(@Param('procedureId') procedureId: string) {
    const result = await this.permisService.findPermisByProcedure(procedureId);
    return result;
  }
}
