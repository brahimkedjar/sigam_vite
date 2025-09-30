// src/procedure/procedure.module.ts
import { Module } from '@nestjs/common';
import { ProcedureController } from './generate_permis_pdf.controller';
import { DemandeSummaryController } from '../popup/popup.controller';
import { PdfGeneratorService } from './generate_permis_pdf.service';
import { PrismaService } from 'src/prisma/prisma.service';
@Module({
  controllers: [ProcedureController],
  providers: [DemandeSummaryController, PdfGeneratorService, PrismaService],
})
export class GeneratePdfModule {}
