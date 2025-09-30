import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProcedureEtapeService } from '../procedure_etape/procedure-etape.service';

import { TransfertService } from './transfert.service';
import { TransfertController } from './transfert.controller';

@Module({
  controllers: [TransfertController],
  providers: [TransfertService, PrismaService, ProcedureEtapeService],
})
export class TransfertModule {}
