// src/cahier/cahier.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CahierService {
  constructor(private prisma: PrismaService) {}

  async findOneByDemande(id_demande: number) {
    const cahier = await this.prisma.cahierCharge.findFirst({
      where: { demandeId: id_demande },
    });

    if (!cahier) {
      throw new NotFoundException('Aucun cahier trouvé');
    }
    return cahier;
  }

  async createOrUpdate(id_demande: number, data: any, isUpdate = false) {
    const { id, ...rest } = data;

    const payload: any = {
      demandeId: id_demande,
      // champs obligatoires du modèle Prisma
      num_cdc: rest.num_cdc || String(id_demande),
      date_etablissement: rest.date_etablissement
        ? new Date(rest.date_etablissement)
        : new Date(),
      lieu_signature: rest.lieu_signature || '',
      signataire_administration: rest.signataire_administration || '',
      ...(data.permisId ? { permisId: data.permisId } : {}),
      ...(rest.dateExercice
        ? { dateExercice: new Date(`${rest.dateExercice}-01-01`) }
        : {}),
      ...(rest.fuseau && { fuseau: rest.fuseau }),
      ...(rest.typeCoordonnees && { typeCoordonnees: rest.typeCoordonnees }),
      ...(rest.natureJuridique && { natureJuridique: rest.natureJuridique }),
      ...(rest.vocationTerrain && { vocationTerrain: rest.vocationTerrain }),
      ...(rest.nomGerant && { nomGerant: rest.nomGerant }),
      ...(rest.personneChargeTrxx && { personneChargeTrxx: rest.personneChargeTrxx }),
      ...(rest.qualification && { qualification: rest.qualification }),
      ...(rest.reservesGeologiques
        ? { reservesGeologiques: Number(rest.reservesGeologiques) }
        : {}),
      ...(rest.reservesExploitables
        ? { reservesExploitables: Number(rest.reservesExploitables) }
        : {}),
      ...(rest.volumeExtraction
        ? { volumeExtraction: Number(rest.volumeExtraction) }
        : {}),
      ...(rest.dureeExploitation
        ? { dureeExploitation: parseInt(rest.dureeExploitation, 10) }
        : {}),
      ...(rest.methodeExploitation && {
        methodeExploitation: rest.methodeExploitation,
      }),
      ...(rest.dureeTravaux
        ? { dureeTravaux: parseInt(rest.dureeTravaux, 10) }
        : {}),
      ...(rest.dateDebutTravaux && {
        dateDebutTravaux: new Date(rest.dateDebutTravaux),
      }),
      ...(rest.dateDebutProduction && {
        dateDebutProduction: new Date(rest.dateDebutProduction),
      }),
      ...(rest.investissementDA && {
        investissementDA: Number(rest.investissementDA),
      }),
      ...(rest.investissementUSD && {
        investissementUSD: Number(rest.investissementUSD),
      }),
      ...(rest.capaciteInstallee && {
        capaciteInstallee: Number(rest.capaciteInstallee),
      }),
      ...(rest.commentaires && { commentaires: rest.commentaires }),
    };

    if (isUpdate) {
      await this.prisma.cahierCharge.updateMany({
        where: { demandeId: id_demande },
        data: payload,
      });
      return this.findOneByDemande(id_demande);
    }

    return this.prisma.cahierCharge.create({
      data: payload,
    });
  }

  async createOrUpdateByPermis(
    permisId: number,
    data: any,
    isUpdate = false,
  ) {
    const { id, ...rest } = data;

    const payload: any = {
      permisId,
      // champs obligatoires
      num_cdc: rest.num_cdc || String(permisId),
      date_etablissement: rest.date_etablissement
        ? new Date(rest.date_etablissement)
        : new Date(),
      lieu_signature: rest.lieu_signature || '',
      signataire_administration: rest.signataire_administration || '',
      dateExercice: new Date(`${rest.dateExercice}-01-01`),
      fuseau: rest.fuseau || null,
      typeCoordonnees: rest.typeCoordonnees || null,
      natureJuridique: rest.natureJuridique || null,
      vocationTerrain: rest.vocationTerrain || null,
      nomGerant: rest.nomGerant || null,
      personneChargeTrxx: rest.personneChargeTrxx || null,
      qualification: rest.qualification || null,
      reservesGeologiques: rest.reservesGeologiques
        ? Number(rest.reservesGeologiques)
        : null,
      reservesExploitables: rest.reservesExploitables
        ? Number(rest.reservesExploitables)
        : null,
      volumeExtraction: rest.volumeExtraction
        ? Number(rest.volumeExtraction)
        : null,
      dureeExploitation: rest.dureeExploitation
        ? parseInt(rest.dureeExploitation, 10)
        : null,
      methodeExploitation: rest.methodeExploitation || null,
      dureeTravaux: rest.dureeTravaux
        ? parseInt(rest.dureeTravaux, 10)
        : null,
      dateDebutTravaux: rest.dateDebutTravaux
        ? new Date(rest.dateDebutTravaux)
        : null,
      dateDebutProduction: rest.dateDebutProduction
        ? new Date(rest.dateDebutProduction)
        : null,
      investissementDA: rest.investissementDA
        ? Number(rest.investissementDA)
        : null,
      investissementUSD: rest.investissementUSD
        ? Number(rest.investissementUSD)
        : null,
      capaciteInstallee: rest.capaciteInstallee
        ? Number(rest.capaciteInstallee)
        : null,
      commentaires: rest.commentaires || null,
    };

    const existing = await this.prisma.cahierCharge.findFirst({
      where: {
        permisId,
        num_cdc: rest.num_cdc,
      },
    });

    if (existing && isUpdate) {
      await this.prisma.cahierCharge.update({
        where: { id: existing.id },
        data: payload,
      });
      return this.prisma.cahierCharge.findUnique({
        where: { id: existing.id },
      });
    }

    if (!existing && !isUpdate) {
      return this.prisma.cahierCharge.create({ data: payload });
    }

    throw new NotFoundException(
      'Aucune entrée existante à mettre à jour',
    );
  }

  async delete(id_demande: number) {
    return this.prisma.cahierCharge.deleteMany({
      where: { demandeId: id_demande },
    });
  }

  async findManyByPermis(permisId: number) {
    return this.prisma.cahierCharge.findMany({
      where: {
        permisId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

