import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRenewalDto } from './create-renouvellement.dto';
import { PaymentService } from 'src/demandes/paiement/payment.service';
import { StatutProcedure } from '@prisma/client';
import { ProcedureEtapeService } from '../procedure_etape/procedure-etape.service';
import { StatutPermis } from './types';

@Injectable()
export class ProcedureRenouvellementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentService: PaymentService,
    private readonly procedureEtapeService: ProcedureEtapeService,
  ) {}

  async startRenewalWithOriginalData(
  permisId: number,
  date_demande: string,
  statut: StatutProcedure,
) {
  const now = new Date();

  if (!date_demande || isNaN(Date.parse(date_demande))) {
    throw new BadRequestException('La date de la demande est invalide.');
  }

  const permis = await this.prisma.permis.findUnique({
    where: { id: permisId },
    include: {
      typePermis: true,
      procedures: {
        include: {
          demandes: {
            include: { typeProcedure: true },
          },
        },
        orderBy: { date_debut_proc: 'asc' },
      },
    },
  });

  if (!permis || permis.procedures.length === 0) {
    throw new NotFoundException(
      'Aucune procédure initiale trouvée pour ce permis.',
    );
  }

  const initialProcedure = permis.procedures[0];
  const initialDemande = initialProcedure.demandes[0];

  const typeProc = await this.prisma.typeProcedure.findFirst({
    where: { libelle: { contains: 'renouvellement', mode: 'insensitive' } },
  });

  if (!typeProc) {
    throw new NotFoundException('TypeProcedure "renouvellement" introuvable');
  }

  // 🔑 Create only procedure (no id_typeproc here)
  // Generate renewal codes using same scheme
  const codeType = permis.typePermis.code_type;
  let seq = await this.prisma.demande.count();
  let demandeCode: string;
  do {
    seq += 1;
    demandeCode = `DEM-${codeType}-${seq}`;
  } while (await this.prisma.demande.findUnique({ where: { code_demande: demandeCode } }));

  const newProcedure = await this.prisma.procedure.create({
    data: {
      num_proc: `PROC-${codeType}-${seq}`,
      date_debut_proc: new Date(),
      statut_proc: statut,
      permis: { connect: { id: permis.id } },
    },
  });

  const parsedDate = new Date(date_demande);

  // 🔑 Link typeProcedure here at demande level
  const newDemande = await this.prisma.demande.create({
    data: {
      id_proc: newProcedure.id_proc,
      id_typePermis: permis.id_typePermis,
      id_typeProc: typeProc.id, // moved here
      code_demande: demandeCode,
      statut_demande: 'EN_COURS',
      date_demande: parsedDate,
      date_instruction: new Date()
    },
  });

  await this.prisma.procedureRenouvellement.create({
    data: {
      id_demande: newDemande.id_demande,
    },
  });

  return {
    original_demande_id: initialDemande?.id_demande,
    original_proc_id: initialProcedure?.id_proc,
    new_proc_id: newProcedure.id_proc,
    new_demande_id: newDemande.id_demande,
  };
}


  async getPermisForProcedure(procedureId: number) {
    const procedure = await this.prisma.procedure.findUnique({
      where: { id_proc: procedureId },
      include: {
        permis: {
          include: {
            typePermis: true,
            statut: true,
          },
        },
      },
    });
    return procedure?.permis[0] || null;
  }

  async createOrUpdateRenewal(procedureId: number, renewalData: any) {
    const procedure = await this.prisma.procedure.findUnique({
      where: { id_proc: procedureId },
      include: {
        permis: {
          include: {
            typePermis: true,
          },
        },
        demandes: true,
      },
    });

    if (!procedure) throw new NotFoundException('Procedure not found');

    const permit = procedure.permis[0];
    if (!permit) throw new NotFoundException('Permit not found');

    const permitType = permit.typePermis;
    if (!permitType) throw new NotFoundException('Permit type not found');

    const demande = procedure.demandes[0];
    if (!demande) throw new NotFoundException('Demande not found');

    const currentRenewalCount = await this.countPreviousRenewals(permit.id);

    if (currentRenewalCount >= permitType.nbr_renouv_max!) {
      throw new BadRequestException(`Maximum renewals (${permitType.nbr_renouv_max}) reached`);
    }

    const startDate = new Date(renewalData.date_debut_validite);
    const endDate = new Date(renewalData.date_fin_validite);

    await this.prisma.permis.update({
      where: { id: permit.id },
      data: {
        date_expiration: endDate,
        nombre_renouvellements: currentRenewalCount + 1,
      },
    });

    const updatedRenewal = await this.prisma.procedureRenouvellement.upsert({
      where: { id_demande: demande.id_demande },
      update: {
        num_decision: renewalData.num_decision,
        date_decision: new Date(renewalData.date_decision),
        date_debut_validite: startDate,
        date_fin_validite: endDate,
        commentaire: renewalData.commentaire,
      },
      create: {
        id_demande: demande.id_demande,
        num_decision: renewalData.num_decision,
        date_decision: new Date(renewalData.date_decision),
        date_debut_validite: startDate,
        date_fin_validite: endDate,
        commentaire: renewalData.commentaire,
      },
    });

    return updatedRenewal;
  }

  async getPermitTypeDetails(permitTypeId: number) {
    const permitType = await this.prisma.typePermis.findUnique({
      where: { id: permitTypeId },
    });

    if (!permitType) {
      throw new NotFoundException('Permit type not found');
    }

    return {
      duree_renouv: permitType.duree_renouv,
      nbr_renouv_max: permitType.nbr_renouv_max,
    };
  }

  async getPermisRenewals(permisId: number) {
    return this.prisma.demande.findMany({
      where: {
        procedure: {
          permis: { some: { id: permisId } },
        },
        renouvellement: { isNot: null },
      },
      include: {
        renouvellement: true,
        procedure: true,
      },
      orderBy: { date_demande: 'desc' },
    });
  }

  async updatePermisStatus(procedureId: number, status: string) {
    const normalizedStatus = status.toUpperCase();

    if (!Object.values(StatutPermis).includes(normalizedStatus as StatutPermis)) {
      throw new BadRequestException(
        `Invalid status: ${status}. Valid values are: ${Object.values(StatutPermis).join(', ')}`,
      );
    }

    const permit = await this.prisma.permis.findFirst({
      where: { procedures: { some: { id_proc: procedureId } } },
      include: { statut: true },
    });

    if (!permit) {
      throw new NotFoundException('Permis not found for this procedure');
    }

    try {
      const statut = await this.prisma.statutPermis.upsert({
        where: { lib_statut: normalizedStatus },
        create: {
          lib_statut: normalizedStatus,
          description: `Status ${normalizedStatus}`,
        },
        update: {},
      });

      return this.prisma.permis.update({
        where: { id: permit.id },
        data: {
          id_statut: statut.id,
        },
        include: {
          statut: true,
          procedures: true,
        },
      });
    } catch (error) {
      console.error('Error updating permit status:', error);
      throw new InternalServerErrorException('Failed to update permit status');
    }
  }

  async getRenewalData(procedureId: number) {
    const demande = await this.prisma.demande.findFirst({
      where: { id_proc: procedureId },
      include: {
        renouvellement: {
          include: {
            demande: {
              include: {
                procedure: {
                  include: {
                    permis: {
                      include: {
                        typePermis: true,
                        detenteur: true,
                        statut: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!demande || !demande.renouvellement) {
      throw new NotFoundException('Renewal data not found');
    }

    const renewal = demande.renouvellement;

    return {
      num_decision: renewal.num_decision,
      date_decision: renewal.date_decision?.toISOString().split('T')[0],
      date_debut_validite: renewal.date_debut_validite?.toISOString().split('T')[0],
      date_fin_validite: renewal.date_fin_validite?.toISOString().split('T')[0],
      commentaire: renewal.commentaire,
      permis: renewal.demande.procedure!.permis[0],
      nombre_renouvellements: renewal.demande.procedure!.permis[0].nombre_renouvellements,
    };
  }

  async countPreviousRenewals(permisId: number): Promise<number> {
  const permit = await this.prisma.permis.findUnique({
    where: { id: permisId },
    select: { nombre_renouvellements: true }
  });

  if (!permit) {
    throw new NotFoundException('Permit not found');
  }

  return permit.nombre_renouvellements || 0;
}
  async getProcedureWithType(id: number) {
    const procedure = await this.prisma.procedure.findUnique({
    where: { id_proc: id },
    include: {
      demandes: {
        include: {
          typeProcedure: true, // 🔑 typeProcedure now via demande
        },
      },
    },
  });

    if (!procedure) {
      throw new NotFoundException('Procédure non trouvée');
    }
    return procedure;
  }

  async deleteRenewal(procedureId: number) {
    const demande = await this.prisma.demande.findFirst({
      where: { id_proc: procedureId },
    });

    if (!demande) {
      throw new NotFoundException('Demande not found for this procedure');
    }

    await this.prisma.procedureRenouvellement.deleteMany({
      where: { id_demande: demande.id_demande },
    });
  }
}
