// admin_dossier_administratif.module.ts
import { Module } from '@nestjs/common';
import { DossierController } from './admin_dossier_administratif.controller';
import { DossierService } from './admin_dossier_administratif.service';
import { DocumentService } from './admin_document.service';
import { PrismaService } from '../prisma/prisma.service';
import { TypePermisController } from './type-permis.controller';
import { TypePermisService } from './type-permis.service';
import { TypeProcedureController } from './type-procedure.controller';
import { TypeProcedureService } from './type-procedure.service';
import { TypeDocController } from './type-doc.controller';
import { TypeDocService } from './type-doc.service';
@Module({
  controllers: [DossierController,TypeProcedureController,TypeDocController,TypePermisController],
  providers: [DossierService,TypePermisService, DocumentService,TypeProcedureService,TypeDocService, PrismaService],
})
export class AdminDossierModule {}
