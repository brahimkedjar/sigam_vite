import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermisDashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalPermis, activePermis, pendingDemands, expiredPermis] = await Promise.all([
      this.prisma.permis.count(),
      this.prisma.permis.count({
        where: {
          statut: {
            lib_statut: 'En vigueur'
          }
        }
      }),
      this.prisma.procedure.count({
        where: {
          statut_proc: 'EN_COURS'
        }
      }),
      this.prisma.permis.count({
        where: {
          date_expiration: {
            lt: new Date()
          },
          statut: {
            lib_statut: 'En vigueur'
          }
        }
      })
    ]);

    return {
      total: totalPermis,
      actifs: activePermis,
      enCours: pendingDemands,
      expires: expiredPermis
    };
  }

  async getPermisEvolution() {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 6 }, (_, i) => currentYear - 5 + i);
    
    const evolutionData = await Promise.all(
      years.map(async (year) => {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year + 1, 0, 1);
        
        const count = await this.prisma.permis.count({
          where: {
            date_octroi: {
              gte: startDate,
              lt: endDate
            }
          }
        });
        
        return {
          year: year.toString(),
          value: count
        };
      })
    );

    return evolutionData;
  }

  async getPermisTypesDistribution() {
    const typeData = await this.prisma.typePermis.findMany({
      include: {
        _count: {
          select: { permis: true }
        }
      }
    });

    const colors = ['#3B82F6', '#06B6D4', '#F472B6', '#FBBF24', '#10B981', '#8B5CF6'];
    
    return typeData.map((type, index) => ({
      name: type.lib_type,
      value: type._count.permis,
      color: colors[index % colors.length]
    }));
  }

  // Add this new method for status distribution
  async getPermisStatusDistribution() {
    // Get all statuses with their counts
    const statusData = await this.prisma.statutPermis.findMany({
      include: {
        _count: {
          select: { Permis: true }
        }
      }
    });

    // Define colors for different statuses
    const statusColors: Record<string, string> = {
      'Actif': '#10B981',      // Green
      'Expirée': '#EF4444',     // Red
      'En attente': '#F59E0B', // Amber
      'Suspendu': '#8B5CF6',   // Violet
      'Révoqué': '#64748B',    // Gray
      'default': '#3B82F6'     // Blue (default)
    };

    return statusData.map(status => ({
      name: status.lib_statut,
      value: status._count.Permis,
      color: statusColors[status.lib_statut] || statusColors.default
    }));
  }

  // Alternative method if you want to include expiration-based status
  async getPermisStatusDistributionWithExpiration() {
    // Get status-based counts
    const statusData = await this.prisma.statutPermis.findMany({
      include: {
        _count: {
          select: { Permis: true }
        }
      }
    });

    // Get count of expired permits regardless of their status
    const expiredCount = await this.prisma.permis.count({
      where: {
        date_expiration: {
          lt: new Date()
        }
      }
    });

    // Define colors for different statuses
    const statusColors: Record<string, string> = {
      'En vigueur': '#10B981',      // Green
      'Expirée': '#EF4444',     // Red
      'En attente': '#F59E0B', // Amber
      'Suspendu': '#8B5CF6',   // Violet
      'Révoqué': '#64748B',    // Gray
      'default': '#3B82F6'     // Blue (default)
    };

    const result = statusData.map(status => ({
      name: status.lib_statut,
      value: status._count.Permis,
      color: statusColors[status.lib_statut] || statusColors.default
    }));

    // Add expired count as a separate category if needed
    // Note: This might double-count permits that are marked as expired in both status and date
    result.push({
      name: 'Expirée (par date)',
      value: expiredCount,
      color: '#EF4444'
    });

    return result;
  }

  async getRecentActivities() {
    // Get recent permis creations
    const recentPermis = await this.prisma.permis.findMany({
      take: 10,
      orderBy: { date_octroi: 'desc' },
      include: {
        typePermis: true,
        detenteur: true,
        commune: {
          include: {
            daira: {
              include: {
                wilaya: true
              }
            }
          }
        }
      }
    });

    // Get recent demandes
    const recentDemandes = await this.prisma.demande.findMany({
      take: 10,
      orderBy: { date_demande: 'desc' },
      include: {
        detenteurdemande: { include: { detenteur: true } },
        procedure: true
      }
    });

    // Transform into activity format
    const activities = [
      ...recentPermis.map(permis => ({
        id: permis.id,
        type: 'permis' as const,
        title: 'Nouveau permis créé',
        description: `Permis ${permis.typePermis.lib_type} créé`,
        timestamp: permis.date_octroi,
        status: 'success' as const,
        code: permis.code_permis,
        user: permis.detenteur?.nom_societeFR
      })),
      ...recentDemandes.map(demande => ({
        id: demande.id_demande,
        type: 'demande' as const,
        title: 'Nouvelle demande soumise',
        description: `Demande de ${demande.procedure?.statut_proc || 'nouveau permis'}`,
        timestamp: demande.date_demande,
        status: 'info' as const,
        code: demande.code_demande,
        user: demande.detenteurdemande?.[0]?.detenteur?.nom_societeFR
      }))
    ];

    // Sort by timestamp and return top 10
    return activities
      .sort(
  (a, b) =>
    new Date(b.timestamp ?? 0).getTime() -
    new Date(a.timestamp ?? 0).getTime()
)

  }

}
