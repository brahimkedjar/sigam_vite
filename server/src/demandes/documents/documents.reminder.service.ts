import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { StatutProcedure } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DocumentsReminderService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DocumentsReminderService.name);
  private timer: NodeJS.Timeout | null = null;

  constructor(private prisma: PrismaService) {}

  onModuleInit() {
    // Run once at startup, then every 12 hours
    this.runOnce().catch((e) => this.logger.error('Initial reminder check failed', e));
    this.timer = setInterval(() => {
      this.runOnce().catch((e) => this.logger.error('Scheduled reminder check failed', e));
    }, 12 * 60 * 60 * 1000);
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  private addDays(base: Date, days: number) {
    const result = new Date(base);
    result.setDate(result.getDate() + days);
    return result;
  }

  private async runOnce() {
    // Find dossiers with mise en demeure sent and a deadline
    const dossiers = await this.prisma.dossierFournis.findMany({
      where: {
        mise_en_demeure_envoyee: true,
        date_mise_en_demeure: { not: null },
      },
    });

    const now = new Date();

    for (const d of dossiers) {
      const base = d.date_mise_en_demeure ?? d.date_depot ?? null;
      if (!base) continue;
      // 30 jours calendaires
      const deadline = this.addDays(new Date(base), 30);

      const isOverdue = now > deadline;

      // Always refresh reminder hint
      const hint = {
        ...(typeof (d as any).pieces_manquantes === 'object' && (d as any).pieces_manquantes
          ? (d as any).pieces_manquantes
          : {}),
        reminder: {
          overdue: isOverdue,
          checked_at: now.toISOString(),
          deadline: deadline.toISOString(),
        },
      } as any;

      await this.prisma.dossierFournis.update({
        where: { id_dossierFournis: d.id_dossierFournis },
        data: { pieces_manquantes: hint, statut_dossier: isOverdue ? 'rejete' : d.statut_dossier },
      });

      if (isOverdue) {
        // Load demande + procedure
        const demande = await this.prisma.demande.findUnique({
          where: { id_demande: d.id_demande },
          include: { procedure: true },
        });
        if (!demande) continue;

        // If already rejected, skip heavy updates
        const alreadyRejected = (demande.statut_demande || '').toUpperCase() === 'REJETEE';
        if (!alreadyRejected) {
          const cause = `Rejet automatique: Dossier incomplet — délai de 30 jours dépassé (mise en demeure du ${new Date(
            base
          ).toLocaleDateString('fr-DZ')}).`;

          await this.prisma.demande.update({
            where: { id_demande: d.id_demande },
            data: {
              statut_demande: 'REJETEE',
              date_refus: now,
              remarques: cause,
            },
          });
        }

        // Close procedure if exists and not terminated
        if (demande.id_proc) {
          const proc = await this.prisma.procedure.findUnique({ where: { id_proc: demande.id_proc } });
          if (proc && proc.statut_proc !== StatutProcedure.TERMINEE) {
            await this.prisma.procedure.update({
              where: { id_proc: demande.id_proc },
              data: {
                statut_proc: StatutProcedure.TERMINEE,
                date_fin_proc: now,
                resultat: 'REJET',
              },
            });
          }
        }
      }
    }

    this.logger.log(`Reminder check completed for ${dossiers.length} dossiers`);
  }
}
