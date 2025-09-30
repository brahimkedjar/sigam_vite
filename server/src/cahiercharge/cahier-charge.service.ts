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

    if (!cahier) throw new NotFoundException('Aucun cahier trouvé');
    return cahier;
  }

 async createOrUpdate(id_demande: number, data: any, isUpdate = false) {
  const { id, ...rest } = data;

  const toNumber = (val: any) =>
    val !== '' && val !== null && val !== undefined ? Number(val) : null;

  const toInt = (val: any) =>
    val !== '' && val !== null && val !== undefined ? parseInt(val, 10) : null;

  const toDate = (val: any) =>
    val !== '' && val !== null && val !== undefined ? new Date(val) : null;

  const payload: any = {
  demandeId: id_demande,
  ...(data.permisId ? { permisId: data.permisId } : {}),
  ...(rest.dateCreation ? { dateCreation: new Date(rest.dateCreation) } : {}),
  ...(rest.dateExercice ? { dateExercice: new Date(`${rest.dateExercice}-01-01`) } : {}),
  ...(rest.fuseau && { fuseau: rest.fuseau }),
  ...(rest.typeCoordonnees && { typeCoordonnees: rest.typeCoordonnees }),
  ...(rest.natureJuridique && { natureJuridique: rest.natureJuridique }),
  ...(rest.vocationTerrain && { vocationTerrain: rest.vocationTerrain }),
  ...(rest.nomGerant && { nomGerant: rest.nomGerant }),
  ...(rest.personneChargeTrxx && { personneChargeTrxx: rest.personneChargeTrxx }),
  ...(rest.qualification && { qualification: rest.qualification }),
  ...(rest.reservesGeologiques ? { reservesGeologiques: Number(rest.reservesGeologiques) } : {}),
  ...(rest.reservesExploitables ? { reservesExploitables: Number(rest.reservesExploitables) } : {}),
  ...(rest.volumeExtraction ? { volumeExtraction: Number(rest.volumeExtraction) } : {}),
  ...(rest.dureeExploitation ? { dureeExploitation: parseInt(rest.dureeExploitation, 10) } : {}),
  ...(rest.methodeExploitation && { methodeExploitation: rest.methodeExploitation }),
  ...(rest.dureeTravaux ? { dureeTravaux: parseInt(rest.dureeTravaux, 10) } : {}),
  ...(rest.dateDebutTravaux ? { dateDebutTravaux: new Date(rest.dateDebutTravaux) } : {}),
  ...(rest.dateDebutProduction ? { dateDebutProduction: new Date(rest.dateDebutProduction) } : {}),
  ...(rest.investissementDA ? { investissementDA: Number(rest.investissementDA) } : {}),
  ...(rest.investissementUSD ? { investissementUSD: Number(rest.investissementUSD) } : {}),
  ...(rest.capaciteInstallee ? { capaciteInstallee: Number(rest.capaciteInstallee) } : {}),
  ...(rest.commentaires && { commentaires: rest.commentaires }),
};


  if (isUpdate) {
    await this.prisma.cahierCharge.updateMany({
      where: { demandeId: id_demande },
      data: payload,
    });
    return this.findOneByDemande(id_demande);
  } else {
    return this.prisma.cahierCharge.create({
      data: payload,
    });
  }
}

async createOrUpdateByPermis(permisId: number, data: any, isUpdate = false) {
  const { id, ...rest } = data;

  const payload: any = {
    permisId,
    num_cdc: rest.num_cdc,
    dateExercice: new Date(`${rest.dateExercice}-01-01`),
    fuseau: rest.fuseau || null,
    typeCoordonnees: rest.typeCoordonnees || null,
    natureJuridique: rest.natureJuridique || null,
    vocationTerrain: rest.vocationTerrain || null,
    nomGerant: rest.nomGerant || null,
    personneChargeTrxx: rest.personneChargeTrxx || null,
    qualification: rest.qualification || null,
    reservesGeologiques: rest.reservesGeologiques ? Number(rest.reservesGeologiques) : null,
    reservesExploitables: rest.reservesExploitables ? Number(rest.reservesExploitables) : null,
    volumeExtraction: rest.volumeExtraction ? Number(rest.volumeExtraction) : null,
    dureeExploitation: rest.dureeExploitation ? parseInt(rest.dureeExploitation, 10) : null,
    methodeExploitation: rest.methodeExploitation || null,
    dureeTravaux: rest.dureeTravaux ? parseInt(rest.dureeTravaux, 10) : null,
    dateDebutTravaux: rest.dateDebutTravaux ? new Date(rest.dateDebutTravaux) : null,
    dateDebutProduction: rest.dateDebutProduction ? new Date(rest.dateDebutProduction) : null,
    investissementDA: rest.investissementDA ? Number(rest.investissementDA) : null,
    investissementUSD: rest.investissementUSD ? Number(rest.investissementUSD) : null,
    capaciteInstallee: rest.capaciteInstallee ? Number(rest.capaciteInstallee) : null,
    commentaires: rest.commentaires || null,
  };

  const existing = await this.prisma.cahierCharge.findFirst({
    where: {
      permisId,
      num_cdc:rest.num_cdc,
    },
  });

  if (existing && isUpdate) {
    await this.prisma.cahierCharge.update({
      where: { id: existing.id },
      data: payload,
    });
    return this.prisma.cahierCharge.findUnique({ where: { id: existing.id } });
  }

  if (!existing && !isUpdate) {
    return this.prisma.cahierCharge.create({ data: payload });
  }

  throw new NotFoundException('Aucune entrée existante à mettre à jour');
}




async delete(id_demande: number) {
  return await this.prisma.cahierCharge.deleteMany({
    where: { demandeId: id_demande }, // Fix here too
  });
}

async findManyByPermis(permisId: number) {
  return await this.prisma.cahierCharge.findMany({
    where: {
      permisId: permisId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

}
