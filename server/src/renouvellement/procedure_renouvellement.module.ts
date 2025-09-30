// src/procedures/procedure.module.ts
import { Module } from '@nestjs/common';
import { ProcedureRenouvellementController } from './procedure_renouvellement.controller';
import { ProcedureRenouvellementService } from './procedure_renouvellemnt.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { DemandeService } from 'src/demandes/demande/demande.service';
import { PaymentService } from 'src/demandes/paiement/payment.service';
import { ProcedureEtapeService } from '../procedure_etape/procedure-etape.service';

@Module({
  controllers: [ProcedureRenouvellementController],
  providers: [ProcedureRenouvellementService, PaymentService,ProcedureEtapeService
,PrismaService,DemandeService],
})
export class ProcedureRenouvellementModule {}
