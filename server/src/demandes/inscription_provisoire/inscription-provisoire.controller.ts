import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { InscriptionProvisoireService } from './inscription-provisoire.service';

@Controller('inscription-provisoire')
export class InscriptionProvisoireController {
  constructor(private readonly service: InscriptionProvisoireService) {}

  @Post()
  async upsert(@Body() body: {
    id_proc: number;
    id_demande?: number;
    points: { x: number; y: number; z?: number; system?: string; zone?: number; hemisphere?: string }[];
    system?: string;
    zone?: number;
    hemisphere?: string;
    superficie_declaree?: number;
  }) {
    return this.service.upsertByProcedure(body);
  }

  @Get('/procedure/:id')
  async getByProcedure(@Param('id') id: string) {
    const id_proc = Number(id);
    if (isNaN(id_proc)) throw new NotFoundException('Procédure invalide');
    const rec = await this.service.findByProcedure(id_proc);
    if (!rec) {
      return { id_proc, points: [], superficie_declaree: null };
    }
    return rec;
  }

  @Get('/demande/:id')
  async getByDemande(@Param('id') id: string) {
    const id_demande = Number(id);
    if (isNaN(id_demande)) throw new NotFoundException('Demande invalide');
    const rec = await this.service.findByDemande(id_demande);
    if (!rec) {
      return { id_demande, points: [], superficie_declaree: null };
    }
    return rec;
  }

  @Post('/promote/:id')
  async promote(@Param('id') id: string) {
    const id_proc = Number(id);
    if (isNaN(id_proc)) throw new NotFoundException('Procédure invalide');
    return this.service.promoteToDefinitive(id_proc);
  }
}
