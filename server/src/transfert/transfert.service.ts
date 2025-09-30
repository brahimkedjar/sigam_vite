import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma, StatutProcedure } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { ProcedureEtapeService } from '../procedure_etape/procedure-etape.service';
import { StartTransfertDto } from './start-transfert.dto';
import { CreateDetenteurDto } from './create-detenteur.dto';

@Injectable()
export class TransfertService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly procedureEtapeService: ProcedureEtapeService,
  ) {}

  /**
   * Recupere les informations du permis, du detenteur actuel et de la derniere demande liee.
   */
  async getPermisDetails(permisId: number) {
    const permis = await this.prisma.permis.findUnique({
      where: { id: permisId },
      include: {
        detenteur: {
          include: {
            registreCommerce: true,
            fonctions: { include: { personne: true } },
          },
        },
        typePermis: true,
        statut: true,
        procedures: {
          orderBy: { date_debut_proc: 'desc' },
          include: {
            demandes: {
              orderBy: { date_demande: 'desc' },
              include: {
                typeProcedure: true,
              },
            },
          },
        },
      },
    });

    if (!permis) {
      throw new NotFoundException('Permis not found');
    }

    const latestDemande = permis.procedures
      ?.flatMap((procedure) => procedure.demandes ?? [])
      ?.sort((a, b) => {
        const dateA = a.date_demande ? new Date(a.date_demande).getTime() : 0;
        const dateB = b.date_demande ? new Date(b.date_demande).getTime() : 0;
        return dateB - dateA;
      })[0] ?? null;

    return { permis, latestDemande };
  }

  async searchDetenteurs(q?: string, take = 20, skip = 0) {
    const where: Prisma.DetenteurMoraleWhereInput = q
      ? {
          OR: [
            { nom_societeFR: { contains: q, mode: 'insensitive' } },
            { nom_societeAR: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } },
            { telephone: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {};

    return this.prisma.detenteurMorale.findMany({
      where,
      take,
      skip,
      orderBy: { nom_societeFR: 'asc' },
      include: {
        registreCommerce: true,
        fonctions: { include: { personne: true } },
      },
    });
  }

  async getDetenteurFull(id_detenteur: number) {
    const detenteur = await this.prisma.detenteurMorale.findUnique({
      where: { id_detenteur },
      include: {
        registreCommerce: true,
        fonctions: { include: { personne: true } },
      },
    });

    if (!detenteur) {
      throw new NotFoundException('Detenteur not found');
    }

    return detenteur;
  }

  async createDetenteurFromDto(payload: CreateDetenteurDto) {
    const detenteurId = await this.prisma.$transaction(async (tx) => {
      const created = await this.createDetenteur(payload, tx);
      return created.id_detenteur;
    });

    return this.getDetenteurFull(detenteurId);
  }
  /**
   * Cree un detenteur moral complet (registre, personnes, fonctions) a l'interieur d'une transaction.
   */
  private async createDetenteur(payload: any, tx: Prisma.TransactionClient = this.prisma) {
    const detenteur = await tx.detenteurMorale.create({
      data: {
        nom_societeFR: payload.nom_societeFR,
        nom_societeAR: payload.nom_societeAR,
        id_statutJuridique: payload.id_statutJuridique ? Number(payload.id_statutJuridique) : null,
        id_pays: payload.id_pays ?? null,
        adresse_siege: payload.adresse_siege ?? null,
        telephone: payload.telephone ?? null,
        fax: payload.fax ?? null,
        email: payload.email ?? null,
        site_web: payload.site_web ?? null,
      },
    });

    if (payload.registreCommerce) {
      await tx.registreCommerce.create({
        data: {
          id_detenteur: detenteur.id_detenteur,
          numero_rc: payload.registreCommerce.numero_rc ?? null,
          date_enregistrement: payload.registreCommerce.date_enregistrement
            ? new Date(payload.registreCommerce.date_enregistrement)
            : null,
          capital_social: payload.registreCommerce.capital_social
            ? Number(payload.registreCommerce.capital_social)
            : null,
          nis: payload.registreCommerce.nis ?? null,
          nif: payload.registreCommerce.nif ?? null,
          adresse_legale: payload.registreCommerce.adresse_legale ?? null,
        },
      });
    }

    const personneIdByTemp = new Map<number, number>();

    if (Array.isArray(payload.personnes)) {
      for (const person of payload.personnes) {
        const created = await tx.personnePhysique.create({
          data: {
            id_pays: person.id_pays ? Number(person.id_pays) : 1,
            nomFR: person.nomFR,
            nomAR: person.nomAR ?? '',
            prenomFR: person.prenomFR,
            prenomAR: person.prenomAR ?? '',
            date_naissance: person.date_naissance ? new Date(person.date_naissance) : null,
            lieu_naissance: person.lieu_naissance ?? '',
            nationalite: person.nationalite ?? '',
            adresse_domicile: person.adresse_domicile ?? '',
            telephone: person.telephone ?? '',
            fax: person.fax ?? '',
            email: person.email ?? '',
            qualification: person.qualification ?? '',
            num_carte_identite: person.num_carte_identite ?? '',
            lieu_juridique_soc: person.lieu_juridique_soc ?? '',
            ref_professionnelles: person.ref_professionnelles ?? '',
          },
        });

        if (typeof person._temp === 'number') {
          personneIdByTemp.set(person._temp, created.id_personne);
        }
      }
    }

    if (Array.isArray(payload.fonctions)) {
      for (const fonction of payload.fonctions) {
        let id_personne = fonction.id_personne ? Number(fonction.id_personne) : undefined;

        if (!id_personne && typeof fonction.id_personne_temp === 'number') {
          id_personne = personneIdByTemp.get(fonction.id_personne_temp);
        }

        if (!id_personne) {
          continue;
        }

        await tx.fonctionPersonneMoral.create({
          data: {
            id_detenteur: detenteur.id_detenteur,
            id_personne,
            type_fonction: fonction.type_fonction,
            statut_personne: fonction.statut_personne ?? '',
            taux_participation: fonction.taux_participation ? Number(fonction.taux_participation) : 0,
          },
        });
      }
    }

    return detenteur;
  }

  /**
   * Lance une procedure de transfert : cree la demande, la procedure et enregistre les deux detenteurs.
   */
  async startTransfert(dto: StartTransfertDto) {
    const result = await this.prisma.$transaction(async (tx) => {
      const permis = await tx.permis.findUnique({
        where: { id: dto.permisId },
        include: { typePermis: true },
      });

      if (!permis) {
        throw new NotFoundException('Permis not found');
      }

      let newDetenteurId = dto.existingDetenteurId ? Number(dto.existingDetenteurId) : undefined;

      if (!newDetenteurId && dto.newDetenteur) {
        const created = await this.createDetenteur(dto.newDetenteur, tx);
        newDetenteurId = created.id_detenteur;
      }

      if (!newDetenteurId) {
        throw new BadRequestException('Le nouveau detenteur est requis');
      }

      if (newDetenteurId === permis.id_detenteur) {
        throw new BadRequestException('Le nouveau detenteur doit etre different du detenteur actuel');
      }

      let typeProc = await tx.typeProcedure.findFirst({
        where: {
          libelle: {
            equals: 'transfert',
            mode: 'insensitive',
          },
        },
      });

      if (!typeProc) {
        typeProc = await tx.typeProcedure.findFirst({
          where: {
            libelle: {
              contains: 'transf',
              mode: 'insensitive',
            },
          },
        });
      }

      if (!typeProc) {
        throw new BadRequestException('Le type de procedure TRANSFERT est introuvable');
      }

      const activeProcedure = await tx.procedure.findFirst({
        where: {
          typeProcedureId: typeProc.id,
          statut_proc: { in: [StatutProcedure.EN_COURS, StatutProcedure.EN_ATTENTE] },
          permis: { some: { id: dto.permisId } },
        },
      });

      if (activeProcedure) {
        throw new BadRequestException('Un transfert est deja en cours pour ce permis');
      }

      const newProcedure = await tx.procedure.create({
        data: {
          num_proc: `TRF-${Date.now()}`,
          date_debut_proc: new Date(),
          statut_proc: StatutProcedure.EN_COURS,
          typeProcedureId: typeProc.id,
          permis: { connect: { id: dto.permisId } },
        },
      });

      const newDemande = await tx.demande.create({
        data: {
          id_proc: newProcedure.id_proc,
          id_detenteur: permis.id_detenteur,
          id_typeProc: typeProc.id,
          id_typePermis: permis.id_typePermis,
          code_demande: `TRF-DEMANDE-${Date.now()}`,
          date_demande: dto.date_demande ? new Date(dto.date_demande) : new Date(),
          statut_demande: StatutProcedure.EN_COURS,
          intitule_projet: dto.motif_transfert || 'Transfert de detention',
          description_travaux: dto.observations || '',
        },
      });

      const demTransfert = await tx.demTransfert.create({
        data: {
          id_demande: newDemande.id_demande,
          motif_transfert: dto.motif_transfert ?? null,
          observations: dto.observations ?? null,
          date_transfert: new Date(),
        },
      });

      await tx.transfertDetenteur.createMany({
        data: [
          {
            id_transfert: demTransfert.id_transfert,
            id_detenteur: permis.id_detenteur,
            type_detenteur: 'ANCIEN',
            role: 'CEDANT',
            date_enregistrement: new Date(),
          },
          {
            id_transfert: demTransfert.id_transfert,
            id_detenteur: newDetenteurId,
            type_detenteur: 'NOUVEAU',
            role: 'CESSIONNAIRE',
            date_enregistrement: new Date(),
          },
        ],
      });

      if (dto.applyTransferToPermis) {
        await tx.permis.update({
          where: { id: dto.permisId },
          data: { id_detenteur: newDetenteurId },
        });
      }

      return {
        demTransfert,
        newDetenteurId,
        newDemandeId: newDemande.id_demande,
        procId: newProcedure.id_proc,
      };
    });

    await this.procedureEtapeService.ensureProcedureHasPhases(result.procId);

    const firstPhase = await this.prisma.procedurePhase.findFirst({
      where: { id_proc: result.procId },
      orderBy: { ordre: 'asc' },
      include: {
        phase: {
          include: {
            etapes: { orderBy: { ordre_etape: 'asc' } },
          },
        },
      },
    });

    const firstEtape = firstPhase?.phase?.etapes?.[0];

    if (firstEtape) {
      await this.procedureEtapeService.setStepStatus(
        result.procId,
        firstEtape.id_etape,
        StatutProcedure.EN_COURS,
      );
    }

    return result;
  }

  /**
   * Retourne lhistorique des transferts associes a un permis donne.
   */
  async getHistoryByPermis(permisId: number) {
    const procedures = await this.prisma.procedure.findMany({
      where: { permis: { some: { id: permisId } } },
      include: { demandes: true },
    });

    const demandeIds = procedures.flatMap((procedure) => procedure.demandes.map((demande) => demande.id_demande));

    if (demandeIds.length === 0) {
      return [];
    }

    return this.prisma.demTransfert.findMany({
      where: { id_demande: { in: demandeIds } },
      orderBy: { date_transfert: 'desc' },
      include: {
        transfertDetenteur: {
          include: {
            detenteur: {
              include: {
                registreCommerce: true,
              },
            },
          },
        },
      },
    });
  }
}








