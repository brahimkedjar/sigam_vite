import { Module } from '@nestjs/common';
import { SubstancesController } from './substances.controller';
import { SubstancesService } from './substances.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SubstancesController],
  providers: [SubstancesService, PrismaService],
})
export class SubstancesModule {}
