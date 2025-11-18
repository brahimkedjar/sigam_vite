import { Controller, Post, Body, Put, Param, Get, ParseIntPipe } from '@nestjs/common';
import { DemandeService } from './demande.service';
import { RequirePermissions } from 'src/auth/require-permissions.dto';
import { UpdateDemandeDto } from './update-demande.dto';

@Controller('demandes')
export class DemandesController {
  constructor(private readonly demandeService: DemandeService) {}

  @Put(':id')
async updateDemande(
  @Param('id') id: string,
  @Body() updateDemandeDto: UpdateDemandeDto
) {
  return this.demandeService.update(+id, updateDemandeDto);
}

  @Get(':id')
  async getDemande(@Param('id', ParseIntPipe) id: number) {
    return this.demandeService.findById(id);
  }

  @Put(':id/expert')
  async attachExpertToDemande(
    @Param('id') id: string,
    @Body() body: {
        nom_expert: string;
    num_agrement: string;
    etat_agrement: string;
    specialisation:string;
    date_agrement:Date;
    }
  ) {
    const id_demande = parseInt(id, 10);
    const expert = await this.demandeService.createOrFindExpert(body);
    const updated = await this.demandeService.attachExpertToDemande(id_demande, expert.id_expert);
    return updated;
  }

  @Post()
  async createDemande(
    @Body() body: {
      id_typepermis: number;
      objet_demande: string;
      code_demande?: string;
      id_detenteur?: number;
      date_demande: string;
      nom_responsable?: string;
    }
  ) {
    const demande = await this.demandeService.createDemande({
      id_typepermis: body.id_typepermis,
      objet_demande: body.objet_demande,
      code_demande: body.code_demande,
      id_detenteur: body.id_detenteur,
      date_demande: new Date(body.date_demande),
      nom_responsable: body.nom_responsable,
    });

    return demande;
  }


  @Post('generate-code')
  @RequirePermissions('create_demande')
  async generateCode(@Body() body: { id_typepermis: number }) {
    return this.demandeService.generateCode(body.id_typepermis);
  }
}
