import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DemandesDashboardService {
  constructor(private prisma: PrismaService) {}

  async findPending() {
    return this.prisma.demande.findMany({
      where: {
        procedure: {
          statut_proc: 'EN_COURS'
        }
      },
      include: {
        detenteur: true,
        procedure: true
      },
      orderBy: {
        date_demande: 'desc'
      }
    });
  }
}