import { Controller, Get, Param, ParseIntPipe, Post, Body, Put } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { Response } from 'express';
import { Res } from '@nestjs/common';

@Controller('api')
export class DocumentsController {
  constructor(private readonly service: DocumentsService) {}

  @Get('procedure/:id_demande/documents')
  async getDocs(@Param('id_demande', ParseIntPipe) id_demande: number) {
    return this.service.getDocumentsByDemande(id_demande);
  }
  
  @Post('demande/:id_demande/dossier-fournis')
  async createOrUpdateDossierFournis(
    @Param('id_demande', ParseIntPipe) id_demande: number,
    @Body() body: { 
      documents: { 
        id_doc: number; 
        status: 'present' | 'manquant'; 
        file_url?: string 
      }[],
      remarques?: string
    }
  ) {
    return this.service.createOrUpdateDossierFournis(
      id_demande, 
      body.documents, 
      body.remarques
    );
  }

 @Put('demande/:id_demande/status')
async updateDemandeStatus(
  @Param('id_demande', ParseIntPipe) id_demande: number,
  @Body() body: { statut_demande: 'ACCEPTEE' | 'REJETEE'; rejectionReason?: string; motif_rejet?: string }
) {
  const reason = body.rejectionReason ?? body.motif_rejet;
  return this.service.updateDemandeStatus(
    id_demande,
    body.statut_demande,
    reason
  );
}

  @Get('demande/:id_demande/letters')
  async getLetters(@Param('id_demande', ParseIntPipe) id_demande: number) {
    return this.service.generateLetters(id_demande);
  }

  // Alias route to be tolerant with existing client patterns
  @Get('procedure/:id_demande/letters')
  async getLettersAlias(@Param('id_demande', ParseIntPipe) id_demande: number) {
    return this.service.generateLetters(id_demande);
  }

  @Get('demande/:id_demande/recepisse.pdf')
  async downloadRecepisse(
    @Param('id_demande', ParseIntPipe) id_demande: number,
    @Res() res: Response,
  ) {
    const { buffer, filename } = await this.service.generateRecepissePdf(id_demande);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.end(buffer);
  }

  @Get('demande/:id_demande/mise-en-demeure.pdf')
  async downloadMiseEnDemeure(
    @Param('id_demande', ParseIntPipe) id_demande: number,
    @Res() res: Response,
  ) {
    const { buffer, filename } = await this.service.generateMiseEnDemeurePdf(id_demande);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.end(buffer);
  }
}
