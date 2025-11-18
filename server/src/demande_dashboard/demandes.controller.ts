import { Controller, Get, Header, Param, Query, Res } from '@nestjs/common';
import { DemandesService } from './demandes.service';
import { Response } from 'express';

@Controller('demandes_dashboard')
export class DemandesController {
  constructor(private readonly service: DemandesService) {}

@Get()
async list(
  @Query('page') page?: string,
  @Query('pageSize') pageSize?: string,
  @Query('search') search?: string,
  @Query('statut') statut?: string,
  @Query('wilayaId') wilayaId?: string,
  @Query('typePermisId') typePermisId?: string,
  @Query('typeProcId') typeProcId?: string,
  @Query('demandeId') demandeId?: string, // Add this
  @Query('fromDate') fromDate?: string,
  @Query('toDate') toDate?: string,
  @Query('sortBy') sortBy?: string,
  @Query('sortOrder') sortOrder?: 'asc' | 'desc',
) {
  return this.service.findMany({
    page: page ? +page : undefined,
    pageSize: pageSize ? +pageSize : undefined,
    search,
    statut,
    wilayaId: wilayaId ? +wilayaId : undefined,
    typePermisId: typePermisId ? +typePermisId : undefined,
    typeProcId: typeProcId ? +typeProcId : undefined,
    demandeId: demandeId ? +demandeId : undefined, // Pass this
    fromDate,
    toDate,
    sortBy,
    sortOrder,
  });
}

@Get('stats')
async stats(
  @Query('statut') statut?: string,
  @Query('wilayaId') wilayaId?: string,
  @Query('typePermisId') typePermisId?: string,
  @Query('typeProcId') typeProcId?: string,
  @Query('demandeId') demandeId?: string, // Add this
  @Query('fromDate') fromDate?: string,
  @Query('toDate') toDate?: string,
) {
  return this.service.stats({
    statut,
    wilayaId: wilayaId ? +wilayaId : undefined,
    typePermisId: typePermisId ? +typePermisId : undefined,
    typeProcId: typeProcId ? +typeProcId : undefined,
    demandeId: demandeId ? +demandeId : undefined, // Pass this
    fromDate,
    toDate,
  });
}

@Get('export')
@Header('Content-Type', 'text/csv')
async export(
  @Res() res: Response,
  @Query('page') page?: string,
  @Query('pageSize') pageSize?: string,
  @Query('search') search?: string,
  @Query('statut') statut?: string,
  @Query('wilayaId') wilayaId?: string,
  @Query('typePermisId') typePermisId?: string,
  @Query('typeProcId') typeProcId?: string,
  @Query('demandeId') demandeId?: string, // Add this
  @Query('fromDate') fromDate?: string,
  @Query('toDate') toDate?: string,
  @Query('sortBy') sortBy?: string,
  @Query('sortOrder') sortOrder?: 'asc' | 'desc',
) {
  const csv = await this.service.exportCSV({
    page: page ? +page : undefined,
    pageSize: pageSize ? +pageSize : undefined,
    search,
    statut,
    wilayaId: wilayaId ? +wilayaId : undefined,
    typePermisId: typePermisId ? +typePermisId : undefined,
    typeProcId: typeProcId ? +typeProcId : undefined,
    demandeId: demandeId ? +demandeId : undefined, // Pass this
    fromDate,
    toDate,
    sortBy,
    sortOrder,
  });
  res.setHeader('Content-Disposition', `attachment; filename="demandes_export.csv"`);
  res.send(csv);
}

  @Get('mine')
  async mine(@Query('responsable') responsable?: string) {
    return this.service.findByResponsable(responsable ?? '');
  }
  @Get(':id')
  async one(@Param('id') id: string) {
    return this.service.getDemandeById(+id);
  }
}
