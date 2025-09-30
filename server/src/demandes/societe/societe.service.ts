import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateActionnaireDto, ActionnaireResult } from '../dto/create-actionnaire.dto';
import { PersonnePhysique, FonctionPersonneMoral, RegistreCommerce, DetenteurMorale,EnumTypeFonction  } from '@prisma/client';

@Injectable()
export class SocieteService {

  async getAllStatutsJuridiques() {
    return this.prisma.statutJuridique.findMany({
      orderBy: { code_statut: 'asc' }
    });
  }

  async getStatutJuridiqueById(id: number) {
    return this.prisma.statutJuridique.findUnique({
      where: { id_statutJuridique: id }
    });
  }

  async createDetenteur(data: any) {
  // First validate the statut exists
  const statutExists = await this.prisma.statutJuridique.findUnique({
    where: { id_statutJuridique: parseInt(data.statut_id, 10) }
  });
  
  if (!statutExists) {
    throw new HttpException('Statut juridique invalide', HttpStatus.BAD_REQUEST);
  }

  // Validate pays exists if id_pays is provided
  if (data.id_pays) {
    const paysExists = await this.prisma.pays.findUnique({
      where: { id_pays: parseInt(data.id_pays, 10) }
    });
    if (!paysExists) {
      throw new HttpException('Pays invalide', HttpStatus.BAD_REQUEST);
    }
  }

  const existing = await this.prisma.detenteurMorale.findFirst({
    where: {
      nom_societeFR: data.nom_fr,
      nom_societeAR: data.nom_ar,
      id_statutJuridique: parseInt(data.statut_id, 10),
    }
  });

  if (existing) {
    throw new HttpException('Le Detenteur Morale existe déjà.', HttpStatus.CONFLICT);
  }

  // Remove the nationalite field from the data
  const { nationalite, ...createData } = data;

  return this.prisma.detenteurMorale.create({
    data: {
      nom_societeFR: createData.nom_fr,
      nom_societeAR: createData.nom_ar,
      telephone: createData.tel,
      email: createData.email,
      fax: createData.fax,
      adresse_siege: createData.adresse,
      // nationalite field removed since it doesn't exist in the model
      statutJuridique: {
        connect: { id_statutJuridique: parseInt(createData.statut_id, 10) }
      },
      ...(createData.id_pays && {
        pays: {
          connect: { id_pays: parseInt(createData.id_pays, 10) }
        }
      })
    },
  });
}

async updateRepresentant(nin: string, data: any) {
  // Find person by NIN
  const personne = await this.prisma.personnePhysique.findUnique({
    where: { num_carte_identite: nin }
  });

  if (!personne) {
    throw new HttpException('Personne non trouvée', HttpStatus.NOT_FOUND);
  }

  // Get the country to determine nationality
  let nationalite = '';
  if (data.id_pays) {
    const pays = await this.prisma.pays.findUnique({
      where: { id_pays: parseInt(data.id_pays, 10) }
    });
    if (pays) {
      nationalite = pays.nationalite;
    }
  }

  // Update person details
  const updatedPersonne = await this.prisma.personnePhysique.update({
    where: { id_personne: personne.id_personne },
    data: {
      nomFR: data.nom,
      prenomFR: data.prenom,
      nomAR: data.nom_ar,
      prenomAR: data.prenom_ar,
      telephone: data.tel,
      email: data.email,
      fax: data.fax,
      qualification: data.qualite,
      nationalite: nationalite, // Set nationality from country
      lieu_naissance: data.lieu_naissance,
      // Add pays relation if id_pays is provided
      ...(data.id_pays && {
        pays: {
          connect: { id_pays: parseInt(data.id_pays, 10) }
        }
      })
    }
  });
  
  // Update or create the function
  await this.linkFonction(
    updatedPersonne.id_personne,
    data.id_detenteur,
    EnumTypeFonction.Representant,
    'Actif',
    parseFloat(data.taux_participation)
  );

  return { personne: updatedPersonne };
}

  async linkFonction(
    id_personne: number,
    id_detenteur: number,
    type_fonction: EnumTypeFonction,
    statut_personne: string,
    taux_participation: number
  ): Promise<FonctionPersonneMoral> {
    // Check if function exists
    const existing = await this.prisma.fonctionPersonneMoral.findFirst({
      where: {
        id_personne,
        id_detenteur,
        type_fonction
      }
    });

    if (existing) {
      // Update existing
      return this.prisma.fonctionPersonneMoral.update({
        where: {
          id_detenteur_id_personne: {
            id_detenteur,
            id_personne
          }
        },
        data: {
          statut_personne,
          taux_participation
        }
      });
    }
    
    // Create new if not exists
    return this.prisma.fonctionPersonneMoral.create({
      data: {
        id_detenteur,
        id_personne,
        type_fonction,
        statut_personne,
        taux_participation
      }
    });
  }


 async createRegistre(id_detenteur: number, data: any) {
  if (!data.numero_rc || !data.date_enregistrement || !data.capital_social || !data.nis || !data.nif) {
    throw new HttpException('Tous les champs requis doivent être fournis.', HttpStatus.BAD_REQUEST);
  }

  const existing = await this.prisma.registreCommerce.findFirst({
    where: {
      numero_rc: data.numero_rc,
      nis: data.nis,
      nif: data.nif,
    }
  });

  if (existing) {
    throw new HttpException('Le Registre de Commerce existe déjà.', HttpStatus.CONFLICT);
  }

  const parsedDate = new Date(data.date_enregistrement);
  if (isNaN(parsedDate.getTime())) {
    throw new HttpException('Date d’enregistrement invalide.', HttpStatus.BAD_REQUEST);
  }

  const capital = parseFloat(data.capital_social);
  if (isNaN(capital)) {
    throw new HttpException('Capital social invalide.', HttpStatus.BAD_REQUEST);
  }

  return this.prisma.registreCommerce.create({
    data: {
      id_detenteur,
      numero_rc: data.numero_rc,
      date_enregistrement: parsedDate,
      capital_social: capital,
      nis: data.nis,
      adresse_legale: data.adresse_legale || '',
      nif: data.nif,
    },
  });
}


  constructor(private prisma: PrismaService) {}

  async createPersonne(data: any): Promise<PersonnePhysique> {
  const existing = await this.prisma.personnePhysique.findFirst({
    where: {
      nomFR: data.nom,
      prenomFR: data.prenom,
      num_carte_identite: data.nin,
    }
  });

  if (existing) {
    throw new HttpException('Cette Personne Physique existe déjà.', HttpStatus.CONFLICT);
  }

  // Get the country to determine nationality
  let nationalite = '';
  if (data.id_pays) {
    const pays = await this.prisma.pays.findUnique({
      where: { id_pays: parseInt(data.id_pays, 10) }
    });
    if (pays) {
      nationalite = pays.nationalite;
    }
  }

  const createData: any = {
    nomFR: data.nom,
    prenomFR: data.prenom,
    nomAR: data.nom_ar ?? '',
    prenomAR: data.prenom_ar ?? '',
    telephone: data.tel ?? '',
    email: data.email ?? '',
    fax: data.fax ?? '',
    qualification: data.qualite,
    nationalite: nationalite, // Set nationality from country
    num_carte_identite: data.nin,
    adresse_domicile: data.adresse_domicile ?? '',
    date_naissance: data.date_naissance ? new Date(data.date_naissance) : new Date(),
    lieu_naissance: data.lieu_naissance ?? '',
    lieu_juridique_soc: data.lieu_juridique_soc ?? '',
    ref_professionnelles: data.ref_professionnelles ?? '',
  };

  // Add pays relation if id_pays is provided
  if (data.id_pays) {
    createData.pays = {
      connect: { id_pays: parseInt(data.id_pays, 10) }
    };
  }

  try {
    const result = await this.prisma.personnePhysique.create({
      data: createData,
    });
    return result;
  } catch (error) {
    console.error('Error creating PersonnePhysique:', error);
    throw error;
  }
}

async updateActionnaires(
  id_detenteur: number,
  list: CreateActionnaireDto[]
): Promise<ActionnaireResult[]> {

  // First delete actionnaires not in the new list
  const existingNins = list.map(a => a.numero_carte).filter(Boolean);
  await this.prisma.fonctionPersonneMoral.deleteMany({
    where: {
      id_detenteur,
      type_fonction: 'Actionnaire',
      NOT: {
        personne: {
          num_carte_identite: {
            in: existingNins
          }
        }
      }
    }
  });

  const results: ActionnaireResult[] = [];
  
  for (const [index, a] of list.entries()) {    
    let personne: PersonnePhysique;
    const existingPersonne = await this.prisma.personnePhysique.findFirst({
      where: { num_carte_identite: a.numero_carte }
    });

    if (existingPersonne) {      
      // Update existing person
      personne = await this.prisma.personnePhysique.update({
        where: { id_personne: existingPersonne.id_personne },
        data: {
          nomFR: a.nom,
          prenomFR: a.prenom,
          qualification: a.qualification,
          //nationalite: a.nationalite,
          lieu_naissance: a.lieu_naissance,
          // Add pays connection if available
          ...(a.id_pays && {
            pays: {
              connect: { id_pays: a.id_pays }
            }
          }),
        }
      });
          } else {      
      // Create new person with detailed logging
      const personneData: any = {
        nom: a.nom,
        prenom: a.prenom,
        nom_ar: '',
        prenom_ar: '',
        tel: '',
        email: '',
        fax: '',
        qualite: a.qualification,
        nationalite: a.nationalite,
        nin: a.numero_carte,
        lieu_naissance: a.lieu_naissance,
      };

      // Add id_pays if available
      if (a.id_pays) {
        personneData.id_pays = a.id_pays;
      } else {
        console.log('WARNING: No id_pays in actionnaire data');
      }

      personne = await this.createPersonne(personneData);
    }

    // Link/update as actionnaire
    const lien = await this.linkFonction(
      personne.id_personne,
      id_detenteur,
      'Actionnaire',
      'Actif',
      parseFloat(a.taux_participation)
    );

    results.push({ personne, lien });
  }
    return results;
}

  async updateRegistre(id_detenteur: number, data: any): Promise<RegistreCommerce> {
  // First check if registre exists for this detenteur
  const existing = await this.prisma.registreCommerce.findFirst({
    where: { id_detenteur }
  });

  if (!existing) {
    throw new HttpException('Registre de Commerce non trouvé', HttpStatus.NOT_FOUND);
  }

  return this.prisma.registreCommerce.update({
    where: { id: existing.id },   // ✅ use primary key (id)
    data: {
      numero_rc: data.numero_rc,
      date_enregistrement: new Date(data.date_enregistrement),
      capital_social: parseFloat(data.capital_social),
      nis: data.nis,
      adresse_legale: data.adresse_legale,
      nif: data.nif,
      id_detenteur, // keep the relation
    }
  });
}


async updateDetenteur(id: number, data: any): Promise<DetenteurMorale> {
  // First check if detenteur exists
  const existing = await this.prisma.detenteurMorale.findUnique({
    where: { id_detenteur: id }
  });

  if (!existing) {
    throw new HttpException('Détenteur non trouvé', HttpStatus.NOT_FOUND);
  }

  // Check for conflicts with other detenteurs
  const conflictingDetenteur = await this.prisma.detenteurMorale.findFirst({
    where: {
      NOT: { id_detenteur: id },
      OR: [
        { nom_societeFR: data.nom_fr },
        { nom_societeAR: data.nom_ar }
      ]
    }
  });

  if (conflictingDetenteur) {
    throw new HttpException('Un détenteur avec ce nom existe déjà', HttpStatus.CONFLICT);
  }

  // Update the detenteur
  return this.prisma.detenteurMorale.update({
    where: { id_detenteur: id },
    data: {
      nom_societeFR: data.nom_fr,
      nom_societeAR: data.nom_ar,
      id_statutJuridique: parseInt(data.statut_id, 10),
      telephone: data.tel,
      email: data.email,
      fax: data.fax,
      adresse_siege: data.adresse,
      //nationalite: data.nationalite,
      pays: data.pays
    }
  });
}

async deleteActionnaires(id_detenteur: number) {
  // Start transaction to ensure data consistency
  return this.prisma.$transaction(async (tx) => {
    // 1. Get all actionnaires with their person data
    const fonctions = await tx.fonctionPersonneMoral.findMany({
      where: {
        id_detenteur,
        type_fonction: 'Actionnaire'
      },
      include: {
        personne: true
      }
    });

    // 2. Delete all actionnaire functions
    await tx.fonctionPersonneMoral.deleteMany({
      where: {
        id_detenteur,
        type_fonction: 'Actionnaire'
      }
    });

    // 3. Delete orphaned persons (not used in other functions)
    for (const f of fonctions) {
      const otherFunctionsCount = await tx.fonctionPersonneMoral.count({
        where: {
          id_personne: f.id_personne,
          NOT: {
            id_detenteur,
            id_personne: f.id_personne
          }
        }
      });

      if (otherFunctionsCount === 0) {
        await tx.personnePhysique.delete({
          where: { id_personne: f.id_personne }
        });
      }
    }

    return { count: fonctions.length };
  });
}

  async createActionnaires(
  id_detenteur: number,
  list: CreateActionnaireDto[]
): Promise<ActionnaireResult[]> {
  const results: ActionnaireResult[] = [];

  for (const a of list) {
    // 1. Check if the person already exists
    const existingPersonne = await this.prisma.personnePhysique.findFirst({
      where: {
        nomFR: a.nom,
        prenomFR: a.prenom,
        num_carte_identite: a.numero_carte,
      },
    });

    let personne;

    if (existingPersonne) {
      // 2. Check if already linked to this detenteur as Actionnaire
      const existingLink = await this.prisma.fonctionPersonneMoral.findFirst({
        where: {
          id_personne: existingPersonne.id_personne,
          id_detenteur,
          type_fonction: 'Actionnaire',
        },
      });

      if (existingLink) {
        // 3. Throw HTTP Conflict
        throw new HttpException(
          `L'actionnaire "${a.nom} ${a.prenom}" existe déjà pour cette société.`,
          HttpStatus.CONFLICT
        );
      }

      personne = existingPersonne;
    } else {
      // Create new personne
      personne = await this.createPersonne({
        nom: a.nom,
        prenom: a.prenom,
        nom_ar: '',
        prenom_ar: '',
        tel: '',
        email: '',
        fax: '',
        qualite: a.qualification,
        nationalite: a.nationalite,
        nin: a.numero_carte,
         id_pays: a.id_pays,
        lieu_naissance: a.lieu_naissance,
        pays: {
      connect: { id_pays: a.id_pays }   // 👈 connect instead of create
    }
        
      });
    }

    // Link as actionnaire
    const lien = await this.linkFonction(
      personne.id_personne,
      id_detenteur,
      'Actionnaire',
      'Actif',
      parseFloat(a.taux_participation)
    );

    results.push({ personne, lien });
  }

  return results;
}

async searchDetenteurs(query: string): Promise<any[]> {
  try {
    return await this.prisma.detenteurMorale.findMany({
      where: {
        OR: [
          { nom_societeFR: { contains: query, mode: 'insensitive' } },
          { nom_societeAR: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { telephone: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: 10,
      select: {
        id_detenteur: true,
        nom_societeFR: true,
        nom_societeAR: true,
        telephone: true,
        email: true
      },
      orderBy: { nom_societeFR: 'asc' }
    });
  } catch (error) {
    console.error('Error searching detenteurs:', error);
    throw new HttpException('Failed to search detenteurs', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

async getDetenteurById(id: number): Promise<any> {
  return this.prisma.detenteurMorale.findUnique({
    where: { id_detenteur: id },
    include: {
      statutJuridique: true,
      pays: true
    }
  });
}

async getRepresentantLegal(id_detenteur: number): Promise<any> {
  return this.prisma.fonctionPersonneMoral.findFirst({
    where: {
      id_detenteur,
      type_fonction: EnumTypeFonction.Representant
    },
    include: {
      personne: {
        include: {
          pays: true
        }
      }
    }
  });
}

async getRegistreCommerce(id_detenteur: number): Promise<any> {
  return this.prisma.registreCommerce.findFirst({
    where: { id_detenteur }
  });
}

async getActionnaires(id_detenteur: number): Promise<any[]> {
  return this.prisma.fonctionPersonneMoral.findMany({
    where: {
      id_detenteur,
      type_fonction: EnumTypeFonction.Actionnaire
    },
    include: {
      personne: {
        include: {
          pays: true
        }
      }
    }
  });
}

async associateDetenteurWithDemande(id_demande: number, id_detenteur: number): Promise<any> {
  // Verify both demande and detenteur exist
  const demande = await this.prisma.demande.findUnique({
    where: { id_demande }
  });
  
  if (!demande) {
    throw new HttpException('Demande not found', HttpStatus.NOT_FOUND);
  }
  
  const detenteur = await this.prisma.detenteurMorale.findUnique({
    where: { id_detenteur }
  });
  
  if (!detenteur) {
    throw new HttpException('Detenteur not found', HttpStatus.NOT_FOUND);
  }
  
  // Update the demande with the detenteur ID
  return this.prisma.demande.update({
    where: { id_demande },
    data: { id_detenteur }
  });
}

}
