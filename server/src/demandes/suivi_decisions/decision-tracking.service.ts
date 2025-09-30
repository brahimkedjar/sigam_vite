// decision-tracking/decision-tracking.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DecisionTrackingService {
  constructor(private prisma: PrismaService) {}

  async getDecisionTrackingData() {
  return this.prisma.procedure.findMany({
    where: {
      id_seance: { not: null },
    },
    include: {
      demandes: {
        include: {
          detenteur: true,
          typeProcedure: true, // 🔑 get TypeProcedure from demande
        },
        take: 1, // only first demande
      },
      seance: {
        include: {
          comites: {
            include: {
              decisionCDs: true,
            },
          },
        },
      },
    },
    orderBy: {
      date_debut_proc: 'desc',
    },
  });
}


  async getDecisionStats() {
    const total = await this.prisma.procedure.count({
      where: { id_seance: { not: null } },
    });

    const approved = await this.prisma.decisionCD.count({
      where: { decision_cd: 'favorable' }
    });

    const rejected = await this.prisma.decisionCD.count({
      where: { decision_cd: 'defavorable' }
    });

    return { total, approved, rejected };
  }

  async getProcedureDetails(id: number) {
  return this.prisma.procedure.findUnique({
    where: { id_proc: id },
    include: {
      demandes: {
        include: {
          detenteur: true,
          typePermis: true,
          typeProcedure: true, // 🔑 moved here
        },
        take: 1, // you’re taking only the first demande
      },
      seance: {
        include: {
          comites: {
            include: {
              decisionCDs: true,
            },
          },
        },
      },
      permis: {
        include: {
          detenteur: true,
        },
      },
    },
  });
}
}