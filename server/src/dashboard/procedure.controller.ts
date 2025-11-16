// src/procedure/procedure.controller.ts
import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { ProcedureService } from './procedure.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('api/procedures')
export class ProcedureController {
  constructor(
    private readonly procedureService: ProcedureService,
    private readonly prisma: PrismaService
  ) {}

  // Specific static routes FIRST
  @Get('en-cours')
  async getOngoingProcedures() {
    console.log('GET /api/procedures/en-cours');
    return this.procedureService.getProceduresEnCours();
  }

  @Get(':id_proc/demande')
async getDemandeByProcedure(
  @Param('id_proc', ParseIntPipe) id_proc: number
) {
  console.log(`GET /api/procedures/${id_proc}/demande`);
  const demande = await this.prisma.demande.findFirst({
    where: { id_proc },
    include: {
      detenteurdemande: {
        include: {
          detenteur: {
            include: {
              statutJuridique: true,
              registreCommerce: true,
              fonctions: {
                where: {
                  type_fonction: {
                    in: ['Representant', 'Actionnaire'],
                  },
                },
                include: { personne: true },
              },
            },
          },
        },
      },
      expertMinier: true,
      typePermis: true,       
      typeProcedure: true,    
      procedure: {
        include: {
          ProcedureEtape: {
            include: { etape: true },
            orderBy: { etape: { ordre_etape: 'asc' } },
          },
        },
      },
    },
  });

  if (!demande) {
    return null;
  }

  const primaryDetenteur = demande.detenteurdemande?.[0]?.detenteur ?? null;
  const { detenteurdemande, ...rest } = demande as any;
  return {
    ...rest,
    detenteur: primaryDetenteur,
  };
}


  @Put('terminer/:idProc')
  async terminerProcedure(
    @Param('idProc', ParseIntPipe) idProc: number
  ) {
    console.log(`PUT /api/procedures/terminer/${idProc}`);
    return this.procedureService.terminerProcedure(idProc);
  }

  @Get()
  async getAllProcedures() {
    console.log('GET /api/procedures');
    return this.procedureService.getAllProcedures();
  }

  // Generic ":id" LAST so it doesn't steal other routes
  @Get(':id')
  async getProcedureById(@Param('id', ParseIntPipe) id: number) {
    console.log(`GET /api/procedures/${id}`);
    const procedure = await this.procedureService.getProcedureById(id);
    if (!procedure) {
      throw new NotFoundException('Procedure not found');
    }
    return procedure;
  }

  @Delete(':id')
  async deleteProcedure(@Param('id', ParseIntPipe) id: number) {
    console.log(`DELETE /api/procedures/${id}`);
    return this.procedureService.deleteProcedureAndRelatedData(id);
  }
}
