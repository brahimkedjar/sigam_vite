import { Module } from '@nestjs/common';
import { SubstancesService } from './substances.service';
import { SubstancesController } from './substances.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [SubstancesController],
  providers: [SubstancesService, PrismaService],
})
export class SubstancesconfModule {}