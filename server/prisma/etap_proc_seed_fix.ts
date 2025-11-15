// etap_proc_seed_fix.ts (ASCII-only labels)
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function main() {
  await prisma.typeProcedure.createMany({
    data: [
      { libelle: 'demande', description: 'Demande initiale de permis' },
      { libelle: 'renouvellement', description: 'Renouvellement de permis' },
    ],
    skipDuplicates: true,
  });

  const types = await prisma.typeProcedure.findMany();
  const demandeType = types.find((t) => t.libelle === 'demande');
  const renouvellementType = types.find((t) => t.libelle === 'renouvellement');

  type PhaseDef = { libelle: string; ordre: number; description?: string | null };
  const demandePhases: PhaseDef[] = [
    { libelle: 'Enregistrement de la demande', ordre: 1 },
    { libelle: 'Verification cadastrale', ordre: 2 },
    { libelle: 'Enquete Wali', ordre: 3 },
    { libelle: 'Comite de direction', ordre: 4 },
    { libelle: 'Generation du permis', ordre: 5 },
    { libelle: 'Finalisation', ordre: 6 },
  ];
  const renouvellementPhases: PhaseDef[] = [
    { libelle: 'Soumission', ordre: 1 },
    { libelle: 'Verification', ordre: 2 },
    { libelle: 'Approbation', ordre: 3 },
  ];

  const createdPhases: Record<string, number> = {};
  async function ensurePhase(p: PhaseDef) {
    let phase = await prisma.phase.findFirst({ where: { libelle: p.libelle, ordre: p.ordre } });
    if (!phase) {
      phase = await prisma.phase.create({ data: { libelle: p.libelle, ordre: p.ordre, description: p.description ?? null } });
    }
    createdPhases[`${p.libelle}|${p.ordre}`] = phase.id_phase;
    return phase.id_phase;
  }

  if (demandeType) {
    for (const p of demandePhases) {
      const id_phase = await ensurePhase(p);
      const exists = await prisma.relationPhaseTypeProc.findFirst({ where: { id_phase, id_typeProcedure: demandeType.id } });
      if (!exists) {
        await prisma.relationPhaseTypeProc.create({ data: { id_phase, id_typeProcedure: demandeType.id, dureeEstimee: null } });
      }
    }
  }

  if (renouvellementType) {
    for (const p of renouvellementPhases) {
      const id_phase = await ensurePhase(p);
      const exists = await prisma.relationPhaseTypeProc.findFirst({ where: { id_phase, id_typeProcedure: renouvellementType.id } });
      if (!exists) {
        await prisma.relationPhaseTypeProc.create({ data: { id_phase, id_typeProcedure: renouvellementType.id, dureeEstimee: null } });
      }
    }
  }

  if (demandeType) {
    const getPhaseId = (libelle: string, ordre: number) => createdPhases[`${libelle}|${ordre}`];
    const etapes = [
      { id_etape: 1, lib_etape: 'Identification', ordre_etape: 1, id_phase: getPhaseId('Enregistrement de la demande', 1) },
      { id_etape: 2, lib_etape: 'Documents', ordre_etape: 2, id_phase: getPhaseId('Enregistrement de la demande', 1) },
      { id_etape: 3, lib_etape: 'Capacites', ordre_etape: 3, id_phase: getPhaseId('Enregistrement de la demande', 1) },
      { id_etape: 4, lib_etape: 'Substances & Travaux', ordre_etape: 4, id_phase: getPhaseId('Enregistrement de la demande', 1) },
      { id_etape: 5, lib_etape: 'Cadastre', ordre_etape: 5, id_phase: getPhaseId('Verification cadastrale', 2) },
      { id_etape: 6, lib_etape: 'Avis Wali', ordre_etape: 6, id_phase: getPhaseId('Enquete Wali', 3) },
      { id_etape: 7, lib_etape: 'Comite de direction', ordre_etape: 7, id_phase: getPhaseId('Comite de direction', 4) },
      { id_etape: 8, lib_etape: 'Generation du permis', ordre_etape: 8, id_phase: getPhaseId('Generation du permis', 5) },
      { id_etape: 9, lib_etape: 'Paiement', ordre_etape: 9, id_phase: getPhaseId('Finalisation', 6) },
    ].filter((e) => !!e.id_phase) as any[];

    if (etapes.length) {
      await prisma.etapeProc.createMany({ data: etapes, skipDuplicates: true });
    }
  }

  console.log('etap_proc_seed_fix completed.');
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error('Seed etap_proc_fix failed:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

