// interaction-wali.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInteractionDto } from '../dto/create-interaction.dto';

@Injectable()
export class InteractionWaliService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateInteractionDto) {
    // Prepare the data object based on interaction type
    const interactionData: any = {
      type_interaction: data.type_interaction,
      avis_wali: data.avis_wali,
      commentaires: data.remarques,
      contenu: data.contenu,
      nom_responsable_reception: data.nom_responsable_reception,
      is_relance: data.is_relance ?? false,
      Procedure: {
        connect: { id_proc: data.id_procedure }
      },
      Wilaya: {
        connect: { id_wilaya: data.id_wilaya }
      }
    };

    // Set appropriate date fields based on interaction type
    if (data.type_interaction === 'envoi') {
      interactionData.date_envoi = new Date(data.date_interaction);
      // Don't set date_reponse for envoi
    } else if (data.type_interaction === 'reponse') {
      interactionData.date_reponse = new Date(data.date_interaction);
      // Don't set date_envoi for reponse
    }

    return this.prisma.interactionWali.create({
      data: interactionData
    });
  }

  findByProcedure(id_procedure: number) {
    return this.prisma.interactionWali.findMany({
      where: { id_procedure },
      orderBy: { date_envoi: 'asc' },
    });
  }
}