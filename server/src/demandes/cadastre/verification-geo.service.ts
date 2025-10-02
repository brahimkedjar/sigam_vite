import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VerificationGeoService {
  constructor(private readonly prisma: PrismaService) {}

  async getByDemande(id_demande: number) {
    return this.prisma.demandeVerificationGeo.findUnique({ where: { id_demande } });
  }

  async upsertByDemande(id_demande: number, body: {
    sit_geo_ok?: boolean;
    empiet_ok?: boolean;
    superf_ok?: boolean;
    geom_ok?: boolean;
    verification_cadastrale_ok?: boolean;
    superficie_cadastrale?: number;
  }) {
    const computedOk =
      body.verification_cadastrale_ok !== undefined
        ? body.verification_cadastrale_ok
        : [body.sit_geo_ok, body.empiet_ok, body.superf_ok, body.geom_ok]
            .filter((v) => v !== undefined)
            .every((v) => v === true);

    const verif = await this.prisma.demandeVerificationGeo.upsert({
      where: { id_demande },
      update: {
        sit_geo_ok: body.sit_geo_ok,
        empiet_ok: body.empiet_ok,
        superf_ok: body.superf_ok,
        geom_ok: body.geom_ok,
        verification_cadastrale_ok: computedOk,
        superficie_cadastrale: body.superficie_cadastrale,
      },
      create: {
        id_demande,
        sit_geo_ok: body.sit_geo_ok,
        empiet_ok: body.empiet_ok,
        superf_ok: body.superf_ok,
        geom_ok: body.geom_ok,
        verification_cadastrale_ok: computedOk,
        superficie_cadastrale: body.superficie_cadastrale,
      },
    });

    // Also persist superficie cadastrale into Demande.superficie when provided
    if (typeof body.superficie_cadastrale === 'number') {
      await this.prisma.demande.update({
        where: { id_demande },
        data: { superficie: body.superficie_cadastrale },
      });
    }

    return verif;
  }
}
