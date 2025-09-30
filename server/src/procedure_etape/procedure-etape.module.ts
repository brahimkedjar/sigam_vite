import { Module } from '@nestjs/common';
import { ProcedureEtapeController } from './procedure-etape.controller';
import { ProcedureEtapeService } from './procedure-etape.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ProcedureEtapeController],
  providers: [ProcedureEtapeService, PrismaService],
})
export class ProcedureEtapeModule {}
