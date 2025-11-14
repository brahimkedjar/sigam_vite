import { Injectable } from '@nestjs/common';
import { unescape } from 'querystring';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GeneratePermisService {
  constructor(private prisma: PrismaService) {}

  async generatePermisFromDemande(demandeId: number) {
  const demande = await this.prisma.demande.findUnique({
    where: { id_demande: demandeId },
    include: {
      typePermis: true,
      wilaya: { include: { antenne: true } },
      daira: true,
      commune: true, // Include commune
      procedure: true,
      detenteur: true
    }
  });

  if (!demande) {
    throw new Error("Demande not found");
  }
  if (!demande.typePermis) {
    throw new Error("TypePermis missing");
  }
  if (!demande.procedure) {
    throw new Error("Procedure missing");
  }
  if (!demande.detenteur) {
    throw new Error("Detenteur missing");
  }
  if (!demande.commune) {
    throw new Error("Commune missing");
  }

  const initialDuration = demande.typePermis.duree_initiale;
  if (initialDuration == null) {
    throw new Error("TypePermis initial duration missing");
  }

  const expirationDate = new Date();
  expirationDate.setFullYear(
    expirationDate.getFullYear() + initialDuration
  );

  // Resolve default statut if available (e.g., "En vigueur"). If not found, leave unset.
  const defaultStatut = await this.prisma.statutPermis.findFirst({
    where: { lib_statut: { contains: 'En vigueur', mode: 'insensitive' } },
    select: { id: true },
  });

  const newPermis = await this.prisma.permis.create({
    data: {
      id_typePermis: demande.typePermis.id,
      id_commune: demande.commune.id_commune, // Changed to use commune ID
      id_detenteur: demande.detenteur.id_detenteur,
      id_statut: defaultStatut?.id ?? undefined,
      code_permis: demande.code_demande || null,
      date_adjudication: null,
      date_octroi: new Date(),
      date_expiration: expirationDate,
      duree_validite: initialDuration,
      lieu_ditFR: demande.lieu_ditFR || "",
      lieu_ditAR: demande.lieu_dit_ar || "",
      superficie: demande.superficie || 0,
      utilisation: "",
      statut_juridique_terrain: demande.statut_juridique_terrain || "",
      duree_prevue_travaux: demande.duree_travaux_estimee || null,
      date_demarrage_travaux: demande.date_demarrage_prevue || null,
      statut_activites: demande.procedure.statut_proc || "",
      commentaires: null,
      nombre_renouvellements: 0,
    },
  });

  await this.prisma.cahierCharge.updateMany({
    where: { demandeId: demandeId },
    data: { permisId: newPermis.id },
  });

  await this.prisma.procedure.update({
    where: { id_proc: demande.id_proc || undefined},
    data: { permis: { connect: { id: newPermis.id } } },
  });

  return newPermis;
}

  async getPermisPdfInfo(demandeId: number) {
    return this.prisma.demande.findUnique({
      where: { id_demande: demandeId },
      include: {
        typePermis: true,
        wilaya: true,
        daira: true,
        commune: true,
        detenteur: true,
        procedure: true
      }
    });
  }

/*async getTemplates(codepermis?: string) {
  // First find the permis by its code
  const permis = await this.prisma.permis.findUnique({
    where: { code_permis: codepermis },
  });

  if (!permis) {
    return []; // Return empty array if no permis found
  }

  // Then find all templates associated with this permis
  return this.prisma.permisTemplate.findMany({
    where: { 
      permisId: permis.id 
    },
    orderBy: { 
      createdAt: 'desc' 
    }
  });
}*/
 // In your GeneratePermisService
async saveTemplate(templateData: any) {
  const { elements, permisId, templateId, name } = templateData;
  
  // Allow null/undefined permisId for templates that aren't yet associated with a permis
  const parsedPermisId = permisId ? parseInt(permisId, 10) : undefined;
  if (parsedPermisId && isNaN(parsedPermisId)) {
    throw new Error('Invalid permisId');
  }

  // Only fetch permis if we have a valid ID
  let typePermisId = 1; // Default value
  if (parsedPermisId) {
    const permis = await this.prisma.permis.findUnique({
      where: { id: parsedPermisId },
      select: { typePermis: true }
    });

    if (!permis) {
      throw new Error('Permis not found');
    }
    typePermisId = permis.typePermis.id;
  }

  // Ensure elements is properly formatted
  if (!elements) {
    throw new Error('Elements data is required');
  }

  if (templateId) {
    // Update existing template
    return this.prisma.permisTemplate.update({
      where: { id: templateId },
      data: { 
        elements,
        name: name || undefined,
        updatedAt: new Date(),
        version: { increment: 1 },
        permisId: parsedPermisId // Update permis association if needed
      }
    });
  } else {
    // Create new template
    return this.prisma.permisTemplate.create({
      data: {
        name: name || `Template ${new Date().toLocaleDateString()}`,
        elements: elements,
        typePermisId: typePermisId,
        permisId: parsedPermisId // Can be null for unassociated templates
      }
    });
  }
}

async deleteTemplate(id: string) {
  return this.prisma.permisTemplate.delete({
    where: { id: parseInt(id) }
  });
}

}
