// src/procedure/procedure.controller.ts
import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { DemandeSummaryController } from '../popup/popup.controller';
import { PdfGeneratorService } from './generate_permis_pdf.service';

@Controller('api/procedure')
export class ProcedureController {
  constructor(
    private readonly procedureService: DemandeSummaryController,
    private readonly pdfService: PdfGeneratorService,
  ) {}

  @Get(':id/generate-pdf')
  async generatePermisPDF(
    @Param('id') id: string,
    @Query('lang') lang: 'fr' | 'ar' = 'fr',
    @Res() res: Response,
  ) {
    const procedureId = parseInt(id, 10);
    if (isNaN(procedureId)) {
      throw new NotFoundException('Invalid ID');
    }

const data = await this.procedureService.getFullDemandeSummaryByProc(procedureId);
    if (!data) {
      throw new NotFoundException('Procédure non trouvée');
    }

    try {
      const buffer = await this.pdfService.generatePdf(data);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename=permis-${data.code_demande}-${lang}.pdf`,
        'Content-Length': buffer.length,
      });

      res.send(buffer);
    } catch (error) {
      console.error('Erreur de génération du PDF:', error);
      throw new InternalServerErrorException('Impossible de générer le PDF');
    }
  }
}
