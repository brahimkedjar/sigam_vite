import { Module } from '@nestjs/common';
import { StatutsJuridiquesService } from './statuts-juridiques.service';
import { StatutsJuridiquesController } from './statuts-juridiques.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [StatutsJuridiquesController],
  providers: [StatutsJuridiquesService, PrismaService],
})
export class StatutsJuridiquesconfconfModule {}