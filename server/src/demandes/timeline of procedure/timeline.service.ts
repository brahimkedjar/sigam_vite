import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TimelineService {
  constructor(private prisma: PrismaService) {}

  async getProcedureTimeline(procedureId: number) {
    const procedure = await this.prisma.procedure.findUnique({
      where: { id_proc: procedureId },
      include: {
        ProcedureEtape: {
          include: {
            etape: {
              include: {
                phase: true,
              },
            },
          },
          orderBy: {
            etape: {
              ordre_etape: 'asc',
            },
          },
        },
        demandes: {
          include: {
            typePermis: true,
            typeProcedure: true,
            dossiersFournis: true,
          },
        },
      },
    });

    if (!procedure) {
      throw new Error('Procedure not found');
    }

    // Build phase aggregates from steps
    const phaseMap = new Map<
      number,
      {
        id: number;
        name: string;
        order: number;
        startDate: Date | null;
        endDate: Date | null;
      }
    >();

    for (const step of procedure.ProcedureEtape ?? []) {
      const phase = step.etape?.phase;
      if (!phase) continue;

      const existing = phaseMap.get(phase.id_phase) ?? {
        id: phase.id_phase,
        name: phase.libelle,
        order: phase.ordre,
        startDate: null as Date | null,
        endDate: null as Date | null,
      };

      if (step.date_debut && (!existing.startDate || step.date_debut < existing.startDate)) {
        existing.startDate = step.date_debut;
      }

      if (step.date_fin && (!existing.endDate || step.date_fin > existing.endDate)) {
        existing.endDate = step.date_fin;
      }

      phaseMap.set(phase.id_phase, existing);
    }

    const phases = Array.from(phaseMap.values()).sort((a, b) => a.order - b.order);

    // Determine combination (type permis / type procedure) to fetch legal durations
    const firstDemand = procedure.demandes[0];
    let combinaison: {
      duree_regl_proc: number | null;
      relationPhaseTypeProc: { id_phase: number; dureeEstimee: number | null }[];
    } | null = null;

    if (firstDemand?.id_typePermis && firstDemand?.id_typeProc) {
      const combo = await this.prisma.combinaisonPermisProc.findUnique({
        where: {
          id_typePermis_id_typeProc: {
            id_typePermis: firstDemand.id_typePermis,
            id_typeProc: firstDemand.id_typeProc,
          },
        },
        include: {
          relationPhaseTypeProc: true,
        },
      });

      if (combo) {
        combinaison = {
          duree_regl_proc: combo.duree_regl_proc ?? null,
          relationPhaseTypeProc: combo.relationPhaseTypeProc.map((r) => ({
            id_phase: r.id_phase,
            dureeEstimee: r.dureeEstimee ?? null,
          })),
        };
      }
    }

    // Compute actual days per phase and total
    const phasesWithDurations = phases.map((p) => {
      let actualDays: number | null = null;
      if (p.startDate && p.endDate) {
        const diffMs = p.endDate.getTime() - p.startDate.getTime();
        actualDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      }

      const expected = combinaison?.relationPhaseTypeProc.find(
        (r) => r.id_phase === p.id,
      )?.dureeEstimee ?? null;

      let delayDays: number | null = null;
      if (actualDays != null && expected != null) {
        const diff = actualDays - expected;
        delayDays = diff > 0 ? diff : null;
      }

      return {
        ...p,
        actualDays,
        expectedDays: expected,
        delayDays,
      };
    });

    const totalActualPhaseDays = phasesWithDurations.reduce(
      (sum, p) => (p.actualDays != null ? sum + p.actualDays : sum),
      0,
    );

    const legalDurationDays = combinaison?.duree_regl_proc ?? null;
    let totalDelayVsLegal: number | null = null;
    if (legalDurationDays != null) {
      const diff = totalActualPhaseDays - legalDurationDays;
      totalDelayVsLegal = diff > 0 ? diff : null;
    }

    // Get typeProcedure from the first demande (if exists)
    const demandeType = procedure.demandes[0]?.typeProcedure?.libelle || 'Unknown';

    // Calculate durations and delays
    const timeline = {
      procedure: {
        id: procedure.id_proc,
        number: procedure.num_proc,
        type: demandeType,
        startDate: procedure.date_debut_proc || null,
        endDate: procedure.date_fin_proc || null,
        status: procedure.statut_proc,
        totalDuration: this.calculateDuration(
          procedure.date_debut_proc || null,
          procedure.date_fin_proc || null,
        ),
        legalDurationDays,
        totalActualPhaseDays,
        totalDelayVsLegal,
      },
      phases: phasesWithDurations.map((p) => ({
        id: p.id,
        name: p.name,
        order: p.order,
        startDate: p.startDate,
        endDate: p.endDate,
        actualDuration: this.calculateDuration(p.startDate, p.endDate, true),
        actualDays: p.actualDays,
        expectedDays: p.expectedDays,
        delayDays: p.delayDays,
      })),
      steps:
        procedure.ProcedureEtape?.map((step) => ({
          id: step.id_etape,
          name: step.etape.lib_etape,
          order: step.etape.ordre_etape,
          plannedDuration: step.etape.duree_etape,
          actualDuration: this.calculateDuration(step.date_debut, step.date_fin, true),
          startDate: step.date_debut,
          endDate: step.date_fin,
          status: step.statut,
          delay: this.calculateDelay(step.date_debut, step.date_fin, step.etape.duree_etape, true),
        })) || [],
      demands:
        procedure.demandes?.map((demand) => ({
          id: demand.id_demande,
          code: demand.code_demande,
          type: demand.typeProcedure?.libelle || 'Unknown',
          permitType: demand.typePermis?.lib_type || 'Unknown',
          status: demand.statut_demande,
          submissionDate: demand.date_demande,
          processingTime: this.calculateDuration(
            demand.date_demande!,
            demand.date_fin_instruction,
            true,
          ),
        })) || [],
    };

    return timeline;
  }

  private calculateDuration(
    startDate?: Date | null,
    endDate?: Date | null,
    precise: boolean = false
  ): string | null {
    if (!startDate || !endDate) return null;
    
    const diffMs = endDate.getTime() - startDate.getTime();
    
    if (precise) {
      // Calculate hours and minutes difference
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (diffHours > 0) {
        return `${diffHours}h ${diffMinutes}m`;
      }
      return `${diffMinutes}m`;
    } else {
      // Fallback to days calculation
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return `${diffDays} jours`;
    }
  }

  private calculateDelay(
    startDate: Date,
    endDate?: Date | null,
    plannedDuration?: number | null,
    precise: boolean = false
  ): string | null {
    if (!endDate || !plannedDuration) return null;
    
    const diffMs = endDate.getTime() - startDate.getTime();
    const actualDuration = this.calculateDuration(startDate, endDate, precise);
    if (!actualDuration) return null;
    
    if (precise) {
      // For precise mode, calculate the difference in minutes
      const plannedMinutes = plannedDuration * 24 * 60; // Convert days to minutes
      const actualMinutes = Math.floor(diffMs / (1000 * 60));
      const delayMinutes = actualMinutes - plannedMinutes;
      
      if (delayMinutes <= 0) return null;
      
      if (delayMinutes > 60) {
        const hours = Math.floor(delayMinutes / 60);
        const minutes = delayMinutes % 60;
        return `${hours}h ${minutes}m`;
      }
      return `${delayMinutes}m`;
    } else {
      // Fallback to days calculation
      const actualDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      const delayDays = actualDays - plannedDuration;
      return delayDays > 0 ? `${delayDays} jours` : null;
    }
  }
}
