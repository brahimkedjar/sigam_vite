// comites/comite.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateComiteWithProcedureDto, CreateComiteDto } from '../dto/create-comite.dto';

@Injectable()
export class ComiteService {
  constructor(private prisma: PrismaService) {}

  async createComite(createComiteDto: CreateComiteWithProcedureDto) {
    return this.prisma.comiteDirection.create({
      data: {
        id_seance: createComiteDto.id_seance,
        date_comite: createComiteDto.date_comite,
        resume_reunion: createComiteDto.resume_reunion,
        fiche_technique: createComiteDto.fiche_technique,
        carte_projettee: createComiteDto.carte_projettee,
        rapport_police: createComiteDto.rapport_police,
        decisionCDs: {
          create: {
            decision_cd: 'favorable', // Default value
            duree_decision: null,
            commentaires: null,
            numero_decision: `${createComiteDto.numero_decision}-${createComiteDto.id_proc}`,

          }
        }
      },
      include: {
        decisionCDs: true
      }
    });
  }

  async updateComite(id: number, updateComiteDto: CreateComiteDto) {
    return this.prisma.comiteDirection.update({
      where: { id_comite: id },
      data: {
        date_comite: updateComiteDto.date_comite,
        resume_reunion: updateComiteDto.resume_reunion,
        fiche_technique: updateComiteDto.fiche_technique,
        carte_projettee: updateComiteDto.carte_projettee,
        rapport_police: updateComiteDto.rapport_police,
      }
    });
  }

  async getComiteBySeanceAndProcedure(seanceId: number, procedureId: number) {
    return this.prisma.comiteDirection.findFirst({
      where: {
        id_seance: seanceId,
      },
      include: {
        decisionCDs: true
      }
    });
  }
}