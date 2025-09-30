import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { 
  CreateSeanceDto, 
  UpdateSeanceDto,
  CreateComiteDto,
  UpdateComiteDto,
  CreateDecisionDto,
  CreateMembreDto,
  UpdateMembreDto
} from '../dto/cd.dto';

@Injectable()
export class CdService {
  constructor(private prisma: PrismaService) {}

  
  // Seance Operations
  async createSeance(createSeanceDto: CreateSeanceDto) {
    const numSeance = this.generateSeanceNumber(createSeanceDto.exercice);
    
    return this.prisma.seanceCDPrevue.create({
      data: {
  num_seance: numSeance,
  date_seance: new Date(createSeanceDto.date_seance),
  exercice: createSeanceDto.exercice,
  remarques: createSeanceDto.remarques,
  statut: 'programmee', 
  membres: {
    connect: createSeanceDto.membre_ids.map(id => ({ id_membre: id }))
  }
},

      include: {
        membres: true,
        procedures: true
      }
    });
  }

  async getSeances(statut?: 'programmee' | 'terminee') {
    const where = statut ? { statut } : {};
    return this.prisma.seanceCDPrevue.findMany({
      where,
      include: {
        membres: true,
        procedures: {
          include: {
            demandes: {
              include: {
                detenteur: true
              }
            }
          }
        }
      },
      orderBy: {
        date_seance: 'desc'
      }
    });
  }

  async getSeanceById(id: number) {
    return this.prisma.seanceCDPrevue.findUnique({
      where: { id_seance: id },
      include: {
        membres: true,
        procedures: true,
        comites: {
          include: {
            decisionCDs: true
          }
        }
      }
    });
  }

  async updateSeance(id: number, updateSeanceDto: UpdateSeanceDto) {
    return this.prisma.seanceCDPrevue.update({
      where: { id_seance: id },
      data: {
        date_seance: updateSeanceDto.date_seance ? new Date(updateSeanceDto.date_seance) : undefined,
        exercice: updateSeanceDto.exercice,
        remarques: updateSeanceDto.remarques,
        membres: updateSeanceDto.membre_ids ? {
          set: updateSeanceDto.membre_ids.map(id => ({ id_membre: id }))
        } : undefined
      },
      include: {
        membres: true
      }
    });
  }

  async deleteSeance(id: number) {
    return this.prisma.seanceCDPrevue.delete({
      where: { id_seance: id }
    });
  }

  // Comite Operations
  async createComite(createComiteDto: CreateComiteDto) {
    const numDecision = this.generateDecisionNumber();
    
    return this.prisma.comiteDirection.create({
      data: {
        id_seance: createComiteDto.id_seance,
        date_comite: new Date(createComiteDto.date_comite),
        resume_reunion: createComiteDto.resume_reunion,
        fiche_technique: createComiteDto.fiche_technique,
        carte_projettee: createComiteDto.carte_projettee,
        rapport_police: createComiteDto.rapport_police,
        decisionCDs: createComiteDto.decisions ? {
          create: createComiteDto.decisions.map(decision => ({
            decision_cd: decision.decision_cd,
            duree_decision: decision.duree_decision,
            commentaires: decision.commentaires,
            numero_decision: numDecision
          }))
        } : undefined
      },
      include: {
        decisionCDs: true,
        seance: {
          include: {
            membres: true
          }
        }
      }
    });
  }

  async getComites() {
    return this.prisma.comiteDirection.findMany({
      include: {
        seance: true,
        decisionCDs: true
      },
      orderBy: {
        date_comite: 'desc'
      }
    });
  }

  async getComiteById(id: number) {
    return this.prisma.comiteDirection.findUnique({
      where: { id_comite: id },
      include: {
        seance: {
          include: {
            membres: true
          }
        },
        decisionCDs: true
      }
    });
  }

  async updateComite(id: number, updateComiteDto: UpdateComiteDto) {
    return this.prisma.$transaction(async (tx) => {
      // First delete existing decisions if updating
      if (updateComiteDto.decisions) {
        await tx.decisionCD.deleteMany({
          where: { id_comite: id }
        });
      }

      return tx.comiteDirection.update({
        where: { id_comite: id },
        data: {
          date_comite: updateComiteDto.date_comite ? new Date(updateComiteDto.date_comite) : undefined,
          resume_reunion: updateComiteDto.resume_reunion,
          fiche_technique: updateComiteDto.fiche_technique,
          carte_projettee: updateComiteDto.carte_projettee,
          rapport_police: updateComiteDto.rapport_police,
          decisionCDs: updateComiteDto.decisions ? {
            create: updateComiteDto.decisions.map(decision => ({
              decision_cd: decision.decision_cd,
              duree_decision: decision.duree_decision,
              commentaires: decision.commentaires,
              numero_decision:decision.numero_decision
            }))
          } : undefined
        },
        include: {
          decisionCDs: true
        }
      });
    });
  }

  async deleteComite(id: number) {
    return this.prisma.$transaction(async (tx) => {
      await tx.decisionCD.deleteMany({
        where: { id_comite: id }
      });

      return tx.comiteDirection.delete({
        where: { id_comite: id }
      });
    });
  }

  // Decision Operations
  async createDecision(createDecisionDto: CreateDecisionDto) {
    return this.prisma.decisionCD.create({
      data: {
        id_comite: createDecisionDto.id_comite,
        decision_cd: createDecisionDto.decision_cd,
        duree_decision: createDecisionDto.duree_decision,
        commentaires: createDecisionDto.commentaires,
        numero_decision: createDecisionDto.numero_decision
      }
    });
  }

  async getDecisionsByComite(comiteId: number) {
    return this.prisma.decisionCD.findMany({
      where: { id_comite: comiteId }
    });
  }

  // Member Operations
  async createMembre(createMembreDto: CreateMembreDto) {
    return this.prisma.membresComite.create({
      data: {
        nom_membre: createMembreDto.nom_membre,
        prenom_membre: createMembreDto.prenom_membre,
        fonction_membre: createMembreDto.fonction_membre,
        email_membre: createMembreDto.email_membre
      }
    });
  }

  async getMembres() {
    return this.prisma.membresComite.findMany();
  }

  async getMembreById(id: number) {
    return this.prisma.membresComite.findUnique({
      where: { id_membre: id }
    });
  }

  async updateMembre(id: number, updateMembreDto: UpdateMembreDto) {
    return this.prisma.membresComite.update({
      where: { id_membre: id },
      data: {
        nom_membre: updateMembreDto.nom_membre,
        prenom_membre: updateMembreDto.prenom_membre,
        fonction_membre: updateMembreDto.fonction_membre,
        email_membre: updateMembreDto.email_membre
      }
    });
  }

  async deleteMembre(id: number) {
    return this.prisma.membresComite.delete({
      where: { id_membre: id }
    });
  }

  // Procedure-Seance Relationship
  async addProcedureToSeance(seanceId: number, procedureId: number) {
    return this.prisma.seanceCDPrevue.update({
      where: { id_seance: seanceId },
      data: {
        procedures: {
          connect: { id_proc: procedureId }
        }
      },
      include: {
        procedures: true
      }
    });
  }

  async removeProcedureFromSeance(seanceId: number, procedureId: number) {
    return this.prisma.seanceCDPrevue.update({
      where: { id_seance: seanceId },
      data: {
        procedures: {
          disconnect: { id_proc: procedureId }
        }
      },
      include: {
        procedures: true
      }
    });
  }

  // Helper methods for generating unique numbers
  private generateSeanceNumber(exercice: number): string {
    return `CD-${exercice}-${Math.floor(100 + Math.random() * 900)}`;
  }

  private generateDecisionNumber(): string {
    const now = new Date();
    return `DEC-${now.getFullYear()}-${now.getMonth() + 1}-${Math.floor(1000 + Math.random() * 9000)}`;
  }
}