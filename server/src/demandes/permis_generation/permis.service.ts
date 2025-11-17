import { Injectable } from '@nestjs/common';
import { unescape } from 'querystring';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GeneratePermisService {
  constructor(private prisma: PrismaService) {}

  async generatePermisFromDemande(
    demandeId: number,
    options?: { codeNumber?: number | string }
  ) {
  const demande = await this.prisma.demande.findUnique({
    where: { id_demande: demandeId },
    include: {
      typePermis: true,
      wilaya: { include: { antenne: true } },
      daira: true,
      commune: true, // Include commune
      procedure: true,
      detenteurdemande: { include: { detenteur: true }, take: 1 }
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
  const detenteurRel = demande.detenteurdemande?.[0]?.detenteur || null;
  if (!detenteurRel) {
    throw new Error("Detenteur missing");
  }
  if (!demande.commune) {
    throw new Error("Commune missing");
  }

  const expirationDate = new Date();
  expirationDate.setFullYear(
    expirationDate.getFullYear() + demande.typePermis.duree_initiale!
  );

  // Resolve default statut if available (e.g., "En vigueur"). If not found, leave unset.
  const defaultStatut = await this.prisma.statutPermis.findFirst({
    where: { lib_statut: { contains: 'En vigueur', mode: 'insensitive' } },
    select: { id: true },
  });

  // Generate code_permis as "<TYPE> <N>"
  const codeType = demande.typePermis.code_type;
  let code_permis: string;

  // If caller provided a fixed designation number, use it directly
  if (options?.codeNumber !== undefined && options?.codeNumber !== null && `${options.codeNumber}`.trim() !== '') {
    const fixedNum = `${options.codeNumber}`.trim();
    code_permis = `${codeType} ${fixedNum}`;

    // Ensure we don't duplicate an existing permis code
    const exists = await this.prisma.permis.findFirst({ where: { code_permis } });
    if (exists) {
      throw new Error(`Un permis avec le code ${code_permis} existe déjà.`);
    }
  } else {
    // Fallback: use global sequential count across permis
    let pSeq = await this.prisma.permis.count();
    do {
      pSeq += 1;
      code_permis = `${codeType} ${pSeq}`;
    } while (await this.prisma.permis.findFirst({ where: { code_permis } }));
  }

  const newPermis = await this.prisma.permis.create({
    data: {
      id_typePermis: demande.typePermis.id,
      id_commune: demande.commune.id_commune, // Changed to use commune ID
      id_detenteur: detenteurRel.id_detenteur,
      id_statut: defaultStatut?.id ?? undefined,
      code_permis,
      date_adjudication: null,
      date_octroi: new Date(),
      date_expiration: expirationDate,
      duree_validite: demande.typePermis.duree_initiale!,
      lieu_ditFR: demande.lieu_ditFR || "",
      lieu_ditAR: demande.lieu_dit_ar || "",
      superficie: demande.superficie || 0,
      utilisation: "",
      statut_juridique_terrain: demande.statut_juridique_terrain || "",
      // Source fields not on Demande; leave null or map from specific sub-procedure if needed
      duree_prevue_travaux: null,
      date_demarrage_travaux: null,
      statut_activites: demande.procedure.statut_proc || "",
      commentaires: null,
      nombre_renouvellements: 0,
    },
  });

  await this.prisma.cahierCharge.updateMany({
    where: { demandeId: demandeId },
    data: { permisId: newPermis.id },
  });

  // Link permis to procedure via join table
  if (demande.id_proc) {
    await this.prisma.permisProcedure.create({
      data: {
        id_permis: newPermis.id,
        id_proc: demande.id_proc,
      },
    });
  }

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
        detenteurdemande: { include: { detenteur: true }, take: 1 },
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
