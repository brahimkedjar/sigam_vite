import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubstancesService {
  constructor(private prisma: PrismaService) {}

  async findAll(famille?: string) {
  return this.prisma.substance.findMany({
    where: famille ? { categorie_sub: famille } : {},
    orderBy: { nom_subFR: 'asc' } // Sort alphabetically
  });
}

// substances.service.ts
async getSelectedByDemande(id_demande: number) {
  const demande = await this.prisma.demande.findUnique({
    where: { id_demande },
    select: {
      id_proc: true,
      procedure: {
        select: {
          SubstanceAssocieeDemande: {
            select: {
              substance: true,
              priorite: true  
            }
          }
        }
      }
    }
  });

  return demande?.procedure?.SubstanceAssocieeDemande.map(s => ({
    ...s.substance,
    priorite: s.priorite  
  }));
}

async updatePriority(id_demande: number, id_substance: number, priorite: string) {
  const demande = await this.prisma.demande.findUnique({
    where: { id_demande },
    select: { id_proc: true }
  });

  const validPriorite = priorite === 'principale' ? 'principale' : 'secondaire';

  return this.prisma.substanceAssocieeDemande.update({
    where: {
      id_proc_id_substance: {
        id_proc: demande?.id_proc,
        id_substance
      }
    },
    data: {
      priorite: validPriorite
    }
  });
}

async addToDemande(id_demande: number, id_substance: number, priorite: string = 'secondaire') {
  const demande = await this.prisma.demande.findUnique({
    where: { id_demande },
    select: { id_proc: true }
  });

  const validPriorite = priorite === 'principale' ? 'principale' : 'secondaire';

  return this.prisma.substanceAssocieeDemande.create({
    data: {
      id_proc: demande?.id_proc,
      id_substance,
      priorite: validPriorite 
    }
  });
}

  async removeFromDemande(id_demande: number, id_substance: number) {
    const demande = await this.prisma.demande.findUnique({
      where: { id_demande },
      select: { id_proc: true }
    });

    return this.prisma.substanceAssocieeDemande.delete({
      where: {
        id_proc_id_substance: {
          id_proc: demande?.id_proc,
          id_substance
        }
      }
    });
  }
}
