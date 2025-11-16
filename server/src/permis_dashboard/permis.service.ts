import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class Permisdashboard2Service {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.permis.findMany({
      include: {
        typePermis: true,
        detenteur: true,
        statut: true
      },
      orderBy: {
        date_octroi: 'desc'
      }
    });
  }

  async findActive() {
    return this.prisma.permis.findMany({
      where: {
        statut: {
          lib_statut: 'En vigueur'
        }
      },
      include: {
        typePermis: true,
        detenteur: true,
        statut: true
      },
      orderBy: {
        date_octroi: 'desc'
      }
    });
  }

  async findExpired() {
    return this.prisma.permis.findMany({
      where: {
        date_expiration: {
          lt: new Date()
        },
        statut: {
          lib_statut: 'En vigueur'
        }
      },
      include: {
        typePermis: true,
        detenteur: true,
        statut: true
      },
      orderBy: {
        date_expiration: 'desc'
      }
    });
  }

// In your Permisdashboard2Service
async findAll1(pagination: { skip?: number; take?: number } = {}) {
  return this.prisma.permis.findMany({
    include: {
      typePermis: true,
      detenteur: true,
      statut: true,
      commune: {
        include: {
          daira: {
            include: {
              wilaya: true
            }
          }
        }
      },
      procedures: {
        include: {
          SubstanceAssocieeDemande: {
            include: {
              substance: true
            }
          }
        }
      }
    },
    orderBy: {
      date_octroi: 'desc'
    },
    skip: pagination.skip,
    take: pagination.take
  });
}
  async findCurrent(pagination: { skip?: number; take?: number } = {}) {
    return this.prisma.permis.findMany({
      where: {
        statut: {
          lib_statut: 'En vigueur'
        }
      },
      include: {
        typePermis: true,
        detenteur: true,
        statut: true,
        procedures: {
          include: {
            SubstanceAssocieeDemande: {
              include: {
                substance: true
              }
            }
          }
        }
      },
      orderBy: {
        date_octroi: 'desc'
      },
      skip: pagination.skip,
      take: pagination.take
    });
  }

  async findOneWithDetails(permisId: number) {
  return this.prisma.permis.findUnique({
    where: { id: permisId },
    include: {
      typePermis: true,
      detenteur: true,
      statut: true,
      procedures: {
        include: {
          SubstanceAssocieeDemande: {
            include: {
              substance: true,
            },
          },
          ProcedureEtape: {
            include: {
              etape: true,
            },
            orderBy: {
              etape: {
                ordre_etape: 'asc',
              },
            },
          },
          demandes: {
            include: {
              detenteur: true,
              typeProcedure: true,
            },
          },
          coordonnees: {
            include: {
              coordonnee: true,
            },
          },
        },
      },
    },
  });
}


async delete(id: number) {
  return this.prisma.permis.delete({
    where: { id }
  });
}

// src/permis/permis.service.ts

async getDocumentsByProcedure(permisId: number) {
  // Get all procedures for this permis with their documents
  const procedures = await this.prisma.procedure.findMany({
    where: {
      permis: {
        some: {
          id: permisId,
        },
      },
    },
    include: {
      demandes: {
        include: {
          dossiersFournis: {
            include: {
              documents: {
                include: {
                  document: {
                    include: {
                      dossierFournisDocuments: {
                        take: 1,
                        orderBy: {
                          created_at: 'desc',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  // Organize documents by procedure
  const proceduresWithDocuments = procedures.map(procedure => {
    const procedureDocuments = procedure.demandes.flatMap(demande =>
      demande.dossiersFournis.flatMap(dossier =>
        dossier.documents.map(dossierDoc => {
          const fileInfo = dossierDoc.document.dossierFournisDocuments[0];
          
          return {
            id: dossierDoc.document.id_doc,
            nom: dossierDoc.document.nom_doc,
            description: dossierDoc.document.description,
            type: dossierDoc.document.format,
            taille: parseInt(dossierDoc.document.taille_doc) || 0,
            url: fileInfo?.file_url || '',
            date_upload: fileInfo?.created_at || new Date(),
            status: fileInfo?.status || 'inconnu',
          };
        })
      )
    );

    return {
      id_proc: procedure.id_proc,
      num_proc: procedure.num_proc,
      statut_proc: procedure.statut_proc,
      documents: procedureDocuments,
      documentCount: procedureDocuments.length,
    };
  });

  return proceduresWithDocuments;
}



  async getAllDocumentsForPermis(permisId: number) {
  const [procedureDocuments] = await Promise.all([
    this.getDocumentsByProcedure(permisId),
  ]);

  // Calculate total document count
  const totalCount = procedureDocuments.reduce((total, proc) => total + proc.documentCount, 0)
  return {
    procedures: procedureDocuments,
    totalCount,
  };
}

  async getHistoriqueByPermisId(permisId: number) {
    const current = await this.prisma.permis.findUnique({
      where: { id: permisId },
      select: { code_permis: true }
    });
    if (!current?.code_permis) return [];

    const match = current.code_permis.match(/(\d+)$/);
    const num = match ? match[1] : null;
    if (!num) return [];

    const list = await this.prisma.permis.findMany({
      where: {
        code_permis: { endsWith: ` ${num}` }
      },
      include: {
        typePermis: true,
        detenteur: true,
        statut: true,
      },
      orderBy: { date_octroi: 'asc' },
    });

    const order: Record<string, number> = { APM: 1, TEM: 2, TEC: 3, TXM: 4, TXC: 5 };
    const sorted = list.sort((a, b) => {
      const aCode = (a.typePermis?.code_type || '').toUpperCase();
      const bCode = (b.typePermis?.code_type || '').toUpperCase();
      const ao = order[aCode] ?? 99;
      const bo = order[bCode] ?? 99;
      if (ao !== bo) return ao - bo;
      const ad = a.date_octroi ? new Date(a.date_octroi).getTime() : 0;
      const bd = b.date_octroi ? new Date(b.date_octroi).getTime() : 0;
      return ad - bd;
    });

    return sorted.map(p => ({
      id: p.id,
      code: p.code_permis,
      type: p.typePermis?.lib_type || '',
      type_code: p.typePermis?.code_type || '',
      detenteur: p.detenteur?.nom_societeFR || null,
      statut: p.statut?.lib_statut || null,
      date_octroi: p.date_octroi,
      date_expiration: p.date_expiration,
    }));
  }
}
