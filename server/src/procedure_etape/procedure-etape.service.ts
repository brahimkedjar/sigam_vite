// src/procedure-etape/procedure-etape.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProcedureEtape, StatutProcedure } from '@prisma/client';

@Injectable()
export class ProcedureEtapeService {
  constructor(private prisma: PrismaService) {}

  // src/procedure-etape/procedure-etape.service.ts

async setStepStatus(id_proc: number, id_etape: number, statut: StatutProcedure, link?: string) {
    const now = new Date();
    console.log('[setStepStatus] called', { id_proc, id_etape, targetStatut: statut, link });

    const existing = await this.prisma.procedureEtape.findUnique({
      where: { id_proc_id_etape: { id_proc, id_etape } },
    });
    console.log('[setStepStatus] existing ProcedureEtape:', existing);

    // Get the phase of this etape (can be null now because etapes can be detached)
    const etapeWithPhase = await this.prisma.etapeProc.findUnique({
      where: { id_etape },
      include: { phase: true },
    });

    if (!etapeWithPhase) {
      throw new Error(`Etape ${id_etape} not found`);
    }

    // Try to determine the phase for this step in the context of this procedure.
    // Priority:
    // 1) The etape's own id_phase (configuration link), if still present.
    // 2) A mapping row in procedurePhaseEtapes for this (id_proc, id_etape).
    let phaseId: number | null = etapeWithPhase.id_phase ?? null;

    if (phaseId == null) {
      const procPhaseEtape = await this.prisma.procedurePhaseEtapes.findFirst({
        where: { id_proc, id_etape },
      });
      if (procPhaseEtape?.id_phase != null) {
        phaseId = procPhaseEtape.id_phase;
      }
    }

    console.log('[setStepStatus] resolved phaseId', {
      id_proc,
      id_etape,
      etapeIdPhase: etapeWithPhase.id_phase,
      resolvedPhaseId: phaseId,
    });

    // Ensure procedure exists and has phase associations
    await this.ensureProcedureHasPhases(id_proc);

    // Removed the updateMany that sets other EN_COURS to EN_ATTENTE
    // This allows multiple EN_COURS in a phase

    const updateData: any = { statut };
    if (link) updateData.link = link;

    if (!existing) {
      const createData: any = {
        id_proc,
        id_etape,
        statut,
        link
      };

      if (statut === StatutProcedure.EN_COURS) {
        createData.date_debut = now;
      } else if (statut === StatutProcedure.TERMINEE) {
        createData.date_debut = now;
        createData.date_fin = now;
      }

      const result = await this.prisma.procedureEtape.create({
        data: createData,
      });
      console.log('[setStepStatus] created ProcedureEtape:', result);

      // Auto-update phase status after creating etape, if we have a phase
      if (phaseId != null) {
        await this.autoUpdatePhaseStatus(id_proc, phaseId);
      }
      return result;
    }

    if (statut === StatutProcedure.EN_COURS && !existing.date_debut) {
      updateData.date_debut = now;
    }

    if (statut === StatutProcedure.TERMINEE) {
      if (!existing.date_debut) {
        updateData.date_debut = now;
      }
      updateData.date_fin = now;
    }

    const result = await this.prisma.procedureEtape.update({
      where: { id_proc_id_etape: { id_proc, id_etape } },
      data: updateData,
    });
    console.log('[setStepStatus] updated ProcedureEtape:', result);

    // Auto-update phase status after etape change, if we have a phase
    if (phaseId != null) {
      await this.autoUpdatePhaseStatus(id_proc, phaseId);
    }

    return result;
  }

  async ensureProcedureHasPhases(id_proc: number) {
    // Check if procedure exists and get its type
    const procedure = await this.prisma.procedure.findUnique({
      where: { id_proc },
      include: { 
        demandes: {
          include: {
            typeProcedure: true,
            typePermis: true,
          }
        }
      }
    });

    if (!procedure) {
      throw new Error(`Procedure with ID ${id_proc} not found`);
    }

    // Get the procedure type (assuming first demande's type)
    const primaryDemande = procedure.demandes[0];
    const procedureType = primaryDemande?.typeProcedure;
    const procedureTypePermis = primaryDemande?.typePermis;
    if (!procedureType || !procedureTypePermis) {
      throw new Error(`No procedure type or type permis found for procedure ${id_proc}`);
    }

    // Check if procedure has phase associations
    const phaseCount = await this.prisma.procedurePhase.count({
      where: { id_proc }
    });

    if (phaseCount === 0) {
      // Get phases specific to this procedure type
      const phaseRelations = await this.prisma.relationPhaseTypeProc.findMany({
        where: {
          combinaison: {
            id_typeProc: procedureType.id,
            id_typePermis: procedureTypePermis.id,
          },
        },
        include: { phase: true },
        orderBy: [
          { ordre: 'asc' },
          {
            phase: {
              ordre: 'asc',
            },
          },
        ],
      });

      if (phaseRelations.length === 0) {
        throw new Error(
          `No phases defined for combination typeProc=${procedureType.id} typePermis=${procedureTypePermis.id}`
        );
      }

      const procedurePhasesData = phaseRelations.map((relation, index) => ({
        id_proc,
        id_phase: relation.id_phase,
        ordre: relation.ordre ?? index + 1,
        statut: StatutProcedure.EN_ATTENTE,
      }));

      await this.prisma.procedurePhase.createMany({
        data: procedurePhasesData
      });

    }
  }

  async autoUpdatePhaseStatus(id_proc: number, id_phase: number) {
    // Get all etapes in this phase with their status
    const phaseEtapes = await this.prisma.etapeProc.findMany({
      where: { id_phase },
      include: {
        procedureEtapes: {
          where: { id_proc }
        }
      }
    });

    const statuses = phaseEtapes.map(etape => 
      etape.procedureEtapes[0]?.statut || 'EN_ATTENTE'
    );

    let newStatut: StatutProcedure;

    if (statuses.every(statut => statut === 'TERMINEE')) {
      newStatut = StatutProcedure.TERMINEE;
    } else if (statuses.some(statut => statut === 'EN_COURS')) {
      newStatut = StatutProcedure.EN_COURS;
    } else {
      newStatut = StatutProcedure.EN_ATTENTE;
    }

    console.log('[autoUpdatePhaseStatus] result', {
      id_proc,
      id_phase,
      statuses,
      newStatut,
    });

    // Update the phase status (if it exists for this procedure)
    try {
      return await this.prisma.procedurePhase.update({
        where: { id_proc_id_phase: { id_proc, id_phase } },
        data: { statut: newStatut }
      });
    } catch (error: any) {
      if (error?.code === 'P2025') {
        // No procedurePhase row for this (id_proc, id_phase) – skip quietly
        console.warn('[autoUpdatePhaseStatus] No ProcedurePhase found to update', {
          id_proc,
          id_phase,
        });
        return null;
      }
      throw error;
    }
  }

  async getProcedureWithPhases(id_proc: number) {
    console.log(`🔍 Looking for procedure with ID: ${id_proc}`);
    
    await this.ensureProcedureHasPhases(id_proc);
    
    const procedure = await this.prisma.procedure.findUnique({
      where: { id_proc },
      include: {
        ProcedurePhase: {
          include: {
            phase: {
              include: {
                etapes: {
                  include: {
                    procedureEtapes: {
                      where: { id_proc }
                    }
                  },
                  orderBy: { ordre_etape: 'asc' }
                }
              }
            }
          },
          orderBy: { ordre: 'asc' }
        },
        ProcedureEtape: {
          include: {
            etape: true
          }
        },
        demandes: {
          include: {
            typeProcedure: true,
            typePermis: true  // This should include typePermis
          }
        }
      }
    });
    return procedure;
}

  async getCurrentEtape(id_proc: number) {
    const enCours = await this.prisma.procedureEtape.findFirst({
      where: {
        id_proc,
        statut: StatutProcedure.EN_COURS,
      },
      include: { etape: true },
    });

    if (enCours) return enCours;

    return this.prisma.procedureEtape.findFirst({
      where: { id_proc },
      orderBy: { date_debut: 'desc' },
      include: { etape: true },
    });
  }

  async canMoveToNextPhase(id_proc: number, currentPhaseId: number): Promise<boolean> {
    const currentPhase = await this.prisma.procedurePhase.findUnique({
      where: { id_proc_id_phase: { id_proc, id_phase: currentPhaseId } },
      include: {
        phase: {
          include: {
            etapes: {
              include: {
                procedureEtapes: {
                  where: { id_proc }
                }
              }
            }
          }
        }
      }
    });

    if (!currentPhase) return false;

    // Check if all etapes in current phase are completed
    const allEtapesCompleted = currentPhase.phase.etapes.every(etape =>
      etape.procedureEtapes[0]?.statut === 'TERMINEE'
    );

    return allEtapesCompleted;
  }

  async startNextPhase(id_proc: number, currentPhaseId: number) {
    // Check if we can move to next phase
    const canMove = await this.canMoveToNextPhase(id_proc, currentPhaseId);
    if (!canMove) {
      throw new Error('Cannot move to next phase - current phase not completed');
    }

    // Get the next phase
    const nextPhase = await this.prisma.procedurePhase.findFirst({
      where: {
        id_proc,
        ordre: { gt: currentPhaseId }
      },
      orderBy: { ordre: 'asc' },
      include: { 
        phase: {
          include: {
            etapes: {
              orderBy: { ordre_etape: 'asc' }
            }
          }
        }
      }
    });

    if (!nextPhase) return null;

    // Start the first etape of the next phase
    const firstEtape = nextPhase.phase.etapes[0];
    
    if (firstEtape) {
      return this.setStepStatus(id_proc, firstEtape.id_etape, StatutProcedure.EN_COURS);
    }

    return null;
  }


}
