import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateDemandeDto } from './update-demande.dto';
import { StatutDemande } from '@prisma/client';

@Injectable()
export class DemandeService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id_demande: number) {
    const demande = await this.prisma.demande.findUnique({
      where: { id_demande },
      include: {
        procedure: true, // keep procedure (without typeProcedure)
        typeProcedure: true, // now directly from Demande
        detenteur: true,
        expertMinier: true,
      },
    });

    if (!demande) {
      throw new NotFoundException('Demande introuvable');
    }

    return demande;
  }

  async createDemande(data: {
    id_typepermis: number;
    objet_demande: string;
    code_demande?: string;
    id_detenteur?: number;
    date_demande: Date;
    date_instruction: Date;
    id_sourceProc?: number;
    designation_number?: string;
  }) {
    // Get type permis details
    const typePermis = await this.prisma.typePermis.findUnique({
      where: { id: data.id_typepermis },
    });

    if (!typePermis) {
      throw new NotFoundException('Type de permis introuvable');
    }

    // Get the "demande" type procedure
    const typeProcedure = await this.prisma.typeProcedure.findFirst({
      where: { libelle: 'demande' },
    });

    if (!typeProcedure) {
      throw new NotFoundException('Type de procédure "demande" introuvable');
    }

    // Generate sequential codes DEM-<TYPE>-<N> and PROC-<TYPE>-<N>
    const codeType = typePermis.code_type;
    let seq = await this.prisma.demande.count();
    let finalSeq: number;
    let finalCode: string;

    if (data.code_demande && data.code_demande.trim().length > 0) {
      finalCode = data.code_demande.trim();
      const m = finalCode.match(/-(\d+)$/);
      finalSeq = m ? parseInt(m[1], 10) : seq + 1;
    } else {
      do {
        seq += 1;
        finalCode = `DEM-${codeType}-${seq}`;
      } while (
        await this.prisma.demande.findUnique({ where: { code_demande: finalCode } })
      );
      finalSeq = seq;
    }

    // Create procedure first with PROC-<TYPE>-<N>
    const createdProc = await this.prisma.procedure.create({
      data: {
        num_proc: `PROC-${codeType}-${finalSeq}`,
        date_debut_proc: new Date(),
        statut_proc: 'EN_COURS',
      },
    });

    // Create demande (with id_typeproc now)
    return this.prisma.demande.create({
      data: {
        id_proc: createdProc.id_proc,
        id_typeProc: typeProcedure.id,
        code_demande: finalCode,
        id_detenteur: data.id_detenteur,
        id_typePermis: data.id_typepermis,
        date_demande: data.date_demande,
        date_instruction: data.date_instruction,
        statut_demande: StatutDemande.EN_COURS,
        id_sourceProc: data.id_sourceProc ?? undefined,
        designation_number: data.designation_number ?? undefined,
      },
      include: {
        procedure: true,
        typeProcedure: true,
        detenteur: true,
      },
    });
  }

  async createOrFindExpert(data: {
    nom_expert: string;
    num_agrement: string;
    etat_agrement: string;
    specialisation: string;
    date_agrement: Date;
  }) {
    const existing = await this.prisma.expertMinier.findFirst({
      where: {
        nom_expert: data.nom_expert,
        specialisation: data.specialisation,
        num_agrement: data.num_agrement,
        etat_agrement: data.etat_agrement,
        date_agrement: data.date_agrement,
      },
    });

    if (existing) return existing;

    return this.prisma.expertMinier.create({ data });
  }

  async attachExpertToDemande(id_demande: number, id_expert: number) {
    return this.prisma.demande.update({
      where: { id_demande },
      data: { id_expert },
      include: {
        expertMinier: true,
        procedure: true,
      },
    });
  }

  async generateCode(id_typepermis: number) {
    const typePermis = await this.prisma.typePermis.findUnique({
      where: { id: id_typepermis },
    });

    if (!typePermis) {
      throw new NotFoundException('Type de permis introuvable');
    }

    // Global sequential number across demandes
    let seq = await this.prisma.demande.count();
    let code_demande: string;
    do {
      seq += 1;
      code_demande = `DEM-${typePermis.code_type}-${seq}`;
    } while (
      await this.prisma.demande.findUnique({ where: { code_demande } })
    );

    return { code_demande };
  }

  // demande.service.ts
  async update(id: number, updateDemandeDto: UpdateDemandeDto) {
    return this.prisma.demande.update({
      where: { id_demande: id },
      data: {
        id_wilaya: updateDemandeDto.id_wilaya,
        id_daira: updateDemandeDto.id_daira,
        id_commune: updateDemandeDto.id_commune,
        lieu_ditFR: updateDemandeDto.lieu_ditFR,
        lieu_dit_ar: updateDemandeDto.lieu_ditAR,
        statut_juridique_terrain: updateDemandeDto.statut_juridique_terrain,
        occupant_terrain_legal: updateDemandeDto.occupant_terrain_legal,
        superficie: updateDemandeDto.superficie,
        description_travaux: updateDemandeDto.description_travaux,
        duree_travaux_estimee: updateDemandeDto.duree_travaux_estimee,
        date_demarrage_prevue: updateDemandeDto.date_demarrage_prevue,
      },
    });
  }
}

