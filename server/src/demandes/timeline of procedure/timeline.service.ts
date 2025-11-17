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
          etape: true,
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
        procedure.date_fin_proc || null
      ),
    },
    steps: procedure.ProcedureEtape?.map((step) => ({
      id: step.id_etape,
      name: step.etape.lib_etape,
      order: step.etape.ordre_etape,
      plannedDuration: step.etape.duree_etape,
      actualDuration: this.calculateDuration(
        step.date_debut,
        step.date_fin,
        true
      ),
      startDate: step.date_debut,
      endDate: step.date_fin,
      status: step.statut,
      delay: this.calculateDelay(
        step.date_debut,
        step.date_fin,
        step.etape.duree_etape,
        true
      ),
    })) || [],
    demands: procedure.demandes?.map((demand) => ({
      id: demand.id_demande,
      code: demand.code_demande,
      type: demand.typeProcedure?.libelle || 'Unknown', 
      permitType: demand.typePermis?.lib_type || 'Unknown',
      status: demand.statut_demande,
      submissionDate: demand.date_demande,
      processingTime: this.calculateDuration(
        demand.date_demande!,
        demand.date_fin_instruction,
        true
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


