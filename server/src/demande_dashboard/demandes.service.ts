import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type SortOrder = 'asc' | 'desc';

@Injectable()
export class DemandesService {
  constructor(private prisma: PrismaService) {}

  private baseInclude = {
    wilaya: { select: { id_wilaya: true, nom_wilayaFR: true } },
    daira: { select: { id_daira: true, nom_dairaFR: true } },
    commune: { select: { id_commune: true, nom_communeFR: true } },
    procedure: { select: { id_proc: true, statut_proc: true, date_fin_proc: true } },
    detenteur: { select: { id_detenteur: true, nom_societeFR: true, email: true, pays: { select: { id_pays: true, nom_pays: true } }, nationaliteRef: { select: { id_nationalite: true, libelle: true } } } },
    expertMinier: { select: { id_expert: true, nom_expert: true, num_agrement: true } },
    typePermis: { select: { id: true, code_type: true, lib_type: true } },
    typeProcedure: { select: { id: true, libelle: true } },
  } satisfies Prisma.DemandeInclude;

 async findMany(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  statut?: string;
  wilayaId?: number;
  typePermisId?: number;
  typeProcId?: number;
  demandeId?: number; // Add this parameter
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
}) {
  const {
    page = 1,
    pageSize = 20,
    search,
    statut,
    wilayaId,
    typePermisId,
    typeProcId,
    demandeId, // Extract this parameter
    fromDate,
    toDate,
    sortBy = 'date_demande',
    sortOrder = 'desc',
  } = params;

  const where: Prisma.DemandeWhereInput = {};

  if (search?.trim()) {
    const q = search.trim();
    where.OR = [
      { code_demande: { contains: q, mode: 'insensitive' } },
      { intitule_projet: { contains: q, mode: 'insensitive' } },
      { lieu_ditFR: { contains: q, mode: 'insensitive' } },
      { detenteur: { nom_societeFR: { contains: q, mode: 'insensitive' } } },
      { expertMinier: { nom_expert: { contains: q, mode: 'insensitive' } } },
    ];
  }
  
  if (statut) where.statut_demande = statut;
  if (wilayaId) where.id_wilaya = wilayaId;
  if (typePermisId) where.id_typePermis = typePermisId;
  if (typeProcId) where.id_typeProc = typeProcId;
  
  // Add the demandeId filter
  if (demandeId) {
    where.id_demande = demandeId;
  }

  if (fromDate || toDate) {
    where.date_demande = {};
    if (fromDate) (where.date_demande as any).gte = new Date(fromDate);
    if (toDate) (where.date_demande as any).lte = new Date(toDate);
  }

  // safe orderBy: whitelist keys
  const orderable: Record<string, true> = {
    id_demande: true,
    code_demande: true,
    date_demande: true,
    statut_demande: true,
    date_instruction: true,
    date_fin_instruction: true,
  };
  const orderBy: Prisma.DemandeOrderByWithRelationInput = orderable[sortBy]
    ? { [sortBy]: sortOrder }
    : { date_demande: 'desc' };

  const [total, items] = await this.prisma.$transaction([
    this.prisma.demande.count({ where }),
    this.prisma.demande.findMany({
      where,
      include: this.baseInclude,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    page,
    pageSize,
    total,
    pages: Math.ceil(total / pageSize),
    items,
  };
}

  async stats(params: {
  statut?: string;
  wilayaId?: number;
  typePermisId?: number;
  typeProcId?: number;
  demandeId?: number; // Add this parameter
  fromDate?: string;
  toDate?: string;
}) {
  const where: Prisma.DemandeWhereInput = {};
  
  if (params.statut) where.statut_demande = params.statut;
  if (params.wilayaId) where.id_wilaya = params.wilayaId;
  if (params.typePermisId) where.id_typePermis = params.typePermisId;
  if (params.typeProcId) where.id_typeProc = params.typeProcId;
  
  // Add the demandeId filter
  if (params.demandeId) {
    where.id_demande = params.demandeId;
  }

  if (params.fromDate || params.toDate) {
    where.date_demande = {};
    if (params.fromDate) (where.date_demande as any).gte = new Date(params.fromDate);
    if (params.toDate) (where.date_demande as any).lte = new Date(params.toDate);
  }

  const total = await this.prisma.demande.count({ where });

  const byStatut = await this.prisma.demande.groupBy({
    by: ['statut_demande'],
    where,
    _count: { _all: true },
  });

  const last7 = await this.prisma.demande.count({
    where: {
      ...where,
      date_demande: { gte: new Date(Date.now() - 7 * 24 * 3600 * 1000) },
    },
  });

  const avgInstruction = await this.prisma.demande.aggregate({
    _avg: {
      superficie: true,
      capital_social_disponible: true,
      budget_prevu: true,
      AreaCat: true,
    },
    where: {
      date_instruction: { not: null },
      date_fin_instruction: { not: null },
    },
  });

  // Compute date diffs client-side (small extra query)
  const completed = await this.prisma.demande.findMany({
    where: {
      ...where,
      date_instruction: { not: null },
      date_fin_instruction: { not: null },
    },
    select: { date_instruction: true, date_fin_instruction: true },
    take: 1000, // safety cap; adjust as needed
  });
  const diffs = completed.map(d => +d.date_fin_instruction! - +d.date_instruction!);
  const avgInstructionDays =
    diffs.length ? Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length / 86400000) : null;

  return {
    total,
    last7,
    byStatut,
    avgInstructionDays,
  };
}
  async getDemandeById(id: number) {
    return this.prisma.demande.findUnique({
      where: { id_demande: id },
      include: {
        wilaya: true,
        daira: true,
        commune: true,
        detenteur: { include: { pays: true, nationaliteRef: true } },
        expertMinier: true,
        typePermis: true,
        typeProcedure: true,
        procedure: {
          include: {
            ProcedureEtape: {
              include: { etape: true },
              orderBy: { date_debut: 'asc' },
            },
          },
        },
        dossiersFournis: true,
        CahierCharge: true,
      },
    });
  }
  async findOne(id: number) {
    return this.prisma.demande.findUnique({
      where: { id_demande: id },
      include: this.baseInclude,
    });
  }

  async exportCSV(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  statut?: string;
  wilayaId?: number;
  typePermisId?: number;
  typeProcId?: number;
  demandeId?: number; // Add this parameter
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
}) {
  const all = await this.findMany({ ...params, page: 1, pageSize: 10000 }); // cap export
  const headers = [
    'id_demande',
    'code_demande',
    'date_demande',
    'statut_demande',
    'intitule_projet',
    'wilaya',
    'daira',
    'commune',
    'type_permis',
    'type_procedure',
    'detenteur',
    'expert',
    'superficie',
    'budget_prevu',
    'montant_produit',
  ];
  const rows = all.items.map(d => ([
    d.id_demande,
    d.code_demande ?? '',
    d.date_demande ? new Date(d.date_demande).toISOString() : '',
    d.statut_demande ?? '',
    d.intitule_projet ?? '',
    d.wilaya?.nom_wilayaFR ?? '',
    d.daira?.nom_dairaFR ?? '',
    d.commune?.nom_communeFR ?? '',
    d.typePermis?.lib_type ?? '',
    d.typeProcedure?.libelle ?? '',
    d.detenteur?.nom_societeFR ?? '',
    d.expertMinier?.nom_expert ?? '',
    d.superficie ?? '',
    d.budget_prevu ?? '',
    d.montant_produit ?? '',
  ]).join(','));
  return [headers.join(','), ...rows].join('\n');
}
}
