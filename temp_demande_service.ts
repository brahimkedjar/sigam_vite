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
        procedure: true,            // keep procedure (without typeProcedure)
        typeProcedure: true,        // now directly from Demande
        detenteurdemande: {
          include: { detenteur: true },
        },
        expertMinier: true,
      },
    });

    if (!demande) {
      throw new NotFoundException('Demande introuvable');
    }

    const primaryDetenteur = demande.detenteurdemande?.[0]?.detenteur ?? null;
    return {
      ...demande,
      detenteur: primaryDetenteur,
    };
}


  async createDemande(data: {
    id_typepermis: number;
    objet_demande: string;
    code_demande?: string;
    id_detenteur?: number;
    date_demande: Date;
    nom_responsable?: string | null;
  }) {
  // Get type permis details
  const typePermis = await this.prisma.typePermis.findUnique({
    where: { id: data.id_typepermis }
  });

  if (!typePermis) {
    throw new NotFoundException('Type de permis introuvable');
  }

  // Get the "demande" type procedure, auto-create it if missing
  let typeProcedure = await this.prisma.typeProcedure.findFirst({
    where: { libelle: { equals: 'demande', mode: 'insensitive' } }
  });

  if (!typeProcedure) {
    typeProcedure = await this.prisma.typeProcedure.create({
      data: {
        libelle: 'demande',
        description: 'Procédure par défaut pour la création des demandes',
      },
    });
  }

  // Generate code if not provided
  const currentYear = new Date().getFullYear();
  const procCount = await this.prisma.procedure.count({
  where: {
    date_debut_proc: {
      gte: new Date(`${currentYear}-01-01`),
      lte: new Date(`${currentYear}-12-31`),
    },
  },
});

const finalCode =
  data.code_demande ||
  `${typePermis.code_type}-${currentYear}-${procCount + 1}`;

  // Create procedure (⚠️ no more id_typeproc here)
  const createdProc = await this.prisma.procedure.create({
    data: {
      num_proc: finalCode,
      date_debut_proc: new Date(),
      statut_proc: 'EN_COURS',
    },
  });

  // Create demande (with id_typeproc now)
  const demande = await this.prisma.demande.create({
    data: {
      id_proc: createdProc.id_proc,
      id_typeProc: typeProcedure.id,
      code_demande: finalCode,
      id_typePermis: data.id_typepermis,
      date_demande: data.date_demande,
      duree_instruction: 10,
      statut_demande: StatutDemande.EN_COURS,
      Nom_Prenom_Resp_Enregist: data.nom_responsable ?? null,
      ...(data.id_detenteur
        ? {
            detenteurdemande: {
              create: {
                id_detenteur: data.id_detenteur,
                role_detenteur: 'principal',
              },
            },
          }
        : {}),
    },
    include: {
      procedure: true,
      typeProcedure: true,
      detenteurdemande: { include: { detenteur: true } },
    },
  });

  const primaryDetenteur = demande.detenteurdemande?.[0]?.detenteur ?? null;
  return {
    ...demande,
    detenteur: primaryDetenteur,
  };
}


  async createOrFindExpert(data: {
    nom_expert: string;
    num_agrement: string;
    etat_agrement: string;
    specialisation:string;
    date_agrement:Date;
  }) {
    const existing = await this.prisma.expertMinier.findFirst({
      where: {
        nom_expert: data.nom_expert,
        specialisation: data.specialisation,
        num_agrement: data.num_agrement,
        etat_agrement: data.etat_agrement,
        date_agrement:data.date_agrement
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
        procedure: true
      }
    });
  }

  async generateCode(id_typepermis: number) {
    const typePermis = await this.prisma.typePermis.findUnique({ 
      where: { id: id_typepermis }
    });

    if (!typePermis) {
      throw new NotFoundException('Type de permis introuvable');
    }

    const year = new Date().getFullYear();
    const count = await this.prisma.demande.count({
      where: {
        date_demande: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
      },
    });

    const code_demande = `${typePermis.code_type}-${year}-${count + 1}`;
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
    },
  });
}
}
