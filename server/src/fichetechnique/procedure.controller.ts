import { Controller, Get, Header, NotFoundException, Param, Query, Res } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('api/procedures')
export class ProceduretechniqueController {
  constructor(
    private readonly prisma: PrismaService
  ) {}
@Get(':id/fiche-technique')
async getFicheTechnique(@Param('id') id: string) {
  const id_proc = parseInt(id, 10);

  const procedure = await this.prisma.procedure.findUnique({
    where: { id_proc },
    include: {
      demandes: {
        include: {
          detenteur: {
            include: {
              statutJuridique: true,
              registreCommerce: true,
              pays: true,
              fonctions: { include: { personne: true } }
            }
          },
          pays: true,
          commune: true,
          wilaya: true,
          expertMinier: true
        }
      },
      permis: {
        include: {
          ObligationFiscale: {
            include: { typePaiement: true, paiements: true }
          }
        }
      },
      SubstanceAssocieeDemande: {
        include: { substance: true }
      }
    }
  });

  if (!procedure) {
    throw new NotFoundException(`Procédure ${id_proc} non trouvée`);
  }

  const demande = procedure.demandes?.[0];

  const taxesMap: Record<string, any> = {};

procedure.permis?.forEach(p => {
  p.ObligationFiscale.forEach(ob => {
    const year = ob.annee_fiscale.toString();

    if (!taxesMap[year]) {
      taxesMap[year] = {
        annee: year,
        ts: { montant: '', statut: '' },
        dea: { montant: '', statut: '' },
        prdattr: { montant: '', statut: '' }
      };
    }

    if (ob.typePaiement?.libelle?.includes('Taxe superficiaire')) {
      taxesMap[year].ts = {
        montant: ob.montant_attendu?.toString() || '',
        statut: ob.statut
      };
    }
    if (ob.typePaiement?.libelle?.includes("Droit d'établissement")) {
      taxesMap[year].dea = {
        montant: ob.montant_attendu?.toString() || '',
        statut: ob.statut
      };
    }
    if (ob.typePaiement?.libelle?.includes("Produit d'attribution")) {
      taxesMap[year].prdattr = {
        montant: ob.montant_attendu?.toString() || '',
        statut: ob.statut
      };
    }
  });
});

const taxes = Object.values(taxesMap);


  // 🟢 Substances (principale + secondaires)
  const substances = procedure.SubstanceAssocieeDemande.map(sa => ({
    id: sa.substance.id_sub,
    nomFR: sa.substance.nom_subFR,
    nomAR: sa.substance.nom_subAR,
    categorie: sa.substance.categorie_sub,
    famille: sa.substance.famille_sub,
    priorite: sa.priorite // "principale" | "secondaire"
  }));

  return {
    procedure: {
      id_proc: procedure.id_proc,
      num_proc: procedure.num_proc,
      date_debut_proc: procedure.date_debut_proc,
      date_fin_proc: procedure.date_fin_proc,
      statut_proc: procedure.statut_proc,
      observations: procedure.observations
    },
    demande,
    substances,
    taxes,
    equipementsExtraction: [],
    materielsRoulants: [],
    genieCivil: [],
    autresEquipements: []
  };
}

}