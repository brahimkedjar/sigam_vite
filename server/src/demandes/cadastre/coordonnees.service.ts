import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CoordonneesService {
  constructor(private readonly prisma: PrismaService) {}

  async createCoordonnees(
    id_proc: number,
    id_zone_interdite: number,
    points: {
      x: string;
      y: string;
      z: string;
      system?: string;
      zone?: number;
      hemisphere?: string;
    }[],
    statut_coord: 'NOUVEAU' | 'ANCIENNE' | 'DEMANDE_INITIALE' = 'NOUVEAU'
  ) {
    try {
      // Get demande by procedureId (id_proc) with typeProcedure
      const demande = await this.prisma.demande.findFirst({
        where: { id_proc },
        include: { typeProcedure: true },
      });

      if (!demande) {
        throw new Error(`No demande found for procedure ${id_proc}`);
      }

      const libelle = demande.typeProcedure?.libelle?.toLowerCase() ?? '';
      const isDemandeInitiale = libelle === 'demande';
      const effectiveStatut = isDemandeInitiale ? 'DEMANDE_INITIALE' : (statut_coord ?? 'NOUVEAU');

      const createdCoords = await this.prisma.$transaction(async (tx) => {
        // Create coords with new fields
        const coords = await Promise.all(points.map(p =>
          tx.coordonnee.create({
            data: {
              id_zone_interdite,
              x: parseFloat(p.x),
              y: parseFloat(p.y),
              z: parseFloat(p.z),
              system: p.system || 'WGS84',
              zone: p.zone || null,
              hemisphere: p.hemisphere || null,
              point: JSON.stringify({ 
                x: p.x, 
                y: p.y, 
                z: p.z,
                system: p.system,
                zone: p.zone,
                hemisphere: p.hemisphere
              }),
            }
          })
        ));

        // Link coords to procedure
        await Promise.all(coords.map(coord =>
          tx.procedureCoord.create({
            data: {
              id_proc,
              id_coordonnees: coord.id_coordonnees,
              statut_coord: effectiveStatut,
            }
          })
        ));

        return coords;
      });

      return {
        message: 'Coordonnées liées à la procédure avec succès.',
        data: createdCoords,
      };
    } catch (error) {
      console.error('Erreur lors de la création des coordonnées:', error);
      throw new InternalServerErrorException('Erreur serveur lors de la sauvegarde.');
    }
  }

  // In your backend service
// In your backend service
async getExistingPerimeters() {
  try {
    const raw = await this.prisma.procedureCoord.findMany({
      include: {
        procedure: {
          select: {
            id_proc: true,
            num_proc: true,
          },
        },
        coordonnee: true
      }
    });

    const grouped = raw.reduce((acc, entry) => {
      const id = entry.procedure.id_proc;
      const code = entry.procedure.num_proc;
      if (!acc[id]) {
        acc[id] = {
          id_proc: id,
          num_proc: code,
          coordinates: []
        };
      }
      acc[id].coordinates.push([entry.coordonnee.x, entry.coordonnee.y]);
      return acc;
    }, {} as Record<number, { id_proc: number; num_proc: string; coordinates: [number, number][] }>);

    // Return as array instead of object
    return Object.values(grouped).map((poly) => {
      const { coordinates } = poly;
      if (coordinates.length >= 3) {
        // Ensure polygon is closed
        if (coordinates[0][0] !== coordinates[coordinates.length - 1][0] ||
            coordinates[0][1] !== coordinates[coordinates.length - 1][1]) {
          coordinates.push(coordinates[0]);
        }
      }
      return poly;
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des périmètres existants:', error);
    throw new InternalServerErrorException('Erreur serveur lors de la récupération.');
  }
}

  async getCoordonneesByProcedure(id_proc: number) {
    return await this.prisma.procedureCoord.findMany({
      where: { id_proc },
      include: {
        coordonnee: true
      },
      orderBy: {
        id_coordonnees: 'asc'
      }
    });
  }

  async deleteCoordonneesByProcedure(id_proc: number) {
    // Step 1: Find all coord IDs linked to this procedure
    const links = await this.prisma.procedureCoord.findMany({
      where: { id_proc },
      select: { id_coordonnees: true }
    });

    const coordIds = links.map(link => link.id_coordonnees);

    // Step 2: Delete all procedureCoord links
    await this.prisma.procedureCoord.deleteMany({
      where: { id_proc }
    });

    // Step 3: Delete the coordonnee records
    return await this.prisma.coordonnee.deleteMany({
      where: { id_coordonnees: { in: coordIds } }
    });
  }

  async updateCoordonnees(
    id_proc: number,
    id_zone_interdite: number,
    points: { 
      x: string; 
      y: string; 
      z: string;
      system?: string;
      zone?: number;
      hemisphere?: string;
    }[],
    statut_coord: 'DEMANDE_INITIALE' | 'NOUVEAU' | 'ANCIENNE' = 'NOUVEAU',
    superficie?: number
  ) {
    try {
      // STEP 1: Check if any coordinates already exist for this procedure
      const existingCoords = await this.prisma.procedureCoord.findMany({
        where: { id_proc },
        select: { id_coordonnees: true },
      });

      const coordIds = existingCoords.map((l) => l.id_coordonnees);

      // STEP 2: Determine the correct statut_coord if not provided
      const finalStatutCoord: 'DEMANDE_INITIALE' | 'NOUVEAU' | 'ANCIENNE' = 
        statut_coord ??
        (existingCoords.length === 0 ? 'DEMANDE_INITIALE' : 'NOUVEAU');

      // STEP 3: Delete existing links and coords
      if (coordIds.length > 0) {
        await this.prisma.procedureCoord.deleteMany({
          where: { id_proc },
        });

        await this.prisma.coordonnee.deleteMany({
          where: { id_coordonnees: { in: coordIds } },
        });
      }

      // STEP 4: Create new coords + link them with new fields
      const created = await this.prisma.$transaction(async (tx) => {
        const newCoords = await Promise.all(
          points.map((p) =>
            tx.coordonnee.create({
              data: {
                id_zone_interdite,
                x: parseFloat(p.x),
                y: parseFloat(p.y),
                z: parseFloat(p.z),
                system: p.system || 'WGS84',
                zone: p.zone || null,
                hemisphere: p.hemisphere || null,
                point: JSON.stringify({ 
                  x: p.x, 
                  y: p.y, 
                  z: p.z,
                  system: p.system,
                  zone: p.zone,
                  hemisphere: p.hemisphere
                }),
              },
            })
          )
        );

        await Promise.all(
          newCoords.map((coord) =>
            tx.procedureCoord.create({
              data: {
                id_proc,
                id_coordonnees: coord.id_coordonnees,
                statut_coord: finalStatutCoord,
              },
            })
          )
        );

        return newCoords;
      });

      // STEP 5: Optional update superficie
      if (superficie !== undefined) {
        await this.prisma.procedure.update({
          where: { id_proc },
          data: {
            observations: `Superficie mise à jour: ${superficie} m²`,
          },
        });
      }

      return {
        message: 'Coordonnées mises à jour avec succès.',
        data: created,
      };
    } catch (err) {
      console.error('Erreur update:', err);
      throw new InternalServerErrorException(
        'Erreur lors de la mise à jour des coordonnées.'
      );
    }
  }

  // In CoordonneesService
async convertCoordinate(
  x: number,
  y: number,
  from: string,
  to: string,
  zone?: number,
  hemisphere?: string
) {
  // This is a simplified implementation - use a proper library like proj4 in production
  if (from === 'WGS84' && to === 'UTM') {
    // Simplified conversion (replace with proper algorithm)
    return {
      x: (x * 111320 * Math.cos(y * Math.PI / 180)).toFixed(2),
      y: (y * 110574).toFixed(2),
      system: 'UTM',
      zone: zone || 31,
      hemisphere: hemisphere || 'N'
    };
  } else if (from === 'UTM' && to === 'WGS84') {
    // Simplified conversion (replace with proper algorithm)
    return {
      x: (x / (111320 * Math.cos((zone || 31) * 6 - 183 * Math.PI / 180))).toFixed(6),
      y: (y / 110574).toFixed(6),
      system: 'WGS84'
    };
  }
  
  // For other conversions, return the same values (implement proper conversion)
  return { x, y, system: to };
}
}