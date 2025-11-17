import { Module } from '@nestjs/common';
import { PhasesEtapesController } from './phases-etapes.controller';
import { PhasesEtapesService } from './phases-etapes.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [PhasesEtapesController],
  providers: [PhasesEtapesService, PrismaService],
})
export class PhasesEtapesConfigModule {}

