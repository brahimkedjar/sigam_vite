import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CoordonneesService } from '../cadastre/coordonnees.service';

type ProvisionalPoint = {
  x: number;
  y: number;
  z?: number;
  system?: string;
  zone?: number;
  hemisphere?: string;
};

@Injectable()
export class InscriptionProvisoireService {
  constructor(private readonly prisma: PrismaService, private readonly coordService: CoordonneesService) {}

  async upsertByProcedure(payload: {
    id_proc: number;
    id_demande?: number;
    points: ProvisionalPoint[];
    system?: string;
    zone?: number;
    hemisphere?: string;
    superficie_declaree?: number;
  }) {
    const { id_proc, id_demande, points, system, zone, hemisphere, superficie_declaree } = payload;

    // Resolve demande from procedure if not provided
    let demandeId = id_demande;
    if (!demandeId) {
      const demande = await this.prisma.demande.findFirst({
        where: { id_proc },
        select: { id_demande: true },
      });
      if (!demande) {
        throw new NotFoundException(`Aucune demande associée à la procédure ${id_proc}`);
      }
      demandeId = demande.id_demande;
    }

    // Build update/create data while avoiding overwriting superficie_declaree when it's not provided
    const superficieValue =
      superficie_declaree === undefined || superficie_declaree === null
        ? undefined
        : Number.isFinite(Number(superficie_declaree))
          ? Number(superficie_declaree)
          : undefined;

    const baseData: any = {
      id_demande: demandeId,
      points: points as any,
      system,
      zone,
      hemisphere: 'N',
    };

    const updateData: any = { ...baseData };
    if (superficieValue !== undefined) updateData.superficie_declaree = superficieValue;

    const createData: any = { id_proc, ...baseData };
    if (superficieValue !== undefined) createData.superficie_declaree = superficieValue;

    const record = await this.prisma.inscriptionProvisoire.upsert({
      where: { id_proc },
      update: {
        ...updateData,
      },
      create: {
        ...createData,
      },
    });

    return record;
  }

  async findByProcedure(id_proc: number) {
    const rec = await this.prisma.inscriptionProvisoire.findUnique({ where: { id_proc } });
    if (rec) return rec;

    // Fallback: if no provisional entry exists (e.g., after promotion),
    // return the definitive coordinates mapped to the expected shape so
    // the frontend can still render points.
    const links = await this.prisma.procedureCoord.findMany({
      where: { id_proc },
      include: { coordonnee: true },
      orderBy: { id_coordonnees: 'asc' },
    });

    const points = links.map((l) => ({
      x: l.coordonnee.x,
      y: l.coordonnee.y,
      z: l.coordonnee.z,
      system: l.coordonnee.system,
      zone: l.coordonnee.zone as any,
      hemisphere: l.coordonnee.hemisphere as any,
    }));

    return {
      id: undefined,
      id_proc,
      id_demande: undefined,
      points,
      system: null,
      zone: null,
      hemisphere: null,
      superficie_declaree: null,
    } as any;
  }

  async findByDemande(id_demande: number) {
    const rec = await this.prisma.inscriptionProvisoire.findUnique({ where: { id_demande } });
    return rec || null;
  }

  async promoteToDefinitive(id_proc: number) {
    const rec = await this.prisma.inscriptionProvisoire.findUnique({ where: { id_proc } });
    if (!rec) throw new NotFoundException('Aucune inscription provisoire pour cette procédure');

    const points = Array.isArray(rec.points) ? rec.points : [];
    if (points.length < 3) throw new NotFoundException('Polygone insuffisant pour promotion');

    const payloadPoints = points.map((p: any) => ({
      x: String(p.x),
      y: String(p.y),
      z: String(p.z ?? '0'),
      system: p.system,
      zone: p.zone,
      hemisphere: p.hemisphere,
    }));

    // Persist to definitive coordinates and link to procedure
    await this.coordService.updateCoordonnees(
      id_proc,
      null as any,
      payloadPoints,
      'NOUVEAU',
      undefined,
    );

    // Ne pas supprimer l'inscription provisoire (historisation conservée)
    return { message: 'Coordonnées promues en définitives (provisoire conservée)' };
  }
}
