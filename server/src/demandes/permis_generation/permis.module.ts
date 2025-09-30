import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GeneratePermisController } from './permis.controller';
import { GeneratePermisService } from './permis.service';
import { PdfGeneratorService } from './generate_permis_pdf.service';

@Module({
  controllers: [GeneratePermisController],
  providers: [GeneratePermisService,PdfGeneratorService, PrismaService]
})
export class GeneratePermisModule {}
