import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateEtapeDto,
  CreatePhaseDto,
  CreateRelationPhaseTypeProcDto,
  CreateCombinaisonPermisProcDto,
  UpdateEtapeDto,
  UpdatePhaseDto,
  UpdateRelationPhaseTypeProcDto,
  UpdateCombinaisonPermisProcDto,
} from './phases-etapes.dto';

@Injectable()
export class PhasesEtapesService {
  constructor(private readonly prisma: PrismaService) {}

  // Phases

  async findAllPhasesWithDetails() {
    return this.prisma.phase.findMany({
      orderBy: { ordre: 'asc' },
      include: {
        etapes: {
          orderBy: { ordre_etape: 'asc' },
        },
        relationPhaseTypeProc: {
          include: {
            combinaison: {
              include: {
                typePermis: true,
                typeProc: true,
              },
            },
          },
        },
      },
    });
  }

  async createPhase(dto: CreatePhaseDto) {
    return this.prisma.phase.create({
      data: {
        libelle: dto.libelle,
        ordre: dto.ordre,
        description: dto.description ?? null,
      },
    });
  }

  async updatePhase(id_phase: number, dto: UpdatePhaseDto) {
    try {
      return await this.prisma.phase.update({
        where: { id_phase },
        data: dto,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Phase avec id ${id_phase} introuvable`);
      }
      throw new BadRequestException(
        'Erreur lors de la mise à jour de la phase',
      );
    }
  }

  async deletePhase(id_phase: number) {
    const etapesCount = await this.prisma.etapeProc.count({
      where: { id_phase },
    });
    const relationsCount = await this.prisma.relationPhaseTypeProc.count({
      where: { id_phase },
    });
    const procedurePhasesCount = await this.prisma.procedurePhase.count({
      where: { id_phase },
    });
    const procedurePhaseEtapesCount =
      await this.prisma.procedurePhaseEtapes.count({
        where: { id_phase },
      });

    if (
      etapesCount > 0 ||
      relationsCount > 0 ||
      procedurePhasesCount > 0 ||
      procedurePhaseEtapesCount > 0
    ) {
      throw new BadRequestException(
        "Impossible de supprimer une phase qui est déjà utilisée par des étapes ou des procédures.",
      );
    }

    try {
      return await this.prisma.phase.delete({
        where: { id_phase },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Phase avec id ${id_phase} introuvable`);
      }
      throw error;
    }
  }

  // Etapes

  async findAllEtapes() {
    return this.prisma.etapeProc.findMany({
      orderBy: [{ id_phase: 'asc' }, { ordre_etape: 'asc' }],
      include: { phase: true },
    });
  }

  async findEtapesByPhase(id_phase: number) {
    return this.prisma.etapeProc.findMany({
      where: { id_phase },
      orderBy: { ordre_etape: 'asc' },
    });
  }

  async createEtape(dto: CreateEtapeDto) {
    // Ensure phase exists
    const phase = await this.prisma.phase.findUnique({
      where: { id_phase: dto.id_phase },
    });

    if (!phase) {
      throw new BadRequestException(
        `Phase avec id ${dto.id_phase} introuvable`,
      );
    }

    return this.prisma.etapeProc.create({
      data: {
        lib_etape: dto.lib_etape,
        duree_etape: dto.duree_etape ?? null,
        ordre_etape: dto.ordre_etape,
        id_phase: dto.id_phase,
        page_route: dto.page_route ?? null,
      },
    });
  }

  async updateEtape(id_etape: number, dto: UpdateEtapeDto) {
    try {
      return await this.prisma.etapeProc.update({
        where: { id_etape },
        data: dto,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Étape avec id ${id_etape} introuvable`);
      }
      throw new BadRequestException(
        "Erreur lors de la mise à jour de l'étape",
      );
    }
  }

  async deleteEtape(id_etape: number) {
    const procedureEtapesCount = await this.prisma.procedureEtape.count({
      where: { id_etape },
    });
    const procedurePhaseEtapesCount =
      await this.prisma.procedurePhaseEtapes.count({
        where: { id_etape },
      });

    if (procedureEtapesCount > 0 || procedurePhaseEtapesCount > 0) {
      throw new BadRequestException(
        "Impossible de supprimer une étape qui est déjà utilisée par des procédures.",
      );
    }

    try {
      return await this.prisma.etapeProc.delete({
        where: { id_etape },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Étape avec id ${id_etape} introuvable`);
      }
      throw error;
    }
  }

  // Combinaisons et relations Phase / TypeProc / TypePermis

  async findAllCombinaisons() {
    return this.prisma.combinaisonPermisProc.findMany({
      include: {
        typePermis: true,
        typeProc: true,
      },
      orderBy: [
        { id_typePermis: 'asc' },
        { id_typeProc: 'asc' },
      ],
    });
  }

  async createCombinaison(dto: CreateCombinaisonPermisProcDto & { duree_regl_proc?: number | null }) {
    // Ensure referenced types exist
    const typePermis = await this.prisma.typePermis.findUnique({
      where: { id: dto.id_typePermis },
    });
    const typeProc = await this.prisma.typeProcedure.findUnique({
      where: { id: dto.id_typeProc },
    });

    if (!typePermis) {
      throw new BadRequestException(
        `Type de permis avec id ${dto.id_typePermis} introuvable`,
      );
    }

    if (!typeProc) {
      throw new BadRequestException(
        `Type de procédure avec id ${dto.id_typeProc} introuvable`,
      );
    }

    const existing = await this.prisma.combinaisonPermisProc.findFirst({
      where: {
        id_typePermis: dto.id_typePermis,
        id_typeProc: dto.id_typeProc,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Cette combinaison type permis / type procédure existe déjà.',
      );
    }

    return this.prisma.combinaisonPermisProc.create({
      data: {
        id_typePermis: dto.id_typePermis,
        id_typeProc: dto.id_typeProc,
        duree_regl_proc: dto.duree_regl_proc ?? null,
      },
    });
  }

  async deleteCombinaison(id_combinaison: number) {
    const relationsCount = await this.prisma.relationPhaseTypeProc.count({
      where: { id_combinaison },
    });

    if (relationsCount > 0) {
      throw new BadRequestException(
        "Impossible de supprimer une combinaison utilisée par des phases. Retirez d'abord ses phases associées.",
      );
    }

    try {
      return await this.prisma.combinaisonPermisProc.delete({
        where: { id_combinaison },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Combinaison avec id ${id_combinaison} introuvable`,
        );
      }
      throw error;
    }
  }

  async updateCombinaison(
    id_combinaison: number,
    dto: UpdateCombinaisonPermisProcDto & { duree_regl_proc?: number | null },
  ) {
    try {
      return await this.prisma.combinaisonPermisProc.update({
        where: { id_combinaison },
        data: {
          duree_regl_proc: dto.duree_regl_proc ?? null,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Combinaison avec id ${id_combinaison} introuvable`,
        );
      }
      throw new BadRequestException(
        "Erreur lors de la mise à jour de la combinaison.",
      );
    }
  }

  async findRelationsByCombinaison(id_combinaison: number) {
    return this.prisma.relationPhaseTypeProc.findMany({
      where: { id_combinaison },
      include: {
        phase: true,
      },
      orderBy: [
        { ordre: 'asc' },
        {
          phase: {
            ordre: 'asc',
          },
        },
      ],
    });
  }

  async createRelation(dto: CreateRelationPhaseTypeProcDto & { ordre?: number | null }) {
    // Optional: prevent duplicates for same (id_phase, id_combinaison)
    const existing = await this.prisma.relationPhaseTypeProc.findFirst({
      where: {
        id_phase: dto.id_phase,
        id_combinaison: dto.id_combinaison,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Une relation pour cette phase et cette combinaison existe déjà.',
      );
    }

    return this.prisma.relationPhaseTypeProc.create({
      data: {
        id_phase: dto.id_phase,
        id_combinaison: dto.id_combinaison,
        ordre: dto.ordre ?? null,
        dureeEstimee: dto.dureeEstimee ?? null,
      },
    });
  }

  async updateRelation(
    id_relation: number,
    dto: UpdateRelationPhaseTypeProcDto,
  ) {
    try {
      return await this.prisma.relationPhaseTypeProc.update({
        where: { id_relation },
        data: dto,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Relation phase/typeProc avec id ${id_relation} introuvable`,
        );
      }
      throw new BadRequestException(
        'Erreur lors de la mise à jour de la relation phase / type procédure',
      );
    }
  }

  async deleteRelation(id_relation: number) {
    try {
      return await this.prisma.relationPhaseTypeProc.delete({
        where: { id_relation },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Relation phase/typeProc avec id ${id_relation} introuvable`,
        );
      }
      throw error;
    }
  }
}
