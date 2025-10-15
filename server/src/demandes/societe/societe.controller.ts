import { Controller, Post, Get, Body, Put, Param, ParseIntPipe, Delete, HttpException, HttpStatus, Query } from '@nestjs/common';
import { SocieteService } from './societe.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateActionnaireDto } from '../dto/create-actionnaire.dto';
import { EnumTypeFonction } from '@prisma/client';

@Controller('api')
export class SocieteController {
  constructor(
    private readonly societeService: SocieteService,
    private readonly prisma: PrismaService
  ) {}

  @Get('statuts-juridiques')
async getAllStatutsJuridiques() {
  return this.prisma.statutJuridique.findMany({
    orderBy: { code_statut: 'asc' }
  });
}

  // Detenteur Morale Endpoints
  @Post('detenteur-morale')
  createDetenteur(@Body() data) {
    return this.societeService.createDetenteur(data);
  }

 @Put('detenteur-morale/:id')
async updateDetenteur(
  @Param('id', ParseIntPipe) id: number,
  @Body() data: any
) {
  // Validate required fields
  if (!data.nom_fr || !data.nom_ar || !parseInt(data.statut_id, 10)) {
    throw new HttpException('Nom FR, Nom AR et Statut sont obligatoires', HttpStatus.BAD_REQUEST);
  }

  return this.societeService.updateDetenteur(id, {
    nom_fr: data.nom_fr,
    nom_ar: data.nom_ar,
    statut_id: parseInt(data.statut_id, 10),
    tel: data.tel || '',
    email: data.email || '',
    fax: data.fax || '',
    adresse: data.adresse || '',
    id_pays: data.id_pays ? parseInt(data.id_pays, 10) : undefined,
    id_nationalite: data.id_nationalite ? parseInt(data.id_nationalite, 10) : undefined,
  });
}

  // Demande Linking
  @Put('demande/:id/link-detenteur')
  async linkDetenteurToDemande(
    @Param('id', ParseIntPipe) id_demande: number,
    @Body('id_detenteur') id_detenteur: number
  ) {
    return this.prisma.demande.update({
      where: { id_demande },
      data: { id_detenteur }
    });
  }

  // Representant Legal Endpoints
  @Post('representant-legal')
  async createRepresentant(@Body() data) {
    if (!data.id_detenteur) {
      throw new HttpException('id_detenteur is required', HttpStatus.BAD_REQUEST);
    }
    const personne = await this.societeService.createPersonne(data);
    return this.societeService.linkFonction(
      personne.id_personne,
      data.id_detenteur,
      EnumTypeFonction.Representant,
      'Actif',
      parseFloat(data.taux_participation)
    );
  }

  @Put('representant-legal/:nin')
  async updateRepresentant(@Param('nin') nin: string, @Body() data: any) {
    if (!data.id_detenteur) {
      throw new HttpException('id_detenteur is required', HttpStatus.BAD_REQUEST);
    }
    return this.societeService.updateRepresentant(nin, data);
  }

  // Registre Commerce Endpoints
  @Post('registre-commerce')
  createRegistre(@Body() data) {
    if (!data.id_detenteur) {
      throw new HttpException('id_detenteur is required', HttpStatus.BAD_REQUEST);
    }
    return this.societeService.createRegistre(data.id_detenteur, data);
  }
@Put('registre-commerce/:id')
updateRegistre(
  @Param('id', ParseIntPipe) id_detenteur: number,
  @Body() data: any
) {
  return this.societeService.updateRegistre(id_detenteur, data);
}

  @Put('actionnaires/:id')
updateActionnaires(
  @Param('id', ParseIntPipe) id_detenteur: number,
  @Body('actionnaires') actionnaires: CreateActionnaireDto[]
) {
  // Validate that each actionnaire has required fields
  for (const [index, actionnaire] of actionnaires.entries()) {    
    if (!actionnaire.id_pays) {
      console.error(`Actionnaire ${index + 1} missing id_pays`);
      throw new HttpException(
        `L'actionnaire ${index + 1} doit avoir un pays sélectionné`,
        HttpStatus.BAD_REQUEST
      );
    }
  }
  
  return this.societeService.updateActionnaires(id_detenteur, actionnaires);
}

  // Actionnaires Endpoints
  @Post('actionnaires')
  createActionnaires(
    @Body('id_detenteur') id_detenteur: number,
    @Body('actionnaires') actionnaires: CreateActionnaireDto[]
  ) {
    return this.societeService.createActionnaires(id_detenteur, actionnaires);
  }

@Delete('actionnaires/:id_detenteur')
async deleteActionnaires(@Param('id_detenteur') id_detenteur: number) {
  return this.societeService.deleteActionnaires(+id_detenteur);
}

@Get('detenteur-morale/search')
async searchDetenteurs(@Query('q') query: string) {
  if (!query || query.length < 2) {
    throw new HttpException('Query must be at least 2 characters long', HttpStatus.BAD_REQUEST);
  }
  return this.societeService.searchDetenteurs(query);
}

// Add this endpoint to get complete detenteur data
@Get('detenteur-morale/:id')
async getDetenteurById(@Param('id', ParseIntPipe) id: number) {
  return this.societeService.getDetenteurById(id);
}

// Add this endpoint to get representant legal
@Get('representant-legal/:id_detenteur')
async getRepresentantLegal(@Param('id_detenteur', ParseIntPipe) id_detenteur: number) {
  return this.societeService.getRepresentantLegal(id_detenteur);
}

// Add this endpoint to get registre commerce
@Get('registre-commerce/:id_detenteur')
async getRegistreCommerce(@Param('id_detenteur', ParseIntPipe) id_detenteur: number) {
  return this.societeService.getRegistreCommerce(id_detenteur);
}

// Add this endpoint to get actionnaires
@Get('actionnaires/:id_detenteur')
async getActionnaires(@Param('id_detenteur', ParseIntPipe) id_detenteur: number) {
  return this.societeService.getActionnaires(id_detenteur);
}

// In your SocieteController
@Put('demande/:id_demande/associate-detenteur')
async associateDetenteurWithDemande(
  @Param('id_demande', ParseIntPipe) id_demande: number,
  @Body('id_detenteur', ParseIntPipe) id_detenteur: number
) {
  return this.societeService.associateDetenteurWithDemande(id_demande, id_detenteur);
}

}
